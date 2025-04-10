
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { toast } from "@/hooks/use-toast";
import Leaderboard from "@/components/rankings/Leaderboard";
import StudentRankCard from "@/components/rankings/StudentRankCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CourseTimeline } from "@/types/supabase-extension";
import CourseTimelineDisplay from "@/components/timeline/CourseTimelineDisplay";
import { StudentProgressService } from "@/services/StudentProgressService";
import { RankingService } from "@/services/RankingService";

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  progress?: {
    completed: number;
    total: number;
  };
  activeSessions?: number;
}

interface Session {
  id: string;
  title: string;
  course_id: string;
  is_active: boolean;
  video_url: string;
  sequence_order: number;
  description: string | null;
}

interface StudentRank {
  student_id: string;
  name: string | null;
  email: string | null;
  student_code: string | null;
  total_points: number;
  sessions_completed: number;
  quizzes_completed: number;
  rank: number;
}

const StudentDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [topStudents, setTopStudents] = useState<StudentRank[]>([]);
  const [currentStudentRank, setCurrentStudentRank] = useState<StudentRank | null>(null);
  const [courseTimelines, setCourseTimelines] = useState<CourseTimeline[]>([]);
  const [courseData, setCourseData] = useState<Record<string, { title: string; description: string | null }>>({});
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user && user.role !== "student") {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      }
      return;
    }
    
    const fetchStudentData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        await RankingService.initializeStudentRanking(user.id);
        
        const { data: assignments, error: assignmentsError } = await supabase
          .from("course_assignments")
          .select("course_id")
          .eq("student_id", user.id);
          
        if (assignmentsError) {
          console.error("Error fetching assignments:", assignmentsError);
          toast({
            title: "Error",
            description: "Failed to fetch your course assignments",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        if (!assignments || assignments.length === 0) {
          setAssignedCourses([]);
          setLoading(false);
          return;
        }
        
        const courseIds = assignments.map(a => a.course_id);
        
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .in("id", courseIds);
          
        if (coursesError) {
          console.error("Error fetching courses:", coursesError);
          toast({
            title: "Error",
            description: "Failed to fetch course details",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Store course data in state for timeline display
        if (coursesData) {
          const courseDataMap: Record<string, { title: string; description: string | null }> = {};
          coursesData.forEach(course => {
            courseDataMap[course.id] = {
              title: course.title,
              description: course.description
            };
          });
          setCourseData(courseDataMap);
        }
        
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("sessions")
          .select("*")
          .in("course_id", courseIds);
          
        if (sessionsError) {
          console.error("Error fetching sessions:", sessionsError);
        }
        
        const { data: progressData, error: progressError } = await supabase
          .from("session_progress")
          .select("session_id")
          .eq("student_id", user.id);
          
        if (progressError) {
          console.error("Error fetching progress:", progressError);
        }
        
        const sessionsByCourse: Record<string, Session[]> = {};
        sessionsData?.forEach(session => {
          if (!sessionsByCourse[session.course_id]) {
            sessionsByCourse[session.course_id] = [];
          }
          sessionsByCourse[session.course_id].push({
            ...session,
            is_active: session.is_active !== undefined ? session.is_active : true
          });
        });
        
        const completedSessionIds = new Set(progressData?.map(p => p.session_id) || []);
        
        const coursesWithProgress = coursesData?.map(course => {
          const sessions = sessionsByCourse[course.id] || [];
          const activeSessions = sessions.filter(s => s.is_active);
          const completedCount = activeSessions.filter(s => completedSessionIds.has(s.id)).length;
          
          return {
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail_url: course.thumbnail_url,
            activeSessions: activeSessions.length,
            progress: {
              completed: completedCount,
              total: activeSessions.length || 1
            }
          };
        }) || [];
        
        setAssignedCourses(coursesWithProgress);
        
        // Fetch course timelines
        const { data: timelineData, error: timelineError } = await supabase
          .from("course_timeline")
          .select("*")
          .eq("student_id", user.id);
          
        if (timelineError) {
          console.error("Error fetching course timeline:", timelineError);
        } else {
          setCourseTimelines(timelineData || []);
        }
        
        const topRankedStudents = await RankingService.getTopStudents(10);
        setTopStudents(topRankedStudents);
        
        const currentStudent = topRankedStudents.find(s => s.student_id === user.id);
        
        if (currentStudent) {
          setCurrentStudentRank(currentStudent);
        } else {
          const { data: userRankData } = await supabase
            .from("student_rankings")
            .select(`
              student_id,
              total_points, 
              sessions_completed,
              quizzes_completed,
              profiles:student_id (name, email, student_code)
            `)
            .eq("student_id", user.id)
            .maybeSingle();
            
          if (userRankData) {
            const { count: higherRankedCount } = await supabase
              .from("student_rankings")
              .select("*", { count: "exact", head: true })
              .gt("total_points", userRankData.total_points);
              
            setCurrentStudentRank({
              student_id: userRankData.student_id,
              name: userRankData.profiles?.name,
              email: userRankData.profiles?.email,
              student_code: userRankData.profiles?.student_code,
              total_points: userRankData.total_points,
              sessions_completed: userRankData.sessions_completed,
              quizzes_completed: userRankData.quizzes_completed,
              rank: (higherRankedCount || 0) + 1
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast({
          title: "Error",
          description: "Failed to load your data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [user, isAuthenticated, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading your dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Learning Dashboard</h1>
        
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="timeline">Learning Path</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-1">
                {currentStudentRank && (
                  <StudentRankCard
                    rank={currentStudentRank.rank}
                    totalPoints={currentStudentRank.total_points}
                    sessionsCompleted={currentStudentRank.sessions_completed}
                    quizzesCompleted={currentStudentRank.quizzes_completed}
                  />
                )}
              </div>
              
              <div className="lg:col-span-3">
                {assignedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignedCourses.map((course) => (
                      <CourseCard 
                        key={course.id} 
                        course={course}
                        progress={course.progress}
                        activeSessions={course.activeSessions}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No courses assigned yet
                    </h3>
                    <p className="text-gray-500">
                      Your instructor will assign courses to you soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <CourseTimelineDisplay 
              courseTimelines={courseTimelines}
              courseData={courseData}
            />
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-1">
                <Card className="bg-purple-50 border-0 shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-purple-900 mb-4">Ranking System</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-800">How to earn points:</h4>
                        <ul className="mt-2 text-sm space-y-2">
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span>10 points for each completed session</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span>2 points for each correct quiz answer</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-800">Reaching top ranks:</h4>
                        <ul className="mt-2 text-sm space-y-2">
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span>Complete all sessions in your courses</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span>Take quizzes and answer questions correctly</span>
                          </li>
                        </ul>
                      </div>
                      
                      {currentStudentRank && (
                        <div className="mt-6 pt-4 border-t border-purple-200">
                          <p className="text-center text-purple-800 font-semibold">Your Current Rank</p>
                          <p className="text-center text-3xl font-bold text-purple-900">#{currentStudentRank.rank}</p>
                          <p className="text-center text-purple-700 mt-1">{currentStudentRank.total_points} Points</p>
                          {currentStudentRank.student_code && (
                            <p className="text-center text-purple-700 mt-1">Student ID: {currentStudentRank.student_code}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-3">
                <Leaderboard 
                  rankings={topStudents} 
                  currentUserId={user?.id} 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import CourseCard from "@/components/courses/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserCircle, CheckCircle, FileEdit, Trophy, UserPlus, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MultiAssignCourseForm from "@/components/courses/MultiAssignCourseForm";
import SessionsManager from "@/components/courses/SessionsManager";
import StudentsRankingTable from "@/components/students/StudentsRankingTable";
import QuizForm from "@/components/courses/QuizForm";
import AddCourseForm from "@/components/courses/AddCourseForm";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  sessions: Array<{
    id: string;
    is_active: boolean;
  }>;
  activeSessions: number;
}

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  phone?: string | null;
  student_code: string | null;
  assignedCourses: string[];
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

interface SessionProgress {
  session_id: string;
  student_id: string;
  completed_at: string;
}

const TeacherDashboard: React.FC = () => {
  const { user, isAuthenticated, isTeacher } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<'name' | 'code'>('name');
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courseAssignments, setCourseAssignments] = useState<any[]>([]);
  const [sessionProgress, setSessionProgress] = useState<SessionProgress[]>([]);
  const [studentRankings, setStudentRankings] = useState<StudentRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<{id: string; title: string} | null>(null);
  const [selectedSession, setSelectedSession] = useState<{id: string; title: string} | null>(null);
  const [showMultiAssign, setShowMultiAssign] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user?.role !== "teacher") {
      if (user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
      return;
    }
    
    fetchData();
  }, [user, isAuthenticated, navigate]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*");
        
      if (coursesError) {
        console.error("Error fetching courses:", coursesError);
        toast({
          title: "Error fetching courses",
          description: coursesError.message,
          variant: "destructive",
        });
      }
      
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("*");
        
      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
      }
      
      const processedCourses = coursesData?.map(course => {
        const courseSessions = sessionsData?.filter(s => s.course_id === course.id) || [];
        const sessionsWithActiveStatus = courseSessions.map(session => ({
          id: session.id,
          is_active: session.is_active !== undefined ? session.is_active : true
        }));
        const activeSessionsCount = courseSessions.filter(s => s.is_active !== false).length;
        
        return {
          ...course,
          sessions: sessionsWithActiveStatus,
          activeSessions: activeSessionsCount
        };
      }) || [];
      
      setCourses(processedCourses);
      
      const { data: studentsData, error: studentsError } = await supabase
        .from("profiles")
        .select("id, name, email, student_code")
        .eq("role", "student");
        
      if (studentsError) {
        console.error("Error fetching students:", studentsError);
      } else if (studentsData) {
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from("course_assignments")
          .select("*");
          
        if (assignmentsError) {
          console.error("Error fetching course assignments:", assignmentsError);
        }
        
        const { data: progressData, error: progressError } = await supabase
          .from("session_progress")
          .select("*");
          
        if (progressError) {
          console.error("Error fetching session progress:", progressError);
        } else if (progressData) {
          setSessionProgress(progressData);
        }
        
        const processedStudents: Student[] = studentsData.map(student => {
          const studentAssignments = assignmentsData?.filter(
            assignment => assignment.student_id === student.id
          ) || [];
          
          return {
            ...student,
            email: student.email,
            assignedCourses: studentAssignments.map(a => a.course_id)
          };
        });
        
        setStudents(processedStudents);
        setFilteredStudents(processedStudents);
        setCourseAssignments(assignmentsData || []);
      }
      
      const { data: rankingsData, error: rankingsError } = await supabase
        .from("student_rankings")
        .select(`
          student_id,
          total_points,
          sessions_completed,
          quizzes_completed,
          profiles:student_id (name, student_code)
        `)
        .order("total_points", { ascending: false });
        
      if (rankingsError) {
        console.error("Error fetching student rankings:", rankingsError);
      } else if (rankingsData) {
        const formattedRankings: StudentRank[] = rankingsData.map((ranking, index) => ({
          student_id: ranking.student_id,
          name: ranking.profiles?.name || null,
          email: null,
          student_code: ranking.profiles?.student_code || null,
          total_points: ranking.total_points,
          sessions_completed: ranking.sessions_completed,
          quizzes_completed: ranking.quizzes_completed,
          rank: index + 1
        }));
        
        setStudentRankings(formattedRankings);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!searchQuery) {
      setFilteredStudents(students);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    const filtered = students.filter(
      (student) => {
        if (searchType === 'code') {
          return student.student_code?.toLowerCase().includes(query);
        } else {
          return student.name?.toLowerCase().includes(query);
        }
      }
    );
    setFilteredStudents(filtered);
  }, [searchQuery, searchType, students]);
  
  const getCourseById = (id: string) => {
    return courses.find((course) => course.id === id)?.title || "Unknown Course";
  };
  
  const calculateStudentProgress = (student: Student) => {
    const studentCourseIds = student.assignedCourses || [];
    if (studentCourseIds.length === 0) return 0;
    
    const completedSessions = sessionProgress.filter(
      progress => progress.student_id === student.id
    ).length;
    
    return studentCourseIds.length > 0 ? 
      Math.round((completedSessions / studentCourseIds.length) * 100) : 0;
  };
  
  const handleManageSessions = (course: Course) => {
    setSelectedCourse({
      id: course.id,
      title: course.title
    });
  };
  
  const handleCreateQuiz = (sessionId: string, sessionTitle: string) => {
    setSelectedSession({
      id: sessionId,
      title: sessionTitle
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading dashboard data...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
        
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">All Courses</h2>
                <Button 
                  onClick={() => setShowAddCourse(true)} 
                  className="bg-academy-blue hover:bg-blue-600 text-white flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Course
                </Button>
              </div>
            </div>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="relative">
                    <CourseCard 
                      course={{
                        id: course.id,
                        title: course.title,
                        description: course.description,
                        thumbnail_url: course.thumbnail_url,
                        created_at: course.created_at,
                        sessions: course.sessions
                      }} 
                      activeSessions={course.activeSessions}
                    />
                    <Button 
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleManageSessions(course);
                      }}
                    >
                      <FileEdit className="h-4 w-4 mr-1" />
                      Sessions
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No courses available.</p>
                <Button 
                  onClick={() => setShowAddCourse(true)} 
                  className="mt-4 bg-academy-blue hover:bg-blue-600"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="students">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">All Students</h2>
                <Button
                  className="bg-academy-blue hover:bg-blue-600 text-white flex items-center"
                  onClick={() => setShowMultiAssign(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Course to Multiple Students
                </Button>
              </div>
              
              <div className="mb-6 space-y-3">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="search-by-name" 
                      name="search-type" 
                      checked={searchType === 'name'} 
                      onChange={() => setSearchType('name')} 
                    />
                    <label htmlFor="search-by-name">Search by name</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="search-by-code" 
                      name="search-type" 
                      checked={searchType === 'code'} 
                      onChange={() => setSearchType('code')} 
                    />
                    <label htmlFor="search-by-code">Search by student code</label>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={searchType === 'code' ? "Enter student code..." : "Search students by name..."}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {filteredStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <UserCircle className="h-12 w-12 text-gray-400 mr-4" />
                            <div>
                              <h3 className="font-semibold text-lg">
                                {student.name || "Unnamed Student"}
                                {student.student_code && (
                                  <span className="ml-2 text-sm text-gray-500 font-normal">
                                    (ID: {student.student_code})
                                  </span>
                                )}
                              </h3>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {calculateStudentProgress(student)}% Complete
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Assigned Courses:</h4>
                          <ul className="space-y-1">
                            {student.assignedCourses && student.assignedCourses.length > 0 ? (
                              student.assignedCourses.map((courseId) => (
                                <li key={courseId} className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  {getCourseById(courseId)}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500">No courses assigned</li>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No students found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rankings">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-yellow-500" /> 
                  Student Rankings
                </h2>
                <Button
                  onClick={fetchData}
                  variant="outline"
                  size="sm"
                >
                  Refresh Rankings
                </Button>
              </div>
              
              <div>
                <StudentsRankingTable students={studentRankings} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {showMultiAssign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full">
              <MultiAssignCourseForm
                onClose={() => setShowMultiAssign(false)}
                onAssignmentsUpdated={fetchData}
              />
            </div>
          </div>
        )}
        
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="max-w-4xl w-full my-8">
              <SessionsManager
                course={selectedCourse}
                onClose={() => setSelectedCourse(null)}
                onCreateQuiz={handleCreateQuiz}
              />
            </div>
          </div>
        )}
        
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="max-w-3xl w-full my-8">
              <QuizForm
                sessionId={selectedSession.id}
                sessionTitle={selectedSession.title}
                onClose={() => setSelectedSession(null)}
                onSuccess={() => {
                  setSelectedSession(null);
                  fetchData();
                }}
              />
            </div>
          </div>
        )}
        
        {showAddCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full">
              <AddCourseForm
                onClose={() => setShowAddCourse(false)}
                onCoursesUpdated={fetchData}
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TeacherDashboard;

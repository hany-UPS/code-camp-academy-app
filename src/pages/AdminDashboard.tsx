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
import { Search, UserCircle, CheckCircle, FileEdit, Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AddCourseForm from "@/components/courses/AddCourseForm";
import AssignCourseForm from "@/components/courses/AssignCourseForm";
import SessionsManager from "@/components/courses/SessionsManager";
import StudentsRankingTable from "@/components/students/StudentsRankingTable";
import QuizForm from "@/components/courses/QuizForm";
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

interface SessionData {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string;
  sequence_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  assignedCourses: string[];
}

interface StudentRank {
  student_id: string;
  name: string | null;
  email: string | null;
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

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courseAssignments, setCourseAssignments] = useState<any[]>([]);
  const [sessionProgress, setSessionProgress] = useState<SessionProgress[]>([]);
  const [studentRankings, setStudentRankings] = useState<StudentRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{id: string; name: string; assignedCourses: string[]} | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{id: string; title: string} | null>(null);
  const [selectedSession, setSelectedSession] = useState<{id: string; title: string} | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user?.role !== "admin") {
      navigate("/student-dashboard");
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
        .select("*")
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
        
        const processedStudents = studentsData.map(student => {
          const studentAssignments = assignmentsData?.filter(
            assignment => assignment.student_id === student.id
          ) || [];
          
          return {
            ...student,
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
          profiles:student_id (name, email)
        `)
        .order("total_points", { ascending: false });
        
      if (rankingsError) {
        console.error("Error fetching student rankings:", rankingsError);
      } else if (rankingsData) {
        const formattedRankings: StudentRank[] = rankingsData.map((ranking, index) => ({
          student_id: ranking.student_id,
          name: ranking.profiles?.name || null,
          email: ranking.profiles?.email || null,
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
    
    const filtered = students.filter(
      (student) =>
        (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.phone && student.phone.includes(searchQuery))
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);
  
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

  const handleEditAssignments = (student: Student) => {
    setSelectedStudent({
      id: student.id,
      name: student.name || "Unnamed Student",
      assignedCourses: student.assignedCourses || []
    });
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
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">All Courses</h2>
              <Button
                className="bg-academy-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => setShowAddCourse(true)}
              >
                Add New Course
              </Button>
            </div>
            
            {showAddCourse && (
              <div className="mb-6">
                <AddCourseForm 
                  onClose={() => setShowAddCourse(false)}
                  onCoursesUpdated={fetchData}
                />
              </div>
            )}
            
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
                <p className="text-gray-500">No courses available. Create your first course!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="students">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">All Students</h2>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search students by name or phone number..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                              <h3 className="font-semibold text-lg">{student.name || "Unnamed Student"}</h3>
                              <p className="text-gray-500 text-sm">{student.email || "No email"}</p>
                              <p className="text-gray-500 text-sm">{student.phone || "No phone"}</p>
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
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            onClick={() => handleEditAssignments(student)}
                            className="text-academy-blue hover:text-blue-700 text-sm font-medium"
                            variant="ghost"
                          >
                            Edit Assignments
                          </Button>
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
        
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full">
              <AssignCourseForm
                studentId={selectedStudent.id}
                studentName={selectedStudent.name}
                onClose={() => setSelectedStudent(null)}
                onAssignmentUpdated={fetchData}
                assignedCourseIds={selectedStudent.assignedCourses}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;

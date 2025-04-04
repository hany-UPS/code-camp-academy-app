
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
import { Search, UserCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define types for our data
interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  assignedCourses: string[];
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
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user?.role !== "admin") {
      navigate("/student-dashboard");
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch courses
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
        } else if (coursesData) {
          setCourses(coursesData);
        }
        
        // Fetch students (users with role 'student')
        const { data: studentsData, error: studentsError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "student");
          
        if (studentsError) {
          console.error("Error fetching students:", studentsError);
        } else if (studentsData) {
          // Fetch course assignments
          const { data: assignmentsData, error: assignmentsError } = await supabase
            .from("course_assignments")
            .select("*");
            
          if (assignmentsError) {
            console.error("Error fetching course assignments:", assignmentsError);
          }
          
          // Fetch session progress
          const { data: progressData, error: progressError } = await supabase
            .from("session_progress")
            .select("*");
            
          if (progressError) {
            console.error("Error fetching session progress:", progressError);
          } else if (progressData) {
            setSessionProgress(progressData);
          }
          
          // Process student data with their assigned courses
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
          setCourseAssignments(assignmentsData || []);
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
    
    fetchData();
  }, [user, isAuthenticated, navigate]);
  
  useEffect(() => {
    // Filter students based on search query (name or phone)
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
    // Get all sessions from courses assigned to this student
    const studentCourseIds = student.assignedCourses || [];
    if (studentCourseIds.length === 0) return 0;
    
    // Get completed sessions for this student
    const completedSessions = sessionProgress.filter(
      progress => progress.student_id === student.id
    ).length;
    
    // For simplicity, we'll calculate based on assignments rather than 
    // total possible sessions (which would require additional queries)
    return studentCourseIds.length > 0 ? 
      Math.round((completedSessions / studentCourseIds.length) * 100) : 0;
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
          </TabsList>
          
          <TabsContent value="courses">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">All Courses</h2>
              <button
                className="bg-academy-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => alert("Add course functionality would be implemented here")}
              >
                Add New Course
              </button>
            </div>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
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
                          <button className="text-academy-blue hover:text-blue-700 text-sm font-medium">
                            Edit Assignments
                          </button>
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
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;

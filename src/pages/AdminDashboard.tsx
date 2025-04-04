
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { mockCourses, mockStudents } from "@/data/mockData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import CourseCard from "@/components/courses/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserCircle, CheckCircle } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [courses] = useState(mockCourses);
  const [students] = useState(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState(students);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user?.role !== "admin") {
      navigate("/student-dashboard");
    }
  }, [user, isAuthenticated, navigate]);
  
  useEffect(() => {
    // Filter students based on search query (name or phone)
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone.includes(searchQuery)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);
  
  const getCourseById = (id: string) => {
    return courses.find((course) => course.id === id)?.title || "Unknown Course";
  };
  
  const calculateStudentProgress = (student: any) => {
    if (!student.progress.length) return 0;
    
    let completed = 0;
    let total = 0;
    
    student.progress.forEach((p: any) => {
      const course = courses.find((c) => c.id === p.courseId);
      if (course) {
        completed += p.sessionsCompleted.length;
        total += course.sessions.length;
      }
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <UserCircle className="h-12 w-12 text-gray-400 mr-4" />
                          <div>
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <p className="text-gray-500 text-sm">{student.email}</p>
                            <p className="text-gray-500 text-sm">{student.phone}</p>
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
                          {student.assignedCourses.map((courseId: string) => (
                            <li key={courseId} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {getCourseById(courseId)}
                            </li>
                          ))}
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
              
              {filteredStudents.length === 0 && (
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

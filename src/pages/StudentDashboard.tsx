
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { mockCourses, mockStudents } from "@/data/mockData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/courses/CourseCard";

const StudentDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [assignedCourses, setAssignedCourses] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user && user.role !== "student") {
      navigate("/admin-dashboard");
      return;
    }
    
    // Find the current user in mock data
    const studentData = mockStudents.find((student) => student.email === user?.email);
    
    if (studentData) {
      // Get assigned courses
      const courses = mockCourses
        .filter((course) => studentData.assignedCourses.includes(course.id))
        .map((course) => {
          // Find progress for this course
          const courseProgress = studentData.progress.find(
            (p) => p.courseId === course.id
          );
          
          return {
            ...course,
            progress: {
              completed: courseProgress ? courseProgress.sessionsCompleted.length : 0,
              total: course.sessions.length,
            },
          };
        });
      
      setAssignedCourses(courses);
    }
  }, [user, isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">My Courses</h2>
          </div>
          
          {assignedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  progress={course.progress} 
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
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;

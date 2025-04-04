
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { toast } from "@/hooks/use-toast";

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
}

const StudentDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user && user.role !== "student") {
      navigate("/admin-dashboard");
      return;
    }
    
    const fetchStudentCourses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get the course assignments for this student
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
        
        // Get course details
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
        
        // Get all sessions for these courses
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("sessions")
          .select("*")
          .in("course_id", courseIds);
          
        if (sessionsError) {
          console.error("Error fetching sessions:", sessionsError);
        }
        
        // Get student progress for completed sessions
        const { data: progressData, error: progressError } = await supabase
          .from("session_progress")
          .select("session_id")
          .eq("student_id", user.id);
          
        if (progressError) {
          console.error("Error fetching progress:", progressError);
        }
        
        // Group sessions by course
        const sessionsByCourse: Record<string, Session[]> = {};
        sessionsData?.forEach(session => {
          if (!sessionsByCourse[session.course_id]) {
            sessionsByCourse[session.course_id] = [];
          }
          sessionsByCourse[session.course_id].push(session);
        });
        
        // Create completed sessions set for easy lookup
        const completedSessionIds = new Set(progressData?.map(p => p.session_id) || []);
        
        // Map course data with progress
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast({
          title: "Error",
          description: "Failed to load your courses",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchStudentCourses();
  }, [user, isAuthenticated, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading your courses...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
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
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;

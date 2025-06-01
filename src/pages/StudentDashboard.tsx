import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LeaderboardCard } from "@/components/dashboard/LeaderboardCard";
import { ProgressGraph } from "@/components/dashboard/ProgressGraph";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, ensureValidRole } from "@/lib/supabase";
import { Course, Profile } from "@/types/supabase";
import { Award, BookOpen, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

import { Database } from '@/types/supabase';

type SupabaseStudentCourse = Database['public']['Tables']['student_courses']['Row'];

type StudentCourse = SupabaseStudentCourse & {
  hide_new_sessions?: boolean;
};

type SubscriptionData = {
  id: string;
  remaining_sessions: number;
  total_sessions: number;
  plan_duration_months: number;
  warning: boolean;
  course_title: string;
};

const StudentDashboard = () => {
  const { profile, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<{course: Course, studentCourse: StudentCourse}[]>([]);
  const [topStudents, setTopStudents] = useState<Profile[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    completedSessions: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    console.log("StudentDashboard useEffect triggered");
    console.log("Auth loading:", authLoading);
    console.log("User:", user);
    console.log("Profile:", profile);
    console.log("Data fetched:", dataFetched);

    if (authLoading || dataFetched) {
      console.log("Skipping fetch - auth loading or data already fetched");
      return;
    }

    if (!user) {
      console.log("No user found");
      setError("Please sign in to view your dashboard");
      setLoading(false);
      return;
    }

    if (!profile) {
      console.log("No profile found, waiting...");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        console.log("Starting dashboard data fetch for user:", user.id);
        setLoading(true);
        setError(null);
        
        console.log("Fetching enrolled courses for profile:", profile.id);
        const { data: enrolledCoursesData, error: enrolledError } = await supabase
          .from('student_courses')
          .select(`
            *,
            course:courses(*)
          `)
          .eq('student_id', profile.id);
        
        if (enrolledError) {
          console.error("Error fetching enrolled courses:", enrolledError);
          throw enrolledError;
        }
        
        console.log("Enrolled courses data:", enrolledCoursesData);
        
        const formattedCourses = (enrolledCoursesData || [])
          .filter(data => data.course)
          .map(data => ({
            course: data.course as Course,
            studentCourse: {
              id: data.id,
              student_id: data.student_id,
              course_id: data.course_id,
              progress: data.progress || 0,
              assigned_at: data.assigned_at,
              assigned_by: data.assigned_by,
              completed_at: data.completed_at,
              hide_new_sessions: data.hide_new_sessions || false,
            } as StudentCourse
          }));
        
        setCourses(formattedCourses);
        
        setStats({
          totalCourses: formattedCourses.length,
          completedCourses: formattedCourses.filter(c => 
            c.course.total_sessions > 0 && c.studentCourse.progress >= c.course.total_sessions
          ).length,
          completedSessions: formattedCourses.reduce((acc, curr) => 
            acc + (curr.studentCourse.progress || 0), 0
          ),
          totalPoints: profile.total_points || 0,
        });
        
        // Fetch subscription data
        console.log("Fetching subscription data for profile:", profile.id);
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('student_course_subscription')
          .select(`
            *,
            student_course:student_courses(
              course:courses(title)
            )
          `)
          .eq('student_course.student_id', profile.id);

        if (subscriptionError) {
          console.error("Error fetching subscriptions:", subscriptionError);
        } else {
          console.log("Subscription data:", subscriptionData);
          const formattedSubscriptions = (subscriptionData || [])
            .filter(sub => sub.student_course?.course)
            .map(sub => ({
              id: sub.id,
              remaining_sessions: sub.remaining_sessions,
              total_sessions: sub.total_sessions,
              plan_duration_months: sub.plan_duration_months,
              warning: sub.warning,
              course_title: sub.student_course.course.title
            }));
          setSubscriptions(formattedSubscriptions);
        }
        
        console.log("Fetching top students");
        const { data: studentsData, error: studentsError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'student')
          .order('total_points', { ascending: false })
          .limit(5);
        
        if (studentsError) {
          console.error("Error fetching top students:", studentsError);
        } else {
          console.log("Top students data:", studentsData);
          const typedStudents = (studentsData || []).map(student => ({
            ...student,
            role: ensureValidRole(student.role)
          }));
          setTopStudents(typedStudents);
        }
        
        setDataFetched(true);
        console.log("Dashboard data fetch completed successfully");
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`Failed to load dashboard: ${errorMessage}`);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [profile, user, authLoading, dataFetched, toast]);
  
  const progressData = courses.map(({ course, studentCourse }) => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
    completed: studentCourse.progress || 0,
    total: course.total_sessions || 0,
  }));

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-academy-blue border-r-transparent border-b-academy-orange border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => {
              setError(null);
              setDataFetched(false);
              setLoading(true);
            }}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {profile?.name}!</h1>
              <p className="text-muted-foreground">Here's an overview of your learning progress</p>
            </div>
             <div className="px-4 py-2">
              <Link to="/StudentCertificatespage">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <Award className="w-4 h-4" />
                  My Certificates
                </button>
              </Link>
              </div>

        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            colorVariant="blue"
          />
          <StatsCard 
            title="Completed Courses"
            value={stats.completedCourses}
            icon={CheckCircle}
            colorVariant="green"
          />
          <StatsCard 
            title="Completed Sessions"
            value={stats.completedSessions}
            icon={Clock}
            colorVariant="orange"
          />
          <StatsCard 
            title="Total Points"
            value={stats.totalPoints}
            icon={Award}
            colorVariant="purple"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProgressGraph 
            data={progressData}
            className="lg:col-span-2"
          />
          <LeaderboardCard students={topStudents} />
        </div>

        {/* Add subscription status section */}
        <SubscriptionCard subscriptions={subscriptions} />
        
        <div>
          <h2 className="text-xl font-bold mb-4">Your Courses</h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(({ course, studentCourse }) => (
                <div key={course.id} className="relative">
                  <CourseCard 
                    course={course}
                    studentCourse={studentCourse}
                  />
                  {studentCourse.hide_new_sessions && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center text-white p-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold mb-2">Course Temporarily Locked</h3>
                        <p className="text-sm text-white/80">
                          This course has been temporarily restricted by an administrator. 
                          Please contact your instructor for more information.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="font-medium text-gray-900 mb-1">No courses yet</h3>
              <p className="text-gray-600">
                You are not enrolled in any courses yet. Browse available courses to get started.
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

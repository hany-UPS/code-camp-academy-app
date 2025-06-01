
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Tables } from '@/integrations/supabase/types';
import { Progress } from "@/components/ui/progress";


import { Database } from '@/types/supabase';

type SupabaseStudentCourse = Database['public']['Tables']['student_courses']['Row'];

type StudentCourse = SupabaseStudentCourse & {
  hide_new_sessions?: boolean; // ✅ extend locally
};

type Course = Tables<'courses'>;

interface CourseCardProps {
  course: Course;
  studentCourse?: StudentCourse;
}

export function CourseCard({ course, studentCourse }: CourseCardProps) {
  const progress = studentCourse?.progress || 0;
  const totalSessions = course.total_sessions || 0;
  const progressPercentage = totalSessions > 0 ? Math.round((progress / totalSessions) * 100) : 0;
  const isCompleted = totalSessions > 0 && progress === totalSessions;
  const isLocked = studentCourse?.hide_new_sessions || false;
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-academy-blue to-academy-orange p-4">
        <CardTitle className="text-white truncate">{course.title}</CardTitle>
        <CardDescription className="text-white/80">
          {course.total_sessions} {course.total_sessions === 1 ? 'session' : 'sessions'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {course.description || "No description provided"}
        </p>
        {studentCourse && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {isCompleted && (
              <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                Completed
              </Badge>
            )}
            {isLocked && (
              <Badge className="mt-2 bg-red-100 text-red-800 hover:bg-red-100">
                Temporarily Locked
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        {isLocked ? (
          <Button disabled variant="secondary">
            Course Locked
          </Button>
        ) : (
          <Button asChild>
            <Link to={`/courses/${course.id}`}>
              {studentCourse ? (isCompleted ? "Review Course" : "Continue Learning") : "Enroll Now"}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Create a wrapper component that adds admin functionality
export function AdminCourseCardWrapper({ courseId, children }: { courseId: string, children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Button 
          className="bg-academy-blue hover:bg-blue-600"
          asChild
        >
          <Link to={`/admin/courses/${courseId}`}>
            Manage Course
          </Link>
        </Button>
      </div>
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Award, BookOpen, CheckCircle, Clock } from "lucide-react";
import { CourseTimeline } from "@/types/supabase-extension";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

interface TimelineProps {
  courseTimelines: CourseTimeline[];
  courseData: Record<string, { title: string; description: string | null }>;
}

const STATUS_COLORS = {
  'not_started': 'bg-gray-200',
  'in_progress': 'bg-blue-200',
  'sessions_completed': 'bg-yellow-200',
  'completed': 'bg-green-200'
};

const STATUS_ICONS = {
  'not_started': Clock,
  'in_progress': BookOpen,
  'sessions_completed': CheckCircle,
  'completed': Award
};

const STATUS_LABELS = {
  'not_started': 'Not Started',
  'in_progress': 'In Progress',
  'sessions_completed': 'Sessions Completed',
  'completed': 'Completed'
};

const CourseTimelineDisplay: React.FC<TimelineProps> = ({ courseTimelines, courseData }) => {
  // Sort courses by status and date
  const sortedTimelines = [...courseTimelines].sort((a, b) => {
    // First by status priority (completed last)
    const statusPriority = {
      'not_started': 1,
      'in_progress': 2,
      'sessions_completed': 3,
      'completed': 4
    };
    
    const statusA = statusPriority[a.status];
    const statusB = statusPriority[b.status];
    
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    
    // Then by date (newer first for in-progress, older first for completed)
    if (a.status === 'completed' && b.status === 'completed') {
      return new Date(b.completion_date || b.updated_at).getTime() - 
             new Date(a.completion_date || a.updated_at).getTime();
    }
    
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });

  if (sortedTimelines.length === 0) {
    return (
      <Card className="my-6">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No courses assigned yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-6">My Learning Path</h2>
      
      {/* Horizontal Timeline */}
      <div className="relative hidden md:block mb-12">
        <div className="absolute h-1 bg-gray-200 w-full top-5"></div>
        <div className="flex justify-between relative">
          {sortedTimelines.map((timeline, index) => {
            const StatusIcon = STATUS_ICONS[timeline.status];
            const courseTitle = courseData[timeline.course_id]?.title || 'Unknown Course';
            const dateToShow = timeline.status === 'completed' 
              ? timeline.completion_date 
              : timeline.start_date;
            
            return (
              <div 
                key={timeline.id} 
                className="flex flex-col items-center text-center"
                style={{ width: `${100 / sortedTimelines.length}%` }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white z-10",
                  timeline.status === 'completed' ? 'bg-green-500' : 
                  timeline.status === 'sessions_completed' ? 'bg-yellow-500' : 
                  timeline.status === 'in_progress' ? 'bg-blue-500' : 
                  'bg-gray-500'
                )}>
                  <StatusIcon size={20} />
                </div>
                <p className="mt-3 font-medium text-sm">
                  {courseTitle.length > 15 ? `${courseTitle.substring(0, 15)}...` : courseTitle}
                </p>
                <p className="text-xs text-gray-500">
                  {STATUS_LABELS[timeline.status]}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {dateToShow ? format(new Date(dateToShow), 'MMM d, yyyy') : ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Vertical Timeline for mobile */}
      <div className="md:hidden space-y-4">
        {sortedTimelines.map((timeline, index) => {
          const StatusIcon = STATUS_ICONS[timeline.status];
          const courseTitle = courseData[timeline.course_id]?.title || 'Unknown Course';
          const courseDescription = courseData[timeline.course_id]?.description;
          const dateToShow = timeline.status === 'completed' 
            ? timeline.completion_date 
            : timeline.start_date;
          
          return (
            <div key={timeline.id} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white",
                  timeline.status === 'completed' ? 'bg-green-500' : 
                  timeline.status === 'sessions_completed' ? 'bg-yellow-500' : 
                  timeline.status === 'in_progress' ? 'bg-blue-500' : 
                  'bg-gray-500'
                )}>
                  <StatusIcon size={20} />
                </div>
                {index < sortedTimelines.length - 1 && (
                  <div className="w-0.5 grow bg-gray-300 my-1"></div>
                )}
              </div>
              <div className="flex-1">
                <Card className={cn(
                  "border-l-4",
                  timeline.status === 'completed' ? 'border-l-green-500' : 
                  timeline.status === 'sessions_completed' ? 'border-l-yellow-500' : 
                  timeline.status === 'in_progress' ? 'border-l-blue-500' : 
                  'border-l-gray-500'
                )}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{courseTitle}</h3>
                    <p className="text-sm text-gray-500">
                      {STATUS_LABELS[timeline.status]}
                    </p>
                    {dateToShow && (
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(dateToShow), 'MMM d, yyyy')}
                      </p>
                    )}
                    {courseDescription && (
                      <p className="text-sm text-gray-600 mt-2">{courseDescription}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Cards view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {sortedTimelines.map((timeline) => {
          const StatusIcon = STATUS_ICONS[timeline.status];
          const courseTitle = courseData[timeline.course_id]?.title || 'Unknown Course';
          const courseDescription = courseData[timeline.course_id]?.description;
          
          return (
            <Card key={timeline.id} className={cn(
              "border-t-4",
              timeline.status === 'completed' ? 'border-t-green-500' : 
              timeline.status === 'sessions_completed' ? 'border-t-yellow-500' : 
              timeline.status === 'in_progress' ? 'border-t-blue-500' : 
              'border-t-gray-500'
            )}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{courseTitle}</CardTitle>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white",
                    timeline.status === 'completed' ? 'bg-green-500' : 
                    timeline.status === 'sessions_completed' ? 'bg-yellow-500' : 
                    timeline.status === 'in_progress' ? 'bg-blue-500' : 
                    'bg-gray-500'
                  )}>
                    <StatusIcon size={16} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Status: {STATUS_LABELS[timeline.status]}
                </p>
                
                {timeline.status === 'completed' && timeline.completion_date && (
                  <p className="text-xs text-gray-500 mb-2">
                    Completed on {format(new Date(timeline.completion_date), 'MMMM d, yyyy')}
                  </p>
                )}
                
                {timeline.start_date && timeline.status !== 'completed' && (
                  <p className="text-xs text-gray-500 mb-2">
                    Started on {format(new Date(timeline.start_date), 'MMMM d, yyyy')}
                  </p>
                )}
                
                {courseDescription && (
                  <p className="text-sm text-gray-600 mt-2">{courseDescription}</p>
                )}
                
                <div className="mt-4">
                  <a 
                    href={`/courses/${timeline.course_id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Go to course <ArrowRight size={14} className="ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CourseTimelineDisplay;

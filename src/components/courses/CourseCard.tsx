
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";

interface CourseCardProps {
  course: Course;
  progress?: {
    completed: number;
    total: number;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progress }) => {
  const { id, title, description, thumbnail, sessions, createdAt } = course;
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer">
      <Link to={`/courses/${id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader className="pb-1">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg text-left font-bold text-gray-800">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-gray-600 line-clamp-2 text-left">
            {description}
          </p>
          
          <div className="flex items-center mt-3 text-xs text-gray-500 space-x-3">
            <div className="flex items-center">
              <BookOpen size={14} className="mr-1" />
              <span>{sessions.length} sessions</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>Added {formattedDate}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full">
            {progress && (
              <>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-gray-600">{progress.completed} of {progress.total} completed</span>
                  <span className="font-medium">
                    {Math.round((progress.completed / progress.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-academy-blue rounded-full h-2" 
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>
              </>
            )}
            {!progress && (
              <Badge variant="outline" className="bg-academy-light-blue text-academy-blue border-academy-blue">
                New Course
              </Badge>
            )}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default CourseCard;

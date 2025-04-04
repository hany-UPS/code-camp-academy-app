
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Course {
  id: string;
  title: string;
}

interface AssignCourseFormProps {
  studentId: string;
  studentName: string;
  onClose: () => void;
  onAssignmentUpdated: () => void;
  assignedCourseIds: string[];
}

const AssignCourseForm: React.FC<AssignCourseFormProps> = ({ 
  studentId, 
  studentName, 
  onClose, 
  onAssignmentUpdated,
  assignedCourseIds = []
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set(assignedCourseIds));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("id, title")
          .order("title");
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setCourses(data);
        }
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const handleToggleCourse = (courseId: string) => {
    const newSelectedCourses = new Set(selectedCourses);
    if (newSelectedCourses.has(courseId)) {
      newSelectedCourses.delete(courseId);
    } else {
      newSelectedCourses.add(courseId);
    }
    setSelectedCourses(newSelectedCourses);
  };

  const handleSaveAssignments = async () => {
    setIsSaving(true);
    
    try {
      // First, delete all existing assignments for this student
      const { error: deleteError } = await supabase
        .from("course_assignments")
        .delete()
        .eq("student_id", studentId);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Now insert new assignments
      if (selectedCourses.size > 0) {
        const assignments = Array.from(selectedCourses).map(courseId => ({
          student_id: studentId,
          course_id: courseId,
        }));
        
        const { error: insertError } = await supabase
          .from("course_assignments")
          .insert(assignments);
        
        if (insertError) {
          throw insertError;
        }
      }
      
      toast({
        title: "Success",
        description: "Course assignments updated successfully",
        variant: "default",
      });
      
      onAssignmentUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error saving assignments:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update assignments",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Assign Courses to {studentName}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}><X size={18} /></Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Assign</TableHead>
                  <TableHead>Course Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedCourses.has(course.id)}
                          onCheckedChange={() => handleToggleCourse(course.id)}
                        />
                      </TableCell>
                      <TableCell>{course.title}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No courses available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAssignments}
                disabled={isSaving}
                className="bg-academy-orange hover:bg-orange-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  "Save Assignments"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignCourseForm;

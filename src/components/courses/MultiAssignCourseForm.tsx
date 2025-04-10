
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, X, Check, AlertCircle, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Student {
  id: string;
  name: string | null;
  student_code: string | null;
}

interface Course {
  id: string;
  title: string;
}

interface MultiAssignCourseFormProps {
  onClose: () => void;
  onAssignmentsUpdated: () => void;
}

const MultiAssignCourseForm: React.FC<MultiAssignCourseFormProps> = ({ 
  onClose, 
  onAssignmentsUpdated
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchType, setSearchType] = useState<'name' | 'code'>('name');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from("profiles")
          .select("id, name, student_code")
          .eq("role", "student")
          .order("name");
        
        if (studentsError) {
          throw studentsError;
        }
        
        setStudents(studentsData || []);
        setFilteredStudents(studentsData || []);
        
        // Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("id, title")
          .order("title");
        
        if (coursesError) {
          throw coursesError;
        }
        
        setCourses(coursesData || []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load students and courses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredStudents(students);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    const filtered = students.filter(
      (student) => {
        if (searchType === 'code') {
          return student.student_code?.toLowerCase().includes(query);
        } else {
          return student.name?.toLowerCase().includes(query);
        }
      }
    );
    setFilteredStudents(filtered);
  }, [searchQuery, searchType, students]);

  const toggleStudentSelection = (studentId: string) => {
    const newSelectedStudents = new Set(selectedStudents);
    if (newSelectedStudents.has(studentId)) {
      newSelectedStudents.delete(studentId);
    } else {
      newSelectedStudents.add(studentId);
    }
    setSelectedStudents(newSelectedStudents);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      // If all are selected, clear selection
      setSelectedStudents(new Set());
    } else {
      // Select all filtered students
      const allIds = new Set(filteredStudents.map(student => student.id));
      setSelectedStudents(allIds);
    }
  };

  const handleSaveAssignments = async () => {
    if (!selectedCourse || selectedStudents.size === 0) {
      toast({
        title: "Missing selection",
        description: "Please select both a course and at least one student",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare assignments data
      const assignments = Array.from(selectedStudents).map(studentId => ({
        student_id: studentId,
        course_id: selectedCourse,
      }));
      
      // Check for existing assignments to avoid duplicates
      const { data: existingAssignments, error: checkError } = await supabase
        .from("course_assignments")
        .select("student_id")
        .eq("course_id", selectedCourse)
        .in("student_id", Array.from(selectedStudents));
        
      if (checkError) {
        throw checkError;
      }
      
      // Filter out already assigned students
      const existingStudentIds = new Set(existingAssignments?.map(a => a.student_id) || []);
      const newAssignments = assignments.filter(a => !existingStudentIds.has(a.student_id));
      
      if (newAssignments.length === 0) {
        toast({
          title: "No changes needed",
          description: "All selected students are already assigned to this course",
        });
        onClose();
        return;
      }
      
      // Insert new assignments
      const { error: insertError } = await supabase
        .from("course_assignments")
        .insert(newAssignments);
      
      if (insertError) {
        throw insertError;
      }
      
      toast({
        title: "Success",
        description: `Course assigned to ${newAssignments.length} student(s)`,
        variant: "default",
      });
      
      onAssignmentsUpdated();
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Assign Course to Multiple Students</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}><X size={18} /></Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {/* Course selection */}
              <div>
                <h3 className="font-medium mb-3">1. Select a Course</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {courses.map(course => (
                    <div 
                      key={course.id} 
                      className={`p-3 border rounded-md cursor-pointer transition-colors
                                ${selectedCourse === course.id ? 
                                  'bg-blue-50 border-blue-300' : 
                                  'hover:bg-gray-50'}`}
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <div className="flex items-center gap-2">
                        {selectedCourse === course.id && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                        <span className={selectedCourse === course.id ? 'font-medium' : ''}>
                          {course.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Student selection */}
              <div>
                <h3 className="font-medium mb-3">2. Select Students</h3>
                
                <div className="mb-3 space-y-2">
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="search-by-name" 
                        name="search-type" 
                        checked={searchType === 'name'} 
                        onChange={() => setSearchType('name')} 
                      />
                      <label htmlFor="search-by-name">Search by name</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="search-by-code" 
                        name="search-type" 
                        checked={searchType === 'code'} 
                        onChange={() => setSearchType('code')} 
                      />
                      <label htmlFor="search-by-code">Search by student code</label>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={searchType === 'code' ? "Enter student code..." : "Search students..."}
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-2 flex items-center">
                  <Checkbox 
                    id="select-all"
                    checked={selectedStudents.size > 0 && selectedStudents.size === filteredStudents.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label htmlFor="select-all" className="ml-2 text-sm cursor-pointer">
                    {selectedStudents.size === 0 ? "Select all" : 
                     selectedStudents.size === filteredStudents.length ? "Deselect all" : 
                     "Select all filtered"}
                  </label>
                  <div className="ml-auto text-sm text-gray-500">
                    {selectedStudents.size} student(s) selected
                  </div>
                </div>
                
                {filteredStudents.length > 0 ? (
                  <div className="border rounded-md overflow-hidden max-h-60 overflow-y-auto">
                    <Table>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow 
                            key={student.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleStudentSelection(student.id)}
                          >
                            <TableCell className="w-10 p-2">
                              <Checkbox 
                                checked={selectedStudents.has(student.id)}
                                onCheckedChange={() => {}} // Handled by row click
                              />
                            </TableCell>
                            <TableCell>
                              {student.name || "Unnamed Student"} 
                              {student.student_code && <span className="ml-2 text-sm text-gray-500">(ID: {student.student_code})</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 border rounded-md">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p>No students found</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAssignments}
                disabled={isSaving || !selectedCourse || selectedStudents.size === 0}
                className="bg-academy-orange hover:bg-orange-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  "Assign Course"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiAssignCourseForm;

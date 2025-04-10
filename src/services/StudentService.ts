
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Student {
  id: string;
  name: string | null;
  email: string | null;
  student_code: string | null;
}

export class StudentService {
  /**
   * Fetch students by name or student code
   */
  static async fetchStudents(searchQuery: string, searchType: 'name' | 'code' = 'name'): Promise<Student[]> {
    try {
      const field = searchType === 'code' ? 'student_code' : 'name';
      
      // Use ilike for case-insensitive search with wildcards
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, student_code')
        .eq('role', 'student')
        .ilike(field, `%${searchQuery}%`)
        .order('name');
        
      if (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: "Failed to fetch students",
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in fetchStudents:", error);
      return [];
    }
  }

  /**
   * Fetch all students
   */
  static async fetchAllStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, student_code')
        .eq('role', 'student')
        .order('name');
        
      if (error) {
        console.error("Error fetching all students:", error);
        toast({
          title: "Error",
          description: "Failed to fetch students",
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in fetchAllStudents:", error);
      return [];
    }
  }
}

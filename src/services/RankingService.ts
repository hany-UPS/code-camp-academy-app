
import { supabase } from "@/integrations/supabase/client";
import { StudentRanking } from "@/types/supabase-extension";

export class RankingService {
  /**
   * Initialize or update student ranking
   */
  static async updateStudentRanking(studentId: string): Promise<void> {
    try {
      // First check if student has a ranking
      const { data: existingRank, error: checkError } = await supabase
        .from('student_rankings')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking student ranking:", checkError);
        return;
      }

      // Count completed sessions
      const { count: sessionsCount, error: sessionsError } = await supabase
        .from('session_progress')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId);

      if (sessionsError) {
        console.error("Error counting sessions:", sessionsError);
        return;
      }

      // Get quiz points
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_submissions')
        .select('score')
        .eq('student_id', studentId);

      if (quizError) {
        console.error("Error fetching quiz submissions:", quizError);
        return;
      }

      const quizPoints = quizData?.reduce((sum, quiz) => sum + quiz.score, 0) || 0;
      const sessionPoints = (sessionsCount || 0) * 10; // 10 points per session
      const totalPoints = sessionPoints + quizPoints;

      if (!existingRank) {
        // Create new ranking
        const { error: insertError } = await supabase
          .from('student_rankings')
          .insert({
            student_id: studentId,
            total_points: totalPoints,
            sessions_completed: sessionsCount || 0,
            quizzes_completed: quizData?.length || 0
          });

        if (insertError) {
          console.error("Error creating student ranking:", insertError);
        }
      } else {
        // Update existing ranking
        const { error: updateError } = await supabase
          .from('student_rankings')
          .update({
            total_points: totalPoints,
            sessions_completed: sessionsCount || 0,
            quizzes_completed: quizData?.length || 0,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId);

        if (updateError) {
          console.error("Error updating student ranking:", updateError);
        }
      }
    } catch (error) {
      console.error("Error in updateStudentRanking:", error);
    }
  }

  /**
   * Initialize student ranking if it doesn't exist yet
   */
  static async initializeStudentRanking(studentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("student_rankings")
        .select("student_id")
        .eq("student_id", studentId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking student ranking:", error);
        return false;
      }
      
      if (!data) {
        const { error: insertError } = await supabase
          .from("student_rankings")
          .insert({
            student_id: studentId,
            total_points: 0,
            sessions_completed: 0,
            quizzes_completed: 0
          });
        
        if (insertError) {
          console.error("Error creating initial ranking:", insertError);
          return false;
        } else {
          console.log("Created initial ranking for student:", studentId);
          return true;
        }
      }
      
      return true;
    } catch (err) {
      console.error("Error in initializeStudentRanking:", err);
      return false;
    }
  }
  
  /**
   * Get top ranked students with profile information
   */
  static async getTopStudents(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("student_rankings")
        .select(`
          student_id,
          total_points,
          sessions_completed,
          quizzes_completed,
          profiles:student_id (name, email)
        `)
        .order("total_points", { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error("Error fetching top students:", error);
        return [];
      }
      
      // Format the data to include name and email from profiles
      return data.map((item, index) => ({
        student_id: item.student_id,
        name: item.profiles?.name,
        email: item.profiles?.email,
        total_points: item.total_points,
        sessions_completed: item.sessions_completed,
        quizzes_completed: item.quizzes_completed,
        rank: index + 1
      }));
    } catch (error) {
      console.error("Error in getTopStudents:", error);
      return [];
    }
  }
}

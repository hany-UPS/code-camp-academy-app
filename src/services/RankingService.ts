
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
}

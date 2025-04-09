
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RankingService } from "@/services/RankingService";

export class QuizProgressService {
  /**
   * Submit a quiz result for a student
   */
  static async submitQuizResult(quizId: string, studentId: string, score: number): Promise<boolean> {
    try {
      // Initialize student ranking if needed
      await RankingService.initializeStudentRanking(studentId);
      
      // Check if already submitted
      const { data: existingSubmission } = await supabase
        .from('quiz_submissions')
        .select('id')
        .eq('quiz_id', quizId)
        .eq('student_id', studentId)
        .maybeSingle();

      if (existingSubmission) {
        toast({
          title: "Already submitted",
          description: "You have already submitted this quiz.",
        });
        return true;
      }

      // Create submission record
      const { error } = await supabase
        .from('quiz_submissions')
        .insert({
          student_id: studentId,
          quiz_id: quizId,
          score: score
        });

      if (error) {
        console.error("Error submitting quiz:", error);
        toast({
          title: "Error",
          description: "Failed to save quiz results. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Update student rankings
      await RankingService.updateStudentRanking(studentId);

      toast({
        title: "Quiz completed!",
        description: `Your score: ${score} points`,
      });
      return true;
    } catch (error: any) {
      console.error("Error in submitQuizResult:", error);
      toast({
        title: "Error",
        description: "Failed to save quiz results. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  /**
   * Get a student's completed quizzes
   */
  static async getCompletedQuizzes(studentId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_submissions')
        .select('quiz_id')
        .eq('student_id', studentId);

      if (error) {
        console.error("Error fetching completed quizzes:", error);
        return [];
      }

      return data.map(submission => submission.quiz_id);
    } catch (error) {
      console.error("Error in getCompletedQuizzes:", error);
      return [];
    }
  }

  /**
   * Get quizzes for a session
   */
  static async getQuizzesForSession(sessionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('session_id', sessionId);

      if (error) {
        console.error("Error fetching quizzes:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getQuizzesForSession:", error);
      return [];
    }
  }
}

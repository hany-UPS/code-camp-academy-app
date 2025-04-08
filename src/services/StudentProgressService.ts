
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export class StudentProgressService {
  /**
   * Mark a session as completed for a student
   */
  static async markSessionCompleted(sessionId: string, studentId: string): Promise<boolean> {
    try {
      // Check if already completed
      const { data: existingProgress } = await supabase
        .from('session_progress')
        .select('id')
        .eq('session_id', sessionId)
        .eq('student_id', studentId)
        .maybeSingle();

      if (existingProgress) {
        toast({
          title: "Already completed",
          description: "You have already completed this session.",
        });
        return true;
      }

      // Create progress record
      const { error } = await supabase
        .from('session_progress')
        .insert({
          student_id: studentId,
          session_id: sessionId
        });

      if (error) {
        console.error("Error marking session as completed:", error);
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Session completed!",
        description: "Your progress has been saved.",
      });
      return true;
    } catch (error: any) {
      console.error("Error in markSessionCompleted:", error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  /**
   * Submit a quiz result for a student
   */
  static async submitQuizResult(quizId: string, studentId: string, score: number): Promise<boolean> {
    try {
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
   * Get a student's completed sessions
   */
  static async getCompletedSessions(studentId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('session_progress')
        .select('session_id')
        .eq('student_id', studentId);

      if (error) {
        console.error("Error fetching completed sessions:", error);
        return [];
      }

      return data.map(progress => progress.session_id);
    } catch (error) {
      console.error("Error in getCompletedSessions:", error);
      return [];
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
}

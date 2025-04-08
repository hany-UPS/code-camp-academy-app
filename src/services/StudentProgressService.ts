
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { StudentRanking } from "@/types/supabase-extension";

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

      // Update student rankings
      await StudentProgressService.updateStudentRanking(studentId);

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

      // Update student rankings
      await StudentProgressService.updateStudentRanking(studentId);

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

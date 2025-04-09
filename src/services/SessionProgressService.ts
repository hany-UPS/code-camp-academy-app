
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RankingService } from "@/services/RankingService";

export class SessionProgressService {
  /**
   * Mark a session as completed for a student
   */
  static async markSessionCompleted(sessionId: string, studentId: string): Promise<boolean> {
    try {
      // Initialize student ranking if needed
      await RankingService.initializeStudentRanking(studentId);
      
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
      await RankingService.updateStudentRanking(studentId);

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
}

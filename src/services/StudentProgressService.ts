
/**
 * @deprecated Use the specific service classes instead:
 * - SessionProgressService for session-related operations
 * - QuizProgressService for quiz-related operations
 * - RankingService for student ranking operations
 */

import { SessionProgressService } from "@/services/SessionProgressService";
import { QuizProgressService } from "@/services/QuizProgressService";
import { RankingService } from "@/services/RankingService";

export class StudentProgressService {
  /**
   * Mark a session as completed for a student
   * @deprecated Use SessionProgressService.markSessionCompleted instead
   */
  static async markSessionCompleted(sessionId: string, studentId: string): Promise<boolean> {
    return SessionProgressService.markSessionCompleted(sessionId, studentId);
  }

  /**
   * Submit a quiz result for a student
   * @deprecated Use QuizProgressService.submitQuizResult instead
   */
  static async submitQuizResult(quizId: string, studentId: string, score: number): Promise<boolean> {
    return QuizProgressService.submitQuizResult(quizId, studentId, score);
  }

  /**
   * Get a student's completed sessions
   * @deprecated Use SessionProgressService.getCompletedSessions instead
   */
  static async getCompletedSessions(studentId: string): Promise<string[]> {
    return SessionProgressService.getCompletedSessions(studentId);
  }

  /**
   * Get a student's completed quizzes
   * @deprecated Use QuizProgressService.getCompletedQuizzes instead
   */
  static async getCompletedQuizzes(studentId: string): Promise<string[]> {
    return QuizProgressService.getCompletedQuizzes(studentId);
  }

  /**
   * Initialize or update student ranking
   * @deprecated Use RankingService.updateStudentRanking instead
   */
  static async updateStudentRanking(studentId: string): Promise<void> {
    return RankingService.updateStudentRanking(studentId);
  }

  /**
   * Get quizzes for a session
   * @deprecated Use QuizProgressService.getQuizzesForSession instead
   */
  static async getQuizzesForSession(sessionId: string): Promise<any[]> {
    return QuizProgressService.getQuizzesForSession(sessionId);
  }
}

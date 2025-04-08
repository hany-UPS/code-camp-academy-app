
// This file extends the Supabase types with our new tables
export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[] | null;
  correct_answer: string;
  points: number;
  sequence_order: number;
}

export interface Quiz {
  id: string;
  session_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  questions?: QuizQuestion[];
}

export interface QuizSubmission {
  id: string;
  quiz_id: string;
  student_id: string;
  score: number;
  completed_at: string;
}

export interface StudentRanking {
  student_id: string;
  total_points: number;
  sessions_completed: number;
  quizzes_completed: number;
  updated_at: string;
  profiles?: {
    name: string | null;
    email: string | null;
  };
}


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

// Add helper functions for rankings and student progress
export async function createInitialRanking(userId: string) {
  try {
    const { error } = await fetch(`https://voxkuytvhgxefjlxxtxk.supabase.co/rest/v1/student_rankings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveGt1eXR2aGd4ZWZqbHh4dHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODAyMjAsImV4cCI6MjA1OTM1NjIyMH0.MchoRnh0PCIEX6ce72XnoJjJMmVnZ6H-neQ2t78O6Ik',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({
        student_id: userId,
        total_points: 0,
        sessions_completed: 0,
        quizzes_completed: 0
      })
    }).then(res => res.json());

    if (error) {
      console.error("Error creating initial ranking:", error);
    }
  } catch (err) {
    console.error("Error in createInitialRanking:", err);
  }
}

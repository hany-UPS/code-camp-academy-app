
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuizQuestion } from "@/types/supabase-extension";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  questions: QuizQuestion[];
}

export function useQuiz(quizId: string, userId: string | undefined) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        
        // Check if quiz has already been completed
        if (userId) {
          const { data: existingSubmission } = await supabase
            .from('quiz_submissions')
            .select('*')
            .eq('quiz_id', quizId)
            .eq('student_id', userId)
            .maybeSingle();
            
          if (existingSubmission) {
            setErrorMessage(`You've already completed this quiz with a score of ${existingSubmission.score} points.`);
            setLoading(false);
            return;
          }
        }
        
        // Fetch quiz details
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .maybeSingle();
        
        if (quizError || !quizData) {
          throw new Error("Failed to fetch quiz");
        }
        
        // Fetch quiz questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizId)
          .order('sequence_order', { ascending: true });
          
        if (questionsError) {
          throw new Error("Failed to fetch quiz questions");
        }
        
        // Transform the question data to ensure type safety
        const typedQuestions: QuizQuestion[] = (questionsData || []).map(q => ({
          id: q.id,
          quiz_id: q.quiz_id,
          question_text: q.question_text,
          question_type: q.question_type === 'multiple_choice' ? 'multiple_choice' : 'true_false',
          options: Array.isArray(q.options) ? q.options.map(String) : null,
          correct_answer: q.correct_answer,
          points: q.points,
          sequence_order: q.sequence_order
        }));
        
        setQuiz({
          ...quizData,
          questions: typedQuestions
        });
        
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching quiz:", error);
        setErrorMessage(error.message || "Failed to load quiz");
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [quizId, userId]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleNextQuestion = () => {
    if (!quiz || selectedOption === null) return;
    
    // Save the answer
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: selectedOption
    });
    
    // Update score if correct
    if (selectedOption === currentQuestion.correct_answer) {
      setScore(prev => prev + currentQuestion.points);
    }
    
    // Clear selection
    setSelectedOption(null);
    
    // Move to next question or finish
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return {
    quiz,
    loading,
    currentQuestionIndex,
    selectedOption,
    answers,
    score,
    quizCompleted,
    errorMessage,
    handleOptionSelect,
    handleNextQuestion,
    currentQuestion: quiz?.questions[currentQuestionIndex] || null,
    totalQuestions: quiz?.questions.length || 0,
    isLastQuestion: currentQuestionIndex === (quiz?.questions.length || 0) - 1
  };
}

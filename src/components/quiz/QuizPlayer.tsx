
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Award, Check, HelpCircle, X } from "lucide-react";
import { QuizQuestion } from "@/types/supabase-extension";
import { supabase } from "@/integrations/supabase/client";

interface QuizPlayerProps {
  quizId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  questions: QuizQuestion[];
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizId, onComplete, onClose }) => {
  const { user } = useAuth();
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
        if (user) {
          const response = await fetch(`https://voxkuytvhgxefjlxxtxk.supabase.co/rest/v1/quiz_submissions?quiz_id=eq.${quizId}&student_id=eq.${user.id}`, {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveGt1eXR2aGd4ZWZqbHh4dHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODAyMjAsImV4cCI6MjA1OTM1NjIyMH0.MchoRnh0PCIEX6ce72XnoJjJMmVnZ6H-neQ2t78O6Ik'
            }
          });
          
          const existingSubmission = await response.json();
          if (existingSubmission && existingSubmission.length > 0) {
            setErrorMessage(`You've already completed this quiz with a score of ${existingSubmission[0].score} points.`);
            setLoading(false);
            return;
          }
        }
        
        // Fetch quiz details
        const quizResponse = await fetch(`https://voxkuytvhgxefjlxxtxk.supabase.co/rest/v1/quizzes?id=eq.${quizId}&select=*`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveGt1eXR2aGd4ZWZqbHh4dHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODAyMjAsImV4cCI6MjA1OTM1NjIyMH0.MchoRnh0PCIEX6ce72XnoJjJMmVnZ6H-neQ2t78O6Ik'
          }
        });
        
        if (!quizResponse.ok) {
          throw new Error("Failed to fetch quiz");
        }
        
        const quizData = await quizResponse.json();
        if (!quizData || quizData.length === 0) {
          throw new Error("Quiz not found");
        }
        
        // Fetch quiz questions
        const questionsResponse = await fetch(`https://voxkuytvhgxefjlxxtxk.supabase.co/rest/v1/quiz_questions?quiz_id=eq.${quizId}&order=sequence_order.asc`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveGt1eXR2aGd4ZWZqbHh4dHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODAyMjAsImV4cCI6MjA1OTM1NjIyMH0.MchoRnh0PCIEX6ce72XnoJjJMmVnZ6H-neQ2t78O6Ik'
          }
        });
        
        if (!questionsResponse.ok) {
          throw new Error("Failed to fetch quiz questions");
        }
        
        const questionsData = await questionsResponse.json();
        
        setQuiz({
          ...quizData[0],
          questions: questionsData
        });
        
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching quiz:", error);
        setErrorMessage(error.message || "Failed to load quiz");
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [quizId, user]);
  
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
  
  const handleSubmitQuiz = async () => {
    if (!quiz || !user) return;
    
    try {
      // Save quiz submission
      const response = await fetch(`https://voxkuytvhgxefjlxxtxk.supabase.co/rest/v1/quiz_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveGt1eXR2aGd4ZWZqbHh4dHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODAyMjAsImV4cCI6MjA1OTM1NjIyMH0.MchoRnh0PCIEX6ce72XnoJjJMmVnZ6H-neQ2t78O6Ik',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          quiz_id: quizId,
          student_id: user.id,
          score
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to save quiz submission");
      }
      
      toast({
        title: "Quiz completed!",
        description: `You scored ${score} out of ${quiz.questions.reduce((sum, q) => sum + q.points, 0)} points.`,
      });
      
      onComplete(score);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to save your quiz results",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <p>Loading quiz...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (errorMessage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Unavailable</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p>{errorMessage}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (!quiz || quiz.questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Unavailable</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p>This quiz has no questions or is unavailable.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (quizCompleted) {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader className="text-center bg-purple-50">
          <CardTitle className="text-xl text-purple-900">{quiz.title} - Results</CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-100">
              <Award className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold">Quiz Completed!</h3>
            <p className="text-gray-500 mt-2">
              You've completed the quiz. Here's how you did:
            </p>
          </div>
          
          <div className="w-full mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Your Score:</span>
              <span className="font-bold">{score} / {totalPoints} points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  percentage >= 80 ? 'bg-green-600' : 
                  percentage >= 60 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-center mt-2 text-sm text-gray-500">
              {percentage}% correct
            </p>
          </div>
          
          <div className="space-y-4 w-full">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correct_answer;
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-md ${
                    isCorrect ? 'bg-green-50 border border-green-200' : 
                    'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-start mb-2">
                    <div className={`flex-shrink-0 rounded-full p-1 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isCorrect ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Question {index + 1}</p>
                      <p className="text-sm">{question.question_text}</p>
                    </div>
                  </div>
                  <div className="ml-8 text-sm">
                    <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      Your answer: {userAnswer}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-700">
                        Correct answer: {question.correct_answer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSubmitQuiz} className="bg-purple-600 hover:bg-purple-700">
            Save Results
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-purple-50">
        <CardTitle>{quiz.title}</CardTitle>
        {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium">
            Points: {currentQuestion.points}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-start">
            <HelpCircle className="h-6 w-6 mr-2 text-purple-600 flex-shrink-0 mt-1" />
            <span>{currentQuestion.question_text}</span>
          </h3>
          
          <div className="space-y-2">
            {currentQuestion.question_type === 'true_false' ? (
              <div className="grid grid-cols-2 gap-3">
                {['true', 'false'].map(option => (
                  <button
                    key={option}
                    className={`p-4 rounded-md text-center transition-colors ${
                      selectedOption === option 
                        ? 'bg-purple-200 border-2 border-purple-500' 
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-md text-left transition-colors w-full flex items-center ${
                      selectedOption === option 
                        ? 'bg-purple-200 border-2 border-purple-500' 
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <div className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center border ${
                      selectedOption === option 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'border-gray-400'
                    }`}>
                      {selectedOption === option && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onClose}
        >
          Cancel Quiz
        </Button>
        <Button 
          onClick={handleNextQuestion}
          disabled={!selectedOption}
          className="bg-academy-blue hover:bg-blue-600"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizPlayer;

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent,
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { QuizProgressService } from "@/services/QuizProgressService"; 
import QuizError from "./QuizError";
import QuizResults from "./QuizResults";
import QuestionDisplay from "./QuestionDisplay";
import { useQuiz } from "@/hooks/useQuiz";

interface QuizPlayerProps {
  quizId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizId, onComplete, onClose }) => {
  const { user } = useAuth();
  const [resultSubmitted, setResultSubmitted] = useState(false);
  
  const {
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
    currentQuestion,
    isLastQuestion,
    totalQuestions
  } = useQuiz(quizId, user?.id);
  
  // Auto-submit when quiz is completed
  useEffect(() => {
    const submitQuizResult = async () => {
      if (quizCompleted && quiz && user && !resultSubmitted) {
        try {
          const success = await QuizProgressService.submitQuizResult(quizId, user.id, score);
          
          if (success) {
            setResultSubmitted(true);
            // We don't call onComplete() here to keep results visible
          }
        } catch (error) {
          console.error("Error submitting quiz:", error);
          toast({
            title: "Error",
            description: "Failed to save your quiz results",
            variant: "destructive",
          });
        }
      }
    };
    
    submitQuizResult();
  }, [quizCompleted, quiz, user, quizId, score, onComplete, resultSubmitted]);
  
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
    return <QuizError title="Quiz Unavailable" message={errorMessage} onClose={onClose} />;
  }
  
  if (!quiz || quiz.questions.length === 0) {
    return (
      <QuizError 
        title="Quiz Unavailable" 
        message="This quiz has no questions or is unavailable." 
        onClose={onClose} 
      />
    );
  }
  
  if (quizCompleted) {
    return (
      <QuizResults 
        quiz={quiz}
        score={score}
        answers={answers}
        onClose={onClose}
        onSubmit={() => {
          onComplete(score); 
          onClose();
        }}
      />
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-purple-50">
        <CardTitle>{quiz.title}</CardTitle>
        {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium">
            Points: {currentQuestion?.points}
          </span>
        </div>
      </CardHeader>
      
      {currentQuestion && (
        <QuestionDisplay 
          question={currentQuestion}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
        />
      )}
      
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

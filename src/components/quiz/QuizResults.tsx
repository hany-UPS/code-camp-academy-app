
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Check, X } from "lucide-react";
import { QuizQuestion } from "@/types/supabase-extension";

interface QuizResultsProps {
  quiz: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
  score: number;
  answers: Record<string, string>;
  onClose: () => void;
  onSubmit: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  quiz, 
  score, 
  answers, 
  onClose, 
  onSubmit 
}) => {
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
        <Button onClick={onSubmit} className="bg-purple-600 hover:bg-purple-700">
          Save Results
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizResults;

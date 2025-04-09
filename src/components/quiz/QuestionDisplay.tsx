
import React from "react";
import { CardContent } from "@/components/ui/card";
import { HelpCircle, Check } from "lucide-react";
import { QuizQuestion } from "@/types/supabase-extension";

interface QuestionDisplayProps {
  question: QuizQuestion;
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedOption,
  onOptionSelect,
}) => {
  return (
    <CardContent className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-start">
          <HelpCircle className="h-6 w-6 mr-2 text-purple-600 flex-shrink-0 mt-1" />
          <span>{question.question_text}</span>
        </h3>
        
        <div className="space-y-2">
          {question.question_type === "true_false" ? (
            <div className="grid grid-cols-2 gap-3">
              {["true", "false"].map((option) => (
                <button
                  key={option}
                  className={`p-4 rounded-md text-center transition-colors ${
                    selectedOption === option 
                      ? "bg-purple-200 border-2 border-purple-500" 
                      : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => onOptionSelect(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-md text-left transition-colors w-full flex items-center ${
                    selectedOption === option 
                      ? "bg-purple-200 border-2 border-purple-500" 
                      : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => onOptionSelect(option)}
                >
                  <div className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center border ${
                    selectedOption === option 
                      ? "bg-purple-500 border-purple-500" 
                      : "border-gray-400"
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
  );
};

export default QuestionDisplay;

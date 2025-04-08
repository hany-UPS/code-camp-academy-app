import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, Plus, Check, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuizFormProps {
  sessionId: string;
  sessionTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const questionFormSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      question_text: z.string().min(1, "Question text is required"),
      question_type: z.enum(["multiple_choice", "true_false"]),
      options: z.array(z.string()).min(2, "At least 2 options are required"),
      correct_answer: z.string().min(1, "Correct answer is required")
    })
  ).min(1, "At least one question is required"),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

const QuizForm: React.FC<QuizFormProps> = ({ 
  sessionId, 
  sessionTitle, 
  onClose, 
  onSuccess 
}) => {
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      title: `${sessionTitle} Quiz`,
      description: "",
      questions: [
        {
          question_text: "",
          question_type: "multiple_choice",
          options: ["", ""],
          correct_answer: ""
        }
      ]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions"
  });
  
  const onSubmit = async (data: QuestionFormValues) => {
    try {
      setSubmitting(true);
      
      // Insert the quiz directly using the supabase client
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          session_id: sessionId,
          title: data.title,
          description: data.description || null
        })
        .select()
        .single();
      
      if (quizError) {
        throw new Error(`Failed to create quiz: ${quizError.message}`);
      }
      
      if (!quiz) {
        throw new Error('Failed to retrieve the created quiz');
      }
      
      // Format and insert the questions
      const formattedQuestions = data.questions.map((question, index) => ({
        quiz_id: quiz.id,
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.question_type === "multiple_choice" ? question.options : null,
        correct_answer: question.correct_answer,
        sequence_order: index + 1,
        points: 1 // Default points per question
      }));
      
      // Insert questions using the supabase client
      const { error: questionsError } = await supabase
        .from("quiz_questions")
        .insert(formattedQuestions);
      
      if (questionsError) {
        throw new Error(`Failed to create quiz questions: ${questionsError.message}`);
      }
      
      toast({
        title: "Quiz created",
        description: "The quiz has been created successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error creating quiz",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      console.error("Error creating quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-academy-blue text-white">
        <CardTitle className="text-xl">Create Quiz for "{sessionTitle}"</CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for this quiz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a description for this quiz" 
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Questions</h3>
              </div>
              
              {fields.map((field, index) => (
                <Card key={field.id} className="border border-gray-200">
                  <CardHeader className="px-4 py-3 bg-gray-50 flex flex-row justify-between items-center">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 py-3 space-y-3">
                    <FormField
                      control={form.control}
                      name={`questions.${index}.question_text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter question text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`questions.${index}.question_type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a question type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="true_false">True/False</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch(`questions.${index}.question_type`) === "true_false" ? (
                      <FormField
                        control={form.control}
                        name={`questions.${index}.correct_answer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correct Answer</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select the correct answer" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <>
                        <div className="space-y-3">
                          <FormLabel>Options</FormLabel>
                          {form.watch(`questions.${index}.options`)?.map((_, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <FormField
                                control={form.control}
                                name={`questions.${index}.options.${optionIndex}`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <div className="flex items-center gap-2">
                                        <Input 
                                          placeholder={`Option ${optionIndex + 1}`} 
                                          {...field} 
                                        />
                                        {optionIndex > 1 && (
                                          <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => {
                                              const options = [...form.getValues(`questions.${index}.options`)];
                                              options.splice(optionIndex, 1);
                                              form.setValue(`questions.${index}.options`, options);
                                              
                                              // If removing correct answer, reset it
                                              if (form.getValues(`questions.${index}.correct_answer`) === field.value) {
                                                form.setValue(`questions.${index}.correct_answer`, "");
                                              }
                                            }}
                                          >
                                            <Trash className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`questions.${index}.correct_answer`}
                                render={({ field }) => (
                                  <Button
                                    type="button"
                                    variant={field.value === form.getValues(`questions.${index}.options.${optionIndex}`) ? "default" : "outline"}
                                    size="sm"
                                    className="min-w-[40px]"
                                    onClick={() => {
                                      field.onChange(form.getValues(`questions.${index}.options.${optionIndex}`));
                                    }}
                                  >
                                    {field.value === form.getValues(`questions.${index}.options.${optionIndex}`) ? (
                                      <Check className="h-4 w-4" />
                                    ) : null}
                                  </Button>
                                )}
                              />
                            </div>
                          ))}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => {
                              const options = [...form.getValues(`questions.${index}.options`), ""];
                              form.setValue(`questions.${index}.options`, options);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add Option
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={() => append({
                  question_text: "",
                  question_type: "multiple_choice",
                  options: ["", ""],
                  correct_answer: ""
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Quiz"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default QuizForm;

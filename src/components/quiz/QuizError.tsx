
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizErrorProps {
  title: string;
  message: string;
  onClose: () => void;
}

const QuizError: React.FC<QuizErrorProps> = ({ title, message, onClose }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p>{message}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  );
};

export default QuizError;

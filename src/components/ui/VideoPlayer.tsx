
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  sessionId: string;
  onComplete?: (sessionId: string) => void;
  isCompleted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  sessionId, 
  onComplete,
  isCompleted = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete(sessionId);
      toast({
        title: "Session completed!",
        description: "Your progress has been saved",
        variant: "default",
      });
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="relative pt-[56.25%]">
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div 
              className="flex flex-col items-center justify-center cursor-pointer" 
              onClick={() => setIsPlaying(true)}
            >
              <PlayCircle 
                size={64} 
                className="text-white mb-2 animate-bounce-slow" 
              />
              <span className="text-white text-lg font-medium">Click to play video</span>
            </div>
          </div>
        ) : (
          <iframe
            src={videoUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        )}
      </div>
      <CardContent className="p-4">
        <Button
          onClick={handleComplete}
          className={`w-full ${
            isCompleted 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-academy-blue hover:bg-blue-600"
          }`}
          variant="default"
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;

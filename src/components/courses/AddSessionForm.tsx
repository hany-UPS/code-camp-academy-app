
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AddSessionFormProps {
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  onSessionsUpdated: () => void;
}

interface SessionFormValues {
  title: string;
  description: string;
  video_url: string;
  is_active: boolean;
}

const AddSessionForm: React.FC<AddSessionFormProps> = ({ courseId, courseTitle, onClose, onSessionsUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SessionFormValues>({
    defaultValues: {
      title: "",
      description: "",
      video_url: "",
      is_active: true
    }
  });
  
  const onSubmit = async (data: SessionFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get current max sequence order for this course
      const { data: existingSessions, error: sessionsError } = await supabase
        .from("sessions")
        .select("sequence_order")
        .eq("course_id", courseId)
        .order("sequence_order", { ascending: false })
        .limit(1);
        
      if (sessionsError) {
        throw sessionsError;
      }
      
      const nextSequenceOrder = existingSessions && existingSessions.length > 0 
        ? existingSessions[0].sequence_order + 1 
        : 1;
      
      // Format YouTube URL if needed
      let formattedVideoUrl = data.video_url;
      if (formattedVideoUrl.includes("youtube.com/watch?v=")) {
        const videoId = formattedVideoUrl.split("v=")[1].split("&")[0];
        formattedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (formattedVideoUrl.includes("youtu.be/")) {
        const videoId = formattedVideoUrl.split("youtu.be/")[1].split("?")[0];
        formattedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Insert new session
      const { error } = await supabase.from("sessions").insert({
        course_id: courseId,
        title: data.title,
        description: data.description,
        video_url: formattedVideoUrl,
        sequence_order: nextSequenceOrder,
        is_active: data.is_active
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success!",
        description: "Session added successfully.",
      });
      
      onSessionsUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error adding session:", error);
      toast({
        title: "Error adding session",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="relative">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>Add New Session to {courseTitle}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              placeholder="Enter session title"
              {...register("title", { required: "Title is required" })}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter session description"
              {...register("description")}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL (YouTube)</Label>
            <Input
              id="video_url"
              placeholder="https://www.youtube.com/watch?v=..."
              {...register("video_url", { required: "Video URL is required" })}
              className={errors.video_url ? "border-red-500" : ""}
            />
            {errors.video_url ? (
              <p className="text-sm text-red-500">{errors.video_url.message}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Supports YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="is_active" {...register("is_active")} />
            <Label htmlFor="is_active">Make session visible to students</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Session"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddSessionForm;

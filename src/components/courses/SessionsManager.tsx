
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Youtube, MoveUp, MoveDown, Plus } from "lucide-react";
import AddSessionForm from "./AddSessionForm";

interface Session {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  sequence_order: number;
  is_active: boolean;
}

interface Course {
  id: string;
  title: string;
}

interface SessionsManagerProps {
  course: Course;
  onClose: () => void;
}

const SessionsManager: React.FC<SessionsManagerProps> = ({ course, onClose }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("course_id", course.id)
        .order("sequence_order", { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setSessions(data || []);
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSessions();
  }, [course.id]);
  
  const handleToggleActive = async (sessionId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("sessions")
        .update({ is_active: !currentValue })
        .eq("id", sessionId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setSessions(sessions.map(session => 
        session.id === sessionId 
          ? { ...session, is_active: !currentValue } 
          : session
      ));
      
      toast({
        title: "Status Updated",
        description: `Session is now ${!currentValue ? "visible" : "hidden"} to students`,
      });
    } catch (error: any) {
      console.error("Error updating session status:", error);
      toast({
        title: "Error",
        description: "Failed to update session status",
        variant: "destructive",
      });
    }
  };
  
  const handleMoveSession = async (sessionId: string, direction: 'up' | 'down') => {
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (
      (direction === 'up' && sessionIndex === 0) || 
      (direction === 'down' && sessionIndex === sessions.length - 1)
    ) {
      return;
    }
    
    const otherIndex = direction === 'up' ? sessionIndex - 1 : sessionIndex + 1;
    const currentSession = sessions[sessionIndex];
    const otherSession = sessions[otherIndex];
    
    try {
      // Swap sequence_order values
      const updates = [
        supabase
          .from("sessions")
          .update({ sequence_order: otherSession.sequence_order })
          .eq("id", currentSession.id),
        supabase
          .from("sessions")
          .update({ sequence_order: currentSession.sequence_order })
          .eq("id", otherSession.id)
      ];
      
      await Promise.all(updates);
      
      // Update local state
      const updatedSessions = [...sessions];
      updatedSessions[sessionIndex] = { ...currentSession, sequence_order: otherSession.sequence_order };
      updatedSessions[otherIndex] = { ...otherSession, sequence_order: currentSession.sequence_order };
      updatedSessions.sort((a, b) => a.sequence_order - b.sequence_order);
      setSessions(updatedSessions);
      
    } catch (error: any) {
      console.error("Error reordering sessions:", error);
      toast({
        title: "Error",
        description: "Failed to reorder sessions",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setSessions(sessions.filter(session => session.id !== sessionId));
      
      toast({
        title: "Session Deleted",
        description: "Session has been removed successfully",
      });
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };
  
  const formatVideoUrl = (url: string) => {
    // Extract video ID for display
    const match = url.match(/embed\/([^/?]+)/) || url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    if (match && match[1]) {
      return `YouTube: ${match[1]}`;
    }
    return url;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Sessions for {course.title}
        </h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddSession(true)} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add New Session
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      
      {showAddSession ? (
        <div className="mb-6">
          <AddSessionForm 
            courseId={course.id} 
            courseTitle={course.title}
            onClose={() => setShowAddSession(false)}
            onSessionsUpdated={fetchSessions}
          />
        </div>
      ) : loading ? (
        <div className="text-center py-8">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No sessions available for this course.</p>
          <Button onClick={() => setShowAddSession(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Session
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Visible to Students</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <span className="mr-2">{session.sequence_order}</span>
                    <div className="flex flex-col">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={() => handleMoveSession(session.id, 'up')}
                        disabled={sessions.indexOf(session) === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={() => handleMoveSession(session.id, 'down')}
                        disabled={sessions.indexOf(session) === sessions.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{session.title}</TableCell>
                <TableCell>
                  {session.description ? (
                    <span className="line-clamp-2 text-sm text-gray-600">
                      {session.description}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No description
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Youtube className="h-4 w-4 mr-1 text-red-600" />
                    <a 
                      href={session.video_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate max-w-[150px]"
                    >
                      {formatVideoUrl(session.video_url)}
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={session.is_active} 
                    onCheckedChange={() => handleToggleActive(session.id, session.is_active)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SessionsManager;

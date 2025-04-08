
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock, CheckCircle, Youtube, EyeOff, PlayCircle, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { StudentProgressService } from "@/services/StudentProgressService";

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
  description: string | null;
  thumbnail_url: string | null;
  sessions: Session[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
}

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleSessions, setVisibleSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<"video" | "quizzes">("video");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!courseId) {
      navigate("/not-found");
      return;
    }
    
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();
          
        if (courseError || !courseData) {
          console.error("Error fetching course:", courseError);
          navigate("/not-found");
          return;
        }
        
        // Build query for sessions
        let query = supabase
          .from("sessions")
          .select("*")
          .eq("course_id", courseId);
        
        // Only filter by is_active for students
        if (user && user.role === "student") {
          query = query.eq("is_active", true);
        }
        
        // Fetch sessions
        const { data: sessionsData, error: sessionsError } = await query
          .order("sequence_order", { ascending: true });
          
        if (sessionsError) {
          console.error("Error fetching sessions:", sessionsError);
          toast({
            title: "Error",
            description: "Failed to load course sessions",
            variant: "destructive",
          });
          return;
        }
        
        if (!sessionsData || sessionsData.length === 0) {
          toast({
            title: "No Content",
            description: "This course doesn't have any active sessions yet",
            variant: "default",
          });
          setVisibleSessions([]);
        } else {
          // Make sure each session has the is_active property
          const processedSessions = sessionsData.map(session => ({
            ...session,
            is_active: session.is_active !== undefined ? session.is_active : true
          }));
          
          const completeData: Course = {
            ...courseData,
            sessions: processedSessions
          };
          
          setCourse(completeData);
          setVisibleSessions(processedSessions);
          setActiveSession(processedSessions[0]);
        }
        
        // If student, fetch completed sessions
        if (user && user.id) {
          const completedSessionIds = await StudentProgressService.getCompletedSessions(user.id);
          setCompletedSessions(completedSessionIds);
          
          const completedQuizIds = await StudentProgressService.getCompletedQuizzes(user.id);
          setCompletedQuizzes(completedQuizIds);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchCourseData:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load course data",
          variant: "destructive",
        });
      }
    };
    
    fetchCourseData();
  }, [courseId, isAuthenticated, navigate, user]);
  
  useEffect(() => {
    if (activeSession && activeSession.id) {
      fetchQuizzesForSession(activeSession.id);
    }
  }, [activeSession]);
  
  const fetchQuizzesForSession = async (sessionId: string) => {
    try {
      const quizData = await StudentProgressService.getQuizzesForSession(sessionId);
      setQuizzes(quizData);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes([]);
    }
  };
  
  const handleSessionClick = (session: Session, index: number) => {
    setActiveSession(session);
    setActiveSessionIndex(index);
    setActiveTab("video");
    setActiveQuizId(null);
  };
  
  const handleNextSession = () => {
    if (visibleSessions && activeSessionIndex < visibleSessions.length - 1) {
      const nextIndex = activeSessionIndex + 1;
      setActiveSessionIndex(nextIndex);
      setActiveSession(visibleSessions[nextIndex]);
      setActiveTab("video");
      setActiveQuizId(null);
    }
  };
  
  const handlePrevSession = () => {
    if (activeSessionIndex > 0) {
      const prevIndex = activeSessionIndex - 1;
      setActiveSessionIndex(prevIndex);
      setActiveSession(visibleSessions[prevIndex]);
      setActiveTab("video");
      setActiveQuizId(null);
    }
  };
  
  const handleSessionComplete = async (sessionId: string) => {
    if (!user) return;
    
    try {
      const success = await StudentProgressService.markSessionCompleted(sessionId, user.id);
      
      if (success && !completedSessions.includes(sessionId)) {
        setCompletedSessions([...completedSessions, sessionId]);
      }
    } catch (error) {
      console.error("Error in handleSessionComplete:", error);
    }
  };
  
  const handleQuizComplete = async (score: number) => {
    if (!user || !activeQuizId) return;
    
    try {
      const success = await StudentProgressService.submitQuizResult(activeQuizId, user.id, score);
      
      if (success && !completedQuizzes.includes(activeQuizId)) {
        setCompletedQuizzes([...completedQuizzes, activeQuizId]);
      }
      
      setActiveQuizId(null);
    } catch (error) {
      console.error("Error completing quiz:", error);
    }
  };
  
  const isSessionCompleted = (sessionId: string) => {
    return completedSessions.includes(sessionId);
  };
  
  const isQuizCompleted = (quizId: string) => {
    return completedQuizzes.includes(quizId);
  };
  
  const renderYouTubeLink = () => {
    if (user?.role === "admin" && activeSession) {
      const originalUrl = activeSession.video_url.replace("embed/", "watch?v=");
      return (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Youtube className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm text-gray-700">YouTube Link (Admin Only):</span>
            </div>
            <a 
              href={originalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-academy-blue hover:underline text-sm"
            >
              {originalUrl}
            </a>
          </div>
          {!activeSession.is_active && (
            <div className="mt-2 text-sm flex items-center text-amber-600">
              <EyeOff className="h-4 w-4 mr-1" />
              This session is currently hidden from students
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  if (loading || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading course...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If no active sessions are available
  if (!activeSession && visibleSessions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-4 text-gray-600"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="text-center p-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              No active sessions available
            </h2>
            <p className="text-gray-500">
              {user?.role === "admin" 
                ? "You haven't created any sessions for this course yet. Add a session to get started."
                : "This course doesn't have any content available yet. Check back later."}
            </p>
            {user?.role === "admin" && (
              <Button 
                onClick={() => navigate("/admin-dashboard")} 
                className="mt-4"
              >
                Go to Admin Dashboard
              </Button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4 text-gray-600"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeSession && (
              <>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "video" | "quizzes")} className="mb-6">
                  <TabsList>
                    <TabsTrigger value="video" className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      Video Lesson
                    </TabsTrigger>
                    <TabsTrigger value="quizzes" className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      Quizzes {quizzes.length > 0 ? `(${quizzes.length})` : ''}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="video" className="mt-4">
                    {activeQuizId ? (
                      <QuizPlayer 
                        quizId={activeQuizId}
                        onComplete={handleQuizComplete}
                        onClose={() => setActiveQuizId(null)}
                      />
                    ) : (
                      <>
                        <VideoPlayer 
                          videoUrl={activeSession.video_url}
                          sessionId={activeSession.id}
                          onComplete={handleSessionComplete}
                          isCompleted={isSessionCompleted(activeSession.id)}
                        />
                        
                        <div className="mt-6">
                          <h2 className="text-2xl font-bold mb-3">{activeSession.title}</h2>
                          <p className="text-gray-600 mb-4">{activeSession.description}</p>
                          {renderYouTubeLink()}
                        </div>
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="quizzes" className="mt-4">
                    {activeQuizId ? (
                      <QuizPlayer 
                        quizId={activeQuizId}
                        onComplete={handleQuizComplete}
                        onClose={() => setActiveQuizId(null)}
                      />
                    ) : (
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Session Quizzes</h2>
                        
                        {quizzes.length > 0 ? (
                          <div className="space-y-4">
                            {quizzes.map(quiz => (
                              <div 
                                key={quiz.id}
                                className="border rounded-lg p-4 hover:border-purple-300 transition-colors"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium text-lg">{quiz.title}</h3>
                                    {quiz.description && (
                                      <p className="text-gray-600 text-sm mt-1">{quiz.description}</p>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {isQuizCompleted(quiz.id) ? (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle className="h-5 w-5 mr-1" />
                                        <span>Completed</span>
                                      </div>
                                    ) : (
                                      <Button
                                        onClick={() => setActiveQuizId(quiz.id)}
                                        variant="outline"
                                        className="text-purple-600 border-purple-300 hover:bg-purple-50"
                                      >
                                        Start Quiz
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No quizzes available for this session.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevSession}
                    disabled={activeSessionIndex === 0}
                    className={activeSessionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Session
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleNextSession}
                    disabled={activeSessionIndex === visibleSessions.length - 1}
                    className={activeSessionIndex === visibleSessions.length - 1 ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Next Session
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-4">Course Sessions</h3>
              
              <ul className="space-y-2">
                {visibleSessions.map((session, index) => (
                  <li key={session.id}>
                    <button
                      onClick={() => handleSessionClick(session, index)}
                      className={`w-full text-left p-3 rounded-md flex items-start transition-colors ${
                        activeSession?.id === session.id
                          ? "bg-academy-light-orange border-l-4 border-academy-orange"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">
                            {index + 1}. {session.title}
                          </span>
                          {user?.role === "admin" && !session.is_active && (
                            <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {session.description}
                        </p>
                      </div>
                      <div className="ml-2">
                        {isSessionCompleted(session.id) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Progress:
                  </span>
                  <span className="text-sm font-medium">
                    {completedSessions.filter(id => 
                      visibleSessions.some(s => s.id === id)
                    ).length} of {visibleSessions.length} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-academy-blue h-2.5 rounded-full" 
                    style={{ 
                      width: `${(completedSessions.filter(id => 
                        visibleSessions.some(s => s.id === id)
                      ).length / (visibleSessions.length || 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseView;

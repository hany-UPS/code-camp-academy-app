
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  role: "student" | "admin" | "teacher";
  phone?: string | null;
  student_code?: string | null;
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  isStaff: () => boolean; // Either admin or teacher
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  
  // Fetch user profile data from the profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for ID:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        console.log("Error details:", error.message, error.details);
        return null;
      }
      
      console.log("Profile data fetched:", data);
      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed. Event:", event);
        setSupabaseSession(session);
        
        if (session?.user) {
          console.log("User authenticated:", session.user.id);
          // Use setTimeout to avoid potential infinite loops with Supabase client
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              console.log("Setting user profile:", profile);
              setUser(profile);
              // Store user in localStorage for easier access
              localStorage.setItem("user", JSON.stringify(profile));
            } else {
              console.warn("No profile found for user ID:", session.user.id);
              // Create a default profile if none exists
              const defaultProfile: UserProfile = {
                id: session.user.id,
                name: session.user.email?.split('@')[0] || null,
                email: session.user.email,
                role: "student" // Default role
              };
              setUser(defaultProfile);
              localStorage.setItem("user", JSON.stringify(defaultProfile));
            }
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          localStorage.removeItem("user");
          setLoading(false);
        }
      }
    );
    
    // Check current session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session } } = await supabase.auth.getSession();
        setSupabaseSession(session);
        
        if (session?.user) {
          console.log("Found existing session for user:", session.user.id);
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            console.log("Setting user profile from session:", profile);
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          } else {
            console.warn("No profile found for existing session user:", session.user.id);
            // Try to get from localStorage as fallback
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              console.log("Using stored user data:", parsedUser);
              setUser(parsedUser);
            } else {
              // Create default profile if nothing exists
              const defaultProfile: UserProfile = {
                id: session.user.id,
                name: session.user.email?.split('@')[0] || null,
                email: session.user.email,
                role: "student" // Default role
              };
              setUser(defaultProfile);
              localStorage.setItem("user", JSON.stringify(defaultProfile));
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error from Supabase:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Login successful!",
        description: "Welcome back!",
        variant: "default",
      });

      if (data.user) {
        console.log("Login successful for user ID:", data.user.id);
        // Fetch profile immediately to ensure we have the data
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          console.log("Setting user profile after login:", profile);
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        } else {
          console.warn("No profile found after login for user:", data.user.id);
          // Create a basic profile with default role
          const defaultProfile: UserProfile = {
            id: data.user.id,
            name: data.user.email?.split('@')[0] || null,
            email: data.user.email,
            role: "student" // Default role
          };
          setUser(defaultProfile);
          localStorage.setItem("user", JSON.stringify(defaultProfile));
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
      
      setUser(null);
      setSupabaseSession(null);
      localStorage.removeItem("user");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  const isAdmin = () => {
    return user?.role === "admin";
  };
  
  const isTeacher = () => {
    return user?.role === "teacher";
  };
  
  const isStaff = () => {
    return user?.role === "admin" || user?.role === "teacher";
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        isAdmin,
        isTeacher,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

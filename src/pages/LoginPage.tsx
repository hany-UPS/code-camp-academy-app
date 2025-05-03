
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

// This will create a test admin user on first run
const createAdminUser = async () => {
  try {
    // Check if admin@example.com already exists
    const { data: { user }, error: checkError } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'password123',
    });

    if (checkError) {
      if (checkError.message !== 'User already registered') {
        console.error("Error checking admin user:", checkError);
      }
      return;
    }

    if (user) {
      // Set the role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin', name: 'Admin User' })
        .eq('id', user.id);

      if (updateError) {
        console.error("Error updating admin role:", updateError);
      } else {
        console.log("Admin user created successfully");
        toast({
          title: "Demo Admin User Created",
          description: "Email: admin@example.com, Password: password123",
        });
      }
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Create a test student user
const createStudentUser = async () => {
  try {
    // Check if student@example.com already exists
    const { data: { user }, error: checkError } = await supabase.auth.signUp({
      email: 'student@example.com',
      password: 'password123',
    });

    if (checkError) {
      if (checkError.message !== 'User already registered') {
        console.error("Error checking student user:", checkError);
      }
      return;
    }

    if (user) {
      // Ensure the role is student
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'student', name: 'Student User' })
        .eq('id', user.id);

      if (updateError) {
        console.error("Error updating student role:", updateError);
      } else {
        console.log("Student user created successfully");
        toast({
          title: "Demo Student User Created",
          description: "Email: student@example.com, Password: password123",
        });
      }
    }
  } catch (error) {
    console.error("Error creating student user:", error);
  }
};

const LoginPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  useEffect(() => {
    // Set active tab from location state (used when redirecting from reset page)
    const locationState = location.state as { activeTab?: string } | undefined;
    if (locationState?.activeTab) {
      setActiveTab(locationState.activeTab);
    }
    
    // Create test users on first load (for demo purposes)
    if (!initialized) {
      createAdminUser();
      createStudentUser();
      setInitialized(true);
    }
    
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user?.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }
  }, [isAuthenticated, navigate, user, initialized, location.state]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
              <TabsContent value="forgot">
                <ForgotPasswordForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;

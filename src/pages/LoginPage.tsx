
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

const LoginPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Create a test admin user on first load (for demo purposes)
    if (!initialized) {
      createAdminUser();
      setInitialized(true);
    }
    
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }
  }, [isAuthenticated, navigate, user, initialized]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;

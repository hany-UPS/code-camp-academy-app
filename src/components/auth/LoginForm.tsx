
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check for authenticated user and redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user.role);
    }
  }, [isAuthenticated, user]);

  const redirectBasedOnRole = (role: string) => {
    console.log("Redirecting based on role:", role);
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "teacher") {
      navigate("/teacher-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      // The redirection will be handled by the useEffect when auth state changes
      // This is a backup in case the useEffect doesn't trigger
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("Current user after login (backup check):", currentUser);
        
        if (currentUser?.role) {
          redirectBasedOnRole(currentUser.role);
        } else {
          // If we still don't have the user role after login,
          // redirect to student dashboard as fallback
          navigate("/student-dashboard");
        }
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setIsSubmitting(false);
      // Toast is already shown in the auth context
    }
  };
  
  return (
    <Card className="w-[350px] sm:w-[400px] shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md"
            />
          </div>
          <div className="text-sm text-gray-500">
            <p>Demo accounts:</p>
            <p>Admin: admin@example.com / password123</p>
            <p>Student: student@example.com / password123</p>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-academy-orange hover:bg-orange-600 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, KeyRound, AlertTriangle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionLoading, setSessionLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the access token from the URL hash
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const type = hashParams.get("type");
    const error = hashParams.get("error");
    const errorDescription = hashParams.get("error_description");
    
    // Handle errors from the hash
    if (error) {
      console.error("Password reset error:", error, errorDescription);
      setHasError(true);
      const formattedError = errorDescription 
        ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
        : "Your password reset link is invalid or has expired.";
      
      setErrorMessage(formattedError);
      
      toast({
        title: "Reset link error",
        description: formattedError,
        variant: "destructive",
      });
      
      setSessionLoading(false);
      return;
    }

    // Set the session if we have an access token
    if (accessToken && type === "recovery") {
      // Set the Supabase session with the token
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || "",
      }).then(({ data, error }) => {
        if (error) {
          console.error("Session error:", error);
          setHasError(true);
          setErrorMessage("Unable to validate your reset token. Please request a new password reset link.");
          
          toast({
            title: "Session error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.log("Session established successfully");
        }
        setSessionLoading(false);
      });
    } else {
      // Check if there are error parameters in regular query params
      const searchParams = new URLSearchParams(window.location.search);
      const queryError = searchParams.get("error");
      
      if (queryError) {
        setHasError(true);
        setErrorMessage("Your password reset link is invalid or has expired. Please request a new one.");
      } else if (!accessToken) {
        setHasError(true);
        setErrorMessage("No reset token found. Please request a new password reset link.");
      }
      
      setSessionLoading(false);
    }
  }, []);

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the user's password using the established session
      const { data, error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        
        if (error.message.includes("expired") || error.message.includes("invalid")) {
          setHasError(true);
          setErrorMessage("Your password reset link has expired. Please request a new one.");
        }
      } else {
        toast({
          title: "Success",
          description: "Your password has been updated successfully",
        });
        
        // Redirect to login page after successful password reset
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-[350px] sm:w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {hasError ? "Reset Link Error" : "Set New Password"}
            </CardTitle>
            <CardDescription>
              {hasError 
                ? "Your password reset link is invalid or expired" 
                : "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-academy-orange mb-4" />
                <p className="text-sm text-gray-500">Verifying your reset token...</p>
              </div>
            ) : hasError ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500" />
                </div>
                <p className="text-center text-sm text-gray-500 mb-4">
                  {errorMessage || "The password reset link has expired or is invalid. Please request a new one."}
                </p>
                <Button 
                  onClick={() => navigate("/login", { state: { activeTab: "forgot" } })}
                  className="w-full bg-academy-orange hover:bg-orange-600 transition-colors"
                >
                  Request New Link
                </Button>
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-blue-500 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={resetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10 rounded-md"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-academy-orange hover:bg-orange-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Updating...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;

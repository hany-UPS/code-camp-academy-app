import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, KeyRound, Shield, AlertTriangle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters from the URL hash or search params
  const getQueryParams = () => {
    // Check for error in hash (Supabase often returns errors in the hash)
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get("error")) {
        return {
          error: hashParams.get("error"),
          error_code: hashParams.get("error_code"),
          error_description: hashParams.get("error_description")
        };
      }
    }
    
    // Otherwise check regular search params
    const searchParams = new URLSearchParams(window.location.search);
    return {
      error: searchParams.get("error"),
      error_code: searchParams.get("error_code"),
      error_description: searchParams.get("error_description")
    };
  };

  useEffect(() => {
    const params = getQueryParams();
    
    if (params.error) {
      setHasError(true);
      const formattedError = params.error_description 
        ? decodeURIComponent(params.error_description.replace(/\+/g, ' '))
        : "Your password reset link is invalid or has expired.";
      
      setErrorMessage(formattedError);
      
      toast({
        title: "Reset link error",
        description: formattedError,
        variant: "destructive",
      });
      
      console.log("Password reset error:", params);
    }
  }, [location]);

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
      // This will use the access token from the URL to update the user's password
      const { error } = await supabase.auth.updateUser({ password });
      
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
            {hasError ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500" />
                </div>
                <p className="text-center text-sm text-gray-500 mb-4">
                  {errorMessage || "The password reset link has expired or is invalid. Please request a new one."}
                </p>
                <Button 
                  onClick={() => navigate("/login")}
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

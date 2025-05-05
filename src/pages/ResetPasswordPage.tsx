
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, KeyRound, AlertTriangle, Mail, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state
    const locationState = location.state as { email?: string } | undefined;
    if (locationState?.email) {
      setEmail(locationState.email);
    }
    
    // Check for error parameters in the URL hash
    const hash = location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const error = params.get("error");
      const errorDescription = params.get("error_description");
      
      if (error) {
        setHasError(true);
        setErrorMessage(errorDescription || "An error occurred with your password reset request.");
        
        toast({
          title: "Reset code error",
          description: errorDescription || "Your password reset code is invalid or has expired.",
          variant: "destructive",
        });
      }
    }
  }, [location]);

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Verify OTP code with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "recovery"
      });
      
      if (error) {
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive",
        });
        setHasError(true);
        setErrorMessage(error.message);
      } else {
        toast({
          title: "Verification successful",
          description: "You can now set your new password",
        });
        setStep("reset");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        
        if (error.message.includes("expired") || error.message.includes("invalid")) {
          setHasError(true);
          setErrorMessage("Your password reset session has expired. Please request a new code.");
        }
      } else {
        toast({
          title: "Success",
          description: "Your password has been updated",
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
  
  const renderVerificationStep = () => (
    <Card className="w-[350px] sm:w-[400px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          {hasError ? "Verification Failed" : "Verify Your Email"}
        </CardTitle>
        <CardDescription>
          {hasError 
            ? "Your verification code is invalid or has expired" 
            : "Enter the 6-digit code sent to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasError ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <p className="text-center text-sm text-gray-500 mb-4">
              {errorMessage || "The verification code has expired or is invalid. Please request a new code."}
            </p>
            <Button 
              onClick={() => navigate("/login", { state: { activeTab: "forgot" } })}
              className="w-full bg-academy-orange hover:bg-orange-600 transition-colors"
            >
              Request New Code
            </Button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-blue-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="pl-10 rounded-md"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots && slots.map((slot, i) => (
                        <InputOTPSlot key={i} {...slot} index={i} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">Enter the 6-digit code sent to your email</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-academy-orange hover:bg-orange-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-blue-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
  
  const renderResetStep = () => (
    <Card className="w-[350px] sm:w-[400px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Set New Password</CardTitle>
        <CardDescription>
          Create a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        {step === "verify" ? renderVerificationStep() : renderResetStep()}
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;

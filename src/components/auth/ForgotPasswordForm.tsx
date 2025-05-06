
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send password reset link via email - using the deployed URL
      // Get current origin or use the deployed URL
      const siteUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Recovery Email Sent",
          description: "Check your email for the password reset link",
        });
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "Failed to send reset link",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-[350px] sm:w-[400px] shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          {isSuccess 
            ? "Check your email for a password reset link" 
            : "Enter your email to receive a password reset link"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> You will receive an email with a password reset link.
                Click the link to set a new password for your account.
              </p>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <Mail className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="mb-4">If an account exists with that email, we've sent a password reset link.</p>
            <div className="p-3 bg-blue-50 rounded-lg mb-4 text-left">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> Password reset links are valid for 24 hours only.
                  </p>
                  <ul className="text-sm text-blue-800 list-disc pl-5 mt-1">
                    <li>Check both your inbox and spam/junk folders</li>
                    <li>Click the link in the email to reset your password</li>
                    <li>If you don't receive the email, you can request a new link</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/login")}
              variant="default"
              className="w-full bg-academy-orange hover:bg-orange-600 transition-colors"
            >
              Return to Login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;

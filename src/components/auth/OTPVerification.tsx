
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onBack, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const [isResending, setIsResending] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerification = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Verifying OTP code:", otp);
      // Here we would normally verify the OTP with Supabase
      // For demonstration, we're simulating a verification process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit code
      // In production, you would validate against a stored code from your database
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        toast({
          title: "Code verified",
          description: "Your verification code is correct",
        });
        onVerified();
      } else {
        toast({
          title: "Incorrect code",
          description: "The code you entered is invalid. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification failed",
        description: "An error occurred while verifying your code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    
    try {
      console.log("Resending OTP for email:", email);
      // In real implementation, you would call your Supabase function to resend the OTP
      // For now, we're just simulating the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset the timer
      setTimeLeft(120);
      
      // Restart the interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast({
        title: "Code resent",
        description: `A new verification code has been sent to ${email}`,
      });
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast({
        title: "Failed to resend code",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-[350px] sm:w-[400px] shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 mr-2"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
          </Button>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
        </div>
        <CardDescription>
          Enter the 6-digit code sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center py-4">
            <InputOTP 
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isSubmitting}
              pattern="\d*"
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <Button
            className="w-full bg-academy-orange hover:bg-orange-600 transition-colors"
            onClick={handleVerification}
            disabled={isSubmitting || otp.length !== 6}
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
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p className="mb-1">
              {timeLeft > 0 ? (
                <>Code expires in {formatTime(timeLeft)}</>
              ) : (
                <>Code expired</>
              )}
            </p>
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-academy-blue"
              onClick={handleResendOTP}
              disabled={timeLeft > 0 || isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend code"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;

"use client";

import { toast } from "sonner";
import { useState } from "react";
import CTA from "@/components/cta";
import Form from "@/components/form";
// import Logos from "@/components/logos";
import Particles from "@/components/ui/particles";
import Header from "@/components/header";
import Footer from "@/components/footer";
//import WalletStatus from "@/components/wallet-status";
import { useSignInWithEmail, useVerifyEmailOTP, useCurrentUser, useSignOut } from "@coinbase/cdp-hooks";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [flowId, setFlowId] = useState<string>("");
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const signInWithEmail = useSignInWithEmail();
  const verifyEmailOTP = useVerifyEmailOTP();
  const currentUser = useCurrentUser();
  const signOut = useSignOut();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Step 1: Initial form submission - send OTP
    if (!showOtpInput) {
      if (!email) {
        toast.error("Please enter your email address 😠");
        return;
      }

      if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address 😠");
        return;
      }

      setLoading(true);

      try {
        console.log("Attempting to sign in with email");
        
        // Check if user is already authenticated and sign out if needed
        if (currentUser) {
          console.log("User already authenticated, signing out first");
          await signOut();
          // Wait longer to ensure signout completes and state updates
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Retry logic for sign in - sometimes CDP needs extra time to clear state
        let result;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            result = await signInWithEmail({ email });
            break; // Success, exit retry loop
          } catch (retryError) {
            if (retryError instanceof Error && retryError.message.includes("already authenticated") && retryCount < maxRetries - 1) {
              console.log(`Retry ${retryCount + 1}: Still authenticated, waiting longer...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              retryCount++;
            } else {
              throw retryError; // Re-throw if not authentication error or max retries reached
            }
          }
        }
        
        console.log("Sign in result:", result ? "success" : "failed");
        
        if (result && result.flowId) {
          setFlowId(result.flowId);
          setShowOtpInput(true);
          toast.success("OTP sent to your email! Please check your inbox 📧");
        } else {
          throw new Error("No flowId received from signInWithEmail");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        
        // Handle specific error case for already authenticated users
        if (error instanceof Error && error.message.includes("already authenticated")) {
          toast.error("Authentication state conflict. Please refresh the page and try again 😊");
        } else {
          toast.error(`Failed to send OTP: ${error instanceof Error ? error.message : 'Unknown error'} 😢`);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 2: OTP verification and wallet creation
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP 😠");
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        // Verify OTP and complete wallet creation
        const { user } = await verifyEmailOTP({ flowId, otp });
        const walletAddress = user.evmAccounts?.[0];

        if (!walletAddress) {
          reject("Wallet creation failed");
          return;
        }

        // Send welcome email
        const mailResponse = await fetch("/api/mail", {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstname: email.split('@')[0], email }),
        });

        if (!mailResponse.ok) {
          if (mailResponse.status === 429) {
            reject("Rate limited");
          } else {
            reject("Email sending failed");
          }
          return;
        }

        // Save to Notion with wallet address
        const notionResponse = await fetch("/api/notion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: email.split('@')[0], email, walletAddress }),
        });

        if (!notionResponse.ok) {
          if (notionResponse.status === 429) {
            reject("Rate limited");
          } else if (notionResponse.status === 409) {
            reject("Email already registered");
          } else {
            reject("Notion insertion failed");
          }
        } else {
          resolve({ email });
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("invalid") || errorMessage.includes("otp")) {
          reject("Invalid OTP");
        } else {
          reject("Verification failed");
        }
      }
    });

    toast.promise(promise, {
      loading: "Verifying OTP and creating wallet... 🚀",
      success: () => {
        setEmail("");
        setOtp("");
        setShowOtpInput(false);
        setFlowId("");
        return "Welcome! Your wallet has been created and you're on the waitlist 🎉";
      },
      error: (error) => {
        if (error === "Rate limited") {
          return "You're doing that too much. Please try again later";
        } else if (error === "Email sending failed") {
          return "Failed to send email. Please try again 😢.";
        } else if (error === "Email already registered") {
          return "This email is already on the waitlist! 🎉";
        } else if (error === "Notion insertion failed") {
          return "Failed to save your details. Please try again 😢.";
        } else if (error === "Invalid OTP") {
          return "Invalid OTP. Please check and try again 😢.";
        } else if (error === "Wallet creation failed") {
          return "Failed to create wallet. Please try again 😢.";
        }
        return "An error occurred. Please try again 😢.";
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-12 md:pt-24">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <Header />

        <CTA />

        <Form
          email={email}
          otp={otp}
          showOtpInput={showOtpInput}
          handleEmailChange={handleEmailChange}
          handleOtpChange={handleOtpChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />

      </section>

      <Footer />


      <Particles
        quantityDesktop={350}
        quantityMobile={100}
        ease={80}
        color={"#F7FF9B"}
        refresh
      />

      
    </main>
  );
}

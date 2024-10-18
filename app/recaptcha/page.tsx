
"use client";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ReCaptchaPage = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login"); // Default to "login"

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode") as "login" | "register";
    if (modeParam) {
      setMode(modeParam); // Set mode based on the URL parameter
    }
  }, []);

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token); // Save the reCAPTCHA token when it's solved
    setErrorMessage(null); // Clear any previous error message when reCAPTCHA is solved
  };

  const handleSubmit = () => {
    if (!recaptchaToken) {
      setErrorMessage("Please solve the reCAPTCHA."); // Set error message
      return;
    }

    // Redirect based on the mode
    if (mode === "login") {
      router.push("/auth/login"); // Redirect to login page
    } else {
      router.push("/auth/register"); // Redirect to register page
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Verify You're Human</h1>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECATCHA_SITE_KEY!}
        onChange={onRecaptchaChange}
      />
      {errorMessage && ( // Conditionally render the error message
        <p className="text-red-500 mt-2">{errorMessage}</p>
      )}
      <Button onClick={handleSubmit} className="mt-4">Submit</Button>
    </div>
  );
};

export default ReCaptchaPage;
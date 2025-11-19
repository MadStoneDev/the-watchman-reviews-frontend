"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconMail } from "@tabler/icons-react";
import { handleAuth, verifyOtp } from "@/src/app/(auth)/auth/portal/actions";
import OTPInput from "@/src/components/otp-input";

// reCAPTCHA types
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

export default function CreateOrLoginForm() {
  const router = useRouter();
  // States
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [showEmailFeedback, setShowEmailFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
  });

  // Check if reCAPTCHA is loaded
  useEffect(() => {
    const checkRecaptcha = () => {
      if (typeof window !== "undefined" && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setRecaptchaLoaded(true);
        });
      } else {
        // Retry after a short delay if reCAPTCHA hasn't loaded yet
        setTimeout(checkRecaptcha, 100);
      }
    };

    checkRecaptcha();
  }, []);

  // Get reCAPTCHA token
  const getRecaptchaToken = async (action: string): Promise<string | null> => {
    if (!recaptchaLoaded || !window.grecaptcha) {
      console.warn("reCAPTCHA not loaded yet");
      return null;
    }

    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            { action },
          );
          resolve(token);
        } catch (error) {
          console.error("reCAPTCHA failed:", error);
          resolve(null);
        }
      });
    });
  };

  // Functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      // Prevent spaces completely by removing any space the user tries to type
      const noSpacesValue = e.target.value.replace(/\s/g, "");

      // Update the form data with the no-spaces value
      setFormData({
        ...formData,
        [e.target.name]: noSpacesValue,
      });

      if (!isEmailDirty) setIsEmailDirty(true);
      validateEmail(noSpacesValue);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const validateEmail = (value: string) => {
    // More comprehensive email regex that prevents consecutive dots and requires proper domain format
    const emailRegex =
      /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
    setIsValidEmail(emailRegex.test(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken("login");

      if (!recaptchaToken) {
        setServerError(
          "Security check failed. Please refresh the page and try again.",
        );
        setIsSubmitting(false);
        return;
      }

      // Create FormData object
      const formDataObj = new FormData();
      formDataObj.append("email", formData.email);
      formDataObj.append("recaptcha-token", recaptchaToken);

      const response = await handleAuth(formDataObj);

      if (!response.success) {
        setServerError(response.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      // Show OTP input
      setShowOtpInput(true);
      // Store email in session storage for potential recovery
      try {
        sessionStorage.setItem("authEmail", formData.email);
      } catch (e) {
        console.error("Storage error:", e);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("Form submission error:", error);
      setServerError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      setServerError("Please enter all 6 digits of the verification code");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const formDataObj = new FormData();

      if (process.env.NODE_ENV === "production") {
        // Get reCAPTCHA token for OTP verification
        const recaptchaToken = await getRecaptchaToken("verify_otp");

        if (!recaptchaToken) {
          setServerError(
            "Security check failed. Please refresh the page and try again.",
          );
          setIsSubmitting(false);
          return;
        }

        formDataObj.append("recaptcha-token", recaptchaToken);
      }

      formDataObj.append("email", formData.email);
      formDataObj.append("otp", otp);

      const response = await verifyOtp(formDataObj);

      if (!response.success) {
        setServerError(response.error || "Invalid code. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (response.redirectTo) {
        router.push(response.redirectTo);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setServerError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  // Show feedback after user has typed something and when email is invalid
  useEffect(() => {
    setShowEmailFeedback(
      isEmailDirty && !isValidEmail && formData.email.length > 0,
    );
  }, [isEmailDirty, isValidEmail, formData.email]);

  if (showOtpInput) {
    return (
      <form
        onSubmit={handleVerifyOtp}
        className={`mt-10 mb-4 grid gap-y-4 text-sm placeholder:text-sm text-neutral-900`}
      >
        <h3 className="text-base font-medium text-lime-400">
          Enter the 6-digit code sent to your email
        </h3>

        <div className="mt-2">
          <OTPInput
            value={otp}
            onChange={handleOtpChange}
            length={6}
            className={`flex justify-center w-full`}
            inputClassName={`h-12 w-12 bg-transparent text-xl text-neutral-100 border-neutral-500 focus:border-lime-400`}
            autoFocus
          />
        </div>

        {/* Server error message */}
        {serverError && (
          <section
            className={`px-3 py-3 bg-red-100 text-red-700 rounded-lg text-left text-xs`}
          >
            {serverError}
          </section>
        )}

        <button
          type="submit"
          className={`p-3 rounded-lg bg-lime-400 text-neutral-900 font-bold ${
            isSubmitting ? "opacity-70" : ""
          }`}
          disabled={otp.length !== 6 || isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>

        <p className="text-xs text-center text-neutral-400 mt-2">
          Didn't receive the code?{" "}
          <button
            type="button"
            className="text-lime-400 underline"
            onClick={() => {
              setShowOtpInput(false);
              setOtp("");
              setServerError(null);
            }}
          >
            Go back
          </button>{" "}
          or check your spam folder
        </p>
      </form>
    );
  }

  return (
    <>
      <p className={`my-4 text-sm text-neutral-400`}>
        We'll send a 6-digit verification code to your email. Simply enter the
        code on the next screen to sign in. If there's no account associated
        with your email, we'll create one for you automatically.
      </p>
      <form
        onSubmit={handleSubmit}
        className={`mt-10 mb-4 grid gap-y-4 text-sm placeholder:text-sm text-neutral-900`}
      >
        <section className={`relative grid`}>
          <div
            className={`absolute px-3 top-0 bottom-0 left-0 grid place-items-center`}
          >
            <IconMail />
          </div>

          <input
            className={`pr-3 pl-12 h-12 rounded-lg bg-neutral-200 placeholder:text-neutral-600/80 placeholder:text-sm ${
              showEmailFeedback ? "border-2 border-red-500" : ""
            } focus:outline-none`}
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => setIsEmailDirty(true)}
            onKeyDown={(e) => {
              // Prevent space key from being entered
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
            disabled={isSubmitting}
          />

          {isValidEmail && formData.email.length > 0 && (
            <div className="absolute right-3 top-0 bottom-0 grid place-items-center text-green-600">
              <IconCheck size={20} />
            </div>
          )}
        </section>

        {/* Email format error */}
        <section
          className={`px-3 ${
            showEmailFeedback ? "mb-4 py-3 max-h-52" : "py-0 max-h-0"
          } bg-red-100 text-red-700
         rounded-lg text-left text-xs h-max transition-all duration-300 ease-in-out overflow-hidden`}
        >
          Please enter a valid email address
          <br />
          <span className={`opacity-50`}>
            (example: bruce@wayneenterprises.com)
          </span>
        </section>

        {/* Server error message */}
        {serverError && (
          <section
            className={`px-3 py-3 bg-red-100 text-red-700 rounded-lg text-left text-xs`}
          >
            {serverError}
          </section>
        )}

        <button
          type="submit"
          className={`p-3 rounded-lg bg-lime-400 text-neutral-900 font-bold ${
            isSubmitting ? "opacity-70" : ""
          }`}
          disabled={!isValidEmail || isSubmitting || !recaptchaLoaded}
        >
          {isSubmitting
            ? "Sending..."
            : !recaptchaLoaded
              ? "Loading..."
              : "Get Access"}
        </button>

        {/* reCAPTCHA disclaimer */}
        <p className="text-xs text-center text-neutral-500 mt-2">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-lime-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            className="text-lime-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </form>
    </>
  );
}

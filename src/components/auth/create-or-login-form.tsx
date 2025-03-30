﻿"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconMail, IconKey } from "@tabler/icons-react";
import { handleAuth, verifyOtp } from "@/src/app/(auth)/auth/portal/actions";

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

  const [formData, setFormData] = useState({
    email: "",
  });

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
    } else if (e.target.name === "otp") {
      const numericValue = e.target.value.replace(/[^0-9]/g, "");
      setOtp(numericValue);
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

    // Create FormData object
    const formDataObj = new FormData();
    formDataObj.append("email", formData.email);

    try {
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
      setServerError("Please enter a valid 6-digit code");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const formDataObj = new FormData();
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

        <section className={`relative grid`}>
          <div
            className={`absolute px-3 top-0 bottom-0 left-0 grid place-items-center`}
          >
            <IconKey />
          </div>

          <input
            className={`pr-3 pl-12 h-12 rounded-lg bg-neutral-200 placeholder:text-neutral-600/80 placeholder:text-sm
            focus:outline-none text-center tracking-widest font-mono text-lg`}
            name="otp"
            type="text"
            placeholder="000000"
            value={otp}
            onChange={handleChange}
            maxLength={6}
            disabled={isSubmitting}
            autoFocus
          />
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
        disabled={!isValidEmail || isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Get Access"}
      </button>
    </form>
  );
}

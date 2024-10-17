"use client";

import React, { useState } from "react";
import {
  IconCheck,
  IconCircleXFilled,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconXboxXFilled,
} from "@tabler/icons-react";

export default function RegisterForm() {
  // Constants
  const minPasswordLength = 12;

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(false);
  const [confirmPasswordFeedback, setConfirmPasswordFeedback] = useState(false);

  const [emailFeedback, setEmailFeedback] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    passwordLength: 0,
    passwordUppercase: 0,
    passwordLowercase: 0,
    passwordNumber: 0,
    passwordSpecial: 0,
    passwordStrength: 0,
    passwordMatch: false,
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password") {
      handlePasswordStrength(e.target.value);
    } else if (e.target.name === "confirmPassword") {
      handleConfirmPasswordStrength(e.target.value);
    } else if (e.target.name === "email") {
      handleEmailCheck(e.target.value);
    }
  };

  const handleEmailCheck = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailFeedback(emailRegex.test(value));
  };

  const handlePasswordStrength = (value: string) => {
    const passwordLength = value.length;
    const passwordUppercase = value.match(/[A-Z]/g)?.length ?? 0;
    const passwordLowercase = value.match(/[a-z]/g)?.length ?? 0;
    const passwordNumber = value.match(/\d/g)?.length ?? 0;
    const passwordSpecial = value.match(/[^a-zA-Z0-9]/g)?.length ?? 0;

    setPasswordChecks({
      ...passwordChecks,
      passwordLength,
      passwordUppercase,
      passwordLowercase,
      passwordNumber,
      passwordSpecial,
      passwordStrength:
        (passwordLength > minPasswordLength ? 1 : 0) *
        (passwordUppercase > 0 ? 1 : 0) *
        (passwordLowercase > 0 ? 1 : 0) *
        (passwordNumber > 0 ? 1 : 0) *
        (passwordSpecial > 0 ? 2 : 1),
    });
  };

  const handleConfirmPasswordStrength = (value: string) => {
    setPasswordChecks({
      ...passwordChecks,
      passwordMatch: value === formData.password,
    });
  };

  return (
    <form
      className={`mt-10 mb-4 grid gap-y-4 text-sm placeholder:text-sm text-neutral-900`}
    >
      <section className={`relative grid`}>
        <div
          className={`absolute px-3 top-0 bottom-0 left-0 grid place-items-center`}
        >
          <IconMail />
        </div>

        <input
          className={`pr-3 pl-12 h-12 rounded-lg bg-neutral-200 placeholder:text-neutral-600/80 placeholder:text-sm`}
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
      </section>

      <section className={`relative grid h-12`}>
        <div
          className={`absolute px-3 top-0 bottom-0 left-0 h-full grid place-items-center`}
        >
          <IconLock />
        </div>

        <input
          className={`pr-3 pl-12 rounded-lg bg-neutral-200 placeholder:text-neutral-600/80 placeholder:text-sm ${
            showPassword ? "" : "text-xl"
          }`}
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onFocus={() => setPasswordFeedback(true)}
          onBlur={() => setPasswordFeedback(false)}
        />

        <article
          className={`absolute px-3 top-0 bottom-0 right-0 grid place-items-center`}
        >
          <div
            className={`cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </div>
        </article>
      </section>

      <section
        className={`px-3 ${
          passwordFeedback ? "mb-4 py-3 max-h-52" : "py-0 max-h-0"
        } ${
          passwordChecks.passwordStrength > 0
            ? passwordChecks.passwordStrength > 1
              ? "bg-lime-400"
              : "bg-amber-600"
            : "bg-neutral-500"
        } rounded-lg text-left text-xs h-max transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <p>A secure password should have:</p>
        <ul className={`my-1 indent-4 flex flex-col gap-1`}>
          <li
            className={`flex items-center gap-1 ${
              passwordChecks.passwordLength > minPasswordLength
                ? "font-bold"
                : ""
            } transition-all duration-300 ease-in-out`}
          >
            - At least {minPasswordLength} characters long
            {passwordChecks.passwordLength > minPasswordLength ? (
              <span className={`text-lime-400`}>
                <IconCheck size={16} />
              </span>
            ) : null}
          </li>
          <li
            className={`flex items-center gap-1 ${
              passwordChecks.passwordUppercase > 0 ? "font-bold" : ""
            } transition-all duration-300 ease-in-out`}
          >
            - At least 1 uppercase letter
            {passwordChecks.passwordUppercase > 0 ? (
              <span className={`text-lime-400`}>
                <IconCheck size={16} />
              </span>
            ) : null}
          </li>
          <li
            className={`flex items-center gap-1 ${
              passwordChecks.passwordLowercase > 0 ? "font-bold" : ""
            } transition-all duration-300 ease-in-out`}
          >
            - At least 1 lowercase letter
            {passwordChecks.passwordLowercase > 0 ? (
              <span className={`text-lime-400`}>
                <IconCheck size={16} />
              </span>
            ) : null}
          </li>
          <li
            className={`flex items-center gap-1 ${
              passwordChecks.passwordNumber > 0 ? "font-bold" : ""
            } transition-all duration-300 ease-in-out`}
          >
            - Have at least 1 number
            {passwordChecks.passwordNumber > 0 ? (
              <span className={`text-lime-400`}>
                <IconCheck size={16} />
              </span>
            ) : null}
          </li>
          <li
            className={`flex items-center gap-1 ${
              passwordChecks.passwordSpecial > 0 ? "font-bold" : ""
            } transition-all duration-300 ease-in-out`}
          >
            - Have at least 1 special character
            {passwordChecks.passwordSpecial > 0 ? (
              <span className={`text-lime-400`}>
                <IconCheck size={16} />
              </span>
            ) : null}
          </li>
        </ul>
      </section>

      <section className={`-mt-4 relative grid`}>
        <div
          className={`absolute px-3 top-0 bottom-0 left-0 grid place-items-center`}
        >
          <IconLock />
        </div>

        <input
          className={`pl-12 h-12 rounded-lg bg-neutral-200 placeholder:text-neutral-600/80 placeholder:text-sm ${
            showConfirmPassword ? "" : "px-3 text-xl"
          }`}
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onFocus={() => setConfirmPasswordFeedback(true)}
          onBlur={() => setConfirmPasswordFeedback(false)}
        />

        <article
          className={`absolute px-3 top-0 bottom-0 right-0 grid place-items-center`}
        >
          <div
            className={`cursor-pointer`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
          </div>
        </article>
      </section>

      <section
        className={`px-3 ${
          confirmPasswordFeedback ? "mb-4 py-3 max-h-52" : "py-0 max-h-0"
        } bg-neutral-500 rounded-lg text-left text-xs h-max transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <p>
          Password {passwordChecks.passwordMatch ? "" : "do not"} currently
          match
        </p>
      </section>

      <button
        className={`p-3 rounded-lg bg-lime-400 text-neutral-900 font-bold`}
      >
        Create
      </button>
    </form>
  );
}

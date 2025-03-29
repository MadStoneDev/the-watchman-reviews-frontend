"use client";

import React, { useState } from "react";
import { IconEye, IconEyeOff, IconLock, IconMail } from "@tabler/icons-react";

export default function LoginForm() {
  // States
  const [showPassword, setShowPassword] = useState(false);

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

      <button
        className={`p-3 rounded-lg bg-lime-400 text-neutral-900 font-bold`}
      >
        Login
      </button>
    </form>
  );
}

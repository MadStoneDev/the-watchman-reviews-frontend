import React from "react";
import CreateOrLoginForm from "@/src/components/auth/create-or-login-form";

export const metadata = {
  title: "Create a New Account | JustReel",
  description:
    "Register for a new account on  JustReel to track shows and movies and join the community.",
};

export default function Register() {
  return (
    <>
      <head>
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        ></script>
      </head>

      <h1 className={`sm:xl md:text-xl font-bold text-lime-400`}>
        Create an Account or Login
      </h1>
      <h2 className={`mt-1 text-lg font-light`}>Welcome to JustReel!</h2>

      <CreateOrLoginForm />
    </>
  );
}

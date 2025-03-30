import React from "react";
import CreateOrLoginForm from "@/src/components/auth/create-or-login-form";

export const metadata = {
  title: "Create a New Account - The Watchman Reviews",
  description:
    "Register for a new account on The Watchman Reviews to track shows and movies and join the community.",
};

export default function Register() {
  return (
    <>
      <h1 className={`sm:xl md:text-xl font-bold text-lime-400`}>
        Create an Account or Login
      </h1>
      <h2 className={`mt-1 text-lg font-light`}>
        Welcome to The Watchman Reviews!
      </h2>

      <CreateOrLoginForm />
    </>
  );
}

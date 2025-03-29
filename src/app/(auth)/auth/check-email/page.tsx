﻿import React from "react";

export default function CheckEmailPage() {
  return (
    <>
      <h1 className={`sm:xl md:text-xl font-bold text-lime-400`}>
        Awesome! Check your email
      </h1>
      <h2 className={`mt-1 font-light`}>
        We've sent the magic there! You should receive an email from us in a few
        minutes.
      </h2>

      <p className={`mt-10 text-sm opacity-50`}>
        Remember to check your spam folder!
      </p>
    </>
  );
}

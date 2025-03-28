import React from "react";

export default function CheckEmailPage() {
  return (
    <>
      <h1 className={`sm:xl md:text-xl font-bold text-lime-400`}>
        Check your email
      </h1>
      <h2 className={`mt-1 font-light`}>
        We just need you to verify your email
      </h2>

      <p className={`mt-10 text-sm opacity-50`}>
        Remeber to check your spam folder!
      </p>
    </>
  );
}

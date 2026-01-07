import React from "react";
import Script from "next/script";
import CreateOrLoginForm from "@/src/components/auth/create-or-login-form";

export const metadata = {
    title: "Create a New Account | JustReel",
    description:
        "Register for a new account on JustReel to track shows and movies and join the community.",
};

export default function Register() {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    return (
        <>
            {/* Only load reCAPTCHA if the site key is configured */}
            {recaptchaSiteKey && (
                <Script
                    src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
                    strategy="lazyOnload"
                />
            )}

            <h1 className={`sm:xl md:text-xl font-bold text-lime-400`}>
                Create an Account or Login
            </h1>
            <h2 className={`mt-1 text-lg font-light`}>Welcome to JustReel!</h2>

            <CreateOrLoginForm />
        </>
    );
}
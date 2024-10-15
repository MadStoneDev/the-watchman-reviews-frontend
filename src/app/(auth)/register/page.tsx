﻿import {
  IconBrandFacebookFilled,
  IconBrandGoogleFilled,
  IconBrandTwitch,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Create a New Account - The Watchman Reviews",
  description:
    "Register for a new account on The Watchman Reviews to track shows and movies and join the community.",
};

export default function Register() {
  return (
    <div className={`w-full max-w-sm`}>
      <h1 className={`sm:xl md:text-xl font-bold text-lime-400`}>
        Create a New Account
      </h1>
      <h2 className={`mt-1 font-light`}>Welcome to The Watchman Reviews!</h2>
      <form className={`mt-10 mb-4 grid gap-y-4 text-sm text-neutral-900`}>
        <article className={`relative grid`}>
          <div
            className={`absolute px-3 top-0 bottom-0 left-0 grid place-items-center`}
          >
            <IconMail />
          </div>

          <input
            className={`p-3 pl-12 rounded-lg bg-neutral-200 placeholder:text-neutral-600/80`}
            type="email"
            placeholder="Email"
          />
        </article>

        <article className={`relative grid`}>
          <div
            className={`absolute px-3 top-0 bottom-0 left-0 grid place-items-center`}
          >
            <IconLock />
          </div>

          <input
            className={`p-3 pl-12 rounded-lg bg-neutral-200 placeholder:text-neutral-600/80`}
            type="password"
            placeholder="Password"
          />
        </article>

        <button
          className={`p-3 rounded-lg bg-lime-400 text-neutral-900 font-bold`}
        >
          Create
        </button>
      </form>

      <div className={`relative flex justify-center items-center`}>
        <div className={`w-full h-[1px] bg-neutral-200`}></div>
        <h4 className={`p-3 min-w-fit text-sm z-10`}>
          or <span className={`font-bold`}>Register</span> with
        </h4>
        <div className={`w-full h-[1px] bg-neutral-200`}></div>
      </div>

      <article className={`mt-4 flex flex-col gap-4`}>
        <button
          className={`p-2 flex items-center justify-center gap-2 w-full rounded-lg border`}
        >
          <IconBrandGoogleFilled />
          <span className={``}>Google</span>
        </button>

        <button
          className={`p-2 flex items-center justify-center gap-2 w-full rounded-lg border`}
        >
          <IconBrandFacebookFilled />
          <span className={``}>Facebook</span>
        </button>

        <button
          className={`p-2 flex items-center justify-center gap-2 w-full rounded-lg border`}
        >
          <IconBrandTwitch />
          <span className={``}>Twitch</span>
        </button>
      </article>

      <p className={`mt-8 text-xs`}>
        Already have an account?{" "}
        <Link
          href={`/login`}
          className={`font-bold hover:text-lime-400 transition-all duration-300 ease-in-out`}
        >
          Login
        </Link>
      </p>
    </div>
  );
}

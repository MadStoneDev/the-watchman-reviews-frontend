import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | JustReel",
  description:
    "Learn how JustReel collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 22, 2026";

  return (
    <>
      <section className="mt-6 lg:mt-8 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Privacy Policy
        </h1>
        <p className="text-neutral-400 mt-2">Last updated: {lastUpdated}</p>
      </section>

      <section className="mt-8 mb-12 max-w-4xl">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
            <p className="text-neutral-300 leading-relaxed">
              At JustReel, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our platform. Please read this policy
              carefully. By using JustReel, you agree to the collection and use
              of information in accordance with this policy.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                1
              </span>
              Information We Collect
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <div>
                <h3 className="font-medium text-neutral-200 mb-2">
                  Account Information
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  When you create an account, we collect your email address,
                  username, and any profile information you choose to provide
                  (such as profile picture and bio). We use secure
                  authentication provided by Supabase.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-200 mb-2">
                  Usage Data
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We collect information about how you interact with JustReel,
                  including the movies and TV shows you track, your watchlists,
                  reactions (likes, loves), and episode progress. This helps us
                  provide personalized recommendations and improve your
                  experience.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-200 mb-2">
                  Device and Analytics Data
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We use Google Analytics and similar services to collect
                  anonymous data about how visitors use our platform. This
                  includes information such as browser type, device type,
                  pages visited, time spent on pages, and general geographic
                  location (country/region level). This data is aggregated and
                  does not personally identify you.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                2
              </span>
              How We Use Your Information
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <ul className="space-y-3 text-neutral-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Provide and maintain the JustReel service, including
                    tracking your watched content and generating recommendations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Personalize your experience with AI-powered recommendations
                    based on your viewing history
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Enable social features like sharing collections and
                    following other users
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Analyze usage patterns to improve our platform and develop
                    new features
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Communicate with you about updates, new features, or support
                    requests
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Detect and prevent fraud, abuse, or security issues
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Sharing */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                3
              </span>
              Data Sharing and Third Parties
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                We do not sell your personal information. We may share data with
                the following third parties:
              </p>
              <ul className="space-y-3 text-neutral-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>
                    <strong className="text-neutral-200">
                      Service Providers:
                    </strong>{" "}
                    We use Supabase for authentication and database services,
                    Vercel for hosting, and The Movie Database (TMDB) for movie
                    and TV show information.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>
                    <strong className="text-neutral-200">
                      Analytics Providers:
                    </strong>{" "}
                    We use Google Analytics to understand how users interact
                    with our platform. Google may collect information about your
                    use of our website according to their own privacy policy.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>
                    <strong className="text-neutral-200">
                      Legal Requirements:
                    </strong>{" "}
                    We may disclose information if required by law or to protect
                    the rights, property, or safety of JustReel, our users, or
                    others.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cookies and Tracking */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                4
              </span>
              Cookies and Tracking Technologies
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>Keep you signed in to your account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>Remember your preferences and settings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Analyze traffic and usage patterns (via Google Analytics)
                  </span>
                </li>
              </ul>
              <p className="text-neutral-400 text-sm leading-relaxed">
                You can control cookies through your browser settings. Disabling
                cookies may affect certain features of the platform.
              </p>
            </div>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                5
              </span>
              Data Security
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. Our platform
                uses HTTPS encryption, secure authentication through Supabase,
                and follows industry best practices for data protection.
                However, no method of transmission over the Internet is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                6
              </span>
              Your Rights
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                Depending on your location, you may have certain rights
                regarding your personal information:
              </p>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>
                    Access and receive a copy of your personal data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Correct inaccurate or incomplete information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Request deletion of your account and associated data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Opt out of analytics tracking</span>
                </li>
              </ul>
              <p className="text-neutral-400 text-sm leading-relaxed">
                To exercise these rights, please contact us through the
                information provided below.
              </p>
            </div>
          </div>

          {/* Children's Privacy */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                7
              </span>
              Children&apos;s Privacy
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                JustReel is not intended for children under the age of 13. We do
                not knowingly collect personal information from children under
                13. If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us so we
                can delete the information.
              </p>
            </div>
          </div>

          {/* Changes */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                8
              </span>
              Changes to This Policy
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last updated&quot; date. We encourage
                you to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                9
              </span>
              Contact Us
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at{" "}
                <a
                  href="mailto:privacy@justreel.app"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  privacy@justreel.app
                </a>
                .
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/terms-of-use"
              className="text-sm text-neutral-400 hover:text-amber-400 transition-colors"
            >
              Terms of Use →
            </Link>
            <Link
              href="/about"
              className="text-sm text-neutral-400 hover:text-amber-400 transition-colors"
            >
              About JustReel →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

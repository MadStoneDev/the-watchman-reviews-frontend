import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | JustReel",
  description:
    "Read the terms and conditions for using the JustReel platform.",
};

export default function TermsOfUsePage() {
  const lastUpdated = "January 22, 2026";

  return (
    <>
      <section className="mt-6 lg:mt-8 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Terms of Use
        </h1>
        <p className="text-neutral-400 mt-2">Last updated: {lastUpdated}</p>
      </section>

      <section className="mt-8 mb-12 max-w-4xl">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
            <p className="text-neutral-300 leading-relaxed">
              Welcome to JustReel! These Terms of Use govern your access to and
              use of the JustReel platform, including our website, services, and
              features. By creating an account or using JustReel, you agree to
              be bound by these terms. If you do not agree, please do not use
              our services.
            </p>
          </div>

          {/* Acceptance of Terms */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                1
              </span>
              Acceptance of Terms
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                By accessing or using JustReel, you confirm that you are at
                least 13 years old and have the legal capacity to enter into
                these Terms. If you are using JustReel on behalf of an
                organization, you represent that you have authority to bind that
                organization to these Terms.
              </p>
            </div>
          </div>

          {/* Description of Service */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                2
              </span>
              Description of Service
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-3">
              <p className="text-neutral-400 text-sm leading-relaxed">
                JustReel is a platform that allows users to:
              </p>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Track movies and TV shows they&apos;ve watched or want to watch
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Create and share collections of media with others
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Receive personalized recommendations based on viewing history
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Track episode progress for TV series
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>
                    Connect with other users and share viewing experiences
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* User Accounts */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                3
              </span>
              User Accounts
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <div>
                <h3 className="font-medium text-neutral-200 mb-2">
                  Account Registration
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  To access certain features, you must create an account. You
                  agree to provide accurate, current, and complete information
                  during registration and to update such information to keep it
                  accurate.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-200 mb-2">
                  Account Security
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account. Notify us immediately of any unauthorized
                  use of your account.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-200 mb-2">
                  Account Termination
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We reserve the right to suspend or terminate your account at
                  any time for violation of these Terms or for any other reason
                  at our discretion. You may also delete your account at any
                  time through your account settings.
                </p>
              </div>
            </div>
          </div>

          {/* Acceptable Use */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                4
              </span>
              Acceptable Use
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                You agree not to:
              </p>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    Use JustReel for any unlawful purpose or in violation of
                    any applicable laws
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    Harass, abuse, threaten, or intimidate other users
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    Post or share content that is illegal, harmful, defamatory,
                    or infringes on others&apos; rights
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    Attempt to gain unauthorized access to our systems or other
                    users&apos; accounts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    Use automated systems or bots to access the platform without
                    permission
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    Interfere with or disrupt the integrity or performance of
                    the service
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    Impersonate any person or entity, or misrepresent your
                    affiliation
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* User Content */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                5
              </span>
              User Content
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                You retain ownership of any content you submit to JustReel
                (such as collection names, profile information, and comments).
                However, by submitting content, you grant JustReel a
                non-exclusive, worldwide, royalty-free license to use, display,
                and distribute that content in connection with providing the
                service.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                We reserve the right to remove any content that violates these
                Terms or that we find objectionable, without prior notice.
              </p>
            </div>
          </div>

          {/* Third-Party Content */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                6
              </span>
              Third-Party Content and Services
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                JustReel displays movie and TV show information sourced from{" "}
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-400 hover:text-lime-300 transition-colors"
                >
                  The Movie Database (TMDB)
                </a>
                . This includes titles, descriptions, posters, cast information,
                and other metadata. This content is provided &quot;as is&quot; and we
                make no guarantees about its accuracy or completeness. This
                product uses the TMDB API but is not endorsed or certified by
                TMDB.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                JustReel is not affiliated with any movie studio, streaming
                service, or content provider. We do not host or distribute any
                movies or TV shows.
              </p>
            </div>
          </div>

          {/* Intellectual Property */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                7
              </span>
              Intellectual Property
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                The JustReel name, logo, and all related names, logos, product
                and service names, designs, and slogans are trademarks of
                JustReel. You may not use these marks without our prior written
                permission. All other names, logos, product and service names,
                designs, and slogans on the platform are the trademarks of their
                respective owners.
              </p>
            </div>
          </div>

          {/* Disclaimer of Warranties */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                8
              </span>
              Disclaimer of Warranties
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed uppercase font-medium">
                JustReel is provided &quot;as is&quot; and &quot;as available&quot; without any
                warranties of any kind, either express or implied, including but
                not limited to the implied warranties of merchantability,
                fitness for a particular purpose, or non-infringement. We do
                not warrant that the service will be uninterrupted, error-free,
                or secure.
              </p>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                9
              </span>
              Limitation of Liability
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                To the fullest extent permitted by applicable law, JustReel
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss
                of data, use, goodwill, or other intangible losses, resulting
                from your access to or use of (or inability to access or use)
                the service.
              </p>
            </div>
          </div>

          {/* Indemnification */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                10
              </span>
              Indemnification
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                You agree to defend, indemnify, and hold harmless JustReel and
                its officers, directors, employees, and agents from and against
                any claims, liabilities, damages, judgments, awards, losses,
                costs, expenses, or fees arising out of or relating to your
                violation of these Terms or your use of the service.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                11
              </span>
              Changes to Terms
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                We may revise these Terms from time to time. The most current
                version will always be posted on this page with the effective
                date. By continuing to use JustReel after changes become
                effective, you agree to be bound by the revised Terms. If you
                do not agree to the new Terms, please stop using the service.
              </p>
            </div>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                12
              </span>
              Governing Law
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of Australia, without regard to its conflict of
                law provisions. Any disputes arising from these Terms or your
                use of JustReel shall be resolved in the courts of Australia.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                13
              </span>
              Contact Us
            </h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                If you have any questions about these Terms of Use, please
                contact us at{" "}
                <a
                  href="mailto:support@justreel.app"
                  className="text-lime-400 hover:text-lime-300 transition-colors"
                >
                  support@justreel.app
                </a>
                .
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/privacy-policy"
              className="text-sm text-neutral-400 hover:text-lime-400 transition-colors"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/about"
              className="text-sm text-neutral-400 hover:text-lime-400 transition-colors"
            >
              About JustReel →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

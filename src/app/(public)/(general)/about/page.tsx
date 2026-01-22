import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  IconMovie,
  IconDeviceTv,
  IconUsers,
  IconBrain,
  IconTrophy,
  IconShare,
  IconHeart,
  IconChecklist,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "About | JustReel",
  description:
    "Learn about JustReel - the best way to track, collaborate and discuss Movies and TV Shows with friends and family.",
};

const features = [
  {
    icon: IconChecklist,
    title: "Track Everything",
    description:
      "Keep a complete record of every movie and TV show you watch. Mark episodes as watched, track your progress through series, and never lose track of where you left off.",
    color: "lime",
  },
  {
    icon: IconBrain,
    title: "Smart Recommendations",
    description:
      "Get personalized suggestions powered by AI that actually understand your taste. The more you watch and rate, the better your recommendations become.",
    color: "amber",
  },
  {
    icon: IconShare,
    title: "Shared Collections",
    description:
      "Create and share curated lists with friends, family, or the world. Perfect for movie nights, watch-alongs, or building the ultimate genre collection.",
    color: "indigo",
  },
  {
    icon: IconTrophy,
    title: "Achievements & Stats",
    description:
      "Unlock achievements as you explore new genres, complete series, and build your watching history. See detailed statistics about your viewing habits.",
    color: "pink",
  },
  {
    icon: IconUsers,
    title: "Social Features",
    description:
      "Follow friends, see what they're watching, and discover content through people you trust. Compare tastes and find your next watch together.",
    color: "cyan",
  },
  {
    icon: IconHeart,
    title: "Express Yourself",
    description:
      "React to what you watch with likes, loves, and more. Build a profile that reflects your unique taste in entertainment.",
    color: "red",
  },
];

const stats = [
  { value: "500K+", label: "Movies & Shows" },
  { value: "100", label: "Achievements" },
  { value: "Free", label: "Forever" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="mt-6 lg:mt-8 mb-12 transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full bg-lime-500/20 border-2 border-neutral-900 flex items-center justify-center">
              <IconMovie size={18} className="text-lime-400" />
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-neutral-900 flex items-center justify-center">
              <IconDeviceTv size={18} className="text-amber-400" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          About JustReel
        </h1>
        <p className="text-xl text-neutral-300 max-w-2xl leading-relaxed">
          The best way to track, collaborate, and discuss Movies and TV Shows
          with friends and family.
        </p>
      </section>

      {/* Mission Statement */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-900/50 rounded-2xl border border-neutral-800 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <IconSparkles size={24} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
              <p className="text-neutral-400">Why we built JustReel</p>
            </div>
          </div>
          <div className="space-y-4 text-neutral-300 leading-relaxed">
            <p>
              We believe that watching movies and TV shows is better when
              shared. Whether you&apos;re tracking your personal viewing journey,
              discovering new content through friends, or organizing the perfect
              movie night, JustReel is designed to make every part of that
              experience more enjoyable.
            </p>
            <p>
              Gone are the days of forgetting which episode you were on, losing
              track of recommendations from friends, or spending more time
              deciding what to watch than actually watching. JustReel brings
              everything together in one beautiful, intuitive platform.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-lime-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">What Makes JustReel Special</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses: Record<string, { bg: string; text: string }> = {
              lime: { bg: "bg-lime-500/20", text: "text-lime-400" },
              amber: { bg: "bg-amber-500/20", text: "text-amber-400" },
              indigo: { bg: "bg-indigo-500/20", text: "text-indigo-400" },
              pink: { bg: "bg-pink-500/20", text: "text-pink-400" },
              cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
              red: { bg: "bg-red-500/20", text: "text-red-400" },
            };
            const colors = colorClasses[feature.color];

            return (
              <div
                key={index}
                className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 hover:border-neutral-700 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}
                >
                  <Icon size={20} className={colors.text} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Create Your Free Account",
              description:
                "Sign up in seconds with your email. No credit card required, no hidden fees.",
            },
            {
              step: "2",
              title: "Start Tracking",
              description:
                "Search for movies and shows, mark them as watched, and rate what you've seen.",
            },
            {
              step: "3",
              title: "Build Your Reel Deck",
              description:
                "Add shows you're currently watching to your Reel Deck and track episode progress.",
            },
            {
              step: "4",
              title: "Get Recommendations",
              description:
                "Our AI analyzes your taste and suggests content you'll actually enjoy.",
            },
            {
              step: "5",
              title: "Connect & Share",
              description:
                "Follow friends, share collections, and discover what others are watching.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start bg-neutral-900/50 rounded-lg border border-neutral-800/50 p-4"
            >
              <div className="w-8 h-8 rounded-full bg-lime-500 text-neutral-900 flex items-center justify-center font-bold text-sm shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-neutral-400 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="mb-12">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4">Your Data, Your Control</h2>
          <p className="text-neutral-400 leading-relaxed mb-4">
            We take your privacy seriously. Your viewing history and
            preferences are yours. We don&apos;t sell your personal data to
            advertisers or third parties. We use anonymous analytics to improve
            the platform, but you&apos;re always in control.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              Privacy Policy
              <IconArrowRight size={14} />
            </Link>
            <Link
              href="/terms-of-use"
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              Terms of Use
              <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-lime-500/10 to-amber-500/10 rounded-2xl border border-lime-500/20 p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Start Tracking?
          </h2>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">
            Join JustReel today and never lose track of what you&apos;re watching
            again. It&apos;s free, forever.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/portal"
              className="inline-flex items-center gap-2 px-6 py-3 bg-lime-500 hover:bg-lime-400 text-neutral-900 font-semibold rounded-lg transition-colors"
            >
              Get Started Free
              <IconArrowRight size={18} />
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg transition-colors border border-neutral-700"
            >
              Browse Content
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
          <span>Questions?</span>
          <a
            href="mailto:hello@justreel.app"
            className="text-neutral-400 hover:text-lime-400 transition-colors"
          >
            hello@justreel.app
          </a>
        </div>
      </section>
    </>
  );
}

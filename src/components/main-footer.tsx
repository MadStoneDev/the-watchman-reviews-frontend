export default function MainFooter({ className }: { className?: string }) {
  return (
    <div
      className={`mt-5 md:mt-16 pt-4 md:pb-4 border-t border-neutral-700 text-xs text-neutral-600/90 text-center md:text-left ${className}`}
    >
      <p>© 2023 The Watchman Reviews</p>
    </div>
  );
}

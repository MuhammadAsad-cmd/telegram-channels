export default function Loading() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-primary-dark">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-accent-primary border-t-transparent animate-spin"
          aria-hidden
        />
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}

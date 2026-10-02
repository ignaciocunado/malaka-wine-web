export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-3.25rem)] items-start justify-center bg-grouped px-4 py-14 sm:py-20">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

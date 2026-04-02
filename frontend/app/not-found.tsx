import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 text-center text-white">
      <div className="glass-card max-w-md p-8">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-300">The requested event or page does not exist.</p>
        <Link href="/" className="control-button mt-6 inline-flex">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

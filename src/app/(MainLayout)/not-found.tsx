import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <svg
            className="h-8 w-8 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Under Development
        </h1>

        <p className="text-sm text-gray-500">
          This page is currently being built and is not available yet. Our team
          is working hard to bring this feature to you soon.
        </p>

        <div className="pt-1">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

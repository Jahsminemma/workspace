import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="flex flex-wrap gap-4 border-b border-slate-200 bg-white px-4 py-4 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/drafts">Drafts</Link>
          <Link href="/worker-runs">Worker Runs</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="tracking-tight text-slate-900">VSTEP<span className="text-blue-600">MASTER</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Đăng nhập
          </Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all">
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
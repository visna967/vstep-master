'use client';

import Link from 'next/link';
import { 
  BookOpen, Award, CheckCircle, ArrowRight, Sparkles, 
  Headphones, FileText, BrainCircuit, ShieldCheck, 
  Clock, LogIn, UserPlus
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="tracking-tight text-slate-900">VSTEP<span className="text-blue-600">MASTER</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/placement-test" className="hover:text-blue-600 transition">Placement Test</Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition">Thống Kê Giáo Viên</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/login" 
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Đăng Nhập</span>
            </Link>

            <Link 
              href="/register" 
              className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
            >
              <UserPlus className="h-4 w-4" />
              <span>Đăng Ký</span>
            </Link>

            <Link 
              href="/placement-test" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>Test Trình Độ</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-blue-600" /> Nền Tảng Luyện Thi VSTEP B1 - B2 - C1 Chuẩn
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Đánh Giá Năng Lực VSTEP & <br />
            <span className="text-blue-600">Nhận Phản Hồi AI Chi Tiết</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hệ thống Placement Test toàn diện 4 kỹ năng giúp xác định chính xác trình độ tiếng Anh hiện tại và đề xuất lộ trình luyện thi tối ưu.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/placement-test" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-base group"
            >
              Bắt Đầu Kiểm Tra Năng Lực (Miễn Phí) 
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-700 font-bold px-7 py-4 rounded-2xl border border-slate-200 transition text-base text-center"
            >
              Đăng Nhập Tài Khoản
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium pt-4">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> Thời gian: 60 phút</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Thang điểm 100 chuẩn</span>
            <span className="flex items-center gap-1.5"><BrainCircuit className="h-4 w-4 text-purple-500" /> Chấm AI Writing 4 tiêu chí</span>
          </div>
        </div>
      </section>

      {/* Cấu Trúc 4 Phần Thi */}
      <section className="py-14 px-4 container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Cấu Trúc Đề Thi Placement Test</h2>
          <p className="text-sm text-slate-500 mt-2">Được thiết kế chuẩn cấu trúc kiểm tra đầu vào VSTEP B1-B2-C1</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">1. Listening (20đ)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              8 câu hỏi audio bắt thông tin chi tiết: giờ giấc, số liệu, vị trí và ngữ cảnh giao tiếp.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">2. Grammar & Vocab</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              20 câu trắc nghiệm tổng hợp các thì, câu điều kiện, câu bị động và từ vựng học thuật.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">3. Reading</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              2 bài đọc hiểu chuyên sâu (Cycling in Cities & The Changing Workplace) phân loại trình độ.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">4. AI Writing (30đ)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Viết email 120–150 từ cho Alex, hệ thống AI chấm 4 tiêu chí VSTEP và sửa lỗi câu chi tiết.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 VSTEP MASTER. Hệ Thống Luyện Thi & Đánh Giá Năng Lực Tiếng Anh Trực Tuyến.</p>
      </footer>
    </div>
  );
}
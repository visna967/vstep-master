import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Star, ArrowRight, ClipboardCheck } from 'lucide-react';

export default function LandingPage() {
  const levels = [
    { title: 'Trình độ A1 - Bắt đầu', desc: 'Nền tảng từ vựng và ngữ pháp cơ bản cho người mới bắt đầu.' },
    { title: 'Trình độ A2 - Sơ cấp', desc: 'Giao tiếp tình huống hàng ngày, tự tin đọc hiểu đoạn văn ngắn.' },
    { title: 'Trình độ B1 - Trung cấp', desc: 'Rèn luyện 4 kỹ năng chuyên sâu phục vụ chuẩn đầu ra đại học.' },
    { title: 'Trình độ B2 - Cao cấp', desc: 'Thành thạo cấu trúc đề thi VSTEP, tự tin đạt điểm số tối đa.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center md:py-28 max-w-5xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 border border-blue-200 mb-6">
          <Star className="h-4 w-4 fill-blue-600" /> Hệ thống luyện thi VSTEP hàng đầu
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Chinh Phục Chứng Chỉ <span className="text-blue-600">VSTEP</span> Dễ Dàng & Hiệu Quả
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Lộ trình học cá nhân hóa 4 kỹ năng Nghe - Nói - Đọc - Viết. Đánh giá chính xác trình độ A1 đến B2 với ngân hàng đề thi chuẩn hóa.
        </p>

        {/* Nút Thi Placement Test */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/placement-test" 
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <ClipboardCheck className="h-5 w-5" /> Thi Đánh Giá Trình Độ (Placement Test)
          </Link>
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            Vào Dashboard Học Thử <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Course Levels */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Các Lộ Trình Luyện Thi VSTEP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level, index) => (
              <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                  {level.title.split(' ')[2]}
                </div>
                <h3 className="font-bold text-lg mb-2">{level.title}</h3>
                <p className="text-sm text-slate-600">{level.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
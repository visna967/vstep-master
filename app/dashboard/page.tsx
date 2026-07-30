import { BookOpen, Headphones, Mic, PenTool, Flame, Trophy } from 'lucide-react';
import { StudentProgressChart } from '@/components/dashboard/StudentProgressChart';

export default function StudentDashboardPage() {
  const skillProgress = [
    { name: 'Reading', progress: 75, icon: BookOpen, color: 'text-blue-500' },
    { name: 'Listening', progress: 60, icon: Headphones, color: 'text-emerald-500' },
    { name: 'Speaking', progress: 45, icon: Mic, color: 'text-amber-500' },
    { name: 'Writing', progress: 50, icon: PenTool, color: 'text-purple-500' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Banner Chào Mừng */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Chào mừng trở lại! 👋</h1>
          <p className="text-blue-100 mt-1">Mục tiêu hiện tại: Chinh phục VSTEP <span className="font-bold underline">B2</span></p>
        </div>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
          <div className="flex items-center gap-2 px-3 border-r border-white/20">
            <Flame className="h-6 w-6 text-amber-400 fill-amber-400" />
            <div>
              <div className="text-xs text-blue-100">Chuỗi học</div>
              <div className="font-bold text-lg">7 Ngày</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3">
            <Trophy className="h-6 w-6 text-yellow-300" />
            <div>
              <div className="text-xs text-blue-100">Điểm XP</div>
              <div className="font-bold text-lg">1,250 XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê 4 Kỹ Năng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillProgress.map((skill) => {
          const Icon = skill.icon;
          return (
            <div key={skill.name} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-semibold text-slate-600">{skill.name}</span>
                <Icon className={`h-5 w-5 ${skill.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{skill.progress}%</div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Biểu Đồ & Nhiệm Vụ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Tiến Độ Học Trong Tuần</h2>
          <div className="h-72">
            <StudentProgressChart />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Nhiệm Vụ Hôm Nay</h2>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Ôn 15 Từ Vựng B2 Chủ Đề Environment</p>
              <p className="text-xs text-slate-500 mt-0.5">Thẻ Spaced Repetition</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Làm Đề Luyện Đọc VSTEP Part 3</p>
              <p className="text-xs text-slate-500 mt-0.5">Thời gian làm bài: 20 phút</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
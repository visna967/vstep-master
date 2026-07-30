'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface LeadRecord {
  id: string;
  full_name: string;
  phone: string;
  target_goal: string;
  total_score: number;
  knowledge_score: number;
  writing_score: number;
  writing_task1?: string;
  writing_task2?: string;
  recommended_course: string;
  created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminTestLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('placement_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-blue-950 uppercase">DANH SÁCH THÍ SINH LÀM PLACEMENT TEST</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý kết quả bài test và bài viết Writing của học viên VSTEP MASTER</p>
        </div>
        <button
          onClick={fetchLeads}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
        >
          🔄 Tải lại danh sách
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-200">
          Đang tải dữ liệu thí sinh...
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200 text-gray-500">
          Chưa có học viên nào thực hiện bài test.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-slate-100 text-gray-700 uppercase font-bold text-xs">
                <tr>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">SĐT / Zalo</th>
                  <th className="p-4">Mục tiêu</th>
                  <th className="p-4">Điểm số</th>
                  <th className="p-4">Bài viết Writing</th>
                  <th className="p-4">Khóa học đề xuất</th>
                  <th className="p-4">Ngày làm bài</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50 transition">
                    <td className="p-4 font-bold text-gray-900">{item.full_name}</td>
                    <td className="p-4 text-blue-600 font-semibold">{item.phone}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                        {item.target_goal}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-amber-600 text-base">{item.total_score}/60</span>
                      <span className="text-xs text-gray-400 block font-medium">
                        (Trắc nghiệm: {item.knowledge_score} | Writing: {item.writing_score})
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedLead(item)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        👁️ Xem bài viết
                      </button>
                    </td>
                    <td className="p-4 font-bold text-teal-700">{item.recommended_course}</td>
                    <td className="p-4 text-xs text-gray-400 font-medium">
                      {new Date(item.created_at).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT BÀI VIẾT HỌC VIÊN */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold p-2 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-black text-blue-950 mb-1 uppercase">
              BÀI VIẾT CỦA HỌC VIÊN: {selectedLead.full_name}
            </h2>
            <p className="text-xs text-gray-500 mb-6">SĐT: {selectedLead.phone} | Điểm Writing: {selectedLead.writing_score}/30đ</p>

            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-sm text-blue-900 mb-2">📝 Task 1 – Short Writing (Email)</h3>
                <p className="text-xs text-slate-700 whitespace-pre-wrap font-sans bg-white p-3 rounded-xl border border-slate-200">
                  {selectedLead.writing_task1 || 'Học viên không nhập bài viết Task 1.'}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-sm text-blue-900 mb-2">📝 Task 2 – Essay Writing</h3>
                <p className="text-xs text-slate-700 whitespace-pre-wrap font-sans bg-white p-3 rounded-xl border border-slate-200">
                  {selectedLead.writing_task2 || 'Học viên không nhập bài viết Task 2.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
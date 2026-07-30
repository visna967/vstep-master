"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface LeadRecord {
  id: string;
  full_name: string;
  phone: string;
  target_goal: string;
  total_score: number;
  knowledge_score: number;
  writing_score: number;
  recommended_course: string;
  created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminTestLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("placement_results")
      .select("*")
      .order("created_at", { ascending: false });

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
          <p className="text-gray-500 text-sm mt-1">Quản lý kết quả bài test và thông tin tư vấn học viên VSTEP MASTER</p>
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
                        (Knowledge: {item.knowledge_score} | Writing: {item.writing_score})
                      </span>
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
    </div>
  );
}
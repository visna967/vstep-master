'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Award, BookOpen, CheckCircle, Search, 
  Eye, FileText, ArrowUpDown, RefreshCw, Phone, Target
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface TestLead {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  target_goal: string;
  total_score: number;
  knowledge_score: number;
  writing_score: number;
  writing_task1: string;
  recommended_course: string;
}

export default function AdminLeadsDashboard() {
  const [leads, setLeads] = useState<TestLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<TestLead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase
          .from('test_leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setLeads(data);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu leads:', err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => 
    lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm) ||
    lead.recommended_course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thống kê nhanh
  const totalSubmissions = leads.length;
  const avgScore = totalSubmissions > 0 
    ? (leads.reduce((acc, curr) => acc + (curr.total_score || 0), 0) / totalSubmissions).toFixed(1)
    : '0';
  const b2Count = leads.filter(l => (l.total_score || 0) >= 65).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Tiêu đề & Nút Refresh */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-7 w-7 text-blue-600" /> Bảng Thống Kê Kết Quả Placement Test
            </h1>
            <p className="text-slate-500 text-sm mt-1">Quản lý danh sách học viên, điểm số và bài viết chi tiết</p>
          </div>
          <button 
            onClick={fetchLeads} 
            className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-4 py-2.5 rounded-xl border border-blue-200 transition text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới dữ liệu
          </button>
        </div>

        {/* Thống kê Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Lượt Thi</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{totalSubmissions}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm Trung Bình</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">{avgScore} <span className="text-sm text-slate-400 font-normal">/ 100</span></h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <Award className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đạt Chuẩn B2/C1 (&ge; 65đ)</p>
              <h3 className="text-3xl font-black text-purple-600 mt-1">{b2Count}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
              <Target className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Bảng Dữ Liệu Học Viên */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-lg text-slate-900">Danh Sách Học Viên Nộp Bài</h3>
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm tên, SĐT, trình độ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <th className="p-4">Thời gian</th>
                  <th className="p-4">Họ và Tên</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Mục tiêu</th>
                  <th className="p-4">Tổng Điểm</th>
                  <th className="p-4">Trắc nghiệm / Writing</th>
                  <th className="p-4">Khóa Đề Xuất</th>
                  <th className="p-4 text-center">Xem Bài Viết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-slate-400">Đang tải danh sách...</td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-slate-400">Chưa có dữ liệu học viên làm bài.</td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(lead.created_at).toLocaleDateString('vi-VN')} {new Date(lead.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 font-bold text-slate-900">{lead.full_name}</td>
                      <td className="p-4 text-slate-600 font-mono text-xs">{lead.phone}</td>
                      <td className="p-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">{lead.target_goal || 'B2'}</span></td>
                      <td className="p-4 font-black text-blue-600 text-base">{lead.total_score}đ</td>
                      <td className="p-4 text-xs text-slate-600">
                        TN: <b>{lead.knowledge_score}đ</b> | Writing: <b>{lead.writing_score}đ</b>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-700">{lead.recommended_course}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setSelectedLead(lead)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-flex items-center gap-1 text-xs font-bold"
                        >
                          <Eye className="h-4 w-4" /> Xem bài
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Xem Chi Tiết Bài Viết Của Học Viên */}
        {selectedLead && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Chi Tiết Bài Làm Của {selectedLead.full_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">SĐT: {selectedLead.phone} | Tổng điểm: <b className="text-blue-600">{selectedLead.total_score}/100đ</b></p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="text-slate-400 font-bold p-1">✕</button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 uppercase">Nội dung bài viết Writing Task 1 (Email cho Alex):</span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Điểm Writing: {selectedLead.writing_score} / 30
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed min-h-[120px]">
                  {selectedLead.writing_task1 || '(Học viên không nhập nội dung bài viết)'}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setSelectedLead(null)} 
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
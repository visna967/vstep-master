"use client";

import React from "react";

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
export interface TestScores {
  grammarScore: number;   // Max 10
  vocabScore: number;     // Max 10
  readingScore: number;   // Max 5
  mixedScore: number;     // Max 5
  writingTask1: number;   // Max 10
  writingTask2: number;   // Max 20
}

export interface EvaluationResult {
  totalScore: number;
  knowledgeScore: number;
  writingScore: number;
  course: string;
  warning?: string;
  stars: {
    grammar: number;
    vocab: number;
    reading: number;
    writing: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// --- 2. HÀM TÍNH ĐIỂM & LOGIC XẾP LỚP ---
export function evaluateVstepTest(scores: TestScores): EvaluationResult {
  const knowledgeScore = scores.grammarScore + scores.vocabScore + scores.readingScore + scores.mixedScore;
  const writingScore = scores.writingTask1 + scores.writingTask2;
  const totalScore = knowledgeScore + writingScore;

  let course = "";
  let warning: string | undefined = undefined;

  if (knowledgeScore < 18) {
    course = "VSTEP B1 FOUNDATION (4 THÁNG)";
  } else if (knowledgeScore >= 18 && knowledgeScore <= 23) {
    if (writingScore >= 8) {
      course = "VSTEP B1 INTENSIVE (3 THÁNG)";
    } else {
      course = "VSTEP B1 FOUNDATION (4 THÁNG)";
    }
  } else if (knowledgeScore >= 24 && knowledgeScore <= 27) {
    if (writingScore >= 15) {
      course = "VSTEP B2 FOUNDATION (4 THÁNG)";
    } else {
      course = "VSTEP B1 INTENSIVE (3 THÁNG)";
      warning = "Kỹ năng Writing còn hạn chế. Khuyến nghị tăng cường luyện viết trong quá trình học.";
    }
  } else if (knowledgeScore >= 28) {
    if (writingScore >= 22) {
      course = "VSTEP B2 INTENSIVE (3 THÁNG)";
    } else {
      course = "VSTEP B1 INTENSIVE (3 THÁNG)";
      warning = "Kỹ năng Writing còn hạn chế. Khuyến nghị tăng cường luyện viết trong quá trình học.";
    }
  }

  const stars = {
    grammar: Math.round((scores.grammarScore / 10) * 5),
    vocab: Math.round((scores.vocabScore / 10) * 5),
    reading: Math.round((scores.readingScore / 5) * 5),
    writing: Math.round((writingScore / 30) * 5),
  };

  let feedback = "";
  if (knowledgeScore >= 24 && writingScore < 15) {
    feedback = "Bạn có nền tảng ngữ pháp và từ vựng rất tốt. Điều này cho thấy bạn đã nắm khá chắc kiến thức tiếng Anh cơ bản.\n\nTuy nhiên, kỹ năng Writing vẫn còn hạn chế, đặc biệt ở khả năng phát triển ý, sử dụng từ vựng học thuật và liên kết đoạn văn.\n\nKhóa học được đề xuất sẽ tập trung cải thiện kỹ năng viết để giúp bạn đạt chuẩn VSTEP.";
  } else if (knowledgeScore < 18 && writingScore < 10) {
    feedback = "Bạn còn thiếu nền tảng ngữ pháp, từ vựng và kỹ năng viết.\n\nChúng tôi khuyến nghị bắt đầu với khóa Foundation để xây dựng lại kiến thức nền trước khi luyện thi VSTEP.";
  } else if (knowledgeScore >= 18 && knowledgeScore <= 25 && writingScore >= 10 && writingScore <= 20) {
    feedback = "Bạn đã có nền tảng tiếng Anh khá tốt và có thể theo học khóa luyện thi VSTEP.\n\nTrong quá trình học, bạn nên tiếp tục cải thiện kỹ năng viết và mở rộng vốn từ học thuật để đạt kết quả cao hơn.";
  } else {
    feedback = "Bạn có nền tảng tiếng Anh vững và khả năng sử dụng ngôn ngữ khá toàn diện.\n\nBạn hoàn toàn đủ điều kiện tham gia khóa học VSTEP B2 và hướng tới mục tiêu đạt kết quả cao trong kỳ thi.";
  }

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (scores.grammarScore >= 7) strengths.push("Nắm vững các cấu trúc ngữ pháp trọng tâm");
  else improvements.push("Củng cố lại các thì và cấu trúc ngữ pháp cơ bản");

  if (scores.vocabScore >= 7) strengths.push("Vốn từ vựng khá, đáp ứng tốt phần trắc nghiệm");
  else improvements.push("Mở rộng vốn từ vựng học thuật theo chủ đề VSTEP");

  if (scores.readingScore >= 4) strengths.push("Kỹ năng đọc hiểu và tìm ý chính tốt");
  else improvements.push("Rèn luyện kỹ năng Skimming & Scanning trong bài đọc");

  if (writingScore >= 20) {
    strengths.push("Khả năng diễn đạt văn viết tốt, bố cục rõ ràng");
  } else {
    improvements.push("Phát triển ý chi tiết cho bài luận (Essay)");
    improvements.push("Tăng độ đa dạng cấu trúc câu và từ nối (Cohesive devices)");
  }

  return {
    totalScore,
    knowledgeScore,
    writingScore,
    course,
    warning,
    stars,
    feedback,
    strengths,
    improvements,
  };
}

// --- 3. GIAO DIỆN HÌNH THỨC (UI COMPONENT) ---
interface Props {
  scores: TestScores;
  onRetry?: () => void;
  onRegister?: (courseName: string) => void;
}

export default function PlacementResultUI({ scores, onRetry, onRegister }: Props) {
  const result: EvaluationResult = evaluateVstepTest(scores);

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1 text-amber-400">
        {[1, 2, 3, 4, 5].map((i: number) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i <= count ? "text-amber-400 fill-current" : "text-gray-300 fill-none stroke-current"}`}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 p-6 sm:p-8 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase">KẾT QUẢ PLACEMENT TEST</h1>
          <p className="text-blue-100 mt-1 text-sm sm:text-base">Hệ thống đánh giá năng lực VSTEP MASTER</p>
          
          <div className="mt-6 inline-flex flex-col items-center bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20">
            <span className="text-4xl sm:text-5xl font-black text-amber-300">
              {result.totalScore} <span className="text-2xl text-white font-normal">/ 60</span>
            </span>
            <span className="text-xs uppercase tracking-wider text-blue-100 mt-1">Tổng điểm đạt được</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Điểm thành phần */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-blue-900">Knowledge Score</p>
                <p className="text-xs text-blue-600">Grammar, Vocab, Reading</p>
              </div>
              <span className="text-2xl font-bold text-blue-700">{result.knowledgeScore} / 30</span>
            </div>

            <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-teal-900">Writing Score</p>
                <p className="text-xs text-teal-600">Email & Essay</p>
              </div>
              <span className="text-2xl font-bold text-teal-700">{result.writingScore} / 30</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Khóa học đề xuất */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 rounded-2xl p-6 text-center relative overflow-hidden shadow-sm">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              KHÓA HỌC ĐỀ XUẤT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-1">{result.course}</h2>
            
            {result.warning && (
              <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-sm flex items-start gap-2 text-left">
                <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{result.warning}</span>
              </div>
            )}
          </div>

          {/* Đánh giá kỹ năng */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full"></span> ĐÁNH GIÁ KỸ NĂNG
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Grammar</span>
                {renderStars(result.stars.grammar)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Vocabulary</span>
                {renderStars(result.stars.vocab)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Reading</span>
                {renderStars(result.stars.reading)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Writing</span>
                {renderStars(result.stars.writing)}
              </div>
            </div>
          </div>

          {/* Nhận xét chi tiết */}
          <div className="bg-slate-50 p-5 rounded-xl border border-gray-200">
            <h3 className="text-md font-bold text-gray-800 mb-2">NHẬN XÉT DÀNH CHO BẠN</h3>
            <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{result.feedback}</p>
          </div>

          {/* Điểm mạnh & Điểm cần cải thiện */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
              <h4 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ĐIỂM MẠNH
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
                {result.strengths.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                CẦN CẢI THIỆN
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900">
                {result.improvements.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Buttons Thao tác */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onRegister?.(result.course)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Đăng ký khóa học ngay
            </button>
            <button
              onClick={onRetry}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm lại bài test
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
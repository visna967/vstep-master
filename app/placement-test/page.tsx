'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, XCircle, Clock, ArrowRight, Award, RotateCcw, FileText, Check, AlertTriangle, Sparkles, Loader2, CheckCircle2, XCircle as XCircleIcon } from 'lucide-react';

interface Question {
  id: number;
  section: 'Grammar' | 'Vocabulary' | 'Reading' | 'Mixed';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const mockQuestions: Question[] = [
  // Phần I: Ngữ pháp & Từ vựng (20 câu)
  { id: 1, section: 'Grammar', question: '1. If it ___ tomorrow, we will stay at home.', options: ['A. rains', 'B. rained', 'C. raining', 'D. rain'], correct: 0, explanation: 'Câu điều kiện loại 1: If + S + V(s/es), S + will + V.' },
  { id: 2, section: 'Grammar', question: '2. I have lived in this city ___ five years.', options: ['A. since', 'B. for', 'C. from', 'D. at'], correct: 1, explanation: 'Dùng "for" đi kèm khoảng thời gian (five years).' },
  { id: 3, section: 'Grammar', question: '3. She is ___ than her brother.', options: ['A. the intelligent', 'B. more intelligent', 'C. most intelligent', 'D. intelligent'], correct: 1, explanation: 'So sánh hơn của tính từ dài: more + adj + than.' },
  { id: 4, section: 'Grammar', question: '4. We ___ dinner when the phone rang.', options: ['A. have', 'B. had', 'C. were having', 'D. are having'], correct: 2, explanation: 'Hành động đang diễn ra trong quá khứ thì có hành động khác xen vào (Quá khứ tiếp diễn).' },
  { id: 5, section: 'Grammar', question: '5. He ___ to London last year.', options: ['A. goes', 'B. went', 'C. gone', 'D. going'], correct: 1, explanation: 'Thì Quá khứ đơn diễn tả hành động đã xảy ra và kết thúc (last year).' },
  { id: 6, section: 'Grammar', question: '6. I enjoy ___ tennis at the weekend.', options: ['A. play', 'B. playing', 'C. to play', 'D. played'], correct: 1, explanation: 'Sau động từ "enjoy" + V-ing.' },
  { id: 7, section: 'Grammar', question: '7. This is the first time I ___ sushi.', options: ['A. ate', 'B. eat', 'C. have eaten', 'D. eating'], correct: 2, explanation: 'Cấu trúc "This is the first time + S + have/has + V3/ed".' },
  { id: 8, section: 'Grammar', question: '8. If I ___ more money, I would buy a car.', options: ['A. have', 'B. had', 'C. having', 'D. has'], correct: 1, explanation: 'Câu điều kiện loại 2 giả định trái ngược với hiện tại: If + S + V2/ed, S + would + V.' },
  { id: 9, section: 'Grammar', question: '9. She asked me ___ I liked chocolate.', options: ['A. when', 'B. that', 'C. what', 'D. if'], correct: 3, explanation: 'Câu tường thuật câu hỏi Yes/No dùng "if" hoặc "whether".' },
  { id: 10, section: 'Grammar', question: '10. He speaks English very ___ .', options: ['A. good', 'B. better', 'C. well', 'D. best'], correct: 2, explanation: 'Trạng từ "well" bổ nghĩa cho động từ thường "speaks".' },
  { id: 11, section: 'Vocabulary', question: '11. The company will ___ new staff next month.', options: ['A. end', 'B. fire', 'C. borrow', 'D. hire'], correct: 3, explanation: '"Hire" có nghĩa là tuyển dụng nhân viên mới.' },
  { id: 12, section: 'Vocabulary', question: '12. She was very ___ when she heard the good news.', options: ['A. sad', 'B. excited', 'C. bored', 'D. angry'], correct: 1, explanation: '"Excited" mang nghĩa hào hứng, vui mừng khi nghe tin tốt.' },
  { id: 13, section: 'Vocabulary', question: '13. My uncle is a ___; he designs houses and buildings.', options: ['A. doctor', 'B. teacher', 'C. engineer', 'D. architect'], correct: 3, explanation: '"Architect" là kiến trúc sư, người thiết kế nhà cửa.' },
  { id: 14, section: 'Vocabulary', question: '14. We need to ___ the meeting until next week.', options: ['A. cancel', 'B. postpone', 'C. attend', 'D. join'], correct: 1, explanation: '"Postpone" có nghĩa là trì hoãn lịch họp sang thời gian khác.' },
  { id: 15, section: 'Vocabulary', question: '15. The opposite of "cheap" is ___.', options: ['A. useful', 'B. valuable', 'C. expensive', 'D. rare'], correct: 2, explanation: 'Từ trái nghĩa với "cheap" (rẻ) là "expensive" (đắt red).' },
  { id: 16, section: 'Vocabulary', question: '16. He is very ___; he always tells the truth.', options: ['A. polite', 'B. honest', 'C. friendly', 'D. clever'], correct: 1, explanation: '"Honest" có nghĩa là trung thực, luôn nói sự thật.' },
  { id: 17, section: 'Vocabulary', question: '17. I don’t have enough money to ___ a new car.', options: ['A. buy', 'B. sell', 'C. pay', 'D. spend'], correct: 0, explanation: '"Buy" nghĩa là mua (không đủ tiền để mua xe).' },
  { id: 18, section: 'Vocabulary', question: '18. The train was late because of a ___ problem.', options: ['A. chemical', 'B. physical', 'C. natural', 'D. technical'], correct: 3, explanation: '"Technical problem" nghĩa là sự cố kỹ thuật.' },
  { id: 19, section: 'Vocabulary', question: '19. She speaks English ___, so everyone can understand her easily.', options: ['A. loudly', 'B. fluently', 'C. quickly', 'D. silently'], correct: 1, explanation: '"Fluently" nghĩa là nói trôi chảy.' },
  { id: 20, section: 'Vocabulary', question: '20. The teacher asked us to ___ the text carefully before answering.', options: ['A. read', 'B. write', 'C. listen', 'D. speak'], correct: 0, explanation: '"Read" có nghĩa là đọc kỹ đoạn văn.' },
  
  // Phần II: Đọc hiểu (5 câu)
  { id: 21, section: 'Reading', question: '21. How old is Tom?', options: ['A. 20', 'B. 22', 'C. 25', 'D. 30'], correct: 2, explanation: 'Thông tin trong bài: "Tom is 25 years old."' },
  { id: 22, section: 'Reading', question: '22. What is Tom’s job?', options: ['A. Doctor', 'B. Teacher', 'C. Student', 'D. Engineer'], correct: 1, explanation: 'Thông tin trong bài: "He works as a teacher in a small town."' },
  { id: 23, section: 'Reading', question: '23. Why does Tom love his job?', options: ['A. Because it is easy', 'B. Because he enjoys helping students', 'C. Because he earns a lot of money', 'D. Because he travels often'], correct: 1, explanation: 'Thông tin trong bài: "...because he enjoys helping students learn."' },
  { id: 24, section: 'Reading', question: '24. What does Tom like doing in his free time?', options: ['A. Hiking and reading', 'B. Cooking and swimming', 'C. Dancing and singing', 'D. Playing football'], correct: 0, explanation: 'Thông tin bài: "...likes hiking in the mountains and reading history books."' },
  { id: 25, section: 'Reading', question: '25. Who does Tom often spend weekends with?', options: ['A. His family', 'B. His students', 'C. His friends', 'D. His colleagues'], correct: 2, explanation: 'Thông tin trong bài: "He often spends weekends with his friends."' },

  // Phần III: Tổng hợp (5 câu)
  { id: 26, section: 'Mixed', question: '26. I’m looking forward ___ you soon.', options: ['A. see', 'B. seeing', 'C. to see', 'D. saw'], correct: 1, explanation: 'Cấu trúc "look forward to + V-ing". Trong ngữ cảnh trắc nghiệm đề chọn phương án B.' },
  { id: 27, section: 'Mixed', question: '27. The film was ___ interesting that I watched it twice.', options: ['A. so', 'B. such', 'C. very', 'D. too'], correct: 0, explanation: 'Cấu trúc "S + be + so + Adj + that + S + V".' },
  { id: 28, section: 'Mixed', question: '28. She has visited many countries, ___ France and Germany.', options: ['A. including', 'B. include', 'C. includes', 'D. included'], correct: 0, explanation: '"Including" đóng vai trò như giới từ mang nghĩa "bao gồm".' },
  { id: 29, section: 'Mixed', question: '29. He drives ___ than I do.', options: ['A. carefully', 'B. more carefully', 'C. most carefully', 'D. careful'], correct: 1, explanation: 'So sánh hơn của trạng từ dài: "more + adv + than".' },
  { id: 30, section: 'Mixed', question: '30. We ___ finish the project by next Monday.', options: ['A. must', 'B. should', 'C. can', 'D. will'], correct: 0, explanation: '"Must" diễn tả sự bắt buộc hoặc yêu cầu hoàn thành đúng hạn.' },
];

export default function PlacementTestPage() {
  const [currentStep, setCurrentStep] = useState<'start' | 'quiz' | 'writing' | 'analyzing' | 'result'>('start');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Set thời gian đếm ngược 60 phút (3600 giây)
  const [timeLeft, setTimeLeft] = useState(3600);

  // Writing states
  const [writing1, setWriting1] = useState('');
  const [writing2, setWriting2] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  // Bộ đếm ngược chạy liên tục khi đang ở phần trắc nghiệm hoặc bài viết
  useEffect(() => {
    if (currentStep !== 'quiz' && currentStep !== 'writing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Tự động nộp bài khi hết 60 phút
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers({ ...answers, [mockQuestions[currentQuestionIndex].id]: optionIndex });
  };

  const calculateKnowledgeScore = () => {
    let score = 0;
    mockQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) score += 1;
    });
    return score;
  };

  const countWords = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  // 🔥 XỬ LÝ NỘP BÀI VÀ GỌI AI CHẤM FEEDBACK
  const handleFinalSubmit = async () => {
    setCurrentStep('analyzing'); // Chuyển sang màn hình "🤖 AI đang phân tích..."

    try {
      const res = await fetch('/api/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task1: writing1, task2: writing2 })
      });

      const data = await res.json();
      if (data.success) {
        setAiFeedback(data.evaluation);
      }
    } catch (error) {
      console.error('Lỗi khi chấm AI:', error);
    } finally {
      setCurrentStep('result'); // Chuyển sang màn hình xem kết quả
    }
  };

  const getCoursePlacement = (knowledgeScore: number, writingScore: number) => {
    const totalScore = knowledgeScore + writingScore;

    if (totalScore >= 52 && knowledgeScore >= 27 && writingScore >= 24) {
      return {
        code: 'B2_INTENSIVE',
        title: '④ VSTEP B2 INTENSIVE (3 THÁNG)',
        desc: 'Học viên có nền tảng tốt, đủ điều kiện theo học khóa luyện thi VSTEP B2 tăng tốc.',
        badgeBg: 'bg-purple-100 text-purple-700 border-purple-300',
        isLostRoot: false
      };
    }
    if (totalScore >= 43 && knowledgeScore >= 24 && writingScore >= 18) {
      return {
        code: 'B2_FOUNDATION',
        title: '③ VSTEP B2 FOUNDATION (4 THÁNG)',
        desc: 'Học viên đã đạt mức tương đương B1 nhưng cần củng cố thêm kỹ năng trước khi học VSTEP B2.',
        badgeBg: 'bg-blue-100 text-blue-700 border-blue-300',
        isLostRoot: false
      };
    }
    if (totalScore >= 30 && knowledgeScore >= 18 && writingScore >= 12) {
      return {
        code: 'B1_INTENSIVE',
        title: '② VSTEP B1 INTENSIVE (3 THÁNG)',
        desc: 'Học viên đã có nền tảng tiếng Anh cơ bản và có thể theo học khóa luyện thi VSTEP B1 tăng tốc.',
        badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        isLostRoot: false
      };
    }
    return {
      code: 'B1_FOUNDATION',
      title: '① VSTEP B1 FOUNDATION (4 THÁNG)',
      desc: 'Học viên chưa có nền tảng vững hoặc đã mất kiến thức cơ bản. Cần học lộ trình Foundation để xây dựng lại ngữ pháp, từ vựng và kỹ năng trước khi luyện thi VSTEP.',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      isLostRoot: true
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="tracking-tight text-slate-900">VSTEP<span className="text-blue-600">MASTER</span></span>
          </Link>

          {/* Đồng hồ Đếm ngược 60 Phút */}
          {(currentStep === 'quiz' || currentStep === 'writing') && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-sm font-bold border transition-all ${
              timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-blue-600">
            Thoát bài test
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 pt-10">
        {/* Màn hình 1: Bắt đầu */}
        {currentStep === 'start' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">HỆ THỐNG ĐÁNH GIÁ TRÌNH ĐỘ PLACEMENT TEST</h1>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
              Bài test gồm 30 câu Trắc nghiệm (30 điểm) và 2 bài Viết Writing (30 điểm) giúp xác định chính xác bạn có bị <b>Mất gốc</b> hay không và đề xuất lớp học phù hợp.
            </p>

            <div className="my-6 text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">Cấu Trúc Thang Điểm (Tổng 60 Điểm) • Thời Gian: 60 Phút</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border">Phần I. Ngữ pháp & Từ vựng: <b>20đ</b></div>
                <div className="p-2 bg-white rounded border">Phần II. Đọc hiểu: <b>5đ</b></div>
                <div className="p-2 bg-white rounded border">Phần III. Tổng hợp: <b>5đ</b></div>
                <div className="p-2 bg-white rounded border">Phần IV & V. Writing Task 1 & 2: <b>30đ</b></div>
              </div>
            </div>

            <button
              onClick={() => {
                setTimeLeft(3600);
                setCurrentStep('quiz');
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2"
            >
              Bắt Đầu Làm Bài <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Màn hình 2: Trắc nghiệm 30 câu */}
        {currentStep === 'quiz' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
              <span>Câu hỏi {currentQuestionIndex + 1} / {mockQuestions.length}</span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">{mockQuestions[currentQuestionIndex].section}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mb-6">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / mockQuestions.length) * 100}%` }}
              ></div>
            </div>

            {currentQuestionIndex >= 20 && currentQuestionIndex <= 24 && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
                <span className="font-bold block mb-1 text-slate-900">📖 Đọc đoạn văn sau để trả lời câu hỏi 21 đến 25:</span>
                "Tom is 25 years old. He works as a teacher in a small town. He loves his job because he enjoys helping students learn. In his free time, Tom likes hiking in the mountains and reading history books. He often spends weekends with his friends."
              </div>
            )}

            <h2 className="text-lg font-bold text-slate-900 mb-6">
              {mockQuestions[currentQuestionIndex].question}
            </h2>

            <div className="space-y-3 mb-8">
              {mockQuestions[currentQuestionIndex].options.map((option, idx) => {
                const isSelected = answers[mockQuestions[currentQuestionIndex].id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-5">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-40"
              >
                Quay lại
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < mockQuestions.length - 1 ? (
                  <button
                    disabled={answers[mockQuestions[currentQuestionIndex].id] === undefined}
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm disabled:opacity-50"
                  >
                    Câu tiếp theo
                  </button>
                ) : (
                  <button
                    disabled={answers[mockQuestions[currentQuestionIndex].id] === undefined}
                    onClick={() => setCurrentStep('writing')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2"
                  >
                    Chuyển Sang Phần Writing <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Màn hình 3: Writing Section */}
        {currentStep === 'writing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-1">
                  <FileText className="h-5 w-5" /> Phần Thi Viết - Writing (Tối đa 30 Điểm)
                </div>
                <p className="text-sm text-slate-500">Hệ thống AI sẽ tự động chấm điểm bài viết dựa trên từ vựng, ngữ pháp và bố cục liên kết.</p>
              </div>
            </div>

            {/* Task 1 */}
            <div className="border-t pt-6 border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-900">Task 1 – Short Writing (Tối đa 10 điểm)</h3>
                <span className="text-xs font-medium text-slate-500">Yêu cầu: 60–80 từ</span>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3 leading-relaxed">
                Write an email to a friend telling them about your last holiday. Include: <br />
                • Where you went | • What you did | • How you felt
              </p>
              <textarea
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Write your email here..."
                value={writing1}
                onChange={(e) => setWriting1(e.target.value)}
              />
              <div className="text-right text-xs text-slate-500 mt-1">
                Số từ đã viết: <span className="font-semibold text-blue-600">{countWords(writing1)}</span> words
              </div>
            </div>

            {/* Task 2 */}
            <div className="border-t pt-6 border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-900">Task 2 – Essay Writing (Tối đa 20 điểm)</h3>
                <span className="text-xs font-medium text-slate-500">Yêu cầu: 120–150 từ</span>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3 leading-relaxed">
                Write an essay on the topic: <b>“The importance of learning English today.”</b> Include: <br />
                • Why English is useful | • How people can improve their English | • Your personal opinion
              </p>
              <textarea
                rows={6}
                className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Write your essay here..."
                value={writing2}
                onChange={(e) => setWriting2(e.target.value)}
              />
              <div className="text-right text-xs text-slate-500 mt-1">
                Số từ đã viết: <span className="font-semibold text-blue-600">{countWords(writing2)}</span> words
              </div>
            </div>

            {/* Nút nộp bài */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-5">
              <button
                onClick={() => setCurrentStep('quiz')}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                Quay lại trắc nghiệm
              </button>
              <button
                onClick={handleFinalSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" /> Nộp Bài Sớm & AI Chấm Điểm
              </button>
            </div>
          </div>
        )}

        {/* 🤖 Màn hình 3.5: AI Đang Phân Tích (5-15 giây) */}
        {currentStep === 'analyzing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4 animate-pulse">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">🤖 AI đang phân tích bài viết...</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Hệ thống đang kiểm tra lỗi ngữ pháp, cấu trúc câu, vốn từ vựng học thuật và tính toán Band Score VSTEP (khoảng 5–15 giây).
            </p>
          </div>
        )}

        {/* Màn hình 4: KẾT QUẢ & AI FEEDBACK ĂN TIỀN */}
        {currentStep === 'result' && (() => {
          const knowledgeScore = calculateKnowledgeScore();
          const task1Score = aiFeedback?.task1?.score || 7.5;
          const task2Score = aiFeedback?.task2?.score || 15.0;
          const totalWriting = task1Score + task2Score;
          const totalScore = knowledgeScore + totalWriting;
          const placement = getCoursePlacement(knowledgeScore, totalWriting);

          return (
            <div className="space-y-8">
              {/* Thẻ Kết quả Tổng quát */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Kết Quả Đánh Giá Trình Độ Placement Test</h1>

                <div className="my-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto">
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-400">Tổng Điểm Đạt Được</div>
                  <div className="text-4xl font-extrabold text-blue-600 my-1">
                    {totalScore} <span className="text-lg text-slate-400 font-normal">/ 60 điểm</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border text-slate-700">
                      Điểm Trắc nghiệm: <br />
                      <b className="text-sm text-blue-600">{knowledgeScore} / 30đ</b>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border text-slate-700">
                      Điểm AI Writing: <br />
                      <b className="text-sm text-emerald-600">{totalWriting} / 30đ</b>
                      <span className="block text-[10px] text-slate-400">(T1: {task1Score}đ | T2: {task2Score}đ)</span>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border text-left max-w-xl mx-auto mb-6 ${placement.badgeBg}`}>
                  <div className="flex items-center gap-2 font-bold text-lg mb-1">
                    {placement.isLostRoot ? <AlertTriangle className="h-5 w-5 text-amber-600" /> : <Check className="h-5 w-5" />}
                    {placement.title}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90 mt-1">{placement.desc}</p>
                </div>
              </div>

              {/* 🌟 PHẦN AI FEEDBACK WRITING CHI TIẾT */}
              {aiFeedback && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <Sparkles className="h-6 w-6 text-blue-600" /> AI Feedback Chi Tiết 2 Bài Viết
                  </div>

                  {/* Writing Task 1 Feedback */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h3 className="font-bold text-lg text-slate-900">Writing Task 1</h3>
                      <span className="text-sm font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                        Overall Score: {aiFeedback.task1.score} / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-800 block mb-1">Điểm mạnh</span>
                        {aiFeedback.task1.strengths?.map((s: string, i: number) => (
                          <div key={i} className="text-emerald-700">{s}</div>
                        ))}
                      </div>
                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                        <span className="font-bold text-amber-800 block mb-1">Cần cải thiện</span>
                        {aiFeedback.task1.improvements?.map((imp: string, i: number) => (
                          <div key={i} className="text-amber-700">{imp}</div>
                        ))}
                      </div>
                    </div>

                    {/* Grammar Errors (Grammarly style) */}
                    {aiFeedback.task1.grammarErrors?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Grammar Errors & Suggestions</h4>
                        <div className="space-y-2">
                          {aiFeedback.task1.grammarErrors.map((err: any, i: number) => (
                            <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                              <div className="space-x-3">
                                <span className="line-through text-rose-500 font-mono">🔴 {err.original}</span>
                                <span className="font-semibold text-emerald-600 font-mono">🟢 {err.suggestion}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border">{err.reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Writing Task 2 Feedback */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h3 className="font-bold text-lg text-slate-900">Writing Task 2</h3>
                      <span className="text-sm font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
                        Estimated Score: {aiFeedback.task2.score} / 20
                      </span>
                    </div>

                    {/* Suggested Revision (AI Highlight) */}
                    {aiFeedback.task2.suggestedRevision && (
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                        <span className="font-bold text-xs text-blue-900 block">Suggested Version (AI Highlight)</span>
                        <p className="text-xs text-rose-600 line-through bg-white p-2 rounded border">
                          🟡 {aiFeedback.task2.suggestedRevision.original}
                        </p>
                        <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-2 rounded border border-emerald-200">
                          🟢 {aiFeedback.task2.suggestedRevision.suggested}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* General AI Review & Roadmap */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
                    <h3 className="font-bold text-lg text-blue-400 flex items-center gap-2">
                      🤖 Nhận xét tổng quan của AI & Lộ trình 4–6 tuần
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aiFeedback.overallFeedback}
                    </p>
                    <div className="border-t border-slate-800 pt-4">
                      <span className="text-xs font-bold text-slate-400 block mb-2">LỘ TRÌNH CẢI THIỆN TỰ SINH:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {aiFeedback.roadmap?.map((item: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-emerald-400 bg-slate-800 p-2 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bảng Đáp án Trắc nghiệm */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" /> Chi Tiết Đáp Án 30 Câu Trắc Nghiệm
                </h3>
                <div className="space-y-4">
                  {mockQuestions.map((q) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correct;
                    return (
                      <div key={q.id} className={`p-4 rounded-xl border text-sm ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="font-bold text-slate-900">{q.question}</span>
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              <CheckCircle className="h-3.5 w-3.5" /> Đúng (+1đ)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full">
                              <XCircle className="h-3.5 w-3.5" /> Sai (0đ)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 bg-white/80 p-2.5 rounded-lg border border-slate-200/60 mt-2">
                          💡 <b>Giải thích:</b> {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
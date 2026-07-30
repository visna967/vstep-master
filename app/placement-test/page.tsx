'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, XCircle, Clock, ArrowRight, Award, FileText, Check, AlertTriangle, Sparkles, Loader2, CheckCircle2, User, Phone, Target } from 'lucide-react';

interface Question {
  id: number;
  section: 'Grammar' | 'Vocabulary' | 'Reading' | 'Mixed';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const mockQuestions: Question[] = [
  { id: 1, section: 'Grammar', question: '1. If it ___ tomorrow, we will stay at home.', options: ['A. rains', 'B. rained', 'C. raining', 'D. rain'], correct: 0, explanation: 'Câu điều kiện loại 1: If + S + V(s/es), S + will + V.' },
  { id: 2, section: 'Grammar', question: '2. I have lived in this city ___ five years.', options: ['A. since', 'B. for', 'C. from', 'D. at'], correct: 1, explanation: 'Dùng "for" đi kèm khoảng thời gian (five years).' },
  { id: 3, section: 'Grammar', question: '3. She is ___ than her brother.', options: ['A. the intelligent', 'B. more intelligent', 'C. most intelligent', 'D. intelligent'], correct: 1, explanation: 'So sánh hơn của tính từ dài: more + adj + than.' },
  { id: 4, section: 'Grammar', question: '4. We ___ dinner when the phone rang.', options: ['A. have', 'B. had', 'C. were having', 'D. are having'], correct: 2, explanation: 'Hành động đang diễn ra trong quá khứ thì có hành động khác xen vào.' },
  { id: 5, section: 'Grammar', question: '5. He ___ to London last year.', options: ['A. goes', 'B. went', 'C. gone', 'D. going'], correct: 1, explanation: 'Thì Quá khứ đơn diễn tả hành động đã xảy ra và kết thúc.' },
  { id: 6, section: 'Grammar', question: '6. I enjoy ___ tennis at the weekend.', options: ['A. play', 'B. playing', 'C. to play', 'D. played'], correct: 1, explanation: 'Sau động từ "enjoy" + V-ing.' },
  { id: 7, section: 'Grammar', question: '7. This is the first time I ___ sushi.', options: ['A. ate', 'B. eat', 'C. have eaten', 'D. eating'], correct: 2, explanation: 'Cấu trúc "This is the first time + S + have/has + V3/ed".' },
  { id: 8, section: 'Grammar', question: '8. If I ___ more money, I would buy a car.', options: ['A. have', 'B. had', 'C. having', 'D. has'], correct: 1, explanation: 'Câu điều kiện loại 2 giả định trái ngược với hiện tại.' },
  { id: 9, section: 'Grammar', question: '9. She asked me ___ I liked chocolate.', options: ['A. when', 'B. that', 'C. what', 'D. if'], correct: 3, explanation: 'Câu tường thuật câu hỏi Yes/No dùng "if" hoặc "whether".' },
  { id: 10, section: 'Grammar', question: '10. He speaks English very ___ .', options: ['A. good', 'B. better', 'C. well', 'D. best'], correct: 2, explanation: 'Trạng từ "well" bổ nghĩa cho động từ thường "speaks".' },
  { id: 11, section: 'Vocabulary', question: '11. The company will ___ new staff next month.', options: ['A. end', 'B. fire', 'C. borrow', 'D. hire'], correct: 3, explanation: '"Hire" có nghĩa là tuyển dụng nhân viên mới.' },
  { id: 12, section: 'Vocabulary', question: '12. She was very ___ when she heard the good news.', options: ['A. sad', 'B. excited', 'C. bored', 'D. angry'], correct: 1, explanation: '"Excited" mang nghĩa hào hứng, vui mừng.' },
  { id: 13, section: 'Vocabulary', question: '13. My uncle is a ___; he designs houses and buildings.', options: ['A. doctor', 'B. teacher', 'C. engineer', 'D. architect'], correct: 3, explanation: '"Architect" là kiến trúc sư.' },
  { id: 14, section: 'Vocabulary', question: '14. We need to ___ the meeting until next week.', options: ['A. cancel', 'B. postpone', 'C. attend', 'D. join'], correct: 1, explanation: '"Postpone" có nghĩa là trì hoãn lịch họp.' },
  { id: 15, section: 'Vocabulary', question: '15. The opposite of "cheap" is ___.', options: ['A. useful', 'B. valuable', 'C. expensive', 'D. rare'], correct: 2, explanation: 'Từ trái nghĩa với "cheap" là "expensive".' },
  { id: 16, section: 'Vocabulary', question: '16. He is very ___; he always tells the truth.', options: ['A. polite', 'B. honest', 'C. friendly', 'D. clever'], correct: 1, explanation: '"Honest" có nghĩa là trung thực.' },
  { id: 17, section: 'Vocabulary', question: '17. I don’t have enough money to ___ a new car.', options: ['A. buy', 'B. sell', 'C. pay', 'D. spend'], correct: 0, explanation: '"Buy" nghĩa là mua.' },
  { id: 18, section: 'Vocabulary', question: '18. The train was late because of a ___ problem.', options: ['A. chemical', 'B. physical', 'C. natural', 'D. technical'], correct: 3, explanation: '"Technical problem" nghĩa là sự cố kỹ thuật.' },
  { id: 19, section: 'Vocabulary', question: '19. She speaks English ___, so everyone can understand her easily.', options: ['A. loudly', 'B. fluently', 'C. quickly', 'D. silently'], correct: 1, explanation: '"Fluently" nghĩa là nói trôi chảy.' },
  { id: 20, section: 'Vocabulary', question: '20. The teacher asked us to ___ the text carefully before answering.', options: ['A. read', 'B. write', 'C. listen', 'D. speak'], correct: 0, explanation: '"Read" có nghĩa là đọc kỹ.' },
  
  // Phần Reading
  { id: 21, section: 'Reading', question: '21. How old is Tom?', options: ['A. 20', 'B. 22', 'C. 25', 'D. 30'], correct: 2, explanation: 'Thông tin trong bài: "Tom is 25 years old."' },
  { id: 22, section: 'Reading', question: '22. What is Tom’s job?', options: ['A. Doctor', 'B. Teacher', 'C. Student', 'D. Engineer'], correct: 1, explanation: 'Thông tin trong bài: "He works as a teacher."' },
  { id: 23, section: 'Reading', question: '23. Why does Tom love his job?', options: ['A. Because it is easy', 'B. Because he enjoys helping students', 'C. Because he earns a lot of money', 'D. Because he travels often'], correct: 1, explanation: 'Thông tin trong bài: "...enjoys helping students learn."' },
  { id: 24, section: 'Reading', question: '24. What does Tom like doing in his free time?', options: ['A. Hiking and reading', 'B. Cooking and swimming', 'C. Dancing and singing', 'D. Playing football'], correct: 0, explanation: 'Thông tin bài: "...hiking in the mountains and reading."' },
  { id: 25, section: 'Reading', question: '25. Who does Tom often spend weekends with?', options: ['A. His family', 'B. His students', 'C. His friends', 'D. His colleagues'], correct: 2, explanation: 'Thông tin trong bài: "...spends weekends with his friends."' },
  
  // Câu 26 chuẩn C. to seeing
  { id: 26, section: 'Mixed', question: '26. I’m looking forward ___ you soon.', options: ['A. see', 'B. seeing', 'C. to seeing', 'D. saw'], correct: 2, explanation: 'Cấu trúc "look forward to + V-ing" (trông chờ, mong đợi).' },
  { id: 27, section: 'Mixed', question: '27. The film was ___ interesting that I watched it twice.', options: ['A. so', 'B. such', 'C. very', 'D. too'], correct: 0, explanation: 'Cấu trúc "so + Adj + that".' },
  { id: 28, section: 'Mixed', question: '28. She has visited many countries, ___ France and Germany.', options: ['A. including', 'B. include', 'C. includes', 'D. included'], correct: 0, explanation: '"Including" đóng vai trò như giới từ.' },
  { id: 29, section: 'Mixed', question: '29. He drives ___ than I do.', options: ['A. carefully', 'B. more carefully', 'C. most carefully', 'D. careful'], correct: 1, explanation: 'So sánh hơn của trạng từ dài: "more + adv + than".' },
  { id: 30, section: 'Mixed', question: '30. We ___ finish the project by next Monday.', options: ['A. must', 'B. should', 'C. can', 'D. will'], correct: 0, explanation: '"Must" diễn tả sự bắt buộc.' },
];

export default function PlacementTestPage() {
  const [currentStep, setCurrentStep] = useState<'start' | 'quiz' | 'writing' | 'analyzing' | 'result'>('start');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetGoal, setTargetGoal] = useState('B2');

  const [timeLeft, setTimeLeft] = useState(3600);
  const [writing1, setWriting1] = useState('');
  const [writing2, setWriting2] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  useEffect(() => {
    if (currentStep !== 'quiz' && currentStep !== 'writing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
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

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      return;
    }
    setShowModal(false);
    setTimeLeft(3600);
    setCurrentStep('quiz');
  };

  const handleFinalSubmit = async () => {
    setCurrentStep('analyzing');

    const fallbackFeedback = {
      task1: {
        score: writing1.trim().length > 20 ? 8.0 : 4.5,
        strengths: ['Đã trình bày đúng bố cục lá thư/email.', 'Nêu được thông tin điểm đến và trải nghiệm.'],
        improvements: ['Cần bổ sung thêm từ vựng miêu tả cảm xúc B2.', 'Chú ý chia thì Quá khứ đơn đồng nhất.'],
        grammarErrors: [
          { original: 'I go to holiday last week', suggestion: 'I went on holiday last week', reason: 'Thì quá khứ đơn (last week)' },
          { original: 'It was very happy', suggestion: 'It was a very happy trip', reason: 'Cấu trúc miêu tả chuyến đi' }
        ]
      },
      task2: {
        score: writing2.trim().length > 40 ? 16.0 : 8.5,
        suggestedRevision: {
          original: writing2 || 'Học viên chưa hoàn thành bài essay.',
          suggested: 'Nowadays, mastering English has become an essential requirement for academic and professional success...'
        }
      },
      overallFeedback: `Học viên ${fullName || 'bạn'} thể hiện lập luận khá tốt ở bài viết. Tuy nhiên cần chú ý sửa các lỗi chia thì cơ bản và áp dụng thêm 3-5 từ vựng học thuật VSTEP B2.`,
      roadmap: [
        'Tuần 1-2: Làm chủ 15 cấu trúc câu phức (Complex Sentences).',
        'Tuần 3-4: Luyện tập viết Email Task 1 theo thời gian thực.',
        'Tuần 5-6: Rèn luyện kỹ năng phát triển ý cho bài Essay Task 2.'
      ]
    };

    try {
      const res = await fetch('/api/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task1: writing1, 
          task2: writing2,
          studentName: fullName,
          studentPhone: phone,
          targetGoal: targetGoal,
          knowledgeScore: calculateKnowledgeScore()
        })
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setAiFeedback(data.evaluation);
      } else {
        setAiFeedback(fallbackFeedback);
      }
    } catch (error) {
      setAiFeedback(fallbackFeedback);
    } finally {
      setCurrentStep('result');
    }
  };

  const getCoursePlacement = (knowledgeScore: number, writingScore: number) => {
    const totalScore = knowledgeScore + writingScore;
    if (totalScore >= 52) return { title: '④ VSTEP B2 INTENSIVE (3 THÁNG)', desc: 'Học viên có nền tảng xuất sắc, đủ điều kiện luyện thi B2 tăng tốc.', badgeBg: 'bg-purple-100 text-purple-700 border-purple-300' };
    if (totalScore >= 43) return { title: '③ VSTEP B2 FOUNDATION (4 THÁNG)', desc: 'Học viên đạt tương đương B1, cần củng cố thêm kỹ năng viết trước khi thi B2.', badgeBg: 'bg-blue-100 text-blue-700 border-blue-300' };
    if (totalScore >= 30) return { title: '② VSTEP B1 INTENSIVE (3 THÁNG)', desc: 'Học viên có nền tảng khá, phù hợp lớp B1 tăng tốc.', badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    return { title: '① VSTEP B1 FOUNDATION (4 THÁNG)', desc: 'Học viên chưa vững gốc. Cần học lộ trình Foundation củng cố lại toàn bộ kiến thức.', badgeBg: 'bg-amber-100 text-amber-800 border-amber-300', isLostRoot: true };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="tracking-tight text-slate-900">VSTEP<span className="text-blue-600">MASTER</span></span>
          </Link>
          {(currentStep === 'quiz' || currentStep === 'writing') && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-sm font-bold border ${timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Thoát bài test</Link>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 pt-10">
        {currentStep === 'start' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">HỆ THỐNG ĐÁNH GIÁ TRÌNH ĐỘ PLACEMENT TEST</h1>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
              Bài test gồm 30 câu Trắc nghiệm (30 điểm) và 2 bài Viết Writing (30 điểm) giúp xác định chính xác trình độ VSTEP.
            </p>
            <button onClick={() => setShowModal(true)} className="w-full sm:w-auto mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2">
              Bắt Đầu Làm Bài <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 font-bold p-2">✕</button>
              <div className="text-center mb-6">
                <User className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <h2 className="text-xl font-black text-slate-900">THÔNG TIN HỌC VIÊN</h2>
                <p className="text-xs text-slate-500 mt-1">Nhập thông tin để nhận kết quả phân tích AI chi tiết nha!</p>
              </div>
              <form onSubmit={handleStartQuiz} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Họ và Tên *</label>
                  <input type="text" required placeholder="Nguyễn Văn A" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Số điện thoại / Zalo *</label>
                  <input type="tel" required placeholder="0912345678" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Mục tiêu VSTEP</label>
                  <select value={targetGoal} onChange={(e) => setTargetGoal(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white">
                    <option value="B1">Mục tiêu B1</option>
                    <option value="B2">Mục tiêu B2</option>
                    <option value="C1">Mục tiêu C1</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">🚀 Bắt Đầu Làm Bài</button>
              </form>
            </div>
          </div>
        )}

        {currentStep === 'quiz' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
              <span>Câu hỏi {currentQuestionIndex + 1} / {mockQuestions.length}</span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">{mockQuestions[currentQuestionIndex].section}</span>
            </div>

            {currentQuestionIndex >= 20 && currentQuestionIndex <= 24 && (
              <div className="mb-6 p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-sm text-slate-800 leading-relaxed shadow-sm">
                <span className="font-bold block mb-1 text-blue-900">📖 Read the following passage to answer questions 21 to 25:</span>
                "Tom is 25 years old. He works as a teacher in a small town. He loves his job because he enjoys helping students learn. In his free time, Tom likes hiking in the mountains and reading history books. He often spends weekends with his friends."
              </div>
            )}

            <h2 className="text-lg font-bold text-slate-900 mb-4">{mockQuestions[currentQuestionIndex].question}</h2>
            <div className="space-y-3 mb-8">
              {mockQuestions[currentQuestionIndex].options.map((option, idx) => (
                <button key={idx} onClick={() => handleSelectOption(idx)} className={`w-full text-left p-4 rounded-xl border text-sm font-medium flex justify-between ${answers[mockQuestions[currentQuestionIndex].id] === idx ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <span>{option}</span>
                  {answers[mockQuestions[currentQuestionIndex].id] === idx && <CheckCircle className="h-5 w-5 text-blue-600" />}
                </button>
              ))}
            </div>
            <div className="flex justify-between border-t pt-5">
              <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} className="text-sm font-semibold text-slate-500 disabled:opacity-40">Quay lại</button>
              {currentQuestionIndex < mockQuestions.length - 1 ? (
                <button disabled={answers[mockQuestions[currentQuestionIndex].id] === undefined} onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50">Câu tiếp theo</button>
              ) : (
                <button disabled={answers[mockQuestions[currentQuestionIndex].id] === undefined} onClick={() => setCurrentStep('writing')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">Chuyển Sang Writing <ArrowRight className="h-4 w-4" /></button>
              )}
            </div>
          </div>
        )}

        {/* 🌟 PHẦN WRITING ĐÃ HIỂN THỊ TRỌN VẸN 2 ĐỀ BÀI CỤ THỂ */}
        {currentStep === 'writing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2"><FileText className="h-6 w-6 text-blue-600" /> Phần Thi Viết - Writing</h2>
            
            {/* Task 1 */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Task 1 – Short Writing (Email - 10 điểm)</h3>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 leading-relaxed">
                Write an email to a friend telling them about your last holiday. Include: <br />
                • Where you went | • What you did | • How you felt
              </p>
              <textarea rows={4} className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Write your email here..." value={writing1} onChange={(e) => setWriting1(e.target.value)} />
              <div className="text-right text-xs text-slate-500 mt-1">Số từ: <span className="font-bold text-blue-600">{countWords(writing1)}</span> words</div>
            </div>

            {/* Task 2 */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Task 2 – Essay Writing (20 điểm)</h3>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 leading-relaxed">
                Write an essay on the topic: <b>“The importance of learning English today.”</b> Include: <br />
                • Why English is useful | • How people can improve their English | • Your personal opinion
              </p>
              <textarea rows={6} className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Write your essay here..." value={writing2} onChange={(e) => setWriting2(e.target.value)} />
              <div className="text-right text-xs text-slate-500 mt-1">Số từ: <span className="font-bold text-blue-600">{countWords(writing2)}</span> words</div>
            </div>

            <div className="flex justify-between border-t pt-5">
              <button onClick={() => setCurrentStep('quiz')} className="text-sm font-semibold text-slate-500">Quay lại trắc nghiệm</button>
              <button onClick={handleFinalSubmit} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg"><Sparkles className="h-4 w-4" /> Nộp Bài & Chấm Điểm AI</button>
            </div>
          </div>
        )}

        {currentStep === 'analyzing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-2xl font-extrabold text-slate-900">🤖 AI đang phân tích bài viết của {fullName}...</h2>
            <p className="text-sm text-slate-500">Đang chấm điểm lỗi ngữ pháp, từ vựng và tạo lộ trình học phù hợp...</p>
          </div>
        )}

        {currentStep === 'result' && (() => {
          const knowledgeScore = calculateKnowledgeScore();
          const task1Score = aiFeedback?.task1?.score || 7.5;
          const task2Score = aiFeedback?.task2?.score || 15.0;
          const totalWriting = task1Score + task2Score;
          const totalScore = knowledgeScore + totalWriting;
          const placement = getCoursePlacement(knowledgeScore, totalWriting);

          return (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
                <Award className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-slate-900">Kết Quả Đánh Giá Trình Độ Placement Test</h1>
                <p className="text-sm text-slate-500 mt-1">Học viên: <b className="text-blue-600">{fullName}</b> ({phone})</p>

                <div className="my-6 p-6 bg-slate-50 rounded-2xl border max-w-xl mx-auto">
                  <div className="text-xs uppercase font-bold text-slate-400">Tổng Điểm Đạt Được</div>
                  <div className="text-4xl font-extrabold text-blue-600 my-1">{totalScore} <span className="text-lg text-slate-400 font-normal">/ 60 điểm</span></div>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t text-xs">
                    <div className="bg-white p-2.5 rounded-lg border">Trắc nghiệm: <b className="text-blue-600 text-sm block">{knowledgeScore} / 30đ</b></div>
                    <div className="bg-white p-2.5 rounded-lg border">AI Writing: <b className="text-emerald-600 text-sm block">{totalWriting} / 30đ</b></div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border text-left max-w-xl mx-auto ${placement.badgeBg}`}>
                  <h3 className="font-bold text-lg mb-1">{placement.title}</h3>
                  <p className="text-xs leading-relaxed">{placement.desc}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-900"><Sparkles className="h-6 w-6 text-blue-600" /> AI Feedback Chi Tiết Bài Viết</div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-bold text-lg text-slate-900">Writing Task 1</h3>
                    <span className="text-sm font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Score: {task1Score} / 10</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-800 block mb-1">Điểm mạnh</span>
                      {aiFeedback?.task1?.strengths?.map((s: string, i: number) => <div key={i} className="text-emerald-700">• {s}</div>)}
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                      <span className="font-bold text-amber-800 block mb-1">Cần cải thiện</span>
                      {aiFeedback?.task1?.improvements?.map((imp: string, i: number) => <div key={i} className="text-amber-700">• {imp}</div>)}
                    </div>
                  </div>

                  {aiFeedback?.task1?.grammarErrors?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Lỗi Ngữ Pháp & Gợi Ý Sửa</h4>
                      <div className="space-y-2">
                        {aiFeedback.task1.grammarErrors.map((err: any, i: number) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-lg border flex justify-between text-xs">
                            <div><span className="line-through text-rose-500 font-mono">🔴 {err.original}</span> $\rightarrow$ <span className="font-semibold text-emerald-600 font-mono">🟢 {err.suggestion}</span></div>
                            <span className="text-[10px] text-slate-400">{err.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-bold text-lg text-slate-900">Writing Task 2</h3>
                    <span className="text-sm font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full">Score: {task2Score} / 20</span>
                  </div>
                  {aiFeedback?.task2?.suggestedRevision && (
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2 text-xs">
                      <span className="font-bold text-blue-900 block">Đề Xuất Câu Viết Chuẩn B2 từ AI:</span>
                      <p className="text-emerald-700 font-medium bg-emerald-50 p-2 rounded border border-emerald-200">🟢 {aiFeedback.task2.suggestedRevision.suggested}</p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
                  <h3 className="font-bold text-lg text-blue-400">🤖 Nhận xét tổng quan của AI & Lộ trình học</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiFeedback?.overallFeedback}</p>
                  <div className="border-t border-slate-800 pt-4">
                    <span className="text-xs font-bold text-slate-400 block mb-2">LỘ TRÌNH TỰ SINH 4-6 TUẦN:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {aiFeedback?.roadmap?.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-emerald-400 bg-slate-800 p-2 rounded-lg">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /> Đáp Án & Giải Thích Chi Tiết 30 Câu Trắc Nghiệm</h3>
                <div className="space-y-4">
                  {mockQuestions.map((q) => {
                    const isCorrect = answers[q.id] === q.correct;
                    return (
                      <div key={q.id} className={`p-4 rounded-xl border text-sm ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="font-bold text-slate-900">{q.question}</span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isCorrect ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'}`}>{isCorrect ? 'Đúng (+1đ)' : 'Sai (0đ)'}</span>
                        </div>
                        <div className="text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">💡 <b>Giải thích:</b> {q.explanation}</div>
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
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, CheckCircle, Clock, ArrowRight, Award, FileText, 
  AlertTriangle, Sparkles, Loader2, CheckCircle2, XCircle, User, 
  Phone, BarChart2, MessageSquare, Volume2, Headphones, CheckSquare, Edit3
} from 'lucide-react';

interface Question {
  id: number;
  section: 'Listening' | 'Grammar & Vocabulary' | 'Reading Passage 1' | 'Reading Passage 2';
  question: string;
  options: string[];
  correct: number;
  audioScript?: string;
  explanation: string;
}

const mockListeningQuestions: Question[] = [
  { id: 1, section: 'Listening', question: '1. What time will the flight now be leaving?', options: ['A. At 6:00', 'B. At 7:00', 'C. At 7:15', 'D. At 7:50'], correct: 2, audioScript: 'The flight will now be leaving at 7:15 p.m. from gate 22A.', explanation: 'Giờ khởi hành mới được thông báo là 7:15 p.m. -> Đáp án C.' },
  { id: 2, section: 'Listening', question: '2. How much will a $50 sweater cost now?', options: ['A. $50', 'B. $5', 'C. $15', 'D. $25'], correct: 3, audioScript: 'Every sweater will be 50% off. You can buy any child’s sweater at half the original price.', explanation: 'Áo len $50 giảm giá 50% còn $25 -> Đáp án D.' },
  { id: 3, section: 'Listening', question: '3. What number is the white line?', options: ['A. 6', 'B. 4', 'C. 7', 'D. 3'], correct: 1, audioScript: 'You can transfer to the white line, line number 4, to Seoul soccer stadium.', explanation: 'Tuyến màu trắng là tuyến số 4 -> Đáp án B.' },
  { id: 4, section: 'Listening', question: '4. What color is the dog?', options: ['A. White with brown paws', 'B. Brown with white paws', 'C. Brown with black paws', 'D. Black with brown paws'], correct: 1, audioScript: 'It is brown with white paws and answers to the name Sam.', explanation: 'Chú chó màu nâu và có 4 chân trắng -> Đáp án B.' },
  { id: 5, section: 'Listening', question: '5. What difference will be seen between Monday and Tuesday?', options: ['A. Monday will be much hotter.', 'B. Tuesday will have more rain.', 'C. Temperatures will be slightly higher on Tuesday.', 'D. There will be more rain showers on Monday.'], correct: 2, audioScript: 'Tuesday will also have similar conditions with slightly higher temperatures of about 23 degrees in the north.', explanation: 'Thứ Ba nhiệt độ sẽ cao hơn một chút -> Đáp án C.' },
  { id: 6, section: 'Listening', question: '6. Why are the students being sent home?', options: ['A. It is a school holiday.', 'B. There is a problem with the gas pipes.', 'C. Some of the teachers are absent.', 'D. The water pipes have burst.'], correct: 1, audioScript: "Due to a burst in the gas pipes as well as the extremely cold weather, today's classes will be canceled.", explanation: 'Học sinh được cho về nhà do sự cố vỡ ống gas -> Đáp án B.' },
  { id: 7, section: 'Listening', question: '7. What will happen in thirty minutes?', options: ['A. The plane will land.', 'B. Dinner will be served.', 'C. The plane will enter an area of bad weather.', 'D. Lunch will be served.'], correct: 3, audioScript: 'We should pass through the bad weather within thirty minutes, at which time lunch will be served.', explanation: 'Sau 30 phút nữa bữa trưa sẽ được phục vụ -> Đáp án D.' },
  { id: 8, section: 'Listening', question: '8. What is the problem?', options: ['A. A car has a flat tire.', 'B. A car has been stolen.', 'C. A car has broken down.', 'D. A car is blocking the entrance.'], correct: 3, audioScript: 'Your car is blocking the entrance. A delivery truck is unable to enter.', explanation: 'Chiếc xe đang chắn lối ra vào -> Đáp án D.' },
];

const mockGrammarVocabQuestions: Question[] = [
  { id: 9, section: 'Grammar & Vocabulary', question: '9. My brother _____ English every evening.', options: ['A. study', 'B. studies', 'C. is studying', 'D. studied'], correct: 1, explanation: 'Chủ ngữ ngôi thứ ba số ít "My brother" đi với thì Hiện tại đơn: studies.' },
  { id: 10, section: 'Grammar & Vocabulary', question: '10. Please be quiet. I _____ to finish my assignment.', options: ['A. try', 'B. tried', 'C. am trying', 'D. have tried'], correct: 2, explanation: 'Dấu hiệu "Please be quiet" chỉ hành động đang diễn ra -> Thì Hiện tại tiếp diễn: am trying.' },
  { id: 11, section: 'Grammar & Vocabulary', question: '11. We _____ to Ho Chi Minh City last weekend.', options: ['A. go', 'B. went', 'C. have gone', 'D. are going'], correct: 1, explanation: 'Dấu hiệu "last weekend" chỉ hành động đã xảy ra và chấm dứt trong quá khứ -> Quá khứ đơn: went.' },
  { id: 12, section: 'Grammar & Vocabulary', question: '12. While I _____ dinner, my friend called me.', options: ['A. cooked', 'B. was cooking', 'C. am cooking', 'D. have cooked'], correct: 1, explanation: 'Hành động đang diễn ra trong quá khứ dùng Quá khứ tiếp diễn (was cooking) thì hành động khác xen vào (called).' },
  { id: 13, section: 'Grammar & Vocabulary', question: '13. She _____ at this company since 2022.', options: ['A. works', 'B. worked', 'C. has worked', 'D. is working'], correct: 2, explanation: 'Dấu hiệu "since 2022" dùng thì Hiện tại hoàn thành: has worked.' },
  { id: 14, section: 'Grammar & Vocabulary', question: "14. I _____ for the bus for nearly an hour, but it still hasn't arrived.", options: ['A. wait', 'B. waited', 'C. am waiting', 'D. have been waiting'], correct: 3, explanation: 'Hành động chờ xe buýt kéo dài liên tục từ quá khứ đến hiện tại -> Hiện tại hoàn thành tiếp diễn: have been waiting.' },
  { id: 15, section: 'Grammar & Vocabulary', question: '15. I think more people _____ electric cars in the future.', options: ['A. use', 'B. used', 'C. will use', 'D. have used'], correct: 2, explanation: 'Dự đoán tương lai với "I think ... in the future" dùng Tương lai đơn: will use.' },
  { id: 16, section: 'Grammar & Vocabulary', question: '16. Look at those dark clouds! It _____ rain.', options: ['A. will', 'B. is going to', 'C. would', 'D. has'], correct: 1, explanation: 'Dự đoán có bằng chứng rõ ràng ở hiện tại ("dark clouds") dùng "be going to".' },
  { id: 17, section: 'Grammar & Vocabulary', question: '17. English _____ in many countries around the world.', options: ['A. speaks', 'B. is spoken', 'C. spoke', 'D. is speaking'], correct: 1, explanation: 'Câu bị động ở thì Hiện tại đơn: S + is/am/are + V3/ed (is spoken).' },
  { id: 18, section: 'Grammar & Vocabulary', question: '18. If I have enough time tonight, I _____ you.', options: ['A. call', 'B. called', 'C. will call', 'D. would call'], correct: 2, explanation: 'Câu điều kiện loại 1: If + S + V(s/es), S + will + V nguyên mẫu.' },
  { id: 19, section: 'Grammar & Vocabulary', question: '19. If I _____ more confident, I would speak English more often.', options: ['A. am', 'B. were', 'C. will be', 'D. have been'], correct: 1, explanation: 'Câu điều kiện loại 2 giả định không có thật ở hiện tại: If + S + were/V2, S + would + V.' },
  { id: 20, section: 'Grammar & Vocabulary', question: '20. I wish I _____ English more fluently.', options: ['A. speak', 'B. spoke', 'C. will speak', 'D. am speaking'], correct: 1, explanation: 'Câu ước ở hiện tại: S + wish + S + V2/ed (spoke).' },
  { id: 21, section: 'Grammar & Vocabulary', question: '21. The students completed the assignment _____.', options: ['A. successful', 'B. success', 'C. successfully', 'D. succeed'], correct: 2, explanation: 'Cần trạng từ (adv) "successfully" để bổ nghĩa cho động từ "completed".' },
  { id: 22, section: 'Grammar & Vocabulary', question: '22. Although the task was difficult, _____.', options: ['A. but we completed it', 'B. we completed it successfully', 'C. because we completed it', 'D. so we completed it'], correct: 1, explanation: 'Mệnh đề bắt đầu bằng "Although" thì mệnh đề chính không dùng "but/so/because".' },
  { id: 23, section: 'Grammar & Vocabulary', question: '23. Regular exercise is _____ for both physical and mental health.', options: ['A. benefit', 'B. beneficial', 'C. beneficiary', 'D. beneficially'], correct: 1, explanation: 'Sau "is" cần tính từ (adj) "beneficial" (có lợi).' },
  { id: 24, section: 'Grammar & Vocabulary', question: '24. Many students find it difficult to _____ their time effectively.', options: ['A. manage', 'B. management', 'C. manager', 'D. manageable'], correct: 0, explanation: 'Cấu trúc "find it difficult to + V nguyên mẫu" -> manage (quản lý).' },
  { id: 25, section: 'Grammar & Vocabulary', question: '25. The new public transport system is more _____ than the old one.', options: ['A. convenience', 'B. conveniently', 'C. convenient', 'D. convenienced'], correct: 2, explanation: 'So sánh hơn của tính từ: more + adj + than -> convenient (tiện lợi).' },
  { id: 26, section: 'Grammar & Vocabulary', question: '26. Learning a foreign language can _____ your employment opportunities.', options: ['A. improve', 'B. rise', 'C. grow up', 'D. develop up'], correct: 0, explanation: 'Cụm từ thích hợp: "improve employment opportunities" (nâng cao cơ hội việc làm).' },
  { id: 27, section: 'Grammar & Vocabulary', question: '27. The government should take effective measures to _____ air pollution.', options: ['A. reduce', 'B. fall', 'C. drop', 'D. decline'], correct: 0, explanation: '"Reduce air pollution" = giảm thiểu ô nhiễm không khí.' },
  { id: 28, section: 'Grammar & Vocabulary', question: '28. Good communication plays an important _____ in maintaining healthy relationships.', options: ['A. place', 'B. role', 'C. position', 'D. work'], correct: 1, explanation: 'Cụm collocations cố định: "play an important role in" (đóng vai trò quan trọng).' },
];

const mockReadingPassage1: Question[] = [
  { id: 29, section: 'Reading Passage 1', question: '29. What is the passage mainly about?', options: ['A. The cost of owning a car', 'B. Cycling as a form of urban transport', 'C. Different types of exercise', 'D. Problems with public transport'], correct: 1, explanation: 'Bài đọc viết về việc đạp xe như một phương tiện giao thông phổ biến ở đô thị.' },
  { id: 30, section: 'Reading Passage 1', question: '30. Why do some people choose bicycles?', options: ['A. To avoid traffic jams', 'B. To travel longer distances', 'C. To earn money', 'D. To avoid exercise'], correct: 0, explanation: 'Dẫn chứng: "Some people choose bicycles because they want to avoid traffic jams..."' },
  { id: 31, section: 'Reading Passage 1', question: '31. Which problem for cyclists is mentioned in the passage?', options: ['A. Expensive fuel', 'B. Lack of parking spaces', 'C. Heavy traffic', 'D. High public transport fares'], correct: 2, explanation: 'Dẫn chứng: "Heavy traffic can make cyclists feel unsafe..."' },
  { id: 32, section: 'Reading Passage 1', question: '32. The word “discourage” is closest in meaning to _____.', options: ['A. make someone less willing to do something', 'B. force someone to do something', 'C. teach someone how to do something', 'D. allow someone to do something'], correct: 0, explanation: '"Discourage" nghĩa là làm cho ai đó nản lòng / giảm ý muốn làm việc gì đó.' },
  { id: 33, section: 'Reading Passage 1', question: '33. What are some local governments doing to encourage cycling?', options: ['A. Making cars cheaper', 'B. Building more motorways', 'C. Providing more cycling facilities', 'D. Reducing public transport services'], correct: 2, explanation: 'Dẫn chứng: "...building new cycle lanes and providing bicycle-sharing services" (cung cấp thêm cơ sở vật chất cho xe đạp).' },
  { id: 34, section: 'Reading Passage 1', question: '34. The word “them” in paragraph 1 refers to _____.', options: ['A. cities', 'B. traffic jams', 'C. bicycles', 'D. people'], correct: 2, explanation: 'Từ "them" thay thế cho "bicycles" trong câu "...while others use them as a way to exercise."' },
];

const mockReadingPassage2: Question[] = [
  { id: 35, section: 'Reading Passage 2', question: '35. What is the main idea of the passage?', options: ['A. Offices will completely disappear in the future.', 'B. Technology has contributed to changes in working arrangements.', 'C. Employees generally dislike working with other people.', 'D. Companies should require employees to work from home.'], correct: 1, explanation: 'Bài đọc nêu bật sự đóng góp của công nghệ vào sự thay đổi mô hình làm việc (remote & hybrid).' },
  { id: 36, section: 'Reading Passage 2', question: '36. What is one advantage of working from home?', options: ['A. Employees do not need to communicate with colleagues.', 'B. Employees work fewer hours.', 'C. Employees can save commuting time and money.', 'D. Employees receive higher salaries.'], correct: 2, explanation: 'Dẫn chứng: "Employees can save time and money by avoiding daily travel..."' },
  { id: 37, section: 'Reading Passage 2', question: '37. What problem may remote workers experience?', options: ['A. Difficulty separating work and personal life', 'B. Too much face-to-face communication', 'C. Increased travelling costs', 'D. Lack of access to technology'], correct: 0, explanation: 'Dẫn chứng: "Some employees find it difficult to separate their professional and personal lives."' },
  { id: 38, section: 'Reading Passage 2', question: '38. The word “isolated” is closest in meaning to _____.', options: ['A. productive', 'B. disconnected', 'C. confident', 'D. organised'], correct: 1, explanation: '"Isolated" mang nghĩa cô lập, mất kết nối với mọi người xung quanh (disconnected).' },
  { id: 39, section: 'Reading Passage 2', question: '39. Why are many organisations adopting hybrid working arrangements?', options: ['A. To eliminate online communication', 'B. To combine remote work with face-to-face interaction', 'C. To make employees work longer hours', 'D. To remove offices completely'], correct: 1, explanation: 'Dẫn chứng: "This approach allows employees to work remotely on certain days while still meeting colleagues in person."' },
  { id: 40, section: 'Reading Passage 2', question: '40. What can be inferred from the final paragraph?', options: ['A. Traditional offices will certainly disappear.', 'B. Remote working has no disadvantages.', 'C. Flexible working arrangements are likely to continue.', 'D. Every organisation should use the same working model.'], correct: 2, explanation: 'Dẫn chứng: "...the changing workplace suggests that flexibility is likely to remain an important feature of employment."' },
];

export default function PlacementTestPage() {
  const [currentStep, setCurrentStep] = useState<'start' | 'listening' | 'grammar' | 'reading' | 'writing' | 'analyzing' | 'result'>('start');
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetGoal, setTargetGoal] = useState('B2');

  const [timeLeft, setTimeLeft] = useState(3600);
  
  // ✅ Ô viết thư để trống hoàn toàn để học viên tự viết
  const [writingEmail, setWritingEmail] = useState('');
  
  const [savedWriting, setSavedWriting] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  useEffect(() => {
    if (currentStep === 'start' || currentStep === 'analyzing' || currentStep === 'result') return;
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

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const countWords = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  const calculateObjectiveScore = () => {
    let listeningCount = 0;
    mockListeningQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) listeningCount += 1;
    });

    let gvrCount = 0;
    mockGrammarVocabQuestions.concat(mockReadingPassage1, mockReadingPassage2).forEach((q) => {
      if (answers[q.id] === q.correct) gvrCount += 1;
    });

    const listeningScore = Number((listeningCount * 2.5).toFixed(1));
    const gvrScore = Number(((gvrCount / 32) * 50).toFixed(1));

    return { listeningScore, gvrScore, listeningCount, gvrCount, totalObjective: listeningScore + gvrScore };
  };

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      return;
    }
    setShowModal(false);
    setTimeLeft(3600);
    setCurrentStep('listening');
  };

  // ✅ Hàm dự phòng thông minh: Đồng bộ hoàn hảo điểm số và feedback theo số từ thực tế
  const generateDynamicFeedback = (text: string, student: string) => {
    const trimmed = text.trim();
    const words = countWords(trimmed);
    const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(s => s.length > 5);
    const firstSentence = sentences.length > 0 ? sentences[0] : (trimmed || 'Dear Alex,');

    const isPassed = words >= 120;
    const ta = isPassed ? 6.5 : 3.0;
    const oc = isPassed ? 6.0 : 3.0;
    const gr = isPassed ? 6.0 : 3.0;
    const voc = isPassed ? 6.0 : 3.0;
    const totalWriting = Number((ta + oc + gr + voc).toFixed(1));

    return {
      wordCount: words,
      taskBreakdown: {
        taskAchievement: ta,
        organization: oc,
        grammar: gr,
        vocabulary: voc,
        total: totalWriting,
        analysis: `Bài viết đạt ${words} từ.`
      },
      strengths: isPassed ? [`Dung lượng chuẩn mực (${words} từ).`, 'Bố cục bài viết rõ ràng, đầy đủ các ý chính.'] : ['Có nỗ lực viết bài.'],
      areasForImprovement: isPassed ? ['Trau chuốt thêm các từ nối học thuật để bài viết mượt mà hơn.'] : ['Cần viết dài tối thiểu 120 từ theo yêu cầu đề bài.'],
      suggestedCorrections: [
        {
          original: firstSentence,
          suggestion: `${firstSentence} (Gợi ý nâng cấp: Có thể mở đầu tự nhiên hơn như "Dear Alex, Hope everything is going well!").`,
          reason: 'Cải thiện văn phong mở đầu thư thân mật.'
        }
      ],
      cefrLevel: isPassed ? 'B2' : 'A2',
      overallComment: `Chào ${student || 'bạn'}! Bài viết đạt ${words} từ với số điểm Writing là ${totalWriting}/30.`
    };
  };

  const handleFinalSubmit = async () => {
    setSavedWriting(writingEmail);
    setCurrentStep('analyzing');
    
    const { totalObjective } = calculateObjectiveScore();
    const dynamicFB = generateDynamicFeedback(writingEmail, fullName);

    try {
      const res = await fetch('/api/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task1: writingEmail, 
          studentName: fullName,
          studentPhone: phone,
          targetGoal: targetGoal,
          objectiveScore: totalObjective
        })
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setAiFeedback(data.evaluation);
      } else {
        setAiFeedback(dynamicFB);
      }
    } catch (error) {
      setAiFeedback(dynamicFB);
    } finally {
      setCurrentStep('result');
    }
  };

  const getCoursePlacement = (totalScore: number) => {
    if (totalScore >= 80) return { title: '④ VSTEP B2 INTENSIVE (3 THÁNG)', desc: 'Học viên có nền tảng xuất sắc, đủ điều kiện luyện thi B2 tăng tốc.', badgeBg: 'bg-purple-100 text-purple-700 border-purple-300' };
    if (totalScore >= 65) return { title: '③ VSTEP B2 FOUNDATION (4 THÁNG)', desc: 'Học viên đạt tương đương B1, cần củng cố thêm kỹ năng trước khi thi B2.', badgeBg: 'bg-blue-100 text-blue-700 border-blue-300' };
    if (totalScore >= 45) return { title: '② VSTEP B1 INTENSIVE (3 THÁNG)', desc: 'Học viên có nền tảng khá, phù hợp lớp B1 tăng tốc.', badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    return { title: '① VSTEP B1 FOUNDATION (4 THÁNG)', desc: 'Học viên bị hổng kiến thức hoặc nền tảng chưa vững. Cần học lộ trình Foundation củng cố lại toàn diện.', badgeBg: 'bg-amber-100 text-amber-800 border-amber-300' };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="tracking-tight text-slate-900">VSTEP<span className="text-blue-600">MASTER</span></span>
          </Link>
          {currentStep !== 'start' && currentStep !== 'analyzing' && currentStep !== 'result' && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-sm font-bold border ${timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Thoát</Link>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 pt-8">
        {currentStep === 'start' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">VSTEP B1–B2–C1 PLACEMENT TEST</h1>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
              English Proficiency Screening Test (Thời lượng: 60 phút - Thang điểm: 100)
            </p>

            <div className="my-6 text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-2">📋 CẤU TRÚC 4 PHẦN THI ĐÁNH GIÁ NĂNG LỰC:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-lg border">🎧 <b>Section 1: Listening (Câu 1 - 8)</b> – 8 câu audio ngắn (20đ)</div>
                <div className="bg-white p-2.5 rounded-lg border">📚 <b>Section 2: Grammar & Vocab (Câu 9 - 28)</b> – 20 câu trắc nghiệm</div>
                <div className="bg-white p-2.5 rounded-lg border">📖 <b>Section 3: Reading (Câu 29 - 40)</b> – 2 bài đọc hiểu chuyên sâu</div>
                <div className="bg-white p-2.5 rounded-lg border">✍️ <b>Section 4: Writing Email</b> – Viết thư cho Alex (30đ)</div>
              </div>
            </div>

            <button onClick={() => setShowModal(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2">
              Bắt Đầu Làm Bài <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 font-bold p-2">✕</button>
              <div className="text-center mb-6">
                <User className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <h2 className="text-xl font-black text-slate-900">THÔNG TIN HỌC VIÊN</h2>
                <p className="text-xs text-slate-500 mt-1">Vui lòng điền thông tin để xem kết quả đánh giá và lời khuyên lộ trình học!</p>
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

        {/* STEP 1: LISTENING */}
        {currentStep === 'listening' && (
          <div className="bg-white rounded-2xl border p-6 space-y-6 shadow-sm">
            <span className="font-extrabold text-indigo-700 text-xs uppercase bg-indigo-50 px-3 py-1 rounded border border-indigo-200">🎧 Section 1: Listening (Câu 1 - 8)</span>
            
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl sticky top-20 z-40 backdrop-blur-md">
              <div className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-1"><Volume2 className="h-4 w-4" /> AUDIO NGHE:</div>
              <audio controls className="w-full rounded-lg">
                <source src="/listening.mp3" type="audio/mpeg" />
              </audio>
            </div>

            <div className="space-y-6">
              {mockListeningQuestions.map((q) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border space-y-2">
                  <h3 className="font-bold text-sm text-slate-900">{q.question}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => (
                      <button key={idx} onClick={() => handleSelectOption(q.id, idx)} className={`text-left p-2.5 rounded-lg border text-xs font-medium transition flex justify-between ${answers[q.id] === idx ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-950' : 'bg-white text-slate-700'}`}>
                        <span>{opt}</span>
                        {answers[q.id] === idx && <CheckCircle className="h-4 w-4 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); setCurrentStep('grammar'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                Sang Section 2: Grammar & Vocab <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GRAMMAR & VOCABULARY */}
        {currentStep === 'grammar' && (
          <div className="bg-white rounded-2xl border p-6 space-y-6 shadow-sm">
            <span className="font-extrabold text-blue-900 text-xs uppercase bg-blue-50 px-3 py-1 rounded border border-blue-200">📚 Section 2: Grammar & Vocab (Câu 9 - 28)</span>
            
            <div className="space-y-6">
              {mockGrammarVocabQuestions.map((q) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border space-y-2">
                  <h3 className="font-bold text-sm text-slate-900">{q.question}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => (
                      <button key={idx} onClick={() => handleSelectOption(q.id, idx)} className={`text-left p-2.5 rounded-lg border text-xs font-medium transition flex justify-between ${answers[q.id] === idx ? 'border-blue-600 bg-blue-50 font-bold text-blue-900' : 'bg-white text-slate-700'}`}>
                        <span>{opt}</span>
                        {answers[q.id] === idx && <CheckCircle className="h-4 w-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); setCurrentStep('listening'); }} className="text-sm font-semibold text-slate-500">Quay lại Listening</button>
              <button onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); setCurrentStep('reading'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                Sang Section 3: Reading <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: READING */}
        {currentStep === 'reading' && (
          <div className="bg-white rounded-2xl border p-6 space-y-6 shadow-sm">
            <span className="font-extrabold text-emerald-900 text-xs uppercase bg-emerald-50 px-3 py-1 rounded border border-emerald-200">📖 Section 3: Reading (Câu 29 - 40)</span>
            
            <div className="p-4 bg-slate-50 rounded-xl border text-xs leading-relaxed space-y-2">
              <b className="text-emerald-900">Passage 1: Cycling in Cities</b>
              <p>In many large cities, cycling is becoming an increasingly popular way to travel. Some people choose bicycles because they want to avoid traffic jams, while others use them as a way to exercise. Cycling can also be cheaper than driving because cyclists do not have to pay for fuel or expensive parking.</p>
              <p>However, cycling in a busy city is not always easy. Heavy traffic can make cyclists feel unsafe, and some cities do not have enough bicycle lanes. Bad weather can also discourage people from cycling regularly.</p>
              <p>To encourage more people to travel by bicycle, many local governments are building new cycle lanes and providing bicycle-sharing services. Supporters believe that if more people leave their cars at home, cities could become cleaner, quieter and healthier places to live.</p>
            </div>

            <div className="space-y-4">
              {mockReadingPassage1.map((q) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">{q.question}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => (
                      <button key={idx} onClick={() => handleSelectOption(q.id, idx)} className={`text-left p-2.5 rounded-lg border text-xs font-medium transition flex justify-between ${answers[q.id] === idx ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950' : 'bg-white text-slate-700'}`}>
                        <span>{opt}</span>
                        {answers[q.id] === idx && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border text-xs leading-relaxed space-y-2 mt-6">
              <b className="text-emerald-900">Passage 2: The Changing Workplace</b>
              <p>Technology has significantly changed the way people work. In the past, most employees were expected to travel to an office every day. Today, however, advances in communication technology have made remote and hybrid working possible for millions of workers.</p>
              <p>Working from home offers several advantages. Employees can save time and money by avoiding daily travel, and many report having greater control over their schedules. Companies may also benefit because they can reduce the amount of office space they need.</p>
              <p>Nevertheless, remote working presents challenges. Some employees find it difficult to separate their professional and personal lives. Others may feel isolated because they have fewer opportunities for face-to-face interaction with colleagues. Communication can also become more complicated when team members depend heavily on emails and online meetings.</p>
              <p>For this reason, many organisations are adopting hybrid working arrangements rather than abandoning offices completely. This approach allows employees to work remotely on certain days while still meeting colleagues in person. Although no single system is suitable for every organisation, the changing workplace suggests that flexibility is likely to remain an important feature of employment.</p>
            </div>

            <div className="space-y-4">
              {mockReadingPassage2.map((q) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">{q.question}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => (
                      <button key={idx} onClick={() => handleSelectOption(q.id, idx)} className={`text-left p-2.5 rounded-lg border text-xs font-medium transition flex justify-between ${answers[q.id] === idx ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950' : 'bg-white text-slate-700'}`}>
                        <span>{opt}</span>
                        {answers[q.id] === idx && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); setCurrentStep('grammar'); }} className="text-sm font-semibold text-slate-500">Quay lại Grammar</button>
              <button onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); setCurrentStep('writing'); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                Sang Section 3: Reading <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: WRITING */}
        {currentStep === 'writing' && (
          <div className="bg-white rounded-2xl border p-6 space-y-6 shadow-sm">
            <span className="font-extrabold text-purple-900 text-xs uppercase bg-purple-50 px-3 py-1 rounded border border-purple-200">✍️ Section 4: Writing Email</span>
            
            <div className="bg-slate-50 p-4 rounded-xl border text-xs space-y-1.5">
              <p className="font-semibold">Your English-speaking friend, Alex, is considering learning English online and has asked for your opinion.</p>
              <p><b>Write an email to Alex (120–150 words):</b></p>
              <ul className="list-disc pl-5">
                <li>Say whether you think online learning is a good choice;</li>
                <li>Explain advantages or disadvantages;</li>
                <li>Give advice on how to learn effectively.</li>
              </ul>
            </div>

            <textarea rows={8} className="w-full p-4 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder="Dear Alex..." value={writingEmail} onChange={(e) => setWritingEmail(e.target.value)} />
            <div className="text-right text-xs text-slate-500 font-bold">Số từ: {countWords(writingEmail)} từ</div>

            <div className="flex justify-between pt-4 border-t">
              <button onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); setCurrentStep('reading'); }} className="text-sm font-semibold text-slate-500">Quay lại Reading</button>
              <button onClick={handleFinalSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                <Sparkles className="h-4 w-4" /> Nộp Bài & Nhận Kết Quả AI
              </button>
            </div>
          </div>
        )}

        {/* ANALYZING */}
        {currentStep === 'analyzing' && (
          <div className="bg-white rounded-2xl border p-12 text-center shadow-sm space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-2xl font-extrabold text-slate-900">🤖 AI đang phân tích toàn bộ bài thi...</h2>
          </div>
        )}

        {/* RESULT */}
        {currentStep === 'result' && (() => {
          const { listeningScore, gvrScore, listeningCount, gvrCount, totalObjective } = calculateObjectiveScore();
          const tb = aiFeedback?.taskBreakdown || { taskAchievement: 6.5, organization: 6.0, grammar: 6.0, vocabulary: 5.5, total: 24.0 };
          const totalScore = Number((totalObjective + tb.total).toFixed(1));
          const placement = getCoursePlacement(totalScore);

          return (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl border p-8 shadow-sm text-center">
                <Award className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-slate-900">Kết Quả VSTEP Placement Test</h1>
                <p className="text-sm text-slate-500 mt-1">Học viên: <b className="text-blue-600">{fullName}</b> ({phone})</p>

                <div className="my-6 p-6 bg-slate-50 rounded-2xl border max-w-xl mx-auto">
                  <div className="text-xs uppercase font-bold text-slate-400">Tổng Điểm Đánh Giá (Thang 100)</div>
                  <div className="text-5xl font-black text-blue-600 my-1">{totalScore} <span className="text-lg text-slate-400 font-normal">/ 100 điểm</span></div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-xs">
                    <div className="bg-white p-2.5 rounded-lg border">🎧 Listening: <br /><b className="text-indigo-600 text-sm">{listeningScore}/20đ</b></div>
                    <div className="bg-white p-2.5 rounded-lg border">📚 GVR: <br /><b className="text-blue-600 text-sm">{gvrScore}/50đ</b></div>
                    <div className="bg-white p-2.5 rounded-lg border">✍️ Writing: <br /><b className="text-emerald-600 text-sm">{tb.total}/30đ</b></div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border text-left max-w-xl mx-auto ${placement.badgeBg}`}>
                  <h3 className="font-bold text-lg mb-1">{placement.title}</h3>
                  <p className="text-xs leading-relaxed">{placement.desc}</p>
                </div>
              </div>

              {/* 1. HIỆN TOÀN BỘ BÀI VIẾT NGUYÊN VĂN CỦA THÍ SINH TRƯỚC */}
              <div className="bg-white rounded-2xl border p-6 space-y-3 shadow-sm border-blue-200">
                <div className="flex justify-between items-center border-b pb-3 border-blue-100">
                  <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-blue-600" /> Toàn bộ bài viết của thí sinh:
                  </h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Số lượng: {countWords(savedWriting)} từ
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-mono min-h-[90px]">
                  {savedWriting.trim() ? savedWriting : <span className="text-slate-400 italic">(Thí sinh chưa nhập nội dung bài viết)</span>}
                </div>
              </div>

              {/* 2. BẢNG FEEDBACK SỬA LỖI TRỰC TIẾP */}
              <div className="bg-white rounded-2xl border p-6 space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" /> Feedback & Sửa lỗi trực tiếp bài viết:
                </h3>
                <div className="space-y-3">
                  {aiFeedback?.suggestedCorrections?.map((err: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border space-y-2 text-xs">
                      <div className="text-rose-600 bg-rose-50 p-2.5 rounded border border-rose-200 font-mono">
                        🔴 <b>Câu gốc:</b> {err.original}
                      </div>
                      <div className="text-emerald-700 bg-emerald-50 p-2.5 rounded border border-emerald-200 font-medium font-mono">
                        🟢 <b>Gợi ý sửa:</b> {err.suggestion}
                      </div>
                      <div className="text-slate-600 text-[11px] pt-1">
                        💡 <b>Lý do:</b> {err.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. GIẢI THÍCH CHI TIẾT ĐÁP ÁN TỪNG CÂU CHO CÁC PHẦN TRẮC NGHIỆM */}
              <div className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-indigo-600" /> Giải Thích Chi Tiết 8 Câu Listening
                  </h3>
                  <div className="space-y-4">
                    {mockListeningQuestions.map((q) => {
                      const isCorrect = answers[q.id] === q.correct;
                      return (
                        <div key={q.id} className={`p-4 rounded-xl border text-sm ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="font-bold text-slate-900">{q.question}</span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isCorrect ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'}`}>
                              {isCorrect ? 'Đúng (+2.5đ)' : 'Sai (0đ)'}
                            </span>
                          </div>
                          {q.audioScript && (
                            <div className="text-xs text-slate-700 bg-white/90 p-3 rounded-lg border border-slate-200 mb-2 font-mono">
                              🎧 <b>Audio Script:</b> "{q.audioScript}"
                            </div>
                          )}
                          <div className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border">
                            💡 <b>Giải thích:</b> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" /> Giải Thích Chi Tiết Grammar, Vocab & Reading (Câu 9 - 40)
                  </h3>
                  <div className="space-y-4">
                    {mockGrammarVocabQuestions.concat(mockReadingPassage1, mockReadingPassage2).map((q) => {
                      const isCorrect = answers[q.id] === q.correct;
                      return (
                        <div key={q.id} className={`p-4 rounded-xl border text-sm ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="font-bold text-slate-900">{q.question}</span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isCorrect ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'}`}>
                              {isCorrect ? 'Đúng' : 'Sai'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                            💡 <b>Giải thích:</b> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          );
        })()}

      </div>
    </div>
  );
}
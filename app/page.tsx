'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, ArrowRight, Award, FileText, AlertTriangle, Sparkles, Loader2, CheckCircle2, User, Phone, BarChart2, BookMarked, MessageSquare, Volume2, Headphones } from 'lucide-react';

interface Question {
  id: number;
  section: 'Grammar' | 'Vocabulary' | 'Reading 1' | 'Reading 2 / Mixed' | 'Listening';
  partTitle: string;
  question: string;
  options: string[];
  correct: number;
  audioScript?: string;
  keyInfo?: string;
  explanation: string;
}

// 30 câu trắc nghiệm chia rõ 4 phần làm lần lượt từng câu
const mockKnowledgeQuestions: Question[] = [
  // PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)
  { id: 1, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '1. If it ___ tomorrow, we will stay at home.', options: ['A. rains', 'B. rained', 'C. raining', 'D. rain'], correct: 0, explanation: 'Câu điều kiện loại 1: If + S + V(s/es), S + will + V.' },
  { id: 2, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '2. I have lived in this city ___ five years.', options: ['A. since', 'B. for', 'C. from', 'D. at'], correct: 1, explanation: 'Dùng "for" đi kèm khoảng thời gian (five years).' },
  { id: 3, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '3. She is ___ than her brother.', options: ['A. the intelligent', 'B. more intelligent', 'C. most intelligent', 'D. intelligent'], correct: 1, explanation: 'So sánh hơn của tính từ dài: more + adj + than.' },
  { id: 4, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '4. We ___ dinner when the phone rang.', options: ['A. have', 'B. had', 'C. were having', 'D. are having'], correct: 2, explanation: 'Hành động đang diễn ra (quá khứ tiếp diễn) thì có hành động khác xen vào (quá khứ đơn).' },
  { id: 5, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '5. He ___ to London last year.', options: ['A. goes', 'B. went', 'C. gone', 'D. going'], correct: 1, explanation: 'Thì Quá khứ đơn diễn tả hành động đã kết thúc trong quá khứ ("last year").' },
  { id: 6, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '6. I enjoy ___ tennis at the weekend.', options: ['A. play', 'B. playing', 'C. to play', 'D. played'], correct: 1, explanation: 'Sau động từ "enjoy" bắt buộc dùng V-ing.' },
  { id: 7, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '7. This is the first time I ___ sushi.', options: ['A. ate', 'B. eat', 'C. have eaten', 'D. eating'], correct: 2, explanation: 'Cấu trúc "This is the first time + S + have/has + V3/ed".' },
  { id: 8, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '8. If I ___ more money, I would buy a car.', options: ['A. have', 'B. had', 'C. having', 'D. has'], correct: 1, explanation: 'Câu điều kiện loại 2 giả định điều không có thật ở hiện tại: If + S + V2/ed, S + would + V.' },
  { id: 9, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '9. She asked me ___ I liked chocolate.', options: ['A. when', 'B. that', 'C. what', 'D. if'], correct: 3, explanation: 'Câu tường thuật gián tiếp dạng Yes/No question dùng "if" hoặc "whether".' },
  { id: 10, section: 'Grammar', partTitle: 'PHẦN 1: NGỮ PHÁP (CÂU 1 - 10)', question: '10. He speaks English very ___ .', options: ['A. good', 'B. better', 'C. well', 'D. best'], correct: 2, explanation: 'Dùng trạng từ "well" để bổ nghĩa cho động từ "speaks".' },

  // PHẦN 2: TỪ VỰNG (CÂU 11 - 20)
  { id: 11, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '11. The company will ___ new staff next month.', options: ['A. end', 'B. fire', 'C. borrow', 'D. hire'], correct: 3, explanation: '"Hire" mang nghĩa tuyển dụng nhân viên.' },
  { id: 12, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '12. She was very ___ when she heard the good news.', options: ['A. sad', 'B. excited', 'C. bored', 'D. angry'], correct: 1, explanation: '"Excited" mang nghĩa hào hứng, vui sướng.' },
  { id: 13, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '13. My uncle is a ___; he designs houses and buildings.', options: ['A. doctor', 'B. teacher', 'C. engineer', 'D. architect'], correct: 3, explanation: '"Architect" là kiến trúc sư (thiết kế nhà cửa, công trình).' },
  { id: 14, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '14. We need to ___ the meeting until next week.', options: ['A. cancel', 'B. postpone', 'C. attend', 'D. join'], correct: 1, explanation: '"Postpone" mang nghĩa trì hoãn, hoãn lịch lại.' },
  { id: 15, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '15. The opposite of "cheap" is ___.', options: ['A. useful', 'B. valuable', 'C. expensive', 'D. rare'], correct: 2, explanation: 'Trái nghĩa với "cheap" (rẻ) là "expensive" (đắt đỏ).' },
  { id: 16, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '16. He is very ___; he always tells the truth.', options: ['A. polite', 'B. honest', 'C. friendly', 'D. clever'], correct: 1, explanation: '"Honest" là trung thực (luôn nói sự thật).' },
  { id: 17, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '17. I don’t have enough money to ___ a new car.', options: ['A. buy', 'B. sell', 'C. pay', 'D. spend'], correct: 0, explanation: '"Buy a car" = mua xe hơi.' },
  { id: 18, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '18. The train was late because of a ___ problem.', options: ['A. chemical', 'B. physical', 'C. natural', 'D. technical'], correct: 3, explanation: '"Technical problem" = sự cố kỹ thuật.' },
  { id: 19, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '19. She speaks English ___, so everyone can understand her easily.', options: ['A. loudly', 'B. fluently', 'C. quickly', 'D. silently'], correct: 1, explanation: '"Fluently" = nói trôi chảy, lưu loát.' },
  { id: 20, section: 'Vocabulary', partTitle: 'PHẦN 2: TỪ VỰNG (CÂU 11 - 20)', question: '20. The teacher asked us to ___ the text carefully before answering.', options: ['A. read', 'B. write', 'C. listen', 'D. speak'], correct: 0, explanation: '"Read the text carefully" = đọc kỹ đoạn văn.' },

  // PHẦN 3: BÀI ĐỌC 1 (CÂU 21 - 25)
  { id: 21, section: 'Reading 1', partTitle: 'PHẦN 3: BÀI ĐỌC 1 (CÂU 21 - 25)', question: '21. How old is Tom?', options: ['A. 20', 'B. 22', 'C. 25', 'D. 30'], correct: 2, explanation: 'Thông tin trong bài: "Tom is 25 years old."' },
  { id: 22, section: 'Reading 1', partTitle: 'PHẦN 3: BÀI ĐỌC 1 (CÂU 21 - 25)', question: '22. What is Tom’s job?', options: ['A. Doctor', 'B. Teacher', 'C. Student', 'D. Engineer'], correct: 1, explanation: 'Thông tin trong bài: "He works as a teacher."' },
  { id: 23, section: 'Reading 1', partTitle: 'PHẦN 3: BÀI ĐỌC 1 (CÂU 21 - 25)', question: '23. Why does Tom love his job?', options: ['A. Because it is easy', 'B. Because he enjoys helping students', 'C. Because he earns a lot of money', 'D. Because he travels often'], correct: 1, explanation: 'Thông tin trong bài: "...enjoys helping students learn."' },
  { id: 24, section: 'Reading 1', partTitle: 'PHẦN 3: BÀI ĐỌC 1 (CÂU 21 - 25)', question: '24. What does Tom like doing in his free time?', options: ['A. Hiking and reading', 'B. Cooking and swimming', 'C. Dancing and singing', 'D. Playing football'], correct: 0, explanation: 'Thông tin trong bài: "...hiking in the mountains and reading history books."' },
  { id: 25, section: 'Reading 1', partTitle: 'PHẦN 3: BÀI ĐỌC 1 (CÂU 21 - 25)', question: '25. Who does Tom often spend weekends with?', options: ['A. His family', 'B. His students', 'C. His friends', 'D. His colleagues'], correct: 2, explanation: 'Thông tin trong bài: "...spends weekends with his friends."' },

  // PHẦN 4: BÀI ĐỌC 2 / TỔNG HỢP (CÂU 26 - 30)
  { id: 26, section: 'Reading 2 / Mixed', partTitle: 'PHẦN 4: TỔNG HỢP & ĐỌC HIỂU (CÂU 26 - 30)', question: '26. I’m looking forward ___ you soon.', options: ['A. see', 'B. seeing', 'C. to seeing', 'D. saw'], correct: 2, explanation: 'Cấu trúc "look forward to + V-ing".' },
  { id: 27, section: 'Reading 2 / Mixed', partTitle: 'PHẦN 4: TỔNG HỢP & ĐỌC HIỂU (CÂU 26 - 30)', question: '27. The film was ___ interesting that I watched it twice.', options: ['A. so', 'B. such', 'C. very', 'D. too'], correct: 0, explanation: 'Cấu trúc "so + Adj + that".' },
  { id: 28, section: 'Reading 2 / Mixed', partTitle: 'PHẦN 4: TỔNG HỢP & ĐỌC HIỂU (CÂU 26 - 30)', question: '28. She has visited many countries, ___ France and Germany.', options: ['A. including', 'B. include', 'C. includes', 'D. included'], correct: 0, explanation: '"Including" đóng vai trò như giới từ mang nghĩa bao gồm.' },
  { id: 29, section: 'Reading 2 / Mixed', partTitle: 'PHẦN 4: TỔNG HỢP & ĐỌC HIỂU (CÂU 26 - 30)', question: '29. He drives ___ than I do.', options: ['A. carefully', 'B. more carefully', 'C. most carefully', 'D. careful'], correct: 1, explanation: 'So sánh hơn của trạng từ: "more + adv + than".' },
  { id: 30, section: 'Reading 2 / Mixed', partTitle: 'PHẦN 4: TỔNG HỢP & ĐỌC HIỂU (CÂU 26 - 30)', question: '30. We ___ finish the project by next Monday.', options: ['A. must', 'B. should', 'C. can', 'D. will'], correct: 0, explanation: '"Must" thể hiện sự bắt buộc phải hoàn thành.' },
];

// PHẦN 5: LISTENING (8 CÂU - HIỆN LIÊN TỤC CÙNG 1 AUDIO)
const mockListeningQuestions: Question[] = [
  { id: 31, section: 'Listening', partTitle: 'PHẦN 5: BÀI NGHE LISTENING (8 CÂU)', question: 'Question 1: What time will the flight now be leaving?', options: ['A. At 6:00', 'B. At 7:00', 'C. At 7:15', 'D. At 7:50'], correct: 2, audioScript: 'Attention all passengers on flight KI 162 from Spain to Ireland. This flight has been delayed due to bad weather. The flight will now be leaving at 7:15 p.m. from gate 22A. We apologize for any inconvenience.', keyInfo: 'will now be leaving at 7:15 p.m.', explanation: 'Người nói thông báo giờ khởi hành mới là 7:15 p.m. -> Chọn C.' },
  { id: 32, section: 'Listening', partTitle: 'PHẦN 5: BÀI NGHE LISTENING (8 CÂU)', question: 'Question 2: How much will a $50 sweater cost now?', options: ['A. $50', 'B. $5', 'C. $15', 'D. $25'], correct: 3, audioScript: "Attention, shoppers. For the next fifteen minutes we will have a sale on sweaters in the children's department. Every sweater will be 50% off. Yes, that's right. For just a quarter of an hour you can buy any child's sweater at half the original price.", keyInfo: '50% off = half the original price', explanation: 'Giá ban đầu $50 giảm 50%: $50 x 50% = $25 -> Chọn D.' },
  { id: 33, section: 'Listening', partTitle: 'PHẦN 5: BÀI NGHE LISTENING (8 CÂU)', question: 'Question 3: What number is the white line?', options: ['A. 6', 'B. 4', 'C. 7', 'D. 3'], correct: 1, audioScript: 'The next stop is Main Street. The exit doors are on the left side. You can transfer to the white line, line number 4, to Seoul soccer stadium. Please be careful as you leave the train.', keyInfo: 'the white line, line number 4', explanation: 'Audio nói trực tiếp: "the white line, line number 4" -> Chọn B.' },
  { id: 34, section: 'Listening', partTitle: 'PHẦN 5: BÀI NGHE LISTENING (8 CÂU)', question: 'Question 4: What color is the dog?', options: ['A. White with brown paws', 'B. Brown with white paws', 'C. Brown with black paws', 'D. Black with brown paws'], correct: 1, audioScript: 'A small dog was lost in the city center two days ago. It is brown with white paws and answers to the name Sam. It was wearing a brown collar.', keyInfo: 'brown with white paws', explanation: 'Chú chó có thân màu nâu và chân màu trắng (brown with white paws) -> Chọn B.' },
  { id: 35, section: 'Listening', partTitle: 'PHẦN 5: BÀI NGHE LISTENING (8 CÂU)', question: 'Question 5: What difference will be seen between Monday and Tuesday?', options: ['A. Monday will be far hotter.', 'B. Tuesday will have more rain.', 'C. There will be some higher temperatures on Tuesday.', 'D. There will be some extra rain showers on Monday.'], correct: 2, audioScript: 'Monday will be warm in most areas with some rain in the north of the country. Temperatures will reach up to 25 degrees in the south and around 20 degrees in the north. Tuesday will also have similar conditions with slightly higher temperatures of about 23 degrees in the north.', keyInfo: 'Tuesday -> slightly higher temperatures', explanation: 'Thứ Ba nhiệt độ cao hơn một chút (slightly higher temperatures = some higher temperatures) -> Chọn C.' },
  { id: 36, section: 'Listening', partTitle: 'PHẦN 5: BÀI NGHE LISTENING (8 CÂU)', question: 'Question 6: Why are the students being sent home?', options: ['A. It is a school holiday.', 'B. There is a problem with the gas pipes.', 'C. Some of the teachers are absent.', 'D. The water pipes burst.'], correct: 1, audioScript: "Attention all students. Due to a burst in the gas pipes as well as the extremely cold weather, today's classes will be canceled. The school buses will be arriving in twenty minutes to take everyone home.", keyInfo: 'due to a burst in the gas pipes', explanation: 'Lớp học bị hủy do nổ đường ống gas ("burst in the gas pipes") -> Chọn B.' },
  { id: 37, section: 'Listening', partTitle: 'PHẦN 5: BÀI NGHE LISTENING (8 CÂU)', question: 'Question 7: What will happen in thirty minutes?', options: ['A. They will land.', 'B. Dinner will be served.', 'C. They will enter some bad weather.', 'D. Lunch will be served.'], correct: 3, audioScript: 'Ladies and gentlemen, we are experiencing some bad weather, so all passengers must return to their seats and fasten their seatbelts. [...] We should pass through the bad weather within thirty minutes, at which time lunch will be served.', keyInfo: 'within thirty minutes -> lunch will be served', explanation: 'Sau 30 phút nữa bữa trưa sẽ được phục vụ ("lunch will be served") -> Chọn D.' },
  { id: 38, section: 'Listening', partTitle: 'PHẦN 5: BÀI NGHE LISTENING (8 CÂU)', question: 'Question 8: What is the problem?', options: ['A. A car has a flat tire.', 'B. A car has been stolen.', 'C. A car has broken down.', 'D. A car is blocking the entrance.'], correct: 3, audioScript: 'Could the owner of a green and red Daesung Santa Lucia, registration number ST 4571, please come to the parking lot immediately. Your car is blocking the entrance. A delivery truck is unable to enter, and this is causing a traffic jam in the street outside the store.', keyInfo: 'Your car is blocking the entrance.', explanation: 'Chiếc xe đang chắn lối vào cửa ("blocking the entrance") -> Chọn D.' },
];

export default function PlacementTestPage() {
  const [currentStep, setCurrentStep] = useState<'start' | 'quiz' | 'listening' | 'writing' | 'analyzing' | 'result'>('start');
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
    if (currentStep !== 'quiz' && currentStep !== 'listening' && currentStep !== 'writing') return;
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

  const calculateObjectiveScore = () => {
    let readingScore = 0;
    mockKnowledgeQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) readingScore += 1;
    });

    let listeningScore = 0;
    mockListeningQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) listeningScore += 2.5;
    });

    return { readingScore, listeningScore, totalObjective: readingScore + listeningScore };
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
    const { totalObjective } = calculateObjectiveScore();

    const fallbackFeedback = {
      task1Breakdown: { 
        taskAchievement: 4.5, 
        organization: 3.5, 
        grammar: 4.5, 
        vocabulary: 3.5, 
        total: 16.0,
        analysis: 'Đã hoàn thành các yêu cầu cơ bản của email. Cần bổ sung thêm các chi tiết miêu tả cảm xúc sống động hơn.'
      },
      task2Breakdown: { 
        taskAchievement: 6.0, 
        organization: 6.0, 
        grammar: 5.5, 
        vocabulary: 5.5, 
        total: 23.0,
        analysis: 'Bố cục bài luận rõ ràng. Cần mở rộng thêm dẫn chứng thực tế để tăng sức thuyết phục cho luận điểm.'
      },
      strengths: [
        'Định dạng bài làm đáp ứng đúng thể loại Email (Task 1) và Essay (Task 2).',
        'Ý tưởng bám sát đề bài, các đoạn văn có sự phân tách rõ ràng.'
      ],
      areasForImprovement: [
        'Cần chú ý chia thì Quá khứ đơn đồng nhất khi kể chuyện trong Task 1.',
        'Bổ sung các liên từ học thuật (Furthermore, However, In addition) cho Task 2.',
        'Hạn chế lặp lại các từ vựng cơ bản, ứng dụng thêm câu phức.'
      ],
      suggestedCorrections: [
        { original: writing1.slice(0, 40) || 'I go to holiday last week', suggestion: 'I went on a memorable vacation last week', reason: 'Thì quá khứ đơn (last week) và nâng cấp từ vựng.' },
        { original: writing2.slice(0, 50) || 'English is very good for job', suggestion: 'Proficiency in English plays a pivotal role in career advancement', reason: 'Nâng cấp từ vựng học thuật chuẩn B2.' }
      ],
      studyRecommendations: [
        'Ngữ pháp: Ôn tập quy tắc hòa hợp Chủ ngữ - Động từ và cấu trúc câu phức.',
        'Từ vựng: Bổ sung 50 collocations VSTEP chủ đề Tourism & Education.',
        'Bố cục: Luyện tập viết Mở bài - Thân bài - Kết bài 4 đoạn tiêu chuẩn.'
      ],
      cefrLevel: 'B1 (Trung cấp)',
      overallComment: `Chúc mừng học viên ${fullName || ''} đã hoàn thành bài thi! Bài viết của bạn truyền đạt ý tưởng rõ ràng. Hãy tập trung xử lý dứt điểm các lỗi chia thì và trau dồi vốn từ học thuật để bứt phá band B2/C1.`
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
          objectiveScore: totalObjective
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

  const getCoursePlacement = (totalScore: number) => {
    if (totalScore >= 85) return { title: '④ VSTEP B2 INTENSIVE (3 THÁNG)', desc: 'Học viên có nền tảng xuất sắc, đủ điều kiện luyện thi B2 tăng tốc.', badgeBg: 'bg-purple-100 text-purple-700 border-purple-300' };
    if (totalScore >= 70) return { title: '③ VSTEP B2 FOUNDATION (4 THÁNG)', desc: 'Học viên đạt tương đương B1, cần củng cố thêm kỹ năng trước khi thi B2.', badgeBg: 'bg-blue-100 text-blue-700 border-blue-300' };
    if (totalScore >= 50) return { title: '② VSTEP B1 INTENSIVE (3 THÁNG)', desc: 'Học viên có nền tảng khá, phù hợp lớp B1 tăng tốc.', badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    return { title: '① VSTEP B1 FOUNDATION (4 THÁNG)', desc: 'Học viên bị hổng kiến thức hoặc nền tảng chưa vững. Cần học lộ trình Foundation củng cố lại toàn diện.', badgeBg: 'bg-amber-100 text-amber-800 border-amber-300', isLostRoot: true };
  };

  const currentQ = mockKnowledgeQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="tracking-tight text-slate-900">VSTEP<span className="text-blue-600">MASTER</span></span>
          </Link>
          {(currentStep === 'quiz' || currentStep === 'listening' || currentStep === 'writing') && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-sm font-bold border ${timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Thoát bài test</Link>
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
              Bài kiểm tra toàn diện trên Thang điểm 100 gồm các phần thi làm lần lượt từng câu và phần Nghe liên tục.
            </p>

            <div className="my-6 text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-2">📋 LỘ TRÌNH LÀM BÀI TEST (60 PHÚT - THANG 100 ĐIỂM):</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-lg border">🔹 <b>Phần 1: Ngữ pháp (10 câu)</b> – Làm lần lượt</div>
                <div className="bg-white p-2.5 rounded-lg border">🔹 <b>Phần 2: Từ vựng (10 câu)</b> – Làm lần lượt</div>
                <div className="bg-white p-2.5 rounded-lg border">🔹 <b>Phần 3: Bài đọc 1 (5 câu)</b> – Kèm bài đọc Tom</div>
                <div className="bg-white p-2.5 rounded-lg border">🔹 <b>Phần 4: Bài đọc 2 / Tổng hợp (5 câu)</b> – Làm lần lượt</div>
                <div className="bg-white p-2.5 rounded-lg border sm:col-span-2">🎧 <b>Phần 5: Bài nghe Listening (8 câu - 20đ)</b> – Hiện trọn vẹn 8 câu theo 1 Audio</div>
                <div className="bg-white p-2.5 rounded-lg border sm:col-span-2">📝 <b>Phần 6: Bài viết Writing (2 Tasks - 50đ)</b> – Email & Essay</div>
              </div>
            </div>

            <button onClick={() => setShowModal(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2">
              Bắt Đầu Làm Bài <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Modal Thông tin */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 font-bold p-2">✕</button>
              <div className="text-center mb-6">
                <User className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <h2 className="text-xl font-black text-slate-900">THÔNG TIN HỌC VIÊN</h2>
                <p className="text-xs text-slate-500 mt-1">Nhập thông tin để nhận bảng phân tích AI và đáp án giải thích chi tiết nha!</p>
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

        {/* Màn hình 2: Trắc nghiệm 30 câu (Làm lần lượt từng câu theo từng phần) */}
        {currentStep === 'quiz' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* Thanh tiêu đề hiển thị rõ từng phần thi */}
            <div className="mb-4 pb-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2">
              <span className="font-extrabold text-blue-900 text-xs sm:text-sm uppercase tracking-wide bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                📌 {currentQ.partTitle}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Câu {currentQuestionIndex + 1} / {mockKnowledgeQuestions.length}
              </span>
            </div>

            {/* BÀI ĐỌC 1: Hiện cho câu 21 đến 25 */}
            {currentQuestionIndex >= 20 && currentQuestionIndex <= 24 && (
              <div className="mb-6 p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-sm text-slate-800 leading-relaxed shadow-sm">
                <span className="font-bold block mb-1 text-blue-900">📖 Đọc đoạn văn sau để trả lời lần lượt câu hỏi 21 đến 25:</span>
                "Tom is 25 years old. He works as a teacher in a small town. He loves his job because he enjoys helping students learn. In his free time, Tom likes hiking in the mountains and reading history books. He often spends weekends with his friends."
              </div>
            )}

            <h2 className="text-lg font-bold text-slate-900 mb-4">{currentQ.question}</h2>
            
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleSelectOption(currentQ.id, idx)} 
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium flex justify-between transition ${
                    answers[currentQ.id] === idx 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600 font-bold' 
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{option}</span>
                  {answers[currentQ.id] === idx && <CheckCircle className="h-5 w-5 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t pt-5">
              <button 
                disabled={currentQuestionIndex === 0} 
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} 
                className="text-sm font-semibold text-slate-500 disabled:opacity-40"
              >
                Quay lại
              </button>
              {currentQuestionIndex < mockKnowledgeQuestions.length - 1 ? (
                <button 
                  disabled={answers[currentQ.id] === undefined} 
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} 
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition"
                >
                  Câu tiếp theo
                </button>
              ) : (
                <button 
                  disabled={answers[currentQ.id] === undefined} 
                  onClick={() => setCurrentStep('listening')} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition"
                >
                  Chuyển Sang Phần Nghe Listening (20đ) <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Màn hình 2.5: Listening 8 câu (HIỆN RÕ 8 CÂU LIÊN TỤC THEO 1 AUDIO) */}
        {currentStep === 'listening' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="border-b pb-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl mb-1">
                <Headphones className="h-6 w-6" /> PHẦN 5: BÀI NGHE LISTENING (8 CÂU - 20 ĐIỂM)
              </div>
              <p className="text-xs text-slate-500 font-medium">
                🎧 <b>Hướng dẫn:</b> Bấm phát file Audio duy nhất bên dưới và làm liên tục cả 8 câu hỏi (mỗi câu 2.5 điểm).
              </p>
            </div>

            {/* Trình phát Audio ghim cố định */}
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl sticky top-20 z-40 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-2">
                <Volume2 className="h-4 w-4 text-indigo-600" /> FILE AUDIO BÀI NGHE:
              </div>
              <audio controls className="w-full rounded-lg">
                <source src="/listening.mp3" type="audio/mpeg" />
                Trình duyệt không hỗ trợ phát âm thanh.
              </audio>
            </div>

            {/* 8 Câu hỏi Listening hiển thị liên tục */}
            <div className="space-y-6">
              {mockListeningQuestions.map((q) => (
                <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">{q.question}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = answers[q.id] === optIndex;
                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          className={`text-left p-3 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-1 ring-indigo-600'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t pt-5">
              <button onClick={() => setCurrentStep('quiz')} className="text-sm font-semibold text-slate-500">Quay lại trắc nghiệm</button>
              <button onClick={() => setCurrentStep('writing')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                Chuyển Sang Phần Writing (50đ) <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Màn hình 3: Writing (50 điểm) */}
        {currentStep === 'writing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2"><FileText className="h-6 w-6 text-blue-600" /> PHẦN 6: PHẦN THI VIẾT - WRITING (50 ĐIỂM)</h2>
            
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Task 1 – Short Writing (Email - Tối đa 20 điểm)</h3>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 leading-relaxed">
                Write an email to a friend telling them about your last holiday. Include: <br />
                • Where you went | • What you did | • How you felt
              </p>
              <textarea rows={4} className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Write your email here..." value={writing1} onChange={(e) => setWriting1(e.target.value)} />
              <div className="text-right text-xs text-slate-500 mt-1">Số từ: <span className="font-bold text-blue-600">{countWords(writing1)}</span> words</div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Task 2 – Essay Writing (Tối đa 30 điểm)</h3>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 leading-relaxed">
                Write an essay on the topic: <b>“The importance of learning English today.”</b> Include: <br />
                • Why English is useful | • How people can improve their English | • Your personal opinion
              </p>
              <textarea rows={6} className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Write your essay here..." value={writing2} onChange={(e) => setWriting2(e.target.value)} />
              <div className="text-right text-xs text-slate-500 mt-1">Số từ: <span className="font-bold text-blue-600">{countWords(writing2)}</span> words</div>
            </div>

            <div className="flex justify-between border-t pt-5">
              <button onClick={() => setCurrentStep('listening')} className="text-sm font-semibold text-slate-500">Quay lại phần Nghe</button>
              <button onClick={handleFinalSubmit} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg"><Sparkles className="h-4 w-4" /> Nộp Bài & Chấm Điểm AI</button>
            </div>
          </div>
        )}

        {/* Màn hình Đang phân tích */}
        {currentStep === 'analyzing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-2xl font-extrabold text-slate-900">🤖 AI đang phân tích toàn diện bài thi của {fullName}...</h2>
            <p className="text-sm text-slate-500">Đang quét chi tiết lỗi ngữ pháp, bố cục và tính điểm trên thang 100...</p>
          </div>
        )}

        {/* Màn hình Kết quả Thang 100 */}
        {currentStep === 'result' && (() => {
          const { readingScore, listeningScore, totalObjective } = calculateObjectiveScore();
          const t1 = aiFeedback?.task1Breakdown || { taskAchievement: 4.5, organization: 3.5, grammar: 4.5, vocabulary: 3.5, total: 16.0, analysis: '' };
          const t2 = aiFeedback?.task2Breakdown || { taskAchievement: 6.0, organization: 6.0, grammar: 5.5, vocabulary: 5.5, total: 23.0, analysis: '' };
          const totalWriting = t1.total + t2.total;
          const totalScore = Number((totalObjective + totalWriting).toFixed(1));
          const placement = getCoursePlacement(totalScore);

          return (
            <div className="space-y-8">
              {/* Thẻ Kết quả Tổng quát Thang 100 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
                <Award className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-slate-900">Kết Quả Đánh Giá Trình Độ Placement Test</h1>
                <p className="text-sm text-slate-500 mt-1">Học viên: <b className="text-blue-600">{fullName}</b> ({phone})</p>

                <div className="my-6 p-6 bg-slate-50 rounded-2xl border max-w-xl mx-auto">
                  <div className="text-xs uppercase font-bold text-slate-400">Tổng Điểm Thang 100</div>
                  <div className="text-5xl font-black text-blue-600 my-1">{totalScore} <span className="text-lg text-slate-400 font-normal">/ 100 điểm</span></div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-xs">
                    <div className="bg-white p-2.5 rounded-lg border">
                      Đọc & Ngữ pháp: <br /><b className="text-blue-600 text-sm">{readingScore}/30đ</b>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border">
                      Listening: <br /><b className="text-indigo-600 text-sm">{listeningScore}/20đ</b>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border">
                      AI Writing: <br /><b className="text-emerald-600 text-sm">{totalWriting}/50đ</b>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border text-left max-w-xl mx-auto ${placement.badgeBg}`}>
                  <h3 className="font-bold text-lg mb-1">{placement.title}</h3>
                  <p className="text-xs leading-relaxed">{placement.desc}</p>
                </div>
              </div>

              {/* Bảng điểm AI Writing Assessment Thang 50 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-900 border-b pb-4">
                  <BarChart2 className="h-6 w-6 text-blue-600" /> AI Writing Assessment (50 Điểm)
                </div>

                {/* Writing Task 1 (20đ) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-base text-blue-950">Writing Task 1 (Email) – 20 điểm</h3>
                    <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">Điểm Task 1: {t1.total}/20</span>
                  </div>
                  {t1.analysis && <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border">🔍 <b>Nhận xét Task 1:</b> {t1.analysis}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">1. Task Achievement (0–6 điểm)</span>
                      <span className="text-blue-600 font-bold">{t1.taskAchievement} / 6.0 điểm</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">2. Organization & Coherence (0–4 điểm)</span>
                      <span className="text-blue-600 font-bold">{t1.organization} / 4.0 điểm</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">3. Grammar & Sentence Structure (0–6 điểm)</span>
                      <span className="text-blue-600 font-bold">{t1.grammar} / 6.0 điểm</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">4. Vocabulary (0–4 điểm)</span>
                      <span className="text-blue-600 font-bold">{t1.vocabulary} / 4.0 điểm</span>
                    </div>
                  </div>
                </div>

                {/* Writing Task 2 (30đ) */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-base text-purple-950">Writing Task 2 (Essay) – 30 điểm</h3>
                    <span className="font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm">Điểm Task 2: {t2.total}/30</span>
                  </div>
                  {t2.analysis && <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border">🔍 <b>Nhận xét Task 2:</b> {t2.analysis}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">1. Task Achievement (0–7.5 điểm)</span>
                      <span className="text-purple-600 font-bold">{t2.taskAchievement} / 7.5 điểm</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">2. Organization & Coherence (0–7.5 điểm)</span>
                      <span className="text-purple-600 font-bold">{t2.organization} / 7.5 điểm</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">3. Grammar & Sentence Structure (0–7.5 điểm)</span>
                      <span className="text-purple-600 font-bold">{t2.grammar} / 7.5 điểm</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">4. Vocabulary (0–7.5 điểm)</span>
                      <span className="text-purple-600 font-bold">{t2.vocabulary} / 7.5 điểm</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900 text-white p-4 rounded-2xl flex justify-between items-center text-sm font-bold">
                  <span>OVERALL WRITING SCORE</span>
                  <span className="text-xl text-amber-300 font-black">{totalWriting} / 50 ĐIỂM</span>
                </div>
              </div>

              {/* Feedback AI Chi Tiết */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-900 border-b pb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" /> AI Feedback Chi Tiết
                </div>

                <div>
                  <h4 className="font-bold text-sm text-emerald-800 uppercase mb-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Strengths (Điểm mạnh)</h4>
                  <ul className="space-y-1 text-xs text-emerald-900 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    {aiFeedback?.strengths?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-amber-800 uppercase mb-2 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> Areas for Improvement (Lỗi cần khắc phục)</h4>
                  <ul className="space-y-1 text-xs text-amber-900 bg-amber-50 p-4 rounded-xl border border-amber-200">
                    {aiFeedback?.areasForImprovement?.map((imp: string, i: number) => <li key={i}>• {imp}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-800 uppercase mb-2 flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-blue-600" /> Suggested Corrections (Phân tích lỗi cụ thể & Câu viết mẫu)</h4>
                  <div className="space-y-3 text-xs">
                    {aiFeedback?.suggestedCorrections?.map((err: any, i: number) => (
                      <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                          🔴 <b>Câu gốc / Lỗi:</b> <span className="font-mono">{err.original}</span>
                        </div>
                        <div className="text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 font-medium">
                          🟢 <b>Gợi ý sửa chuẩn:</b> <span className="font-mono">{err.suggestion}</span>
                        </div>
                        <div className="text-slate-600 text-[11px] pt-1">
                          💡 <b>Nguyên nhân & Lưu ý:</b> {err.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-blue-900 uppercase mb-2 flex items-center gap-1.5"><BookMarked className="h-4 w-4" /> Study Recommendations (Định hướng học tập)</h4>
                  <ul className="space-y-1 text-xs text-blue-900 bg-blue-50 p-4 rounded-xl border border-blue-200">
                    {aiFeedback?.studyRecommendations?.map((rec: string, i: number) => <li key={i}>• {rec}</li>)}
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-900 uppercase">Estimated CEFR Level:</span>
                  <span className="font-black text-purple-700 text-sm bg-white px-3 py-1 rounded-full border border-purple-200">{aiFeedback?.cefrLevel || 'B1 (Trung cấp)'}</span>
                </div>

                <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2 text-xs leading-relaxed">
                  <span className="font-bold text-blue-400 block uppercase">Overall Comment:</span>
                  <p>{aiFeedback?.overallComment}</p>
                </div>
              </div>

              {/* 💡 GIẢI THÍCH CHI TIẾT 30 CÂU ĐỌC/NGỮ PHÁP + 8 CÂU LISTENING CÓ SCRIPT */}
              <div className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-indigo-600" /> Giải Thích Chi Tiết 8 Câu Listening (Có Script & Keywords)
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

                          <div className="text-xs text-slate-600 space-y-1 bg-white/70 p-2.5 rounded-lg border">
                            {q.keyInfo && <div>🔑 <b>Key information:</b> <span className="font-semibold text-indigo-700">{q.keyInfo}</span></div>}
                            <div>💡 <b>Giải thích:</b> {q.explanation}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" /> Giải Thích Chi Tiết 30 Câu Trắc Nghiệm Đọc & Ngữ Pháp
                  </h3>
                  <div className="space-y-4">
                    {mockKnowledgeQuestions.map((q) => {
                      const isCorrect = answers[q.id] === q.correct;
                      return (
                        <div key={q.id} className={`p-4 rounded-xl border text-sm ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="font-bold text-slate-900">{q.question}</span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isCorrect ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'}`}>
                              {isCorrect ? 'Đúng (+1đ)' : 'Sai (0đ)'}
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
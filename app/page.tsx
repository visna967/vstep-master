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
  partTitle: string;
  question: string;
  options: string[];
  correct: number;
  audioScript?: string;
  keyInfo?: string;
  explanation: string;
}

// 1. SECTION 1: LISTENING (1 - 8)
const mockListeningQuestions: Question[] = [
  { id: 1, section: 'Listening', partTitle: 'SECTION 1: LISTENING (CÂU 1 - 8)', question: '1. What time will the flight now be leaving?', options: ['A. At 6:00', 'B. At 7:00', 'C. At 7:15', 'D. At 7:50'], correct: 2, audioScript: 'The flight will now be leaving at 7:15 p.m. from gate 22A.', keyInfo: 'will now be leaving at 7:15 p.m.', explanation: 'Giờ khởi hành mới được thông báo là 7:15 p.m. -> Đáp án C.' },
  { id: 2, section: 'Listening', partTitle: 'SECTION 1: LISTENING (CÂU 1 - 8)', question: '2. How much will a $50 sweater cost now?', options: ['A. $50', 'B. $5', 'C. $15', 'D. $25'], correct: 3, audioScript: 'Every sweater will be 50% off. You can buy any child’s sweater at half the original price.', keyInfo: '50% off = half the original price ($50 / 2 = $25)', explanation: 'Áo len $50 giảm giá 50% còn $25 -> Đáp án D.' },
  { id: 3, section: 'Listening', partTitle: 'SECTION 1: LISTENING (CÂU 1 - 8)', question: '3. What number is the white line?', options: ['A. 6', 'B. 4', 'C. 7', 'D. 3'], correct: 1, audioScript: 'You can transfer to the white line, line number 4, to Seoul soccer stadium.', keyInfo: 'white line, line number 4', explanation: 'Tuyến màu trắng là tuyến số 4 -> Đáp án B.' },
  { id: 4, section: 'Listening', partTitle: 'SECTION 1: LISTENING (CÂU 1 - 8)', question: '4. What color is the dog?', options: ['A. White with brown paws', 'B. Brown with white paws', 'C. Brown with black paws', 'D. Black with brown paws'], correct: 1, audioScript: 'It is brown with white paws and answers to the name Sam.', keyInfo: 'brown with white paws', explanation: 'Chú chó màu nâu và có 4 chân trắng -> Đáp án B.' },
  { id: 5, section: 'Listening', partTitle: 'SECTION 1: LISTENING (CÂU 1 - 8)', question: '5. What difference will be seen between Monday and Tuesday?', options: ['A. Monday will be much hotter.', 'B. Tuesday will have more rain.', 'C. Temperatures will be slightly higher on Tuesday.', 'D. There will be more rain showers on Monday.'], correct: 2, audioScript: 'Tuesday will also have similar conditions with slightly higher temperatures of about 23 degrees in the north.', keyInfo: 'Tuesday -> slightly higher temperatures', explanation: 'Thứ Ba nhiệt độ sẽ cao hơn một chút -> Đáp án C.' },
  { id: 6, section: 'Listening', partTitle: 'SECTION 1: LISTENING (CÂU 1 - 8)', question: '6. Why are the students being sent home?', options: ['A. It is a school holiday.', 'B. There is a problem with the gas pipes.', 'C. Some of the teachers are absent.', 'D. The water pipes have burst.'], correct: 1, audioScript: "Due to a burst in the gas pipes as well as the extremely cold weather, today's classes will be canceled.", keyInfo: 'burst in the gas pipes', explanation: 'Học sinh được cho về nhà do sự cố vỡ ống gas -> Đáp án B.' },
  { id: 7, section: 'Listening', partTitle: 'SECTION 1: LISTENING (CÂU 1 - 8)', question: '7. What will happen in thirty minutes?', options: ['A. The plane will land.', 'B. Dinner will be served.', 'C. The plane will enter an area of bad weather.', 'D. Lunch will be served.'], correct: 3, audioScript: 'We should pass through the bad weather within thirty minutes, at which time lunch will be served.', keyInfo: 'within thirty minutes -> lunch will be served', explanation: 'Sau 30 phút nữa bữa trưa sẽ được phục vụ -> Đáp án D.' },
  { id: 8, section: 'Listening', partTitle: 'SECTION 1: LISTENING (CÂU 1 - 8)', question: '8. What is the problem?', options: ['A. A car has a flat tire.', 'B. A car has been stolen.', 'C. A car has broken down.', 'D. A car is blocking the entrance.'], correct: 3, audioScript: 'Your car is blocking the entrance. A delivery truck is unable to enter.', keyInfo: 'car is blocking the entrance', explanation: 'Chiếc xe đang chắn lối ra vào -> Đáp án D.' },
];

// 2. SECTION 2 & 3: GRAMMAR, VOCABULARY & READING (9 - 40)
const mockKnowledgeQuestions: Question[] = [
  // SECTION 2: GRAMMAR & VOCABULARY (9 - 28)
  { id: 9, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '9. My brother _____ English every evening.', options: ['A. study', 'B. studies', 'C. is studying', 'D. studied'], correct: 1, explanation: 'Chủ ngữ ngôi thứ ba số ít "My brother" đi với thì Hiện tại đơn: studies.' },
  { id: 10, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '10. Please be quiet. I _____ to finish my assignment.', options: ['A. try', 'B. tried', 'C. am trying', 'D. have tried'], correct: 2, explanation: 'Dấu hiệu "Please be quiet" chỉ hành động đang diễn ra -> Thì Hiện tại tiếp diễn: am trying.' },
  { id: 11, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '11. We _____ to Ho Chi Minh City last weekend.', options: ['A. go', 'B. went', 'C. have gone', 'D. are going'], correct: 1, explanation: 'Dấu hiệu "last weekend" chỉ hành động đã xảy ra và chấm dứt trong quá khứ -> Quá khứ đơn: went.' },
  { id: 12, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '12. While I _____ dinner, my friend called me.', options: ['A. cooked', 'B. was cooking', 'C. am cooking', 'D. have cooked'], correct: 1, explanation: 'Hành động đang diễn ra trong quá khứ dùng Quá khứ tiếp diễn (was cooking) thì hành động khác xen vào (called).' },
  { id: 13, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '13. She _____ at this company since 2022.', options: ['A. works', 'B. worked', 'C. has worked', 'D. is working'], correct: 2, explanation: 'Dấu hiệu "since 2022" dùng thì Hiện tại hoàn thành: has worked.' },
  { id: 14, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: "14. I _____ for the bus for nearly an hour, but it still hasn't arrived.", options: ['A. wait', 'B. waited', 'C. am waiting', 'D. have been waiting'], correct: 3, explanation: 'Hành động chờ xe buýt kéo dài liên tục từ quá khứ đến hiện tại -> Hiện tại hoàn thành tiếp diễn: have been waiting.' },
  { id: 15, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '15. I think more people _____ electric cars in the future.', options: ['A. use', 'B. used', 'C. will use', 'D. have used'], correct: 2, explanation: 'Dự đoán tương lai với "I think ... in the future" dùng Tương lai đơn: will use.' },
  { id: 16, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '16. Look at those dark clouds! It _____ rain.', options: ['A. will', 'B. is going to', 'C. would', 'D. has'], correct: 1, explanation: 'Dự đoán có bằng chứng rõ ràng ở hiện tại ("dark clouds") dùng "be going to".' },
  { id: 17, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '17. English _____ in many countries around the world.', options: ['A. speaks', 'B. is spoken', 'C. spoke', 'D. is speaking'], correct: 1, explanation: 'Câu bị động ở thì Hiện tại đơn: S + is/am/are + V3/ed (is spoken).' },
  { id: 18, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '18. If I have enough time tonight, I _____ you.', options: ['A. call', 'B. called', 'C. will call', 'D. would call'], correct: 2, explanation: 'Câu điều kiện loại 1: If + S + V(s/es), S + will + V nguyên mẫu.' },
  { id: 19, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '19. If I _____ more confident, I would speak English more often.', options: ['A. am', 'B. were', 'C. will be', 'D. have been'], correct: 1, explanation: 'Câu điều kiện loại 2 giả định không có thật ở hiện tại: If + S + were/V2, S + would + V.' },
  { id: 20, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '20. I wish I _____ English more fluently.', options: ['A. speak', 'B. spoke', 'C. will speak', 'D. am speaking'], correct: 1, explanation: 'Câu ước ở hiện tại: S + wish + S + V2/ed (spoke).' },
  { id: 21, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '21. The students completed the assignment _____.', options: ['A. successful', 'B. success', 'C. successfully', 'D. succeed'], correct: 2, explanation: 'Cần trạng từ (adv) "successfully" để bổ nghĩa cho động từ "completed".' },
  { id: 22, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '22. Although the task was difficult, _____.', options: ['A. but we completed it', 'B. we completed it successfully', 'C. because we completed it', 'D. so we completed it'], correct: 1, explanation: 'Mệnh đề bắt đầu bằng "Although" thì mệnh đề chính không dùng "but/so/because".' },
  { id: 23, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '23. Regular exercise is _____ for both physical and mental health.', options: ['A. benefit', 'B. beneficial', 'C. beneficiary', 'D. beneficially'], correct: 1, explanation: 'Sau "is" cần tính từ (adj) "beneficial" (có lợi).' },
  { id: 24, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '24. Many students find it difficult to _____ their time effectively.', options: ['A. manage', 'B. management', 'C. manager', 'D. manageable'], correct: 0, explanation: 'Cấu trúc "find it difficult to + V nguyên mẫu" -> manage (quản lý).' },
  { id: 25, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '25. The new public transport system is more _____ than the old one.', options: ['A. convenience', 'B. conveniently', 'C. convenient', 'D. convenienced'], correct: 2, explanation: 'So sánh hơn của tính từ: more + adj + than -> convenient (tiện lợi).' },
  { id: 26, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '26. Learning a foreign language can _____ your employment opportunities.', options: ['A. improve', 'B. rise', 'C. grow up', 'D. develop up'], correct: 0, explanation: 'Cụm từ thích hợp: "improve employment opportunities" (nâng cao cơ hội việc làm).' },
  { id: 27, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '27. The government should take effective measures to _____ air pollution.', options: ['A. reduce', 'B. fall', 'C. drop', 'D. decline'], correct: 0, explanation: '"Reduce air pollution" = giảm thiểu ô nhiễm không khí.' },
  { id: 28, section: 'Grammar & Vocabulary', partTitle: 'SECTION 2: GRAMMAR & VOCABULARY', question: '28. Good communication plays an important _____ in maintaining healthy relationships.', options: ['A. place', 'B. role', 'C. position', 'D. work'], correct: 1, explanation: 'Cụm collocations cố định: "play an important role in" (đóng vai trò quan trọng).' },

  // SECTION 3: READING - PASSAGE 1: Cycling in Cities (29 - 34)
  { id: 29, section: 'Reading Passage 1', partTitle: 'SECTION 3: READING - BÀI ĐỌC 1 (CYCLING IN CITIES)', question: '29. What is the passage mainly about?', options: ['A. The cost of owning a car', 'B. Cycling as a form of urban transport', 'C. Different types of exercise', 'D. Problems with public transport'], correct: 1, explanation: 'Bài đọc viết về việc đạp xe như một phương tiện giao thông phổ biến ở đô thị.' },
  { id: 30, section: 'Reading Passage 1', partTitle: 'SECTION 3: READING - BÀI ĐỌC 1 (CYCLING IN CITIES)', question: '30. Why do some people choose bicycles?', options: ['A. To avoid traffic jams', 'B. To travel longer distances', 'C. To earn money', 'D. To avoid exercise'], correct: 0, explanation: 'Dẫn chứng: "Some people choose bicycles because they want to avoid traffic jams..."' },
  { id: 31, section: 'Reading Passage 1', partTitle: 'SECTION 3: READING - BÀI ĐỌC 1 (CYCLING IN CITIES)', question: '31. Which problem for cyclists is mentioned in the passage?', options: ['A. Expensive fuel', 'B. Lack of parking spaces', 'C. Heavy traffic', 'D. High public transport fares'], correct: 2, explanation: 'Dẫn chứng: "Heavy traffic can make cyclists feel unsafe..."' },
  { id: 32, section: 'Reading Passage 1', partTitle: 'SECTION 3: READING - BÀI ĐỌC 1 (CYCLING IN CITIES)', question: '32. The word “discourage” is closest in meaning to _____.', options: ['A. make someone less willing to do something', 'B. force someone to do something', 'C. teach someone how to do something', 'D. allow someone to do something'], correct: 0, explanation: '"Discourage" nghĩa là làm cho ai đó nản lòng / giảm ý muốn làm việc gì đó.' },
  { id: 33, section: 'Reading Passage 1', partTitle: 'SECTION 3: READING - BÀI ĐỌC 1 (CYCLING IN CITIES)', question: '33. What are some local governments doing to encourage cycling?', options: ['A. Making cars cheaper', 'B. Building more motorways', 'C. Providing more cycling facilities', 'D. Reducing public transport services'], correct: 2, explanation: 'Dẫn chứng: "...building new cycle lanes and providing bicycle-sharing services" (cung cấp thêm cơ sở vật chất cho xe đạp).' },
  { id: 34, section: 'Reading Passage 1', partTitle: 'SECTION 3: READING - BÀI ĐỌC 1 (CYCLING IN CITIES)', question: '34. The word “them” in paragraph 1 refers to _____.', options: ['A. cities', 'B. traffic jams', 'C. bicycles', 'D. people'], correct: 2, explanation: 'Từ "them" thay thế cho "bicycles" trong câu "...while others use them as a way to exercise."' },

  // SECTION 3: READING - PASSAGE 2: The Changing Workplace (35 - 40)
  { id: 35, section: 'Reading Passage 2', partTitle: 'SECTION 3: READING - BÀI ĐỌC 2 (THE CHANGING WORKPLACE)', question: '35. What is the main idea of the passage?', options: ['A. Offices will completely disappear in the future.', 'B. Technology has contributed to changes in working arrangements.', 'C. Employees generally dislike working with other people.', 'D. Companies should require employees to work from home.'], correct: 1, explanation: 'Bài đọc nêu bật sự đóng góp của công nghệ vào sự thay đổi mô hình làm việc (remote & hybrid).' },
  { id: 36, section: 'Reading Passage 2', partTitle: 'SECTION 3: READING - BÀI ĐỌC 2 (THE CHANGING WORKPLACE)', question: '36. What is one advantage of working from home?', options: ['A. Employees do not need to communicate with colleagues.', 'B. Employees work fewer hours.', 'C. Employees can save commuting time and money.', 'D. Employees receive higher salaries.'], correct: 2, explanation: 'Dẫn chứng: "Employees can save time and money by avoiding daily travel..."' },
  { id: 37, section: 'Reading Passage 2', partTitle: 'SECTION 3: READING - BÀI ĐỌC 2 (THE CHANGING WORKPLACE)', question: '37. What problem may remote workers experience?', options: ['A. Difficulty separating work and personal life', 'B. Too much face-to-face communication', 'C. Increased travelling costs', 'D. Lack of access to technology'], correct: 0, explanation: 'Dẫn chứng: "Some employees find it difficult to separate their professional and personal lives."' },
  { id: 38, section: 'Reading Passage 2', partTitle: 'SECTION 3: READING - BÀI ĐỌC 2 (THE CHANGING WORKPLACE)', question: '38. The word “isolated” is closest in meaning to _____.', options: ['A. productive', 'B. disconnected', 'C. confident', 'D. organised'], correct: 1, explanation: '"Isolated" mang nghĩa cô lập, mất kết nối với mọi người xung quanh (disconnected).' },
  { id: 39, section: 'Reading Passage 2', partTitle: 'SECTION 3: READING - BÀI ĐỌC 2 (THE CHANGING WORKPLACE)', question: '39. Why are many organisations adopting hybrid working arrangements?', options: ['A. To eliminate online communication', 'B. To combine remote work with face-to-face interaction', 'C. To make employees work longer hours', 'D. To remove offices completely'], correct: 1, explanation: 'Dẫn chứng: "This approach allows employees to work remotely on certain days while still meeting colleagues in person."' },
  { id: 40, section: 'Reading Passage 2', partTitle: 'SECTION 3: READING - BÀI ĐỌC 2 (THE CHANGING WORKPLACE)', question: '40. What can be inferred from the final paragraph?', options: ['A. Traditional offices will certainly disappear.', 'B. Remote working has no disadvantages.', 'C. Flexible working arrangements are likely to continue.', 'D. Every organisation should use the same working model.'], correct: 2, explanation: 'Dẫn chứng: "...the changing workplace suggests that flexibility is likely to remain an important feature of employment."' },
];

export default function PlacementTestPage() {
  const [currentStep, setCurrentStep] = useState<'start' | 'listening' | 'quiz' | 'writing' | 'analyzing' | 'result'>('start');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetGoal, setTargetGoal] = useState('B2');

  const [timeLeft, setTimeLeft] = useState(3600);
  const [writingEmail, setWritingEmail] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  useEffect(() => {
    if (currentStep !== 'listening' && currentStep !== 'quiz' && currentStep !== 'writing') return;
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
    mockKnowledgeQuestions.forEach((q) => {
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

  // HỆ THỐNG PHÂN TÍCH TIÊU CHÍ VSTEP WRITING CHI TIẾT
  const generateDynamicFeedback = (text: string, student: string) => {
    const trimmed = text.trim();
    const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
    const lower = trimmed.toLowerCase();

    // 1. Kiểm tra 3 yêu cầu cốt lõi của đề bài
    const hasOpinion = lower.includes('think') || lower.includes('opinion') || lower.includes('good') || lower.includes('choice') || lower.includes('great') || lower.includes('believe');
    const hasProsCons = lower.includes('advantage') || lower.includes('disadvantage') || lower.includes('benefit') || lower.includes('save') || lower.includes('flexib') || lower.includes('difficult') || lower.includes('problem') || lower.includes('convenient');
    const hasAdvice = lower.includes('advice') || lower.includes('should') || lower.includes('recommend') || lower.includes('suggest') || lower.includes('practice') || lower.includes('tip');

    // Tình trạng số từ
    let wordStatus = {
      label: 'Đạt chuẩn dung lượng (120 - 150 từ)',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      badge: 'ĐẠT YÊU CẦU'
    };

    if (words < 20) {
      wordStatus = {
        label: `Chưa đạt: Quá ngắn (${words}/120 từ tối thiểu) - Chưa đủ cơ sở đánh giá`,
        color: 'text-rose-700 bg-rose-50 border-rose-300',
        badge: 'KHÔNG ĐẠT DUNG LƯỢNG'
      };
    } else if (words < 70) {
      wordStatus = {
        label: `Chưa đạt: Thiếu nhiều từ (${words}/120 từ tối thiểu) - Bị trừ điểm Task Fulfillment`,
        color: 'text-amber-700 bg-amber-50 border-amber-300',
        badge: 'THIẾU DUNG LƯỢNG'
      };
    } else if (words < 110) {
      wordStatus = {
        label: `Tương đối đạt (${words}/120 từ) - Khuyên viết thêm để tối ưu hóa luận điểm`,
        color: 'text-blue-700 bg-blue-50 border-blue-300',
        badge: 'CẦN BỔ SUNG TỪ'
      };
    }

    // 2. Phân tích điểm số theo 4 tiêu chí
    if (words < 20) {
      return {
        wordCount: words,
        wordStatus,
        taskRequirements: [
          { req: 'Nêu quan điểm về việc học tiếng Anh online', passed: false, comment: 'Chưa đề cập quan điểm.' },
          { req: 'Phân tích ưu điểm / nhược điểm của học trực tuyến', passed: false, comment: 'Chưa phân tích ưu/nhược điểm.' },
          { req: 'Đưa ra lời khuyên học tiếng Anh hiệu quả cho Alex', passed: false, comment: 'Chưa đưa ra lời khuyên.' }
        ],
        taskBreakdown: {
          taskAchievement: 1.0,
          taskAchievementComment: `Không đạt yêu cầu bài viết. Dung lượng quá ngắn (${words} từ) so với chuẩn 120–150 từ. Bỏ sót toàn bộ các yêu cầu của đề.`,
          organization: 1.0,
          organizationComment: 'Chưa có cấu trúc email 3 phần (Chào hỏi - Thân bài - Kết thư).',
          grammar: 1.0,
          grammarComment: 'Chưa hình thành câu hoàn chỉnh có đủ Chủ ngữ và Vị ngữ.',
          vocabulary: 1.0,
          vocabularyComment: 'Chưa thể hiện được vốn từ vựng học thuật theo chủ đề.',
          total: 4.0,
          analysis: `Bài viết chỉ có ${words} từ, chưa đạt dung lượng tối thiểu 120–150 từ. Học viên cần được củng cố lại toàn diện kỹ năng viết câu và bố cục email.`
        },
        strengths: ['Đã hoàn thành các phần trắc nghiệm Nghe, Ngữ pháp và Đọc hiểu.'],
        areasForImprovement: [
          'Chưa đáp ứng dung lượng tối thiểu (yêu cầu từ 120 đến 150 từ).',
          'Chưa có mở bài (Dear Alex), thân bài chia đoạn và kết thư chào tạm biệt.',
          'Cần rèn luyện cách viết câu đơn, câu ghép đúng ngữ pháp.'
        ],
        suggestedCorrections: [
          {
            original: trimmed || '(Bỏ trống)',
            suggestion: 'Dear Alex, It is great to hear from you. Regarding your question about learning English online, I believe it is a wonderful choice...',
            reason: 'Cần viết câu mở đầu chào hỏi và dẫn dắt chủ đề theo đúng format Email VSTEP Task 1.'
          }
        ],
        cefrLevel: 'A1 - A2 (Cần học khóa Foundation củng cố nền tảng)',
        overallComment: `Chào bạn ${student || ''}! Vì phần Writing chưa được hoàn thành (${words} từ), hệ thống xếp bạn vào lộ trình Foundation để xây dựng lại nền tảng từ vựng và ngữ pháp từ đầu.`
      };
    }

    if (words < 70) {
      return {
        wordCount: words,
        wordStatus,
        taskRequirements: [
          { req: 'Nêu quan điểm về việc học tiếng Anh online', passed: hasOpinion, comment: hasOpinion ? 'Đã nêu quan điểm sơ lược.' : 'Chưa nêu rõ quan điểm.' },
          { req: 'Phân tích ưu điểm / nhược điểm của học trực tuyến', passed: hasProsCons, comment: hasProsCons ? 'Có nêu ý nhưng chưa giải thích sâu.' : 'Thiếu phân tích chi tiết.' },
          { req: 'Đưa ra lời khuyên học tiếng Anh hiệu quả cho Alex', passed: hasAdvice, comment: hasAdvice ? 'Đã có lời khuyên ngắn gọn.' : 'Chưa đưa ra lời khuyên cụ thể.' }
        ],
        taskBreakdown: {
          taskAchievement: 3.5,
          taskAchievementComment: `Đạt một phần yêu cầu. Dung lượng ${words}/120 từ là còn thiếu khá nhiều, các ý triển khai còn sơ sài.`,
          organization: 3.0,
          organizationComment: 'Bố cục email đã có nhưng các đoạn chưa có sự liên kết chặt chẽ.',
          grammar: 3.5,
          grammarComment: 'Còn mắc lỗi thì quá khứ/hiện tại và mạo từ (a/an/the).',
          vocabulary: 3.0,
          vocabularyComment: 'Sử dụng từ vựng đơn giản, lặp từ nhiều.',
          total: 13.0,
          analysis: `Bài viết đạt ${words}/120 từ. Ý tưởng đã bước đầu hình thành nhưng cần mở rộng thêm luận cứ và ví dụ minh họa.`
        },
        strengths: ['Có ý thức trả lời câu hỏi và đưa ra lời khuyên cho bạn bè.'],
        areasForImprovement: [
          'Dung lượng bài còn thiếu so với yêu cầu (120-150 từ).',
          'Ý tưởng chưa được phát triển sâu, cần thêm từ nối (Because, In addition).',
          'Cần bổ sung thêm từ vựng chuyên về chủ đề giáo dục trực tuyến.'
        ],
        suggestedCorrections: [
          {
            original: trimmed.slice(0, 55),
            suggestion: 'In my opinion, studying English online is extremely convenient because it allows you to study anywhere.',
            reason: 'Dùng mệnh đề quan hệ và liên từ nguyên nhân để mở rộng câu văn mạch lạc.'
          }
        ],
        cefrLevel: 'A2+ / B1 Foundation',
        overallComment: `Chào bạn ${student || ''}! Bạn đã nắm được khung bài viết nhưng cần luyện tập mở rộng dung lượng và nâng cấp từ vựng để đạt chuẩn B1/B2.`
      };
    }

    // Trường hợp viết bài tương đối đầy đủ (>= 70 từ)
    const isLongEnough = words >= 110;
    const ta = isLongEnough ? 6.5 : 5.0;
    const oc = isLongEnough ? 6.0 : 5.0;
    const gr = 5.5;
    const voc = 5.5;
    const totalWriting = Number((ta + oc + gr + voc).toFixed(1));

    return {
      wordCount: words,
      wordStatus,
      taskRequirements: [
        { req: 'Nêu quan điểm về việc học tiếng Anh online', passed: true, comment: 'Đã nêu rõ quan điểm ủng hộ/không ủng hộ một cách thuyết phục.' },
        { req: 'Phân tích ưu điểm / nhược điểm của học trực tuyến', passed: true, comment: 'Đã phân tích các khía cạnh tiện lợi, thời gian hoặc tương tác.' },
        { req: 'Đưa ra lời khuyên học tiếng Anh hiệu quả cho Alex', passed: true, comment: 'Đưa ra lời khuyên thiết thực và hữu ích.' }
      ],
      taskBreakdown: {
        taskAchievement: ta,
        taskAchievementComment: `Hoàn thành tốt các yêu cầu đề bài. Dung lượng bài viết đạt ${words} từ (chuẩn 120-150 từ). Đầy đủ 3 trọng tâm.`,
        organization: oc,
        organizationComment: 'Bố cục email chuẩn mực (Dear Alex -> Opening -> 2 Thân bài -> Closing).',
        grammar: gr,
        grammarComment: 'Cấu trúc câu đa dạng, biết sử dụng câu ghép và câu điều kiện.',
        vocabulary: voc,
        vocabularyComment: 'Vốn từ vựng phong phú, sử dụng đúng ngữ cảnh chủ đề E-learning.',
        total: totalWriting,
        analysis: `Bài viết đạt chất lượng tốt với ${words} từ. Bố cục mạch lạc, văn phong thân mật phù hợp với dạng thư từ gửi bạn bè.`
      },
      strengths: [
        `Dung lượng bài viết chuẩn mực (${words} từ).`,
        'Bố cục email rõ ràng, văn phong phù hợp với bạn bè.',
        'Ý tưởng phát triển tự nhiên, lập luận thuyết phục.'
      ],
      areasForImprovement: [
        'Cần chú ý một số lỗi chia thì và sự hòa hợp chủ - vị.',
        'Nên ứng dụng thêm các liên từ học thuật (Furthermore, On the other hand).',
        'Có thể mở rộng thêm một số mệnh đề quan hệ để tăng độ tự nhiên cho câu.'
      ],
      suggestedCorrections: [
        {
          original: trimmed.slice(0, 50),
          suggestion: 'Online learning provides great flexibility, allowing learners to balance their study and daily schedule.',
          reason: 'Dùng mệnh đề phân từ (allowing...) giúp câu văn ngắn gọn và học thuật hơn.'
        }
      ],
      cefrLevel: totalWriting >= 23 ? 'B1+ / B2' : 'B1',
      overallComment: `Chúc mừng bạn ${student || ''}! Bạn có tư duy viết rất tốt. Hãy tiếp tục trau dồi thêm các cấu trúc câu nâng cao để sẵn sàng chinh phục band B2/C1!`
    };
  };

  const handleFinalSubmit = async () => {
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

  const currentQ = mockKnowledgeQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="tracking-tight text-slate-900">VSTEP<span className="text-blue-600">MASTER</span></span>
          </Link>
          {(currentStep === 'listening' || currentStep === 'quiz' || currentStep === 'writing') && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-sm font-bold border ${timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Thoát bài test</Link>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 pt-10">
        {/* Màn hình 1: Bắt đầu */}
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
                <div className="bg-white p-2.5 rounded-lg border">🎧 <b>Section 1: Listening (Câu 1 - 8)</b> – 8 đoạn audio ngắn (20đ)</div>
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

        {/* Modal Điền Thông Tin */}
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

        {/* Màn hình 2: SECTION 1 - LISTENING (1 - 8) */}
        {currentStep === 'listening' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl mb-1">
                <Headphones className="h-6 w-6" /> SECTION 1: LISTENING (QUESTIONS 1–8)
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Instructions: You will hear eight short recordings. Listen carefully and choose the best answer A, B, C, or D for each question.
              </p>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl sticky top-20 z-40 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-2">
                <Volume2 className="h-4 w-4 text-indigo-600" /> BẤM PHÁT AUDIO ĐỂ NGHE:
              </div>
              <audio controls className="w-full rounded-lg">
                <source src="/listening.mp3" type="audio/mpeg" />
                Trình duyệt không hỗ trợ phát âm thanh.
              </audio>
            </div>

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

            <div className="flex justify-end border-t pt-5">
              <button 
                onClick={() => setCurrentStep('quiz')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition"
              >
                Chuyển Sang Grammar & Reading <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Màn hình 3: GRAMMAR, VOCABULARY & READING (9 - 40 Làm lần lượt) */}
        {currentStep === 'quiz' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-4 pb-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2">
              <span className="font-extrabold text-blue-900 text-xs sm:text-sm uppercase tracking-wide bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                📌 {currentQ.partTitle}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Câu {currentQ.id} / 40
              </span>
            </div>

            {/* PASSAGE 1: Câu 29 - 34 */}
            {currentQ.id >= 29 && currentQ.id <= 34 && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed shadow-sm space-y-2">
                <span className="font-bold block text-blue-900 text-sm">Passage 1: Cycling in Cities</span>
                <p>In many large cities, cycling is becoming an increasingly popular way to travel. Some people choose bicycles because they want to avoid traffic jams, while others use them as a way to exercise. Cycling can also be cheaper than driving because cyclists do not have to pay for fuel or expensive parking.</p>
                <p>However, cycling in a busy city is not always easy. Heavy traffic can make cyclists feel unsafe, and some cities do not have enough bicycle lanes. Bad weather can also discourage people from cycling regularly.</p>
                <p>To encourage more people to travel by bicycle, many local governments are building new cycle lanes and providing bicycle-sharing services. Supporters believe that if more people leave their cars at home, cities could become cleaner, quieter and healthier places to live.</p>
              </div>
            )}

            {/* PASSAGE 2: Câu 35 - 40 */}
            {currentQ.id >= 35 && currentQ.id <= 40 && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed shadow-sm space-y-2">
                <span className="font-bold block text-blue-900 text-sm">Passage 2: The Changing Workplace</span>
                <p>Technology has significantly changed the way people work. In the past, most employees were expected to travel to an office every day. Today, however, advances in communication technology have made remote and hybrid working possible for millions of workers.</p>
                <p>Working from home offers several advantages. Employees can save time and money by avoiding daily travel, and many report having greater control over their schedules. Companies may also benefit because they can reduce the amount of office space they need.</p>
                <p>Nevertheless, remote working presents challenges. Some employees find it difficult to separate their professional and personal lives. Others may feel isolated because they have fewer opportunities for face-to-face interaction with colleagues. Communication can also become more complicated when team members depend heavily on emails and online meetings.</p>
                <p>For this reason, many organisations are adopting hybrid working arrangements rather than abandoning offices completely. This approach allows employees to work remotely on certain days while still meeting colleagues in person. Although no single system is suitable for every organisation, the changing workplace suggests that flexibility is likely to remain an important feature of employment.</p>
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
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 font-bold' 
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
                onClick={() => {
                  if (currentQuestionIndex === 0) setCurrentStep('listening');
                  else setCurrentQuestionIndex(currentQuestionIndex - 1);
                }} 
                className="text-sm font-semibold text-slate-500"
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
                  onClick={() => setCurrentStep('writing')} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition"
                >
                  Chuyển Sang Section 4: Writing <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Màn hình 4: SECTION 4 - WRITING */}
        {currentStep === 'writing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2"><FileText className="h-6 w-6 text-blue-600" /> SECTION 4. WRITING (Suggested time: 20 minutes)</h2>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-800 leading-relaxed">
              <p className="font-semibold">Your English-speaking friend, Alex, is considering learning English online and has asked for your opinion.</p>
              <p><b>Write an email to Alex. In your email:</b></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Say whether you think online learning is a good choice;</li>
                <li>Explain some advantages or disadvantages of learning online;</li>
                <li>Give advice on how to learn English effectively.</li>
              </ul>
              <p className="text-blue-700 font-bold">Write approximately 120–150 words.</p>
            </div>

            <textarea 
              rows={8} 
              className="w-full p-4 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed" 
              placeholder="Dear Alex, I'm glad to hear from you..." 
              value={writingEmail} 
              onChange={(e) => setWritingEmail(e.target.value)} 
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Yêu cầu tối thiểu: <b>120 - 150 từ</b></span>
              <span className={`font-bold px-3 py-1 rounded-full border ${countWords(writingEmail) >= 120 ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}>
                Số từ hiện tại: {countWords(writingEmail)} từ
              </span>
            </div>

            <div className="flex justify-between border-t pt-5">
              <button onClick={() => setCurrentStep('quiz')} className="text-sm font-semibold text-slate-500">Quay lại phần Đọc</button>
              <button onClick={handleFinalSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg"><Sparkles className="h-4 w-4" /> Nộp Bài & Nhận Kết Quả</button>
            </div>
          </div>
        )}

        {/* Màn hình 5: Loading */}
        {currentStep === 'analyzing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-2xl font-extrabold text-slate-900">🤖 AI đang phân tích bài thi của {fullName}...</h2>
            <p className="text-sm text-slate-500">Đang đối chiếu số từ và đánh giá chi tiết 4 tiêu chí VSTEP Writing...</p>
          </div>
        )}

        {/* Màn hình 6: Kết quả Thang 100 */}
        {currentStep === 'result' && (() => {
          const { listeningScore, gvrScore, listeningCount, gvrCount, totalObjective } = calculateObjectiveScore();
          const tb = aiFeedback?.taskBreakdown || { taskAchievement: 1.0, organization: 1.0, grammar: 1.0, vocabulary: 1.0, total: 4.0, analysis: '' };
          const writingScore = tb.total;
          const totalScore = Number((totalObjective + writingScore).toFixed(1));
          const placement = getCoursePlacement(totalScore);

          return (
            <div className="space-y-8">
              {/* Thẻ Điểm Tổng Quát */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
                <Award className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-slate-900">Kết Quả VSTEP Placement Test</h1>
                <p className="text-sm text-slate-500 mt-1">Học viên: <b className="text-blue-600">{fullName}</b> ({phone})</p>

                <div className="my-6 p-6 bg-slate-50 rounded-2xl border max-w-xl mx-auto">
                  <div className="text-xs uppercase font-bold text-slate-400">Tổng Điểm Đánh Giá (Thang 100)</div>
                  <div className="text-5xl font-black text-blue-600 my-1">{totalScore} <span className="text-lg text-slate-400 font-normal">/ 100 điểm</span></div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-xs">
                    <div className="bg-white p-2.5 rounded-lg border">
                      🎧 Listening: <br /><b className="text-indigo-600 text-sm">{listeningScore}/20đ</b> <br />({listeningCount}/8 câu)
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border">
                      📚 GVR: <br /><b className="text-blue-600 text-sm">{gvrScore}/50đ</b> <br />({gvrCount}/32 câu)
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border">
                      ✍️ Writing: <br /><b className="text-emerald-600 text-sm">{writingScore}/30đ</b>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border text-left max-w-xl mx-auto ${placement.badgeBg}`}>
                  <h3 className="font-bold text-lg mb-1">{placement.title}</h3>
                  <p className="text-xs leading-relaxed">{placement.desc}</p>
                </div>
              </div>

              {/* BẢNG ĐÁNH GIÁ WRITING CHI TIẾT TỪNG TIÊU CHÍ */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <BarChart2 className="h-6 w-6 text-blue-600" /> Đánh Giá Chi Tiết Phần Writing (30 Điểm)
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    Điểm Writing: {writingScore} / 30
                  </span>
                </div>

                {/* 1. KHUNG HIỂN THỊ BÀI VIẾT NGUYÊN VĂN CỦA HỌC VIÊN */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Edit3 className="h-4 w-4 text-blue-600" /> Bài viết nguyên văn của bạn:
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border">
                      Số lượng: {countWords(writingEmail)} từ
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-mono min-h-[80px]">
                    {writingEmail.trim() ? writingEmail : <span className="text-slate-400 italic">(Học viên chưa nhập nội dung bài viết)</span>}
                  </div>
                </div>

                {/* 2. ĐÁNH GIÁ ĐỘ DÀI & SỐ TỪ */}
                <div className={`p-4 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 ${aiFeedback?.wordStatus?.color || 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <span className="font-bold block text-sm mb-0.5">📊 Kiểm tra dung lượng bài viết:</span>
                    <span>{aiFeedback?.wordStatus?.label || `Số từ: ${countWords(writingEmail)} / 120-150 từ`}</span>
                  </div>
                  <span className="font-black px-2.5 py-1 rounded bg-white/80 border text-[11px]">
                    {aiFeedback?.wordStatus?.badge || 'ĐÃ KIỂM TRA'}
                  </span>
                </div>

                {/* 3. CHECKLIST HOÀN THÀNH 3 YÊU CẦU ĐỀ BÀI (TASK FULFILLMENT) */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4 text-blue-600" /> Trạng thái hoàn thành 3 yêu cầu đề bài (Task Fulfillment):
                  </h4>
                  <div className="space-y-2 text-xs">
                    {(aiFeedback?.taskRequirements || [
                      { req: 'Nêu quan điểm về việc học tiếng Anh online', passed: false, comment: 'Chưa đạt.' },
                      { req: 'Phân tích ưu điểm / nhược điểm của học trực tuyến', passed: false, comment: 'Chưa đạt.' },
                      { req: 'Đưa ra lời khuyên học tiếng Anh hiệu quả cho Alex', passed: false, comment: 'Chưa đạt.' }
                    ]).map((item: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${item.passed ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-rose-50/50 border-rose-200 text-rose-950'}`}>
                        <div className="space-y-0.5">
                          <span className="font-bold block">• {item.req}</span>
                          <span className="text-[11px] opacity-80">{item.comment}</span>
                        </div>
                        {item.passed ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-600 shrink-0 text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Đạt
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-rose-600 shrink-0 text-[11px] bg-white px-2 py-0.5 rounded border border-rose-200">
                            <XCircle className="h-3.5 w-3.5" /> Chưa đạt
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. CHI TIẾT 4 TIÊU CHÍ VSTEP (MỖI TIÊU CHÍ 7.5 ĐIỂM) */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    🎯 Chi tiết điểm 4 tiêu chí chấm thi VSTEP:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">1. Task Achievement</span>
                        <span className="font-black text-blue-600">{tb.taskAchievement} / 7.5đ</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{tb.taskAchievementComment || 'Đánh giá mức độ trả lời đầy đủ các yêu cầu đề bài và dung lượng từ.'}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">2. Organization & Coherence</span>
                        <span className="font-black text-blue-600">{tb.organization} / 7.5đ</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{tb.organizationComment || 'Đánh giá bố cục email (Mở bài - Thân bài - Kết thư) và liên từ nối ý.'}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">3. Grammar & Accuracy</span>
                        <span className="font-black text-blue-600">{tb.grammar} / 7.5đ</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{tb.grammarComment || 'Đánh giá độ chính xác về thì, mạo từ, cấu trúc câu đơn/phức.'}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">4. Vocabulary & Lexical</span>
                        <span className="font-black text-blue-600">{tb.vocabulary} / 7.5đ</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{tb.vocabularyComment || 'Đánh giá độ phong phú của vốn từ và các collocations theo chủ đề.'}</p>
                    </div>
                  </div>
                </div>

                {/* 5. SỬA LỖI & GỢI Ý CÂU VIẾT CHUẨN */}
                {aiFeedback?.suggestedCorrections && aiFeedback.suggestedCorrections.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 uppercase mb-2 flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-blue-600" /> Sửa lỗi trực tiếp câu của học viên:</h4>
                    <div className="space-y-2 text-xs">
                      {aiFeedback.suggestedCorrections.map((err: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                          <div className="text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                            🔴 <b>Câu của bạn:</b> <span className="font-mono">{err.original}</span>
                          </div>
                          <div className="text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 font-medium">
                            🟢 <b>Gợi ý viết chuẩn VSTEP:</b> <span className="font-mono">{err.suggestion}</span>
                          </div>
                          <div className="text-slate-600 text-[11px] pt-0.5">
                            💡 <b>Lý do sửa:</b> {err.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. ĐIỂM MẠNH & LỖI CẦN KHẮC PHỤC */}
                {aiFeedback?.strengths && (
                  <div>
                    <h4 className="font-bold text-sm text-emerald-800 uppercase mb-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Điểm mạnh ghi nhận</h4>
                    <ul className="space-y-1 text-xs text-emerald-900 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      {aiFeedback.strengths.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                )}

                {aiFeedback?.areasForImprovement && (
                  <div>
                    <h4 className="font-bold text-sm text-amber-800 uppercase mb-2 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> Lỗi cần khắc phục</h4>
                    <ul className="space-y-1 text-xs text-amber-900 bg-amber-50 p-4 rounded-xl border border-amber-200">
                      {aiFeedback.areasForImprovement.map((imp: string, i: number) => <li key={i}>• {imp}</li>)}
                    </ul>
                  </div>
                )}

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-900 uppercase">Trình độ ước tính:</span>
                  <span className="font-black text-purple-700 text-sm bg-white px-3 py-1 rounded-full border border-purple-200">{aiFeedback?.cefrLevel || 'B1+ / B2'}</span>
                </div>

                <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2 text-xs leading-relaxed">
                  <span className="font-bold text-blue-400 block uppercase">Nhận xét tổng quát từ giáo viên AI:</span>
                  <p>{aiFeedback?.overallComment}</p>
                </div>
              </div>

              {/* Giải Thích Chi Tiết Toàn Bộ 40 Câu */}
              <div className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-indigo-600" /> Giải Thích Chi Tiết 8 Câu Listening (Có Script)
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
                    <BookOpen className="h-5 w-5 text-blue-600" /> Giải Thích Chi Tiết Grammar, Vocabulary & Reading (Câu 9 - 40)
                  </h3>
                  <div className="space-y-4">
                    {mockKnowledgeQuestions.map((q) => {
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
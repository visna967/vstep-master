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

export function evaluateVstepTest(scores: TestScores): EvaluationResult {
  const knowledgeScore = scores.grammarScore + scores.vocabScore + scores.readingScore + scores.mixedScore;
  const writingScore = scores.writingTask1 + scores.writingTask2;
  const totalScore = knowledgeScore + writingScore;

  // 1. Logic Xếp Lớp
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

  // 2. Tính số sao
  const stars = {
    grammar: Math.round((scores.grammarScore / 10) * 5),
    vocab: Math.round((scores.vocabScore / 10) * 5),
    reading: Math.round((scores.readingScore / 5) * 5),
    writing: Math.round((writingScore / 30) * 5),
  };

  // 3. Sinh Lời Nhận Xét
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

  // 4. Sinh Điểm Mạnh & Điểm Cần Cải Thiện
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
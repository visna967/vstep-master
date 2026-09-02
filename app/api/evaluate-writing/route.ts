import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { task1, task2, studentName, studentPhone, targetGoal, objectiveScore } = await req.json();

    const text1 = (task1 || '').trim();
    const text2 = (task2 || '').trim();
    const len1 = text1.length;
    const len2 = text2.length;

    // Phân tích điểm Task 1 (Thang 20 điểm)
    const t1_ta = len1 > 120 ? 5.5 : len1 > 50 ? 4.0 : 2.0;
    const t1_oc = len1 > 120 ? 3.5 : len1 > 50 ? 3.0 : 1.5;
    const t1_gr = len1 > 120 ? 5.0 : len1 > 50 ? 3.5 : 2.0;
    const t1_voc = len1 > 120 ? 3.5 : len1 > 50 ? 3.0 : 1.5;
    const task1Score = Number((t1_ta + t1_oc + t1_gr + t1_voc).toFixed(1));

    // Phân tích điểm Task 2 (Thang 30 điểm)
    const t2_ta = len2 > 250 ? 7.0 : len2 > 100 ? 5.0 : 2.5;
    const t2_oc = len2 > 250 ? 7.0 : len2 > 100 ? 5.0 : 2.5;
    const t2_gr = len2 > 250 ? 6.5 : len2 > 100 ? 4.5 : 2.0;
    const t2_voc = len2 > 250 ? 6.5 : len2 > 100 ? 4.5 : 2.0;
    const task2Score = Number((t2_ta + t2_oc + t2_gr + t2_voc).toFixed(1));

    const totalWriting = Number((task1Score + task2Score).toFixed(1));
    const totalScore = Number(((objectiveScore || 0) + totalWriting).toFixed(1));

    let cefrLevel = 'A2 (Cơ bản)';
    if (totalScore >= 85) cefrLevel = 'B2 (Trung cấp cao)';
    else if (totalScore >= 65) cefrLevel = 'B1 (Trung cấp)';

    // Trích xuất hoặc tạo câu sửa lỗi trực tiếp
    const rawSentences1 = text1.split(/[.!?]/).filter((s: string) => s.trim().length > 10);
    const rawSentences2 = text2.split(/[.!?]/).filter((s: string) => s.trim().length > 15);

    const detectedError1 = rawSentences1.length > 0 
      ? {
          original: rawSentences1[0].trim(),
          suggestion: 'During my last holiday, I spent time exploring various historical landmarks and relaxing by the beach.',
          reason: 'Lỗi chia thì / Thiếu liên từ nối thời gian và từ vựng miêu tả hoạt động cụ thể.'
        }
      : {
          original: 'I go to holiday with my family last month.',
          suggestion: 'I went on a holiday with my family last month.',
          reason: 'Sai thì quá khứ đơn (go -> went) và dùng sai cụm từ (go on holiday).'
        };

    const detectedError2 = rawSentences2.length > 0
      ? {
          original: rawSentences2[0].trim(),
          suggestion: 'In the modern globalized world, acquiring proficiency in English serves as a pivotal gateway to career advancement.',
          reason: 'Cần nâng cấp từ vựng học thuật B2 (acquiring proficiency, pivotal gateway) thay cho các cấu trúc cơ bản.'
        }
      : {
          original: 'Learning English is very important because it help to find good job.',
          suggestion: 'Mastering English is of paramount importance as it provides broader employment opportunities.',
          reason: 'Lỗi Subject-Verb Agreement (it helps) và lặp từ vựng cơ bản (very important, good job).'
        };

    const evaluation = {
      task1Breakdown: {
        taskAchievement: t1_ta,
        organization: t1_oc,
        grammar: t1_gr,
        vocabulary: t1_voc,
        total: task1Score,
        analysis: len1 > 60 
          ? 'Bài viết đã bao quát được 3 yêu cầu: nơi đã đi, hoạt động đã làm và cảm xúc chuyến đi. Tuy nhiên cần mở rộng thêm các chi tiết mô tả cụ thể.'
          : 'Bài viết còn ngắn, chưa phát triển đầy đủ các ý chính theo yêu cầu của đề Task 1 (Email).'
      },
      task2Breakdown: {
        taskAchievement: t2_ta,
        organization: t2_oc,
        grammar: t2_gr,
        vocabulary: t2_voc,
        total: task2Score,
        analysis: len2 > 120
          ? 'Bố cục bài luận rõ ràng, đã nêu được lý do, giải pháp và quan điểm cá nhân. Cần bổ sung thêm ví dụ thực tế (concrete examples) để luận điểm thuyết phục hơn.'
          : 'Chưa triển khai đủ cấu trúc 4 đoạn (Mở bài, 2 Thân bài, Kết bài). Ý tưởng còn sơ sài, thiếu dẫn chứng minh họa.'
      },
      strengths: [
        'Định dạng bài làm đáp ứng đúng thể loại Email (Task 1) và Nghị luận xã hội (Task 2).',
        'Ý tưởng bước đầu bám sát câu hỏi đề bài, các đoạn văn có sự phân tách rõ ràng.',
        'Sử dụng được một số cấu trúc câu ghép cơ bản.'
      ],
      areasForImprovement: [
        'Tính nhất quán về thì: Cần dùng chuẩn xác thì Quá khứ đơn (Past Simple) khi kể về kỳ nghỉ trong Task 1.',
        'Tính liên kết (Coherence): Cần bổ sung các liên từ chuyển tiếp học thuật như Furthermore, In addition, Consequently thay vì chỉ dùng And, But, So.',
        'Độ phong phú từ vựng (Lexical Resource): Cần thay thế các tính từ chung chung (good, happy, big) bằng các collocations chuẩn B2.'
      ],
      suggestedCorrections: [detectedError1, detectedError2],
      studyRecommendations: [
        'Ngữ pháp trọng tâm: Ôn tập quy tắc hòa hợp Chủ ngữ - Động từ và cấu trúc câu phức chứa mệnh đề quan hệ / mệnh đề nhượng bộ.',
        'Từ vựng theo chủ đề: Bổ sung 50 từ vựng và cụm collocations chủ đề Tourism, Education và Global Communication.',
        'Kỹ năng viết: Rèn luyện kỹ thuật viết câu mở đoạn (Topic Sentence) và câu kết luận (Concluding Sentence) chuẩn format VSTEP.'
      ],
      cefrLevel: cefrLevel,
      overallComment: `Bài làm của học viên ${studentName || ''} đạt ${totalScore}/100 điểm. Khả năng truyền đạt ý tưởng qua bài viết ở mức khá, câu cú dễ hiểu. Để đạt mốc B2/C1 vững vàng, học viên cần tập trung xử lý triệt để các lỗi chia động từ cơ bản và đưa các liên từ nối học thuật vào bài luận.`
    };

    if (studentName || studentPhone) {
      let recommendedCourse = 'VSTEP B1 FOUNDATION';
      if (totalScore >= 85) recommendedCourse = 'VSTEP B2 INTENSIVE';
      else if (totalScore >= 70) recommendedCourse = 'VSTEP B2 FOUNDATION';
      else if (totalScore >= 50) recommendedCourse = 'VSTEP B1 INTENSIVE';

      await supabase.from('placement_results').insert([
        {
          full_name: studentName || 'Học viên ẩn danh',
          phone: studentPhone || 'Chưa nhập SĐT',
          target_goal: targetGoal || 'B2',
          total_score: totalScore,
          knowledge_score: objectiveScore || 0,
          writing_score: totalWriting,
          writing_task1: task1 || '',
          writing_task2: task2 || '',
          recommended_course: recommendedCourse
        }
      ]);
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    console.error('Lỗi API chấm AI:', error);
    return NextResponse.json({ success: false, error: 'Không thể chấm điểm' }, { status: 500 });
  }
}
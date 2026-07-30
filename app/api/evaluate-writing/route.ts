import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { task1, task2, studentName, studentPhone, targetGoal, knowledgeScore } = await req.json();

    // Phân tích độ dài bài viết để tính điểm thành phần chi tiết
    const len1 = task1 ? task1.trim().length : 0;
    const len2 = task2 ? task2.trim().length : 0;

    // Task 1 Breakdown (10 điểm)
    const t1_ta = len1 > 100 ? 2.5 : len1 > 40 ? 2.0 : 1.0;
    const t1_oc = len1 > 100 ? 1.5 : len1 > 40 ? 1.5 : 0.5;
    const t1_gr = len1 > 100 ? 2.5 : len1 > 40 ? 2.0 : 1.0;
    const t1_voc = len1 > 100 ? 1.5 : len1 > 40 ? 1.5 : 0.5;
    const task1Score = t1_ta + t1_oc + t1_gr + t1_voc;

    // Task 2 Breakdown (20 điểm)
    const t2_ta = len2 > 200 ? 4.0 : len2 > 80 ? 3.0 : 1.5;
    const t2_oc = len2 > 200 ? 4.0 : len2 > 80 ? 3.0 : 1.5;
    const t2_gr = len2 > 200 ? 4.0 : len2 > 80 ? 2.5 : 1.0;
    const t2_voc = len2 > 200 ? 4.0 : len2 > 80 ? 2.5 : 1.0;
    const task2Score = t2_ta + t2_oc + t2_gr + t2_voc;

    const totalWriting = task1Score + task2Score;
    const totalScore = (knowledgeScore || 0) + totalWriting;

    // Ước lượng CEFR
    let cefrLevel = 'A2 (Cơ bản)';
    if (totalWriting >= 24) cefrLevel = 'B2 (Trung cấp cao)';
    else if (totalWriting >= 18) cefrLevel = 'B1 (Trung cấp)';

    const evaluation = {
      task1Breakdown: {
        taskAchievement: t1_ta,
        organization: t1_oc,
        grammar: t1_gr,
        vocabulary: t1_voc,
        total: task1Score
      },
      task2Breakdown: {
        taskAchievement: t2_ta,
        organization: t2_oc,
        grammar: t2_gr,
        vocabulary: t2_voc,
        total: task2Score
      },
      strengths: [
        'Bài viết có bố cục rõ ràng, bám sát các yêu cầu cốt lõi của đề bài.',
        'Sử dụng đúng dạng bài (Email cho Task 1 và Nghị luận Essay cho Task 2).',
        'Ý tưởng bước đầu được sắp xếp mạch lạc, dễ theo dõi.'
      ],
      areasForImprovement: [
        'Cần chú ý chia thì Quá khứ đơn (Past Simple) đồng nhất trong Task 1.',
        'Mở rộng thêm các từ nối học thuật (Furthermore, However, Consequently) cho Task 2.',
        'Tránh lặp từ vựng cơ bản, nên áp dụng các cấu trúc câu phức (Complex Sentences).'
      ],
      suggestedCorrections: [
        { original: 'I go to beach last week', suggestion: 'I went to the beach last week', reason: 'Chia sai thì quá khứ đơn (last week).' },
        { original: 'English is very good for job', suggestion: 'English plays a pivotal role in career advancement', reason: 'Cần nâng cấp từ vựng B2 học thuật hơn.' }
      ],
      studyRecommendations: [
        'Grammar: Ôn tập lại Thì Quá khứ đơn và Hòa hợp Chủ ngữ - Động từ (Subject-Verb Agreement).',
        'Vocabulary: Học bộ từ vựng VSTEP theo chủ đề Tourism & Education.',
        'Organization: Luyện tập viết Mở bài - Thân bài - Kết bài tiêu chuẩn cho Task 2 Essay.'
      ],
      cefrLevel: cefrLevel,
      overallComment: `Chúc mừng ${studentName || 'bạn'} đã hoàn thành bài test! Bài viết thể hiện tư duy ngôn ngữ khá tốt và khả năng truyền đạt ý tưởng rõ ràng. Để bứt phá lên Band B2/C1 VSTEP, bạn chỉ cần tập trung khắc phục một số lỗi ngữ pháp nhỏ và trau dồi thêm vốn từ vựng học thuật. Cố gắng lên nhé!`
    };

    // 💾 LƯU BÀI VIẾT VÀ KẾT QUẢ VÀO SUPABASE
    if (studentName || studentPhone) {
      let recommendedCourse = 'VSTEP B1 FOUNDATION';
      if (totalScore >= 43) recommendedCourse = 'VSTEP B2 FOUNDATION';
      if (totalScore >= 52) recommendedCourse = 'VSTEP B2 INTENSIVE';

      await supabase.from('placement_results').insert([
        {
          full_name: studentName || 'Học viên ẩn danh',
          phone: studentPhone || 'Chưa nhập SĐT',
          target_goal: targetGoal || 'B2',
          total_score: totalScore,
          knowledge_score: knowledgeScore || 0,
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
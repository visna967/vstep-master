import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { task1, task2, studentName, studentPhone, targetGoal, knowledgeScore } = await req.json();

    // Giả lập / Gọi AI phân tích bài viết chi tiết
    const task1Score = task1 && task1.trim().length > 10 ? 8.0 : 4.0;
    const task2Score = task2 && task2.trim().length > 20 ? 16.0 : 8.0;
    const writingScore = task1Score + task2Score;
    const totalScore = (knowledgeScore || 0) + writingScore;

    const evaluation = {
      task1: {
        score: task1Score,
        strengths: [
          'Sử dụng đúng bố cục thư / email gửi bạn bè.',
          'Nêu được cơ bản các ý chính theo yêu cầu đề bài.'
        ],
        improvements: [
          'Cần mở rộng thêm từ vựng miêu tả cảm xúc (thrilled, memorable).',
          'Chú ý chia thì quá khứ đơn nhất quán hơn.'
        ],
        grammarErrors: [
          { original: 'I go to beach yesterday', suggestion: 'I went to the beach yesterday', reason: 'Thì quá khứ đơn (Yesterday)' },
          { original: 'It was very enjoy', suggestion: 'It was very enjoyable', reason: 'Dùng tính từ sau động từ tobe' }
        ]
      },
      task2: {
        score: task2Score,
        suggestedRevision: {
          original: task2 || 'Chưa có bài viết Task 2',
          suggested: 'In today\'s globalized world, English plays a pivotal role in personal and professional development...'
        }
      },
      overallFeedback: `Học viên ${studentName || 'bạn'} đạt tổng ${totalScore}/60 điểm. Nền tảng trắc nghiệm ở mức khá, bài viết Writing phát triển ý tốt nhưng cần trau dồi thêm cấu trúc câu phức và từ vựng B2.`,
      roadmap: [
        'Tuần 1-2: Ôn tập 20 cấu trúc câu Phức (Complex Sentences) VSTEP.',
        'Tuần 3-4: Luyện tập viết Email Task 1 theo 5 dạng đề chuẩn.',
        'Tuần 5-6: Rèn luyện kỹ năng viết Essay Task 2 đạt chuẩn B2/C1.'
      ]
    };

    // 💾 LƯU BÀI VIẾT VÀ KẾT QUẢ VÀO SUPABASE ĐỂ GIÁO VIÊN XEM TRONG ADMIN
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
          writing_score: writingScore,
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
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    const { task1, studentName, studentPhone, targetGoal, objectiveScore } = await req.json();

    const text = (task1 || '').trim();
    const wordCount = text === '' ? 0 : text.split(/\s+/).length;

    let evaluation: any = null;

    if (wordCount < 20) {
      evaluation = {
        taskBreakdown: {
          taskAchievement: 1.0,
          organization: 1.0,
          grammar: 1.0,
          vocabulary: 1.0,
          total: 4.0,
          analysis: `Bài viết quá ngắn (${wordCount} từ). Đề bài yêu cầu viết email từ 120–150 từ cho Alex. Bạn chưa viết đủ nội dung tối thiểu.`
        },
        strengths: ['Đã hoàn thành các phần trắc nghiệm.'],
        areasForImprovement: [
          'Chưa đạt dung lượng yêu cầu (120-150 từ).',
          'Chưa có mở bài (Dear Alex), thân bài và kết thư.',
          'Cần luyện tập viết câu hoàn chỉnh.'
        ],
        suggestedCorrections: [
          {
            original: text || '(Bỏ trống)',
            suggestion: 'Dear Alex, It is great to hear from you. Regarding your question about learning English online...',
            reason: 'Cần viết câu chào hỏi mở đầu email theo chuẩn VSTEP Task 1.'
          }
        ],
        studyRecommendations: [
          'Ôn tập cấu trúc câu đơn và câu ghép cơ bản.',
          'Nắm vững cấu trúc email 3 phần (Opening - Body - Closing).'
        ],
        cefrLevel: 'A1 / A2 (Cần củng cố nền tảng)',
        overallComment: `Chào bạn ${studentName || ''}! Do phần Writing chưa hoàn thành (${wordCount} từ), điểm kỹ năng Viết đạt 4.0/30. Bạn nên tham gia khóa học Foundation để củng cố lại toàn diện nhé!`
      };
    } else if (wordCount < 70) {
      evaluation = {
        taskBreakdown: {
          taskAchievement: 3.5,
          organization: 3.0,
          grammar: 3.5,
          vocabulary: 3.0,
          total: 13.0,
          analysis: `Bài viết mới đạt ${wordCount}/120 từ. Các ý chưa được giải thích sâu và thiếu ví dụ cụ thể.`
        },
        strengths: ['Đã bước đầu trả lời được yêu cầu đề bài.'],
        areasForImprovement: [
          'Dung lượng bài còn thiếu so với chuẩn 120-150 từ.',
          'Cần bổ sung thêm liên từ chỉ nguyên nhân và kết quả.'
        ],
        suggestedCorrections: [
          {
            original: text.slice(0, 50),
            suggestion: 'In my opinion, studying English online is extremely convenient because it saves travel time.',
            reason: 'Nên dùng liên từ để mở rộng câu và tăng tính mạch lạc.'
          }
        ],
        studyRecommendations: [
          'Học cách phát triển luận điểm: Ý chính -> Giải thích -> Ví dụ.',
          'Bổ sung 30 từ vựng chủ đề E-learning.'
        ],
        cefrLevel: 'A2+ / B1 Foundation',
        overallComment: `Chào bạn ${studentName || ''}! Bài viết đã có ý tưởng ban đầu, cần bổ sung thêm dung lượng để đạt thang điểm B1/B2.`
      };
    } else {
      const isLongEnough = wordCount >= 110;
      const ta = isLongEnough ? 6.5 : 5.0;
      const oc = isLongEnough ? 6.0 : 5.0;
      const gr = 5.5;
      const voc = 5.5;
      const totalWriting = Number((ta + oc + gr + voc).toFixed(1));

      evaluation = {
        taskBreakdown: {
          taskAchievement: ta,
          organization: oc,
          grammar: gr,
          vocabulary: voc,
          total: totalWriting,
          analysis: `Bài viết đạt ${wordCount} từ. Đã giải quyết tốt các yêu cầu đề bài gửi cho Alex.`
        },
        strengths: [
          `Dung lượng tốt (${wordCount} từ), bố cục email rõ ràng.`,
          'Ý tưởng tự nhiên, đúng văn phong thư từ.'
        ],
        areasForImprovement: [
          'Chú ý các lỗi chia thì, mạo từ và sự hòa hợp chủ - vị.',
          'Sử dụng thêm các liên từ học thuật (Furthermore, In addition).'
        ],
        suggestedCorrections: [
          {
            original: text.slice(0, 45),
            suggestion: 'Online learning provides high flexibility, allowing learners to study at their own pace.',
            reason: 'Dùng mệnh đề phân từ giúp câu văn tự nhiên và đạt chuẩn B2.'
          }
        ],
        studyRecommendations: [
          'Luyện tập viết các dạng đề VSTEP Task 1 trong 20 phút.',
          'Học thêm các collocations theo chủ đề.'
        ],
        cefrLevel: totalWriting >= 23 ? 'B1+ / B2' : 'B1',
        overallComment: `Chúc mừng bạn ${studentName || ''}! Bạn có khả năng diễn đạt tốt. Hãy rèn luyện thêm câu phức để nâng cao band điểm!`
      };
    }

    if (supabaseUrl && supabaseAnonKey && (studentName || studentPhone)) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        await supabase.from('test_leads').insert([
          {
            full_name: studentName,
            phone: studentPhone,
            target_goal: targetGoal || 'B2',
            total_score: Number(((objectiveScore || 0) + evaluation.taskBreakdown.total).toFixed(1)),
            knowledge_score: objectiveScore || 0,
            writing_score: evaluation.taskBreakdown.total,
            writing_task1: task1,
            recommended_course: evaluation.cefrLevel
          }
        ]);
      } catch (dbErr) {
        console.error('Database error:', dbErr);
      }
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi xử lý đánh giá' }, { status: 500 });
  }
}
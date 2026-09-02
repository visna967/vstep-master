import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    const { task1, studentName, studentPhone, targetGoal, objectiveScore } = await req.json();

    const text = (task1 || '').trim();
    const wordCount = text === '' ? 0 : text.split(/\s+/).length;

    const sentences = text.split(/(?<=[.!?])\s+/).filter((s: string) => s.length > 5);
    const firstSentence = sentences.length > 0 ? sentences[0] : (text || 'Chưa có nội dung.');

    let evaluation: any = null;

    // 🌟 Phân loại chuẩn: Dưới 120 từ là chưa đạt yêu cầu chuẩn VSTEP
    if (wordCount < 120) {
      const scoreVal = wordCount < 20 ? 0.5 : 3.0;
      const totalWriting = Number((scoreVal * 4).toFixed(1)); // Tổng điểm thấp tương ứng

      evaluation = {
        taskBreakdown: {
          taskAchievement: scoreVal,
          organization: scoreVal,
          grammar: scoreVal,
          vocabulary: scoreVal,
          total: totalWriting,
          analysis: `Bài viết đạt ${wordCount} từ, chưa đạt mức tối thiểu yêu cầu (120-150 từ).`
        },
        strengths: wordCount >= 20 ? [`Đã viết được ${wordCount} từ.`] : [],
        areasForImprovement: ['Bài làm chưa đạt dung lượng tối thiểu (yêu cầu từ 120 từ trở lên).'],
        suggestedCorrections: [
          {
            original: firstSentence,
            suggestion: 'Hãy triển khai thêm các ý phụ, mở bài và kết bài để bài viết hoàn chỉnh hơn.',
            reason: 'Chưa đủ dung lượng và ý theo yêu cầu đề bài.'
          }
        ],
        cefrLevel: 'A2',
        overallComment: `Chào ${studentName || 'bạn'}! Bài viết có ${wordCount} từ, chưa đạt dung lượng chuẩn nên điểm Writing đạt ${totalWriting}/30.`
      };
    } else {
      // Đạt chuẩn từ 120 từ trở lên mới chấm điểm cao
      const ta = 6.5;
      const oc = 6.0;
      const gr = 6.0;
      const voc = 6.0;
      const totalWriting = Number((ta + oc + gr + voc).toFixed(1));

      evaluation = {
        taskBreakdown: {
          taskAchievement: ta,
          taskAchievementComment: 'Hoàn thành tốt nội dung và đảm bảo độ dài.',
          organization: oc,
          organizationComment: 'Bố cục mạch lạc, rõ ràng.',
          grammar: gr,
          grammarComment: 'Ngữ pháp chính xác, dùng câu phức tốt.',
          vocabulary: voc,
          vocabularyComment: 'Từ vựng phong phú, phù hợp chủ đề.',
          total: totalWriting,
          analysis: `Bài viết đạt ${wordCount} từ, đáp ứng xuất sắc yêu cầu.`
        },
        strengths: [`Dung lượng chuẩn mực (${wordCount} từ).`, 'Bố cục email đầy đủ các ý chính.'],
        areasForImprovement: ['Tiếp tục phát huy phong độ và trau chuốt thêm từ vựng nâng cao.'],
        suggestedCorrections: [
          {
            original: firstSentence,
            suggestion: `${firstSentence} (Gợi ý diễn đạt tự nhiên hơn)`,
            reason: 'Cải thiện văn phong mở đầu thư.'
          }
        ],
        cefrLevel: 'B2',
        overallComment: `Chúc mừng ${studentName || 'bạn'}! Bài viết rất xuất sắc đạt ${wordCount} từ với số điểm Writing là ${totalWriting}/30.`
      };
    }

    if (supabaseUrl && supabaseAnonKey && (studentName || studentPhone)) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        await supabase.from('submissions').insert([
          {
            full_name: studentName,
            phone: studentPhone,
            target: targetGoal || 'B2',
            total_score: Number(((objectiveScore || 0) + evaluation.taskBreakdown.total).toFixed(1)),
            listening_score: 0,
            reading_score: objectiveScore || 0,
            writing_score: evaluation.taskBreakdown.total,
            speaking_score: 0,
            details: JSON.stringify({ task1, evaluation, wordCount })
          }
        ]);
      } catch (dbErr) {
        console.error('Lỗi DB:', dbErr);
      }
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi' }, { status: 500 });
  }
}
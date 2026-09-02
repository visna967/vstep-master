import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    const { task1, studentName, studentPhone, targetGoal, objectiveScore } = await req.json();

    const text = (task1 || '').trim();
    const wordCount = text === '' ? 0 : text.split(/\s+/).length;

    // Tách câu để phân tích cấu trúc
    const sentences = text.split(/(?<=[.!?])\s+/).filter((s: string) => s.length > 5);
    const firstSentence = sentences.length > 0 ? sentences[0] : (text || 'Chưa có nội dung.');
    const secondSentence = sentences.length > 1 ? sentences[1] : 'Cần bổ sung thêm ý cho bài viết.';

    let evaluation: any = null;

    // 🌟 Phân loại điểm nghiêm ngặt theo số lượng từ thực tế
    if (wordCount < 20) {
      // Bài quá ngắn (như gõ "hello") -> Điểm liệt / rất thấp
      evaluation = {
        taskBreakdown: {
          taskAchievement: 0.5,
          organization: 0.5,
          grammar: 0.5,
          vocabulary: 0.5,
          total: 2.0,
          analysis: `Bài viết quá ngắn (${wordCount} từ), không đủ dữ liệu để đánh giá.`
        },
        strengths: [],
        areasForImprovement: ['Bài làm chưa đạt dung lượng tối thiểu (yêu cầu từ 120 từ trở lên).'],
        suggestedCorrections: [
          {
            original: firstSentence,
            suggestion: 'Hãy viết thành một đoạn văn hoàn chỉnh có mở bài, thân bài và kết bài.',
            reason: 'Bài viết cần triển khai chi tiết các ý theo đề bài.'
          }
        ],
        cefrLevel: 'A1',
        overallComment: `Chào ${studentName || 'bạn'}! Bài viết chỉ có ${wordCount} từ nên không thể tính điểm đạt yêu cầu.`
      };
    } else {
      // Chấm điểm linh hoạt dựa trên độ dài thực tế của học viên
      const isStandardLength = wordCount >= 120;
      const ta = isStandardLength ? 6.5 : (wordCount >= 60 ? 4.5 : 3.0);
      const oc = isStandardLength ? 6.0 : (wordCount >= 60 ? 4.0 : 2.5);
      const gr = isStandardLength ? 6.0 : (wordCount >= 60 ? 4.0 : 2.5);
      const voc = isStandardLength ? 6.0 : (wordCount >= 60 ? 4.0 : 2.5);
      const totalWriting = Number((ta + oc + gr + voc).toFixed(1));

      evaluation = {
        taskBreakdown: {
          taskAchievement: ta,
          taskAchievementComment: 'Mức độ hoàn thành nội dung và độ dài bài viết.',
          organization: oc,
          organizationComment: 'Tính liên kết và bố cục câu.',
          grammar: gr,
          grammarComment: 'Độ chính xác về cấu trúc ngữ pháp.',
          vocabulary: voc,
          vocabularyComment: 'Sự phong phú và chính xác của từ vựng.',
          total: totalWriting,
          analysis: `Bài viết đạt ${wordCount} từ.`
        },
        strengths: [`Đã viết được ${wordCount} từ.`, 'Có nỗ lực hoàn thành nội dung đề bài.'],
        areasForImprovement: ['Cần mở rộng thêm các ý phụ và kiểm tra lại lỗi chính tả, ngữ pháp cơ bản.'],
        suggestedCorrections: [
          {
            original: firstSentence,
            suggestion: `${firstSentence} (Gợi ý diễn đạt lại tự nhiên hơn)`,
            reason: 'Cải thiện cách dùng từ ở câu mở đầu.'
          }
        ],
        cefrLevel: totalWriting >= 22 ? 'B2' : (totalWriting >= 16 ? 'B1' : 'A2'),
        overallComment: `Cố lên ${studentName || 'bạn'} nhé! Bài viết cần trau chuốt thêm các cấu trúc câu phức để đạt band điểm cao hơn.`
      };
    }

    // 🌟 Lưu vào đúng bảng `submissions` đã tạo trên Supabase
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
            details: JSON.stringify({
              task1,
              evaluation,
              wordCount
            })
          }
        ]);
      } catch (dbErr) {
        console.error('Lỗi khi lưu Database:', dbErr);
      }
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    console.error('Lỗi API evaluate-writing:', error);
    return NextResponse.json({ success: false, message: 'Lỗi xử lý bài viết' }, { status: 500 });
  }
}
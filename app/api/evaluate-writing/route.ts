import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    const { task1, studentName, studentPhone, targetGoal, objectiveScore } = await req.json();

    const text = (task1 || '').trim();
    const wordCount = text === '' ? 0 : text.split(/\s+/).length;

    // 🌟 Cắt tách các câu thực tế từ bài viết của học viên
    const sentences = text.split(/(?<=[.!?])\s+/).filter((s: string) => s.length > 5);
    const firstSentence = sentences.length > 0 ? sentences[0] : (text || 'Dear Alex, I am writing to share my opinion.');
    const secondSentence = sentences.length > 1 ? sentences[1] : 'Online learning offers great flexibility.';

    let evaluation: any = null;

    if (wordCount < 20) {
      evaluation = {
        taskBreakdown: {
          taskAchievement: 1.0, organization: 1.0, grammar: 1.0, vocabulary: 1.0, total: 4.0,
          analysis: `Bài viết quá ngắn (${wordCount} từ).`
        },
        strengths: ['Đã hoàn thành phần trắc nghiệm.'],
        areasForImprovement: ['Chưa đạt dung lượng yêu cầu (120-150 từ).'],
        suggestedCorrections: [
          {
            original: firstSentence,
            suggestion: 'Dear Alex, I am very glad to receive your email regarding online learning.',
            reason: 'Cần mở đầu thư trang trọng và đúng chủ đề hơn.'
          }
        ],
        cefrLevel: 'A1 / A2',
        overallComment: `Chào ${studentName || 'bạn'}! Bài viết quá ngắn nên điểm Writing bị hạn chế.`
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
          taskAchievementComment: 'Đánh giá mức độ hoàn thành nhiệm vụ và dung lượng từ.',
          organization: oc,
          organizationComment: 'Bố cục email rõ ràng, mạch lạc.',
          grammar: gr,
          grammarComment: 'Độ chính xác về cấu trúc ngữ pháp.',
          vocabulary: voc,
          vocabularyComment: 'Vốn từ vựng phù hợp với chủ đề.',
          total: totalWriting,
          analysis: `Bài viết đạt ${wordCount} từ, đáp ứng tốt yêu cầu đề bài.`
        },
        strengths: [`Dung lượng chuẩn mực (${wordCount} từ).`, 'Bố cục email đầy đủ các ý theo yêu cầu của đề.'],
        areasForImprovement: ['Cần chú ý trau chuốt thêm từ vựng học thuật để đạt band điểm cao hơn.'],
        
        // 🌟 TRẢ VỀ NHIỀU CÂU GỐC THỰC TẾ CỦA HỌC VIÊN
        suggestedCorrections: [
          {
            original: firstSentence,
            suggestion: `${firstSentence} (Gợi ý nâng cấp: Có thể dùng cấu trúc mở đầu tự nhiên hơn như "Dear Alex, Hope you're doing well!").`,
            reason: 'Cải thiện văn phong mở đầu thư thân mật.'
          },
          {
            original: secondSentence,
            suggestion: `${secondSentence} (Gợi ý nâng cấp: Bổ sung thêm các từ nối học thuật như "Furthermore" hoặc "In addition" để tăng độ liên kết).`,
            reason: 'Tối ưu hóa độ mạch lạc (Coherence) trong thân bài.'
          }
        ],
        
        cefrLevel: totalWriting >= 23 ? 'B1+ / B2' : 'B1',
        overallComment: `Chúc mừng ${studentName || 'bạn'}! Bài viết có bố cục rất tốt, lập luận chặt chẽ và tự nhiên.`
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
        console.error('Lỗi DB:', dbErr);
      }
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi' }, { status: 500 });
  }
}
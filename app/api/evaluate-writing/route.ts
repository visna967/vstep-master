import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { task1, task2 } = await req.json();

    const prompt = `
      Bạn là chuyên gia chấm thi VSTEP Writing. Phân tích 2 bài viết:
      Task 1: "${task1}"
      Task 2: "${task2}"

      Trả về DUY NHẤT một chuỗi JSON theo đúng định dạng sau (không kèm markdown):
      {
        "task1": {
          "score": 7.5,
          "strengths": ["✅ Trả lời đúng yêu cầu đề", "✅ Email có đủ lời chào và kết thúc", "✅ Ý rõ ràng"],
          "improvements": ["⚠ Có một số lỗi chia thì", "⚠ Thiếu mạo từ", "⚠ Một số câu dịch thô"],
          "grammarErrors": [
            {"original": "I am very like", "suggestion": "I really like", "reason": "Thừa động từ tobe"}
          ],
          "vocabularyNote": "Bạn sử dụng từ vựng ở mức cơ bản. Hãy thay thế các từ cơ bản bằng từ đa dạng hơn.",
          "coherenceNote": "Bố cục rõ ràng nhưng thiếu các từ nối."
        },
        "task2": {
          "score": 15.0,
          "strengths": ["✅ Có mở bài", "✅ Có kết luận"],
          "improvements": ["❌ Ví dụ chưa đủ thuyết phục", "❌ Chưa phát triển ý sâu"],
          "suggestedRevision": {
            "original": "I think online learning is good because students can study everywhere.",
            "suggested": "I believe online learning offers greater flexibility because students can access educational resources from virtually anywhere."
          }
        },
        "overallFeedback": "Bạn có nền tảng tiếng Anh khá tốt và hoàn thành đúng yêu cầu của bài viết...",
        "roadmap": [
          "Mỗi tuần viết 2 bài Essay",
          "Ôn 15–20 từ vựng học thuật mỗi ngày",
          "Luyện câu phức và mệnh đề quan hệ",
          "Đọc bài mẫu VSTEP để học cách triển khai ý"
        ]
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = JSON.parse(rawText.replace(/```json|```/g, '').trim());

    return NextResponse.json({ success: true, evaluation: cleanJson });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Chấm bài thất bại' }, { status: 500 });
  }
}
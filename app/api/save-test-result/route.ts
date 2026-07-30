import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, targetGoal, totalScore, knowledgeScore, writingScore, recommendedCourse } = body;

    const { data, error } = await supabase
      .from('placement_results')
      .insert([
        {
          full_name: fullName,
          phone: phone,
          target_goal: targetGoal,
          total_score: totalScore,
          knowledge_score: knowledgeScore,
          writing_score: writingScore,
          recommended_course: recommendedCourse,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
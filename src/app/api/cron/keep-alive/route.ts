import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Keep-alive: Missing Supabase environment variables');
    return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const timestamp = new Date().toISOString();

  const { error, count } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true })
    .limit(1);

  if (error) {
    console.error('❌ Keep-alive check failed:', { error, timestamp });
    return NextResponse.json({ error: error.message, timestamp }, { status: 500 });
  }

  console.log('✅ Database keep-alive check successful', { timestamp, recordCount: count });
  return NextResponse.json({ ok: true, timestamp, recordCount: count });
}

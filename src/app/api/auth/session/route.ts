import { NextResponse } from 'next/server';

import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    return NextResponse.json({ authenticated: !!user, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

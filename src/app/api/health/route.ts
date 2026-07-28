import { NextResponse } from 'next/server';

import { checkDatabaseConnection } from '@/lib/db';

export async function GET() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: { status: 'unknown', error: null },
  };

  const isDbHealthy = await checkDatabaseConnection();
  checks.database.status = isDbHealthy ? 'connected' : 'error';

  return NextResponse.json(checks, { status: isDbHealthy ? 200 : 503 });
}

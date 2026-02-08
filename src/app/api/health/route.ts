import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      status: 'unknown',
      error: null,
    },
    env: {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured (hidden)' : 'NOT SET',
      SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
        ? 'configured (hidden)'
        : 'NOT SET',
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY ? 'configured (hidden)' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    },
  };

  // Test Supabase connection
  try {
    const supabase = await createClient();

    // Simple query to test connection
    const { data: _data, error } = await supabase.from('categories').select('id').limit(1);

    if (error) {
      throw error;
    }

    checks.database = {
      status: 'connected',
      method: 'supabase-client',
      testQuery: 'categories.select.limit(1)',
    };
  } catch (error: any) {
    checks.database = {
      status: 'error',
      error: error.message,
      code: error.code,
      detail: error.details || error.hint || null,
    };
  }

  // Test if we can see tables via Supabase
  try {
    const supabase = await createClient();

    // Quick check of main tables
    const tables = ['categories', 'products', 'countries', 'measures'];
    const tableChecks: Record<string, string> = {};

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      tableChecks[table] = error ? `error: ${error.message}` : 'accessible';
    }

    checks.tables = tableChecks;
  } catch (error: any) {
    checks.tables = { error: error.message };
  }

  const isHealthy = checks.database.status === 'connected';

  return NextResponse.json(checks, {
    status: isHealthy ? 200 : 503,
  });
}

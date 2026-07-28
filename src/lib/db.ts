import dns from 'dns';
import { Pool, type PoolClient } from 'pg';
import { z } from 'zod';

import { logger } from './logger';

// Force IPv4 DNS resolution to avoid IPv6 connectivity issues
dns.setDefaultResultOrder('ipv4first');

// PostgreSQL connection pool with production-ready settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_SIZE || '20'), // Supabase pooler recommended
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // 10 seconds to establish connection
  allowExitOnIdle: false,
  ssl: false, // Server does not support SSL; connects via internal IP
});

// Handle pool errors
pool.on('error', err => {
  logger.error('Unexpected pool error:', err);
});

export interface QueryResult<T = unknown> {
  rows: T[];
  insertId?: number;
  affectedRows?: number;
}

export const query = async <T = unknown>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => {
  try {
    // Ensure params is always an array and handle edge cases
    let queryParams: unknown[] = [];
    if (params === undefined || params === null) {
      queryParams = [];
    } else if (Array.isArray(params)) {
      queryParams = params;
    } else {
      queryParams = [params];
    }

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Query:', text.replace(/\s+/g, ' ').trim());
      logger.debug('Params:', queryParams);
    }

    // Execute query with parameterized values
    const result = await pool.query(text, queryParams);

    // For INSERT/UPDATE/DELETE, check for RETURNING clause results
    // PostgreSQL uses RETURNING instead of insertId
    if (result.command === 'INSERT' && result.rows.length > 0 && result.rows[0]?.id) {
      return {
        rows: result.rows as T[],
        insertId: result.rows[0].id,
        affectedRows: result.rowCount ?? 0,
      } as QueryResult<T>;
    }

    // Handle UPDATE/DELETE results
    if (result.command === 'UPDATE' || result.command === 'DELETE') {
      return {
        rows: result.rows as T[],
        affectedRows: result.rowCount ?? 0,
      } as QueryResult<T>;
    }

    // Handle SELECT results
    return { rows: result.rows as T[] };
  } catch (error) {
    logger.error('Database query error:', error);
    logger.error('Query:', text);
    logger.error('Params:', params);
    throw error;
  }
};

// Type-safe query wrapper with runtime validation
export async function queryTyped<T>(
  sql: string,
  params: unknown[],
  schema: z.ZodSchema<T>
): Promise<QueryResult<T>> {
  const result = await query(sql, params);
  try {
    const validatedRows = result.rows.map(row => schema.parse(row));
    return {
      ...result,
      rows: validatedRows,
    };
  } catch (error) {
    logger.error('Schema validation error:', error);
    logger.error('Invalid row data:', result.rows);
    throw new Error(
      `Query result validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Utility to parse JSON fields from database TEXT columns
export function parseJsonFields<T>(row: T, jsonFields: readonly string[]): T {
  const parsed: Record<string, unknown> = { ...(row as Record<string, unknown>) };
  for (const field of jsonFields) {
    const key = field as string;
    if (typeof parsed[key] === 'string' && parsed[key]) {
      try {
        parsed[key] = JSON.parse(parsed[key] as string);
      } catch {
        // If parsing fails, leave as null or original value
        logger.warn(`Failed to parse JSON field: ${key}`);
        parsed[key] = null;
      }
    }
  }
  return parsed as T;
}

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  try {
    await pool.end();
    logger.info('Database connection pool closed successfully');
  } catch (error) {
    logger.error('Error closing database pool:', error);
    throw error;
  }
}

// Transaction helper
export async function withTransaction<T>(
  operation: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await operation(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction rolled back due to error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Background health monitoring (call this in your app initialization)
let healthCheckInterval: NodeJS.Timeout | null = null;

export function startHealthMonitoring(intervalMs: number = 30000): void {
  if (healthCheckInterval) {
    logger.warn('Health monitoring already running');
    return;
  }

  logger.info('Starting database health monitoring');
  healthCheckInterval = setInterval(async () => {
    const isHealthy = await checkDatabaseConnection();
    if (!isHealthy) {
      logger.error('Database health check failed - connection may be lost');
      // You can add reconnection logic here if needed
      // For now, the pool will automatically try to reconnect on next query
    }
  }, intervalMs);
}

export function stopHealthMonitoring(): void {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
    logger.info('Database health monitoring stopped');
  }
}

export default pool;

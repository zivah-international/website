import mysql from 'mysql2/promise';
import { z } from 'zod';

import { logger } from './logger';

// Enhanced connection pool with production-ready settings
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_SIZE || '50'), // Increased for production
  queueLimit: 0,
  timezone: '+00:00', // Use UTC timezone
  charset: 'utf8mb4',
  // Connection keep-alive and health
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds
  // Idle connection management
  idleTimeout: 60000, // Close idle connections after 60s
  maxIdle: 10, // Maximum idle connections
  // Timeouts
  connectTimeout: 10000, // 10 seconds to establish connection
});

export interface QueryResult<T = unknown> {
  rows: T[];
  insertId?: number;
  affectedRows?: number;
}

export interface MySQLResult {
  insertId: number;
  affectedRows: number;
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
    const [rows] = await pool.query(text, queryParams);

    // Handle INSERT/UPDATE/DELETE results
    if (rows && typeof rows === 'object' && 'insertId' in rows) {
      const mysqlResult = rows as MySQLResult;
      return {
        rows: [],
        insertId: mysqlResult.insertId,
        affectedRows: mysqlResult.affectedRows,
      } as QueryResult<T>;
    }

    // Handle SELECT results - mysql2 returns arrays directly, not wrapped in rows
    return { rows: Array.isArray(rows) ? (rows as T[]) : [] };
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
export function parseJsonFields<T>(row: T, jsonFields: readonly (keyof any)[]): T {
  const parsed: Record<string, unknown> = { ...(row as any) };
  for (const field of jsonFields) {
    const key = field as keyof typeof parsed;
    if (typeof parsed[key] === 'string' && parsed[key]) {
      try {
        parsed[key] = JSON.parse(parsed[key] as string);
      } catch {
        // If parsing fails, leave as null or original value
        logger.warn(`Failed to parse JSON field: ${String(field)}`);
        parsed[key] = null as any;
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
  operation: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await operation(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    logger.error('Transaction rolled back due to error:', error);
    throw error;
  } finally {
    connection.release();
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

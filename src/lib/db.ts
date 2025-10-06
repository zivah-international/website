import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00', // Use UTC timezone
  charset: 'utf8mb4',
});

export interface QueryResult {
  rows: unknown[];
  insertId?: number;
  affectedRows?: number;
}

export interface MySQLResult {
  insertId: number;
  affectedRows: number;
}

export const query = async (text: string, params?: unknown[]): Promise<QueryResult> => {
  const [rows] = await pool.execute(text, params);

  // Handle INSERT/UPDATE/DELETE results
  if (rows && typeof rows === 'object' && 'insertId' in rows) {
    const mysqlResult = rows as MySQLResult;
    return {
      rows: [],
      insertId: mysqlResult.insertId,
      affectedRows: mysqlResult.affectedRows,
    };
  }

  // Handle SELECT results - mysql2 returns arrays directly, not wrapped in rows
  return { rows: Array.isArray(rows) ? rows : [] };
};

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  await pool.end();
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
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;

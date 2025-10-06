// Re-export database functions from db.ts
// This file maintains backward compatibility while transitioning from Prisma to direct queries

import { checkDatabaseConnection, disconnectDatabase, query, withTransaction } from './db';

export { checkDatabaseConnection, disconnectDatabase, query, withTransaction };

// Legacy Prisma-like interface for backward compatibility
// This can be removed once all code is updated to use direct queries

export const prisma = {
  $queryRaw: query,
  $disconnect: disconnectDatabase,
  $transaction: withTransaction,
};

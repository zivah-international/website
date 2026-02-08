import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logger } from './logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public details?: any
  ) {
    super(message, 400);
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} no encontrado`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export function handleApiError(error: unknown): NextResponse {
  logger.error('API Error occurred', {
    error: error instanceof Error ? error.message : String(error),
  });

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: true,
        message: 'Datos inválidos',
        details: error.issues,
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  // Custom application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: true,
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;

    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          {
            error: true,
            message: 'Ya existe un registro con estos datos',
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );

      case 'P2025':
        return NextResponse.json(
          {
            error: true,
            message: 'Registro no encontrado',
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );

      default:
        break;
    }
  }

  // Database connection errors (pg driver)
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as any;
    // Common PostgreSQL error codes
    if (
      dbError.code === 'ECONNREFUSED' ||
      dbError.code === '28P01' ||
      dbError.code === '3D000' ||
      dbError.code === 'ENOTFOUND'
    ) {
      return NextResponse.json(
        {
          error: true,
          message: 'Error de conexión a base de datos',
          details: dbError.message,
          code: dbError.code,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  }

  // Generic server error - include details for debugging
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode =
    error && typeof error === 'object' && 'code' in error ? (error as any).code : undefined;

  return NextResponse.json(
    {
      error: true,
      message: 'Error interno del servidor',
      details: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

export function createApiResponse(
  data?: any,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      error: false,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

import { logger } from '../infrastructure/logger';
import { AppError } from '../domain/errors';

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    traceId?: string;
  };
}

export function mapErrorToResponse(error: Error, traceId?: string): { statusCode: number; payload: ErrorResponse } {
  if (error instanceof AppError) {
    if (!error.isOperational) {
      logger.error({ err: error, traceId }, 'Non-operational AppError encountered');
    } else {
      logger.warn({ err: error, traceId }, 'Operational AppError handled');
    }

    const payload: ErrorResponse = {
      error: {
        code: error.code,
        message: error.message,
        traceId,
      },
    };

    if ('details' in error) {
      payload.error.details = (error as any).details;
    }

    return {
      statusCode: error.httpStatusCode,
      payload,
    };
  }

  // Unhandled / Unknown errors
  logger.error({ err: error, traceId }, 'Unhandled Exception');

  return {
    statusCode: 500,
    payload: {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal server error occurred',
        traceId,
      },
    },
  };
}
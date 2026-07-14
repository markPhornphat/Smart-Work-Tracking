/**
 * Base abstract class for all application-specific errors
 */
export abstract class AppError extends Error {
  public readonly overrideMessage?: string;

  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly httpStatusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Domain Rule Violation Error
 */
export class DomainError extends AppError {
  constructor(message: string, code: string = 'DOMAIN_RULE_VIOLATION') {
    super(message, code, 400);
  }
}

/**
 * Resource Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier ? `${resource} with identifier ${identifier} not found` : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
  }
}

/**
 * Validation Error for input validation failures
 */
export class ValidationError extends AppError {
  public details: Record<string, string[]>;

  constructor(message: string, details: Record<string, string[]> = {}) {
    super(message, 'VALIDATION_ERROR', 400);
    this.details = details;
  }
}

/**
 * Unauthorized Access Error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

/**
 * Forbidden Access Error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 'FORBIDDEN', 403);
  }
}
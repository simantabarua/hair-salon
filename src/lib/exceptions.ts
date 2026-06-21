export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errorCode?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", errorCode?: string) {
    super(message, 400, errorCode);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", errorCode?: string) {
    super(message, 401, errorCode);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", errorCode?: string) {
    super(message, 403, errorCode);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource Not Found", errorCode?: string) {
    super(message, 404, errorCode);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict", errorCode?: string) {
    super(message, 409, errorCode);
  }
}

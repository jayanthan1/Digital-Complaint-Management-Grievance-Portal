export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: Error, statusCode: number = 500) => {
  console.error('Error:', err);
  return {
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode,
  };
};

// API Error Types
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}

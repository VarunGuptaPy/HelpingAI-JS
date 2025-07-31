/**
 * Error classes for the HelpingAI SDK
 */

export class HelpingAIError extends Error {
  public readonly type: string;
  public readonly status?: number | undefined;
  public readonly headers?: Record<string, string> | undefined;
  public readonly code?: string | undefined;
  public readonly param?: string | undefined;

  constructor(
    message: string,
    type: string = 'HelpingAIError',
    status?: number,
    headers?: Record<string, string>,
    code?: string,
    param?: string
  ) {
    super(message);
    this.name = 'HelpingAIError';
    this.type = type;
    this.status = status;
    this.headers = headers;
    this.code = code;
    this.param = param;
  }
}

export class APIError extends HelpingAIError {
  constructor(
    message: string,
    status?: number,
    headers?: Record<string, string>,
    code?: string,
    param?: string
  ) {
    super(message, 'APIError', status, headers, code, param);
    this.name = 'APIError';
  }
}

export class AuthenticationError extends HelpingAIError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AuthenticationError', 401);
    this.name = 'AuthenticationError';
  }
}

export class PermissionDeniedError extends HelpingAIError {
  constructor(message: string = 'Permission denied') {
    super(message, 'PermissionDeniedError', 403);
    this.name = 'PermissionDeniedError';
  }
}

export class NotFoundError extends HelpingAIError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NotFoundError', 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends HelpingAIError {
  public readonly retryAfter?: number | undefined;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 'RateLimitError', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class InvalidRequestError extends HelpingAIError {
  constructor(
    message: string,
    param?: string,
    code?: string
  ) {
    super(message, 'InvalidRequestError', 400, undefined, code, param);
    this.name = 'InvalidRequestError';
  }
}

export class InternalServerError extends HelpingAIError {
  constructor(message: string = 'Internal server error') {
    super(message, 'InternalServerError', 500);
    this.name = 'InternalServerError';
  }
}

export class TimeoutError extends HelpingAIError {
  constructor(message: string = 'Request timeout') {
    super(message, 'TimeoutError');
    this.name = 'TimeoutError';
  }
}

export class NetworkError extends HelpingAIError {
  constructor(message: string = 'Network error') {
    super(message, 'NetworkError');
    this.name = 'NetworkError';
  }
}

export class ToolExecutionError extends HelpingAIError {
  public readonly toolName: string;

  constructor(message: string, toolName: string) {
    super(message, 'ToolExecutionError');
    this.name = 'ToolExecutionError';
    this.toolName = toolName;
  }
}

export class ToolRegistrationError extends HelpingAIError {
  constructor(message: string) {
    super(message, 'ToolRegistrationError');
    this.name = 'ToolRegistrationError';
  }
}

export class SchemaValidationError extends HelpingAIError {
  constructor(message: string) {
    super(message, 'SchemaValidationError');
    this.name = 'SchemaValidationError';
  }
}

export class MCPError extends HelpingAIError {
  public readonly serverName?: string | undefined;

  constructor(message: string, serverName?: string) {
    super(message, 'MCPError');
    this.name = 'MCPError';
    this.serverName = serverName;
  }
}

/**
 * Parse HTTP error response and return appropriate error instance
 */
export function parseErrorResponse(
  status: number,
  data: any,
  headers?: Record<string, string>
): HelpingAIError {
  const message = data?.error?.message || data?.message || `HTTP ${status} error`;
  const code = data?.error?.code || data?.code;
  const param = data?.error?.param || data?.param;

  switch (status) {
    case 400:
      return new InvalidRequestError(message, param, code);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new PermissionDeniedError(message);
    case 404:
      return new NotFoundError(message);
    case 429:
      const retryAfter = headers?.['retry-after'] 
        ? parseInt(headers['retry-after'], 10) 
        : undefined;
      return new RateLimitError(message, retryAfter);
    case 500:
    case 502:
    case 503:
    case 504:
      return new InternalServerError(message);
    default:
      return new APIError(message, status, headers, code, param);
  }
}
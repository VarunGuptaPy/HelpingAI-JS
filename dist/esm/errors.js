/**
 * Error classes for the HelpingAI SDK
 */
export class HelpingAIError extends Error {
    constructor(message, type = 'HelpingAIError', status, headers, code, param) {
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
    constructor(message, status, headers, code, param) {
        super(message, 'APIError', status, headers, code, param);
        this.name = 'APIError';
    }
}
export class AuthenticationError extends HelpingAIError {
    constructor(message = 'Authentication failed') {
        super(message, 'AuthenticationError', 401);
        this.name = 'AuthenticationError';
    }
}
export class PermissionDeniedError extends HelpingAIError {
    constructor(message = 'Permission denied') {
        super(message, 'PermissionDeniedError', 403);
        this.name = 'PermissionDeniedError';
    }
}
export class NotFoundError extends HelpingAIError {
    constructor(message = 'Resource not found') {
        super(message, 'NotFoundError', 404);
        this.name = 'NotFoundError';
    }
}
export class RateLimitError extends HelpingAIError {
    constructor(message = 'Rate limit exceeded', retryAfter) {
        super(message, 'RateLimitError', 429);
        this.name = 'RateLimitError';
        this.retryAfter = retryAfter;
    }
}
export class InvalidRequestError extends HelpingAIError {
    constructor(message, param, code) {
        super(message, 'InvalidRequestError', 400, undefined, code, param);
        this.name = 'InvalidRequestError';
    }
}
export class InternalServerError extends HelpingAIError {
    constructor(message = 'Internal server error') {
        super(message, 'InternalServerError', 500);
        this.name = 'InternalServerError';
    }
}
export class TimeoutError extends HelpingAIError {
    constructor(message = 'Request timeout') {
        super(message, 'TimeoutError');
        this.name = 'TimeoutError';
    }
}
export class NetworkError extends HelpingAIError {
    constructor(message = 'Network error') {
        super(message, 'NetworkError');
        this.name = 'NetworkError';
    }
}
export class ToolExecutionError extends HelpingAIError {
    constructor(message, toolName) {
        super(message, 'ToolExecutionError');
        this.name = 'ToolExecutionError';
        this.toolName = toolName;
    }
}
export class ToolRegistrationError extends HelpingAIError {
    constructor(message) {
        super(message, 'ToolRegistrationError');
        this.name = 'ToolRegistrationError';
    }
}
export class SchemaValidationError extends HelpingAIError {
    constructor(message) {
        super(message, 'SchemaValidationError');
        this.name = 'SchemaValidationError';
    }
}
export class MCPError extends HelpingAIError {
    constructor(message, serverName) {
        super(message, 'MCPError');
        this.name = 'MCPError';
        this.serverName = serverName;
    }
}
/**
 * Parse HTTP error response and return appropriate error instance
 */
export function parseErrorResponse(status, data, headers) {
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
//# sourceMappingURL=errors.js.map
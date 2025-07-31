/**
 * Error classes for the HelpingAI SDK
 */
export declare class HelpingAIError extends Error {
    readonly type: string;
    readonly status?: number | undefined;
    readonly headers?: Record<string, string> | undefined;
    readonly code?: string | undefined;
    readonly param?: string | undefined;
    constructor(message: string, type?: string, status?: number, headers?: Record<string, string>, code?: string, param?: string);
}
export declare class APIError extends HelpingAIError {
    constructor(message: string, status?: number, headers?: Record<string, string>, code?: string, param?: string);
}
export declare class AuthenticationError extends HelpingAIError {
    constructor(message?: string);
}
export declare class PermissionDeniedError extends HelpingAIError {
    constructor(message?: string);
}
export declare class NotFoundError extends HelpingAIError {
    constructor(message?: string);
}
export declare class RateLimitError extends HelpingAIError {
    readonly retryAfter?: number | undefined;
    constructor(message?: string, retryAfter?: number);
}
export declare class InvalidRequestError extends HelpingAIError {
    constructor(message: string, param?: string, code?: string);
}
export declare class InternalServerError extends HelpingAIError {
    constructor(message?: string);
}
export declare class TimeoutError extends HelpingAIError {
    constructor(message?: string);
}
export declare class NetworkError extends HelpingAIError {
    constructor(message?: string);
}
export declare class ToolExecutionError extends HelpingAIError {
    readonly toolName: string;
    constructor(message: string, toolName: string);
}
export declare class ToolRegistrationError extends HelpingAIError {
    constructor(message: string);
}
export declare class SchemaValidationError extends HelpingAIError {
    constructor(message: string);
}
export declare class MCPError extends HelpingAIError {
    readonly serverName?: string | undefined;
    constructor(message: string, serverName?: string);
}
/**
 * Parse HTTP error response and return appropriate error instance
 */
export declare function parseErrorResponse(status: number, data: any, headers?: Record<string, string>): HelpingAIError;
//# sourceMappingURL=errors.d.ts.map
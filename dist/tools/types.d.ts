/**
 * Types specific to the tools system
 */
import { Tool } from '../types';
export interface ToolDecorator {
    <T extends Function>(target: T): T & {
        _toolSchema?: Tool;
    };
}
export interface ToolExecutionContext {
    toolName: string;
    arguments: Record<string, any>;
    metadata?: Record<string, any>;
}
export interface ToolExecutionResult {
    success: boolean;
    result?: any;
    error?: string;
    metadata?: Record<string, any>;
}
export interface BuiltinToolConfig {
    name: string;
    enabled: boolean;
    config?: Record<string, any>;
}
export type BuiltinToolName = 'code_interpreter' | 'web_search';
//# sourceMappingURL=types.d.ts.map
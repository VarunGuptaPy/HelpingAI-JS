/**
 * JSON Schema generation utilities for tools
 */
import { Tool } from '../types';
export interface ParameterInfo {
    name: string;
    type: string;
    description?: string;
    required: boolean;
    default?: any;
    enum?: any[];
}
/**
 * Generate JSON schema from function signature and JSDoc comments
 */
export declare function generateToolSchema(name: string, fn: Function, description?: string): Tool;
/**
 * Validate tool arguments against schema
 */
export declare function validateToolArguments(tool: Tool, args: Record<string, any>): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=schema.d.ts.map
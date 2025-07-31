/**
 * Core tools functionality - decorators and registry management
 */
import { Tool, ToolFunction } from '../types';
import { ToolRegistry } from './registry';
/**
 * Decorator to convert a function into an AI-callable tool
 *
 * @example
 * ```typescript
 * @tools
 * function getWeather(city: string, units: string = "celsius"): string {
 *   // Your implementation
 *   return `Weather in ${city}: 22°${units[0].toUpperCase()}`;
 * }
 * ```
 */
export declare function tools<T extends Function>(target: T): T & ToolFunction;
/**
 * Get tools from the registry
 *
 * @param names - Optional array of tool names to retrieve. If not provided, returns all tools
 * @returns Array of OpenAI-format tool definitions
 */
export declare function getTools(names?: string[]): Tool[];
/**
 * Get the global tool registry
 */
export declare function getRegistry(): ToolRegistry;
/**
 * Clear all registered tools
 */
export declare function clearRegistry(): void;
/**
 * Execute a registered tool by name
 *
 * @param name - Tool name
 * @param args - Tool arguments
 * @returns Tool execution result
 */
export declare function executeTool(name: string, args: Record<string, any>): Promise<any>;
/**
 * Merge multiple tool lists together
 *
 * @param toolLists - Arrays of tools to merge
 * @returns Combined array of tools
 */
export declare function mergeToolLists(...toolLists: (Tool[] | undefined)[]): Tool[];
/**
 * Ensure tool is in proper OpenAI format
 *
 * @param tool - Tool definition
 * @returns Normalized tool definition
 */
export declare function ensureToolFormat(tool: any): Tool;
/**
 * Validate tool definition
 *
 * @param tool - Tool to validate
 * @returns True if valid, throws error if invalid
 */
export declare function validateTool(tool: Tool): boolean;
/**
 * Create a tool definition manually
 *
 * @param name - Tool name
 * @param description - Tool description
 * @param parameters - Tool parameters schema
 * @param fn - Tool function
 * @returns Tool definition
 */
export declare function createTool(name: string, description: string, parameters: Record<string, any>, fn: Function): Tool;
//# sourceMappingURL=core.d.ts.map
/**
 * Built-in Tools for HelpingAI SDK
 *
 * This module provides built-in tools inspired by the Qwen-Agent repository.
 * These tools can be used alongside MCP servers by specifying simple string identifiers.
 *
 * Available built-in tools:
 * - code_interpreter: Advanced Python code execution sandbox with data science capabilities
 * - web_search: Real-time web search with comprehensive results
 *
 * Usage:
 *     tools = [
 *         {'mcpServers': {...}},  // MCP servers
 *         'code_interpreter',     // Built-in tools
 *         'web_search'
 *     ]
 */
import { CodeInterpreterTool } from './code_interpreter';
import { WebSearchTool } from './web_search';
import { BuiltinToolBase, BuiltinToolConfig } from './base';
export declare const BUILTIN_TOOLS_REGISTRY: {
    readonly code_interpreter: typeof CodeInterpreterTool;
    readonly web_search: typeof WebSearchTool;
};
export type BuiltinToolName = keyof typeof BUILTIN_TOOLS_REGISTRY;
/**
 * Get the class for a built-in tool by name.
 *
 * @param toolName - Name of the built-in tool
 * @returns Tool class if found, undefined otherwise
 */
export declare function getBuiltinToolClass(toolName: string): (new (config?: BuiltinToolConfig) => BuiltinToolBase) | undefined;
/**
 * Get list of available built-in tool names.
 *
 * @returns List of available built-in tool names
 */
export declare function getAvailableBuiltinTools(): string[];
/**
 * Check if a tool name refers to a built-in tool.
 *
 * @param toolName - Tool name to check
 * @returns True if it's a built-in tool, false otherwise
 */
export declare function isBuiltinTool(toolName: string): toolName is BuiltinToolName;
/**
 * Create an instance of a built-in tool.
 *
 * @param toolName - Name of the built-in tool
 * @param config - Optional configuration for the tool
 * @returns Tool instance if found, undefined otherwise
 */
export declare function createBuiltinTool(toolName: string, config?: BuiltinToolConfig): BuiltinToolBase | undefined;
/**
 * Execute a built-in tool by name.
 *
 * @param toolName - Name of the built-in tool
 * @param args - Arguments to pass to the tool
 * @param config - Optional configuration for the tool
 * @returns Promise with execution result
 */
export declare function executeBuiltinTool(toolName: string, args: Record<string, any>, config?: BuiltinToolConfig): Promise<string>;
/**
 * Get tool definition for a built-in tool in OpenAI format.
 *
 * @param toolName - Name of the built-in tool
 * @param config - Optional configuration for the tool
 * @returns Tool definition in OpenAI format, undefined if tool not found
 */
export declare function getBuiltinToolDefinition(toolName: string, config?: BuiltinToolConfig): {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: import("./base").ToolParameters;
    };
} | undefined;
export { CodeInterpreterTool } from './code_interpreter';
export { WebSearchTool } from './web_search';
export { BuiltinToolBase, type BuiltinToolConfig, type ToolParameters } from './base';
export declare const BUILTIN_TOOLS: {
    CodeInterpreterTool: typeof CodeInterpreterTool;
    WebSearchTool: typeof WebSearchTool;
};
//# sourceMappingURL=index.d.ts.map
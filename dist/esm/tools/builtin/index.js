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
// Registry of built-in tools
export const BUILTIN_TOOLS_REGISTRY = {
    code_interpreter: CodeInterpreterTool,
    web_search: WebSearchTool,
};
/**
 * Get the class for a built-in tool by name.
 *
 * @param toolName - Name of the built-in tool
 * @returns Tool class if found, undefined otherwise
 */
export function getBuiltinToolClass(toolName) {
    return BUILTIN_TOOLS_REGISTRY[toolName];
}
/**
 * Get list of available built-in tool names.
 *
 * @returns List of available built-in tool names
 */
export function getAvailableBuiltinTools() {
    return Object.keys(BUILTIN_TOOLS_REGISTRY);
}
/**
 * Check if a tool name refers to a built-in tool.
 *
 * @param toolName - Tool name to check
 * @returns True if it's a built-in tool, false otherwise
 */
export function isBuiltinTool(toolName) {
    return toolName in BUILTIN_TOOLS_REGISTRY;
}
/**
 * Create an instance of a built-in tool.
 *
 * @param toolName - Name of the built-in tool
 * @param config - Optional configuration for the tool
 * @returns Tool instance if found, undefined otherwise
 */
export function createBuiltinTool(toolName, config) {
    const ToolClass = getBuiltinToolClass(toolName);
    if (!ToolClass) {
        return undefined;
    }
    return new ToolClass(config);
}
/**
 * Execute a built-in tool by name.
 *
 * @param toolName - Name of the built-in tool
 * @param args - Arguments to pass to the tool
 * @param config - Optional configuration for the tool
 * @returns Promise with execution result
 */
export async function executeBuiltinTool(toolName, args, config) {
    const tool = createBuiltinTool(toolName, config);
    if (!tool) {
        throw new Error(`Built-in tool '${toolName}' not found`);
    }
    return await tool.execute(args);
}
/**
 * Get tool definition for a built-in tool in OpenAI format.
 *
 * @param toolName - Name of the built-in tool
 * @param config - Optional configuration for the tool
 * @returns Tool definition in OpenAI format, undefined if tool not found
 */
export function getBuiltinToolDefinition(toolName, config) {
    const tool = createBuiltinTool(toolName, config);
    if (!tool) {
        return undefined;
    }
    return tool.getToolDefinition();
}
// Export tool classes
export { CodeInterpreterTool } from './code_interpreter';
export { WebSearchTool } from './web_search';
export { BuiltinToolBase } from './base';
// Export all available tools
export const BUILTIN_TOOLS = {
    CodeInterpreterTool,
    WebSearchTool,
};
//# sourceMappingURL=index.js.map
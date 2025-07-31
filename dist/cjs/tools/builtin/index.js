"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILTIN_TOOLS = exports.BuiltinToolBase = exports.WebSearchTool = exports.CodeInterpreterTool = exports.getBuiltinToolDefinition = exports.executeBuiltinTool = exports.createBuiltinTool = exports.isBuiltinTool = exports.getAvailableBuiltinTools = exports.getBuiltinToolClass = exports.BUILTIN_TOOLS_REGISTRY = void 0;
const code_interpreter_1 = require("./code_interpreter");
const web_search_1 = require("./web_search");
// Registry of built-in tools
exports.BUILTIN_TOOLS_REGISTRY = {
    code_interpreter: code_interpreter_1.CodeInterpreterTool,
    web_search: web_search_1.WebSearchTool,
};
/**
 * Get the class for a built-in tool by name.
 *
 * @param toolName - Name of the built-in tool
 * @returns Tool class if found, undefined otherwise
 */
function getBuiltinToolClass(toolName) {
    return exports.BUILTIN_TOOLS_REGISTRY[toolName];
}
exports.getBuiltinToolClass = getBuiltinToolClass;
/**
 * Get list of available built-in tool names.
 *
 * @returns List of available built-in tool names
 */
function getAvailableBuiltinTools() {
    return Object.keys(exports.BUILTIN_TOOLS_REGISTRY);
}
exports.getAvailableBuiltinTools = getAvailableBuiltinTools;
/**
 * Check if a tool name refers to a built-in tool.
 *
 * @param toolName - Tool name to check
 * @returns True if it's a built-in tool, false otherwise
 */
function isBuiltinTool(toolName) {
    return toolName in exports.BUILTIN_TOOLS_REGISTRY;
}
exports.isBuiltinTool = isBuiltinTool;
/**
 * Create an instance of a built-in tool.
 *
 * @param toolName - Name of the built-in tool
 * @param config - Optional configuration for the tool
 * @returns Tool instance if found, undefined otherwise
 */
function createBuiltinTool(toolName, config) {
    const ToolClass = getBuiltinToolClass(toolName);
    if (!ToolClass) {
        return undefined;
    }
    return new ToolClass(config);
}
exports.createBuiltinTool = createBuiltinTool;
/**
 * Execute a built-in tool by name.
 *
 * @param toolName - Name of the built-in tool
 * @param args - Arguments to pass to the tool
 * @param config - Optional configuration for the tool
 * @returns Promise with execution result
 */
async function executeBuiltinTool(toolName, args, config) {
    const tool = createBuiltinTool(toolName, config);
    if (!tool) {
        throw new Error(`Built-in tool '${toolName}' not found`);
    }
    return await tool.execute(args);
}
exports.executeBuiltinTool = executeBuiltinTool;
/**
 * Get tool definition for a built-in tool in OpenAI format.
 *
 * @param toolName - Name of the built-in tool
 * @param config - Optional configuration for the tool
 * @returns Tool definition in OpenAI format, undefined if tool not found
 */
function getBuiltinToolDefinition(toolName, config) {
    const tool = createBuiltinTool(toolName, config);
    if (!tool) {
        return undefined;
    }
    return tool.getToolDefinition();
}
exports.getBuiltinToolDefinition = getBuiltinToolDefinition;
// Export tool classes
var code_interpreter_2 = require("./code_interpreter");
Object.defineProperty(exports, "CodeInterpreterTool", { enumerable: true, get: function () { return code_interpreter_2.CodeInterpreterTool; } });
var web_search_2 = require("./web_search");
Object.defineProperty(exports, "WebSearchTool", { enumerable: true, get: function () { return web_search_2.WebSearchTool; } });
var base_1 = require("./base");
Object.defineProperty(exports, "BuiltinToolBase", { enumerable: true, get: function () { return base_1.BuiltinToolBase; } });
// Export all available tools
exports.BUILTIN_TOOLS = {
    CodeInterpreterTool: code_interpreter_1.CodeInterpreterTool,
    WebSearchTool: web_search_1.WebSearchTool,
};
//# sourceMappingURL=index.js.map
"use strict";
/**
 * Core tools functionality - decorators and registry management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTool = exports.validateTool = exports.ensureToolFormat = exports.mergeToolLists = exports.executeTool = exports.clearRegistry = exports.getRegistry = exports.getTools = exports.tools = void 0;
const registry_1 = require("./registry");
const schema_1 = require("./schema");
const errors_1 = require("../errors");
// Global tool registry
const globalRegistry = new registry_1.ToolRegistry();
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
function tools(target) {
    const functionName = target.name;
    if (!functionName) {
        throw new errors_1.ToolRegistrationError('Tool functions must have a name');
    }
    // Generate tool schema from function signature
    const toolSchema = (0, schema_1.generateToolSchema)(functionName, target);
    // Register the tool
    globalRegistry.register(functionName, toolSchema, target);
    // Add schema to function for inspection
    const decoratedFunction = target;
    decoratedFunction._toolSchema = toolSchema;
    return decoratedFunction;
}
exports.tools = tools;
/**
 * Get tools from the registry
 *
 * @param names - Optional array of tool names to retrieve. If not provided, returns all tools
 * @returns Array of OpenAI-format tool definitions
 */
function getTools(names) {
    return globalRegistry.getToolsArray(names);
}
exports.getTools = getTools;
/**
 * Get the global tool registry
 */
function getRegistry() {
    return globalRegistry;
}
exports.getRegistry = getRegistry;
/**
 * Clear all registered tools
 */
function clearRegistry() {
    globalRegistry.clear();
}
exports.clearRegistry = clearRegistry;
/**
 * Execute a registered tool by name
 *
 * @param name - Tool name
 * @param args - Tool arguments
 * @returns Tool execution result
 */
async function executeTool(name, args) {
    const entry = globalRegistry.get(name);
    if (!entry) {
        throw new errors_1.ToolRegistrationError(`Tool '${name}' not found in registry`);
    }
    try {
        // Call the function with spread arguments
        const result = await entry.fn(args);
        return result;
    }
    catch (error) {
        throw new Error(`Tool execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
exports.executeTool = executeTool;
/**
 * Merge multiple tool lists together
 *
 * @param toolLists - Arrays of tools to merge
 * @returns Combined array of tools
 */
function mergeToolLists(...toolLists) {
    const merged = [];
    const seen = new Set();
    toolLists.forEach(list => {
        if (!list)
            return;
        list.forEach(tool => {
            const name = tool.function.name;
            if (!seen.has(name)) {
                seen.add(name);
                merged.push(tool);
            }
        });
    });
    return merged;
}
exports.mergeToolLists = mergeToolLists;
/**
 * Ensure tool is in proper OpenAI format
 *
 * @param tool - Tool definition
 * @returns Normalized tool definition
 */
function ensureToolFormat(tool) {
    if (typeof tool === 'string') {
        // Handle built-in tool names
        return {
            type: 'function',
            function: {
                name: tool,
                description: `Built-in tool: ${tool}`,
                parameters: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
        };
    }
    if (tool.type === 'function' && tool.function) {
        return tool;
    }
    throw new errors_1.ToolRegistrationError(`Invalid tool format: ${JSON.stringify(tool)}`);
}
exports.ensureToolFormat = ensureToolFormat;
/**
 * Validate tool definition
 *
 * @param tool - Tool to validate
 * @returns True if valid, throws error if invalid
 */
function validateTool(tool) {
    if (!tool.type || tool.type !== 'function') {
        throw new errors_1.ToolRegistrationError('Tool must have type "function"');
    }
    if (!tool.function) {
        throw new errors_1.ToolRegistrationError('Tool must have function definition');
    }
    if (!tool.function.name) {
        throw new errors_1.ToolRegistrationError('Tool function must have a name');
    }
    if (!tool.function.parameters) {
        throw new errors_1.ToolRegistrationError('Tool function must have parameters definition');
    }
    return true;
}
exports.validateTool = validateTool;
/**
 * Create a tool definition manually
 *
 * @param name - Tool name
 * @param description - Tool description
 * @param parameters - Tool parameters schema
 * @param fn - Tool function
 * @returns Tool definition
 */
function createTool(name, description, parameters, fn) {
    const tool = {
        type: 'function',
        function: {
            name,
            description,
            parameters: {
                type: 'object',
                properties: parameters,
                required: Object.keys(parameters).filter(key => parameters[key].required !== false),
            },
        },
    };
    // Register the tool
    globalRegistry.register(name, tool, fn);
    return tool;
}
exports.createTool = createTool;
//# sourceMappingURL=core.js.map
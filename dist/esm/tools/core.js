/**
 * Core tools functionality - decorators and registry management
 */
import { ToolRegistry } from './registry';
import { generateToolSchema } from './schema';
import { ToolRegistrationError } from '../errors';
// Global tool registry
const globalRegistry = new ToolRegistry();
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
export function tools(target) {
    const functionName = target.name;
    if (!functionName) {
        throw new ToolRegistrationError('Tool functions must have a name');
    }
    // Generate tool schema from function signature
    const toolSchema = generateToolSchema(functionName, target);
    // Register the tool
    globalRegistry.register(functionName, toolSchema, target);
    // Add schema to function for inspection
    const decoratedFunction = target;
    decoratedFunction._toolSchema = toolSchema;
    return decoratedFunction;
}
/**
 * Get tools from the registry
 *
 * @param names - Optional array of tool names to retrieve. If not provided, returns all tools
 * @returns Array of OpenAI-format tool definitions
 */
export function getTools(names) {
    return globalRegistry.getToolsArray(names);
}
/**
 * Get the global tool registry
 */
export function getRegistry() {
    return globalRegistry;
}
/**
 * Clear all registered tools
 */
export function clearRegistry() {
    globalRegistry.clear();
}
/**
 * Execute a registered tool by name
 *
 * @param name - Tool name
 * @param args - Tool arguments
 * @returns Tool execution result
 */
export async function executeTool(name, args) {
    const entry = globalRegistry.get(name);
    if (!entry) {
        throw new ToolRegistrationError(`Tool '${name}' not found in registry`);
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
/**
 * Merge multiple tool lists together
 *
 * @param toolLists - Arrays of tools to merge
 * @returns Combined array of tools
 */
export function mergeToolLists(...toolLists) {
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
/**
 * Ensure tool is in proper OpenAI format
 *
 * @param tool - Tool definition
 * @returns Normalized tool definition
 */
export function ensureToolFormat(tool) {
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
    throw new ToolRegistrationError(`Invalid tool format: ${JSON.stringify(tool)}`);
}
/**
 * Validate tool definition
 *
 * @param tool - Tool to validate
 * @returns True if valid, throws error if invalid
 */
export function validateTool(tool) {
    if (!tool.type || tool.type !== 'function') {
        throw new ToolRegistrationError('Tool must have type "function"');
    }
    if (!tool.function) {
        throw new ToolRegistrationError('Tool must have function definition');
    }
    if (!tool.function.name) {
        throw new ToolRegistrationError('Tool function must have a name');
    }
    if (!tool.function.parameters) {
        throw new ToolRegistrationError('Tool function must have parameters definition');
    }
    return true;
}
/**
 * Create a tool definition manually
 *
 * @param name - Tool name
 * @param description - Tool description
 * @param parameters - Tool parameters schema
 * @param fn - Tool function
 * @returns Tool definition
 */
export function createTool(name, description, parameters, fn) {
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
//# sourceMappingURL=core.js.map
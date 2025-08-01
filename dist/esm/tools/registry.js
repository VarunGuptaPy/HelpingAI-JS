/**
 * Tool registry for managing registered tools
 */
import { ToolRegistrationError } from '../errors';
export class ToolRegistry {
    constructor() {
        this.tools = new Map();
    }
    /**
     * Register a tool with its function
     */
    register(name, tool, fn) {
        if (this.tools.has(name)) {
            throw new ToolRegistrationError(`Tool '${name}' is already registered`);
        }
        this.tools.set(name, { tool, fn });
    }
    /**
     * Get a registered tool
     */
    get(name) {
        return this.tools.get(name);
    }
    /**
     * Check if a tool is registered
     */
    has(name) {
        return this.tools.has(name);
    }
    /**
     * List all registered tools
     */
    list() {
        return Array.from(this.tools.entries()).map(([name, entry]) => ({
            name,
            tool: entry.tool,
            fn: entry.fn,
        }));
    }
    /**
     * Get tool names
     */
    listToolNames() {
        return Array.from(this.tools.keys());
    }
    /**
     * Get number of registered tools
     */
    size() {
        return this.tools.size;
    }
    /**
     * Clear all registered tools
     */
    clear() {
        this.tools.clear();
    }
    /**
     * Remove a specific tool
     */
    remove(name) {
        return this.tools.delete(name);
    }
    /**
     * Get tools as OpenAI format array
     */
    getToolsArray(names) {
        const entries = names
            ? names.map(name => this.tools.get(name)).filter(Boolean)
            : Array.from(this.tools.values());
        return entries.map(entry => entry.tool);
    }
}
//# sourceMappingURL=registry.js.map
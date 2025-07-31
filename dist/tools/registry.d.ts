/**
 * Tool registry for managing registered tools
 */
import { Tool } from '../types';
export interface ToolEntry {
    tool: Tool;
    fn: Function;
}
export declare class ToolRegistry {
    private tools;
    /**
     * Register a tool with its function
     */
    register(name: string, tool: Tool, fn: Function): void;
    /**
     * Get a registered tool
     */
    get(name: string): ToolEntry | undefined;
    /**
     * Check if a tool is registered
     */
    has(name: string): boolean;
    /**
     * List all registered tools
     */
    list(): Array<{
        name: string;
        tool: Tool;
        fn: Function;
    }>;
    /**
     * Get tool names
     */
    listToolNames(): string[];
    /**
     * Get number of registered tools
     */
    size(): number;
    /**
     * Clear all registered tools
     */
    clear(): void;
    /**
     * Remove a specific tool
     */
    remove(name: string): boolean;
    /**
     * Get tools as OpenAI format array
     */
    getToolsArray(names?: string[]): Tool[];
}
//# sourceMappingURL=registry.d.ts.map
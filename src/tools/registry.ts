/**
 * Tool registry for managing registered tools
 */

import { Tool } from '../types';
import { ToolRegistrationError } from '../errors';

export interface ToolEntry {
  tool: Tool;
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function;
}

export class ToolRegistry {
  private tools = new Map<string, ToolEntry>();

  /**
   * Register a tool with its function
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  register(name: string, tool: Tool, fn: Function): void {
    if (this.tools.has(name)) {
      throw new ToolRegistrationError(`Tool '${name}' is already registered`);
    }

    this.tools.set(name, { tool, fn });
  }

  /**
   * Get a registered tool
   */
  get(name: string): ToolEntry | undefined {
    return this.tools.get(name);
  }

  /**
   * Check if a tool is registered
   */
  has(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * List all registered tools
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  list(): Array<{ name: string; tool: Tool; fn: Function }> {
    return Array.from(this.tools.entries()).map(([name, entry]) => ({
      name,
      tool: entry.tool,
      fn: entry.fn,
    }));
  }

  /**
   * Get tool names
   */
  listToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Get number of registered tools
   */
  size(): number {
    return this.tools.size;
  }

  /**
   * Clear all registered tools
   */
  clear(): void {
    this.tools.clear();
  }

  /**
   * Remove a specific tool
   */
  remove(name: string): boolean {
    return this.tools.delete(name);
  }

  /**
   * Get tools as OpenAI format array
   */
  getToolsArray(names?: string[]): Tool[] {
    const entries = names
      ? (names.map(name => this.tools.get(name)).filter(Boolean) as ToolEntry[])
      : Array.from(this.tools.values());

    return entries.map(entry => entry.tool);
  }
}

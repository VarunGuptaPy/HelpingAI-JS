/**
 * HelpingAI JavaScript/TypeScript SDK
 *
 * The official JavaScript library for the HelpingAI API - Advanced AI with Emotional Intelligence
 *
 * @example
 * ```typescript
 * import { HelpingAI } from 'helpingai';
 *
 * const client = new HelpingAI({
 *   apiKey: 'your-api-key'
 * });
 *
 * const response = await client.chat.completions.create({
 *   model: 'Dhanishtha-2.0-preview',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */
export { HelpingAI } from './client';
export * from './types';
export * from './errors';
// Export tools system selectively to avoid conflicts
export { tools, getTools, getRegistry, clearRegistry } from './tools';
// Export MCP integration selectively to avoid conflicts
export { MCPClient, MCPManager } from './mcp';
// Re-export for compatibility
export { HelpingAI as HAI } from './client';
// Version
export const VERSION = '1.0.0';
//# sourceMappingURL=index.js.map
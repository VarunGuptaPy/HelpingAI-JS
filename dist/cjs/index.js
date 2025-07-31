"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.HAI = exports.MCPManager = exports.MCPClient = exports.clearRegistry = exports.getRegistry = exports.getTools = exports.tools = exports.HelpingAI = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "HelpingAI", { enumerable: true, get: function () { return client_1.HelpingAI; } });
__exportStar(require("./types"), exports);
__exportStar(require("./errors"), exports);
// Export tools system selectively to avoid conflicts
var tools_1 = require("./tools");
Object.defineProperty(exports, "tools", { enumerable: true, get: function () { return tools_1.tools; } });
Object.defineProperty(exports, "getTools", { enumerable: true, get: function () { return tools_1.getTools; } });
Object.defineProperty(exports, "getRegistry", { enumerable: true, get: function () { return tools_1.getRegistry; } });
Object.defineProperty(exports, "clearRegistry", { enumerable: true, get: function () { return tools_1.clearRegistry; } });
// Export MCP integration selectively to avoid conflicts
var mcp_1 = require("./mcp");
Object.defineProperty(exports, "MCPClient", { enumerable: true, get: function () { return mcp_1.MCPClient; } });
Object.defineProperty(exports, "MCPManager", { enumerable: true, get: function () { return mcp_1.MCPManager; } });
// Re-export for compatibility
var client_2 = require("./client");
Object.defineProperty(exports, "HAI", { enumerable: true, get: function () { return client_2.HelpingAI; } });
// Version
exports.VERSION = '1.0.0';
//# sourceMappingURL=index.js.map
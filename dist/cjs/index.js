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
exports.VERSION = exports.HAI = exports.BUILTIN_TOOLS_REGISTRY = exports.WebSearchTool = exports.CodeInterpreterTool = exports.getBuiltinToolDefinition = exports.createBuiltinTool = exports.getAvailableBuiltinTools = exports.getBuiltinToolClass = exports.isBuiltinTool = exports.executeBuiltinTool = exports.executeTool = exports.clearRegistry = exports.getRegistry = exports.getTools = exports.tools = exports.HelpingAI = void 0;
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
Object.defineProperty(exports, "executeTool", { enumerable: true, get: function () { return tools_1.executeTool; } });
// Export builtin tools
var builtin_1 = require("./tools/builtin");
Object.defineProperty(exports, "executeBuiltinTool", { enumerable: true, get: function () { return builtin_1.executeBuiltinTool; } });
Object.defineProperty(exports, "isBuiltinTool", { enumerable: true, get: function () { return builtin_1.isBuiltinTool; } });
Object.defineProperty(exports, "getBuiltinToolClass", { enumerable: true, get: function () { return builtin_1.getBuiltinToolClass; } });
Object.defineProperty(exports, "getAvailableBuiltinTools", { enumerable: true, get: function () { return builtin_1.getAvailableBuiltinTools; } });
Object.defineProperty(exports, "createBuiltinTool", { enumerable: true, get: function () { return builtin_1.createBuiltinTool; } });
Object.defineProperty(exports, "getBuiltinToolDefinition", { enumerable: true, get: function () { return builtin_1.getBuiltinToolDefinition; } });
Object.defineProperty(exports, "CodeInterpreterTool", { enumerable: true, get: function () { return builtin_1.CodeInterpreterTool; } });
Object.defineProperty(exports, "WebSearchTool", { enumerable: true, get: function () { return builtin_1.WebSearchTool; } });
Object.defineProperty(exports, "BUILTIN_TOOLS_REGISTRY", { enumerable: true, get: function () { return builtin_1.BUILTIN_TOOLS_REGISTRY; } });
// Export MCP integration selectively to avoid conflicts
// export { MCPManager } from './mcp'; // Commented out to avoid conflicts
// Re-export for compatibility
var client_2 = require("./client");
Object.defineProperty(exports, "HAI", { enumerable: true, get: function () { return client_2.HelpingAI; } });
// Version
exports.VERSION = '1.0.0';
//# sourceMappingURL=index.js.map
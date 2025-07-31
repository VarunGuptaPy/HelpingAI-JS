"use strict";
/**
 * Tool system for HelpingAI SDK
 *
 * Provides decorators and utilities for creating AI-callable tools
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
exports.BuiltinToolBase = exports.BUILTIN_TOOLS = exports.BUILTIN_TOOLS_REGISTRY = exports.WebSearchTool = exports.CodeInterpreterTool = exports.getBuiltinToolDefinition = exports.createBuiltinTool = exports.getAvailableBuiltinTools = exports.getBuiltinToolClass = exports.isBuiltinTool = exports.executeBuiltinTool = exports.ToolRegistry = exports.executeTool = exports.clearRegistry = exports.getRegistry = exports.getTools = exports.tools = void 0;
var core_1 = require("./core");
Object.defineProperty(exports, "tools", { enumerable: true, get: function () { return core_1.tools; } });
Object.defineProperty(exports, "getTools", { enumerable: true, get: function () { return core_1.getTools; } });
Object.defineProperty(exports, "getRegistry", { enumerable: true, get: function () { return core_1.getRegistry; } });
Object.defineProperty(exports, "clearRegistry", { enumerable: true, get: function () { return core_1.clearRegistry; } });
Object.defineProperty(exports, "executeTool", { enumerable: true, get: function () { return core_1.executeTool; } });
var registry_1 = require("./registry");
Object.defineProperty(exports, "ToolRegistry", { enumerable: true, get: function () { return registry_1.ToolRegistry; } });
__exportStar(require("./types"), exports);
__exportStar(require("./schema"), exports);
// Export builtin tools selectively to avoid conflicts
var builtin_1 = require("./builtin");
Object.defineProperty(exports, "executeBuiltinTool", { enumerable: true, get: function () { return builtin_1.executeBuiltinTool; } });
Object.defineProperty(exports, "isBuiltinTool", { enumerable: true, get: function () { return builtin_1.isBuiltinTool; } });
Object.defineProperty(exports, "getBuiltinToolClass", { enumerable: true, get: function () { return builtin_1.getBuiltinToolClass; } });
Object.defineProperty(exports, "getAvailableBuiltinTools", { enumerable: true, get: function () { return builtin_1.getAvailableBuiltinTools; } });
Object.defineProperty(exports, "createBuiltinTool", { enumerable: true, get: function () { return builtin_1.createBuiltinTool; } });
Object.defineProperty(exports, "getBuiltinToolDefinition", { enumerable: true, get: function () { return builtin_1.getBuiltinToolDefinition; } });
Object.defineProperty(exports, "CodeInterpreterTool", { enumerable: true, get: function () { return builtin_1.CodeInterpreterTool; } });
Object.defineProperty(exports, "WebSearchTool", { enumerable: true, get: function () { return builtin_1.WebSearchTool; } });
Object.defineProperty(exports, "BUILTIN_TOOLS_REGISTRY", { enumerable: true, get: function () { return builtin_1.BUILTIN_TOOLS_REGISTRY; } });
Object.defineProperty(exports, "BUILTIN_TOOLS", { enumerable: true, get: function () { return builtin_1.BUILTIN_TOOLS; } });
Object.defineProperty(exports, "BuiltinToolBase", { enumerable: true, get: function () { return builtin_1.BuiltinToolBase; } });
//# sourceMappingURL=index.js.map
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
exports.ToolRegistry = exports.clearRegistry = exports.getRegistry = exports.getTools = exports.tools = void 0;
var core_1 = require("./core");
Object.defineProperty(exports, "tools", { enumerable: true, get: function () { return core_1.tools; } });
Object.defineProperty(exports, "getTools", { enumerable: true, get: function () { return core_1.getTools; } });
Object.defineProperty(exports, "getRegistry", { enumerable: true, get: function () { return core_1.getRegistry; } });
Object.defineProperty(exports, "clearRegistry", { enumerable: true, get: function () { return core_1.clearRegistry; } });
var registry_1 = require("./registry");
Object.defineProperty(exports, "ToolRegistry", { enumerable: true, get: function () { return registry_1.ToolRegistry; } });
__exportStar(require("./types"), exports);
__exportStar(require("./schema"), exports);
//# sourceMappingURL=index.js.map
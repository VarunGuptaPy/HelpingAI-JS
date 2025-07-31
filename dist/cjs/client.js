"use strict";
/**
 * Main HelpingAI client implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HAI = exports.HelpingAI = void 0;
const errors_1 = require("./errors");
const manager_1 = require("./mcp/manager");
const core_1 = require("./tools/core");
class HelpingAI {
    constructor(config = {}) {
        /**
         * Chat completions API
         */
        this.chat = {
            completions: {
                create: async (request) => {
                    return this.createChatCompletion(request);
                }
            }
        };
        /**
         * Models API
         */
        this.models = {
            list: async () => {
                return this.listModels();
            },
            retrieve: async (modelId) => {
                return this.retrieveModel(modelId);
            }
        };
        this.config = {
            apiKey: config.apiKey || '',
            baseURL: config.baseURL || 'https://api.helpingai.co/v1',
            timeout: config.timeout || 30000,
            organization: config.organization || '',
            defaultHeaders: config.defaultHeaders || {}
        };
        if (!this.config.apiKey) {
            console.warn('HelpingAI API key not provided. Set HAI_API_KEY environment variable or pass apiKey in config.');
        }
    }
    /**
     * Direct tool execution method
     */
    async call(toolName, args) {
        try {
            // Check if it's an MCP tool
            if (this.mcpManager?.isMCPTool(toolName)) {
                return await this.mcpManager.executeTool(toolName, args);
            }
            // Check if it's a registered tool
            if ((0, core_1.getRegistry)().has(toolName)) {
                return await (0, core_1.executeTool)(toolName, args);
            }
            // Handle built-in tools
            if (toolName === 'code_interpreter' || toolName === 'web_search') {
                return await this.executeBuiltinTool(toolName, args);
            }
            throw new errors_1.ToolExecutionError(`Tool '${toolName}' not found`, toolName);
        }
        catch (error) {
            throw new errors_1.ToolExecutionError(`Failed to execute tool '${toolName}': ${error instanceof Error ? error.message : String(error)}`, toolName);
        }
    }
    /**
     * Create chat completion
     */
    async createChatCompletion(request) {
        // Process tools if provided
        const processedTools = await this.processTools(request.tools);
        const requestBody = {
            ...request,
            ...(processedTools && { tools: processedTools })
        };
        if (request.stream) {
            return this.createStreamingCompletion(requestBody);
        }
        else {
            return this.createNonStreamingCompletion(requestBody);
        }
    }
    /**
     * Process tools configuration
     */
    async processTools(tools) {
        if (!tools || tools.length === 0) {
            return undefined;
        }
        const processedTools = [];
        for (const tool of tools) {
            if (typeof tool === 'string') {
                // Built-in tool
                processedTools.push(tool);
            }
            else if ('mcpServers' in tool) {
                // MCP configuration
                try {
                    const { manager, tools: mcpTools } = await manager_1.MCPManager.processConfiguration(tool);
                    this.mcpManager = manager;
                    processedTools.push(...mcpTools);
                }
                catch (error) {
                    console.warn('Failed to process MCP configuration:', error);
                }
            }
            else {
                // Regular OpenAI-format tool
                processedTools.push(tool);
            }
        }
        return processedTools;
    }
    /**
     * Create non-streaming completion
     */
    async createNonStreamingCompletion(request) {
        const response = await this.makeRequest('/chat/completions', {
            method: 'POST',
            body: JSON.stringify(request)
        });
        return response;
    }
    /**
     * Create streaming completion
     */
    async createStreamingCompletion(_request) {
        const url = `${this.config.baseURL}/chat/completions`;
        const headers = this.getHeaders();
        return new Promise((resolve, reject) => {
            const eventSource = new EventSource(url, {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });
            const chunks = [];
            let resolved = false;
            eventSource.onmessage = (event) => {
                if (event.data === '[DONE]') {
                    eventSource.close();
                    if (!resolved) {
                        resolved = true;
                        resolve(this.createAsyncIterable(chunks));
                    }
                    return;
                }
                try {
                    const chunk = JSON.parse(event.data);
                    chunks.push(chunk);
                }
                catch (error) {
                    console.warn('Failed to parse streaming chunk:', error);
                }
            };
            eventSource.onerror = (_error) => {
                eventSource.close();
                if (!resolved) {
                    resolved = true;
                    reject(new errors_1.NetworkError('Streaming connection failed'));
                }
            };
            // Send the request body (this is a simplified implementation)
            // In a real implementation, you'd need to handle POST data with EventSource
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(this.createAsyncIterable(chunks));
                }
            }, 100);
        });
    }
    /**
     * Create async iterable from chunks
     */
    async *createAsyncIterable(chunks) {
        for (const chunk of chunks) {
            yield chunk;
        }
    }
    /**
     * Execute built-in tool
     */
    async executeBuiltinTool(toolName, args) {
        // Mock implementation for built-in tools
        switch (toolName) {
            case 'code_interpreter':
                return `Code execution result for: ${JSON.stringify(args)}`;
            case 'web_search':
                return `Web search results for: ${JSON.stringify(args)}`;
            default:
                throw new errors_1.ToolExecutionError(`Unknown built-in tool: ${toolName}`, toolName);
        }
    }
    /**
     * List available models
     */
    async listModels() {
        const response = await this.makeRequest('/models', { method: 'GET' });
        return response;
    }
    /**
     * Retrieve specific model
     */
    async retrieveModel(modelId) {
        const response = await this.makeRequest(`/models/${modelId}`, { method: 'GET' });
        return response;
    }
    /**
     * Make HTTP request
     */
    async makeRequest(endpoint, options) {
        const url = `${this.config.baseURL}${endpoint}`;
        const headers = this.getHeaders();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw (0, errors_1.parseErrorResponse)(response.status, errorData, Object.fromEntries(response.headers.entries()));
            }
            return await response.json();
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new errors_1.TimeoutError('Request timeout');
            }
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new errors_1.NetworkError('Network error');
            }
            throw error;
        }
    }
    /**
     * Get request headers
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'HelpingAI-JS/1.0.0',
            ...this.config.defaultHeaders
        };
        if (this.config.apiKey) {
            headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }
        if (this.config.organization) {
            headers['HelpingAI-Organization'] = this.config.organization;
        }
        return headers;
    }
    /**
     * Cleanup resources
     */
    async cleanup() {
        if (this.mcpManager) {
            await this.mcpManager.cleanup();
        }
    }
}
exports.HelpingAI = HelpingAI;
exports.HAI = HelpingAI;
//# sourceMappingURL=client.js.map
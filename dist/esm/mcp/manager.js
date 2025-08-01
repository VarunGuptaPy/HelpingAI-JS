/**
 * MCP Manager for handling multiple MCP server connections
 */
import { MCPClient } from './client';
import { MCPError } from '../errors';
export class MCPManager {
    constructor() {
        this.initialized = false;
        this.client = new MCPClient();
    }
    /**
     * Initialize MCP servers from configuration
     */
    async initialize(config) {
        if (this.initialized) {
            return;
        }
        const serverNames = Object.keys(config.mcpServers);
        const connectionPromises = serverNames.map(async (serverName) => {
            const serverConfig = config.mcpServers[serverName];
            try {
                await this.client.connect(serverName, serverConfig);
            }
            catch (error) {
                console.warn(`Failed to connect to MCP server ${serverName}:`, error);
                // Continue with other servers even if one fails
            }
        });
        await Promise.allSettled(connectionPromises);
        this.initialized = true;
    }
    /**
     * Convert MCP tools to OpenAI format
     */
    getToolsAsOpenAIFormat() {
        if (!this.initialized) {
            return [];
        }
        const mcpTools = this.client.getAvailableTools();
        return mcpTools.map(this.convertMCPToolToOpenAI);
    }
    /**
     * Convert MCP tool to OpenAI format
     */
    convertMCPToolToOpenAI(mcpTool) {
        return {
            type: 'function',
            function: {
                name: mcpTool.name,
                description: mcpTool.description,
                parameters: mcpTool.inputSchema || {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
        };
    }
    /**
     * Execute MCP tool call
     */
    async executeTool(toolName, args) {
        if (!this.initialized) {
            throw new MCPError('MCP manager not initialized');
        }
        try {
            const result = await this.client.callTool(toolName, args);
            // Convert MCP result to simple string/object format
            if (result.isError) {
                throw new MCPError(`MCP tool execution failed: ${JSON.stringify(result.content)}`);
            }
            // Extract text content from MCP result
            const textContent = result.content
                .filter(item => item.type === 'text')
                .map(item => item.text)
                .join('\n');
            return textContent || JSON.stringify(result.content);
        }
        catch (error) {
            throw new MCPError(`Failed to execute MCP tool ${toolName}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Check if a tool is from MCP
     */
    isMCPTool(toolName) {
        if (!this.initialized) {
            return false;
        }
        const mcpTools = this.client.getAvailableTools();
        return mcpTools.some(tool => tool.name === toolName);
    }
    /**
     * Get connection status
     */
    getConnectionStatus() {
        return this.client.getConnectionStatus();
    }
    /**
     * Get list of connected servers
     */
    getConnectedServers() {
        return this.client.getConnectedServers();
    }
    /**
     * Disconnect from all servers
     */
    async cleanup() {
        await this.client.disconnectAll();
        this.initialized = false;
    }
    /**
     * Check if manager is initialized
     */
    isInitialized() {
        return this.initialized;
    }
    /**
     * Process MCP servers configuration and extract tools
     */
    static async processConfiguration(config) {
        const manager = new MCPManager();
        try {
            await manager.initialize(config);
            const tools = manager.getToolsAsOpenAIFormat();
            return { manager, tools };
        }
        catch (error) {
            console.warn('Failed to initialize MCP manager:', error);
            return { manager, tools: [] };
        }
    }
    /**
     * Validate MCP server configuration
     */
    static validateConfiguration(config) {
        const errors = [];
        if (!config.mcpServers || typeof config.mcpServers !== 'object') {
            errors.push('mcpServers must be an object');
            return { valid: false, errors };
        }
        Object.entries(config.mcpServers).forEach(([serverName, serverConfig]) => {
            if (!serverName || typeof serverName !== 'string') {
                errors.push('Server name must be a non-empty string');
                return;
            }
            if (!serverConfig || typeof serverConfig !== 'object') {
                errors.push(`Server config for ${serverName} must be an object`);
                return;
            }
            // Check for either stdio or HTTP configuration
            const hasStdioConfig = serverConfig.command && Array.isArray(serverConfig.args);
            const hasHttpConfig = serverConfig.url;
            if (!hasStdioConfig && !hasHttpConfig) {
                errors.push(`Server ${serverName} must have either command/args or url configuration`);
            }
            if (hasStdioConfig && hasHttpConfig) {
                errors.push(`Server ${serverName} cannot have both stdio and HTTP configuration`);
            }
            // Validate HTTP config
            if (hasHttpConfig) {
                try {
                    new URL(serverConfig.url);
                }
                catch {
                    errors.push(`Server ${serverName} has invalid URL: ${serverConfig.url}`);
                }
            }
        });
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
//# sourceMappingURL=manager.js.map
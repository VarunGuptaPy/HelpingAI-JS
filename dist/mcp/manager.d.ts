/**
 * MCP Manager for handling multiple MCP server connections
 */
import { MCPServersConfig } from './types';
import { Tool } from '../types';
export declare class MCPManager {
    private client;
    private initialized;
    constructor();
    /**
     * Initialize MCP servers from configuration
     */
    initialize(config: MCPServersConfig): Promise<void>;
    /**
     * Convert MCP tools to OpenAI format
     */
    getToolsAsOpenAIFormat(): Tool[];
    /**
     * Convert MCP tool to OpenAI format
     */
    private convertMCPToolToOpenAI;
    /**
     * Execute MCP tool call
     */
    executeTool(toolName: string, args: Record<string, any>): Promise<any>;
    /**
     * Check if a tool is from MCP
     */
    isMCPTool(toolName: string): boolean;
    /**
     * Get connection status
     */
    getConnectionStatus(): Record<string, boolean>;
    /**
     * Get list of connected servers
     */
    getConnectedServers(): string[];
    /**
     * Disconnect from all servers
     */
    cleanup(): Promise<void>;
    /**
     * Check if manager is initialized
     */
    isInitialized(): boolean;
    /**
     * Process MCP servers configuration and extract tools
     */
    static processConfiguration(config: MCPServersConfig): Promise<{
        manager: MCPManager;
        tools: Tool[];
    }>;
    /**
     * Validate MCP server configuration
     */
    static validateConfiguration(config: MCPServersConfig): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=manager.d.ts.map
/**
 * MCP Client implementation
 */
import { MCPServerConfig, MCPTool, MCPToolResult } from './types';
export declare class MCPClient {
    private connections;
    /**
     * Initialize MCP server connection
     */
    connect(serverName: string, config: MCPServerConfig): Promise<void>;
    /**
     * Check if MCP SDK is available
     */
    private isMCPAvailable;
    /**
     * Initialize stdio-based MCP connection
     */
    private initializeStdioConnection;
    /**
     * Initialize HTTP-based MCP connection
     */
    private initializeHttpConnection;
    /**
     * Get all available tools from connected MCP servers
     */
    getAvailableTools(): MCPTool[];
    /**
     * Execute a tool call on an MCP server
     */
    callTool(toolName: string, args: Record<string, any>): Promise<MCPToolResult>;
    /**
     * Disconnect from an MCP server
     */
    disconnect(serverName: string): Promise<void>;
    /**
     * Disconnect from all MCP servers
     */
    disconnectAll(): Promise<void>;
    /**
     * Get connection status
     */
    getConnectionStatus(): Record<string, boolean>;
    /**
     * List connected servers
     */
    getConnectedServers(): string[];
}
//# sourceMappingURL=client.d.ts.map
/**
 * Types for MCP (Model Context Protocol) integration
 */

export interface MCPServerConfig {
  // Stdio-based server
  command?: string;
  args?: string[];
  env?: Record<string, string>;

  // HTTP-based server
  url?: string;
  headers?: Record<string, string>;
  type?: 'stdio' | 'sse' | 'streamable-http';
  sse_read_timeout?: number;
}

export interface MCPServersConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

export interface MCPTool {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputSchema: Record<string, any>;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPServerInfo {
  name: string;
  version: string;
  protocolVersion: string;
}

export interface MCPCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
}

export interface MCPInitializeResult {
  protocolVersion: string;
  capabilities: MCPCapabilities;
  serverInfo: MCPServerInfo;
}

export interface MCPToolCall {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface MCPConnection {
  serverName: string;
  config: MCPServerConfig;
  initialized: boolean;
  capabilities?: MCPCapabilities;
  tools: MCPTool[];
  resources: MCPResource[];
}

/**
 * Type definitions for the HelpingAI SDK
 */

// Base types
export interface HelpingAIConfig {
  apiKey?: string;
  baseURL?: string;
  timeout?: number;
  organization?: string;
  defaultHeaders?: Record<string, string>;
}

// Message types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

// Tool types
export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters: Record<string, any>;
  };
}

export interface MCPServerConfig {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  type?: 'stdio' | 'sse' | 'streamable-http';
  sse_read_timeout?: number;
}

export interface MCPServersConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

export type ToolDefinition = Tool | MCPServersConfig | string;

// Chat completion types
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  tools?: ToolDefinition[];
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
  hide_think?: boolean;
  stop?: string | string[];
  user?: string;
}

export interface ChatCompletionChoice {
  index: number;
  message: ChatMessage;
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Streaming types
export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: Partial<ChatMessage>;
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
  }>;
}

// Model types
export interface Model {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
  description?: string;
  name?: string;
}

export interface ModelList {
  object: 'list';
  data: Model[];
}

// Tool function decorator types
export interface ToolFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): any;
  _toolSchema?: Tool;
}

export interface ToolRegistry {
  // eslint-disable-next-line @typescript-eslint/ban-types
  register(name: string, tool: Tool, fn: Function): void;
  // eslint-disable-next-line @typescript-eslint/ban-types
  get(name: string): { tool: Tool; fn: Function } | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  list(): Array<{ name: string; tool: Tool; fn: Function }>;
  clear(): void;
  has(name: string): boolean;
  size(): number;
}

// Event types for streaming
export interface StreamEvent {
  data: string;
  event?: string;
  id?: string;
  retry?: number;
}

/**
 * Main HelpingAI client implementation
 */

// Simplified implementation - dependencies will be available at runtime
declare const fetch: any;
declare const EventSource: any;
import { 
  HelpingAIConfig, 
  ChatCompletionRequest, 
  ChatCompletionResponse, 
  ChatCompletionChunk,
  ToolDefinition,
  Model,
  ModelList
} from './types';
import { 
  parseErrorResponse, 
  TimeoutError, 
  NetworkError, 
  ToolExecutionError 
} from './errors';
import { MCPManager } from './mcp/manager';
import { executeTool, getRegistry } from './tools/core';

export class HelpingAI {
  private config: Required<HelpingAIConfig>;
  private mcpManager?: MCPManager;

  constructor(config: HelpingAIConfig = {}) {
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
   * Chat completions API
   */
  public chat = {
    completions: {
      create: async (request: ChatCompletionRequest): Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>> => {
        return this.createChatCompletion(request);
      }
    }
  };

  /**
   * Models API
   */
  public models = {
    list: async (): Promise<ModelList> => {
      return this.listModels();
    },
    retrieve: async (modelId: string): Promise<Model> => {
      return this.retrieveModel(modelId);
    }
  };

  /**
   * Direct tool execution method
   */
  public async call(toolName: string, args: Record<string, any>): Promise<any> {
    try {
      // Check if it's an MCP tool
      if (this.mcpManager?.isMCPTool(toolName)) {
        return await this.mcpManager.executeTool(toolName, args);
      }

      // Check if it's a registered tool
      if (getRegistry().has(toolName)) {
        return await executeTool(toolName, args);
      }

      // Handle built-in tools
      if (toolName === 'code_interpreter' || toolName === 'web_search') {
        return await this.executeBuiltinTool(toolName, args);
      }

      throw new ToolExecutionError(`Tool '${toolName}' not found`, toolName);
    } catch (error) {
      throw new ToolExecutionError(
        `Failed to execute tool '${toolName}': ${error instanceof Error ? error.message : String(error)}`,
        toolName
      );
    }
  }

  /**
   * Create chat completion
   */
  private async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>> {
    // Process tools if provided
    const processedTools = await this.processTools(request.tools);
    
    const requestBody = {
      ...request,
      ...(processedTools && { tools: processedTools })
    };

    if (request.stream) {
      return this.createStreamingCompletion(requestBody);
    } else {
      return this.createNonStreamingCompletion(requestBody);
    }
  }

  /**
   * Process tools configuration
   */
  private async processTools(tools?: ToolDefinition[]): Promise<any[] | undefined> {
    if (!tools || tools.length === 0) {
      return undefined;
    }

    const processedTools: any[] = [];

    for (const tool of tools) {
      if (typeof tool === 'string') {
        // Built-in tool
        processedTools.push(tool);
      } else if ('mcpServers' in tool) {
        // MCP configuration
        try {
          const { manager, tools: mcpTools } = await MCPManager.processConfiguration(tool);
          this.mcpManager = manager;
          processedTools.push(...mcpTools);
        } catch (error) {
          console.warn('Failed to process MCP configuration:', error);
        }
      } else {
        // Regular OpenAI-format tool
        processedTools.push(tool);
      }
    }

    return processedTools;
  }

  /**
   * Create non-streaming completion
   */
  private async createNonStreamingCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await this.makeRequest('/chat/completions', {
      method: 'POST',
      body: JSON.stringify(request)
    });

    return response as ChatCompletionResponse;
  }

  /**
   * Create streaming completion
   */
  private async createStreamingCompletion(_request: ChatCompletionRequest): Promise<AsyncIterable<ChatCompletionChunk>> {
    const url = `${this.config.baseURL}/chat/completions`;
    const headers = this.getHeaders();

    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(url, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      const chunks: ChatCompletionChunk[] = [];
      let resolved = false;

      eventSource.onmessage = (event: any) => {
        if (event.data === '[DONE]') {
          eventSource.close();
          if (!resolved) {
            resolved = true;
            resolve(this.createAsyncIterable(chunks));
          }
          return;
        }

        try {
          const chunk = JSON.parse(event.data) as ChatCompletionChunk;
          chunks.push(chunk);
        } catch (error) {
          console.warn('Failed to parse streaming chunk:', error);
        }
      };

      eventSource.onerror = (_error: any) => {
        eventSource.close();
        if (!resolved) {
          resolved = true;
          reject(new NetworkError('Streaming connection failed'));
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
  private async* createAsyncIterable(chunks: ChatCompletionChunk[]): AsyncIterable<ChatCompletionChunk> {
    for (const chunk of chunks) {
      yield chunk;
    }
  }

  /**
   * Execute built-in tool
   */
  private async executeBuiltinTool(toolName: string, args: Record<string, any>): Promise<any> {
    // Mock implementation for built-in tools
    switch (toolName) {
      case 'code_interpreter':
        return `Code execution result for: ${JSON.stringify(args)}`;
      case 'web_search':
        return `Web search results for: ${JSON.stringify(args)}`;
      default:
        throw new ToolExecutionError(`Unknown built-in tool: ${toolName}`, toolName);
    }
  }

  /**
   * List available models
   */
  private async listModels(): Promise<ModelList> {
    const response = await this.makeRequest('/models', { method: 'GET' });
    return response as ModelList;
  }

  /**
   * Retrieve specific model
   */
  private async retrieveModel(modelId: string): Promise<Model> {
    const response = await this.makeRequest(`/models/${modelId}`, { method: 'GET' });
    return response as Model;
  }

  /**
   * Make HTTP request
   */
  private async makeRequest(endpoint: string, options: RequestInit): Promise<any> {
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
        throw parseErrorResponse(response.status, errorData, Object.fromEntries(response.headers.entries()));
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError('Request timeout');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Network error');
      }
      
      throw error;
    }
  }

  /**
   * Get request headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
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
  public async cleanup(): Promise<void> {
    if (this.mcpManager) {
      await this.mcpManager.cleanup();
    }
  }
}

// Export as HAI for compatibility
export { HelpingAI as HAI };
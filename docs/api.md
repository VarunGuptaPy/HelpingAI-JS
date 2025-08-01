# HelpingAI JavaScript SDK API Reference

This document provides comprehensive API documentation for the HelpingAI JavaScript SDK.

## Table of Contents

- [Client Classes](#client-classes)
- [Type Definitions](#type-definitions)
- [Tools System](#tools-system)
- [MCP Integration](#mcp-integration)
- [Error Handling](#error-handling)
- [Configuration Options](#configuration-options)
- [Utilities](#utilities)

## Client Classes

### HelpingAI

The main client class for interacting with the HelpingAI API.

#### Constructor

```typescript
new HelpingAI(options?: HelpingAIOptions)
```

**Parameters:**

- `options` (optional): Configuration options for the client

**Example:**

```typescript
const client = new HelpingAI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.helpingai.com/v1',
  timeout: 30000,
  maxRetries: 3,
});
```

#### Properties

##### `chat`

Access to chat completion functionality.

**Type:** `ChatCompletions`

##### `apiKey`

The API key used for authentication.

**Type:** `string`

##### `baseURL`

The base URL for API requests.

**Type:** `string`

#### Methods

##### `chat.completions.create()`

Create a chat completion.

```typescript
async create(request: ChatCompletionRequest): Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>>
```

**Parameters:**

- `request`: Chat completion request configuration

**Returns:**

- `Promise<ChatCompletionResponse>` for non-streaming requests
- `Promise<AsyncIterable<ChatCompletionChunk>>` for streaming requests

**Example:**

```typescript
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Hello!' }],
  max_tokens: 100,
  temperature: 0.7,
});
```

##### `call()`

Execute a tool directly.

```typescript
async call<T = any>(toolName: string, parameters: Record<string, any>): Promise<T>
```

**Parameters:**

- `toolName`: Name of the tool to execute
- `parameters`: Parameters to pass to the tool

**Returns:**

- `Promise<T>`: Result of the tool execution

**Example:**

```typescript
const result = await client.call('getWeather', {
  city: 'Paris',
  units: 'celsius',
});
```

##### `cleanup()`

Clean up client resources.

```typescript
async cleanup(): Promise<void>
```

**Example:**

```typescript
await client.cleanup();
```

## Type Definitions

### HelpingAIOptions

Configuration options for the HelpingAI client.

```typescript
interface HelpingAIOptions {
  apiKey?: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
  defaultHeaders?: Record<string, string>;
}
```

**Properties:**

- `apiKey` (optional): API key for authentication. If not provided, will attempt to read from `HELPINGAI_API_KEY` environment variable
- `baseURL` (optional): Base URL for API requests. Default: `'https://api.helpingai.com/v1'`
- `timeout` (optional): Request timeout in milliseconds. Default: `30000`
- `maxRetries` (optional): Maximum number of retry attempts. Default: `3`
- `defaultHeaders` (optional): Default headers to include with all requests

### ChatCompletionRequest

Request configuration for chat completions.

```typescript
interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  tools?: Tool[];
  tool_choice?: 'auto' | 'none' | string;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
}
```

**Properties:**

- `model`: Model identifier (e.g., 'Dhanishtha-2.0-preview')
- `messages`: Array of conversation messages
- `max_tokens` (optional): Maximum tokens to generate
- `temperature` (optional): Sampling temperature (0-2). Default: `1`
- `top_p` (optional): Nucleus sampling parameter (0-1). Default: `1`
- `stream` (optional): Enable streaming responses. Default: `false`
- `tools` (optional): Available tools for the model to use
- `tool_choice` (optional): Tool selection strategy
- `stop` (optional): Stop sequences
- `presence_penalty` (optional): Presence penalty (-2 to 2). Default: `0`
- `frequency_penalty` (optional): Frequency penalty (-2 to 2). Default: `0`
- `logit_bias` (optional): Token logit bias
- `user` (optional): User identifier for tracking

### ChatMessage

Individual message in a conversation.

```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}
```

**Properties:**

- `role`: Message role
- `content`: Message content
- `name` (optional): Name of the message sender (for tool messages)
- `tool_calls` (optional): Tool calls made by the assistant
- `tool_call_id` (optional): ID of the tool call this message responds to

### ChatCompletionResponse

Response from a chat completion request.

```typescript
interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: Usage;
}
```

**Properties:**

- `id`: Unique identifier for the completion
- `object`: Object type identifier
- `created`: Unix timestamp of creation
- `model`: Model used for the completion
- `choices`: Array of completion choices
- `usage`: Token usage information

### ChatCompletionChoice

Individual choice in a chat completion response.

```typescript
interface ChatCompletionChoice {
  index: number;
  message: ChatMessage;
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
}
```

**Properties:**

- `index`: Choice index
- `message`: The generated message
- `finish_reason`: Reason the generation stopped

### ChatCompletionChunk

Streaming chunk from a chat completion.

```typescript
interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: ChatCompletionChunkChoice[];
}
```

**Properties:**

- `id`: Unique identifier for the completion
- `object`: Object type identifier
- `created`: Unix timestamp of creation
- `model`: Model used for the completion
- `choices`: Array of streaming choices

### ChatCompletionChunkChoice

Individual choice in a streaming chat completion chunk.

```typescript
interface ChatCompletionChunkChoice {
  index: number;
  delta: ChatMessageDelta;
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
}
```

**Properties:**

- `index`: Choice index
- `delta`: Incremental message content
- `finish_reason`: Reason the generation stopped (null if continuing)

### ChatMessageDelta

Incremental message content in streaming responses.

```typescript
interface ChatMessageDelta {
  role?: 'system' | 'user' | 'assistant' | 'tool';
  content?: string;
  tool_calls?: ToolCallDelta[];
}
```

**Properties:**

- `role` (optional): Message role (only in first chunk)
- `content` (optional): Incremental content
- `tool_calls` (optional): Incremental tool calls

### Usage

Token usage information.

```typescript
interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

**Properties:**

- `prompt_tokens`: Tokens in the prompt
- `completion_tokens`: Tokens in the completion
- `total_tokens`: Total tokens used

## Tools System

### Tool

Tool definition interface.

```typescript
interface Tool {
  type: 'function';
  function: ToolFunction;
}
```

**Properties:**

- `type`: Tool type (always 'function')
- `function`: Function definition

### ToolFunction

Function definition for a tool.

```typescript
interface ToolFunction {
  name: string;
  description: string;
  parameters: JSONSchema;
}
```

**Properties:**

- `name`: Function name
- `description`: Function description
- `parameters`: JSON Schema for parameters

### ToolCall

Tool call made by the assistant.

```typescript
interface ToolCall {
  id: string;
  type: 'function';
  function: ToolCallFunction;
}
```

**Properties:**

- `id`: Unique identifier for the tool call
- `type`: Tool call type (always 'function')
- `function`: Function call details

### ToolCallFunction

Function call details.

```typescript
interface ToolCallFunction {
  name: string;
  arguments: string;
}
```

**Properties:**

- `name`: Function name
- `arguments`: JSON string of function arguments

### tools()

Create a tool from a function.

```typescript
function tools<T extends (...args: any[]) => any>(fn: T): Tool;
```

**Parameters:**

- `fn`: Function to convert to a tool

**Returns:**

- `Tool`: Tool definition

**Example:**

```typescript
const weatherTool = tools(function getWeather(
  city: string,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): string {
  /**
   * Get weather information for a city
   * @param city - The city name
   * @param units - Temperature units
   */
  return `Weather in ${city}: 22°C, sunny`;
});
```

### ToolRegistry

Registry for managing tools.

#### Methods

##### `register()`

Register a tool.

```typescript
register(name: string, tool: Tool, implementation: Function): void
```

**Parameters:**

- `name`: Tool name
- `tool`: Tool definition
- `implementation`: Tool implementation function

##### `get()`

Get a registered tool.

```typescript
get(name: string): RegisteredTool | undefined
```

**Parameters:**

- `name`: Tool name

**Returns:**

- `RegisteredTool | undefined`: Registered tool or undefined if not found

##### `list()`

List all registered tools.

```typescript
list(): RegisteredTool[]
```

**Returns:**

- `RegisteredTool[]`: Array of all registered tools

##### `listToolNames()`

List names of all registered tools.

```typescript
listToolNames(): string[]
```

**Returns:**

- `string[]`: Array of tool names

##### `size()`

Get the number of registered tools.

```typescript
size(): number
```

**Returns:**

- `number`: Number of registered tools

##### `clear()`

Clear all registered tools.

```typescript
clear(): void
```

### Utility Functions

#### `getRegistry()`

Get the global tool registry.

```typescript
function getRegistry(): ToolRegistry;
```

**Returns:**

- `ToolRegistry`: The global tool registry

#### `getTools()`

Get tools by name or get all tools.

```typescript
function getTools(names?: string[]): Tool[];
```

**Parameters:**

- `names` (optional): Array of tool names to retrieve

**Returns:**

- `Tool[]`: Array of tools

#### `clearRegistry()`

Clear the global tool registry.

```typescript
function clearRegistry(): void;
```

## MCP Integration

### MCPClient

Client for Model Context Protocol integration.

#### Constructor

```typescript
new MCPClient(options: MCPClientOptions)
```

**Parameters:**

- `options`: MCP client configuration

#### Methods

##### `connect()`

Connect to the MCP server.

```typescript
async connect(): Promise<void>
```

##### `disconnect()`

Disconnect from the MCP server.

```typescript
async disconnect(): Promise<void>
```

##### `listTools()`

List available tools from the MCP server.

```typescript
async listTools(): Promise<Tool[]>
```

**Returns:**

- `Promise<Tool[]>`: Array of available tools

##### `callTool()`

Call a tool on the MCP server.

```typescript
async callTool(name: string, arguments: Record<string, any>): Promise<any>
```

**Parameters:**

- `name`: Tool name
- `arguments`: Tool arguments

**Returns:**

- `Promise<any>`: Tool result

### MCPClientOptions

Configuration options for MCP client.

```typescript
interface MCPClientOptions {
  transport: MCPTransport;
  timeout?: number;
}
```

**Properties:**

- `transport`: Transport configuration
- `timeout` (optional): Connection timeout in milliseconds

### MCPTransport

Transport configuration for MCP.

```typescript
type MCPTransport = MCPStdioTransport | MCPSSETransport | MCPWebSocketTransport;
```

### MCPStdioTransport

Standard I/O transport for MCP.

```typescript
interface MCPStdioTransport {
  type: 'stdio';
  command: string;
  args?: string[];
  env?: Record<string, string>;
}
```

**Properties:**

- `type`: Transport type ('stdio')
- `command`: Command to execute
- `args` (optional): Command arguments
- `env` (optional): Environment variables

### MCPSSETransport

Server-Sent Events transport for MCP.

```typescript
interface MCPSSETransport {
  type: 'sse';
  url: string;
  headers?: Record<string, string>;
}
```

**Properties:**

- `type`: Transport type ('sse')
- `url`: SSE endpoint URL
- `headers` (optional): HTTP headers

### MCPWebSocketTransport

WebSocket transport for MCP.

```typescript
interface MCPWebSocketTransport {
  type: 'websocket';
  url: string;
  protocols?: string[];
}
```

**Properties:**

- `type`: Transport type ('websocket')
- `url`: WebSocket URL
- `protocols` (optional): WebSocket protocols

## Error Handling

### HelpingAIError

Base error class for all SDK errors.

```typescript
class HelpingAIError extends Error {
  constructor(message: string, cause?: Error);
}
```

**Properties:**

- `message`: Error message
- `cause` (optional): Underlying error cause

### APIError

Error from the HelpingAI API.

```typescript
class APIError extends HelpingAIError {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public response?: any
  )
}
```

**Properties:**

- `status`: HTTP status code
- `code` (optional): API error code
- `response` (optional): Full API response

### AuthenticationError

Authentication-related error.

```typescript
class AuthenticationError extends APIError {
  constructor(message: string);
}
```

### RateLimitError

Rate limiting error.

```typescript
class RateLimitError extends APIError {
  constructor(
    message: string,
    public retryAfter?: number
  )
}
```

**Properties:**

- `retryAfter` (optional): Seconds to wait before retrying

### TimeoutError

Request timeout error.

```typescript
class TimeoutError extends HelpingAIError {
  constructor(message: string);
}
```

### ValidationError

Input validation error.

```typescript
class ValidationError extends HelpingAIError {
  constructor(
    message: string,
    public field?: string
  )
}
```

**
Properties:**

- `field` (optional): Field that failed validation

## Configuration Options

### Default Configuration

The SDK uses the following default configuration:

```typescript
const defaultConfig = {
  baseURL: 'https://api.helpingai.com/v1',
  timeout: 30000,
  maxRetries: 3,
  defaultHeaders: {
    'User-Agent': 'helpingai/1.0.0',
    'Content-Type': 'application/json',
  },
};
```

### Environment Variables

The SDK recognizes the following environment variables:

- `HELPINGAI_API_KEY`: Default API key
- `HELPINGAI_BASE_URL`: Default base URL
- `HELPINGAI_TIMEOUT`: Default timeout in milliseconds
- `HELPINGAI_MAX_RETRIES`: Default maximum retry attempts

### Custom Configuration

You can override defaults when creating a client:

```typescript
const client = new HelpingAI({
  apiKey: 'your-api-key',
  baseURL: 'https://custom-endpoint.com/v1',
  timeout: 60000,
  maxRetries: 5,
  defaultHeaders: {
    'Custom-Header': 'value',
  },
});
```

## Utilities

### Type Guards

#### `isStreamingResponse()`

Check if a response is a streaming response.

```typescript
function isStreamingResponse(response: any): response is AsyncIterable<ChatCompletionChunk>;
```

**Parameters:**

- `response`: Response to check

**Returns:**

- `boolean`: True if response is streaming

**Example:**

```typescript
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true,
});

if (isStreamingResponse(response)) {
  for await (const chunk of response) {
    console.log(chunk.choices[0].delta.content);
  }
}
```

#### `isToolCall()`

Check if a message contains tool calls.

```typescript
function isToolCall(message: ChatMessage): message is ChatMessage & { tool_calls: ToolCall[] };
```

**Parameters:**

- `message`: Message to check

**Returns:**

- `boolean`: True if message contains tool calls

### Helper Functions

#### `extractContent()`

Extract content from a chat completion response.

```typescript
function extractContent(response: ChatCompletionResponse): string;
```

**Parameters:**

- `response`: Chat completion response

**Returns:**

- `string`: Extracted content

**Example:**

```typescript
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Hello' }],
});

const content = extractContent(response);
console.log(content);
```

#### `streamToString()`

Convert a streaming response to a complete string.

```typescript
async function streamToString(stream: AsyncIterable<ChatCompletionChunk>): Promise<string>;
```

**Parameters:**

- `stream`: Streaming response

**Returns:**

- `Promise<string>`: Complete response content

**Example:**

```typescript
const stream = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true,
});

const fullContent = await streamToString(stream);
console.log(fullContent);
```

#### `validateApiKey()`

Validate an API key format.

```typescript
function validateApiKey(apiKey: string): boolean;
```

**Parameters:**

- `apiKey`: API key to validate

**Returns:**

- `boolean`: True if API key format is valid

#### `formatError()`

Format an error for display.

```typescript
function formatError(error: Error): string;
```

**Parameters:**

- `error`: Error to format

**Returns:**

- `string`: Formatted error message

## Advanced Usage

### Custom HTTP Client

You can provide a custom HTTP client implementation:

```typescript
interface HTTPClient {
  request(config: RequestConfig): Promise<Response>;
}

const customClient = new HelpingAI({
  apiKey: 'your-api-key',
  httpClient: myCustomHttpClient,
});
```

### Request Interceptors

Add request interceptors for logging, authentication, etc.:

```typescript
const client = new HelpingAI({
  apiKey: 'your-api-key',
  requestInterceptor: config => {
    console.log('Making request:', config);
    return config;
  },
});
```

### Response Interceptors

Add response interceptors for processing responses:

```typescript
const client = new HelpingAI({
  apiKey: 'your-api-key',
  responseInterceptor: response => {
    console.log('Received response:', response);
    return response;
  },
});
```

### Custom Retry Logic

Implement custom retry logic:

```typescript
const client = new HelpingAI({
  apiKey: 'your-api-key',
  retryConfig: {
    maxRetries: 5,
    retryDelay: attempt => Math.pow(2, attempt) * 1000,
    retryCondition: error => {
      return error instanceof RateLimitError || error instanceof TimeoutError;
    },
  },
});
```

## Performance Considerations

### Connection Pooling

The SDK automatically manages HTTP connections for optimal performance:

```typescript
// Reuse the same client instance for multiple requests
const client = new HelpingAI({ apiKey: 'your-api-key' });

// Multiple requests will reuse connections
const response1 = await client.chat.completions.create({...});
const response2 = await client.chat.completions.create({...});
```

### Memory Management

For long-running applications, properly clean up resources:

```typescript
const client = new HelpingAI({ apiKey: 'your-api-key' });

try {
  // Use the client
  const response = await client.chat.completions.create({...});
} finally {
  // Clean up resources
  await client.cleanup();
}
```

### Streaming Best Practices

When using streaming, handle backpressure appropriately:

```typescript
const stream = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Long response' }],
  stream: true,
});

const chunks: string[] = [];
for await (const chunk of stream) {
  if (chunk.choices[0].delta.content) {
    chunks.push(chunk.choices[0].delta.content);

    // Process chunks in batches to avoid memory issues
    if (chunks.length >= 100) {
      await processChunks(chunks);
      chunks.length = 0;
    }
  }
}

// Process remaining chunks
if (chunks.length > 0) {
  await processChunks(chunks);
}
```

## Browser Compatibility

### Polyfills

For older browsers, you may need polyfills:

```html
<!-- For fetch API -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=fetch"></script>

<!-- For async/await -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es2017"></script>
```

### CORS Configuration

When using in browsers, ensure your server has proper CORS headers:

```javascript
// Server-side CORS configuration
app.use(
  cors({
    origin: 'https://your-domain.com',
    credentials: true,
  })
);
```

### Security Considerations

Never expose API keys in client-side code:

```typescript
// ❌ Bad - API key exposed in browser
const client = new HelpingAI({
  apiKey: 'sk-your-secret-key',
});

// ✅ Good - Use a proxy endpoint
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' }),
});
```

## Testing

### Mocking the Client

For testing, you can mock the HelpingAI client:

```typescript
import { HelpingAI } from 'helpingai';

// Mock the client
jest.mock('helpingai');
const mockClient = HelpingAI as jest.MockedClass<typeof HelpingAI>;

// Setup mock responses
mockClient.prototype.chat.completions.create.mockResolvedValue({
  choices: [{ message: { content: 'Mocked response' } }],
});
```

### Test Utilities

The SDK provides test utilities:

```typescript
import { createMockClient, createMockResponse } from 'helpingai/testing';

const mockClient = createMockClient();
const mockResponse = createMockResponse({
  content: 'Test response',
});

mockClient.chat.completions.create.mockResolvedValue(mockResponse);
```

## Migration Guide

### From v0.x to v1.x

Key changes in v1.x:

1. **Constructor changes:**

   ```typescript
   // v0.x
   const client = new HelpingAI('api-key');

   // v1.x
   const client = new HelpingAI({ apiKey: 'api-key' });
   ```

2. **Tool system changes:**

   ```typescript
   // v0.x
   @tool
   function myTool() { ... }

   // v1.x
   const myTool = tools(function myTool() { ... });
   ```

3. **Error handling changes:**

   ```typescript
   // v0.x
   catch (error) {
     if (error.code === 'rate_limit') { ... }
   }

   // v1.x
   catch (error) {
     if (error instanceof RateLimitError) { ... }
   }
   ```

## Examples

### Complete Chat Application

```typescript
import { HelpingAI, tools } from 'helpingai';

// Define tools
const weatherTool = tools(function getWeather(city: string): string {
  return `Weather in ${city}: 22°C, sunny`;
});

const calculatorTool = tools(function calculate(expression: string): number {
  return eval(expression); // Use a proper math parser in production
});

// Create client
const client = new HelpingAI({
  apiKey: process.env.HELPINGAI_API_KEY,
  timeout: 30000,
});

// Chat function
async function chat(message: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
      tools: [weatherTool, calculatorTool],
      tool_choice: 'auto',
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Chat error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

// Usage
chat("What's the weather in Paris and what's 15 * 23?").then(console.log).catch(console.error);
```

### Streaming Chat with Progress

```typescript
async function streamingChat(message: string): Promise<void> {
  const stream = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [{ role: 'user', content: message }],
    stream: true,
    max_tokens: 500,
  });

  let content = '';
  let tokenCount = 0;
  const startTime = Date.now();

  console.log('🤖 Assistant: ');

  for await (const chunk of stream) {
    if (chunk.choices[0].delta.content) {
      const deltaContent = chunk.choices[0].delta.content;
      content += deltaContent;
      tokenCount++;

      // Stream to console
      process.stdout.write(deltaContent);
    }

    if (chunk.choices[0].finish_reason) {
      const duration = Date.now() - startTime;
      console.log(`\n\n📊 Stats: ${tokenCount} tokens in ${duration}ms`);
      break;
    }
  }
}
```

This completes the comprehensive API documentation for the HelpingAI JavaScript SDK. The documentation covers all major components, types, and usage patterns with practical examples.

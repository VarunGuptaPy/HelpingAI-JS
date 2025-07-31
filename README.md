# HelpingAI JavaScript SDK

[![npm version](https://badge.fury.io/js/helpingai-js.svg)](https://badge.fury.io/js/helpingai-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official JavaScript/TypeScript SDK for HelpingAI - an advanced emotional AI platform that provides empathetic and contextually aware responses.

## 🚀 Quick Start

### Installation

```bash
npm install helpingai-js
# or
yarn add helpingai-js
# or
pnpm add helpingai-js
```

### Basic Usage

```typescript
import { HelpingAI } from 'helpingai-js';

const client = new HelpingAI({
  apiKey: 'your-api-key-here'
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [
      { role: 'user', content: 'Hello! How are you today?' }
    ]
  });

  console.log(response.choices[0].message.content);
}

main().catch(console.error);
```

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Authentication](#-authentication)
- [Core Concepts](#-core-concepts)
- [Examples](#-examples)
- [API Reference](#-api-reference)
- [Tools System](#-tools-system)
- [MCP Integration](#-mcp-integration)
- [Streaming](#-streaming)
- [Error Handling](#-error-handling)
- [TypeScript Support](#-typescript-support)
- [Migration from Python](#-migration-from-python)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **🤖 Advanced AI Models**: Access to HelpingAI's emotional AI models including Dhanishtha-2.0
- **🛠️ Tool Calling**: Built-in and custom tool support with type safety
- **🔄 Streaming**: Real-time response streaming for better user experience
- **🔌 MCP Integration**: Model Context Protocol support for external integrations
- **📝 TypeScript First**: Full TypeScript support with comprehensive type definitions
- **🌐 Cross-Platform**: Works in Node.js, browsers, and edge environments
- **⚡ Performance**: Optimized for speed with connection pooling and caching
- **🛡️ Error Handling**: Comprehensive error handling with retry mechanisms
- **📚 Rich Examples**: Extensive examples and documentation

## 🔧 Installation

### Prerequisites

- Node.js 16+ or modern browser environment
- TypeScript 4.5+ (for TypeScript projects)

### Package Manager Installation

```bash
# npm
npm install helpingai-js

# yarn
yarn add helpingai-js

# pnpm
pnpm add helpingai-js

# bun
bun add helpingai-js
```

### CDN Usage (Browser)

```html
<!-- ES Modules -->
<script type="module">
  import { HelpingAI } from 'https://cdn.skypack.dev/helpingai-js';
</script>

<!-- UMD -->
<script src="https://unpkg.com/helpingai-js/dist/helpingai.umd.js"></script>
```

## 🔐 Authentication

### API Key Setup

Get your API key from the [HelpingAI Dashboard](https://dashboard.helpingai.com) and set it up:

```typescript
// Method 1: Direct initialization
const client = new HelpingAI({
  apiKey: 'your-api-key-here'
});

// Method 2: Environment variable (Node.js)
// Set HELPINGAI_API_KEY in your environment
const client = new HelpingAI(); // Automatically reads from env

// Method 3: Configuration object
const client = new HelpingAI({
  apiKey: process.env.HELPINGAI_API_KEY,
  baseURL: 'https://api.helpingai.com/v1', // Optional custom endpoint
  timeout: 30000, // Optional timeout in milliseconds
  maxRetries: 3 // Optional retry configuration
});
```

### Environment Variables

Create a `.env` file in your project root:

```env
HELPINGAI_API_KEY=your-api-key-here
HELPINGAI_BASE_URL=https://api.helpingai.com/v1  # Optional
```

## 🧠 Core Concepts

### Client Initialization

```typescript
import { HelpingAI } from 'helpingai-js';

const client = new HelpingAI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.helpingai.com/v1', // Optional
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  defaultHeaders: {
    'User-Agent': 'MyApp/1.0'
  }
});
```

### Chat Completions

```typescript
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing' }
  ],
  max_tokens: 1000,
  temperature: 0.7
});
```

### Streaming Responses

```typescript
const stream = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true
});

for await (const chunk of stream) {
  if (chunk.choices[0].delta.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}
```

## 📚 Examples

### Basic Chat

```typescript
import { HelpingAI } from 'helpingai-js';

async function basicChat() {
  const client = new HelpingAI({ apiKey: 'your-api-key' });
  
  const response = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [
      { role: 'user', content: 'What is emotional intelligence?' }
    ]
  });
  
  console.log(response.choices[0].message.content);
}
```

### Tool Calling

```typescript
import { HelpingAI, tools } from 'helpingai-js';

// Define a custom tool
const weatherTool = tools(function getWeather(city: string): string {
  /**
   * Get weather information for a city
   * @param city - The city name
   */
  return `Weather in ${city}: 22°C, sunny`;
});

async function toolExample() {
  const client = new HelpingAI({ apiKey: 'your-api-key' });
  
  const response = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [
      { role: 'user', content: 'What\'s the weather in Paris?' }
    ],
    tools: [weatherTool]
  });
  
  console.log(response.choices[0].message.content);
}
```

### Streaming with Progress

```typescript
async function streamingExample() {
  const client = new HelpingAI({ apiKey: 'your-api-key' });
  
  const stream = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [
      { role: 'user', content: 'Write a poem about AI' }
    ],
    stream: true
  });

  let content = '';
  for await (const chunk of stream) {
    if (chunk.choices[0].delta.content) {
      content += chunk.choices[0].delta.content;
      process.stdout.write(chunk.choices[0].delta.content);
    }
    
    if (chunk.choices[0].finish_reason) {
      console.log('\n\nStream completed!');
      break;
    }
  }
}
```

## 🔧 API Reference

### HelpingAI Client

#### Constructor Options

```typescript
interface HelpingAIOptions {
  apiKey?: string;           // API key (required)
  baseURL?: string;          // Base API URL
  timeout?: number;          // Request timeout in ms
  maxRetries?: number;       // Max retry attempts
  defaultHeaders?: Record<string, string>; // Default headers
}
```

#### Methods

- `chat.completions.create(options)` - Create chat completion
- `call(toolName, parameters)` - Execute tool directly
- `cleanup()` - Clean up resources

### Chat Completion Options

```typescript
interface ChatCompletionRequest {
  model: string;                    // Model name
  messages: ChatMessage[];          // Conversation messages
  max_tokens?: number;              // Maximum tokens to generate
  temperature?: number;             // Randomness (0-2)
  top_p?: number;                   // Nucleus sampling
  stream?: boolean;                 // Enable streaming
  tools?: Tool[];                   // Available tools
  tool_choice?: 'auto' | 'none' | string; // Tool selection
  stop?: string | string[];         // Stop sequences
}
```

### Message Types

```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;        // For tool messages
  tool_calls?: ToolCall[]; // For assistant messages with tools
}
```

## 🛠️ Tools System

### Creating Custom Tools

```typescript
import { tools } from 'helpingai-js';

// Simple tool
const calculator = tools(function add(a: number, b: number): number {
  /**
   * Add two numbers together
   * @param a - First number
   * @param b - Second number
   */
  return a + b;
});

// Complex tool with validation
const userManager = tools(function createUser(
  name: string,
  email: string,
  age?: number
): { id: string; name: string; email: string; age?: number } {
  /**
   * Create a new user account
   * @param name - User's full name
   * @param email - User's email address
   * @param age - User's age (optional)
   */
  if (!name || !email) {
    throw new Error('Name and email are required');
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    age
  };
});
```

### Tool Registry Management

```typescript
import { getRegistry, getTools, clearRegistry } from 'helpingai-js';

// Get the tool registry
const registry = getRegistry();

// List all registered tools
console.log('Registered tools:', registry.listToolNames());

// Get specific tools
const myTools = getTools(['add', 'createUser']);

// Clear all tools (useful for testing)
clearRegistry();
```

### Built-in Tools

HelpingAI provides several built-in tools:

- `code_interpreter` - Execute code safely
- `web_search` - Search the web for information
- `file_reader` - Read and analyze files
- `image_analyzer` - Analyze images and visual content

```typescript
// Using built-in tools
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [
    { role: 'user', content: 'Search for recent AI developments' }
  ],
  tools: ['web_search']
});
```

## 🔌 MCP Integration

Model Context Protocol (MCP) allows integration with external services:

```typescript
import { HelpingAI, MCPClient } from 'helpingai-js';

async function mcpExample() {
  const client = new HelpingAI({ apiKey: 'your-api-key' });
  
  // Connect to MCP server
  const mcpClient = new MCPClient({
    transport: {
      type: 'stdio',
      command: 'node',
      args: ['path/to/mcp-server.js']
    }
  });
  
  await mcpClient.connect();
  
  // Use MCP tools in chat
  const response = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [
      { role: 'user', content: 'Get my calendar events for today' }
    ],
    mcp: mcpClient
  });
  
  await mcpClient.disconnect();
}
```

## 📡 Streaming

### Basic Streaming

```typescript
const stream = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Tell me about space' }],
  stream: true
});

for await (const chunk of stream) {
  if (chunk.choices[0].delta.content) {
    console.log(chunk.choices[0].delta.content);
  }
}
```

### Advanced Streaming with Event Handling

```typescript
async function advancedStreaming() {
  const stream = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [{ role: 'user', content: 'Explain machine learning' }],
    stream: true
  });

  let fullContent = '';
  let tokenCount = 0;
  const startTime = Date.now();

  try {
    for await (const chunk of stream) {
      if (chunk.choices[0].delta.content) {
        const content = chunk.choices[0].delta.content;
        fullContent += content;
        tokenCount++;
        
        // Real-time processing
        process.stdout.write(content);
      }
      
      if (chunk.choices[0].finish_reason) {
        const duration = Date.now() - startTime;
        console.log(`\n\nCompleted in ${duration}ms`);
        console.log(`Tokens: ${tokenCount}`);
        break;
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
  }
}
```

## ⚠️ Error Handling

### Error Types

```typescript
import { 
  HelpingAIError, 
  APIError, 
  AuthenticationError, 
  RateLimitError,
  TimeoutError 
} from 'helpingai-js';

try {
  const response = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [{ role: 'user', content: 'Hello' }]
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof APIError) {
    console.error('API error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Retry Configuration


```typescript
const client = new HelpingAI({
  apiKey: 'your-api-key',
  maxRetries: 3,
  timeout: 30000
});

// Custom retry logic
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Graceful Error Handling

```typescript
async function robustChat(message: string) {
  const client = new HelpingAI({ apiKey: 'your-api-key' });
  
  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: message }]
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    if (error instanceof RateLimitError) {
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, 60000));
      return robustChat(message);
    } else if (error instanceof AuthenticationError) {
      throw new Error('Please check your API key');
    } else {
      // Fallback response
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }
}
```

## 📘 TypeScript Support

### Full Type Safety

```typescript
import { HelpingAI, ChatCompletionResponse, Tool } from 'helpingai-js';

// Strongly typed client
const client: HelpingAI = new HelpingAI({ apiKey: 'your-api-key' });

// Typed responses
const response: ChatCompletionResponse = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Hello' }]
});

// Type-safe tool definitions
const typedTool: Tool = tools(function processData(
  data: { id: number; name: string }[]
): { processed: number; items: string[] } {
  return {
    processed: data.length,
    items: data.map(item => item.name)
  };
});
```

### Custom Type Extensions

```typescript
// Extend the SDK types for your use case
interface CustomChatMessage extends ChatMessage {
  timestamp?: Date;
  userId?: string;
}

interface CustomCompletionRequest extends ChatCompletionRequest {
  customMetadata?: Record<string, any>;
}
```

## 🔄 Migration from Python

### Key Differences

| Python | JavaScript/TypeScript |
|--------|----------------------|
| `from helpingai import HelpingAI` | `import { HelpingAI } from 'helpingai-js'` |
| `@tools` decorator | `tools()` function wrapper |
| `client.chat.completions.create()` | Same API |
| Snake case (`max_tokens`) | Same (maintains API compatibility) |
| `async for chunk in stream:` | `for await (const chunk of stream)` |

### Python to JavaScript Examples

**Python:**
```python
from helpingai import HelpingAI, tools

@tools
def get_weather(city: str) -> str:
    """Get weather for a city"""
    return f"Weather in {city}: sunny"

client = HelpingAI(api_key="your-key")
response = client.chat.completions.create(
    model="Dhanishtha-2.0-preview",
    messages=[{"role": "user", "content": "Weather in Paris?"}],
    tools=[get_weather]
)
```

**JavaScript:**
```typescript
import { HelpingAI, tools } from 'helpingai-js';

const getWeather = tools(function getWeather(city: string): string {
  /**
   * Get weather for a city
   */
  return `Weather in ${city}: sunny`;
});

const client = new HelpingAI({ apiKey: 'your-key' });
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Weather in Paris?' }],
  tools: [getWeather]
});
```

## 🏗️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/helpingai/helpingai-js.git
cd helpingai-js

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run examples
npm run example:basic
npm run example:streaming
npm run example:tools
```

### Project Structure

```
HelpingAI-js/
├── src/
│   ├── index.ts          # Main exports
│   ├── client.ts         # HelpingAI client
│   ├── types.ts          # Type definitions
│   ├── errors.ts         # Error classes
│   ├── tools/            # Tools system
│   └── mcp/              # MCP integration
├── examples/             # Usage examples
├── docs/                 # Documentation
├── tests/                # Test files
└── dist/                 # Built files
```

### Available Scripts

```json
{
  "scripts": {
    "build": "npm run build:cjs && npm run build:esm && npm run build:types",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:esm": "tsc -p tsconfig.esm.json", 
    "build:types": "tsc -p tsconfig.types.json",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "example:basic": "tsx examples/basic-usage.ts",
    "example:streaming": "tsx examples/streaming.ts",
    "example:tools": "tsx examples/tool-calling.ts",
    "example:mcp": "tsx examples/mcp-integration.ts",
    "example:advanced": "tsx examples/advanced-features.ts"
  }
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- client.test.ts

# Watch mode
npm run test:watch
```

### Example Test

```typescript
import { HelpingAI, tools } from '../src';

describe('HelpingAI Client', () => {
  let client: HelpingAI;

  beforeEach(() => {
    client = new HelpingAI({ apiKey: 'test-key' });
  });

  afterEach(async () => {
    await client.cleanup();
  });

  test('should create chat completion', async () => {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: 'Hello' }]
    });

    expect(response.choices).toHaveLength(1);
    expect(response.choices[0].message.content).toBeDefined();
  });

  test('should handle tool calling', async () => {
    const testTool = tools(function testFunction(input: string): string {
      return `Processed: ${input}`;
    });

    const result = await client.call('testFunction', { input: 'test' });
    expect(result).toBe('Processed: test');
  });
});
```

## 🌐 Browser Support

### Modern Browsers

The SDK works in all modern browsers with ES2018+ support:

- Chrome 63+
- Firefox 58+
- Safari 12+
- Edge 79+

### Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>HelpingAI Browser Example</title>
</head>
<body>
    <script type="module">
        import { HelpingAI } from 'https://cdn.skypack.dev/helpingai-js';
        
        const client = new HelpingAI({
            apiKey: 'your-api-key-here'
        });
        
        async function chat() {
            const response = await client.chat.completions.create({
                model: 'Dhanishtha-2.0-preview',
                messages: [
                    { role: 'user', content: 'Hello from the browser!' }
                ]
            });
            
            document.body.innerHTML = response.choices[0].message.content;
        }
        
        chat().catch(console.error);
    </script>
</body>
</html>
```

## 🔒 Security

### API Key Security

- Never expose API keys in client-side code
- Use environment variables in server environments
- Implement proper key rotation policies
- Monitor API usage for anomalies

### Best Practices

```typescript
// ✅ Good - Server-side usage
const client = new HelpingAI({
  apiKey: process.env.HELPINGAI_API_KEY
});

// ❌ Bad - Client-side exposure
const client = new HelpingAI({
  apiKey: 'sk-...' // Never hardcode keys
});

// ✅ Good - Proxy pattern for browsers
// Create a server endpoint that proxies requests
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello' })
});
```

## 📊 Performance

### Optimization Tips

1. **Connection Reuse**: Keep client instances alive
2. **Streaming**: Use streaming for long responses
3. **Caching**: Cache tool results when appropriate
4. **Batching**: Combine multiple operations
5. **Timeouts**: Set appropriate timeout values

### Performance Monitoring

```typescript
const client = new HelpingAI({
  apiKey: 'your-api-key',
  timeout: 30000,
  maxRetries: 3
});

// Monitor response times
const startTime = Date.now();
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Hello' }]
});
const duration = Date.now() - startTime;

console.log(`Response time: ${duration}ms`);
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/helpingai-js.git
cd helpingai-js

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and test
npm test
npm run lint

# Commit and push
git commit -m "Add your feature"
git push origin feature/your-feature-name
```

### Code Style

- Use TypeScript for all new code
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.helpingai.com](https://docs.helpingai.com)
- **API Reference**: [api.helpingai.com](https://api.helpingai.com)
- **GitHub Issues**: [Report bugs or request features](https://github.com/helpingai/helpingai-js/issues)
- **Discord**: [Join our community](https://discord.gg/helpingai)
- **Email**: support@helpingai.com

## 🚀 What's Next?

- Explore the [examples](./examples/) directory
- Read the [API documentation](./docs/api.md)
- Check out the [migration guide](./docs/migration-from-python.md)
- Join our [Discord community](https://discord.gg/helpingai)

---

Made with ❤️ by the HelpingAI team

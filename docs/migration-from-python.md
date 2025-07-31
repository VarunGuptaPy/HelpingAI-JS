# Migration Guide: Python to JavaScript/TypeScript

This guide helps you migrate from the HelpingAI Python SDK to the JavaScript/TypeScript SDK. While both SDKs maintain API compatibility where possible, there are important differences in syntax, patterns, and best practices.

## Table of Contents

- [Quick Reference](#quick-reference)
- [Installation & Setup](#installation--setup)
- [Client Initialization](#client-initialization)
- [Basic Chat Completions](#basic-chat-completions)
- [Streaming Responses](#streaming-responses)
- [Tool System](#tool-system)
- [MCP Integration](#mcp-integration)
- [Error Handling](#error-handling)
- [Async/Await Patterns](#asyncawait-patterns)
- [Type Safety](#type-safety)
- [Environment Variables](#environment-variables)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)

## Quick Reference

| Feature | Python | JavaScript/TypeScript |
|---------|--------|----------------------|
| **Import** | `from helpingai import HelpingAI` | `import { HelpingAI } from 'helpingai-js'` |
| **Client Init** | `HelpingAI(api_key="key")` | `new HelpingAI({ apiKey: 'key' })` |
| **Tool Decorator** | `@tools` | `tools(function ...)` |
| **Async Iteration** | `async for chunk in stream:` | `for await (const chunk of stream)` |
| **Error Types** | `except RateLimitError:` | `if (error instanceof RateLimitError)` |
| **Type Hints** | `def func(x: str) -> str:` | `function func(x: string): string` |

## Installation & Setup

### Python
```bash
pip install helpingai
```

```python
from helpingai import HelpingAI
```

### JavaScript/TypeScript
```bash
npm install helpingai-js
# or
yarn add helpingai-js
```

```typescript
import { HelpingAI } from 'helpingai-js';
```

## Client Initialization

### Python
```python
# Basic initialization
client = HelpingAI(api_key="your-api-key")

# With options
client = HelpingAI(
    api_key="your-api-key",
    base_url="https://api.helpingai.com/v1",
    timeout=30.0,
    max_retries=3
)
```

### JavaScript/TypeScript
```typescript
// Basic initialization
const client = new HelpingAI({ apiKey: 'your-api-key' });

// With options
const client = new HelpingAI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.helpingai.com/v1',
  timeout: 30000,
  maxRetries: 3
});
```

**Key Differences:**
- JavaScript uses `new` keyword for instantiation
- Options are passed as an object with camelCase properties
- Timeout is in milliseconds (not seconds)

## Basic Chat Completions

### Python
```python
response = client.chat.completions.create(
    model="Dhanishtha-2.0-preview",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ],
    max_tokens=100,
    temperature=0.7
)

print(response.choices[0].message.content)
```

### JavaScript/TypeScript
```typescript
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
  max_tokens: 100,
  temperature: 0.7
});

console.log(response.choices[0].message.content);
```

**Key Differences:**
- JavaScript requires `await` keyword for async operations
- Object properties use camelCase in JavaScript
- String literals use single quotes by convention in JavaScript

## Streaming Responses

### Python
```python
stream = client.chat.completions.create(
    model="Dhanishtha-2.0-preview",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### JavaScript/TypeScript
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

**Key Differences:**
- JavaScript uses `for await...of` instead of `for...in`
- Use `process.stdout.write()` instead of `print(..., end="")`

## Tool System

### Python
```python
from helpingai import HelpingAI, tools

@tools
def get_weather(city: str, units: str = "celsius") -> str:
    """Get weather information for a city.
    
    Args:
        city: The city name
        units: Temperature units (celsius or fahrenheit)
    """
    return f"Weather in {city}: 22°C, sunny"

@tools
def calculate(expression: str) -> float:
    """Perform mathematical calculations.
    
    Args:
        expression: Mathematical expression to evaluate
    """
    return eval(expression)  # Use proper math parser in production

# Usage
client = HelpingAI(api_key="your-key")
response = client.chat.completions.create(
    model="Dhanishtha-2.0-preview",
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
    tools=[get_weather, calculate]
)
```

### JavaScript/TypeScript
```typescript
import { HelpingAI, tools } from 'helpingai-js';

const getWeather = tools(function getWeather(
  city: string, 
  units: 'celsius' | 'fahrenheit' = 'celsius'
): string {
  /**
   * Get weather information for a city.
   * @param city - The city name
   * @param units - Temperature units (celsius or fahrenheit)
   */
  return `Weather in ${city}: 22°C, sunny`;
});

const calculate = tools(function calculate(expression: string): number {
  /**
   * Perform mathematical calculations.
   * @param expression - Mathematical expression to evaluate
   */
  return eval(expression); // Use proper math parser in production
});

// Usage
const client = new HelpingAI({ apiKey: 'your-key' });
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'What\'s the weather in Paris?' }],
  tools: [getWeather, calculate]
});
```

**Key Differences:**
- JavaScript uses `tools(function ...)` wrapper instead of `@tools` decorator
- JSDoc comments (`/** */`) instead of Python docstrings
- TypeScript provides better type safety with union types (`'celsius' | 'fahrenheit'`)
- Function parameters and return types are explicitly typed

## MCP Integration

### Python
```python
from helpingai import HelpingAI, MCPClient

# Connect to MCP server
mcp_client = MCPClient(
    transport={
        "type": "stdio",
        "command": "node",
        "args": ["path/to/mcp-server.js"]
    }
)
await mcp_client.connect()

# Use with HelpingAI
client = HelpingAI(api_key="your-key")
response = client.chat.completions.create(
    model="Dhanishtha-2.0-preview",
    messages=[{"role": "user", "content": "Get my calendar"}],
    mcp=mcp_client
)

await mcp_client.disconnect()
```

### JavaScript/TypeScript
```typescript
import { HelpingAI, MCPClient } from 'helpingai-js';

// Connect to MCP server
const mcpClient = new MCPClient({
  transport: {
    type: 'stdio',
    command: 'node',
    args: ['path/to/mcp-server.js']
  }
});
await mcpClient.connect();

// Use with HelpingAI
const client = new HelpingAI({ apiKey: 'your-key' });
const response = await client.chat.completions.create({
  model: 'Dhanishtha-2.0-preview',
  messages: [{ role: 'user', content: 'Get my calendar' }],
  mcp: mcpClient
});

await mcpClient.disconnect();
```

**Key Differences:**
- JavaScript uses `new MCPClient()` constructor
- Configuration object uses camelCase properties
- Same async/await patterns apply

## Error Handling

### Python
```python
from helpingai import (
    HelpingAI, 
    APIError, 
    AuthenticationError, 
    RateLimitError,
    TimeoutError
)

try:
    response = client.chat.completions.create(
        model="Dhanishtha-2.0-preview",
        messages=[{"role": "user", "content": "Hello"}]
    )
except AuthenticationError:
    print("Invalid API key")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after} seconds")
except TimeoutError:
    print("Request timed out")
except APIError as e:
    print(f"API error: {e.message}")
```

### JavaScript/TypeScript
```typescript
import { 
  HelpingAI, 
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
    console.log('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof TimeoutError) {
    console.log('Request timed out');
  } else if (error instanceof APIError) {
    console.log(`API error: ${error.message}`);
  }
}
```

**Key Differences:**
- JavaScript uses `instanceof` instead of exception type matching
- Single `catch` block with conditional logic
- Property access uses camelCase (`retryAfter` vs `retry_after`)

## Async/Await Patterns

### Python
```python
import asyncio

async def main():
    client = HelpingAI(api_key="your-key")
    
    # Sequential requests
    response1 = await client.chat.completions.create(...)
    response2 = await client.chat.completions.create(...)
    
    # Concurrent requests
    responses = await asyncio.gather(
        client.chat.completions.create(...),
        client.chat.completions.create(...),
        client.chat.completions.create(...)
    )

if __name__ == "__main__":
    asyncio.run(main())
```

### JavaScript/TypeScript
```typescript
async function main() {
  const client = new HelpingAI({ apiKey: 'your-key' });
  
  // Sequential requests
  const response1 = await client.chat.completions.create({...});
  const response2 = await client.chat.completions.create({...});
  
  // Concurrent requests
  const responses = await Promise.all([
    client.chat.completions.create({...}),
    client.chat.completions.create({...}),
    client.chat.completions.create({...})
  ]);
}

main().catch(console.error);
```

**Key Differences:**
- JavaScript uses `Promise.all()` instead of `asyncio.gather()`
- No need for `asyncio.run()` - just call the async function
- Error handling with `.catch()` is common in JavaScript

## Type Safety

### Python (with type hints)
```python
from typing import List, Optional, Union
from helpingai import HelpingAI, ChatMessage

def create_messages(content: str, system_prompt: Optional[str] = None) -> List[ChatMessage]:
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": content})
    return messages

client: HelpingAI = HelpingAI(api_key="your-key")
```

### TypeScript
```typescript
import { HelpingAI, ChatMessage } from 'helpingai-js';

function createMessages(content: string, systemPrompt?: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: content });
  return messages;
}

const client: HelpingAI = new HelpingAI({ apiKey: 'your-key' });
```

**Key Differences:**
- TypeScript has built-in type checking (no separate `typing` import needed)
- Optional parameters use `?` syntax instead of `Optional[]`
- Array types use `Type[]` syntax instead of `List[Type]`

## Environment Variables

### Python
```python
import os
from helpingai import HelpingAI

# Reading environment variables
api_key = os.getenv("HELPINGAI_API_KEY")
base_url = os.getenv("HELPINGAI_BASE_URL", "https://api.helpingai.com/v1")

client = HelpingAI(
    api_key=api_key,
    base_url=base_url
)
```

### JavaScript/TypeScript
```typescript
import { HelpingAI } from 'helpingai-js';

// Reading environment variables (Node.js)
const apiKey = process.env.HELPINGAI_API_KEY;
const baseURL = process.env.HELPINGAI_BASE_URL || 'https://api.helpingai.com/v1';

const client = new HelpingAI({
  apiKey,
  baseURL
});

// For browser environments, use build-time environment variables
// or fetch from your backend API
```

**Key Differences:**
- Node.js uses `process.env` instead of `os.getenv()`
- Browser environments can't access environment variables directly
- Use logical OR (`||`) for default values instead of second parameter

## Best Practices

### Python Best Practices
```python
import asyncio
from contextlib import asynccontextmanager
from helpingai import HelpingAI

@asynccontextmanager
async def helpingai_client():
    client = HelpingAI(api_key="your-key")
    try:
        yield client
    finally:
        await client.cleanup()

async def main():
    async with helpingai_client() as client:
        response = await client.chat.completions.create(...)
```

### JavaScript/
TypeScript Best Practices
```typescript
import { HelpingAI } from 'helpingai-js';

// Resource management with try/finally
async function withClient<T>(fn: (client: HelpingAI) => Promise<T>): Promise<T> {
  const client = new HelpingAI({ apiKey: 'your-key' });
  try {
    return await fn(client);
  } finally {
    await client.cleanup();
  }
}

async function main() {
  const result = await withClient(async (client) => {
    return await client.chat.completions.create({...});
  });
}
```

**Key Differences:**
- JavaScript doesn't have context managers, use try/finally blocks
- Create utility functions for resource management
- TypeScript generics provide type safety for utility functions

## Common Pitfalls

### 1. Forgetting `await`

**Python:**
```python
# This works in Python
response = client.chat.completions.create(...)
```

**JavaScript (Wrong):**
```typescript
// This returns a Promise, not the actual response!
const response = client.chat.completions.create({...});
```

**JavaScript (Correct):**
```typescript
// Always use await with async operations
const response = await client.chat.completions.create({...});
```

### 2. Snake Case vs Camel Case

**Python:**
```python
response = client.chat.completions.create(
    max_tokens=100,
    tool_choice="auto"
)
```

**JavaScript (Wrong):**
```typescript
const response = await client.chat.completions.create({
  max_tokens: 100,  // Wrong: should be camelCase
  tool_choice: 'auto'  // Wrong: should be camelCase
});
```

**JavaScript (Correct):**
```typescript
const response = await client.chat.completions.create({
  max_tokens: 100,     // API maintains snake_case for compatibility
  tool_choice: 'auto'  // API maintains snake_case for compatibility
});
```

**Note:** The HelpingAI API maintains snake_case for request parameters to ensure compatibility between SDKs.

### 3. Error Handling Patterns

**Python:**
```python
try:
    response = client.chat.completions.create(...)
except RateLimitError:
    # Handle rate limit
    pass
except APIError:
    # Handle other API errors
    pass
```

**JavaScript (Wrong):**
```typescript
try {
  const response = await client.chat.completions.create({...});
} catch (RateLimitError) {  // Wrong: this won't work
  // Handle rate limit
} catch (APIError) {  // Wrong: this won't work
  // Handle other API errors
}
```

**JavaScript (Correct):**
```typescript
try {
  const response = await client.chat.completions.create({...});
} catch (error) {
  if (error instanceof RateLimitError) {
    // Handle rate limit
  } else if (error instanceof APIError) {
    // Handle other API errors
  }
}
```

### 4. Tool Function Definitions

**Python:**
```python
@tools
def my_tool(param: str) -> str:
    """Tool description"""
    return f"Result: {param}"
```

**JavaScript (Wrong):**
```typescript
// Wrong: trying to use decorator syntax
@tools
function myTool(param: string): string {
  return `Result: ${param}`;
}
```

**JavaScript (Correct):**
```typescript
const myTool = tools(function myTool(param: string): string {
  /**
   * Tool description
   * @param param - Parameter description
   */
  return `Result: ${param}`;
});
```

### 5. Streaming Iteration

**Python:**
```python
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

**JavaScript (Wrong):**
```typescript
// Wrong: regular for...of doesn't work with async iterables
for (const chunk of stream) {
  if (chunk.choices[0].delta.content) {
    console.log(chunk.choices[0].delta.content);
  }
}
```

**JavaScript (Correct):**
```typescript
// Correct: use for await...of for async iterables
for await (const chunk of stream) {
  if (chunk.choices[0].delta.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}
```

## Migration Checklist

### Pre-Migration
- [ ] Review your Python code and identify all HelpingAI SDK usage
- [ ] List all custom tools and their signatures
- [ ] Document any custom error handling logic
- [ ] Note any MCP integrations or external dependencies

### During Migration
- [ ] Install the JavaScript/TypeScript SDK
- [ ] Set up TypeScript configuration (if using TypeScript)
- [ ] Convert client initialization to use object configuration
- [ ] Migrate all tool definitions from decorators to function wrappers
- [ ] Update error handling to use instanceof checks
- [ ] Convert async iteration patterns
- [ ] Update environment variable access patterns

### Post-Migration
- [ ] Test all functionality with the new SDK
- [ ] Verify error handling works as expected
- [ ] Check that streaming responses work correctly
- [ ] Validate tool calling functionality
- [ ] Test MCP integrations (if applicable)
- [ ] Update documentation and examples
- [ ] Set up proper TypeScript types (if using TypeScript)

## Side-by-Side Examples

### Complete Chat Application

**Python Version:**
```python
import asyncio
from helpingai import HelpingAI, tools

@tools
def get_weather(city: str) -> str:
    """Get weather for a city"""
    return f"Weather in {city}: 22°C, sunny"

@tools
def calculate(expression: str) -> float:
    """Calculate mathematical expression"""
    return eval(expression)

async def main():
    client = HelpingAI(api_key="your-key")
    
    try:
        response = await client.chat.completions.create(
            model="Dhanishtha-2.0-preview",
            messages=[
                {"role": "user", "content": "What's the weather in Paris and what's 15 * 23?"}
            ],
            tools=[get_weather, calculate],
            tool_choice="auto"
        )
        
        print(response.choices[0].message.content)
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await client.cleanup()

if __name__ == "__main__":
    asyncio.run(main())
```

**JavaScript/TypeScript Version:**
```typescript
import { HelpingAI, tools } from 'helpingai-js';

const getWeather = tools(function getWeather(city: string): string {
  /**
   * Get weather for a city
   * @param city - The city name
   */
  return `Weather in ${city}: 22°C, sunny`;
});

const calculate = tools(function calculate(expression: string): number {
  /**
   * Calculate mathematical expression
   * @param expression - Mathematical expression to evaluate
   */
  return eval(expression); // Use proper math parser in production
});

async function main() {
  const client = new HelpingAI({ apiKey: 'your-key' });
  
  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'What\'s the weather in Paris and what\'s 15 * 23?' }
      ],
      tools: [getWeather, calculate],
      tool_choice: 'auto'
    });
    
    console.log(response.choices[0].message.content);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.cleanup();
  }
}

main().catch(console.error);
```

### Streaming with Progress

**Python Version:**
```python
import asyncio
import time
from helpingai import HelpingAI

async def streaming_example():
    client = HelpingAI(api_key="your-key")
    
    stream = await client.chat.completions.create(
        model="Dhanishtha-2.0-preview",
        messages=[{"role": "user", "content": "Tell me a long story"}],
        stream=True
    )
    
    content = ""
    token_count = 0
    start_time = time.time()
    
    async for chunk in stream:
        if chunk.choices[0].delta.content:
            delta = chunk.choices[0].delta.content
            content += delta
            token_count += 1
            print(delta, end="", flush=True)
        
        if chunk.choices[0].finish_reason:
            duration = time.time() - start_time
            print(f"\n\nCompleted: {token_count} tokens in {duration:.2f}s")
            break

asyncio.run(streaming_example())
```

**JavaScript/TypeScript Version:**
```typescript
import { HelpingAI } from 'helpingai-js';

async function streamingExample() {
  const client = new HelpingAI({ apiKey: 'your-key' });
  
  const stream = await client.chat.completions.create({
    model: 'Dhanishtha-2.0-preview',
    messages: [{ role: 'user', content: 'Tell me a long story' }],
    stream: true
  });
  
  let content = '';
  let tokenCount = 0;
  const startTime = Date.now();
  
  for await (const chunk of stream) {
    if (chunk.choices[0].delta.content) {
      const delta = chunk.choices[0].delta.content;
      content += delta;
      tokenCount++;
      process.stdout.write(delta);
    }
    
    if (chunk.choices[0].finish_reason) {
      const duration = Date.now() - startTime;
      console.log(`\n\nCompleted: ${tokenCount} tokens in ${duration}ms`);
      break;
    }
  }
}

streamingExample().catch(console.error);
```

## Performance Considerations

### Python
```python
# Connection pooling is handled automatically
client = HelpingAI(api_key="your-key")

# Concurrent requests
import asyncio
responses = await asyncio.gather(
    client.chat.completions.create(...),
    client.chat.completions.create(...),
    client.chat.completions.create(...)
)
```

### JavaScript/TypeScript
```typescript
// Connection pooling is handled automatically
const client = new HelpingAI({ apiKey: 'your-key' });

// Concurrent requests
const responses = await Promise.all([
  client.chat.completions.create({...}),
  client.chat.completions.create({...}),
  client.chat.completions.create({...})
]);
```

## Testing Differences

### Python Testing
```python
import pytest
from unittest.mock import AsyncMock, patch
from helpingai import HelpingAI

@pytest.mark.asyncio
async def test_chat_completion():
    with patch('helpingai.HelpingAI') as mock_client:
        mock_client.return_value.chat.completions.create = AsyncMock(
            return_value={"choices": [{"message": {"content": "Test response"}}]}
        )
        
        client = HelpingAI(api_key="test")
        response = await client.chat.completions.create(...)
        
        assert response["choices"][0]["message"]["content"] == "Test response"
```

### JavaScript/TypeScript Testing
```typescript
import { HelpingAI } from 'helpingai-js';

// Using Jest
jest.mock('helpingai-js');
const mockClient = HelpingAI as jest.MockedClass<typeof HelpingAI>;

test('chat completion', async () => {
  mockClient.prototype.chat.completions.create.mockResolvedValue({
    choices: [{ message: { content: 'Test response' } }]
  });
  
  const client = new HelpingAI({ apiKey: 'test' });
  const response = await client.chat.completions.create({...});
  
  expect(response.choices[0].message.content).toBe('Test response');
});
```

## Conclusion

Migrating from the Python SDK to the JavaScript/TypeScript SDK involves several key changes:

1. **Syntax Changes**: Object-based configuration, camelCase properties, `new` keyword
2. **Async Patterns**: `await` keyword, `Promise.all()`, `for await...of`
3. **Tool System**: Function wrappers instead of decorators
4. **Error Handling**: `instanceof` checks instead of exception type matching
5. **Type Safety**: TypeScript provides excellent type safety with proper configuration

The core API remains consistent between both SDKs, making migration straightforward once you understand these key differences. The JavaScript/TypeScript SDK provides excellent performance and type safety, making it a great choice for modern web and Node.js applications.

For additional help with migration, refer to the [API documentation](./api.md) and explore the [examples](../examples/) directory for practical usage patterns.
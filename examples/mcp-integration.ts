/**
 * MCP (Model Context Protocol) Integration Example
 *
 * This example demonstrates how to use MCP servers (Model Context Protocol) with the HelpingAI SDK.
 * Port of the Python mcp_example.py.
 */

import { HelpingAI } from '../src';

/**
 * Example of using MCP servers (Model Context Protocol) with HelpingAI SDK.
 */
async function exampleMCPUsage(): Promise<void> {
  console.log('=== Basic MCP (Model Context Protocol) Usage ===');

  // Initialize the client
  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  // Define MCP servers configuration
  // This is the exact format requested by the user
  const tools = [
    {
      mcpServers: {
        time: {
          command: 'uvx',
          args: ['mcp-server-time', '--local-timezone=Asia/Shanghai'],
        },
        fetch: {
          command: 'uvx',
          args: ['mcp-server-fetch'],
        },
      },
    },
  ];

  try {
    // Create a chat completion with MCP tools
    const response = await client.chat.completions.create({
      model: 'HelpingAI2.5-10B',
      messages: [{ role: 'user', content: 'What time is it in Shanghai?' }],
      tools, // MCP servers will be automatically initialized and converted to tools
    });

    if ('choices' in response) {
      console.log('Response:', response.choices[0].message.content);

      // If the model decides to use tools, tool_calls will be populated
      if (response.choices[0].message.tool_calls) {
        for (const toolCall of response.choices[0].message.tool_calls) {
          console.log(`Tool called: ${toolCall.function.name}`);
          console.log(`Arguments: ${toolCall.function.arguments}`);
        }
      }
    }
  } catch (error: any) {
    if (error.message?.includes('MCP')) {
      console.log(`MCP package not available: ${error.message}`);
      console.log('Install with: npm install @modelcontextprotocol/sdk');
    } else {
      console.log(`Error: ${error.message || error}`);
    }
  } finally {
    await client.cleanup();
  }
}

/**
 * Example of mixing MCP servers (Model Context Protocol) with regular tools.
 */
async function exampleMixedTools(): Promise<void> {
  console.log('\n=== Mixed Tools Example ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  // Mix MCP servers with regular OpenAI-format tools
  const tools = [
    // MCP servers configuration
    {
      mcpServers: {
        time: {
          command: 'uvx',
          args: ['mcp-server-time'],
        },
      },
    },
    // Regular OpenAI-format tool
    {
      type: 'function' as const,
      function: {
        name: 'calculate',
        description: 'Perform basic math calculations',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'Math expression to evaluate',
            },
          },
          required: ['expression'],
        },
      },
    },
  ];

  try {
    const response = await client.chat.completions.create({
      model: 'HelpingAI2.5-10B',
      messages: [{ role: 'user', content: 'What time is it and what is 2+2?' }],
      tools,
    });

    if ('choices' in response) {
      console.log('Response:', response.choices[0].message.content);
    }
  } catch (error: any) {
    console.log(`Error: ${error.message || error}`);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example of advanced MCP (Model Context Protocol) server configurations.
 */
async function exampleAdvancedMCPConfig(): Promise<void> {
  console.log('\n=== Advanced MCP (Model Context Protocol) Configuration ===');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tools = [
    {
      mcpServers: {
        // Stdio-based server with environment variables
        database: {
          command: 'python',
          args: ['-m', 'my_db_server'],
          env: {
            DB_URL: 'postgresql://user:pass@localhost/db',
            DB_TIMEOUT: '30',
          },
        },
        // HTTP-based server (SSE)
        remote_api: {
          url: 'https://api.example.com/mcp',
          headers: {
            Authorization: 'Bearer your-token',
            Accept: 'text/event-stream',
          },
          sse_read_timeout: 300,
        },
        // Streamable HTTP server
        streamable_server: {
          type: 'streamable-http' as const,
          url: 'http://localhost:8000/mcp',
        },
      },
    },
  ];

  console.log('Advanced MCP (Model Context Protocol) configuration:');
  console.log('- Stdio server with environment variables');
  console.log('- HTTP SSE server with authentication');
  console.log('- Streamable HTTP server');
  console.log('\nConfiguration is ready to use with client.chat.completions.create()');

  // Configuration is ready to use with client.chat.completions.create()
  // Example usage would be similar to the basic examples above
}

/**
 * Example demonstrating error handling and reconnection strategies
 */
async function exampleErrorHandlingAndReconnection(): Promise<void> {
  console.log('\n=== Error Handling and Reconnection Example ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  const tools = [
    {
      mcpServers: {
        // This server might fail to connect
        unreliable_server: {
          command: 'uvx',
          args: ['nonexistent-mcp-server'],
        },
        // This server should work
        time: {
          command: 'uvx',
          args: ['mcp-server-time'],
        },
      },
    },
  ];

  try {
    console.log('Attempting to connect to MCP servers...');

    const response = await client.chat.completions.create({
      model: 'HelpingAI2.5-10B',
      messages: [{ role: 'user', content: 'What time is it?' }],
      tools,
    });

    if ('choices' in response) {
      console.log('Response:', response.choices[0].message.content);
      console.log('✅ Successfully handled partial MCP server failures');
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message || error}`);
    console.log('💡 Tip: Check MCP server configurations and ensure servers are available');
  } finally {
    await client.cleanup();
  }
}

/**
 * Example showing resource handling with MCP servers
 */
async function exampleResourceHandling(): Promise<void> {
  console.log('\n=== Resource Handling Example ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  const tools = [
    {
      mcpServers: {
        filesystem: {
          command: 'uvx',
          args: ['mcp-server-filesystem', '--base-dir', './data'],
        },
        memory: {
          command: 'uvx',
          args: ['mcp-server-memory'],
        },
      },
    },
  ];

  try {
    console.log('Using MCP servers with resource capabilities...');

    const response = await client.chat.completions.create({
      model: 'HelpingAI2.5-10B',
      messages: [
        {
          role: 'user',
          content:
            "List files in the current directory and remember that I'm working on a TypeScript project",
        },
      ],
      tools,
    });

    if ('choices' in response) {
      console.log('Response:', response.choices[0].message.content);
    }
  } catch (error: any) {
    console.log(`Error: ${error.message || error}`);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example of using multiple transport types
 */
async function exampleMultipleTransportTypes(): Promise<void> {
  console.log('\n=== Multiple Transport Types Example ===');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tools = [
    {
      mcpServers: {
        // Stdio transport
        local_time: {
          command: 'uvx',
          args: ['mcp-server-time'],
        },
        // HTTP SSE transport
        remote_weather: {
          url: 'https://weather-mcp.example.com/sse',
          type: 'sse' as const,
          headers: {
            Authorization: 'Bearer weather-api-key',
          },
        },
        // HTTP transport
        api_service: {
          url: 'https://api-mcp.example.com/http',
          type: 'streamable-http' as const,
        },
      },
    },
  ];

  console.log('Configured MCP servers with different transport types:');
  console.log('- Stdio: local_time server');
  console.log('- HTTP SSE: remote_weather server');
  console.log('- HTTP: api_service server');
  console.log('\nEach transport type is handled automatically by the MCP manager');
}

// Main execution function
async function main(): Promise<void> {
  console.log('=== HelpingAI MCP (Model Context Protocol) Integration Examples ===\n');

  try {
    await exampleMCPUsage();
    await exampleMixedTools();
    await exampleAdvancedMCPConfig();
    await exampleErrorHandlingAndReconnection();
    await exampleResourceHandling();
    await exampleMultipleTransportTypes();

    console.log('\n✅ All MCP examples completed');
    console.log('📚 For more information, visit: https://modelcontextprotocol.io');
  } catch (error) {
    console.error('Error in main:', error);
  }
}

// Run the example if this file is executed directly
declare const require: any;
declare const module: any;

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

// Export functions for use in other modules
export {
  exampleMCPUsage,
  exampleMixedTools,
  exampleAdvancedMCPConfig,
  exampleErrorHandlingAndReconnection,
  exampleResourceHandling,
  exampleMultipleTransportTypes,
};

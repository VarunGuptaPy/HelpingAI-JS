/**
 * HelpingAI Tool Usage Examples
 * 
 * This script demonstrates proper usage patterns for the HelpingAI client,
 * specifically addressing common issues with tool configuration and API requests.
 * 
 * Common Issues Addressed:
 * 1. Tool conversion errors - "Unsupported tools format"
 * 2. HTTP 400 errors suggesting stream=true
 * 3. Proper tool format specifications
 * 
 * Port of the Python troubleshooting_guide.py
 */

import { HelpingAI } from '../src';

/**
 * Example: Using built-in tools correctly.
 */
async function exampleBuiltInTools(): Promise<void> {
  console.log('=== Example 1: Built-in Tools ===');
  
  const client = new HelpingAI({
    apiKey: "your-api-key" // Replace with your actual API key or use environment variable
  });

  // ✅ CORRECT: Use built-in tool names as strings
  const tools = ["code_interpreter", "web_search"];

  try {
    const response = await client.chat.completions.create({
      model: "HelpingAI2.5-10B",
      messages: [{ role: "user", content: "What's 2+2 and search for Python tutorials?" }],
      tools: tools,
      stream: false // Try stream=true if you get HTTP 400 errors
    });

    if ('choices' in response) {
      console.log('✅ Request successful with built-in tools');
      console.log('Response:', response.choices[0].message.content);
    }

  } catch (error: any) {
    console.log(`❌ Error: ${error.message || error}`);
    if (error.message?.includes('400') && error.message?.toLowerCase().includes('stream')) {
      console.log('💡 Tip: Try setting stream=true');
    }
  } finally {
    await client.cleanup();
  }
}

/**
 * Example: Using OpenAI-format tools correctly.
 */
async function exampleOpenAIFormatTools(): Promise<void> {
  console.log('\n=== Example 2: OpenAI Format Tools ===');
  
  const client = new HelpingAI({
    apiKey: "your-api-key" // Replace with your actual API key or use environment variable
  });

  // ✅ CORRECT: OpenAI tool format
  const tools = [
    {
      type: "function" as const,
      function: {
        name: "calculate",
        description: "Perform basic math calculations",
        parameters: {
          type: "object",
          properties: {
            expression: {
              type: "string",
              description: "Math expression to evaluate"
            }
          },
          required: ["expression"]
        }
      }
    }
  ];

  try {
    const response = await client.chat.completions.create({
      model: "HelpingAI2.5-10B",
      messages: [{ role: "user", content: "Calculate 15 * 23" }],
      tools: tools
    });

    if ('choices' in response) {
      console.log('✅ Request successful with OpenAI format tools');
      console.log('Response:', response.choices[0].message.content);
    }

  } catch (error: any) {
    console.log(`❌ Error: ${error.message || error}`);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example: Using MCP (Model Context Protocol) tools correctly.
 */
async function exampleMCPTools(): Promise<void> {
  console.log('\n=== Example 3: MCP Tools ===');
  
  const client = new HelpingAI({
    apiKey: "your-api-key" // Replace with your actual API key or use environment variable
  });

  // ✅ CORRECT: MCP server configuration
  const tools = [
    {
      mcpServers: {
        time: {
          command: 'uvx',
          args: ['mcp-server-time']
        },
        fetch: {
          command: 'uvx',
          args: ['mcp-server-fetch']
        }
      }
    }
  ];

  try {
    const response = await client.chat.completions.create({
      model: "HelpingAI2.5-10B",
      messages: [{ role: "user", content: "What time is it?" }],
      tools: tools
    });

    if ('choices' in response) {
      console.log('✅ Request successful with MCP tools');
      console.log('Response:', response.choices[0].message.content);
    }

  } catch (error: any) {
    if (error.message?.includes('MCP')) {
      console.log('❌ MCP dependencies not installed. Run: npm install @modelcontextprotocol/sdk');
    } else {
      console.log(`❌ Error: ${error.message || error}`);
    }
  } finally {
    await client.cleanup();
  }
}

/**
 * Example: Mixing different tool types correctly.
 */
async function exampleMixedTools(): Promise<void> {
  console.log('\n=== Example 4: Mixed Tools ===');
  
  const client = new HelpingAI({
    apiKey: "your-api-key" // Replace with your actual API key or use environment variable
  });

  // ✅ CORRECT: Mix built-in tools with OpenAI format
  const tools = [
    "code_interpreter", // Built-in tool
    {
      type: "function" as const,
      function: {
        name: "custom_tool",
        description: "A custom tool",
        parameters: { 
          type: "object", 
          properties: {},
          required: []
        }
      }
    }
  ];

  try {
    const response = await client.chat.completions.create({
      model: "HelpingAI2.5-10B",
      messages: [{ role: "user", content: "Help me with coding" }],
      tools: tools
    });

    if ('choices' in response) {
      console.log('✅ Request successful with mixed tools');
      console.log('Response:', response.choices[0].message.content);
    }

  } catch (error: any) {
    console.log(`❌ Error: ${error.message || error}`);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example: Using streaming to avoid HTTP 400 errors.
 */
async function exampleStreamingUsage(): Promise<void> {
  console.log('\n=== Example 5: Streaming Usage ===');
  
  const client = new HelpingAI({
    apiKey: "your-api-key" // Replace with your actual API key or use environment variable
  });

  try {
    // If you get HTTP 400 errors, try streaming
    const response = await client.chat.completions.create({
      model: "HelpingAI2.5-10B",
      messages: [{ role: "user", content: "Tell me a story" }],
      tools: ["web_search"],
      stream: true // 🔑 KEY: Enable streaming
    });

    console.log('✅ Streaming request initiated');

    // Process streaming response
    if (Symbol.asyncIterator in response) {
      let fullContent = '';
      for await (const chunk of response) {
        if (chunk.choices[0].delta.content) {
          if (typeof process !== 'undefined' && process.stdout) {
            process.stdout.write(chunk.choices[0].delta.content);
          } else {
            console.log(chunk.choices[0].delta.content);
          }
          fullContent += chunk.choices[0].delta.content;
        }
      }
      console.log('\n✅ Streaming completed');
    }

  } catch (error: any) {
    console.log(`❌ Error: ${error.message || error}`);
  } finally {
    await client.cleanup();
  }
}

/**
 * Examples of common mistakes to avoid.
 */
function commonMistakes(): void {
  console.log('\n=== Common Mistakes to Avoid ===');
  
  // ❌ WRONG: Invalid tool names
  console.log('❌ DON\'T: Use invalid built-in tool names');
  console.log('   tools = [\'invalid_tool\']  // Will cause warnings');
  
  // ❌ WRONG: Wrong data types
  console.log('❌ DON\'T: Use wrong data types for tools');
  console.log('   tools = [1, 2, 3]  // Will cause warnings');
  
  // ❌ WRONG: Incorrect format
  console.log('❌ DON\'T: Use incorrect tool format');
  console.log('   tools = {\'not\': \'a list\'}  // Should be a list');
  
  // ✅ CORRECT alternatives
  console.log('\n✅ DO: Use correct formats');
  console.log('   tools = [\'code_interpreter\', \'web_search\']  // Built-in tools');
  console.log('   tools = [{\'type\': \'function\', ...}]  // OpenAI format');
  console.log('   tools = [{\'mcpServers\': {...}}]  // MCP format');
}

/**
 * Troubleshooting tips for common issues.
 */
function troubleshootingTips(): void {
  console.log('\n=== Troubleshooting Tips ===');
  
  console.log('🔧 If you see \'Tool conversion failed\' warnings:');
  console.log('   - Check that tool names are correct (code_interpreter, web_search)');
  console.log('   - Ensure tools are in proper format (array of strings/objects)');
  console.log('   - For MCP tools, install: npm install @modelcontextprotocol/sdk');
  
  console.log('\n🔧 If you get HTTP 400 \'stream=true\' errors:');
  console.log('   - Try setting stream=true in your request');
  console.log('   - Some models/endpoints require streaming');
  console.log('   - Tool-heavy requests often need streaming');
  
  console.log('\n🔧 If you get \'Unknown built-in tool\' errors:');
  console.log('   - Available built-in tools: code_interpreter, web_search');
  console.log('   - For custom tools, use OpenAI format with \'type\': \'function\'');
  
  console.log('\n🔧 For MCP tools:');
  console.log('   - Install MCP dependencies: npm install @modelcontextprotocol/sdk');
  console.log('   - Ensure MCP servers are properly configured');
  console.log('   - Check server commands and arguments');
}

/**
 * Performance optimization tips
 */
async function performanceOptimizationTips(): Promise<void> {
  console.log('\n=== Performance Optimization Tips ===');
  
  console.log('⚡ Request Optimization:');
  console.log('   - Use streaming for long responses');
  console.log('   - Set appropriate timeout values');
  console.log('   - Batch multiple requests when possible');
  
  console.log('\n⚡ Tool Usage Optimization:');
  console.log('   - Only include tools that are actually needed');
  console.log('   - Use built-in tools when available (faster than custom)');
  console.log('   - Cache tool results when appropriate');
  
  console.log('\n⚡ Error Handling Best Practices:');
  console.log('   - Implement retry logic with exponential backoff');
  console.log('   - Handle rate limiting gracefully');
  console.log('   - Log errors for debugging');

  // Example of retry logic
  const client = new HelpingAI({
    apiKey: "your-api-key" // Replace with your actual API key or use environment variable
  });

  async function makeRequestWithRetry(maxRetries: number = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await client.chat.completions.create({
          model: "HelpingAI2.5-10B",
          messages: [{ role: "user", content: "Hello" }]
        });
        
        if ('choices' in response) {
          console.log('✅ Request successful on attempt', attempt);
          return;
        }
      } catch (error: any) {
        console.log(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  try {
    await makeRequestWithRetry();
  } catch (error) {
    console.log('All retry attempts failed');
  } finally {
    await client.cleanup();
  }
}

/**
 * Debugging techniques
 */
async function debuggingTechniques(): Promise<void> {
  console.log('\n=== Debugging Techniques ===');
  
  console.log('🐛 Enable Debug Logging:');
  console.log('   - Set environment variable: DEBUG=helpingai:*');
  console.log('   - Use console.log for request/response inspection');
  console.log('   - Check network requests in browser dev tools');
  
  console.log('\n🐛 Common Debug Scenarios:');
  
  const client = new HelpingAI({
    apiKey: "your-api-key" // Replace with your actual API key or use environment variable
  });

  try {
    // Debug: Log request details
    const requestData = {
      model: "HelpingAI2.5-10B",
      messages: [{ role: "user" as const, content: "Debug test" }],
      tools: ["code_interpreter"]
    };
    
    console.log('🔍 Request data:', JSON.stringify(requestData, null, 2));
    
    const response = await client.chat.completions.create(requestData);
    
    if ('choices' in response) {
      console.log('🔍 Response structure:', {
        id: response.id,
        model: response.model,
        choices_count: response.choices.length,
        has_tool_calls: !!response.choices[0].message.tool_calls
      });
    }
    
  } catch (error: any) {
    console.log('🔍 Error details:', {
      name: error.name,
      message: error.message,
      status: error.status,
      type: error.type
    });
  } finally {
    await client.cleanup();
  }
}

// Main execution function
async function main(): Promise<void> {
  console.log('HelpingAI Tool Usage Examples');
  console.log('='.repeat(40));
  
  // Set up API key check
  console.log('⚠️  Replace "your-api-key" with your actual HelpingAI API key');
  console.log('   You can get your API key from https://helpingai.co/dashboard');
  console.log();

  try {
    // Run examples
    await exampleBuiltInTools();
    await exampleOpenAIFormatTools();
    await exampleMCPTools();
    await exampleMixedTools();
    await exampleStreamingUsage();
    
    // Show common mistakes and tips
    commonMistakes();
    troubleshootingTips();
    
    // Additional examples
    await performanceOptimizationTips();
    await debuggingTechniques();

    console.log('\n✅ For more examples, see: examples/mcp-integration.ts');
    console.log('📚 Documentation: https://helpingai.co/docs');
    
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
  exampleBuiltInTools,
  exampleOpenAIFormatTools,
  exampleMCPTools,
  exampleMixedTools,
  exampleStreamingUsage,
  commonMistakes,
  troubleshootingTips,
  performanceOptimizationTips,
  debuggingTechniques
};
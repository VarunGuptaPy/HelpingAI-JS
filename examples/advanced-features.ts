/**
 * Advanced Features Examples for HelpingAI JavaScript SDK
 *
 * This example demonstrates advanced features and patterns:
 * - Built-in tools usage
 * - Custom tool creation
 * - Tool registry management
 * - Type-safe tool calling
 * - Complex workflows
 * - Performance optimization
 */

import { HelpingAI, tools, getTools, getRegistry, clearRegistry } from '../src';

/**
 * Example 1: Built-in Tools Usage
 */
async function builtinToolsExample(): Promise<void> {
  console.log('=== Example 1: Built-in Tools ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  try {
    // Direct tool calls - Code Interpreter
    console.log('=== Testing Code Interpreter ===');
    const codeResult = await client.call('code_interpreter', {
      code: `
import math

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Calculate factorial of 10
result = factorial(10)
print(f"Factorial of 10 is: {result}")

# Also show using math.factorial
math_result = math.factorial(10)
print(f"Using math.factorial: {math_result}")

# Verify they're the same
print(f"Results match: {result == math_result}")
`,
    });
    console.log('Code Interpreter Result:');
    console.log(codeResult);
    console.log();

    // Direct tool calls - Web Search
    console.log('=== Testing Web Search ===');
    const searchResult = await client.call('web_search', {
      query: 'latest developments in emotional AI 2024',
      max_results: 3,
    });
    console.log('Web Search Result:');
    console.log(searchResult);
    console.log();
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 2: Custom Tool Creation with @tools Decorator
 */

// Define custom tools using the @tools decorator
// Example tool definition - not used in this demo but shows the pattern
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _weatherTool = tools(function getWeather(
  city: string,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): string {
  /**
   * Get current weather information for a city.
   *
   * @param city - The city name to get weather for
   * @param units - Temperature units (celsius or fahrenheit)
   */
  // Mock implementation - in real usage, you'd call a weather API
  const temp = units === 'fahrenheit' ? '72°F' : '22°C';
  return `Weather in ${city}: ${temp}, partly cloudy with light winds`;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _calculatorTool = tools(function calculate(expression: string): {
  result: number;
  expression: string;
} {
  /**
   * Perform mathematical calculations safely.
   *
   * @param expression - Mathematical expression to evaluate
   */
  try {
    // Simple evaluation (in production, use a proper math parser)
    const result = Function(`"use strict"; return (${expression})`)();
    return { result, expression };
  } catch (error) {
    throw new Error(`Invalid mathematical expression: ${expression}`);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _taskManagerTool = tools(function createTask(
  title: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  dueDate?: string,
  tags: string[] = []
): { id: string; title: string; priority: string; dueDate?: string; tags: string[] } {
  /**
   * Create a new task with specified details.
   *
   * @param title - Task title
   * @param priority - Task priority level
   * @param dueDate - Due date in YYYY-MM-DD format
   * @param tags - Array of task tags
   */
  const id = Math.random().toString(36).substr(2, 9);
  return { id, title, priority, dueDate, tags };
});

async function customToolsExample(): Promise<void> {
  console.log('\n=== Example 2: Custom Tools ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  try {
    // Get all registered tools
    const customTools = getTools();
    console.log(`Registered ${customTools.length} custom tools`);

    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        {
          role: 'user',
          content:
            "What's the weather in Paris, calculate 15 * 23, and create a high-priority task for reviewing the weather data?",
        },
      ],
      tools: customTools,
      tool_choice: 'auto',
    });

    if ('choices' in response) {
      console.log('Custom Tools Response:', response.choices[0].message.content);
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 3: Direct Tool Execution
 */
async function directToolExecutionExample(): Promise<void> {
  console.log('\n=== Example 3: Direct Tool Execution ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  try {
    // Execute tools directly without going through chat completion
    console.log('Executing tools directly:');

    const weatherResult = await client.call('getWeather', {
      city: 'Tokyo',
      units: 'celsius',
    });
    console.log('Weather result:', weatherResult);

    const calcResult = await client.call('calculate', {
      expression: '(15 + 25) * 2',
    });
    console.log('Calculation result:', calcResult);

    const taskResult = await client.call('createTask', {
      title: 'Review weather API integration',
      priority: 'high',
      tags: ['api', 'weather', 'integration'],
    });
    console.log('Task created:', taskResult);
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 4: Tool Registry Management
 */
async function toolRegistryExample(): Promise<void> {
  console.log('\n=== Example 4: Tool Registry Management ===');

  const registry = getRegistry();

  console.log('Registry operations:');
  console.log(`- Total tools: ${registry.size()}`);
  console.log(`- Tool names: ${registry.listToolNames().join(', ')}`);

  // Inspect specific tools
  const weatherTool = registry.get('getWeather');
  if (weatherTool) {
    console.log('Weather tool schema:', JSON.stringify(weatherTool.tool, null, 2));
  }

  // List all tools with details
  const allTools = registry.list();
  allTools.forEach(({ name, tool }) => {
    console.log(`Tool: ${name}`);
    console.log(`  Description: ${tool.function.description}`);
    console.log(`  Parameters: ${Object.keys(tool.function.parameters.properties).join(', ')}`);
  });
}

/**
 * Example 5: Complex Workflow with Multiple Tools
 */
async function complexWorkflowExample(): Promise<void> {
  console.log('\n=== Example 5: Complex Workflow ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  // Define a workflow tool
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _workflowTool = tools(function analyzeData(
    dataset: string,
    analysisType: 'statistical' | 'trend' | 'correlation' = 'statistical'
  ): { analysis: string; insights: string[]; recommendations: string[] } {
    /**
     * Analyze a dataset and provide insights.
     *
     * @param dataset - Name or description of the dataset
     * @param analysisType - Type of analysis to perform
     */
    return {
      analysis: `${analysisType} analysis of ${dataset}`,
      insights: [
        'Data shows consistent growth pattern',
        'Seasonal variations detected',
        'Strong correlation with external factors',
      ],
      recommendations: [
        'Increase data collection frequency',
        'Implement predictive modeling',
        'Set up automated alerts',
      ],
    };
  });

  try {
    // Complex multi-step workflow
    const messages = [
      {
        role: 'user' as const,
        content:
          'I need to analyze customer satisfaction data, get weather info for our main office in London, calculate the ROI of our recent campaign (invested $10000, gained $15000), and create a task to review the analysis results.',
      },
    ];

    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages,
      tools: getTools(), // Get all registered tools
      tool_choice: 'auto',
    });

    if ('choices' in response) {
      console.log('Workflow Response:', response.choices[0].message.content);

      // If tools were called, show the results
      if (response.choices[0].message.tool_calls) {
        console.log(
          `\n🔧 ${response.choices[0].message.tool_calls.length} tools were called during the workflow`
        );
      }
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 6: Type-Safe Tool Calling
 */
async function typeSafeToolsExample(): Promise<void> {
  console.log('\n=== Example 6: Type-Safe Tools ===');

  // Define strongly typed tools
  interface UserProfile {
    id: string;
    name: string;
    email: string;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _userTool = tools(function createUser(
    name: string,
    email: string,
    theme: 'light' | 'dark' = 'light',
    notifications: boolean = true
  ): UserProfile {
    /**
     * Create a new user profile with type safety.
     *
     * @param name - User's full name
     * @param email - User's email address
     * @param theme - UI theme preference
     * @param notifications - Enable notifications
     */
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      preferences: { theme, notifications },
    };
  });

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  try {
    // Type-safe direct execution
    const user = await client.call('createUser', {
      name: 'John Doe',
      email: 'john@example.com',
      theme: 'dark',
      notifications: false,
    });

    console.log('Created user:', user);
    console.log('Type safety ensures correct parameter types and return values');
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 7: Performance Optimization Techniques
 */
async function performanceOptimizationExample(): Promise<void> {
  console.log('\n=== Example 7: Performance Optimization ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
    timeout: 10000, // Shorter timeout for performance testing
  });

  try {
    console.log('🚀 Performance optimization techniques:');

    // 1. Batch operations
    console.log('1. Batching multiple operations...');
    const batchStart = Date.now();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _batchResponse = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        {
          role: 'user',
          content:
            'Perform these tasks: get weather for NYC, calculate 100*50, create a task called "Review batch results"',
        },
      ],
      tools: getTools(),
    });

    const batchTime = Date.now() - batchStart;
    console.log(`   Batch completed in ${batchTime}ms`);

    // 2. Tool result caching (mock implementation)
    console.log('2. Tool result caching...');
    const cache = new Map<string, any>();

    const cacheKey = 'weather_nyc_celsius';
    if (cache.has(cacheKey)) {
      console.log('   Cache hit - using cached result');
    } else {
      const result = await client.call('getWeather', { city: 'NYC', units: 'celsius' });
      cache.set(cacheKey, result);
      console.log('   Cache miss - result cached for future use');
    }

    // 3. Selective tool loading
    console.log('3. Selective tool loading...');
    const specificTools = getTools(['getWeather', 'calculate']); // Only load needed tools
    console.log(`   Loaded ${specificTools.length} specific tools instead of all tools`);

    // 4. Streaming for long operations
    console.log('4. Using streaming for better perceived performance...');
    const streamResponse = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'Explain the performance benefits of streaming responses' },
      ],
      stream: true,
      max_tokens: 100,
    });

    if (Symbol.asyncIterator in streamResponse) {
      let streamContent = '';
      for await (const chunk of streamResponse) {
        if (chunk.choices[0].delta.content) {
          streamContent += chunk.choices[0].delta.content;
        }
        if (chunk.choices[0].finish_reason) break;
      }
      console.log('   Streaming response received, length:', streamContent.length);
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 8: Error Handling and Resilience
 */
async function errorHandlingExample(): Promise<void> {
  console.log('\n=== Example 8: Advanced Error Handling ===');

  // Define a tool that might fail
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unreliableTool = tools(function processData(
    data: string,
    shouldFail: boolean = false
  ): string {
    /**
     * Process data with potential failure for testing error handling.
     *
     * @param data - Data to process
     * @param shouldFail - Whether to simulate failure
     */
    if (shouldFail) {
      throw new Error('Simulated processing failure');
    }
    return `Processed: ${data}`;
  });

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  try {
    console.log('Testing error handling scenarios:');

    // 1. Tool execution error
    try {
      await client.call('processData', { data: 'test', shouldFail: true });
    } catch (error: any) {
      console.log('✅ Caught tool execution error:', error.message);
    }

    // 2. Invalid tool parameters
    try {
      await client.call('getWeather', { city: 123 as any }); // Invalid parameter type
    } catch (error: any) {
      console.log('✅ Caught invalid parameter error:', error.message);
    }

    // 3. Network timeout handling
    const timeoutClient = new HelpingAI({
      apiKey: 'your-api-key',
      timeout: 1, // Very short timeout to trigger error
    });

    try {
      await timeoutClient.chat.completions.create({
        model: 'Dhanishtha-2.0-preview',
        messages: [{ role: 'user', content: 'This should timeout' }],
      });
    } catch (error: any) {
      console.log('✅ Caught timeout error:', error.message);
    } finally {
      await timeoutClient.cleanup();
    }

    // 4. Graceful degradation
    console.log('4. Graceful degradation when tools fail...');
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'Try to process some data, but continue even if it fails' },
      ],
      tools: getTools(),
      tool_choice: 'auto',
    });

    if ('choices' in response) {
      console.log('✅ Response received despite potential tool failures');
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('🚀 HelpingAI Advanced Features Examples\n');

  try {
    await builtinToolsExample();
    await customToolsExample();
    await directToolExecutionExample();
    await toolRegistryExample();
    await complexWorkflowExample();
    await typeSafeToolsExample();
    await performanceOptimizationExample();
    await errorHandlingExample();

    console.log('\n✅ All advanced features examples completed successfully!');
    console.log('\n📚 Key Takeaways:');
    console.log('- Use built-in tools for common tasks');
    console.log('- Create custom tools with @tools decorator');
    console.log('- Manage tool registry for organization');
    console.log('- Implement type safety for reliability');
    console.log('- Optimize performance with batching and caching');
    console.log('- Handle errors gracefully for resilience');
  } catch (error: any) {
    console.error('❌ Example execution failed:', error.message || error);
    if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process.exit) {
      (globalThis as any).process.exit(1);
    }
  } finally {
    // Clean up registry if needed
    console.log('\n🧹 Cleaning up...');
    clearRegistry();
    console.log('Registry cleared');
  }
}

// Run examples if this file is executed directly (Node.js environment)
if (
  typeof (globalThis as any).require !== 'undefined' &&
  typeof (globalThis as any).module !== 'undefined' &&
  (globalThis as any).require.main === (globalThis as any).module
) {
  main().catch(console.error);
}

export {
  builtinToolsExample,
  customToolsExample,
  directToolExecutionExample,
  toolRegistryExample,
  complexWorkflowExample,
  typeSafeToolsExample,
  performanceOptimizationExample,
  errorHandlingExample,
};

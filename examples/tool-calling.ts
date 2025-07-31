/**
 * Example script demonstrating HelpingAI tool calling functionality.
 * 
 * This script shows how to create and use tools with the HelpingAI SDK.
 * Port of the Python tooluse.py example.
 */

import { HelpingAI, tools, getTools } from '../src';

/**
 * Generate a response using HelpingAI with tool calling support.
 * 
 * @param userPrompt - The user's input prompt
 * @param prints - Whether to print debug information
 * @returns The AI's response content
 */
async function generate(userPrompt: string, prints: boolean = true): Promise<string> {
  // Create a client instance
  const client = new HelpingAI({
    apiKey: "your-api-key" // Replace with your actual API key
  });

  // Define tools configuration - equivalent to Python version
  const toolsConfig = [
    {
      mcpServers: {
        time: { 
          command: 'uvx', 
          args: ['mcp-server-time'] 
        },
        fetch: { 
          command: 'uvx', 
          args: ['mcp-server-fetch'] 
        },
        // Commented out like in Python version
        // 'ddg-search': {
        //   command: 'npx',
        //   args: ['-y', '@oevortex/ddg_search@latest']
        // }
      }
    },
    'code_interpreter',
    // 'web_search' // Commented out like in Python version
  ];

  // Initialize messages
  const messages: Array<{
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    tool_calls?: any[];
    tool_call_id?: string;
    name?: string;
  }> = [
    { role: 'user', content: userPrompt }
  ];

  try {
    // Create the chat completion with tools
    const response = await client.chat.completions.create({
      model: "Dhanishtha-2.0-preview",
      messages,
      tools: toolsConfig,
      tool_choice: "auto",
      stream: false,
      hide_think: true,
    });

    // Handle non-streaming response
    if ('choices' in response) {
      const responseMessage = response.choices[0].message;

      // Handle tool calls
      const toolCalls = responseMessage.tool_calls;
      if (toolCalls && toolCalls.length > 0) {
        if (prints) {
          console.log(`Tool calls detected: ${toolCalls.length}`);
        }

        // Add the assistant's message with tool calls to conversation
        messages.push(responseMessage);

        // Process each tool call
        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);

          if (prints) {
            console.log(`Calling tool: ${functionName}`);
            console.log(`Arguments:`, functionArgs);
          }

          try {
            // Use HelpingAI's built-in tool calling mechanism
            const functionResponse = await client.call(functionName, functionArgs);

            if (prints) {
              console.log(`Tool response:`, functionResponse);
            }

            // Add tool response to messages
            messages.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              name: functionName,
              content: String(functionResponse),
            });

          } catch (error) {
            const errorMessage = `Error executing tool ${functionName}: ${error instanceof Error ? error.message : String(error)}`;
            if (prints) {
              console.error(errorMessage);
            }

            // Add error response to messages
            messages.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              name: functionName,
              content: errorMessage,
            });
          }
        }

        // Get final response from HelpingAI after tool execution
        const secondResponse = await client.chat.completions.create({
          model: "Dhanishtha-2.0-preview",
          messages,
          tools: toolsConfig,
          stream: false,
          hide_think: true,
        });

        if ('choices' in secondResponse) {
          return secondResponse.choices[0].message.content || '';
        }
      }

      return responseMessage.content || '';
    }

    return 'No response received';

  } catch (error) {
    const errorMessage = `Error in generate function: ${error instanceof Error ? error.message : String(error)}`;
    if (prints) {
      console.error(errorMessage);
    }
    throw new Error(errorMessage);
  } finally {
    // Cleanup resources
    await client.cleanup();
  }
}

/**
 * Example of using the @tools decorator for custom tools
 */
/**
 * Calculate tip and total amount for a bill.
 *
 * @param billAmount - The original bill amount
 * @param tipPercentage - Tip percentage (default: 15.0)
 */
const calculateTip = tools(function calculateTip(billAmount: number, tipPercentage: number = 15.0): { tip: number; total: number; original: number } {
  const tip = billAmount * (tipPercentage / 100);
  const total = billAmount + tip;
  return { tip, total, original: billAmount };
});

/**
 * Get current weather information for a city.
 *
 * @param city - The city name to get weather for
 * @param units - Temperature units (celsius or fahrenheit)
 */
const getWeather = tools(function getWeather(city: string, units: string = "celsius"): string {
  // Mock implementation - in real usage, you'd call a weather API
  const temp = units === "fahrenheit" ? "72°F" : "22°C";
  return `Weather in ${city}: ${temp}, partly cloudy`;
});

/**
 * Example using custom tools with @tools decorator
 */
async function exampleWithCustomTools(): Promise<void> {
  console.log('\n=== Example with Custom Tools ===');
  
  const client = new HelpingAI({
    apiKey: "your-api-key"
  });

  try {
    // Get tools from registry (includes our @tools decorated functions)
    const customTools = getTools();
    
    const response = await client.chat.completions.create({
      model: "Dhanishtha-2.0-preview",
      messages: [
        { 
          role: 'user', 
          content: "What's the weather in Paris and calculate tip for a $50 bill?" 
        }
      ],
      tools: customTools,
      tool_choice: "auto"
    });

    if ('choices' in response) {
      console.log('Response:', response.choices[0].message.content);
    }

  } catch (error) {
    console.error('Error with custom tools:', error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example of direct tool execution
 */
async function exampleDirectToolExecution(): Promise<void> {
  console.log('\n=== Example: Direct Tool Execution ===');
  
  const client = new HelpingAI({
    apiKey: "your-api-key"
  });

  try {
    // Direct tool execution without going through chat completion
    const tipResult = await client.call('calculateTip', { 
      billAmount: 50, 
      tipPercentage: 20 
    });
    console.log('Tip calculation result:', tipResult);

    const weatherResult = await client.call('getWeather', { 
      city: 'London', 
      units: 'celsius' 
    });
    console.log('Weather result:', weatherResult);

  } catch (error) {
    console.error('Error with direct tool execution:', error);
  } finally {
    await client.cleanup();
  }
}

// Main execution
async function main(): Promise<void> {
  console.log('=== HelpingAI Tool Calling Examples ===\n');

  // Example usage from Python version
  const userQuery = "https://huggingface.co/CharacterEcho/Rohit-Sharma tell me about downloads of this model";
  
  try {
    console.log('1. Basic Tool Calling Example:');
    const response = await generate(userQuery, true);
    console.log('\nFinal Response:');
    console.log('-'.repeat(50));
    console.log(response);

    // Additional examples
    await exampleWithCustomTools();
    await exampleDirectToolExecution();

  } catch (error) {
    console.error('Error in main:', error);
  }
}

// Run the example if this file is executed directly
// Note: This check works in Node.js environments
declare const require: any;
declare const module: any;

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

// Export functions for use in other modules
export { 
  generate, 
  calculateTip, 
  getWeather, 
  exampleWithCustomTools, 
  exampleDirectToolExecution 
};
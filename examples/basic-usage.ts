/**
 * Basic Usage Examples for HelpingAI JavaScript SDK
 *
 * This example demonstrates the fundamental features of the HelpingAI SDK:
 * - Client initialization
 * - Simple chat completions
 * - Parameter configuration
 * - Response handling
 * - Error handling
 */

import { HelpingAI } from '../src';

/**
 * Example 1: Simple Chat Completion
 */
async function basicChatCompletion(): Promise<void> {
  console.log('=== Example 1: Basic Chat Completion ===');

  // Initialize the client
  const client = new HelpingAI({
    apiKey: 'your-api-key', // Replace with your actual API key
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'system', content: 'You are an expert in emotional intelligence.' },
        { role: 'user', content: 'What makes a good leader?' },
      ],
    });

    if ('choices' in response) {
      console.log('Response:', response.choices[0].message.content);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 2: Chat Completion with Advanced Parameters
 */
async function advancedChatCompletion(): Promise<void> {
  console.log('\n=== Example 2: Advanced Parameters ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: 'Write a story about empathy' }],
      temperature: 0.7, // Controls randomness (0-1)
      max_tokens: 500, // Maximum length of response
      top_p: 0.9, // Nucleus sampling parameter
      frequency_penalty: 0.3, // Reduces repetition
      presence_penalty: 0.3, // Encourages new topics
      hide_think: true, // Filter out reasoning blocks
    });

    if ('choices' in response) {
      console.log('Story:', response.choices[0].message.content);
      console.log('\nUsage:', response.usage);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 3: Multiple Messages Conversation
 */
async function conversationExample(): Promise<void> {
  console.log('\n=== Example 3: Conversation ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  // Build a conversation
  const messages: Array<{
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
  }> = [
    { role: 'system', content: 'You are a helpful assistant with emotional intelligence.' },
    { role: 'user', content: "I'm feeling stressed about work." },
  ];

  try {
    // First response
    const response1 = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages,
    });

    if ('choices' in response1) {
      const assistantMessage = response1.choices[0].message.content;
      console.log('Assistant:', assistantMessage);

      // Add assistant's response to conversation
      messages.push({ role: 'assistant', content: assistantMessage || '' });

      // User follow-up
      messages.push({ role: 'user', content: 'What specific techniques can help?' });

      // Second response
      const response2 = await client.chat.completions.create({
        model: 'Dhanishtha-2.0-preview',
        messages,
      });

      if ('choices' in response2) {
        console.log('Assistant:', response2.choices[0].message.content);
      }
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 4: Different Models
 */
async function differentModelsExample(): Promise<void> {
  console.log('\n=== Example 4: Different Models ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  const prompt = 'Explain the concept of emotional intelligence in simple terms.';

  try {
    // Using Dhanishtha-2.0-preview (full reasoning model)
    console.log('Using Dhanishtha-2.0-preview:');
    const response1 = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: prompt }],
      hide_think: false, // Show reasoning process
    });

    if ('choices' in response1) {
      console.log('Response:', response1.choices[0].message.content);
    }

    // Using Dhanishtha-2.0-preview-mini (lightweight version)
    console.log('\nUsing Dhanishtha-2.0-preview-mini:');
    const response2 = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    if ('choices' in response2) {
      console.log('Response:', response2.choices[0].message.content);
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 5: Client Configuration Options
 */
async function clientConfigurationExample(): Promise<void> {
  console.log('\n=== Example 5: Client Configuration ===');

  // Advanced client configuration
  const client = new HelpingAI({
    apiKey: 'your-api-key',
    baseURL: 'https://api.helpingai.co/v1', // Custom base URL
    timeout: 30000, // Request timeout (30 seconds)
    organization: 'your-org-id', // Organization ID
    defaultHeaders: {
      // Custom headers
      'X-Custom-Header': 'custom-value',
    },
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: 'Hello, how are you?' }],
    });

    if ('choices' in response) {
      console.log('Response:', response.choices[0].message.content);
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 6: Error Handling Best Practices
 */
async function errorHandlingExample(): Promise<void> {
  console.log('\n=== Example 6: Error Handling ===');

  const client = new HelpingAI({
    apiKey: 'invalid-api-key', // Intentionally invalid for demonstration
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: 'This will fail due to invalid API key' }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle different types of errors
    if (error.name === 'AuthenticationError') {
      console.log('❌ Authentication failed - check your API key');
    } else if (error.name === 'RateLimitError') {
      console.log('❌ Rate limit exceeded - please wait before retrying');
      console.log(`   Retry after: ${error.retryAfter} seconds`);
    } else if (error.name === 'InvalidRequestError') {
      console.log('❌ Invalid request:', error.message);
    } else if (error.name === 'TimeoutError') {
      console.log('❌ Request timed out - try again later');
    } else {
      console.log('❌ Unexpected error:', error.message || error);
    }
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 7: Working with Models API
 */
async function modelsAPIExample(): Promise<void> {
  console.log('\n=== Example 7: Models API ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  try {
    // List all available models
    const models = await client.models.list();
    console.log('Available models:');
    models.data.forEach(model => {
      console.log(`- ${model.id}: ${model.description || 'No description'}`);
    });

    // Get specific model information
    const model = await client.models.retrieve('Dhanishtha-2.0-preview');
    console.log('\nModel details:');
    console.log(`Name: ${model.name || model.id}`);
    console.log(`Owner: ${model.owned_by}`);
    console.log(`Created: ${new Date(model.created * 1000).toISOString()}`);
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 8: Environment-based Configuration
 */
async function environmentConfigExample(): Promise<void> {
  console.log('\n=== Example 8: Environment Configuration ===');

  // The client will automatically use HAI_API_KEY environment variable if available
  const client = new HelpingAI(); // No explicit API key needed if env var is set

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: 'Test with environment configuration' }],
    });

    if ('choices' in response) {
      console.log('✅ Environment configuration working');
      console.log('Response:', response.choices[0].message.content);
    }
  } catch (error: any) {
    console.log('❌ Environment configuration failed:', error.message);
    console.log('💡 Set HAI_API_KEY environment variable or pass apiKey in constructor');
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 9: Response Inspection
 */
async function responseInspectionExample(): Promise<void> {
  console.log('\n=== Example 9: Response Inspection ===');

  const client = new HelpingAI({
    apiKey: 'your-api-key',
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: 'Tell me about artificial intelligence' }],
    });

    if ('choices' in response) {
      console.log('Response Details:');
      console.log(`- ID: ${response.id}`);
      console.log(`- Model: ${response.model}`);
      console.log(`- Created: ${new Date(response.created * 1000).toISOString()}`);
      console.log(`- Choices: ${response.choices.length}`);
      console.log(`- Finish Reason: ${response.choices[0].finish_reason}`);

      if (response.usage) {
        console.log('Token Usage:');
        console.log(`- Prompt tokens: ${response.usage.prompt_tokens}`);
        console.log(`- Completion tokens: ${response.usage.completion_tokens}`);
        console.log(`- Total tokens: ${response.usage.total_tokens}`);
      }

      console.log('\nContent:', response.choices[0].message.content);
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

// Main execution function
async function main(): Promise<void> {
  console.log('🚀 HelpingAI JavaScript SDK - Basic Usage Examples\n');
  console.log('⚠️  Remember to replace "your-api-key" with your actual API key');
  console.log('   Get your API key from: https://helpingai.co/dashboard\n');

  try {
    await basicChatCompletion();
    await advancedChatCompletion();
    await conversationExample();
    await differentModelsExample();
    await clientConfigurationExample();
    await errorHandlingExample();
    await modelsAPIExample();
    await environmentConfigExample();
    await responseInspectionExample();

    console.log('\n✅ All basic usage examples completed!');
    console.log('📚 Next steps:');
    console.log('   - Check out streaming.ts for streaming examples');
    console.log('   - See tool-calling.ts for tool usage');
    console.log('   - Explore mcp-integration.ts for MCP servers');
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
  basicChatCompletion,
  advancedChatCompletion,
  conversationExample,
  differentModelsExample,
  clientConfigurationExample,
  errorHandlingExample,
  modelsAPIExample,
  environmentConfigExample,
  responseInspectionExample,
};

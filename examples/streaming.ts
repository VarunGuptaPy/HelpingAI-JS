/**
 * Streaming Examples for HelpingAI JavaScript SDK
 * 
 * This example demonstrates streaming responses from the HelpingAI API:
 * - Basic streaming
 * - Server-sent events handling
 * - Error handling in streams
 * - Browser vs Node.js differences
 * - Stream processing techniques
 */

import { HelpingAI } from '../src';

/**
 * Example 1: Basic Streaming
 */
async function basicStreamingExample(): Promise<void> {
  console.log('=== Example 1: Basic Streaming ===');
  
  const client = new HelpingAI({
    apiKey: 'your-api-key'
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'Tell me a story about artificial intelligence and empathy' }
      ],
      stream: true,
      max_tokens: 500
    });

    console.log('📡 Starting stream...\n');
    
    let fullContent = '';
    
    // Process streaming response
    if (Symbol.asyncIterator in response) {
      for await (const chunk of response) {
        if (chunk.choices[0].delta.content) {
          const content = chunk.choices[0].delta.content;
          fullContent += content;
          
          // Print content as it arrives (simulating real-time display)
          console.log(content);
        }
        
        // Check if stream is complete
        if (chunk.choices[0].finish_reason) {
          console.log(`\n✅ Stream completed. Reason: ${chunk.choices[0].finish_reason}`);
          break;
        }
      }
    }
    
    console.log(`\n📊 Total characters received: ${fullContent.length}`);

  } catch (error: any) {
    console.error('❌ Streaming error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 2: Streaming with Progress Tracking
 */
async function streamingWithProgressExample(): Promise<void> {
  console.log('\n=== Example 2: Streaming with Progress ===');
  
  const client = new HelpingAI({
    apiKey: 'your-api-key'
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'Explain the importance of emotional intelligence in leadership' }
      ],
      stream: true,
      max_tokens: 300
    });

    console.log('📡 Starting stream with progress tracking...\n');
    
    let chunkCount = 0;
    let totalTokens = 0;
    let fullContent = '';
    const startTime = Date.now();
    
    if (Symbol.asyncIterator in response) {
      for await (const chunk of response) {
        chunkCount++;
        
        if (chunk.choices[0].delta.content) {
          const content = chunk.choices[0].delta.content;
          fullContent += content;
          
          // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
          totalTokens += Math.ceil(content.length / 4);
          
          // Show progress every 10 chunks
          if (chunkCount % 10 === 0) {
            const elapsed = (Date.now() - startTime) / 1000;
            console.log(`📊 Progress: ${chunkCount} chunks, ~${totalTokens} tokens, ${elapsed.toFixed(1)}s`);
          }
          
          console.log(content);
        }
        
        if (chunk.choices[0].finish_reason) {
          const elapsed = (Date.now() - startTime) / 1000;
          console.log(`\n✅ Stream completed in ${elapsed.toFixed(2)}s`);
          console.log(`📊 Final stats: ${chunkCount} chunks, ~${totalTokens} tokens`);
          break;
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Streaming error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 3: Streaming with Tool Calls
 */
async function streamingWithToolsExample(): Promise<void> {
  console.log('\n=== Example 3: Streaming with Tools ===');
  
  const client = new HelpingAI({
    apiKey: 'your-api-key'
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'What\'s 15 * 23 and can you search for information about emotional AI?' }
      ],
      tools: ['code_interpreter', 'web_search'],
      stream: true
    });

    console.log('📡 Starting stream with tools...\n');
    
    let fullContent = '';
    let toolCalls: any[] = [];
    
    if (Symbol.asyncIterator in response) {
      for await (const chunk of response) {
        // Handle content delta
        if (chunk.choices[0].delta.content) {
          const content = chunk.choices[0].delta.content;
          fullContent += content;
          console.log(content);
        }
        
        // Handle tool calls delta
        if (chunk.choices[0].delta.tool_calls) {
          console.log('🔧 Tool call detected in stream');
          toolCalls.push(...chunk.choices[0].delta.tool_calls);
        }
        
        if (chunk.choices[0].finish_reason) {
          console.log(`\n✅ Stream completed. Reason: ${chunk.choices[0].finish_reason}`);
          
          if (toolCalls.length > 0) {
            console.log(`🔧 ${toolCalls.length} tool calls were made during streaming`);
          }
          break;
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Streaming error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 4: Error Handling in Streams
 */
async function streamingErrorHandlingExample(): Promise<void> {
  console.log('\n=== Example 4: Stream Error Handling ===');
  
  const client = new HelpingAI({
    apiKey: 'invalid-key', // Intentionally invalid
    timeout: 5000 // Short timeout for demonstration
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'This will fail due to invalid API key' }
      ],
      stream: true
    });

    if (Symbol.asyncIterator in response) {
      for await (const chunk of response) {
        console.log('Received chunk:', chunk);
      }
    }

  } catch (error: any) {
    console.log('✅ Caught expected error:');
    
    if (error.name === 'AuthenticationError') {
      console.log('   - Authentication failed (invalid API key)');
    } else if (error.name === 'TimeoutError') {
      console.log('   - Request timed out');
    } else if (error.name === 'NetworkError') {
      console.log('   - Network connection failed');
    } else {
      console.log(`   - ${error.name}: ${error.message}`);
    }
    
    console.log('💡 Tip: Always handle errors when streaming');
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 5: Stream Processing with Buffering
 */
async function streamBufferingExample(): Promise<void> {
  console.log('\n=== Example 5: Stream Buffering ===');
  
  const client = new HelpingAI({
    apiKey: 'your-api-key'
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'Write a detailed explanation of machine learning' }
      ],
      stream: true,
      max_tokens: 400
    });

    console.log('📡 Starting buffered streaming...\n');
    
    let buffer = '';
    let sentenceCount = 0;
    
    if (Symbol.asyncIterator in response) {
      for await (const chunk of response) {
        if (chunk.choices[0].delta.content) {
          buffer += chunk.choices[0].delta.content;
          
          // Process complete sentences
          const sentences = buffer.split(/[.!?]+/);
          
          // Keep the last incomplete sentence in buffer
          buffer = sentences.pop() || '';
          
          // Process complete sentences
          for (const sentence of sentences) {
            if (sentence.trim()) {
              sentenceCount++;
              console.log(`[Sentence ${sentenceCount}] ${sentence.trim()}.`);
              console.log(''); // Add spacing
            }
          }
        }
        
        if (chunk.choices[0].finish_reason) {
          // Process any remaining content in buffer
          if (buffer.trim()) {
            sentenceCount++;
            console.log(`[Final] ${buffer.trim()}`);
          }
          
          console.log(`\n✅ Processed ${sentenceCount} sentences`);
          break;
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Streaming error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 6: Streaming with Custom Processing
 */
async function customStreamProcessingExample(): Promise<void> {
  console.log('\n=== Example 6: Custom Stream Processing ===');
  
  const client = new HelpingAI({
    apiKey: 'your-api-key'
  });

  try {
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'List 5 benefits of emotional intelligence' }
      ],
      stream: true
    });

    console.log('📡 Starting custom stream processing...\n');
    
    let fullContent = '';
    let wordCount = 0;
    let listItems: string[] = [];
    
    if (Symbol.asyncIterator in response) {
      for await (const chunk of response) {
        if (chunk.choices[0].delta.content) {
          const content = chunk.choices[0].delta.content;
          fullContent += content;
          
          // Count words
          const words = content.split(/\s+/).filter(word => word.length > 0);
          wordCount += words.length;
          
          // Extract list items (simple pattern matching)
          const lines = fullContent.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.match(/^\d+\.|^-|^\*/)) {
              if (!listItems.includes(trimmed)) {
                listItems.push(trimmed);
                console.log(`📝 Found list item: ${trimmed}`);
              }
            }
          }
          
          // Show real-time word count every 50 words
          if (wordCount > 0 && wordCount % 50 === 0) {
            console.log(`📊 Word count: ${wordCount}`);
          }
        }
        
        if (chunk.choices[0].finish_reason) {
          console.log(`\n✅ Stream completed`);
          console.log(`📊 Final word count: ${wordCount}`);
          console.log(`📝 List items found: ${listItems.length}`);
          break;
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Streaming error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 7: Streaming Performance Comparison
 */
async function streamingPerformanceExample(): Promise<void> {
  console.log('\n=== Example 7: Performance Comparison ===');
  
  const client = new HelpingAI({
    apiKey: 'your-api-key'
  });

  const prompt = 'Explain the role of empathy in artificial intelligence development';

  try {
    // Non-streaming request
    console.log('🔄 Testing non-streaming...');
    const startNonStream = Date.now();
    
    const nonStreamResponse = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      max_tokens: 200
    });
    
    const nonStreamTime = Date.now() - startNonStream;
    let nonStreamLength = 0;
    
    if ('choices' in nonStreamResponse) {
      nonStreamLength = nonStreamResponse.choices[0].message.content?.length || 0;
    }
    
    console.log(`✅ Non-streaming: ${nonStreamTime}ms, ${nonStreamLength} characters`);

    // Streaming request
    console.log('🔄 Testing streaming...');
    const startStream = Date.now();
    let firstChunkTime = 0;
    let streamLength = 0;
    
    const streamResponse = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: 200
    });

    if (Symbol.asyncIterator in streamResponse) {
      let isFirstChunk = true;
      
      for await (const chunk of streamResponse) {
        if (chunk.choices[0].delta.content) {
          if (isFirstChunk) {
            firstChunkTime = Date.now() - startStream;
            isFirstChunk = false;
          }
          streamLength += chunk.choices[0].delta.content.length;
        }
        
        if (chunk.choices[0].finish_reason) {
          break;
        }
      }
    }
    
    const totalStreamTime = Date.now() - startStream;
    
    console.log(`✅ Streaming: ${totalStreamTime}ms total, ${firstChunkTime}ms to first chunk, ${streamLength} characters`);
    
    console.log('\n📊 Performance Analysis:');
    console.log(`   - Time to first content: ${firstChunkTime}ms (streaming advantage)`);
    console.log(`   - Total time difference: ${totalStreamTime - nonStreamTime}ms`);
    console.log(`   - Streaming provides faster perceived response time`);

  } catch (error: any) {
    console.error('❌ Performance test error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

/**
 * Example 8: Browser vs Node.js Streaming Differences
 */
async function crossPlatformStreamingExample(): Promise<void> {
  console.log('\n=== Example 8: Cross-Platform Streaming ===');
  
  const client = new HelpingAI({
    apiKey: 'your-api-key'
  });

  try {
    console.log('🌐 Platform detection:');
    
    // Detect environment
    const isBrowser = typeof window !== 'undefined';
    const isNode = typeof globalThis !== 'undefined' && (globalThis as any).process?.versions?.node;
    
    console.log(`   - Browser: ${isBrowser}`);
    console.log(`   - Node.js: ${isNode}`);
    
    const response = await client.chat.completions.create({
      model: 'Dhanishtha-2.0-preview',
      messages: [
        { role: 'user', content: 'Explain how streaming works differently in browsers vs Node.js' }
      ],
      stream: true,
      max_tokens: 300
    });

    console.log('📡 Starting cross-platform streaming...\n');
    
    if (Symbol.asyncIterator in response) {
      for await (const chunk of response) {
        if (chunk.choices[0].delta.content) {
          const content = chunk.choices[0].delta.content;
          
          // Platform-specific output handling
          if (isBrowser) {
            // In browser, we might update DOM elements
            console.log(`[Browser] ${content}`);
          } else {
            // In Node.js, we can write to stdout
            console.log(`[Node.js] ${content}`);
          }
        }
        
        if (chunk.choices[0].finish_reason) {
          console.log('\n✅ Cross-platform streaming completed');
          break;
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Cross-platform streaming error:', error.message || error);
  } finally {
    await client.cleanup();
  }
}

// Main execution function
async function main(): Promise<void> {
  console.log('🌊 HelpingAI JavaScript SDK - Streaming Examples\n');
  console.log('⚠️  Remember to replace "your-api-key" with your actual API key');
  console.log('   Get your API key from: https://helpingai.co/dashboard\n');

  try {
    await basicStreamingExample();
    await streamingWithProgressExample();
    await streamingWithToolsExample();
    await streamingErrorHandlingExample();
    await streamBufferingExample();
    await customStreamProcessingExample();
    await streamingPerformanceExample();
    await crossPlatformStreamingExample();

    console.log('\n✅ All streaming examples completed!');
    console.log('📚 Key takeaways:');
    console.log('   - Streaming provides faster perceived response time');
    console.log('   - Always handle errors in streaming scenarios');
    console.log('   - Buffer content for better user experience');
    console.log('   - Consider platform differences (Browser vs Node.js)');

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
  basicStreamingExample,
  streamingWithProgressExample,
  streamingWithToolsExample,
  streamingErrorHandlingExample,
  streamBufferingExample,
  customStreamProcessingExample,
  streamingPerformanceExample,
  crossPlatformStreamingExample
};
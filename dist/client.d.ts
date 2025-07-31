/**
 * Main HelpingAI client implementation
 */
import { HelpingAIConfig, ChatCompletionRequest, ChatCompletionResponse, ChatCompletionChunk, Model, ModelList } from './types';
export declare class HelpingAI {
    private config;
    private mcpManager?;
    constructor(config?: HelpingAIConfig);
    /**
     * Chat completions API
     */
    chat: {
        completions: {
            create: (request: ChatCompletionRequest) => Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>>;
        };
    };
    /**
     * Models API
     */
    models: {
        list: () => Promise<ModelList>;
        retrieve: (modelId: string) => Promise<Model>;
    };
    /**
     * Direct tool execution method
     */
    call(toolName: string, args: Record<string, any>): Promise<any>;
    /**
     * Create chat completion
     */
    private createChatCompletion;
    /**
     * Process tools configuration
     */
    private processTools;
    /**
     * Create non-streaming completion
     */
    private createNonStreamingCompletion;
    /**
     * Create streaming completion
     */
    private createStreamingCompletion;
    /**
     * Create async iterable from chunks
     */
    private createAsyncIterable;
    /**
     * Execute built-in tool
     */
    private executeBuiltinTool;
    /**
     * List available models
     */
    private listModels;
    /**
     * Retrieve specific model
     */
    private retrieveModel;
    /**
     * Make HTTP request
     */
    private makeRequest;
    /**
     * Get request headers
     */
    private getHeaders;
    /**
     * Cleanup resources
     */
    cleanup(): Promise<void>;
}
export { HelpingAI as HAI };
//# sourceMappingURL=client.d.ts.map
/**
 * Web Search Tool for HelpingAI SDK
 *
 * This tool provides real-time web search functionality using the Snapzion Search API,
 * inspired by Qwen-Agent's web search capabilities.
 */
import { BuiltinToolBase, BuiltinToolConfig, ToolParameters } from './base';
export interface SearchResult {
    title: string;
    snippet: string;
    url: string;
    source: string;
    position: number;
}
export interface SnapzionResponse {
    organic_results?: Array<{
        title?: string;
        snippet?: string;
        link?: string;
        source?: string;
        position?: number;
    }>;
}
/**
 * Advanced web search tool using Snapzion Search API.
 *
 * This tool allows searching the web for real-time information with high-quality
 * results including titles, snippets, links, and source information.
 */
export declare class WebSearchTool extends BuiltinToolBase {
    readonly name = "web_search";
    readonly description = "Search the web for real-time information using advanced search API. Returns comprehensive search results with titles, snippets, links, and source information.";
    readonly parameters: ToolParameters;
    constructor(config?: BuiltinToolConfig);
    /**
     * Execute web search using Snapzion Search API.
     *
     * @param kwargs - Parameters containing query and optional max_results
     * @returns Formatted search results with titles, snippets, links, and sources
     */
    execute(kwargs: Record<string, any>): Promise<string>;
    /**
     * Perform search using Snapzion Search API.
     *
     * @param query - Search query
     * @param maxResults - Maximum number of results to return
     * @returns List of search result objects
     */
    private searchSnapzion;
    /**
     * Format search results for display.
     *
     * @param results - Array of search results
     * @param query - Original search query
     * @returns Formatted results string
     */
    private formatResults;
}
//# sourceMappingURL=web_search.d.ts.map
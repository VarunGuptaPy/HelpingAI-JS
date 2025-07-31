/**
 * Web Search Tool for HelpingAI SDK
 *
 * This tool provides real-time web search functionality using the Snapzion Search API,
 * inspired by Qwen-Agent's web search capabilities.
 */
import { BuiltinToolBase } from './base';
/**
 * Advanced web search tool using Snapzion Search API.
 *
 * This tool allows searching the web for real-time information with high-quality
 * results including titles, snippets, links, and source information.
 */
export class WebSearchTool extends BuiltinToolBase {
    constructor(config = {}) {
        super(config);
        this.name = 'web_search';
        this.description = 'Search the web for real-time information using advanced search API. Returns comprehensive search results with titles, snippets, links, and source information.';
        this.parameters = {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query to look up on the web',
                },
                max_results: {
                    type: 'integer',
                    description: 'Maximum number of search results to return (default: 5, max: 10)',
                    default: 5,
                    minimum: 1,
                    maximum: 10,
                },
            },
            required: ['query'],
        };
        this.initialize();
    }
    /**
     * Execute web search using Snapzion Search API.
     *
     * @param kwargs - Parameters containing query and optional max_results
     * @returns Formatted search results with titles, snippets, links, and sources
     */
    async execute(kwargs) {
        this.validateParameters(kwargs);
        const query = kwargs.query;
        const maxResults = Math.min(kwargs.max_results || 5, 10); // Cap at 10 results
        if (!query.trim()) {
            return 'No search query provided.';
        }
        try {
            // Perform the search using Snapzion API
            const results = await this.searchSnapzion(query, maxResults);
            if (!results || results.length === 0) {
                return `No search results found for query: ${query}`;
            }
            // Format results
            const formattedResults = this.formatResults(results, query);
            return formattedResults;
        }
        catch (error) {
            return `Search failed: ${error instanceof Error ? error.message : String(error)}. Please try again or rephrase your query.`;
        }
    }
    /**
     * Perform search using Snapzion Search API.
     *
     * @param query - Search query
     * @param maxResults - Maximum number of results to return
     * @returns List of search result objects
     */
    async searchSnapzion(query, maxResults) {
        try {
            const fetch = (await import('cross-fetch')).default;
            // Snapzion Search API endpoint
            const url = 'https://search.snapzion.com/get-snippets';
            // Prepare the request data
            const requestData = JSON.stringify({ query });
            // Make the request
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'HelpingAI-SDK/1.0',
                },
                body: requestData,
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const responseData = await response.json();
            // Extract organic results
            const organicResults = responseData.organic_results || [];
            const results = [];
            for (const result of organicResults.slice(0, maxResults)) {
                const formattedResult = {
                    title: result.title || 'No title',
                    snippet: result.snippet || 'No description available',
                    url: result.link || '',
                    source: result.source || 'Unknown',
                    position: result.position || 0,
                };
                results.push(formattedResult);
            }
            return results;
        }
        catch (error) {
            // Fallback to a simple error result
            return [
                {
                    title: `Search Error: ${query}`,
                    snippet: `Unable to perform web search. Error: ${error instanceof Error ? error.message : String(error)}. Please try again or rephrase your query.`,
                    url: '',
                    source: 'System',
                    position: 1,
                },
            ];
        }
    }
    /**
     * Format search results for display.
     *
     * @param results - Array of search results
     * @param query - Original search query
     * @returns Formatted results string
     */
    formatResults(results, query) {
        const formatted = [`Web search results for: '${query}'\n`];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const index = i + 1;
            const title = result.title || 'No title';
            const snippet = result.snippet || 'No description available';
            const url = result.url || '';
            const source = result.source || 'Unknown';
            const position = result.position || index;
            formatted.push(`${index}. **${title}**`);
            formatted.push(`   ${snippet}`);
            if (url) {
                formatted.push(`   🔗 URL: ${url}`);
            }
            formatted.push(`   📍 Source: ${source}`);
            if (position) {
                formatted.push(`   📊 Position: #${position}`);
            }
            formatted.push(''); // Empty line for separation
        }
        return formatted.join('\n');
    }
}
//# sourceMappingURL=web_search.js.map
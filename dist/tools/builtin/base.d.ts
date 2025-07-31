/**
 * Base class for built-in tools inspired by Qwen-Agent.
 *
 * This module provides the base infrastructure for implementing built-in tools
 * that are compatible with the HelpingAI tools framework.
 */
export interface BuiltinToolConfig {
    workDir?: string;
    timeout?: number;
    [key: string]: any;
}
export interface ToolParameters {
    type: string;
    properties: Record<string, any>;
    required?: string[];
}
/**
 * Base class for built-in tools.
 *
 * This class provides common functionality for built-in tools including
 * file handling, parameter validation, and integration with HelpingAI's tool framework.
 */
export declare abstract class BuiltinToolBase {
    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly parameters: ToolParameters;
    protected config: BuiltinToolConfig;
    protected workDir: string;
    constructor(config?: BuiltinToolConfig);
    /**
     * Initialize the tool after construction (called by subclasses)
     */
    protected initialize(): void;
    /**
     * Execute the tool with given parameters.
     *
     * @param kwargs - Tool parameters
     * @returns Tool execution result as string
     * @throws ToolExecutionError if execution fails
     */
    abstract execute(kwargs: Record<string, any>): Promise<string>;
    /**
     * Convert this built-in tool to a function that can be used with HelpingAI's tool framework.
     *
     * @returns Function that can be executed
     */
    toFunction(): (kwargs: Record<string, any>) => Promise<string>;
    /**
     * Get tool definition in OpenAI format
     */
    getToolDefinition(): {
        type: "function";
        function: {
            name: string;
            description: string;
            parameters: ToolParameters;
        };
    };
    /**
     * Validate tool parameters against schema.
     *
     * @param params - Parameters to validate
     * @throws Error if validation fails
     */
    protected validateParameters(params: Record<string, any>): void;
    /**
     * Ensure working directory exists
     */
    private ensureWorkDir;
    /**
     * Download a file from URL to working directory.
     *
     * @param url - URL to download from
     * @param filename - Optional filename, will be inferred from URL if not provided
     * @returns Path to downloaded file
     * @throws ToolExecutionError if download fails
     */
    protected downloadFile(url: string, filename?: string): Promise<string>;
    /**
     * Read file content as text.
     *
     * @param filePath - Path to file or URL
     * @returns File content as string
     * @throws ToolExecutionError if reading fails
     */
    protected readFile(filePath: string): Promise<string>;
    /**
     * Write content to file in working directory.
     *
     * @param content - Content to write
     * @param filename - Filename
     * @returns Path to written file
     * @throws ToolExecutionError if writing fails
     */
    protected writeFile(content: string, filename: string): string;
    /**
     * Clean up the working directory.
     */
    protected cleanupWorkDir(): void;
}
//# sourceMappingURL=base.d.ts.map
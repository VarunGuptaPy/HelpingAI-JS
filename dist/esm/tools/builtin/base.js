/**
 * Base class for built-in tools inspired by Qwen-Agent.
 *
 * This module provides the base infrastructure for implementing built-in tools
 * that are compatible with the HelpingAI tools framework.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { URL } from 'url';
import { ToolExecutionError } from '../../errors';
/**
 * Base class for built-in tools.
 *
 * This class provides common functionality for built-in tools including
 * file handling, parameter validation, and integration with HelpingAI's tool framework.
 */
export class BuiltinToolBase {
    constructor(config = {}) {
        this.config = config;
        // Set up working directory - use a default name for now
        const defaultWorkDir = path.join(os.tmpdir(), 'helpingai_tools', 'builtin_tool');
        this.workDir = this.config.workDir || defaultWorkDir;
        // Create working directory if it doesn't exist
        this.ensureWorkDir();
    }
    /**
     * Initialize the tool after construction (called by subclasses)
     */
    initialize() {
        // Update work directory with actual tool name
        if (!this.config.workDir) {
            this.workDir = path.join(os.tmpdir(), 'helpingai_tools', this.name);
            this.ensureWorkDir();
        }
        if (!this.name) {
            throw new Error(`Tool class ${this.constructor.name} must define a 'name' property`);
        }
        if (!this.description) {
            throw new Error(`Tool class ${this.constructor.name} must define a 'description' property`);
        }
    }
    /**
     * Convert this built-in tool to a function that can be used with HelpingAI's tool framework.
     *
     * @returns Function that can be executed
     */
    toFunction() {
        return async (kwargs) => {
            try {
                return await this.execute(kwargs);
            }
            catch (error) {
                throw new ToolExecutionError(`Failed to execute built-in tool '${this.name}': ${error instanceof Error ? error.message : String(error)}`, this.name);
            }
        };
    }
    /**
     * Get tool definition in OpenAI format
     */
    getToolDefinition() {
        return {
            type: 'function',
            function: {
                name: this.name,
                description: this.description,
                parameters: this.parameters,
            },
        };
    }
    /**
     * Validate tool parameters against schema.
     *
     * @param params - Parameters to validate
     * @throws Error if validation fails
     */
    validateParameters(params) {
        // Check required parameters
        const requiredParams = this.parameters.required || [];
        for (const param of requiredParams) {
            if (!(param in params)) {
                throw new Error(`Missing required parameter '${param}' for tool '${this.name}'`);
            }
        }
        // Check for unknown parameters
        const allowedParams = new Set(Object.keys(this.parameters.properties || {}));
        const providedParams = new Set(Object.keys(params));
        const unknownParams = [...providedParams].filter(p => !allowedParams.has(p));
        if (unknownParams.length > 0) {
            throw new Error(`Unknown parameters for tool '${this.name}': ${unknownParams.join(', ')}`);
        }
    }
    /**
     * Ensure working directory exists
     */
    ensureWorkDir() {
        try {
            if (!fs.existsSync(this.workDir)) {
                fs.mkdirSync(this.workDir, { recursive: true });
            }
        }
        catch (error) {
            throw new Error(`Failed to create working directory ${this.workDir}: ${error}`);
        }
    }
    /**
     * Download a file from URL to working directory.
     *
     * @param url - URL to download from
     * @param filename - Optional filename, will be inferred from URL if not provided
     * @returns Path to downloaded file
     * @throws ToolExecutionError if download fails
     */
    async downloadFile(url, filename) {
        try {
            const fetch = (await import('cross-fetch')).default;
            if (!filename) {
                const parsedUrl = new URL(url);
                filename = path.basename(parsedUrl.pathname) || 'downloaded_file';
            }
            const filePath = path.join(this.workDir, filename);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer();
            fs.writeFileSync(filePath, Buffer.from(buffer));
            return filePath;
        }
        catch (error) {
            throw new ToolExecutionError(`Failed to download file from ${url}: ${error instanceof Error ? error.message : String(error)}`, this.name);
        }
    }
    /**
     * Read file content as text.
     *
     * @param filePath - Path to file or URL
     * @returns File content as string
     * @throws ToolExecutionError if reading fails
     */
    async readFile(filePath) {
        try {
            if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                // Download the file first
                const localPath = await this.downloadFile(filePath);
                filePath = localPath;
            }
            return fs.readFileSync(filePath, 'utf-8');
        }
        catch (error) {
            throw new ToolExecutionError(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : String(error)}`, this.name);
        }
    }
    /**
     * Write content to file in working directory.
     *
     * @param content - Content to write
     * @param filename - Filename
     * @returns Path to written file
     * @throws ToolExecutionError if writing fails
     */
    writeFile(content, filename) {
        try {
            const filePath = path.join(this.workDir, filename);
            fs.writeFileSync(filePath, content, 'utf-8');
            return filePath;
        }
        catch (error) {
            throw new ToolExecutionError(`Failed to write file ${filename}: ${error instanceof Error ? error.message : String(error)}`, this.name);
        }
    }
    /**
     * Clean up the working directory.
     */
    cleanupWorkDir() {
        try {
            if (fs.existsSync(this.workDir)) {
                fs.rmSync(this.workDir, { recursive: true, force: true });
            }
        }
        catch (error) {
            // Ignore cleanup errors
            console.warn(`Failed to cleanup work directory: ${error}`);
        }
    }
}
//# sourceMappingURL=base.js.map
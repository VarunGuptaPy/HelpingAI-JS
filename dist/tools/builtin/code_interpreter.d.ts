/**
 * Code Interpreter Tool for HelpingAI SDK
 *
 * This tool provides Python code execution in a sandboxed environment,
 * inspired by Qwen-Agent's CodeInterpreter tool.
 */
import { BuiltinToolBase, BuiltinToolConfig, ToolParameters } from './base';
/**
 * Advanced Python code execution sandbox with data science capabilities.
 *
 * This tool provides a secure environment for executing Python code with built-in
 * support for data analysis, visualization, and scientific computing. Features
 * automatic plot saving, timeout protection, and comprehensive error handling.
 */
export declare class CodeInterpreterTool extends BuiltinToolBase {
    readonly name = "code_interpreter";
    readonly description = "Execute Python code in a secure sandboxed environment with support for data analysis, visualization, and computation. Includes popular libraries like matplotlib, pandas, numpy, and automatic plot saving.";
    readonly parameters: ToolParameters;
    private timeout;
    constructor(config?: BuiltinToolConfig);
    /**
     * Execute Python code.
     *
     * @param kwargs - Parameters containing code to execute
     * @returns Execution result including stdout, stderr, and generated images
     */
    execute(kwargs: Record<string, any>): Promise<string>;
    /**
     * Execute code using Node.js child process.
     *
     * @param code - Python code to execute
     * @returns Execution result
     */
    private executeCodeSimple;
    /**
     * Run Python script using child process.
     *
     * @param scriptFile - Path to Python script file
     * @returns Promise with stdout and stderr
     */
    private runPythonScript;
    /**
     * Prepare code with necessary imports and setup.
     *
     * @param code - Original code
     * @returns Prepared code with imports
     */
    private prepareCode;
    /**
     * Collect any images generated during code execution.
     *
     * @returns List of image result strings
     */
    private collectGeneratedImages;
    /**
     * Check if Python is available on the system.
     *
     * @throws Error if Python is not available
     */
    private checkPythonAvailability;
}
//# sourceMappingURL=code_interpreter.d.ts.map
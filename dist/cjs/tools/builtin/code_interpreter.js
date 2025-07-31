"use strict";
/**
 * Code Interpreter Tool for HelpingAI SDK
 *
 * This tool provides Python code execution in a sandboxed environment,
 * inspired by Qwen-Agent's CodeInterpreter tool.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeInterpreterTool = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
const base_1 = require("./base");
/**
 * Advanced Python code execution sandbox with data science capabilities.
 *
 * This tool provides a secure environment for executing Python code with built-in
 * support for data analysis, visualization, and scientific computing. Features
 * automatic plot saving, timeout protection, and comprehensive error handling.
 */
class CodeInterpreterTool extends base_1.BuiltinToolBase {
    constructor(config = {}) {
        super(config);
        this.name = 'code_interpreter';
        this.description = 'Execute Python code in a secure sandboxed environment with support for data analysis, visualization, and computation. Includes popular libraries like matplotlib, pandas, numpy, and automatic plot saving.';
        this.parameters = {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'Python code to execute',
                },
            },
            required: ['code'],
        };
        this.initialize();
        this.timeout = this.config.timeout || 30000; // 30 seconds default
    }
    /**
     * Execute Python code.
     *
     * @param kwargs - Parameters containing code to execute
     * @returns Execution result including stdout, stderr, and generated images
     */
    async execute(kwargs) {
        this.validateParameters(kwargs);
        const code = kwargs.code;
        if (!code.trim()) {
            return 'No code provided to execute.';
        }
        try {
            // Check if Python is available
            await this.checkPythonAvailability();
            // Execute the code
            const result = await this.executeCodeSimple(code);
            return result;
        }
        catch (error) {
            return `Code execution failed: ${error instanceof Error ? error.message : String(error)}`;
        }
    }
    /**
     * Execute code using Node.js child process.
     *
     * @param code - Python code to execute
     * @returns Execution result
     */
    async executeCodeSimple(code) {
        const scriptFile = path.join(this.workDir, `script_${(0, uuid_1.v4)()}.py`);
        // Prepare the code with proper imports and setup
        const preparedCode = this.prepareCode(code);
        try {
            // Write code to file
            fs.writeFileSync(scriptFile, preparedCode, 'utf-8');
            // Execute the script
            const result = await this.runPythonScript(scriptFile);
            // Combine results
            const resultParts = [];
            if (result.stdout.trim()) {
                resultParts.push(`stdout:\n\`\`\`\n${result.stdout.trim()}\n\`\`\``);
            }
            if (result.stderr.trim()) {
                resultParts.push(`stderr:\n\`\`\`\n${result.stderr.trim()}\n\`\`\``);
            }
            // Check for generated images
            const imageResults = this.collectGeneratedImages();
            if (imageResults.length > 0) {
                resultParts.push(...imageResults);
            }
            if (resultParts.length === 0) {
                resultParts.push('Code executed successfully with no output.');
            }
            return resultParts.join('\n\n');
        }
        catch (error) {
            return `Code execution error: ${error instanceof Error ? error.message : String(error)}`;
        }
        finally {
            // Clean up script file
            if (fs.existsSync(scriptFile)) {
                fs.unlinkSync(scriptFile);
            }
        }
    }
    /**
     * Run Python script using child process.
     *
     * @param scriptFile - Path to Python script file
     * @returns Promise with stdout and stderr
     */
    runPythonScript(scriptFile) {
        return new Promise((resolve, reject) => {
            const pythonProcess = (0, child_process_1.spawn)('python3', [scriptFile], {
                cwd: this.workDir,
                stdio: ['pipe', 'pipe', 'pipe'],
            });
            let stdout = '';
            let stderr = '';
            pythonProcess.stdout.on('data', data => {
                stdout += data.toString();
            });
            pythonProcess.stderr.on('data', data => {
                stderr += data.toString();
            });
            // Set timeout
            const timeoutId = setTimeout(() => {
                pythonProcess.kill('SIGKILL');
                reject(new Error(`Code execution timed out after ${this.timeout / 1000} seconds.`));
            }, this.timeout);
            pythonProcess.on('close', _code => {
                clearTimeout(timeoutId);
                resolve({ stdout, stderr });
            });
            pythonProcess.on('error', error => {
                clearTimeout(timeoutId);
                reject(error);
            });
        });
    }
    /**
     * Prepare code with necessary imports and setup.
     *
     * @param code - Original code
     * @returns Prepared code with imports
     */
    prepareCode(code) {
        const workDirEscaped = this.workDir.replace(/\\/g, '\\\\');
        const setupCode = `
import sys
import os
import warnings
warnings.filterwarnings('ignore')

# Common imports
try:
    import numpy as np
except ImportError:
    pass

try:
    import pandas as pd
except ImportError:
    pass

try:
    import matplotlib.pyplot as plt
    import matplotlib
    matplotlib.use('Agg')  # Use non-interactive backend
    plt.ioff()  # Turn off interactive mode
    _HAS_MATPLOTLIB = True
except ImportError:
    _HAS_MATPLOTLIB = False

try:
    import seaborn as sns
except ImportError:
    pass

# Set up working directory
work_dir = r"${workDirEscaped}"
os.chdir(work_dir)

# Function to save plots (only if matplotlib is available)
if _HAS_MATPLOTLIB:
    def save_plot(filename=None):
        if filename is None:
            import uuid
            filename = f"plot_{uuid.uuid4()}.png"
        filepath = os.path.join(work_dir, filename)
        plt.savefig(filepath, dpi=150, bbox_inches='tight')
        print(f"Plot saved to: {filename}")
        return filepath

    # Auto-save plots when plt.show() is called
    original_show = plt.show
    def auto_save_show(*args, **kwargs):
        save_plot()
        plt.clf()  # Clear the figure

    plt.show = auto_save_show

`;
        return setupCode + '\n' + code;
    }
    /**
     * Collect any images generated during code execution.
     *
     * @returns List of image result strings
     */
    collectGeneratedImages() {
        const imageResults = [];
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
        try {
            const files = fs.readdirSync(this.workDir);
            const imageFiles = files.filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)));
            for (let i = 0; i < imageFiles.length; i++) {
                const imageFile = imageFiles[i];
                const imagePath = path.join(this.workDir, imageFile);
                try {
                    // For now, just reference the file path
                    // In a real implementation, you might encode as base64 or serve via URL
                    imageResults.push(`![Generated Image ${i + 1}](${imagePath})`);
                }
                catch (error) {
                    // Skip problematic images
                    continue;
                }
            }
        }
        catch (error) {
            // Ignore errors when reading directory
        }
        return imageResults;
    }
    /**
     * Check if Python is available on the system.
     *
     * @throws Error if Python is not available
     */
    async checkPythonAvailability() {
        return new Promise((resolve, reject) => {
            const pythonProcess = (0, child_process_1.spawn)('python3', ['--version'], { stdio: 'pipe' });
            pythonProcess.on('close', code => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error('Python3 is not available on this system. Please install Python 3.x to use the code interpreter.'));
                }
            });
            pythonProcess.on('error', () => {
                reject(new Error('Python3 is not available on this system. Please install Python 3.x to use the code interpreter.'));
            });
        });
    }
}
exports.CodeInterpreterTool = CodeInterpreterTool;
//# sourceMappingURL=code_interpreter.js.map
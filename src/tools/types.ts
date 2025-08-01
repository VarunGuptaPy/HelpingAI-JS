/**
 * Types specific to the tools system
 */

import { Tool } from '../types';

export interface ToolDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  <T extends Function>(target: T): T & { _toolSchema?: Tool };
}

export interface ToolExecutionContext {
  toolName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arguments: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export interface ToolExecutionResult {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export interface BuiltinToolConfig {
  name: string;
  enabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: Record<string, any>;
}

export type BuiltinToolName = 'code_interpreter' | 'web_search';

export interface BuiltinToolExecutionResult {
  success: boolean;
  result: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

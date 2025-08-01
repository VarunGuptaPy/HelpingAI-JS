/**
 * JSON Schema generation utilities for tools
 */
/**
 * Generate JSON schema from function signature and JSDoc comments
 */
export function generateToolSchema(name, fn, description) {
    const functionString = fn.toString();
    const parameters = extractParameters(functionString);
    const docInfo = parseJSDoc(functionString);
    const schema = {
        type: 'function',
        function: {
            name,
            description: description || docInfo.description || `Function ${name}`,
            parameters: {
                type: 'object',
                properties: {},
                required: [],
            },
        },
    };
    // Build properties and required array
    parameters.forEach(param => {
        const paramDoc = docInfo.params[param.name];
        schema.function.parameters.properties[param.name] = {
            type: mapTypeToJsonSchema(param.type),
            description: paramDoc?.description || `Parameter ${param.name}`,
        };
        if (param.enum) {
            schema.function.parameters.properties[param.name].enum = param.enum;
        }
        if (param.required) {
            schema.function.parameters.required.push(param.name);
        }
    });
    return schema;
}
/**
 * Extract parameter information from function string
 */
function extractParameters(functionString) {
    const parameters = [];
    // Simple regex to extract parameters - this is a basic implementation
    // In a real implementation, you'd want to use a proper TypeScript parser
    const paramMatch = functionString.match(/\(([^)]*)\)/);
    if (!paramMatch)
        return parameters;
    const paramString = paramMatch[1];
    if (!paramString.trim())
        return parameters;
    const params = paramString.split(',').map(p => p.trim());
    params.forEach(param => {
        const info = parseParameter(param);
        if (info) {
            parameters.push(info);
        }
    });
    return parameters;
}
/**
 * Parse individual parameter
 */
function parseParameter(param) {
    // Handle TypeScript parameter syntax: name: type = default
    const match = param.match(/(\w+)(?:\s*:\s*([^=]+?))?(?:\s*=\s*(.+))?$/);
    if (!match)
        return null;
    const [, name, typeAnnotation, defaultValue] = match;
    return {
        name: name.trim(),
        type: typeAnnotation?.trim() || 'any',
        required: !defaultValue,
        default: defaultValue ? parseDefaultValue(defaultValue.trim()) : undefined,
    };
}
/**
 * Parse default value
 */
function parseDefaultValue(value) {
    if (value === 'undefined' || value === 'null')
        return null;
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    if (/^\d+$/.test(value))
        return parseInt(value, 10);
    if (/^\d*\.\d+$/.test(value))
        return parseFloat(value);
    if (value.startsWith('"') && value.endsWith('"'))
        return value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'"))
        return value.slice(1, -1);
    return value;
}
/**
 * Map TypeScript types to JSON Schema types
 */
function mapTypeToJsonSchema(type) {
    const cleanType = type.replace(/\s+/g, '').toLowerCase();
    if (cleanType.includes('string'))
        return 'string';
    if (cleanType.includes('number'))
        return 'number';
    if (cleanType.includes('boolean'))
        return 'boolean';
    if (cleanType.includes('array') || cleanType.includes('[]'))
        return 'array';
    if (cleanType.includes('object') || cleanType.includes('{}'))
        return 'object';
    return 'string'; // Default fallback
}
/**
 * Parse JSDoc comments from function string
 */
function parseJSDoc(functionString) {
    const result = {
        description: '',
        params: {},
    };
    // Extract JSDoc comment
    const jsdocMatch = functionString.match(/\/\*\*([\s\S]*?)\*\//);
    if (!jsdocMatch)
        return result;
    const jsdocContent = jsdocMatch[1];
    const lines = jsdocContent
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trim())
        .filter(line => line);
    let currentSection = 'description';
    const descriptionLines = [];
    lines.forEach(line => {
        if (line.startsWith('@param')) {
            currentSection = 'param';
            const paramMatch = line.match(/@param\s+(?:\{([^}]+)\}\s+)?(\w+)\s+(.+)/);
            if (paramMatch) {
                const [, type, name, description] = paramMatch;
                result.params[name] = { description, type };
            }
        }
        else if (line.startsWith('@')) {
            currentSection = 'other';
        }
        else if (currentSection === 'description') {
            descriptionLines.push(line);
        }
    });
    result.description = descriptionLines.join(' ').trim();
    return result;
}
/**
 * Validate tool arguments against schema
 */
export function validateToolArguments(tool, args) {
    const errors = [];
    const schema = tool.function.parameters;
    // Check required parameters
    if (schema.required) {
        schema.required.forEach((param) => {
            if (!(param in args)) {
                errors.push(`Missing required parameter: ${param}`);
            }
        });
    }
    // Basic type checking
    Object.entries(args).forEach(([key, value]) => {
        const propSchema = schema.properties[key];
        if (!propSchema) {
            errors.push(`Unknown parameter: ${key}`);
            return;
        }
        const expectedType = propSchema.type;
        const actualType = typeof value;
        if (expectedType === 'number' && actualType !== 'number') {
            errors.push(`Parameter ${key} should be a number, got ${actualType}`);
        }
        else if (expectedType === 'string' && actualType !== 'string') {
            errors.push(`Parameter ${key} should be a string, got ${actualType}`);
        }
        else if (expectedType === 'boolean' && actualType !== 'boolean') {
            errors.push(`Parameter ${key} should be a boolean, got ${actualType}`);
        }
        else if (expectedType === 'array' && !Array.isArray(value)) {
            errors.push(`Parameter ${key} should be an array`);
        }
        else if (expectedType === 'object' && (actualType !== 'object' || Array.isArray(value))) {
            errors.push(`Parameter ${key} should be an object`);
        }
        // Check enum values
        if (propSchema.enum && !propSchema.enum.includes(value)) {
            errors.push(`Parameter ${key} must be one of: ${propSchema.enum.join(', ')}`);
        }
    });
    return {
        valid: errors.length === 0,
        errors,
    };
}
//# sourceMappingURL=schema.js.map
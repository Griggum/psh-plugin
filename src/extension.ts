import * as vscode from 'vscode';

/**
 * Enhanced Python Syntax Highlighter Extension
 * 
 * This extension provides custom syntax highlighting for Python files with
 * support for naming conventions (camelCase, PascalCase) and library-specific
 * function highlighting (NumPy, Pandas, etc.).
 */

interface HighlighterConfig {
    enableCamelCase: boolean;
    enablePascalCase: boolean;
    enableLibraryFunctions: boolean;
    camelCaseColor: string;
    pascalCaseColor: string;
    numpyColor: string;
    pandasColor: string;
    autoApplySettings: boolean;
}

interface TextMateRule {
    name: string;
    scope: string[];
    settings: {
        foreground?: string;
        fontStyle?: string;
    };
}

interface TokenColorCustomizations {
    textMateRules?: TextMateRule[];
    [key: string]: any;
}

interface ImportMapping {
    alias: string;
    module: string;
    isFrom: boolean; // true for "from X import Y", false for "import X as Y"
}

class PythonSemanticTokenProvider implements vscode.DocumentSemanticTokensProvider {
    private highlighterManager: PythonHighlighterManager;
    
    static readonly legend = new vscode.SemanticTokensLegend([
        'function', 'variable', 'class', 'namespace', 'keyword'
    ], ['declaration', 'definition', 'readonly']);
    
    constructor(highlighterManager: PythonHighlighterManager) {
        this.highlighterManager = highlighterManager;
    }
    
    provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        // Only analyze Python files
        if (document.languageId !== 'python') {
            return null;
        }
        
        // Ensure document is analyzed
        this.highlighterManager.analyzeDocumentImports(document);
        
        const tokensBuilder = new vscode.SemanticTokensBuilder(PythonSemanticTokenProvider.legend);
        const analyzer = this.highlighterManager.getAnalyzerForDocument(document);
        
        if (!analyzer) {
            return tokensBuilder.build();
        }
        
        // Only process specific patterns, don't override everything
        const text = document.getText();
        const lines = text.split('\n');
        
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            if (token.isCancellationRequested) {
                return null;
            }
            
            // Only process lines that might contain our patterns
            const line = lines[lineIndex];
            if (this.shouldProcessLine(line)) {
                this.processLine(line, lineIndex, tokensBuilder, analyzer);
            }
        }
        
        return tokensBuilder.build();
    }
    
    /**
     * Check if a line should be processed for semantic tokens
     */
    private shouldProcessLine(line: string): boolean {
        const trimmed = line.trim();
        // Skip empty lines, comments, strings
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
            return false;
        }
        
        // Only process lines that contain our patterns
        return (
            /\b[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\b/.test(line) || // camelCase
            /\b[A-Z][a-zA-Z0-9]*[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\b/.test(line) || // PascalCase
            /\b[a-zA-Z_][a-zA-Z0-9_]*\s*\.\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(line) || // module.function()
            /\b[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(line) // function()
        );
    }
    
    private processLine(
        lineText: string,
        lineIndex: number,
        tokensBuilder: vscode.SemanticTokensBuilder,
        analyzer: DocumentAnalyzer
    ): void {
        // Skip comments and strings (basic check)
        if (lineText.trim().startsWith('#')) {
            return;
        }
        
        // Process naming conventions (camelCase, PascalCase)
        this.processNamingConventions(lineText, lineIndex, tokensBuilder);
        
        // Process module.function() calls
        this.processModuleFunctionCalls(lineText, lineIndex, tokensBuilder, analyzer);
        
        // Process direct function calls (from imports)
        this.processDirectFunctionCalls(lineText, lineIndex, tokensBuilder, analyzer);
    }
    
    private processNamingConventions(
        lineText: string,
        lineIndex: number,
        tokensBuilder: vscode.SemanticTokensBuilder
    ): void {
        // Find camelCase identifiers
        const camelCaseRegex = /\b([a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*)\b/g;
        let match;
        
        while ((match = camelCaseRegex.exec(lineText)) !== null) {
            const startChar = match.index;
            const length = match[0].length;
            tokensBuilder.push(lineIndex, startChar, length, this.getTokenType('camelCaseVar'), 0);
        }
        
        // Find PascalCase identifiers
        const pascalCaseRegex = /\b([A-Z][a-zA-Z0-9]*[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*)\b/g;
        
        while ((match = pascalCaseRegex.exec(lineText)) !== null) {
            const startChar = match.index;
            const length = match[0].length;
            tokensBuilder.push(lineIndex, startChar, length, this.getTokenType('pascalCaseVar'), 0);
        }
    }
    
    private processModuleFunctionCalls(
        lineText: string,
        lineIndex: number,
        tokensBuilder: vscode.SemanticTokensBuilder,
        analyzer: DocumentAnalyzer
    ): void {
        // Find module.function() patterns
        const moduleCallRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\.\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s*(?=\()/g;
        let match;
        
        while ((match = moduleCallRegex.exec(lineText)) !== null) {
            const [fullMatch, moduleName, functionName] = match;
            const moduleStart = match.index;
            const moduleLength = moduleName.length;
            
            // Find where the function name starts in the full match
            const functionStart = moduleStart + fullMatch.indexOf(functionName);
            const functionLength = functionName.split('.')[0].length; // Only highlight the first part
            
            // Determine token types based on import analysis
            if (analyzer.isAliasForModule(moduleName, 'numpy')) {
                tokensBuilder.push(lineIndex, moduleStart, moduleLength, this.getTokenType('numpyModule'), 0);
                tokensBuilder.push(lineIndex, functionStart, functionLength, this.getTokenType('numpyFunction'), 0);
            } else if (analyzer.isAliasForModule(moduleName, 'pandas')) {
                // Check if it's a class constructor
                const isClass = this.isPandasClass(functionName.split('.')[0]);
                tokensBuilder.push(lineIndex, moduleStart, moduleLength, this.getTokenType('pandasModule'), 0);
                tokensBuilder.push(
                    lineIndex, 
                    functionStart, 
                    functionLength, 
                    this.getTokenType(isClass ? 'pandasClass' : 'pandasFunction'), 
                    0
                );
            } else if (this.isKnownLibraryModule(moduleName)) {
                tokensBuilder.push(lineIndex, moduleStart, moduleLength, this.getTokenType('libraryModule'), 0);
                tokensBuilder.push(lineIndex, functionStart, functionLength, this.getTokenType('libraryFunction'), 0);
            }
        }
    }
    
    private processDirectFunctionCalls(
        lineText: string,
        lineIndex: number,
        tokensBuilder: vscode.SemanticTokensBuilder,
        analyzer: DocumentAnalyzer
    ): void {
        // Find function() calls that might be direct imports
        const functionCallRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g;
        let match;
        
        while ((match = functionCallRegex.exec(lineText)) !== null) {
            const functionName = match[1];
            const startChar = match.index;
            const length = functionName.length;
            
            // Check if this function is a known import
            for (const [alias, mapping] of analyzer.getAllMappings()) {
                if (alias === functionName && mapping.isFrom) {
                    if (mapping.module === 'numpy' || mapping.module.endsWith('.numpy')) {
                        tokensBuilder.push(lineIndex, startChar, length, this.getTokenType('numpyFunction'), 0);
                        break;
                    } else if (mapping.module === 'pandas' || mapping.module.endsWith('.pandas')) {
                        tokensBuilder.push(lineIndex, startChar, length, this.getTokenType('pandasFunction'), 0);
                        break;
                    } else if (this.isKnownLibraryModule(mapping.module)) {
                        tokensBuilder.push(lineIndex, startChar, length, this.getTokenType('libraryFunction'), 0);
                        break;
                    }
                }
            }
        }
    }
    
    private isPandasClass(functionName: string): boolean {
        const pandasClasses = ['DataFrame', 'Series', 'Index', 'Panel', 'TimeSeries', 'Categorical', 'Timestamp', 'Timedelta', 'Period', 'Interval'];
        return pandasClasses.includes(functionName);
    }
    
    private isKnownLibraryModule(moduleName: string): boolean {
        const knownLibraries = ['matplotlib', 'pyplot', 'sklearn', 'tensorflow', 'torch', 'pytorch'];
        return knownLibraries.some(lib => moduleName.includes(lib));
    }
    
    private getTokenType(tokenTypeName: string): number {
        // Map our token type names to indices
        const tokenTypes = [
            'numpyFunction', 'numpyModule', 'pandasFunction', 'pandasModule', 'pandasClass',
            'camelCaseVar', 'pascalCaseVar', 'libraryFunction', 'libraryModule'
        ];
        return tokenTypes.indexOf(tokenTypeName);
    }
}

class DocumentAnalyzer {
    private importMappings: Map<string, ImportMapping> = new Map();
    
    /**
     * Parse document to find import statements and track aliases
     */
    analyzeDocument(document: vscode.TextDocument): void {
        this.importMappings.clear();
        
        const text = document.getText();
        const lines = text.split('\n');
        
        for (const line of lines) {
            this.parseImportLine(line.trim());
        }
    }
    
    /**
     * Parse a single line for import statements
     */
    private parseImportLine(line: string): void {
        // Match: import numpy as np
        const importAsMatch = line.match(/^import\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (importAsMatch) {
            const [, module, alias] = importAsMatch;
            this.importMappings.set(alias, { alias, module, isFrom: false });
            return;
        }
        
        // Match: import numpy
        const importMatch = line.match(/^import\s+([a-zA-Z_][a-zA-Z0-9_.]*)/);
        if (importMatch) {
            const [, module] = importMatch;
            const moduleName = module.split('.').pop() || module;
            this.importMappings.set(moduleName, { alias: moduleName, module, isFrom: false });
            return;
        }
        
        // Match: from pandas import read_csv, isna as is_nan
        const fromImportMatch = line.match(/^from\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s+import\s+(.+)/);
        if (fromImportMatch) {
            const [, module, imports] = fromImportMatch;
            const importList = imports.split(',').map(imp => imp.trim());
            
            for (const imp of importList) {
                const asMatch = imp.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
                if (asMatch) {
                    const [, original, alias] = asMatch;
                    this.importMappings.set(alias, { alias, module, isFrom: true });
                } else {
                    // Direct import
                    const cleanImp = imp.replace(/[^\w]/g, '');
                    if (cleanImp) {
                        this.importMappings.set(cleanImp, { alias: cleanImp, module, isFrom: true });
                    }
                }
            }
        }
    }
    
    /**
     * Get the module for a given alias
     */
    getModuleForAlias(alias: string): string | undefined {
        return this.importMappings.get(alias)?.module;
    }
    
    /**
     * Get all mappings for debugging
     */
    getAllMappings(): Map<string, ImportMapping> {
        return this.importMappings;
    }
    
    /**
     * Check if an alias maps to a specific module
     */
    isAliasForModule(alias: string, module: string): boolean {
        const mapping = this.importMappings.get(alias);
        return mapping ? mapping.module === module || mapping.module.endsWith('.' + module) : false;
    }
}

class PythonHighlighterManager {
    private config: vscode.WorkspaceConfiguration;
    private documentAnalyzer: DocumentAnalyzer;
    private documentAnalyzers: Map<string, DocumentAnalyzer> = new Map();
    
    constructor() {
        this.config = vscode.workspace.getConfiguration('pythonHighlighter');
        this.documentAnalyzer = new DocumentAnalyzer();
    }
    
    /**
     * Get current configuration
     */
    getConfig(): HighlighterConfig {
        return {
            enableCamelCase: this.config.get('enableCamelCase', true),
            enablePascalCase: this.config.get('enablePascalCase', true),
            enableLibraryFunctions: this.config.get('enableLibraryFunctions', true),
            camelCaseColor: this.config.get('camelCaseColor', '#4EC9B0'),
            pascalCaseColor: this.config.get('pascalCaseColor', '#FF8C00'),
            numpyColor: this.config.get('numpyColor', '#4A9EFF'),
            pandasColor: this.config.get('pandasColor', '#DA70D6'),
            autoApplySettings: this.config.get('autoApplySettings', true)
        };
    }
    
    /**
     * Analyze document for imports and update highlighting
     */
    analyzeDocumentImports(document: vscode.TextDocument): void {
        if (document.languageId !== 'python') return;
        
        const analyzer = new DocumentAnalyzer();
        analyzer.analyzeDocument(document);
        this.documentAnalyzers.set(document.uri.toString(), analyzer);
        
        // Auto-apply if enabled
        const config = this.getConfig();
        if (config.autoApplySettings) {
            this.applyHighlighting();
        }
    }
    
    /**
     * Get analyzer for a specific document
     */
    getAnalyzerForDocument(document: vscode.TextDocument): DocumentAnalyzer | undefined {
        return this.documentAnalyzers.get(document.uri.toString());
    }
    
    /**
     * Generate TextMate rules based on configuration and discovered imports
     * NOTE: These rules work alongside semantic tokens for comprehensive highlighting
     */
    generateTextMateRules(): any[] {
        const config = this.getConfig();
        const rules: any[] = [];
        
        if (config.enableCamelCase) {
            rules.push({
                name: "Python camelCase Variables",
                scope: ["variable.camelcase.python"],
                settings: {
                    foreground: config.camelCaseColor,
                    fontStyle: ""
                }
            });
        }
        
        if (config.enablePascalCase) {
            rules.push({
                name: "Python PascalCase Variables", 
                scope: ["variable.pascalcase.python"],
                settings: {
                    foreground: config.pascalCaseColor,
                    fontStyle: "bold"
                }
            });
        }
        
        if (config.enableLibraryFunctions) {
            // Add base library function rules
            rules.push(
                {
                    name: "NumPy Functions",
                    scope: ["support.function.numpy.python"],
                    settings: {
                        foreground: config.numpyColor,
                        fontStyle: "italic"
                    }
                },
                {
                    name: "NumPy Module",
                    scope: ["support.module.numpy.python"],
                    settings: {
                        foreground: this.lightenColor(config.numpyColor, 0.3),
                        fontStyle: ""
                    }
                },
                {
                    name: "Pandas Functions",
                    scope: ["support.function.pandas.python"],
                    settings: {
                        foreground: config.pandasColor,
                        fontStyle: "italic"
                    }
                },
                {
                    name: "Pandas Module",
                    scope: ["support.module.pandas.python"],
                    settings: {
                        foreground: this.lightenColor(config.pandasColor, 0.2),
                        fontStyle: ""
                    }
                },
                {
                    name: "Pandas Classes",
                    scope: ["support.class.pandas.python"],
                    settings: {
                        foreground: this.lightenColor(config.pandasColor, 0.4),
                        fontStyle: "bold"
                    }
                },
                {
                    name: "Generic Library Functions",
                    scope: ["support.function.library.python"],
                    settings: {
                        foreground: "#DCDCAA",
                        fontStyle: "italic"
                    }
                },
                {
                    name: "Generic Library Modules",
                    scope: ["support.module.library.python"],
                    settings: {
                        foreground: "#F0E68C",
                        fontStyle: ""
                    }
                }
            );
            
            // Add dynamic rules based on discovered imports
            rules.push(...this.generateDynamicImportRules(config));
        }
        
        return rules;
    }
    
    /**
     * Generate dynamic rules based on discovered import aliases
     */
    private generateDynamicImportRules(config: HighlighterConfig): any[] {
        const dynamicRules: any[] = [];
        
        // Collect all aliases from all analyzed documents
        for (const analyzer of this.documentAnalyzers.values()) {
            for (const [alias, mapping] of analyzer.getAllMappings()) {
                // Skip standard aliases (already handled by grammar)
                if (['np', 'pd', 'plt', 'numpy', 'pandas', 'matplotlib'].includes(alias)) {
                    continue;
                }
                
                // Create dynamic rules for custom aliases
                if (analyzer.isAliasForModule(alias, 'numpy')) {
                    dynamicRules.push({
                        name: `Custom NumPy Alias (${alias})`,
                        scope: [`entity.name.function.python`],
                        settings: {
                            foreground: config.numpyColor,
                            fontStyle: "italic"
                        }
                    });
                    dynamicRules.push({
                        name: `Custom NumPy Module (${alias})`,
                        scope: [`support.type.python`],
                        settings: {
                            foreground: this.lightenColor(config.numpyColor, 0.3),
                            fontStyle: ""
                        }
                    });
                } else if (analyzer.isAliasForModule(alias, 'pandas')) {
                    dynamicRules.push({
                        name: `Custom Pandas Alias (${alias})`,
                        scope: [`entity.name.function.python`],
                        settings: {
                            foreground: config.pandasColor,
                            fontStyle: "italic"
                        }
                    });
                    dynamicRules.push({
                        name: `Custom Pandas Module (${alias})`,
                        scope: [`support.type.python`],
                        settings: {
                            foreground: this.lightenColor(config.pandasColor, 0.2),
                            fontStyle: ""
                        }
                    });
                }
            }
        }
        
        return dynamicRules;
    }
    
    /**
     * Apply highlighting to current workspace
     */
    async applyHighlighting(): Promise<void> {
        try {
            const rules = this.generateTextMateRules();
            const workspaceConfig = vscode.workspace.getConfiguration();
            
            // Get existing token color customizations
            const existingCustomizations = workspaceConfig.get('editor.tokenColorCustomizations') as TokenColorCustomizations || {};
            
            // Merge our rules with existing ones, preserving non-Python rules
            const updatedCustomizations: TokenColorCustomizations = {
                ...existingCustomizations,
                textMateRules: [
                    ...(existingCustomizations.textMateRules || []).filter((rule: TextMateRule) => 
                        !rule.scope?.some((scope: string) => scope.includes('python'))
                    ),
                    ...rules
                ]
            };
            
            await workspaceConfig.update(
                'editor.tokenColorCustomizations',
                updatedCustomizations,
                vscode.ConfigurationTarget.Global
            );
            
            vscode.window.showInformationMessage('✅ Python Enhanced Highlighting applied successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`❌ Failed to apply highlighting: ${error}`);
        }
    }
    
    /**
     * Remove Python highlighting from current workspace
     */
    async removeHighlighting(): Promise<void> {
        try {
            const workspaceConfig = vscode.workspace.getConfiguration();
            const existingCustomizations = workspaceConfig.get('editor.tokenColorCustomizations') as TokenColorCustomizations || {};
            
            // Remove Python-related rules
            const updatedCustomizations: TokenColorCustomizations = {
                ...existingCustomizations,
                textMateRules: (existingCustomizations.textMateRules || []).filter((rule: TextMateRule) => 
                    !rule.scope?.some((scope: string) => scope.includes('python'))
                )
            };
            
            await workspaceConfig.update(
                'editor.tokenColorCustomizations',
                updatedCustomizations,
                vscode.ConfigurationTarget.Global
            );
            
            vscode.window.showInformationMessage('✅ Python Enhanced Highlighting removed successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`❌ Failed to remove highlighting: ${error}`);
        }
    }
    
    /**
     * Reset colors to defaults
     */
    async resetToDefaults(): Promise<void> {
        const defaults = {
            camelCaseColor: '#4EC9B0',
            pascalCaseColor: '#FF8C00',
            numpyColor: '#4A9EFF',
            pandasColor: '#DA70D6'
        };
        
        for (const [key, value] of Object.entries(defaults)) {
            await this.config.update(key, value, vscode.ConfigurationTarget.Global);
        }
        
        if (this.getConfig().autoApplySettings) {
            await this.applyHighlighting();
        }
        
        vscode.window.showInformationMessage('✅ Colors reset to defaults!');
    }
    
    /**
     * Show discovered import mappings for debugging
     */
    showImportMappings(): void {
        let output = "🔍 **Discovered Import Mappings**\n\n";
        
        if (this.documentAnalyzers.size === 0) {
            output += "No Python documents analyzed yet. Open a Python file to see import mappings.";
        } else {
            for (const [docUri, analyzer] of this.documentAnalyzers) {
                const mappings = analyzer.getAllMappings();
                if (mappings.size > 0) {
                    output += `📄 **${docUri}**\n`;
                    for (const [alias, mapping] of mappings) {
                        const type = mapping.isFrom ? "from import" : "import as";
                        output += `  • \`${alias}\` → \`${mapping.module}\` (${type})\n`;
                    }
                    output += "\n";
                } else {
                    output += `📄 **${docUri}** - No imports found\n\n`;
                }
            }
        }
        
        // Show in a new untitled document
        vscode.workspace.openTextDocument({
            content: output,
            language: 'markdown'
        }).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    }
    
    /**
     * Lighten a hex color by a given amount
     */
    private lightenColor(hex: string, amount: number): string {
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Enhanced Python Syntax Highlighter is now active!');
    
    const highlighterManager = new PythonHighlighterManager();
    
    // Register commands
    const commands = [
        vscode.commands.registerCommand('pythonHighlighter.applyHighlighting', () => {
            highlighterManager.applyHighlighting();
        }),
        
        vscode.commands.registerCommand('pythonHighlighter.removeHighlighting', () => {
            highlighterManager.removeHighlighting();
        }),
        
        vscode.commands.registerCommand('pythonHighlighter.openSettings', () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'pythonHighlighter');
        }),
        
        vscode.commands.registerCommand('pythonHighlighter.resetToDefaults', () => {
            highlighterManager.resetToDefaults();
        }),
        
        vscode.commands.registerCommand('pythonHighlighter.showImportMappings', () => {
            highlighterManager.showImportMappings();
        })
    ];
    
    // Watch for configuration changes
    const configWatcher = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('pythonHighlighter')) {
            const config = highlighterManager.getConfig();
            if (config.autoApplySettings) {
                highlighterManager.applyHighlighting();
            }
        }
    });
    
    // Watch for document changes to analyze imports
    const documentChangeWatcher = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'python') {
            highlighterManager.analyzeDocumentImports(event.document);
        }
    });
    
    // Watch for document opens to analyze imports
    const documentOpenWatcher = vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'python') {
            highlighterManager.analyzeDocumentImports(document);
        }
    });
    
    // Analyze currently open Python documents
    vscode.workspace.textDocuments.forEach(document => {
        if (document.languageId === 'python') {
            highlighterManager.analyzeDocumentImports(document);
        }
    });
    
    // TODO: Re-enable semantic token provider after fixing conflicts with base Python highlighting
    // const semanticTokenProvider = new PythonSemanticTokenProvider(highlighterManager);
    // const semanticTokenRegistration = vscode.languages.registerDocumentSemanticTokensProvider(
    //     { language: 'python' },
    //     semanticTokenProvider,
    //     PythonSemanticTokenProvider.legend
    // );
    
    // Auto-apply on activation if enabled
    const config = highlighterManager.getConfig();
    if (config.autoApplySettings) {
        highlighterManager.applyHighlighting();
    }
    
    // Add all disposables to context
    context.subscriptions.push(
        ...commands, 
        configWatcher, 
        documentChangeWatcher, 
        documentOpenWatcher
        // semanticTokenRegistration // TODO: Re-enable when semantic tokens fixed
    );
}

export function deactivate() {
    console.log('Enhanced Python Syntax Highlighter is now deactivated.');
} 
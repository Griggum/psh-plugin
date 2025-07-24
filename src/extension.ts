import * as vscode from 'vscode';

/**
 * Enhanced Python Syntax Highlighter Extension
 * 
 * This extension provides custom syntax highlighting for Python files with
 * support for naming conventions (camelCase, PascalCase) and library-specific
 * function highlighting (NumPy, Pandas, etc.).
 */

export function activate(context: vscode.ExtensionContext) {
    console.log('Enhanced Python Syntax Highlighter is now active!');
    
    // Register any commands or providers here in future versions
    // For now, the extension primarily works through TextMate grammar injection
    
    // Future: Add semantic token provider for advanced highlighting
    // Future: Add configuration commands
    
    const disposables: vscode.Disposable[] = [];
    
    // Add disposables to context
    context.subscriptions.push(...disposables);
}

export function deactivate() {
    console.log('Enhanced Python Syntax Highlighter is now deactivated.');
} 
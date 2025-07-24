# 🧩 Design Document: Custom Python Syntax Highlighter for VSCode

## Overview

This VSCode extension enhances Python syntax highlighting by recognizing advanced patterns not handled by the default grammar. It introduces custom coloring for identifier naming styles (`PascalCase`, `camelCase`) and package-specific function calls (e.g., `numpy.array()`, `pandas.read_csv()`), even when aliases or direct function imports are used.

---

## 🎯 Goals

- Extend Python syntax highlighting using **TextMate grammar** and **theme scopes**
- Distinguish:
  - `PascalCase` vs `camelCase` identifiers
  - Functions imported from key libraries like `numpy`, `pandas`, even if renamed
- Build a **maintainable and extensible** system
- Prepare for future **semantic token integration**

---

## 🛠️ Technical Design

### 1. Architecture Overview

```
VSCode
│
├── Language Grammar (TextMate)
│   └── syntaxes/python.tmLanguage.json
│
├── Theme Customization
│   └── themes/PythonHighlighter-color-theme.json
│
├── Extension Runtime (future)
│   └── extension/extension.ts
│
└── Configuration / Metadata
    └── package.json
```

---

### 2. Custom Grammar Rules

#### 🧠 Regex-based Pattern Matching

Using the TextMate engine, we define regex-based patterns with named scopes for identifiers and function calls.

#### a. Naming Style Detection

| Style       | Regex Pattern                                     | Scope                            |
|-------------|---------------------------------------------------|----------------------------------|
| `camelCase` | `\b[a-z]+(?:[A-Z][a-z0-9]+)+\b`                 | `variable.camelcase.python`      |
| `PascalCase`| `\b([A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)+)\b`       | `variable.pascalcase.python`     |

#### b. Library Function Highlighting

Supports:

- Standard imports: `import numpy as np`
- Direct function imports: `from pandas import isna`
- Renamed imports: `from pandas import isna as is_nan`

| Library  | Example Usages Covered                              | Scope                             |
|----------|------------------------------------------------------|-----------------------------------|
| NumPy    | `np.array()`, `npy.zeros()`                          | `support.function.numpy.python`   |
| Pandas   | `pandas.read_csv()`, `pd.merge()`, `is_nan()`        | `support.function.pandas.python`  |

---

### 3. Theme Definition

Custom colors and styles are defined in `themes/PythonHighlighter-color-theme.json`. This includes:

- Bright green for `camelCase`
- Orange bold for `PascalCase`
- Blue for NumPy functions
- Purple for Pandas functions

---

### 4. Extension Configuration (`package.json`)

- Registers the custom grammar for `.py` files
- Registers the theme
- Sets language configuration (indentation, brackets, etc.)

---

### 5. Future Feature: Semantic Token Provider

To support dynamic highlighting of functions based on their import origin, future versions will:

- Parse the Python AST or use a language server (e.g., Pyright)
- Detect renamed imports and usage
- Emit semantic tokens like `function.numpy`, `function.pandas`

---

## 🚀 Roadmap

| Milestone                          | Description                         |
|-----------------------------------|-------------------------------------|
| ✅ MVP                             | TextMate grammar + theme            |
| 🛠️ Configurable function rules    | Use JSON for user-defined patterns  |
| ⏭️ Semantic token provider         | Highlight based on AST / LSP data   |
| ⏭️ Extension UI                   | Webview for live config tweaking    |
| 🔍 Integration with Pyright       | Use real symbol resolution          |

---

## 🧪 Testing Plan

- Use `.py` test files covering all patterns
- Validate color changes in Extension Host
- Add fixtures in `/test-fixtures/`
- Optional: use screenshot diffing to verify styles

---

## 💡 Design Considerations

- **Maintainability**: Patterns are modular and scoped
- **Performance**: No runtime overhead in MVP (TextMate only)
- **Extensibility**: Ready for semantic tokens or config UI
- **User configurability**: Will support `.python-highlighter.json`

---

## 🧑‍💻 Contributing Guide

- Clone and run: `npm install && npm run watch`
- Launch dev host: `F5` in VSCode
- Edit files in `syntaxes/`, `themes/`, and test fixtures
- Submit PRs with sample `.py` files and screenshots

---

## 📎 Related Tools

- [VSCode Syntax Highlighting Guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
- [Tree-sitter Python Parser](https://github.com/tree-sitter/tree-sitter-python)
- [Microsoft Python TextMate Grammar](https://github.com/microsoft/vscode-python)

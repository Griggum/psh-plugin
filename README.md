# 🐍 Enhanced Python Syntax Highlighter

A VSCode/Cursor extension that provides advanced Python syntax highlighting with custom support for naming conventions and library-specific functions.

## ✨ Features

### 🎨 Naming Convention Highlighting
- **camelCase identifiers**: Highlighted in teal/green (e.g., `myVariable`, `someFunction`)
- **PascalCase identifiers**: Highlighted in orange/bold (e.g., `MyClass`, `SomeVariable`)
- **snake_case**: Uses default Python highlighting

### 📚 Library-Specific Function Highlighting
- **NumPy functions**: Blue/italic highlighting for functions like `np.array()`, `numpy.zeros()`
- **Pandas functions**: Purple/italic highlighting for functions like `pd.read_csv()`, `pandas.DataFrame()`
- **Library modules**: Special highlighting for module aliases (`np`, `pd`, `plt`)
- **Direct imports**: Recognizes functions imported directly from libraries

### 🔧 Supported Libraries
- **NumPy** (`np`, `numpy`)
- **Pandas** (`pd`, `pandas`)
- **Matplotlib** (`plt`, `matplotlib`)
- **Scikit-learn** (`sk`, `sklearn`)
- **TensorFlow** (`tf`, `tensorflow`)
- **PyTorch** (`torch`, `pytorch`)

## 🚀 Installation

### Method 1: From VSIX (Recommended)
1. Download the `.vsix` file from the releases
2. Open VSCode/Cursor
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Install from VSIX" and select the command
5. Choose the downloaded `.vsix` file

### Method 2: Development Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/sindresorhus/psh-plugin.git
   cd psh-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the extension:
   ```bash
   npm run compile
   ```

4. Press `F5` in VSCode to launch a new Extension Development Host window

## 🎯 Usage

### 🚀 **Automatic Setup (Recommended)**

1. **Install the extension** (`python-syntax-highlighter-1.0.1.vsix`)
2. **Open a Python file** (`.py`, `.pyi`, `.pyw`)
3. **Done!** The extension automatically provides semantic highlighting

**🔧 FIXED: Stable TextMate + Import Analysis**
- ✅ **Restored default Python highlighting** - All standard Python syntax works correctly
- ✅ **Enhanced alias detection** - Handles common aliases like `npy`, `dataframes`, etc.
- ✅ **Library function highlighting** - NumPy (blue), Pandas (purple) functions properly colored
- ✅ **Naming conventions** - camelCase (teal) and PascalCase (orange/bold) identifiers
- ✅ **Works with any theme** - Adds custom highlighting on top of your existing theme

### 🎛️ **Customization via VSCode Settings**

1. **Open Settings**: `Cmd/Ctrl + ,` → Search "Python Highlighter"
2. **Configure options**:
   - Toggle camelCase/PascalCase highlighting
   - Toggle library function highlighting  
   - Customize colors for each pattern type
   - Enable/disable auto-apply
3. **Changes apply instantly** (if auto-apply is enabled)

### 📋 **Command Palette Actions**

Press `Cmd/Ctrl + Shift + P` and search for:
- **`Apply Python Enhanced Highlighting`** - Manually apply settings
- **`Remove Python Enhanced Highlighting`** - Remove custom highlighting
- **`Open Highlighter Settings`** - Jump to extension settings
- **`Reset to Default Colors`** - Restore default color scheme
- **`Show Discovered Import Mappings`** - Debug: View detected import aliases

### 🎨 **Manual Configuration (Advanced)**

If you prefer manual control, see `example-settings.json` for copy-paste configuration.

### Example Highlighting

```python
import numpy as np
import pandas as pd

# PascalCase (orange/bold)
MyClass = "This will be orange and bold"
DataProcessor = "PascalCase variable"

# camelCase (teal/green)  
myVariable = "This will be teal/green"
someFunction = "camelCase variable"

# NumPy functions (blue/italic)
data = np.array([1, 2, 3])  # 'np' in light blue, 'array' in blue italic
zeros = np.zeros(10)

# Pandas functions (purple/italic)
df = pd.DataFrame({'A': [1, 2, 3]})  # 'pd' in light purple, 'DataFrame' in purple italic
csv_data = pd.read_csv('file.csv')
```

## ⚙️ Configuration

The extension works out of the box with any theme! You can customize it by:

1. **Using the example configuration** (see `example-settings.json`)
2. **Customizing colors** in your VSCode settings
3. **Creating theme-specific rules** for different themes

### Custom Color Configuration

#### For ANY Theme (Recommended):
Copy the contents of `example-settings.json` to your VSCode `settings.json`:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "variable.camelcase.python",
        "settings": {
          "foreground": "#4EC9B0"
        }
      },
      {
        "scope": "variable.pascalcase.python", 
        "settings": {
          "foreground": "#FF8C00",
          "fontStyle": "bold"
        }
      }
      // ... more rules
    ]
  }
}
```

#### For Specific Themes:
```json
{
  "editor.tokenColorCustomizations": {
    "[Dark+ (default dark)]": {
      "textMateRules": [
        { "scope": "variable.camelcase.python", "settings": { "foreground": "#4EC9B0" }}
      ]
    },
    "[Light+ (default light)]": {
      "textMateRules": [
        { "scope": "variable.camelcase.python", "settings": { "foreground": "#0066CC" }}
      ]
    }
  }
}
```

## 🔍 Scope Reference

| Pattern | Scope | Default Color |
|---------|-------|---------------|
| camelCase variables | `variable.camelcase.python` | Teal (#4EC9B0) |
| PascalCase variables | `variable.pascalcase.python` | Orange (#FF8C00) |
| NumPy functions | `support.function.numpy.python` | Blue (#569CD6) |
| NumPy modules | `support.module.numpy.python` | Light Blue (#4FC1FF) |
| Pandas functions | `support.function.pandas.python` | Purple (#C586C0) |
| Pandas modules | `support.module.pandas.python` | Light Purple (#DDA0DD) |
| Pandas classes | `support.class.pandas.python` | Bright Purple (#E6B3FF) |

## 🧪 Testing

Test the extension with the provided test file:

1. Open `test-fixtures/test_highlighting.py`
2. Verify that different patterns are highlighted correctly
3. Check that the colors match the expected scheme

## 🛠️ Development

### Building from Source

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package extension
npm run package
```

### Project Structure

```
psh-plugin/
├── package.json                              # Extension manifest
├── syntaxes/
│   └── python.tmLanguage.json               # TextMate grammar rules
├── themes/
│   └── PythonHighlighter-color-theme.json   # Custom color theme
├── test-fixtures/
│   └── test_highlighting.py                 # Test cases
└── language-configuration.json              # Language configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test with sample Python files
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [VSCode Syntax Highlighting Guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
- [TextMate Grammar Documentation](https://macromates.com/manual/en/language_grammars)
- [VSCode Theme Documentation](https://code.visualstudio.com/api/extension-guides/color-theme)

## 🐛 Issues & Support

- [Report bugs](https://github.com/sindresorhus/psh-plugin/issues)
- [Request features](https://github.com/sindresorhus/psh-plugin/issues)
- [View documentation](https://github.com/sindresorhus/psh-plugin/wiki)

---

Made with ❤️ for Python developers who love beautiful code highlighting! 
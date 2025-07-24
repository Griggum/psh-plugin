# Change Log

All notable changes to the "Enhanced Python Syntax Highlighter" extension will be documented in this file.

## [0.1.1] - 2024-01-15

### Fixed
- 🔧 **Default Python syntax highlighting restored** - Fixed grammar injection to extend rather than replace base Python highlighting
- 🎨 **Improved library-specific highlighting**:
  - NumPy and Pandas functions now have distinct colors (blue vs purple)
  - Fixed nested module calls like `np.random.normal()`
  - Better handling of direct imports and aliases like `is_nan`
- 🚀 **Pattern specificity improvements**:
  - Reordered patterns to prevent conflicts
  - Made library patterns more specific
  - Excluded numpy/pandas from generic library pattern

## [0.1.0] - 2024-01-15

### Added
- 🎨 **Naming Convention Highlighting**
  - camelCase identifiers highlighted in teal/green
  - PascalCase identifiers highlighted in orange/bold
  - Maintains default highlighting for snake_case

- 📚 **Library-Specific Function Highlighting**
  - NumPy functions and module highlighting (blue theme)
  - Pandas functions, classes, and module highlighting (purple theme)
  - Support for common library aliases (`np`, `pd`, `plt`, etc.)
  - Recognition of direct function imports

- 🔧 **Supported Libraries**
  - NumPy (`np`, `numpy`)
  - Pandas (`pd`, `pandas`) 
  - Matplotlib (`plt`, `matplotlib`)
  - Scikit-learn (`sk`, `sklearn`)
  - TensorFlow (`tf`, `tensorflow`)
  - PyTorch (`torch`, `pytorch`)

- 🎨 **Custom Theme**
  - "Python Enhanced Dark" theme optimized for custom highlighting
  - Carefully chosen colors for different pattern types
  - Maintains readability while enhancing code understanding

- 🧪 **Testing Infrastructure**
  - Comprehensive test fixtures covering all patterns
  - Example files demonstrating highlighting capabilities

- 📖 **Documentation**
  - Complete README with installation and usage instructions
  - Scope reference for customization
  - Development setup guide

### Technical Details
- Built with TextMate grammar injection for performance
- Uses regex pattern matching for identifier classification
- Modular grammar design for maintainability
- VSCode and Cursor compatible

---

## Future Roadmap

### Planned Features
- 🛠️ **Configurable Rules**: JSON-based user-defined patterns
- ⏭️ **Semantic Token Provider**: AST-based highlighting for renamed imports
- 🎮 **Extension UI**: Webview for live configuration tweaking
- 🔍 **LSP Integration**: Enhanced symbol resolution with Pyright

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). 
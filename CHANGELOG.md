# Change Log

All notable changes to the "Enhanced Python Syntax Highlighter" extension will be documented in this file.

## [1.0.1] - 2024-01-15

### 🔧 **Critical Fixes**
- ✅ **Restored default Python highlighting** - Fixed semantic token provider conflicts
- ✅ **Fixed library function coloring** - numpy, pandas functions now color correctly
- ✅ **Improved alias detection** - Added more common alias patterns to grammar
- ✅ **Simplified architecture** - Reverted to proven TextMate + color customization approach

### 🚀 **Improvements**
- **Expanded alias support**: Now catches `npy`, `dataframes`, `df_lib`, and other common aliases
- **Better pattern matching**: Enhanced regex patterns for improved detection
- **Stable highlighting**: Removed experimental semantic tokens that caused conflicts
- **Performance**: Faster and more reliable highlighting

### 🛠️ **Technical Changes**
- Disabled semantic token provider (temporarily) to fix conflicts
- Enhanced TextMate grammar with expanded alias patterns
- Improved dynamic rule generation for custom aliases
- Better integration with existing color customization system

## [1.0.0] - 2024-01-15

### 🎉 **MAJOR RELEASE: Semantic Token Provider**
- 🧠 **Full Semantic Analysis**: Implemented comprehensive semantic token provider for ultimate accuracy
- 🔍 **Dynamic Import Tracking**: Real-time analysis of `import numpy as xyz` → `xyz.array()` highlighting
- ⚡ **Live Document Analysis**: Automatically detects and tracks any import alias
- 🎯 **Precise Highlighting**: Colors based on actual import analysis, not just pattern matching

### 🆕 **Revolutionary Features**
- **Semantic Token Provider**: VSCode's most advanced highlighting technology
- **Dynamic Alias Detection**: Handles any custom alias (`import pandas as xyz` → `xyz.read_csv()`)
- **Complex Import Support**: 
  - `import numpy as np` → `np.array()` (blue)
  - `from pandas import read_csv as rc` → `rc()` (purple)
  - `import tensorflow as tf` → `tf.constant()` (library colors)
- **Real-time Analysis**: Updates highlighting as you type and change imports
- **Debug Command**: `Show Discovered Import Mappings` to inspect detected aliases

### 🛠️ **Technical Architecture**
- **Semantic Tokens API**: Most accurate highlighting possible in VSCode
- **Document Analysis Engine**: Parses Python imports with regex patterns
- **Smart Token Classification**: 9 semantic token types with proper scoping
- **Performance Optimized**: Efficient line-by-line processing with cancellation support
- **Fallback Support**: TextMate grammar for basic patterns when semantic tokens unavailable

### 🎨 **Enhanced Highlighting Capabilities**
- **Any Import Alias**: `import numpy as xyz` → `xyz` gets numpy colors
- **Nested Module Calls**: `np.random.normal()` → both parts highlighted correctly
- **Direct Imports**: `from pandas import isna as is_nan` → `is_nan()` colored
- **Library Detection**: Automatic recognition of numpy, pandas, matplotlib, sklearn, tensorflow
- **Class vs Function**: Smart distinction between `pd.DataFrame` (class) vs `pd.read_csv` (function)

## [0.3.0] - 2024-01-15

### 🎉 Major Feature: Programmatic Configuration Management
- 🛠️ **No Manual Settings Required**: Extension automatically applies highlighting without copying to settings.json
- ⚙️ **Native VSCode Settings UI**: Configure colors and options directly in VSCode settings
- 🎮 **Built-in Commands**: Apply, remove, and reset highlighting via Command Palette
- 🔄 **Auto-Apply**: Changes to settings automatically update highlighting
- 🎨 **Smart Color Management**: Automatic color lightening for module names

### 🆕 New Features
- **Settings Panel**: Configure all options in VSCode Settings under "Python Highlighter"
- **Commands**:
  - `Apply Python Enhanced Highlighting` - Applies current settings to any theme
  - `Remove Python Enhanced Highlighting` - Removes custom highlighting
  - `Open Highlighter Settings` - Opens extension settings
  - `Reset to Default Colors` - Restores default color scheme
- **Configuration Options**:
  - Enable/disable camelCase, PascalCase, library highlighting individually
  - Custom colors for each pattern type
  - Auto-apply settings toggle

### 🛠️ Technical Improvements
- Full TypeScript implementation with proper typing
- Configuration watcher for real-time updates
- Smart merging with existing token color customizations
- Preserves non-Python highlighting rules

## [0.2.0] - 2024-01-15

### 🎉 Major Improvement: Theme Compatibility
- 🎨 **Theme-Agnostic Highlighting**: Extension now works with ANY VSCode theme!
- 🔧 **Removed Theme Override**: No longer overrides base Python syntax highlighting
- 📋 **Settings.json Configuration**: Added `example-settings.json` for easy setup with any theme
- 🎭 **Minimal Theme Option**: Optional minimal theme that only adds custom scopes
- ✨ **Better User Experience**: Users can keep their favorite theme and just add our custom highlighting

### 🛠️ Technical Changes
- Removed base Python syntax colors from custom theme
- Updated theme to only define custom scopes (camelCase, PascalCase, library functions)
- Added comprehensive configuration examples
- Updated documentation with two usage options

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
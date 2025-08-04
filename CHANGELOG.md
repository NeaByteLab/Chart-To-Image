# 📊 Changelog

All notable changes to the Chart-To-Image library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.4] - 2025-08-04

### 🚀 Added
- **Bollinger Bands Indicator**: Advanced volatility and trend analysis with custom colors and background fill
- **Complete Technical Suite**: VWAP, EMA, SMA, and Bollinger Bands working together
- **Advanced Color Customization**: Individual colors for upper, middle, and lower bands
- **Background Fill**: Configurable background fill between bands with opacity control
- **Multi-Chart Support**: Bollinger Bands on all chart types (candlestick, line, area, heikin-ashi, renko)
- **Comparison Integration**: Full Bollinger Bands support in comparison charts
- **CLI Integration**: `--bb` flag with comprehensive color options
- **API Support**: Programmatic access to Bollinger Bands with custom configurations

### 🎯 Features
- **Bollinger Bands Calculation**: Standard deviation-based volatility analysis
- **Custom Periods**: Configurable periods (default: 20) and standard deviations (default: 2)
- **Three-Band System**: Upper (resistance), Middle (SMA), Lower (support) bands
- **Advanced Styling**: Dashed lines for upper/lower bands, solid line for middle band
- **Background Fill**: Optional fill between bands with configurable opacity (0.0-1.0)
- **Color Customization**: Individual colors for each band and background fill
- **Professional Labels**: "BB(period)" labels with consistent styling
- **Complete Integration**: Works seamlessly with VWAP, EMA, and SMA indicators

### 🔧 Technical
- **BollingerBandsRenderer**: Dedicated renderer with split background/lines rendering
- **Split Rendering**: Background fill rendered before candlesticks, lines after
- **Type Safety**: Full TypeScript support for Bollinger Bands configurations
- **Performance**: Optimized calculations and rendering with proper coordinate mapping
- **Error Handling**: Robust validation for Bollinger Bands parameters
- **Comparison Support**: Full integration with ComparisonService and ComparisonConfig
- **CLI Integration**: Complete argument parsing for all Bollinger Bands options

### 📚 Documentation
- **README**: Updated with Bollinger Bands feature descriptions and examples
- **USAGE.md**: Comprehensive Bollinger Bands usage guide with all chart types
- **CLI Examples**: Command-line usage for basic and advanced Bollinger Bands
- **API Examples**: Programmatic Bollinger Bands integration
- **Comparison Examples**: Bollinger Bands in comparison charts
- **Color Examples**: Custom color combinations for different themes

### 🎨 Visual Enhancements
- **Professional Rendering**: Background fill appears behind candlesticks for proper layering
- **Custom Colors**: Individual control over upper, middle, lower band colors
- **Background Fill**: Configurable fill between bands with opacity control
- **Consistent Styling**: Dashed lines for resistance/support, solid for trend
- **Complete Suite**: All four indicators (VWAP, EMA, SMA, BB) working harmoniously
- **Multi-Chart Support**: Bollinger Bands on candlestick, line, area, heikin-ashi, renko charts

### 🎨 CLI Options
- `--bb`: Enable Bollinger Bands indicator
- `--bb-period <number>`: Custom period (default: 20)
- `--bb-standard-deviations <number>`: Standard deviations (default: 2)
- `--bb-upper-color <color>`: Upper band color
- `--bb-middle-color <color>`: Middle band color
- `--bb-lower-color <color>`: Lower band color
- `--bb-background-color <color>`: Background fill color
- `--bb-background-opacity <number>`: Background opacity (0.0-1.0)

### 🔄 Comparison Support
- **Side-by-Side**: Bollinger Bands in symbol comparison charts
- **Grid Layout**: Bollinger Bands in grid comparison layouts
- **Timeframe Comparison**: Bollinger Bands across different timeframes
- **Custom Colors**: Individual color customization in comparison charts
- **Background Fill**: Configurable background fill in comparison mode

### 📊 API Integration
```typescript
// Basic Bollinger Bands
const config = {
  showBollingerBands: true,
  bbPeriod: 20,
  bbStandardDeviations: 2
}

// Advanced with custom colors
const config = {
  showBollingerBands: true,
  bbPeriod: 20,
  bbStandardDeviations: 2,
  bbColors: {
    upper: '#ff6b9d',
    middle: '#4ecdc4',
    lower: '#ff6b9d',
    background: '#ff6b9d',
    backgroundOpacity: 0.2
  }
}
```

---

## [1.1.3] - 2025-08-04

### 🚀 Added
- **SMA Indicator**: Simple Moving Average with configurable periods
- **Complete Indicator Suite**: VWAP, EMA, and SMA working together on all chart types
- **Comparison Support**: All indicators available in comparison charts
- **CLI Integration**: `--sma` flag for SMA indicator activation
- **API Support**: Programmatic access to SMA indicator
- **Professional Quality**: Complete institutional-grade technical analysis toolkit

### 🎯 Features
- **SMA Calculation**: Simple arithmetic moving average with period customization
- **Multi-Chart Support**: SMA works on candlestick, line, area, heikin-ashi, renko, line-break
- **Comparison Charts**: SMA displays in side-by-side and grid layouts
- **Timeframe Analysis**: SMA across different timeframes
- **Custom Periods**: Configurable SMA periods (default: 20)
- **Visual Styling**: Teal SMA line with "SMA(period)" labels
- **Complete Suite**: Use VWAP, EMA, and SMA together for comprehensive analysis

### 🔧 Technical
- **SMARenderer**: Dedicated renderer for Simple Moving Average
- **Type Safety**: Full TypeScript support for SMA configurations
- **Performance**: Optimized SMA calculations and rendering
- **Error Handling**: Robust validation for SMA parameters
- **Integration**: Seamless integration with existing VWAP and EMA indicators
- **Position Fix**: Fixed indicator alignment with candle positions

### 📚 Documentation
- **README**: Updated with SMA feature descriptions
- **USAGE.md**: Comprehensive SMA usage guide
- **CLI Examples**: Command-line usage for SMA indicator
- **API Examples**: Programmatic SMA integration

### 🎨 Visual Enhancements
- **SMA Labels**: Clear "SMA(period)" labels
- **Line Styling**: Teal SMA lines with consistent colors
- **Complete Display**: VWAP, EMA, and SMA working together harmoniously
- **Professional Quality**: Complete institutional-grade indicator visualization
- **Perfect Alignment**: Fixed indicator positioning to match candle positions

---

## [1.1.2] - 2025-08-04

### 🚀 Added
- **EMA Indicator**: Exponential Moving Average with configurable periods
- **Combined Indicators**: VWAP and EMA working together on all chart types
- **Comparison Support**: Both indicators available in comparison charts
- **CLI Integration**: `--ema` flag for EMA indicator activation
- **API Support**: Programmatic access to EMA indicator
- **Professional Quality**: Institutional-grade technical analysis tools

### 🎯 Features
- **EMA Calculation**: Exponential moving average with period customization
- **Multi-Chart Support**: EMA works on candlestick, line, area, heikin-ashi, renko, line-break
- **Comparison Charts**: EMA displays in side-by-side and grid layouts
- **Timeframe Analysis**: EMA across different timeframes
- **Custom Periods**: Configurable EMA periods (default: 20)
- **Visual Styling**: Solid EMA line with "EMA(period)" labels
- **Combined with VWAP**: Use both indicators together for comprehensive analysis

### 🔧 Technical
- **EMARenderer**: Dedicated renderer for Exponential Moving Average
- **Type Safety**: Full TypeScript support for EMA configurations
- **Performance**: Optimized EMA calculations and rendering
- **Error Handling**: Robust validation for EMA parameters
- **Integration**: Seamless integration with existing VWAP indicator

### 📚 Documentation
- **README**: Updated with EMA feature descriptions
- **USAGE.md**: Comprehensive EMA usage guide
- **CLI Examples**: Command-line usage for EMA indicator
- **API Examples**: Programmatic EMA integration

### 🎨 Visual Enhancements
- **EMA Labels**: Clear "EMA(period)" labels
- **Line Styling**: Solid EMA lines with consistent colors
- **Combined Display**: EMA and VWAP working together harmoniously
- **Professional Quality**: Institutional-grade indicator visualization

---

## [1.1.1] - 2025-08-04

### 🚀 Added
- **VWAP Indicator**: Volume Weighted Average Price with institutional calculation
- **CLI Integration**: `--vwap` flag for VWAP indicator activation
- **API Support**: Programmatic access to VWAP indicator
- **Professional Quality**: Institutional-grade technical analysis tools

### 🎯 Features
- **VWAP Calculation**: Standard institutional formula (typical price × volume)
- **Multi-Chart Support**: VWAP works on candlestick, line, area, heikin-ashi, renko, line-break
- **Comparison Charts**: VWAP displays in side-by-side and grid layouts
- **Timeframe Analysis**: VWAP across different timeframes
- **Visual Styling**: Dashed VWAP line with "VWAP" labels
- **Volume Data**: Proper volume data handling for VWAP calculation

### 🔧 Technical
- **VWAPRenderer**: Dedicated renderer for Volume Weighted Average Price
- **Volume Data**: Proper volume data handling for VWAP calculation
- **Type Safety**: Full TypeScript support for VWAP configurations
- **Performance**: Optimized VWAP calculations and rendering
- **Error Handling**: Robust validation for VWAP parameters

### 📚 Documentation
- **README**: Updated with VWAP feature descriptions
- **USAGE.md**: Comprehensive VWAP usage guide
- **CLI Examples**: Command-line usage for VWAP indicator
- **API Examples**: Programmatic VWAP integration

### 🎨 Visual Enhancements
- **VWAP Labels**: Clear "VWAP" labels
- **Line Styling**: Dashed VWAP lines with consistent colors
- **Volume Removal**: Cleaner charts without noisy volume bars
- **Professional Quality**: Institutional-grade indicator visualization

---

## [1.1.0] - 2025-08-04

### 🚀 Added
- **Chart Comparison Feature**: Side-by-side and grid layouts for multiple symbols
- **Timeframe Comparison**: Compare same symbol across different timeframes
- **Comparison Customization**: Custom colors and themes for comparison charts
- **Grid Layout Support**: 2x1 grid layout for focused comparison
- **Comparison API**: `ComparisonService` for programmatic comparison generation
- **Enhanced CLI**: New `--compare`, `--layout`, `--columns`, `--timeframes` arguments
- **Error Handling**: Proper validation for comparison constraints (max 2 symbols/columns for grid)
- **Documentation**: Comprehensive comparison examples and usage guides
- **Visual Assets**: Professional comparison chart demos

### 🎯 Features
- **Symbol Comparison**: Compare different trading pairs side-by-side
- **Timeframe Analysis**: Same symbol across multiple timeframes (1m to 1d)
- **Grid Layout**: Organized 2-chart grid for correlation analysis
- **Custom Colors**: Apply custom bar colors to comparison charts
- **Theme Support**: Light/dark themes for comparison charts
- **All Chart Types**: Candlestick, Line, Area, Heikin-Ashi, Renko in comparisons

### 🔧 Technical
- **Modular Architecture**: New `ComparisonRenderer` and `ComparisonService` classes
- **Type Safety**: Full TypeScript support for comparison features
- **Performance**: Optimized rendering for multiple charts
- **Error Handling**: Robust validation and error messages
- **CLI Integration**: Seamless integration with existing CLI interface

### 📚 Documentation
- **README**: Updated with comparison features and visual examples
- **USAGE.md**: Comprehensive comparison usage guide
- **Visual Demos**: Professional comparison chart examples
- **API Examples**: Programmatic comparison usage

---

## [1.0.1] - 2025-08-04

### 🔧 Fixed
- **Package Size**: Reduced from 191.7 kB to 26.7 kB by excluding source files
- **Documentation**: Fixed duplicate PNG entries in USAGE.md
- **Build Process**: Clean TypeScript compilation with Terser minification

---

## [1.0.0] - 2025-08-04

### 🎉 Initial Release

#### ✨ Added
- **Core Chart Generation**: Convert trading data to high-quality images using Node.js Canvas
- **Multiple Chart Types**: 
  - Candlestick charts (traditional OHLC)
  - Line charts (trend visualization)
  - Area charts (filled price charts)
  - Heikin-Ashi charts (trend-smoothed candles)
  - Renko charts (price-based blocks)
- **Export Formats**: PNG and JPEG with configurable quality
- **Real Market Data**: Integration with CCXT for live exchange data
- **Multiple Exchanges**: Support for Binance, Kraken, Coinbase, and more
- **CLI Interface**: Command-line tool for quick chart generation
- **Programmatic API**: TypeScript library for integration

#### 🎨 Styling & Customization
- **Theme Support**: Light and dark themes
- **Custom Bar Colors**: Configurable bullish/bearish candle colors
- **Background Colors**: Hex, RGB, named colors, and CSS gradients
- **Text Colors**: Customizable text color for all elements
- **Horizontal Levels**: Support/resistance lines with custom styling
- **Watermarks**: Customizable text watermarks with positioning
- **Hide Elements**: Option to hide title, time axis, and grid

#### 📏 Scaling & Dimensions
- **Auto-scaling**: Automatic price range calculation
- **Manual Scaling**: X/Y axis scale factors
- **Custom Dimensions**: Configurable width and height
- **Price Limits**: Min/max price constraints

#### ⚡ Performance & Quality
- **Optimized Rendering**: Efficient canvas-based chart generation
- **Minified Build**: Compressed output for faster loading
- **TypeScript**: Full type safety and IntelliSense support
- **Error Handling**: Comprehensive error handling and validation

#### 🔧 Developer Experience
- **ESLint**: Code quality and consistency
- **Prettier**: Consistent code formatting
- **JSDoc**: Comprehensive documentation
- **Modular Architecture**: Clean separation of concerns

#### 📚 Documentation
- **README.md**: Complete project overview and quick start
- **USAGE.md**: Comprehensive usage guide with examples
- **CLI Help**: Detailed command-line help and examples
- **API Documentation**: Full TypeScript definitions

#### 🛠️ Technical Features
- **Node.js Canvas**: High-performance 2D graphics rendering
- **CCXT Integration**: Unified cryptocurrency exchange API
- **Buffer Export**: Direct buffer output for programmatic use
- **File Export**: Direct file system writing
- **Data URL**: Base64 encoded output for web applications

#### 🎯 CLI Features
- **Symbol Support**: All major trading pairs (BTC/USDT, ETH/USDT, etc.)
- **Timeframes**: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w
- **Exchange Selection**: Multiple exchange support
- **Batch Processing**: Multiple chart generation
- **Quality Control**: Configurable JPEG quality settings

#### 📦 Package Features
- **NPM Ready**: Proper package.json configuration
- **Global Installation**: CLI tool available globally
- **Type Definitions**: Complete TypeScript support
- **Minified Distribution**: Optimized for production use

### 🔧 Technical Implementation
- **Modular Architecture**: Separated renderer, config, and utilities
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Handling**: Multi-layer try-catch with structured results
- **Performance**: Optimized canvas operations and memory usage
- **Compatibility**: Node.js 18+ support with cross-platform compatibility

### 📖 Examples
```bash
# Basic chart generation
npx @neabyte/chart-to-image --symbol BTC/USDT --output chart.png

# Advanced customization
npx @neabyte/chart-to-image -s ETH/USDT -t 4h -o eth.png \
  --theme light --chart-type heikin-ashi \
  --custom-colors "bullish=#00ff88,bearish=#ff4444" \
  --levels "45000:#ff0000:solid:Resistance,40000:#00ff00:dotted:Support"

# Programmatic usage
import { quickChart } from '@neabyte/chart-to-image'
const result = await quickChart('BTC/USDT', 'chart.png', {
  timeframe: '1h',
  theme: 'dark',
  chartType: 'candlestick'
})
```

---

## Version History

### [1.0.0] - 2025-08-04
- 🎉 Initial release with full feature set
- 📊 5 chart types (candlestick, line, area, heikin-ashi, renko)
- 🎨 Complete customization options
- 🖼️ PNG and JPEG export formats
- 💻 CLI and programmatic API
- 📚 Comprehensive documentation

---

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
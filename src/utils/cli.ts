/**
 * CLI Utilities
 *
 * Command line interface utilities for parsing arguments, validating inputs,
 * and converting CLI options to chart configuration objects. Provides comprehensive
 * argument parsing with support for all chart generation options and features.
 */

import { ChartConfig } from '@/core/config'
import { ChartRenderer } from '@/core/renderer'

/**
 * Command line argument interface
 *
 * Defines the structure for all supported CLI arguments including required
 * parameters like symbol and timeframe, optional chart configuration options,
 * and advanced features like scaling, watermarks, and custom styling.
 */
export interface CLIArgs {
  symbol?: string
  symbols?: string[]
  timeframe?: string
  exchange?: string
  output?: string
  width?: number
  height?: number
  theme?: 'light' | 'dark'
  chartType?: string
  backgroundColor?: string
  textColor?: string
  customColors?: string
  levels?: string
  hideTitle?: boolean
  hideTimeAxis?: boolean
  hideGrid?: boolean
  showVWAP?: boolean
  showEMA?: boolean
  emaPeriod?: number
  autoScale?: boolean
  scaleX?: number
  scaleY?: number
  minScale?: number
  maxScale?: number
  fetch?: boolean
  limit?: number
  // Comparison options
  compare?: string
  layout?: 'side-by-side' | 'grid'
  columns?: number
  rows?: number
  gap?: number
  timeframes?: string
  // Legacy options
  title?: string
  watermark?: string
  watermarkPosition?: string
  watermarkColor?: string
  watermarkSize?: number
  watermarkOpacity?: number
  batch?: unknown[]
  help?: boolean
}

/**
 * Parses command line arguments from process.argv
 *
 * Processes all command line arguments and converts them into a structured
 * object. Supports both long and short argument formats with automatic
 * type conversion for numerical and boolean values. Handles unknown options
 * with appropriate warnings.
 *
 * @returns Parsed arguments object with all CLI options
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function parseArgs(): CLIArgs {
  const args = process.argv.slice(2)
  const parsed: CLIArgs = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]
    switch (arg) {
      case '--symbol':
      case '-s':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.symbol = nextArg
          i++
        }
        break
      case '--timeframe':
      case '-t':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.timeframe = nextArg
          i++
        }
        break
      case '--exchange':
      case '-e':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.exchange = nextArg
          i++
        }
        break
      case '--output':
      case '-o':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.output = nextArg
          i++
        }
        break
      case '--width':
      case '-w':
        if (nextArg && !nextArg.startsWith('-')) {
          const width = parseInt(nextArg)
          if (!isNaN(width)) {
            parsed.width = width
            i++
          }
        }
        break
      case '--height':
      case '-h':
        if (nextArg && !nextArg.startsWith('-')) {
          const height = parseInt(nextArg)
          if (!isNaN(height)) {
            parsed.height = height
            i++
          }
        }
        break
      case '--theme':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.theme = nextArg as 'light' | 'dark'
          i++
        }
        break
      case '--chart-type':
      case '--type':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.chartType = nextArg
          i++
        }
        break
      case '--scale-x':
        if (nextArg && !nextArg.startsWith('-')) {
          const scale = parseFloat(nextArg)
          if (!isNaN(scale)) {
            parsed.scaleX = scale
            i++
          }
        }
        break
      case '--scale-y':
        if (nextArg && !nextArg.startsWith('-')) {
          const scale = parseFloat(nextArg)
          if (!isNaN(scale)) {
            parsed.scaleY = scale
            i++
          }
        }
        break
      case '--auto-scale':
        parsed.autoScale = true
        break
      case '--min-scale':
        if (nextArg && !nextArg.startsWith('-')) {
          const scale = parseFloat(nextArg)
          if (!isNaN(scale)) {
            parsed.minScale = scale
            i++
          }
        }
        break
      case '--max-scale':
        if (nextArg && !nextArg.startsWith('-')) {
          const scale = parseFloat(nextArg)
          if (!isNaN(scale)) {
            parsed.maxScale = scale
            i++
          }
        }
        break
      case '--limit':
      case '-l':
        if (nextArg && !nextArg.startsWith('-')) {
          const limit = parseInt(nextArg)
          if (!isNaN(limit)) {
            parsed.limit = limit
            i++
          }
        }
        break
      case '--custom-colors':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.customColors = nextArg
          i++
        }
        break
      case '--levels':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.levels = nextArg
          i++
        }
        break
      case '--title':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.title = nextArg
          i++
        }
        break
      case '--watermark':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.watermark = nextArg
          i++
        }
        break
      case '--watermark-position':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.watermarkPosition = nextArg
          i++
        }
        break
      case '--watermark-color':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.watermarkColor = nextArg
          i++
        }
        break
      case '--watermark-size':
        if (nextArg && !nextArg.startsWith('-')) {
          const size = parseInt(nextArg)
          if (!isNaN(size)) {
            parsed.watermarkSize = size
            i++
          }
        }
        break
      case '--watermark-opacity':
        if (nextArg && !nextArg.startsWith('-')) {
          const opacity = parseFloat(nextArg)
          if (!isNaN(opacity)) {
            parsed.watermarkOpacity = opacity
            i++
          }
        }
        break
      case '--hide-title':
        parsed.hideTitle = true
        break
      case '--hide-time-axis':
        parsed.hideTimeAxis = true
        break
      case '--hide-grid':
        parsed.hideGrid = true
        break
      case '--vwap':
        parsed.showVWAP = true
        break
      case '--ema':
        parsed.showEMA = true
        parsed.emaPeriod = 20 // Default period
        break
      case '--background-color':
      case '--bg-color':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.backgroundColor = nextArg
          i++
        }
        break
      case '--text-color':
      case '--color':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.textColor = nextArg
          i++
        }
        break
      case '--fetch':
        parsed.fetch = true
        break
      case '--batch':
        parsed.batch = []
        break
      case '--help':
        parsed.help = true
        break
      // Comparison options
      case '--compare':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.compare = nextArg
          i++
        }
        break
      case '--layout':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.layout = nextArg as 'side-by-side' | 'grid'
          i++
        }
        break
      case '--columns':
        if (nextArg && !nextArg.startsWith('-')) {
          const columns = parseInt(nextArg)
          if (!isNaN(columns)) {
            parsed.columns = columns
            i++
          }
        }
        break
      case '--rows':
        if (nextArg && !nextArg.startsWith('-')) {
          const rows = parseInt(nextArg)
          if (!isNaN(rows)) {
            parsed.rows = rows
            i++
          }
        }
        break
      case '--gap':
        if (nextArg && !nextArg.startsWith('-')) {
          const gap = parseInt(nextArg)
          if (!isNaN(gap)) {
            parsed.gap = gap
            i++
          }
        }
        break
      case '--timeframes':
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.timeframes = nextArg
          i++
        }
        break
      default:
        if (arg.startsWith('-')) {
          console.warn(`Unknown option: ${arg}`)
        }
        break
    }
  }
  return parsed
}

/**
 * Validates parsed command line arguments
 *
 * Performs comprehensive validation of required arguments and their formats.
 * Checks for presence of mandatory parameters and provides clear error
 * messages for missing or invalid inputs.
 *
 * @param args - Parsed CLI arguments to validate
 * @returns True if all required arguments are present and valid
 */
export function validateArgs(args: CLIArgs): boolean {
  if (args.compare) {
    if (!args.output) {
      console.error('Error: Output path is required for comparison (--output or -o)')
      return false
    }
    return true
  }
  if (!args.symbol) {
    console.error('Error: Symbol is required (--symbol or -s)')
    return false
  }
  if (!args.timeframe) {
    console.error('Error: Timeframe is required (--timeframe or -t)')
    return false
  }
  if (!args.output) {
    console.error('Error: Output path is required (--output or -o)')
    return false
  }
  return true
}

/**
 * Displays comprehensive help information
 *
 * Shows detailed usage instructions, available options, and example commands.
 * Includes all supported parameters with descriptions and default values
 * for easy reference and troubleshooting.
 */
export function showHelp(): void {
  console.log(`
Chart To Image - Generate trading chart images

Usage: chart-to-image [options]

Required Options:
  --symbol, -s <symbol>           Trading symbol (e.g., BTC/USDT)
  --timeframe, -t <timeframe>     Timeframe (1m, 5m, 15m, 1h, 4h, 1d)
  --output, -o <path>             Output file path

Optional Options:
  --exchange, -e <exchange>       Exchange (default: binance)
  --width, -w <width>             Chart width (default: 1200)
  --height, -h <height>           Chart height (default: 800)
  --theme <theme>                 Theme: light or dark (default: dark)
  --chart-type, --type <type>     Chart type: candlestick, line, area, heikin-ashi, renko, line-break
  --scale-x <scale>               X-axis scale factor
  --scale-y <scale>               Y-axis scale factor
  --auto-scale                    Enable auto-scaling
  --min-scale <scale>             Minimum scale
  --max-scale <scale>             Maximum scale
  --limit, -l <limit>             Number of candles (default: 100)
  --custom-colors <colors>        Custom colors (format: type=color,type=color)
  --levels <levels>               Horizontal levels (format: value:color:style:label,value:color:style:label)
  --title <title>                 Chart title
  --watermark <text>              Watermark text
  --watermark-position <pos>      Watermark position: top-left, top-right, bottom-left, bottom-right, center
  --watermark-color <color>       Watermark color
  --watermark-size <size>         Watermark font size
  --watermark-opacity <op>        Watermark opacity (0-1)
  --hide-title                    Hide chart title
  --hide-time-axis                Hide time axis
  --hide-grid                     Hide grid
  --vwap                          Show VWAP indicator
  --ema                           Show EMA indicator (default: 20 period)
  --background-color <color>      Background color
  --text-color <color>            Text color
  --fetch                         Fetch fresh data
  --batch                         Batch mode
  --help                          Show this help

Examples:
  chart-to-image --symbol BTC/USDT --timeframe 1h --output chart.png
  chart-to-image -s ETH/USDT -t 4h -o eth.png --theme light --chart-type line
  chart-to-image -s BTC/USDT -t 1d -o btc.png --watermark "My Chart" --watermark-position center
`)
}

/**
 * Converts CLI arguments to chart configuration object
 *
 * Transforms parsed command line arguments into a complete chart configuration
 * with all options, defaults, and advanced features. Handles type conversion
 * and applies appropriate default values for missing parameters.
 *
 * @param args - Parsed CLI arguments
 * @returns Complete chart configuration object ready for rendering
 */
export function argsToConfig(args: CLIArgs): ChartConfig {
  const config: Record<string, unknown> = {
    symbol: args.symbol,
    timeframe: args.timeframe,
    exchange: args.exchange || 'binance',
    outputPath: args.output,
    width: args.width || 1200,
    height: args.height || 800,
    theme: args.theme || 'dark',
    chartType: args.chartType || 'candlestick',
    limit: args.limit || 100,
    fetch: args.fetch || false
  }
  addScalingOptions(config, args)
  addCustomColors(config, args)
  addHorizontalLevels(config, args)
  addTitle(config, args)
  addWatermark(config, args)
  addHideOptions(config, args)
  addColors(config, args)
  addComparisonOptions(config, args)
  return new ChartConfig(config)
}

/**
 * Adds chart scaling configuration options
 *
 * Processes scaling-related arguments and applies them to the configuration
 * object. Handles both manual scale factors and automatic scaling options.
 *
 * @param config - Configuration object to modify
 * @param args - CLI arguments containing scaling options
 */
function addScalingOptions(config: Record<string, unknown>, args: CLIArgs): void {
  if (args.scaleX !== undefined) config.scaleX = args.scaleX
  if (args.scaleY !== undefined) config.scaleY = args.scaleY
  if (args.autoScale) config.autoScale = true
  if (args.minScale !== undefined) config.minScale = args.minScale
  if (args.maxScale !== undefined) config.maxScale = args.maxScale
}

/**
 * Adds custom color configuration
 *
 * Parses custom color JSON string and applies it to the chart configuration.
 * Handles JSON parsing errors gracefully with appropriate warnings.
 *
 * @param config - Configuration object to modify
 * @param args - CLI arguments containing custom color options
 */
function addCustomColors(config: Record<string, unknown>, args: CLIArgs): void {
  if (args.customColors) {
    try {
      const colorParts = args.customColors.split(',')
      const customBarColors: Record<string, string> = {}
      colorParts.forEach(part => {
        const [type, color] = part.split('=')
        if (type && color) {
          customBarColors[type.trim()] = color.trim()
        }
      })
      if (Object.keys(customBarColors).length > 0) {
        config.customBarColors = customBarColors
      }
    } catch {
      console.warn('Invalid custom colors format. Use: type=color,type=color (e.g., bullish=#00ff88,bearish=#ff4444)')
    }
  }
}

/**
 * Adds horizontal support/resistance levels
 *
 * Parses horizontal levels JSON string and applies it to the chart configuration.
 * Handles JSON parsing errors gracefully with appropriate warnings.
 *
 * @param config - Configuration object to modify
 * @param args - CLI arguments containing level options
 */
function addHorizontalLevels(config: Record<string, unknown>, args: CLIArgs): void {
  if (args.levels) {
    try {
      const levelParts = args.levels.split(',')
      const horizontalLevels = levelParts.map(level => {
        const [value, color, lineStyle, label] = level.split(':')
        return {
          value: parseFloat(value),
          color: color,
          lineStyle: lineStyle as 'solid' | 'dotted',
          label: label,
          type: 'custom'
        }
      })
      if (horizontalLevels.length > 0) {
        config.horizontalLevels = horizontalLevels
      }
    } catch {
      console.warn(
        'Invalid levels format. Use: value:color:style:label,value:color:style:label (e.g., 45000:#ff0000:solid:Resistance,40000:#00ff00:dotted:Support)'
      )
    }
  }
}

/**
 * Adds chart title configuration
 *
 * Applies the specified title to the chart configuration if provided.
 *
 * @param config - Configuration object to modify
 * @param args - CLI arguments containing title option
 */
function addTitle(config: Record<string, unknown>, args: CLIArgs): void {
  if (args.title) {
    config.title = args.title
  }
}

/**
 * Adds watermark configuration
 *
 * Creates comprehensive watermark configuration object with all available
 * options including position, color, size, and opacity settings.
 *
 * @param config - Configuration object to modify
 * @param args - CLI arguments containing watermark options
 */
function addWatermark(config: Record<string, unknown>, args: CLIArgs): void {
  if (args.watermark) {
    config.watermark = {
      text: args.watermark,
      position: args.watermarkPosition || 'bottom-right',
      color: args.watermarkColor,
      fontSize: args.watermarkSize,
      opacity: args.watermarkOpacity
    }
  }
}

/**
 * Adds chart element visibility options
 *
 * Processes hide/show options for chart elements like title, time axis,
 * and grid. Applies appropriate boolean flags to control element visibility.
 *
 * @param config - Configuration object to modify
 * @param args - CLI arguments containing hide/show options
 */
function addHideOptions(config: Record<string, unknown>, args: CLIArgs): void {
  if (args.hideTitle) config.showTitle = false
  if (args.hideTimeAxis) config.showTimeAxis = false
  if (args.hideGrid) config.showGrid = false
  if (args.showVWAP) config.showVWAP = true
  if (args.showEMA) config.showEMA = true
  if (args.emaPeriod) config.emaPeriod = args.emaPeriod
}

/**
 * Adds custom color styling options
 *
 * Applies custom background and text colors to the chart configuration
 * for personalized styling and theme customization.
 *
 * @param config - Configuration object to modify
 * @param args - CLI arguments containing color options
 */
function addColors(config: Record<string, unknown>, args: CLIArgs): void {
  if (args.backgroundColor) config.backgroundColor = args.backgroundColor
  if (args.textColor) config.textColor = args.textColor
}

/**
 * Adds comparison options
 *
 * Processes comparison-related arguments and applies them to the configuration
 * object. Handles comparison symbols, layout, and timeframes.
 *
 * @param config - Configuration object to modify
 * @param args - CLI arguments containing comparison options
 */
function addComparisonOptions(config: Record<string, unknown>, args: CLIArgs): void {
  if (args.compare) {
    const symbols = args.compare.split(',').map(s => s.trim())
    config.symbols = symbols
  }
  if (args.layout) {
    config.layout = {
      type: args.layout,
      columns: args.columns,
      rows: args.rows,
      gap: args.gap
    }
  }
  if (args.timeframes) {
    const timeframes = args.timeframes.split(',').map(t => t.trim())
    config.timeframes = timeframes
  }
}

/**
 * Executes chart generation from command line arguments
 *
 * Main execution function that processes CLI arguments, validates inputs,
 * creates chart configuration, and generates the chart image. Handles
 * help display, error reporting, and success messaging.
 *
 * @param args - Parsed CLI arguments
 * @returns Promise resolving to execution result with success status and error details
 */
export async function executeFromArgs(args: CLIArgs): Promise<{ success: boolean; error?: string }> {
  try {
    if (args.help) {
      showHelp()
      return { success: true }
    }
    if (!validateArgs(args)) {
      return { success: false, error: 'Invalid arguments' }
    }
    const config = argsToConfig(args)
    const renderer = new ChartRenderer(config)
    const result = await renderer.generateChart()
    if (result.success) {
      console.log(`✅ Chart generated: ${args.output}`)
    } else {
      console.error(`❌ Failed to generate chart: ${result.error}`)
    }
    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Error: ${errorMessage}`)
    return { success: false, error: errorMessage }
  }
}

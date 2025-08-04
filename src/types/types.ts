/**
 * Chart Types
 * Type definitions for chart configuration and data structures
 */

/**
 * Configuration for chart watermarks
 */
export interface WatermarkConfig {
  /** Watermark text content */
  text: string
  /** Position of the watermark on the chart */
  position?: 'top' | 'center' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Color of the watermark text */
  color?: string
  /** Font size of the watermark text */
  fontSize?: number
  /** Opacity level of the watermark (0-1) */
  opacity?: number
}

/**
 * Main configuration object for chart generation
 */
export interface ChartConfig {
  /** Trading symbol (e.g., 'BTCUSDT') */
  symbol: string
  /** Chart timeframe interval */
  timeframe: string
  /** Trading exchange name */
  exchange?: string
  /** Output file path for the generated chart */
  outputPath: string
  /** Chart width in pixels */
  width: number
  /** Chart height in pixels */
  height: number
  /** Visual theme of the chart */
  theme: 'light' | 'dark'
  /** Type of chart to render */
  chartType: 'candlestick' | 'line' | 'area' | 'heikin-ashi' | 'renko' | 'line-break'
  /** List of technical indicators to display */
  indicators: string[]
  /** Watermark configuration or text */
  watermark?: string | WatermarkConfig
  /** Custom colors for chart elements */
  customBarColors?: {
    /** Color for bullish candles */
    bullish?: string
    /** Color for bearish candles */
    bearish?: string
    /** Color for candle wicks */
    wick?: string
    /** Color for candle borders */
    border?: string
  }
  /** Horizontal support/resistance levels */
  horizontalLevels?: HorizontalLevel[]
  /** Chart title text */
  title?: string
  /** Whether to display the chart title */
  showTitle?: boolean
  /** Whether to display the time axis */
  showTimeAxis?: boolean
  /** Whether to display the grid */
  showGrid?: boolean
  /** Whether to display VWAP indicator */
  showVWAP?: boolean
  /** Whether to display EMA indicator */
  showEMA?: boolean
  /** EMA period for calculation */
  emaPeriod?: number
  /** Whether to display SMA indicator */
  showSMA?: boolean
  /** SMA period for calculation */
  smaPeriod?: number
  /** Background color of the chart */
  backgroundColor?: string
  /** Text color for chart labels */
  textColor?: string
  /** Chart scaling configuration */
  scale?: {
    /** X-axis scale factor */
    x?: number
    /** Y-axis scale factor */
    y?: number
    /** Enable automatic scaling */
    autoScale?: boolean
    /** Minimum scale factor */
    minScale?: number
    /** Maximum scale factor */
    maxScale?: number
  }
}

/**
 * Horizontal level configuration for support/resistance lines
 */
export interface HorizontalLevel {
  /** Price value for the level */
  value: number
  /** Color of the level line */
  color: string
  /** Line style for the level */
  lineStyle: 'solid' | 'dotted'
  /** Optional label for the level */
  label?: string
  /** Type of horizontal level */
  type?: 'support' | 'resistance' | 'custom'
}

/**
 * Individual candlestick data point
 */
export interface ChartData {
  /** Unix timestamp in milliseconds */
  timestamp: number
  /** Opening price */
  open: number
  /** Highest price during the period */
  high: number
  /** Lowest price during the period */
  low: number
  /** Closing price */
  close: number
  /** Trading volume (optional) */
  volume?: number
}

/**
 * Rendering options for chart generation
 */
export interface ChartOptions {
  /** Chart width in pixels */
  width: number
  /** Chart height in pixels */
  height: number
  /** Background color of the chart */
  backgroundColor: string
  /** Text color for chart elements */
  textColor: string
  /** Color of the grid lines */
  gridColor: string
  /** Color of chart borders */
  borderColor: string
  /** Type of chart to render */
  chartType?: 'candlestick' | 'line' | 'area' | 'heikin-ashi' | 'renko' | 'line-break'
  /** Watermark configuration or text */
  watermark?: string | WatermarkConfig
  /** Color of the watermark */
  watermarkColor?: string
  /** Opacity of the watermark */
  watermarkOpacity?: number
  /** Custom colors for chart elements */
  customBarColors?: {
    /** Color for bullish candles */
    bullish: string
    /** Color for bearish candles */
    bearish: string
    /** Color for candle wicks */
    wick: string
    /** Color for candle borders */
    border: string
  }
  /** Horizontal support/resistance levels */
  horizontalLevels?: HorizontalLevel[]
  /** Chart title text */
  title?: string
  /** Whether to display the chart title */
  showTitle?: boolean
  /** Whether to display the time axis */
  showTimeAxis?: boolean
  /** Whether to display the grid */
  showGrid?: boolean
  /** Whether to display VWAP indicator */
  showVWAP?: boolean
  /** Whether to display EMA indicator */
  showEMA?: boolean
  /** EMA period for calculation */
  emaPeriod?: number
  /** Whether to display SMA indicator */
  showSMA?: boolean
  /** SMA period for calculation */
  smaPeriod?: number
  /** Chart scaling configuration */
  scale?: {
    /** X-axis scale factor */
    x?: number
    /** Y-axis scale factor */
    y?: number
    /** Enable automatic scaling */
    autoScale?: boolean
    /** Minimum scale factor */
    minScale?: number
    /** Maximum scale factor */
    maxScale?: number
  }
  /** Chart margin configuration */
  margin?: {
    /** Top margin in pixels */
    top?: number
    /** Bottom margin in pixels */
    bottom?: number
    /** Left margin in pixels */
    left?: number
    /** Right margin in pixels */
    right?: number
  }
}

/**
 * Result of chart rendering operation
 */
export interface RenderResult {
  /** Whether the rendering was successful */
  success: boolean
  /** Path to the generated chart file */
  outputPath?: string
  /** Error message if rendering failed */
  error?: string
  /** Data URL of the generated chart */
  dataUrl?: string
}

/**
 * Supported chart timeframes
 */
export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w'

/**
 * Supported cryptocurrency exchanges
 */
export type Exchange = 'binance' | 'coinbase' | 'kraken' | 'kucoin' | 'okx'

/**
 * Exchange API configuration
 */
export interface ExchangeConfig {
  /** Exchange name */
  name: Exchange
  /** API key for the exchange */
  apiKey?: string
  /** API secret for the exchange */
  secret?: string
  /** Whether to use sandbox/testnet */
  sandbox?: boolean
}

/**
 * Chart Configuration
 *
 * Manages comprehensive chart configuration settings, validation, and provides chart rendering options.
 * Handles symbol formatting, timeframe validation, chart type validation, dimension constraints,
 * and output format validation. Supports multiple chart types including candlestick, line, area,
 * heikin-ashi, and renko charts. Supports both light and dark themes with customizable colors,
 * styling options, watermarks, and horizontal levels.
 */

import type { ChartConfig as IChartConfig, Timeframe, HorizontalLevel, WatermarkConfig } from '@/types/types'

/**
 * Chart configuration class
 * Manages all chart settings and validation
 */
export class ChartConfig implements IChartConfig {
  public symbol: string
  public timeframe: string
  public exchange?: string
  public outputPath: string
  public width: number
  public height: number
  public theme: 'light' | 'dark'
  public chartType: 'candlestick' | 'line' | 'area' | 'heikin-ashi' | 'renko' | 'line-break'
  public indicators: string[]
  public watermark?: string | WatermarkConfig
  public customBarColors?: {
    bullish?: string
    bearish?: string
    wick?: string
    border?: string
  }
  public horizontalLevels?: HorizontalLevel[]
  public title?: string
  public showTitle?: boolean
  public showTimeAxis?: boolean
  public showGrid?: boolean
  public showVWAP?: boolean
  public showEMA?: boolean
  public emaPeriod?: number
  public backgroundColor?: string
  public textColor?: string

  /**
   * Creates a new chart configuration
   * @param config - Partial configuration object
   */
  constructor(config: Partial<IChartConfig>) {
    this.symbol = config.symbol || 'BTC/USDT'
    this.timeframe = config.timeframe || '1h'
    this.exchange = config.exchange || 'binance'
    this.outputPath = config.outputPath || 'chart.png'
    this.width = config.width || 1200
    this.height = config.height || 800
    this.theme = config.theme || 'dark'
    this.chartType = (config.chartType as 'candlestick' | 'line' | 'area' | 'heikin-ashi' | 'renko') || 'candlestick'
    this.indicators = config.indicators || []
    if (config.customBarColors !== undefined) {
      this.customBarColors = config.customBarColors
    }
    if (config.horizontalLevels !== undefined) {
      this.horizontalLevels = config.horizontalLevels
    }
    if (config.title !== undefined) {
      this.title = config.title
    }
    if (config.showTitle !== undefined) {
      this.showTitle = config.showTitle
    }
    if (config.showTimeAxis !== undefined) {
      this.showTimeAxis = config.showTimeAxis
    }
    if (config.showGrid !== undefined) {
      this.showGrid = config.showGrid
    }
    if (config.showVWAP !== undefined) {
      this.showVWAP = config.showVWAP
    }
    if (config.showEMA !== undefined) {
      this.showEMA = config.showEMA
    }
    if (config.emaPeriod !== undefined) {
      this.emaPeriod = config.emaPeriod
    }
    if (config.backgroundColor !== undefined) {
      this.backgroundColor = config.backgroundColor
    }
    if (config.textColor !== undefined) {
      this.textColor = config.textColor
    }
    if (config.watermark !== undefined) {
      this.watermark = config.watermark
    }
    this.validate()
  }

  /**
   * Validates chart configuration settings
   *
   * Performs comprehensive validation of all configuration parameters including:
   * - Symbol format validation (BASE/QUOTE format)
   * - Timeframe validation against supported values
   * - Chart type validation against supported values
   * - Chart dimension constraints (minimum 100x100 pixels)
   * - Output file format validation (.png, .jpg, .jpeg, .svg)
   *
   * @throws Error when configuration parameters are invalid
   */
  private validate(): void {
    if (!this.symbol || !this.symbol.includes('/')) {
      throw new Error('Invalid symbol format. Use format: BASE/QUOTE (e.g., BTC/USDT)')
    }
    if (!this.isValidTimeframe(this.timeframe)) {
      throw new Error(`Invalid timeframe: ${this.timeframe}`)
    }
    if (!this.isValidChartType(this.chartType)) {
      throw new Error(`Invalid chart type: ${this.chartType}`)
    }
    if (this.width < 100 || this.height < 100) {
      throw new Error('Chart dimensions must be at least 100x100 pixels')
    }
    if (!this.outputPath.match(/\.(png|jpg|jpeg|svg)$/i)) {
      throw new Error('Output path must have a valid image extension (.png, .jpg, .jpeg, .svg)')
    }
  }

  /**
   * Validates timeframe against supported values
   *
   * Checks if the provided timeframe matches the list of supported timeframes.
   * Supported timeframes include: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w
   *
   * @param timeframe - Timeframe string to validate
   * @returns True if timeframe is supported, false otherwise
   */
  private isValidTimeframe(timeframe: string): timeframe is Timeframe {
    const validTimeframes: Timeframe[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w']
    return validTimeframes.includes(timeframe as Timeframe)
  }

  /**
   * Validates chart type against supported values
   *
   * Checks if the provided chart type matches the list of supported chart types.
   * Supported chart types include: candlestick, line, area, heikin-ashi, renko.
   * Each chart type provides different visualization styles for market data analysis.
   *
   * @param chartType - Chart type string to validate
   * @returns True if chart type is supported, false otherwise
   */
  private isValidChartType(chartType: string): boolean {
    const validChartTypes = ['candlestick', 'line', 'area', 'heikin-ashi', 'renko', 'line-break']
    return validChartTypes.includes(chartType)
  }

  /**
   * Generates chart rendering options
   *
   * Creates a complete options object for chart rendering with theme-based colors,
   * dimensions, and styling preferences. Automatically applies dark or light theme
   * colors based on the current theme setting. Includes watermark settings and
   * opacity configurations for chart branding and identification.
   *
   * @returns Complete chart options object with colors, dimensions, styling, and watermark settings
   */
  public getChartOptions(): {
    width: number
    height: number
    backgroundColor: string
    textColor: string
    gridColor: string
    borderColor: string
    watermark?: string | WatermarkConfig
    watermarkColor: string
    watermarkOpacity: number
  } {
    return {
      width: this.width,
      height: this.height,
      backgroundColor: this.theme === 'dark' ? '#1e222d' : '#ffffff',
      textColor: this.theme === 'dark' ? '#ffffff' : '#000000',
      gridColor: this.theme === 'dark' ? '#2b2b43' : '#e1e3e6',
      borderColor: this.theme === 'dark' ? '#2b2b43' : '#e1e3e6',
      ...(this.watermark && { watermark: this.watermark }),
      watermarkColor: this.theme === 'dark' ? '#ffffff' : '#000000',
      watermarkOpacity: 0.3
    }
  }

  /**
   * Converts configuration to string representation
   *
   * Creates a human-readable string representation of the chart configuration
   * for logging and debugging purposes. Includes symbol, timeframe, chart type,
   * and dimensions for easy identification and troubleshooting.
   *
   * @returns String representation of the chart configuration
   */
  public toString(): string {
    return `ChartConfig(${this.symbol}, ${this.timeframe}, ${this.width}x${this.height})`
  }
}

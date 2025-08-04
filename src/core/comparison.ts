/**
 * Chart Comparison Service
 *
 * Manages the generation of multiple charts for comparison analysis.
 * Handles data fetching, chart rendering, and layout coordination
 * for comprehensive trading chart comparisons with support for
 * different layouts, timeframes, and visual customization.
 * 
 * Supports timeframe comparison mode for analyzing the same symbol
 * across different time intervals.
 */

import { ChartConfig } from '@/core/config'
import { ChartRenderer } from '@/core/renderer'
import { ComparisonRenderer, type ComparisonLayout } from '@/renderer/comparison'
import type { NodeChartData } from '@/renderer/types'
import type { ChartData } from '@/types/types'
import { DataProvider } from '@/utils/provider'

/**
 * Configuration for chart comparison operations
 * 
 * Defines parameters for generating multi-chart comparisons including
 * symbols, timeframes, layout options, and visual customization.
 */
export interface ComparisonConfig {
  /** Array of trading symbols to compare */
  symbols: string[]
  /** Default timeframe for all charts */
  timeframe?: string
  /** Array of timeframes for timeframe comparison mode */
  timeframes?: string[]
  /** Trading exchange to fetch data from */
  exchange?: string
  /** Layout configuration for comparison display */
  layout?: ComparisonLayout
  /** Width of the comparison chart in pixels */
  width?: number
  /** Height of the comparison chart in pixels */
  height?: number
  /** Visual theme for chart rendering */
  theme?: 'light' | 'dark'
  /** Type of chart to render */
  chartType?: string
  /** Whether to display VWAP indicator */
  showVWAP?: boolean
  /** Whether to display EMA indicator */
  showEMA?: boolean
  /** EMA period for calculation */
  emaPeriod?: number
  /** Output file path for saving the comparison */
  outputPath?: string
  /** Custom colors for chart bars and elements */
  customBarColors?: {
    /** Color for bullish candles */
    bullish?: string
    /** Color for bearish candles */
    bearish?: string
    /** Color for candle wicks */
    wick?: string
    /** Color for chart borders */
    border?: string
  }
}

/**
 * Result of chart comparison operation
 * 
 * Contains the outcome of comparison generation including success status,
 * output file path, error information, and image buffer data.
 */
export interface ComparisonResult {
  /** Whether the comparison generation was successful */
  success: boolean
  /** Path to the saved comparison file */
  outputPath?: string
  /** Error message if the operation failed */
  error?: string
  /** Buffer containing the comparison image data */
  buffer?: Buffer
}

/**
 * Chart comparison service for generating multi-chart analysis
 *
 * Manages the generation of multiple charts for comparison analysis.
 * Handles data fetching, chart rendering, and layout coordination
 * for comprehensive trading chart comparisons with support for
 * different layouts, timeframes, and visual customization.
 * 
 * Provides static methods for common comparison patterns including
 * side-by-side layouts, grid arrangements, and timeframe analysis.
 */
export class ComparisonService {
  private static readonly DEFAULT_LAYOUT_TYPE = 'side-by-side'
  private config: ComparisonConfig
  private dataProvider: DataProvider

  /**
   * Creates a new comparison service instance
   *
   * @param config - Configuration for chart comparison operations
   */
  constructor(config: ComparisonConfig) {
    this.config = config
    this.dataProvider = new DataProvider({
      name: (config.exchange || 'binance') as 'binance' | 'kraken' | 'coinbase',
      sandbox: false
    })
  }

  /**
   * Generates comparison charts for multiple symbols or timeframes
   *
   * Fetches market data for multiple symbols, renders individual charts,
   * and combines them into a comparison layout. Supports both
   * side-by-side and grid layouts with synchronized timeframes.
   * Handles timeframe comparison mode when timeframes array is provided.
   * 
   * The method automatically detects comparison mode based on configuration:
   * - If timeframes array is provided: timeframe comparison mode
   * - Otherwise: symbol comparison mode
   *
   * @returns Promise resolving to comparison result with output path or buffer
   * @throws {Error} When data fetching or rendering fails
   */
  public async generateComparison(): Promise<ComparisonResult> {
    try {
      const { symbols, layout = { type: ComparisonService.DEFAULT_LAYOUT_TYPE }, width = 1600, height = 800 } = this.config
      const comparisonRenderer = new ComparisonRenderer(width, height, layout)
      await this.addChartsToRenderer(comparisonRenderer, symbols)
      await comparisonRenderer.renderComparison()
      const buffer = await comparisonRenderer.exportComparison({ format: 'png' })
      return this.createSuccessResult(buffer)
    } catch (error) {
      return this.createErrorResult(error)
    }
  }

  /**
   * Adds charts to the comparison renderer based on configuration
   * 
   * Determines whether to add timeframe-based or symbol-based charts
   * based on the presence of timeframes in the configuration.
   * 
   * @param comparisonRenderer - The comparison renderer instance
   * @param symbols - Array of trading symbols to process
   */
  private async addChartsToRenderer(comparisonRenderer: ComparisonRenderer, symbols: string[]): Promise<void> {
    if (this.config.timeframes && this.config.timeframes.length > 0) {
      await this.addTimeframeCharts(comparisonRenderer, symbols)
    } else {
      await this.addSymbolCharts(comparisonRenderer, symbols)
    }
  }

  /**
   * Adds timeframe-based charts to the renderer
   * 
   * Creates charts for the same symbol across different timeframes.
   * Limits the number of charts to the minimum of symbols and timeframes.
   * 
   * @param comparisonRenderer - The comparison renderer instance
   * @param symbols - Array of trading symbols to process
   */
  private async addTimeframeCharts(comparisonRenderer: ComparisonRenderer, symbols: string[]): Promise<void> {
    const symbol = symbols[0]
    const maxCharts = Math.min(symbols.length, this.config.timeframes!.length)
    for (let i = 0; i < maxCharts; i++) {
      const timeframe = this.config.timeframes![i]
      const chartData = await this.generateChartData(symbol, timeframe)
      if (chartData) {
        comparisonRenderer.addChart(chartData)
      }
    }
  }

  /**
   * Adds symbol-based charts to the renderer
   * 
   * Creates individual charts for each trading symbol in the array.
   * Each chart uses the default timeframe from the configuration.
   * 
   * @param comparisonRenderer - The comparison renderer instance
   * @param symbols - Array of trading symbols to process
   */
  private async addSymbolCharts(comparisonRenderer: ComparisonRenderer, symbols: string[]): Promise<void> {
    for (const symbol of symbols) {
      const chartData = await this.generateChartData(symbol)
      if (chartData) {
        comparisonRenderer.addChart(chartData)
      }
    }
  }

  /**
   * Creates a successful comparison result
   * 
   * Handles file writing when output path is specified and returns
   * the appropriate result structure with success status and data.
   * 
   * @param buffer - Image buffer containing the comparison chart
   * @returns Promise resolving to successful comparison result
   */
  private async createSuccessResult(buffer: Buffer): Promise<ComparisonResult> {
    if (this.config.outputPath) {
      const fs = await import('fs/promises')
      await fs.writeFile(this.config.outputPath, buffer)
      return {
        success: true,
        outputPath: this.config.outputPath,
        buffer
      }
    }
    return {
      success: true,
      buffer
    }
  }

  /**
   * Creates an error result
   * 
   * Formats error information into a standardized result structure
   * with appropriate error message handling.
   * 
   * @param error - The error that occurred during processing
   * @returns Error result with failure status and error message
   */
  private createErrorResult(error: unknown): ComparisonResult {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }

  /**
   * Generates chart data for a single trading symbol
   *
   * Creates chart configuration, fetches market data, and prepares
   * chart data for rendering. Handles both default and custom timeframes.
   * Applies visual styling and customization from the configuration.
   *
   * @param symbol - Trading symbol to generate chart for
   * @param timeframe - Optional timeframe override for this specific chart
   * @returns Promise resolving to chart data for rendering or null if failed
   * @throws {Error} When data fetching or chart generation fails
   */
  private async generateChartData(symbol: string, timeframe?: string): Promise<NodeChartData | null> {
    try {
      const chartConfig = new ChartConfig({
        symbol,
        timeframe: timeframe || this.config.timeframe || '1h',
        exchange: this.config.exchange || 'binance',
        width: 800,
        height: 600,
        theme: this.config.theme || 'dark',
        chartType: (this.config.chartType as 'candlestick' | 'line' | 'area' | 'heikin-ashi' | 'renko') || 'candlestick',
        showTitle: true,
        showTimeAxis: true,
        showGrid: true
      })
      const renderer = new ChartRenderer(chartConfig)
      const result = await renderer.generateChart()
      if (result.success) {
        const data = await this.dataProvider.fetchOHLCV(symbol, timeframe || this.config.timeframe || '1h', 100)
        const chartData = this.createChartData(data, chartConfig)
        return chartData
      }
      return null
    } catch (error) {
      console.warn(`Failed to generate chart for ${symbol}:`, error)
      return null
    }
  }

  /**
   * Creates chart data structure for comparison rendering
   *
   * Transforms raw market data into the format required by the
   * comparison renderer, including OHLC data and visual configuration.
   * Applies custom color schemes and styling from the configuration.
   * Maps timestamp data and applies chart-specific formatting.
   *
   * @param data - Array of market data points with OHLCV structure
   * @param config - Chart configuration with styling and layout options
   * @returns Chart data structure ready for rendering with complete styling
   */
  private createChartData(data: ChartData[], config: ChartConfig): NodeChartData {
    const ohlc = data.map(item => ({
      time: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      ...(item.volume !== undefined && { volume: item.volume })
    }))
    return {
      ohlc,
      levels: [],
      config: {
        width: config.width,
        height: config.height,
        backgroundColor: config.backgroundColor || '#1e222d',
        textColor: config.textColor || '#ffffff',
        gridColor: '#2b2b43',
        borderColor: '#2b2b43',
        chartType: config.chartType || 'candlestick',
        customBarColors: {
          bullish: this.config.customBarColors?.bullish || '#26a69a',
          bearish: this.config.customBarColors?.bearish || '#ef5350',
          wick: this.config.customBarColors?.wick || '#424242',
          border: this.config.customBarColors?.border || '#E0E0E0'
        },
        horizontalLevels: [],
        title: `${config.symbol} ${config.timeframe}`,
        showTitle: true,
        showTimeAxis: true,
        showGrid: true,
        showVWAP: this.config.showVWAP === true,
        showEMA: this.config.showEMA === true,
        ...(this.config.emaPeriod !== undefined && { emaPeriod: this.config.emaPeriod })
      }
    }
  }

  /**
   * Generates side-by-side comparison of multiple trading symbols
   *
   * Creates a horizontal layout with charts positioned side-by-side
   * for easy visual comparison of different symbols or timeframes.
   * Uses a default gap of 20 pixels between charts for optimal spacing.
   * Provides a convenient static method for common side-by-side layouts.
   *
   * @param symbols - Array of trading symbols to compare
   * @param outputPath - File path where the comparison will be saved
   * @param config - Optional additional configuration parameters
   * @returns Promise resolving to comparison result with success status
   * @throws {Error} When comparison generation fails
   */
  public static async sideBySide(symbols: string[], outputPath: string, config?: Partial<ComparisonConfig>): Promise<ComparisonResult> {
    const service = new ComparisonService({
      symbols,
      outputPath,
      layout: { type: ComparisonService.DEFAULT_LAYOUT_TYPE, gap: 20 },
      ...config
    })
    return service.generateComparison()
  }

  /**
   * Generates grid layout comparison of trading symbols
   *
   * Creates a grid layout with charts arranged in rows and columns
   * for systematic comparison. Supports maximum 2 symbols and 2 columns.
   * Uses a default gap of 15 pixels between chart elements.
   * Provides a convenient static method for grid-based layouts.
   *
   * @param symbols - Array of trading symbols to compare (max 2)
   * @param columns - Number of columns in the grid layout (max 2)
   * @param outputPath - File path where the comparison will be saved
   * @param config - Optional additional configuration parameters
   * @returns Promise resolving to comparison result with success status
   * @throws {Error} When grid constraints are violated or generation fails
   */
  public static async grid(
    symbols: string[],
    columns: number,
    outputPath: string,
    config?: Partial<ComparisonConfig>
  ): Promise<ComparisonResult> {
    if (symbols.length > 2) {
      return {
        success: false,
        error: `Grid layout supports maximum 2 symbols. Got ${symbols.length} symbols: ${symbols.join(', ')}`
      }
    }
    if (columns > 2) {
      return {
        success: false,
        error: `Grid layout supports maximum 2 columns. Got ${columns} columns`
      }
    }
    const service = new ComparisonService({
      symbols,
      outputPath,
      layout: { type: 'grid', columns, gap: 15 },
      ...config
    })
    return service.generateComparison()
  }

  /**
   * Generates timeframe comparison for a single trading symbol
   *
   * Creates side-by-side comparison of the same symbol across different
   * timeframes to analyze price behavior at various intervals.
   * Uses a default gap of 20 pixels between timeframe charts.
   * Provides a convenient static method for timeframe analysis.
   *
   * @param symbol - Trading symbol to compare across timeframes
   * @param timeframes - Array of timeframes to compare (e.g., ['1h', '4h', '1d'])
   * @param outputPath - File path where the comparison will be saved
   * @param config - Optional additional configuration parameters
   * @returns Promise resolving to comparison result with success status
   * @throws {Error} When timeframe comparison generation fails
   */
  public static async timeframeComparison(
    symbol: string,
    timeframes: string[],
    outputPath: string,
    config?: Partial<ComparisonConfig>
  ): Promise<ComparisonResult> {
    const service = new ComparisonService({
      symbols: [symbol],
      timeframes,
      outputPath,
      layout: { type: ComparisonService.DEFAULT_LAYOUT_TYPE, gap: 20 },
      ...config
    })
    return service.generateComparison()
  }
} 
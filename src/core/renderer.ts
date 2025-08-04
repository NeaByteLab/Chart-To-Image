/**
 * Chart Renderer
 *
 * Renders trading charts to images using Node.js canvas with comprehensive
 * data fetching, chart generation, and export capabilities. Handles market
 * data retrieval, chart data transformation, and image export in multiple formats.
 * Supports multiple chart types including candlestick, line, area, heikin-ashi, and renko charts.
 * Supports real-time chart updates, custom styling, watermarks, horizontal levels,
 * and provides both file and buffer outputs with configurable quality settings.
 */

import { ChartConfig } from '@/core/config'
import { NodeChartRenderer, type NodeChartData } from '@/renderer'
import type { ChartData, ChartOptions, RenderResult, Exchange } from '@/types/types'
import { DataProvider } from '@/utils/provider'

/**
 * Main chart renderer class
 * Orchestrates chart generation and export processes
 */
export class ChartRenderer {
  private config: ChartConfig
  private dataProvider: DataProvider
  private nodeRenderer: NodeChartRenderer

  /**
   * Creates a new chart renderer
   * @param config - Chart configuration object
   */
  constructor(config: ChartConfig) {
    this.config = config
    this.dataProvider = new DataProvider({
      name: (config.exchange || 'binance') as Exchange,
      sandbox: false
    })
    this.nodeRenderer = new NodeChartRenderer(config.width, config.height)
  }

  /**
   * Generates chart and exports to image file
   *
   * Fetches market data, creates chart visualization, and exports the result
   * to an image file. Handles the complete workflow from data retrieval to
   * file output with error handling and success/failure reporting. Supports
   * multiple export formats with configurable quality settings.
   *
   * @returns Render result with success status, output path, and data URL
   */
  public async generateChart(): Promise<RenderResult> {
    try {
      const data = await this.dataProvider.fetchOHLCV(this.config.symbol, this.config.timeframe, 100)
      const chartData = this.createChartData(data)
      await this.nodeRenderer.renderChart(chartData)
      const buffer = await this.nodeRenderer.exportChart({
        format: this.getFileExtension(this.config.outputPath) as 'png' | 'jpeg' | 'jpg',
        quality: 0.9
      })
      await this.nodeRenderer.saveChart(this.config.outputPath, {
        format: this.getFileExtension(this.config.outputPath) as 'png' | 'jpeg' | 'jpg',
        quality: 0.9
      })
      return {
        success: true,
        outputPath: this.config.outputPath,
        dataUrl: `data:image/png;base64,${buffer.toString('base64')}`
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Transforms market data for Node.js chart rendering
   *
   * Converts raw market data into the format required by the Node.js chart renderer.
   * Processes OHLC data and horizontal levels, applying chart configuration options
   * for proper visualization. Supports multiple chart types including candlestick,
   * line, area, heikin-ashi, and renko charts. Handles data normalization
   * and applies custom styling preferences.
   *
   * @param data - Raw market data array
   * @returns Processed chart data ready for rendering
   */
  private createChartData(data: ChartData[]): NodeChartData {
    const options = this.getChartOptions()
    const ohlc = data.map(item => ({
      time: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      ...(item.volume !== undefined && { volume: item.volume })
    }))
    const levels =
      options.horizontalLevels?.map(level => ({
        value: level.value,
        color: level.color,
        lineStyle: level.lineStyle,
        ...(level.label && { label: level.label })
      })) || []
    return {
      ohlc,
      levels,
      config: options
    }
  }

  /**
   * Generates complete chart rendering options
   *
   * Creates a comprehensive options object for chart rendering with all styling,
   * dimensions, colors, and display preferences. Applies theme-based defaults
   * and custom configuration settings. Includes custom bar colors, horizontal
   * levels, title settings, and watermark configurations.
   *
   * @returns Complete chart options with styling, display preferences, and advanced features
   */
  private getChartOptions(): ChartOptions {
    const options: ChartOptions = {
      width: this.config.width,
      height: this.config.height,
      backgroundColor: this.config.backgroundColor || (this.config.theme === 'dark' ? '#1e222d' : '#ffffff'),
      textColor: this.config.textColor || (this.config.theme === 'dark' ? '#ffffff' : '#000000'),
      gridColor: this.config.theme === 'dark' ? '#2b2b43' : '#e1e3e6',
      borderColor: this.config.theme === 'dark' ? '#2b2b43' : '#e1e3e6',
      chartType: this.config.chartType || 'candlestick',
      watermarkColor: this.config.theme === 'dark' ? '#ffffff' : '#000000',
      watermarkOpacity: 0.3,
      customBarColors: {
        bullish: this.config.customBarColors?.bullish || '#26a69a',
        bearish: this.config.customBarColors?.bearish || '#ef5350',
        wick: this.config.customBarColors?.wick || '#424242',
        border: this.config.customBarColors?.border || '#E0E0E0'
      },
      horizontalLevels: this.config.horizontalLevels || [],
      title: this.config.title || `${this.config.symbol} ${this.config.timeframe}`,
      showTitle: this.config.showTitle !== false,
      showTimeAxis: this.config.showTimeAxis !== false,
      showGrid: this.config.showGrid !== false,
      showVWAP: this.config.showVWAP === true,
      showEMA: this.config.showEMA === true,
      ...(this.config.emaPeriod !== undefined && { emaPeriod: this.config.emaPeriod })
    }
    if (this.config.watermark !== undefined) {
      options.watermark = this.config.watermark
    }
    return options
  }

  /**
   * Extracts file extension from file path
   *
   * Parses the file path to determine the image format for export.
   * Supports common image formats (PNG, JPEG, JPG) and defaults to PNG
   * if no valid extension is found. Used for automatic format detection
   * during chart export operations.
   *
   * @param path - File path to analyze
   * @returns File extension in lowercase, defaults to 'png'
   */
  private getFileExtension(path: string): string {
    return path.split('.').pop()?.toLowerCase() || 'png'
  }

  /**
   * Retrieves the underlying chart renderer instance
   *
   * Provides access to the Node.js chart renderer for direct operations
   * and manipulation of the chart rendering engine.
   *
   * @returns NodeChartRenderer instance for direct chart operations
   */
  public getChart(): NodeChartRenderer {
    return this.nodeRenderer
  }

  /**
   * Updates chart visualization with new market data
   *
   * Refreshes the chart display with updated market data while maintaining
   * current configuration settings. Useful for real-time chart updates
   * and dynamic data visualization. Preserves all styling, colors, and
   * display preferences during the update process.
   *
   * @param data - New market data array for chart update
   */
  public async updateChart(data: ChartData[]): Promise<void> {
    const chartData = this.createChartData(data)
    await this.nodeRenderer.renderChart(chartData)
  }

  /**
   * Cleans up chart renderer resources
   *
   * Performs cleanup operations for the chart renderer instance.
   * Note: Node.js renderer doesn't require explicit cleanup in most cases.
   */
  public destroy(): void {
    // Node.js renderer doesn't need explicit cleanup
  }
}

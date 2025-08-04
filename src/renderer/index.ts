/**
 * Node Chart Renderer
 *
 * Main renderer that orchestrates all chart components and handles
 * the complete chart generation process. Manages canvas creation,
 * chart data processing, and coordinate system setup for Node.js
 * environments with comprehensive export capabilities.
 */

import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas'

import { CandlestickRenderer, LineRenderer, AreaRenderer, HeikinAshiRenderer, RenkoRenderer, LineBreakRenderer } from '@/renderer/charts'
import {
  AxesRenderer,
  GridRenderer,
  VWAPRenderer,
  EMARenderer,
  LevelsRenderer,
  TitleRenderer,
  WatermarkRenderer
} from '@/renderer/elements'
import type { NodeChartData, ChartDimensions, PriceRange } from '@/renderer/types'
import { calculatePriceRange, hasVolumeData } from '@/renderer/utils'
import type { ChartOptions } from '@/types/types'

/**
 * Main chart renderer for Node.js environment
 *
 * Handles the complete chart rendering workflow including canvas creation,
 * data processing, coordinate system setup, and multi-format export
 * capabilities. Orchestrates all chart components for comprehensive
 * visualization generation.
 */
export class NodeChartRenderer {
  private canvas: Canvas
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private chartData?: NodeChartData

  /**
   * Creates a new chart renderer instance
   *
   * Initializes the renderer with specified dimensions and creates
   * the underlying canvas for chart drawing operations. Sets up
   * the rendering context and prepares the canvas for chart data.
   *
   * @param width - Chart width in pixels
   * @param height - Chart height in pixels
   */
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.canvas = createCanvas(width, height)
    this.ctx = this.canvas.getContext('2d')
  }

  /**
   * Renders chart data to canvas
   *
   * Processes chart data and generates the complete visualization
   * including background, chart elements, title, and watermark.
   * Handles the complete rendering workflow from data to final image.
   *
   * @param data - Chart data containing OHLC values, levels, and configuration
   */
  public async renderChart(data: NodeChartData): Promise<void> {
    this.chartData = data
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = data.config.backgroundColor || '#1e222d'
    this.ctx.fillRect(0, 0, this.width, this.height)
    await this.drawChart()
    if (data.config.showTitle !== false && data.config.title) {
      const titleRenderer = new TitleRenderer(this.ctx, this.width, data.config)
      titleRenderer.render(data.config.title)
    }
    if (data.config.watermark) {
      const watermarkRenderer = new WatermarkRenderer(this.ctx, this.width, this.height)
      watermarkRenderer.render(data.config.watermark)
    }
  }

  /**
   * Draws the main chart components
   *
   * Orchestrates the rendering of all chart elements including the
   * main chart type, volume bars, horizontal levels, grid lines,
   * and coordinate axes. Handles dimension calculations and component
   * coordination for complete chart visualization.
   */
  private async drawChart(): Promise<void> {
    if (!this.chartData) return
    const { ohlc, config } = this.chartData
    if (ohlc.length === 0) return
    const margin = config.margin || { top: 60, bottom: 40, left: 60, right: 40 }
    const chartWidth = this.width - (margin.left || 0) - (margin.right || 0)
    const chartHeight = this.height - (margin.top || 0) - (margin.bottom || 0)
    const dimensions: ChartDimensions = {
      width: this.width,
      height: this.height,
      margin: {
        top: margin.top || 0,
        bottom: margin.bottom || 0,
        left: margin.left || 0,
        right: margin.right || 0
      },
      chartWidth,
      chartHeight
    }
    const priceRange = calculatePriceRange(ohlc, config)
    this.drawChartType(ohlc, dimensions, priceRange, config)
    if (config.showVWAP && hasVolumeData(ohlc)) {
      const vwapRenderer = new VWAPRenderer(this.ctx, dimensions, priceRange, config)
      vwapRenderer.render(ohlc)
    }
    if (config.showEMA && config.emaPeriod) {
      const emaRenderer = new EMARenderer(this.ctx, dimensions, priceRange, config, config.emaPeriod)
      emaRenderer.render(ohlc)
    }
    if (this.chartData.levels) {
      const levelsRenderer = new LevelsRenderer(this.ctx, dimensions, priceRange)
      levelsRenderer.render(this.chartData.levels)
    }
    if (config.showGrid !== false) {
      const gridRenderer = new GridRenderer(this.ctx, dimensions, config)
      gridRenderer.render()
    }
    const axesRenderer = new AxesRenderer(this.ctx, dimensions, priceRange, config)
    axesRenderer.render(ohlc)
  }

  /**
   * Draws chart based on specified type
   *
   * Selects and instantiates the appropriate chart type renderer
   * based on the configuration. Supports all chart types including
   * candlestick, line, area, Heikin-Ashi, and Renko charts.
   *
   * @param ohlc - Array of OHLC candle data for chart rendering
   * @param dimensions - Chart dimensions and margin configuration
   * @param priceRange - Price range for coordinate scaling
   * @param config - Chart configuration and styling options
   */
  private drawChartType(
    ohlc: Array<{ time: number; open: number; high: number; low: number; close: number; volume?: number }>,
    dimensions: ChartDimensions,
    priceRange: PriceRange,
    config: ChartOptions
  ): void {
    switch (config.chartType || 'candlestick') {
      case 'candlestick': {
        const candlestickRenderer = new CandlestickRenderer(this.ctx, dimensions, priceRange, config)
        candlestickRenderer.render(ohlc)
        break
      }
      case 'line': {
        const lineRenderer = new LineRenderer(this.ctx, dimensions, priceRange, config)
        lineRenderer.render(ohlc)
        break
      }
      case 'area': {
        const areaRenderer = new AreaRenderer(this.ctx, dimensions, priceRange, config)
        areaRenderer.render(ohlc)
        break
      }
      case 'heikin-ashi': {
        const heikinAshiRenderer = new HeikinAshiRenderer(this.ctx, dimensions, priceRange, config)
        heikinAshiRenderer.render(ohlc)
        break
      }
      case 'renko': {
        const renkoRenderer = new RenkoRenderer(this.ctx, dimensions, priceRange, config)
        renkoRenderer.render(ohlc)
        break
      }
      case 'line-break': {
        const lineBreakRenderer = new LineBreakRenderer(this.ctx, dimensions, priceRange, config)
        lineBreakRenderer.render(ohlc)
        break
      }
    }
  }

  /**
   * Exports chart to buffer format
   *
   * Converts the rendered chart canvas to a buffer containing image data
   * in the specified format. Supports PNG and JPEG formats with
   * configurable quality settings for optimal file size and quality balance.
   *
   * @param options - Export options including format and quality settings
   * @returns Buffer containing the chart image data
   */
  public async exportChart(options: { format: 'png' | 'jpeg' | 'jpg'; quality?: number }): Promise<Buffer> {
    const format = options.format === 'jpg' ? 'jpeg' : options.format
    if (format === 'png') {
      return this.canvas.toBuffer('image/png')
    } else {
      return this.canvas.toBuffer('image/jpeg', { quality: options.quality || 0.9 })
    }
  }

  /**
   * Saves chart to file system
   *
   * Exports the rendered chart to a file on the local file system
   * with the specified path and format. Handles file writing operations
   * and provides comprehensive error handling for reliable file output.
   *
   * @param outputPath - Target file path for chart export
   * @param options - Export options including format and quality settings
   */
  public async saveChart(
    outputPath: string,
    options: { format: 'png' | 'jpeg' | 'jpg'; quality?: number }
  ): Promise<void> {
    const fs = await import('fs/promises')
    const buffer = await this.exportChart(options)
    await fs.writeFile(outputPath, buffer)
  }

  /**
   * Gets the underlying chart canvas element
   *
   * Returns the canvas element for compatibility with browser-based
   * renderers and external chart manipulation. Provides access to
   * the raw canvas for advanced operations and integrations.
   *
   * @returns Canvas element containing the rendered chart
   */
  public chartElement(): Canvas {
    return this.canvas
  }
}

// Export all renderers for external use
export * from './types'
export * from './utils'
export * from './charts'
export * from './elements'

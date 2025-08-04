/**
 * Chart Elements Renderers
 *
 * Individual renderers for chart elements including axes, grid lines,
 * volume bars, horizontal levels, titles, and watermarks. Each renderer
 * handles specific visual components that support chart readability and
 * provide additional trading information.
 */

import type { CanvasRenderingContext2D } from 'canvas'
import type { ChartDimensions, PriceRange, WatermarkConfig } from '@/renderer/types'
import type { ChartOptions, HorizontalLevel } from '@/types/types'
import { formatPrice, formatTime } from '@/renderer/utils'

/**
 * OHLC candle data structure for chart rendering
 */
interface ChartOHLC {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

/**
 * Chart axes and labels renderer
 *
 * Handles the rendering of coordinate system axes, price labels on the
 * Y-axis, and time labels on the X-axis. Provides clear reference points
 * for price levels and time intervals with appropriate formatting.
 */
const DEFAULT_FONT = '12px Arial'

export class AxesRenderer {
  private ctx: CanvasRenderingContext2D
  private dimensions: ChartDimensions
  private priceRange: PriceRange
  private config: ChartOptions

  /**
   * Creates a new axes renderer instance
   *
   * Initializes the renderer with canvas context, chart dimensions,
   * price range for scaling, and configuration options for consistent
   * axis rendering across different chart types.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param dimensions - Chart dimensions and margin configuration
   * @param priceRange - Price range for coordinate scaling
   * @param config - Chart styling and configuration options
   */
  constructor(
    ctx: CanvasRenderingContext2D,
    dimensions: ChartDimensions,
    priceRange: PriceRange,
    config: ChartOptions
  ) {
    this.ctx = ctx
    this.dimensions = dimensions
    this.priceRange = priceRange
    this.config = config
  }

  /**
   * Renders chart axes and labels
   *
   * Draws the main coordinate system axes with appropriate styling and
   * positioning. Includes price labels on the Y-axis and time labels
   * on the X-axis for complete chart reference system.
   *
   * @param ohlc - Array of OHLC candle data for time axis labeling
   */
  render(ohlc: ChartOHLC[]): void {
    this.ctx.strokeStyle = this.config.borderColor || '#2b2b43'
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(this.dimensions.margin.left, this.dimensions.margin.top)
    this.ctx.lineTo(this.dimensions.margin.left, this.dimensions.margin.top + this.dimensions.chartHeight)
    this.ctx.stroke()
    this.ctx.beginPath()
    this.ctx.moveTo(this.dimensions.margin.left, this.dimensions.margin.top + this.dimensions.chartHeight)
    this.ctx.lineTo(
      this.dimensions.margin.left + this.dimensions.chartWidth,
      this.dimensions.margin.top + this.dimensions.chartHeight
    )
    this.ctx.stroke()
    this.drawPriceLabels()
    this.drawTimeLabels(ohlc)
  }

  /**
   * Draws price labels on Y-axis
   *
   * Renders formatted price values at regular intervals along the Y-axis
   * with corresponding tick marks. Uses appropriate decimal formatting
   * based on price magnitude for clear readability.
   */
  private drawPriceLabels(): void {
    this.ctx.fillStyle = this.config.textColor || '#ffffff'
    this.ctx.font = DEFAULT_FONT
    this.ctx.textAlign = 'right'
    const numLabels = 5
    for (let i = 0; i <= numLabels; i++) {
      const price = this.priceRange.minPrice + (i / numLabels) * this.priceRange.priceRange
      const y =
        this.dimensions.margin.top +
        ((this.priceRange.maxPrice - price) / this.priceRange.priceRange) * this.dimensions.chartHeight
      const formattedPrice = formatPrice(price)
      this.ctx.fillText(formattedPrice, this.dimensions.margin.left - 10, y + 4)
      this.ctx.strokeStyle = this.config.gridColor || '#2b2b43'
      this.ctx.lineWidth = 0.5
      this.ctx.beginPath()
      this.ctx.moveTo(this.dimensions.margin.left - 5, y)
      this.ctx.lineTo(this.dimensions.margin.left, y)
      this.ctx.stroke()
    }
  }

  /**
   * Draws time labels on X-axis
   *
   * Renders formatted timestamps at regular intervals along the X-axis
   * with corresponding tick marks. Respects visibility settings and
   * uses appropriate time formatting for different timeframes.
   *
   * @param ohlc - Array of OHLC candle data for time labeling
   */
  private drawTimeLabels(ohlc: ChartOHLC[]): void {
    if (ohlc.length === 0) return
    if (this.config.showTimeAxis === false) return
    this.ctx.fillStyle = this.config.textColor || '#ffffff'
    this.ctx.font = '11px Arial'
    this.ctx.textAlign = 'center'
    const step = Math.max(1, Math.floor(ohlc.length / 6))
    for (let i = 0; i < ohlc.length; i += step) {
      const candle = ohlc[i]
      const x = this.dimensions.margin.left + (i / (ohlc.length - 1)) * this.dimensions.chartWidth
      const y = this.dimensions.margin.top + this.dimensions.chartHeight + 20
      const timeLabel = formatTime(candle.time)
      this.ctx.fillText(timeLabel, x, y)
      this.ctx.strokeStyle = this.config.gridColor || '#2b2b43'
      this.ctx.lineWidth = 0.5
      this.ctx.beginPath()
      this.ctx.moveTo(x, this.dimensions.margin.top + this.dimensions.chartHeight)
      this.ctx.lineTo(x, this.dimensions.margin.top + this.dimensions.chartHeight + 5)
      this.ctx.stroke()
    }
  }
}

/**
 * Chart grid lines renderer
 *
 * Renders background grid lines to support chart readability and provide
 * visual reference points for price levels and time intervals. Creates
 * a structured background that aids in price and time estimation.
 */
export class GridRenderer {
  private ctx: CanvasRenderingContext2D
  private dimensions: ChartDimensions
  private config: ChartOptions

  /**
   * Creates a new grid renderer instance
   *
   * Initializes the renderer with canvas context, chart dimensions,
   * and configuration options for consistent grid styling across
   * different chart types and themes.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param dimensions - Chart dimensions and margin configuration
   * @param config - Chart styling and configuration options
   */
  constructor(ctx: CanvasRenderingContext2D, dimensions: ChartDimensions, config: ChartOptions) {
    this.ctx = ctx
    this.dimensions = dimensions
    this.config = config
  }

  /**
   * Renders chart grid lines
   *
   * Draws vertical and horizontal grid lines at regular intervals
   * across the chart area. Respects visibility settings and applies
   * appropriate styling for clear readability without visual clutter.
   */
  render(): void {
    if (this.config.showGrid === false) return
    this.ctx.strokeStyle = this.config.gridColor || '#2b2b43'
    this.ctx.lineWidth = 0.5
    for (let i = 0; i <= 10; i++) {
      const x = this.dimensions.margin.left + (i / 10) * this.dimensions.chartWidth
      this.ctx.beginPath()
      this.ctx.moveTo(x, this.dimensions.margin.top)
      this.ctx.lineTo(x, this.dimensions.margin.top + this.dimensions.chartHeight)
      this.ctx.stroke()
    }
    for (let i = 0; i <= 5; i++) {
      const y = this.dimensions.margin.top + (i / 5) * this.dimensions.chartHeight
      this.ctx.beginPath()
      this.ctx.moveTo(this.dimensions.margin.left, y)
      this.ctx.lineTo(this.dimensions.margin.left + this.dimensions.chartWidth, y)
      this.ctx.stroke()
    }
  }
}

/**
 * Volume bars renderer
 *
 * Renders trading volume data as bars below the main chart area.
 * Provides visual representation of trading activity with color coding
 * based on price movement direction for market analysis.
 */
export class VolumeRenderer {
  private ctx: CanvasRenderingContext2D
  private dimensions: ChartDimensions
  private config: ChartOptions

  /**
   * Creates a new volume renderer instance
   *
   * Initializes the renderer with canvas context, chart dimensions,
   * and configuration options for consistent volume bar styling and
   * positioning relative to the main chart area.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param dimensions - Chart dimensions and margin configuration
   * @param config - Chart styling and configuration options
   */
  constructor(ctx: CanvasRenderingContext2D, dimensions: ChartDimensions, config: ChartOptions) {
    this.ctx = ctx
    this.dimensions = dimensions
    this.config = config
  }

  /**
   * Renders volume bars
   *
   * Draws volume bars below the main chart with height proportional
   * to trading volume. Applies color coding based on price movement
   * direction and uses transparency for visual distinction from main chart.
   *
   * @param ohlc - Array of OHLC candle data with volume information
   */
  render(ohlc: ChartOHLC[]): void {
    const volumes = ohlc.map(candle => candle.volume || 0)
    const maxVolume = Math.max(...volumes)
    const volumeHeight = this.dimensions.chartHeight * 0.2
    const volumeY = this.dimensions.margin.top + this.dimensions.chartHeight + 10
    const barWidth = Math.max(1, (this.dimensions.chartWidth / ohlc.length) * 0.8)
    const spacing = this.dimensions.chartWidth / ohlc.length
    ohlc.forEach((candle, index) => {
      const volume = candle.volume || 0
      const volumeBarHeight = (volume / maxVolume) * volumeHeight
      const x = this.dimensions.margin.left + index * spacing + spacing / 2
      const y = volumeY + volumeHeight - volumeBarHeight
      const isBullish = candle.close >= candle.open
      const color = isBullish
        ? (this.config.customBarColors?.bullish || '#26a69a') + '80'
        : (this.config.customBarColors?.bearish || '#ef5350') + '80'
      this.ctx.fillStyle = color
      this.ctx.fillRect(x - barWidth / 2, y, barWidth, volumeBarHeight)
    })
  }
}

/**
 * VWAP data structure for volume-weighted average price
 */
interface VWAPData {
  time: number
  value: number
}

/**
 * VWAP indicator renderer
 *
 * Renders Volume Weighted Average Price (VWAP) as an overlay line
 * on the main chart. VWAP is a key institutional indicator that
 * shows the average price weighted by volume for trading decisions.
 */
export class VWAPRenderer {
  private ctx: CanvasRenderingContext2D
  private dimensions: ChartDimensions
  private priceRange: PriceRange
  private config: ChartOptions

  /**
   * Creates a new VWAP renderer instance
   *
   * Initializes the renderer with canvas context, chart dimensions,
   * price range for scaling, and configuration options for consistent
   * VWAP line styling and positioning on the main chart.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param dimensions - Chart dimensions and margin configuration
   * @param priceRange - Price range for coordinate scaling
   * @param config - Chart styling and configuration options
   */
  constructor(
    ctx: CanvasRenderingContext2D,
    dimensions: ChartDimensions,
    priceRange: PriceRange,
    config: ChartOptions
  ) {
    this.ctx = ctx
    this.dimensions = dimensions
    this.priceRange = priceRange
    this.config = config
  }

  /**
   * Calculates VWAP values from OHLC data
   *
   * Computes Volume Weighted Average Price using the standard
   * calculation method. VWAP is calculated as the sum of
   * (price * volume) divided by total volume for each period.
   *
   * @param ohlc - Array of OHLC candle data with volume
   * @returns Array of VWAP data points
   */
  private calculateVWAP(ohlc: ChartOHLC[]): VWAPData[] {
    if (ohlc.length === 0) return []
    const vwapData: VWAPData[] = []
    let cumulativeVolumePrice = 0
    let cumulativeVolume = 0
    ohlc.forEach(candle => {
      const volume = candle.volume || 0
      const typicalPrice = (candle.high + candle.low + candle.close) / 3
      cumulativeVolumePrice += typicalPrice * volume
      cumulativeVolume += volume
      const vwap = cumulativeVolume > 0 ? cumulativeVolumePrice / cumulativeVolume : typicalPrice
      vwapData.push({
        time: candle.time,
        value: vwap
      })
    })
    return vwapData
  }

  /**
   * Renders VWAP indicator
   *
   * Draws VWAP line as an overlay on the main chart with
   * distinctive styling to distinguish it from price action.
   * Uses color coding and line style for professional appearance.
   *
   * @param ohlc - Array of OHLC candle data
   */
  render(ohlc: ChartOHLC[]): void {
    const vwapData = this.calculateVWAP(ohlc)
    if (vwapData.length === 0) return
    const spacing = this.dimensions.chartWidth / ohlc.length
    this.ctx.strokeStyle = this.config.customBarColors?.bullish || '#ff6b6b'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([5, 5])
    this.ctx.beginPath()
    vwapData.forEach((point) => {
      const originalIndex = ohlc.findIndex(candle => candle.time === point.time)
      if (originalIndex !== -1) {
        const x = this.dimensions.margin.left + originalIndex * spacing + spacing / 2
        const y = this.dimensions.margin.top + 
          ((this.priceRange.maxPrice - point.value) / this.priceRange.priceRange) * this.dimensions.chartHeight
        if (originalIndex === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
    })
    this.ctx.stroke()
    this.ctx.fillStyle = this.config.customBarColors?.bullish || '#ff6b6b'
    this.ctx.font = DEFAULT_FONT
    this.ctx.textAlign = 'left'
    this.ctx.fillText('VWAP', this.dimensions.margin.left + 5, this.dimensions.margin.top + 20)
  }
}

/**
 * EMA data structure for exponential moving average
 */
interface EMAData {
  time: number
  value: number
}

/**
 * EMA indicator renderer
 *
 * Renders Exponential Moving Average (EMA) as an overlay line
 * on the main chart. EMA gives more weight to recent prices
 * and is widely used by traders for trend analysis.
 */
export class EMARenderer {
  private ctx: CanvasRenderingContext2D
  private dimensions: ChartDimensions
  private priceRange: PriceRange
  private config: ChartOptions
  private period: number

  /**
   * Creates a new EMA renderer instance
   *
   * Initializes the renderer with canvas context, chart dimensions,
   * price range for scaling, configuration options, and EMA period
   * for accurate exponential moving average calculation.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param dimensions - Chart dimensions and margin configuration
   * @param priceRange - Price range for coordinate scaling
   * @param config - Chart styling and configuration options
   * @param period - EMA period (e.g., 20, 50, 200)
   */
  constructor(
    ctx: CanvasRenderingContext2D,
    dimensions: ChartDimensions,
    priceRange: PriceRange,
    config: ChartOptions,
    period: number
  ) {
    this.ctx = ctx
    this.dimensions = dimensions
    this.priceRange = priceRange
    this.config = config
    this.period = period
  }

  /**
   * Calculates EMA values from OHLC data
   *
   * Computes Exponential Moving Average using the standard
   * calculation method. EMA gives more weight to recent prices
   * using a multiplier based on the period.
   *
   * @param ohlc - Array of OHLC candle data
   * @returns Array of EMA data points
   */
  private calculateEMA(ohlc: ChartOHLC[]): EMAData[] {
    if (ohlc.length === 0) return []
    const emaData: EMAData[] = []
    const multiplier = 2 / (this.period + 1)
    let ema = ohlc[0].close
    ohlc.forEach((candle, index) => {
      if (index === 0) {
        ema = candle.close
      } else {
        ema = (candle.close - ema) * multiplier + ema
      }
      emaData.push({
        time: candle.time,
        value: ema
      })
    })
    return emaData
  }

  /**
   * Renders EMA indicator
   *
   * Draws EMA line as an overlay on the main chart with
   * distinctive styling to distinguish it from price action.
   * Uses color coding and line style for professional appearance.
   *
   * @param ohlc - Array of OHLC candle data
   */
  render(ohlc: ChartOHLC[]): void {
    const emaData = this.calculateEMA(ohlc)
    if (emaData.length === 0) return
    const spacing = this.dimensions.chartWidth / ohlc.length
    this.ctx.strokeStyle = this.config.customBarColors?.bearish || '#ff6b6b'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([])
    this.ctx.beginPath()
    emaData.forEach((point) => {
      const originalIndex = ohlc.findIndex(candle => candle.time === point.time)
      if (originalIndex !== -1) {
        const x = this.dimensions.margin.left + originalIndex * spacing + spacing / 2
        const y = this.dimensions.margin.top + 
          ((this.priceRange.maxPrice - point.value) / this.priceRange.priceRange) * this.dimensions.chartHeight
        if (originalIndex === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
    })
    this.ctx.stroke()
    this.ctx.fillStyle = this.config.customBarColors?.bearish || '#ff6b6b'
    this.ctx.font = DEFAULT_FONT
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`EMA(${this.period})`, this.dimensions.margin.left + 5, this.dimensions.margin.top + 20)
  }
}

interface SMAData {
  time: number
  value: number
}

/**
 * Simple Moving Average (SMA) renderer
 *
 * Renders SMA lines on charts with configurable periods. SMA provides
 * a simple average of closing prices over a specified period, useful
 * for trend identification and support/resistance levels.
 */
export class SMARenderer {
  private ctx: CanvasRenderingContext2D
  private dimensions: ChartDimensions
  private priceRange: PriceRange
  private config: ChartOptions
  private period: number

  /**
   * Creates a new SMA renderer instance
   *
   * Initializes the renderer with canvas context, chart dimensions,
   * price range for scaling, configuration options, and SMA period
   * for calculation.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param dimensions - Chart dimensions and margin configuration
   * @param priceRange - Price range for coordinate scaling
   * @param config - Chart styling and configuration options
   * @param period - SMA calculation period (default: 20)
   */
  constructor(
    ctx: CanvasRenderingContext2D,
    dimensions: ChartDimensions,
    priceRange: PriceRange,
    config: ChartOptions,
    period: number
  ) {
    this.ctx = ctx
    this.dimensions = dimensions
    this.priceRange = priceRange
    this.config = config
    this.period = period
  }

  /**
   * Calculates SMA values for the given OHLC data
   *
   * Computes simple moving average using closing prices over the
   * specified period. Returns array of time-value pairs for rendering.
   *
   * @param ohlc - Array of OHLC candle data
   * @returns Array of SMA data points with time and value
   */
  private calculateSMA(ohlc: ChartOHLC[]): SMAData[] {
    if (ohlc.length < this.period) return []
    const smaData: SMAData[] = []
    for (let i = this.period - 1; i < ohlc.length; i++) {
      let sum = 0
      for (let j = i - this.period + 1; j <= i; j++) {
        sum += ohlc[j].close
      }
      const sma = sum / this.period
      smaData.push({
        time: ohlc[i].time,
        value: sma
      })
    }
    return smaData
  }

  /**
   * Renders SMA line on the chart
   *
   * Draws SMA line with appropriate styling and positioning. Includes
   * SMA label for identification and uses consistent color scheme.
   *
   * @param ohlc - Array of OHLC candle data for SMA calculation
   */
  render(ohlc: ChartOHLC[]): void {
    const smaData = this.calculateSMA(ohlc)
    if (smaData.length === 0) return
    const spacing = this.dimensions.chartWidth / ohlc.length
    this.ctx.strokeStyle = this.config.customBarColors?.bullish || '#4ecdc4'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([])
    this.ctx.beginPath()
    smaData.forEach((point) => {
      const originalIndex = ohlc.findIndex(candle => candle.time === point.time)
      if (originalIndex !== -1) {
        const x = this.dimensions.margin.left + originalIndex * spacing + spacing / 2
        const y = this.dimensions.margin.top + 
          ((this.priceRange.maxPrice - point.value) / this.priceRange.priceRange) * this.dimensions.chartHeight
        if (originalIndex === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
    })
    this.ctx.stroke()
    this.ctx.fillStyle = this.config.customBarColors?.bullish || '#4ecdc4'
    this.ctx.font = DEFAULT_FONT
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`SMA(${this.period})`, this.dimensions.margin.left + 5, this.dimensions.margin.top + 40)
  }
}

/**
 * Horizontal price levels renderer
 *
 * Renders horizontal lines representing support/resistance levels,
 * pivot points, and other significant price levels. Provides visual
 * reference for key price zones with customizable styling and labels.
 */
export class LevelsRenderer {
  private ctx: CanvasRenderingContext2D
  private dimensions: ChartDimensions
  private priceRange: PriceRange

  /**
   * Creates a new levels renderer instance
   *
   * Initializes the renderer with canvas context, chart dimensions,
   * and price range for accurate level positioning and scaling
   * across different chart types and price ranges.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param dimensions - Chart dimensions and margin configuration
   * @param priceRange - Price range for coordinate scaling
   */
  constructor(ctx: CanvasRenderingContext2D, dimensions: ChartDimensions, priceRange: PriceRange) {
    this.ctx = ctx
    this.dimensions = dimensions
    this.priceRange = priceRange
  }

  /**
   * Renders horizontal price levels
   *
   * Draws horizontal lines at specified price levels with customizable
   * styling including color, line style, and optional labels. Supports
   * both solid and dotted line styles for different level types.
   *
   * @param levels - Array of horizontal level configurations
   */
  render(levels: HorizontalLevel[]): void {
    levels.forEach(level => {
      const y =
        this.dimensions.margin.top +
        ((this.priceRange.maxPrice - level.value) / this.priceRange.priceRange) * this.dimensions.chartHeight
      this.ctx.strokeStyle = level.color
      this.ctx.lineWidth = 1
      this.ctx.setLineDash(level.lineStyle === 'dotted' ? [5, 5] : [])
      this.ctx.beginPath()
      this.ctx.moveTo(this.dimensions.margin.left, y)
      this.ctx.lineTo(this.dimensions.width - this.dimensions.margin.right, y)
      this.ctx.stroke()
      this.ctx.setLineDash([])
      if (level.label) {
        this.ctx.fillStyle = level.color
        this.ctx.font = DEFAULT_FONT
        this.ctx.textAlign = 'right'
        this.ctx.fillText(level.label, this.dimensions.margin.left - 10, y - 5)
      }
    })
  }
}

/**
 * Chart title renderer
 *
 * Renders chart title text at the top of the chart area with
 * customizable styling and positioning. Provides clear identification
 * and context for the chart content.
 */
export class TitleRenderer {
  private ctx: CanvasRenderingContext2D
  private width: number
  private config: ChartOptions

  /**
   * Creates a new title renderer instance
   *
   * Initializes the renderer with canvas context, chart width,
   * and configuration options for consistent title styling and
   * positioning across different chart types.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param width - Chart width for title positioning
   * @param config - Chart styling and configuration options
   */
  constructor(ctx: CanvasRenderingContext2D, width: number, config: ChartOptions) {
    this.ctx = ctx
    this.width = width
    this.config = config
  }

  /**
   * Renders chart title
   *
   * Draws the chart title text centered at the top of the chart
   * with bold styling and appropriate font size. Respects visibility
   * settings and applies consistent text styling.
   *
   * @param title - Title text to display on the chart
   */
  render(title: string): void {
    if (this.config.showTitle === false) return
    this.ctx.fillStyle = this.config.textColor || '#ffffff'
    this.ctx.font = 'bold 16px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(title, this.width / 2, 30)
  }
}

/**
 * Watermark overlay renderer
 *
 * Renders watermark text or image overlays on the chart with
 * customizable positioning, styling, and opacity. Provides branding
 * and attribution capabilities for chart images.
 */
export class WatermarkRenderer {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number

  /**
   * Creates a new watermark renderer instance
   *
   * Initializes the renderer with canvas context and chart dimensions
   * for accurate watermark positioning and scaling across different
   * chart sizes and orientations.
   *
   * @param ctx - Canvas rendering context for drawing operations
   * @param width - Chart width for watermark positioning
   * @param height - Chart height for watermark positioning
   */
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  /**
   * Renders watermark overlay
   *
   * Draws watermark text with customizable position, color, font size,
   * and opacity. Supports multiple positioning options and applies
   * appropriate text alignment for each position type.
   *
   * @param watermark - Watermark configuration object or text string
   */
  render(watermark: string | WatermarkConfig): void {
    const DEFAULT_POSITION = 'bottom-right'
    const DEFAULT_COLOR = '#ffffff'
    const DEFAULT_FONT_SIZE = 12
    const DEFAULT_OPACITY = 0.3
    let text = ''
    let position = DEFAULT_POSITION
    let color = DEFAULT_COLOR
    let fontSize = DEFAULT_FONT_SIZE
    let opacity = DEFAULT_OPACITY
    if (typeof watermark === 'string') {
      text = watermark
    } else {
      text = watermark.text
      position = watermark.position || DEFAULT_POSITION
      color = watermark.color || DEFAULT_COLOR
      fontSize = watermark.fontSize || DEFAULT_FONT_SIZE
      opacity = watermark.opacity || DEFAULT_OPACITY
    }
    this.ctx.globalAlpha = opacity
    this.ctx.fillStyle = color
    this.ctx.font = `${fontSize}px Arial`
    let x = 0
    let y = 0
    switch (position) {
      case 'top-left':
        x = 20
        y = 20
        this.ctx.textAlign = 'left'
        break
      case 'top-right':
        x = this.width - 20
        y = 20
        this.ctx.textAlign = 'right'
        break
      case 'bottom-left':
        x = 20
        y = this.height - 20
        this.ctx.textAlign = 'left'
        break
      case 'bottom-right':
      default:
        x = this.width - 20
        y = this.height - 20
        this.ctx.textAlign = 'right'
        break
      case 'center':
        x = this.width / 2
        y = this.height / 2
        this.ctx.textAlign = 'center'
        break
    }
    this.ctx.fillText(text, x, y)
    this.ctx.globalAlpha = 1
  }
}

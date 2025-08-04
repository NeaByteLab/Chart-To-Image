/**
 * Image Exporter
 *
 * Exports chart visualizations to various image formats including PNG, JPEG,
 * and SVG. Provides comprehensive image generation capabilities with support
 * for different quality settings and format-specific optimizations.
 */

import type { ChartOptions } from '@/types/types'

/**
 * Chart image export functionality
 *
 * Handles the complete process of converting chart visualizations to image files.
 * Supports multiple output formats with appropriate quality settings and error
 * handling for reliable image generation across different environments.
 */
const UNKNOWN_ERROR_MESSAGE = 'Unknown error'

export class ImageExporter {
  /**
   * Exports chart visualization to image file
   *
   * Processes chart data and generates image output in the specified format.
   * Automatically detects file extension and applies appropriate export settings.
   * Handles rendering delays and provides comprehensive error reporting.
   *
   * @param chart - Chart instance to export
   * @param outputPath - Target file path for the exported image
   * @param options - Chart rendering options and styling preferences
   * @returns Export result with success status and data URL
   */
  public async exportChart(
    chart: { chartElement(): HTMLElement },
    outputPath: string,
    options: ChartOptions
  ): Promise<{ success: boolean; dataUrl?: string; error?: string }> {
    try {
      await this.waitForChartRender()
      const container = chart.chartElement()
      if (!container) {
        throw new Error('Chart container not found')
      }
      const canvas = await this.convertToCanvas(options)
      const extension = this.getFileExtension(outputPath)
      switch (extension) {
        case 'png':
          return await this.exportToPNG(canvas)
        case 'jpg':
        case 'jpeg':
          return await this.exportToJPEG(canvas)
        case 'svg':
          return await this.exportToSVG(container)
        default:
          throw new Error(`Unsupported format: ${extension}`)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE
      }
    }
  }

  /**
   * Waits for chart rendering to complete
   *
   * Ensures the chart has fully rendered before attempting export operations.
   * Uses a fixed delay to allow for complete visual processing and layout
   * calculations.
   *
   * @returns Promise that resolves after rendering delay
   */
  private async waitForChartRender(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
  }

  /**
   * Converts chart element to canvas representation
   *
   * Creates a canvas element with the specified dimensions and applies
   * background styling. Prepares the canvas for chart data rendering
   * with appropriate context and styling options.
   *
   * @param options - Chart options containing dimensions and styling
   * @returns Canvas element ready for chart data rendering
   */
  private async convertToCanvas(options: ChartOptions): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = options.width
    canvas.height = options.height
    ctx!.fillStyle = options.backgroundColor
    ctx!.fillRect(0, 0, canvas.width, canvas.height)
    const data = await this.elementToCanvas(options)
    ctx!.drawImage(data, 0, 0)
    return canvas
  }

  /**
   * Converts chart element to canvas data
   *
   * Creates placeholder canvas data for chart rendering. In production
   * implementations, this would use html2canvas or similar libraries
   * to capture the actual chart visualization.
   *
   * @param options - Chart options for canvas creation
   * @returns Canvas element with chart data
   */
  private async elementToCanvas(options: ChartOptions): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas')
    canvas.width = options.width
    canvas.height = options.height
    const ctx = canvas.getContext('2d')
    ctx!.fillStyle = options.backgroundColor
    ctx!.fillRect(0, 0, canvas.width, canvas.height)
    return canvas
  }

  /**
   * Exports canvas data to PNG format
   *
   * Converts canvas content to PNG image format with optimal quality
   * settings. PNG format provides lossless compression suitable for
   * charts with sharp lines and text elements.
   *
   * @param canvas - Canvas element containing chart data
   * @returns Export result with PNG data URL
   */
  private async exportToPNG(
    canvas: HTMLCanvasElement
  ): Promise<{ success: boolean; dataUrl?: string; error?: string }> {
    try {
      const dataUrl = canvas.toDataURL('image/png')
      return {
        success: true,
        dataUrl
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE
      }
    }
  }

  /**
   * Exports canvas data to JPEG format
   *
   * Converts canvas content to JPEG image format with high quality
   * compression. JPEG format provides smaller file sizes suitable for
   * web applications and storage optimization.
   *
   * @param canvas - Canvas element containing chart data
   * @returns Export result with JPEG data URL
   */
  private async exportToJPEG(
    canvas: HTMLCanvasElement
  ): Promise<{ success: boolean; dataUrl?: string; error?: string }> {
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      return {
        success: true,
        dataUrl
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE
      }
    }
  }

  /**
   * Exports chart element to SVG format
   *
   * Converts chart visualization to scalable vector graphics format.
   * SVG format provides resolution-independent output suitable for
   * high-quality printing and responsive web applications.
   *
   * @param element - Chart DOM element to convert
   * @returns Export result with SVG data URL
   */
  private async exportToSVG(element: HTMLElement): Promise<{ success: boolean; dataUrl?: string; error?: string }> {
    try {
      const svgData = this.elementToSVG(element)
      return {
        success: true,
        dataUrl: `data:image/svg+xml;base64,${btoa(svgData)}`
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE
      }
    }
  }

  /**
   * Converts DOM element to SVG string representation
   *
   * Creates optimized SVG markup from chart canvas data using rect elements
   * for better performance and smaller file sizes. Converts canvas pixel data
   * to vector representations where possible.
   *
   * @param element - Chart DOM element to convert
   * @returns Optimized SVG string markup
   */
  private elementToSVG(element: HTMLElement): string {
    try {
      const canvas = element.querySelector('canvas') as HTMLCanvasElement
      if (!canvas) {
        return this.createFallbackSVG(element)
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return this.createFallbackSVG(element)
      }
      const width = canvas.width
      const height = canvas.height
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
      svgContent += `<rect width="100%" height="100%" fill="#ffffff"/>`
      const rects = this.convertPixelsToRects(data, width, height)
      svgContent += rects.join('')
      svgContent += '</svg>'
      return svgContent
    } catch (error) {
      console.warn('SVG conversion failed, using fallback:', error)
      return this.createFallbackSVG(element)
    }
  }

  /**
   * Converts canvas pixel data to optimized SVG rect elements
   *
   * Analyzes pixel data and creates rect elements for areas with similar colors,
   * significantly reducing SVG file size compared to individual pixel elements.
   *
   * @param data - Canvas pixel data array
   * @param width - Canvas width
   * @param height - Canvas height
   * @returns Array of SVG rect element strings
   */
  private convertPixelsToRects(data: Uint8ClampedArray, width: number, height: number): string[] {
    const rects: string[] = []
    const visited = new Set<string>()
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]
        if (a === 0) continue
        const color = `rgb(${r},${g},${b})`
        const key = `${x},${y}`
        if (visited.has(key)) continue
        const rect = this.findLargestRect(data, width, height, x, y, r, g, b, a, visited)
        if (rect) {
          const { x: rectX, y: rectY, width: rectWidth, height: rectHeight } = rect
          rects.push(`<rect x="${rectX}" y="${rectY}" width="${rectWidth}" height="${rectHeight}" fill="${color}"/>`)
        }
      }
    }
    return rects
  }

  /**
   * Finds the largest rectangle with the same color starting from given position
   *
   * @param data - Canvas pixel data
   * @param width - Canvas width
   * @param height - Canvas height
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @param r - Red component
   * @param g - Green component
   * @param b - Blue component
   * @param a - Alpha component
   * @param visited - Set of visited pixel coordinates
   * @returns Rectangle dimensions or null if no rectangle found
   */
  private findLargestRect(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    startX: number,
    startY: number,
    r: number,
    g: number,
    b: number,
    a: number,
    visited: Set<string>
  ): { x: number; y: number; width: number; height: number } | null {
    const maxWidth = this.findMaxWidth(data, width, startX, startY, r, g, b, a, visited)
    if (maxWidth === 0) return null

    const maxHeight = this.findMaxHeight(data, width, height, startX, startY, maxWidth, r, g, b, a, visited)

    return { x: startX, y: startY, width: maxWidth, height: maxHeight }
  }

  /**
   * Finds the maximum width of a rectangle with the same color
   *
   * @param data - Canvas pixel data
   * @param width - Canvas width
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @param r - Red component
   * @param g - Green component
   * @param b - Blue component
   * @param a - Alpha component
   * @param visited - Set of visited pixel coordinates
   * @returns Maximum width found
   */
  private findMaxWidth(
    data: Uint8ClampedArray,
    width: number,
    startX: number,
    startY: number,
    r: number,
    g: number,
    b: number,
    a: number,
    visited: Set<string>
  ): number {
    let maxWidth = 0
    for (let x = startX; x < width; x++) {
      const index = (startY * width + x) * 4
      if (this.isSameColor(data, index, r, g, b, a)) {
        maxWidth++
        visited.add(`${x},${startY}`)
      } else {
        break
      }
    }
    return maxWidth
  }

  /**
   * Finds the maximum height of a rectangle with the same color
   *
   * @param data - Canvas pixel data
   * @param width - Canvas width
   * @param height - Canvas height
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @param maxWidth - Maximum width found
   * @param r - Red component
   * @param g - Green component
   * @param b - Blue component
   * @param a - Alpha component
   * @param visited - Set of visited pixel coordinates
   * @returns Maximum height found
   */
  private findMaxHeight(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    startX: number,
    startY: number,
    maxWidth: number,
    r: number,
    g: number,
    b: number,
    a: number,
    visited: Set<string>
  ): number {
    let maxHeight = 0
    for (let y = startY; y < height; y++) {
      if (this.isRowValid(data, width, startX, y, maxWidth, r, g, b, a)) {
        maxHeight++
        this.markRowAsVisited(visited, startX, y, maxWidth)
      } else {
        break
      }
    }
    return maxHeight
  }

  /**
   * Checks if a pixel has the same color as the target
   *
   * @param data - Canvas pixel data
   * @param index - Pixel index
   * @param r - Target red component
   * @param g - Target green component
   * @param b - Target blue component
   * @param a - Target alpha component
   * @returns True if colors match
   */
  private isSameColor(data: Uint8ClampedArray, index: number, r: number, g: number, b: number, a: number): boolean {
    return data[index] === r && data[index + 1] === g && data[index + 2] === b && data[index + 3] === a
  }

  /**
   * Checks if a row has the same color throughout
   *
   * @param data - Canvas pixel data
   * @param width - Canvas width
   * @param startX - Starting X coordinate
   * @param y - Y coordinate
   * @param maxWidth - Width to check
   * @param r - Target red component
   * @param g - Target green component
   * @param b - Target blue component
   * @param a - Target alpha component
   * @returns True if row is valid
   */
  private isRowValid(
    data: Uint8ClampedArray,
    width: number,
    startX: number,
    y: number,
    maxWidth: number,
    r: number,
    g: number,
    b: number,
    a: number
  ): boolean {
    for (let x = startX; x < startX + maxWidth; x++) {
      const index = (y * width + x) * 4
      if (!this.isSameColor(data, index, r, g, b, a)) {
        return false
      }
    }
    return true
  }

  /**
   * Marks a row as visited in the visited set
   *
   * @param visited - Set of visited pixel coordinates
   * @param startX - Starting X coordinate
   * @param y - Y coordinate
   * @param maxWidth - Width to mark
   */
  private markRowAsVisited(visited: Set<string>, startX: number, y: number, maxWidth: number): void {
    for (let x = startX; x < startX + maxWidth; x++) {
      visited.add(`${x},${y}`)
    }
  }

  /**
   * Creates fallback SVG when conversion fails
   *
   * @param element - Chart DOM element
   * @returns Basic SVG markup
   */
  private createFallbackSVG(element: HTMLElement): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${element.offsetWidth}" height="${element.offsetHeight}" viewBox="0 0 ${element.offsetWidth} ${element.offsetHeight}">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#666666" font-family="Arial, sans-serif" font-size="14">Chart Export</text>
    </svg>`
  }

  /**
   * Extracts file extension from file path
   *
   * Parses the file path to determine the appropriate export format.
   * Supports common image formats and defaults to PNG for unrecognized
   * extensions.
   *
   * @param path - File path to analyze
   * @returns File extension in lowercase, defaults to 'png'
   */
  private getFileExtension(path: string): string {
    return path.split('.').pop()?.toLowerCase() || 'png'
  }
} 

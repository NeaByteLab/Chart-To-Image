#!/usr/bin/env node

/**
 * Chart-To-Image CLI
 * Command line interface for converting trading charts to images
 */

import { ChartRenderer } from '@/core/renderer'
import { ChartConfig } from '@/core/config'
import { parseArgs, validateArgs, showHelp } from '@/utils/cli'
import { fetchMarketData, generateMultipleCharts } from '@/index'
import type { Exchange } from '@/types/types'
import { ComparisonService } from '@/core/comparison'

/**
 * Main CLI entry point
 * Handles command line arguments and executes appropriate actions
 */
async function main(): Promise<void> {
  try {
    const args = parseArgs()
    if (args.help) {
      showHelp()
      return
    }
    if (!validateArgs(args)) {
      process.exit(1)
    }
    if (args.batch) {
      console.log('🔄 Processing batch charts...')
      const configs = args.batch.map((config: any) => ({
        symbol: config.symbol,
        outputPath: config.output,
        timeframe: config.timeframe || '1h',
        exchange: config.exchange || 'binance',
        width: config.width || 800,
        height: config.height || 600,
        theme: config.theme || 'dark'
      }))
      const results = await generateMultipleCharts(configs)
      console.log('\n📊 Batch Results:')
      results.forEach((result, index) => {
        if (result.success) {
          console.log(`✅ Chart ${index + 1}: ${result.outputPath}`)
        } else {
          console.log(`❌ Chart ${index + 1}: ${result.error}`)
        }
      })
      return
    }
    if (args.fetch) {
      console.log(`📈 Fetching market data for ${args.symbol}...`)
      const data = await fetchMarketData(
        args.symbol!,
        args.timeframe || '1h',
        (args.exchange as Exchange) || 'binance',
        args.limit || 100
      )
      console.log(`📊 Fetched ${data.length} candles`)
      console.log('Sample data:', data.slice(0, 3))
      return
    }
    if (args.compare) {
      await handleComparison(args)
      return
    }
    console.log(`🎨 Generating chart for ${args.symbol}...`)
    const configData: any = {
      symbol: args.symbol!,
      outputPath: args.output!
    }
    if (args.timeframe) configData.timeframe = args.timeframe
    if (args.exchange) configData.exchange = args.exchange
    if (args.width) configData.width = args.width
    if (args.height) configData.height = args.height
    if (args.theme) configData.theme = args.theme
    if (args.backgroundColor) configData.backgroundColor = args.backgroundColor
    if (args.textColor) configData.textColor = args.textColor
    if (args.chartType) configData.chartType = args.chartType
    if (args.title) configData.title = args.title
    if (args.scaleX || args.scaleY || args.autoScale || args.minScale || args.maxScale) {
      configData.scale = {}
      if (args.scaleX !== undefined) configData.scale.x = args.scaleX
      if (args.scaleY !== undefined) configData.scale.y = args.scaleY
      if (args.autoScale) configData.scale.autoScale = true
      if (args.minScale !== undefined) configData.scale.minScale = args.minScale
      if (args.maxScale !== undefined) configData.scale.maxScale = args.maxScale
    }
    if (args.customColors) {
      const colorParts = args.customColors.split(',')
      configData.customBarColors = {}
      colorParts.forEach(part => {
        const [type, color] = part.split('=')
        if (type && color) {
          configData.customBarColors[type.trim()] = color.trim()
        }
      })
    }
    if (args.levels) {
      const levelParts = args.levels.split(',')
      configData.horizontalLevels = levelParts.map(level => {
        const [value, color, lineStyle, label] = level.split(':')
        return {
          value: parseFloat(value),
          color: color,
          lineStyle: lineStyle as 'solid' | 'dotted',
          label: label,
          type: 'custom'
        }
      })
    }
    if (args.watermark) {
      if (args.watermarkPosition || args.watermarkColor || args.watermarkSize || args.watermarkOpacity) {
        configData.watermark = {
          text: args.watermark,
          position: args.watermarkPosition as any,
          color: args.watermarkColor,
          fontSize: args.watermarkSize,
          opacity: args.watermarkOpacity
        }
      } else {
        configData.watermark = args.watermark
      }
    }
    if (args.hideTitle) {
      configData.showTitle = false
    }
    if (args.hideTimeAxis) {
      configData.showTimeAxis = false
    }
    if (args.hideGrid) {
      configData.showGrid = false
    }
    if (args.showVWAP) {
      configData.showVWAP = true
    }
    if (args.showEMA) {
      configData.showEMA = true
      configData.emaPeriod = args.emaPeriod || 20
    }
    if (args.showSMA) {
      configData.showSMA = true
      configData.smaPeriod = args.smaPeriod || 20
    }
    const config = new ChartConfig(configData)
    const renderer = new ChartRenderer(config)
    const result = await renderer.generateChart()
    if (result.success) {
      console.log(`✅ Chart saved to: ${result.outputPath}`)
      if (result.dataUrl) {
        console.log(`📊 Data URL available: ${result.dataUrl.substring(0, 50)}...`)
      }
    } else {
      console.error(`❌ Failed to generate chart: ${result.error}`)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

/**
 * Handles comparison chart generation
 *
 * @param args - CLI arguments for comparison
 */
async function handleComparison(args: any): Promise<void> {
  if (!args.compare) {
    console.error('Error: --compare requires comma-separated symbols')
    process.exit(1)
  }
  if (!args.output) {
    console.error('Error: --output is required for comparison charts')
    process.exit(1)
  }
  const symbols = args.compare.split(',').map((s: string) => s.trim())
  if (symbols.length < 2) {
    console.error('Error: Comparison requires at least 2 symbols')
    process.exit(1)
  }
  console.log(`🔄 Generating comparison chart for: ${symbols.join(', ')}`)
  const comparisonConfig: any = {
    symbols,
    outputPath: args.output,
    timeframe: args.timeframe,
    exchange: args.exchange,
    theme: args.theme,
    chartType: args.chartType,
    showVWAP: args.showVWAP,
    showEMA: args.showEMA,
    emaPeriod: args.emaPeriod,
    showSMA: args.showSMA,
    smaPeriod: args.smaPeriod
  }
  if (args.customColors) {
    const colorParts = args.customColors.split(',')
    const customBarColors: Record<string, string> = {}
    colorParts.forEach((part: string) => {
      const [type, color] = part.split('=')
      if (type && color) {
        customBarColors[type.trim()] = color.trim()
      }
    })
    if (Object.keys(customBarColors).length > 0) {
      comparisonConfig.customBarColors = customBarColors
    }
  }
  if (args.timeframes) {
    const timeframes = args.timeframes.split(',').map((tf: string) => tf.trim())
    comparisonConfig.timeframes = timeframes
  }
  let result
  if (args.layout === 'grid') {
    const columns = args.columns || 2
    result = await ComparisonService.grid(symbols, columns, args.output, comparisonConfig)
  } else {
    result = await ComparisonService.sideBySide(symbols, args.output, comparisonConfig)
  }
  if (result.success) {
    console.log(`✅ Comparison chart saved to: ${result.outputPath}`)
  } else {
    console.error(`❌ Failed to generate comparison: ${result.error}`)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message)
  process.exit(1)
})
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason)
  process.exit(1)
})
main()
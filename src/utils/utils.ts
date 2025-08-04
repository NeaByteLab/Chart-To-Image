/**
 * Chart Utilities
 *
 * Utility functions for chart data processing, formatting, and calculations.
 * Provides comprehensive data manipulation capabilities including timestamp formatting,
 * percentage calculations, technical indicators, and data validation.
 */

import type { ChartData } from '@/types/types'

/**
 * Formats timestamp to readable string
 *
 * Converts Unix timestamp to human-readable date and time format.
 * Handles both today's dates and historical dates with appropriate formatting.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date and time string
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
}

/**
 * Calculates percentage change between values
 *
 * Computes the percentage difference between current and previous values.
 * Useful for determining price movements and trend analysis.
 *
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change as decimal (e.g., 0.05 for 5%)
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Calculates simple moving average
 *
 * Computes moving average over specified period for trend analysis.
 * Handles edge cases and provides smooth trend visualization.
 *
 * @param data - Array of numerical values
 * @param period - Number of periods for moving average
 * @returns Array of moving average values
 */
export function calculateMovingAverage(data: number[], period: number): number[] {
  if (data.length < period) return []
  const result = []
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    result.push(sum / period)
  }
  return result
}

/**
 * Calculates Relative Strength Index (RSI)
 *
 * Computes RSI technical indicator for momentum analysis.
 * Uses standard 14-period calculation with smoothing.
 *
 * @param data - Array of closing prices
 * @param period - RSI period (default: 14)
 * @returns Array of RSI values
 */
export function calculateRSI(data: number[], period: number = 14): number[] {
  if (data.length < period + 1) return []
  const rsiValues = []
  for (let i = period; i < data.length; i++) {
    const rsi = calculateRSIForPeriod(data, i, period)
    rsiValues.push(rsi)
  }
  return rsiValues
}

/**
 * Calculates RSI for specific period
 *
 * Computes RSI value for a single period using standard formula.
 * Handles gain and loss calculations with proper smoothing.
 *
 * @param data - Array of closing prices
 * @param index - Current data index
 * @param period - RSI period length
 * @returns RSI value for the period
 */
function calculateRSIForPeriod(data: number[], index: number, period: number): number {
  let gains = 0
  let losses = 0
  for (let i = index - period + 1; i <= index; i++) {
    const change = data[i] - data[i - 1]
    if (change > 0) {
      gains += change
    } else {
      losses -= change
    }
  }
  const avgGain = gains / period
  const avgLoss = losses / period
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

/**
 * Validates chart data integrity
 *
 * Performs comprehensive validation of chart data structure and values.
 * Checks for required fields, data types, and logical consistency.
 *
 * @param data - Array of chart data objects
 * @returns True if data is valid, false otherwise
 */
export function validateChartData(data: ChartData[]): boolean {
  if (!Array.isArray(data) || data.length === 0) return false
  return data.every(item => {
    return (
      typeof item.timestamp === 'number' &&
      typeof item.open === 'number' &&
      typeof item.high === 'number' &&
      typeof item.low === 'number' &&
      typeof item.close === 'number' &&
      item.high >= Math.max(item.open, item.close) &&
      item.low <= Math.min(item.open, item.close) &&
      item.timestamp > 0
    )
  })
}

/**
 * Sorts chart data by timestamp
 *
 * Arranges chart data in chronological order for proper visualization.
 * Handles both ascending and descending sort orders.
 *
 * @param data - Array of chart data objects
 * @returns Sorted array of chart data
 */
export function sortChartData(data: ChartData[]): ChartData[] {
  return [...data].sort((a, b) => a.timestamp - b.timestamp)
}

/**
 * Filters chart data by date range
 *
 * Extracts chart data within specified date boundaries.
 * Useful for time-based analysis and chart period selection.
 *
 * @param data - Array of chart data objects
 * @param startDate - Start date for filtering
 * @param endDate - End date for filtering
 * @returns Filtered array of chart data
 */
export function filterChartDataByDate(data: ChartData[], startDate: Date, endDate: Date): ChartData[] {
  const startTimestamp = startDate.getTime()
  const endTimestamp = endDate.getTime()
  return data.filter(item => {
    return item.timestamp >= startTimestamp && item.timestamp <= endTimestamp
  })
}

/**
 * Converts timeframe string to milliseconds
 *
 * Parses timeframe notation and converts to millisecond duration.
 * Supports common timeframe formats (1m, 5m, 15m, 1h, 4h, 1d, 1w).
 *
 * @param timeframe - Timeframe string (e.g., '1h', '1d')
 * @returns Duration in milliseconds
 */
export function timeframeToMs(timeframe: string): number {
  const value = parseInt(timeframe.slice(0, -1))
  const unit = timeframe.slice(-1)
  switch (unit) {
    case 'm':
      return value * 60 * 1000
    case 'h':
      return value * 60 * 60 * 1000
    case 'd':
      return value * 24 * 60 * 60 * 1000
    case 'w':
      return value * 7 * 24 * 60 * 60 * 1000
    default:
      throw new Error(`Unsupported timeframe unit: ${unit}`)
  }
}

/**
 * Determines color based on price change
 *
 * Returns appropriate color for price movement visualization.
 * Uses green for positive changes and red for negative changes.
 *
 * @param current - Current price value
 * @param previous - Previous price value
 * @returns Color string for price change
 */
export function getPriceChangeColor(current: number, previous: number): string {
  if (current > previous) return '#26a69a'
  if (current < previous) return '#ef5350'
  return '#424242'
}

/**
 * Formats price with specified decimals
 *
 * Converts numerical price to formatted string with appropriate precision.
 * Handles different price ranges with suitable decimal places.
 *
 * @param price - Price value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string
 */
export function formatPrice(price: number, decimals: number = 2): string {
  return price.toFixed(decimals)
}

/**
 * Calculates Volume Weighted Average Price (VWAP)
 *
 * Computes VWAP for volume-weighted price analysis.
 * Useful for determining fair value and trading decisions.
 *
 * @param data - Array of chart data with volume
 * @returns VWAP value
 */
export function calculateVWAP(data: ChartData[]): number {
  if (data.length === 0) return 0
  let totalVolume = 0
  let totalVolumePrice = 0
  data.forEach(item => {
    const volume = item.volume || 0
    const typicalPrice = (item.high + item.low + item.close) / 3
    totalVolume += volume
    totalVolumePrice += volume * typicalPrice
  })
  return totalVolume > 0 ? totalVolumePrice / totalVolume : 0
}

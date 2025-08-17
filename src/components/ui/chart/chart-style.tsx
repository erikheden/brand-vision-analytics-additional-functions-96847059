
import * as React from "react"
import { ChartConfig, THEMES } from "./types"

// Sanitize CSS identifier to prevent XSS
const sanitizeCSSIdentifier = (str: string): string => {
  // Remove any non-alphanumeric characters except hyphens and underscores
  return str.replace(/[^a-zA-Z0-9_-]/g, '')
}

// Sanitize CSS color value to prevent XSS
const sanitizeCSSColor = (color: string): string => {
  // Only allow valid CSS color formats
  const validColorRegex = /^(#[0-9a-fA-F]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-zA-Z]+)$/
  return validColorRegex.test(color.trim()) ? color.trim() : ''
}

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  // Sanitize the chart ID to prevent XSS
  const sanitizedId = sanitizeCSSIdentifier(id)
  
  if (!sanitizedId) {
    console.warn('ChartStyle: Invalid chart ID provided, skipping style generation')
    return null
  }

  const cssContent = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const sanitizedPrefix = sanitizeCSSIdentifier(prefix)
      if (!sanitizedPrefix) return ''
      
      const colorRules = colorConfig
        .map(([key, itemConfig]) => {
          const sanitizedKey = sanitizeCSSIdentifier(key)
          if (!sanitizedKey) return null
          
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
            itemConfig.color
          
          if (!color) return null
          
          const sanitizedColor = sanitizeCSSColor(color)
          if (!sanitizedColor) return null
          
          return `  --color-${sanitizedKey}: ${sanitizedColor};`
        })
        .filter(Boolean)
        .join('\n')
      
      if (!colorRules) return ''
      
      return `${sanitizedPrefix} [data-chart="${sanitizedId}"] {\n${colorRules}\n}`
    })
    .filter(Boolean)
    .join('\n')

  if (!cssContent) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: cssContent,
      }}
    />
  )
}

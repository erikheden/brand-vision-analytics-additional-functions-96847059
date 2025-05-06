
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

/**
 * Get color based on country code
 */
export function getCountryColor(country: string): string {
  const colorMap: Record<string, string> = {
    'Se': '#34502b',
    'No': '#5c8f4a',
    'Dk': '#84c066',
    'Fi': '#aad68b',
    'Nl': '#d1ebc1',
    // Add uppercase variants
    'SE': '#34502b',
    'NO': '#5c8f4a',
    'DK': '#84c066',
    'FI': '#aad68b',
    'NL': '#d1ebc1'
  };
  
  return colorMap[country] || '#34502b';
}

/**
 * Generate a stable chart ID for Highcharts
 */
export function generateChartId(selectedYear: number, countries: string[]): string {
  return `multi-country-chart-${selectedYear}-${countries.sort().join('-')}`;
}

/**
 * Tooltip formatter for the chart
 */
export function createTooltipFormatter() {
  return function(this: any) {
    const countryName = this.series.name;
    const influenceType = this.point.category;
    const percentage = this.y || 0;
    
    return `<b>${countryName}</b><br/>${influenceType}: ${percentage.toFixed(1)}%`;
  };
}


// This file now serves as a re-export of the refactored modules
import { CHART_COLORS, getGradientColors, getSeriesColors } from './config/chartColors';
import { getChartHeight } from './config/dimensionUtils';
import { createStandardChartOptions } from './config/standardChartOptions';
import { createPercentageChartOptions } from './config/percentageChartOptions';

export {
  CHART_COLORS,
  getGradientColors,
  getSeriesColors,
  getChartHeight,
  createStandardChartOptions,
  createPercentageChartOptions
};

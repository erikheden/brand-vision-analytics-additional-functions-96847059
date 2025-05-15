
import Highcharts from 'highcharts';
import { createChartStyles } from './utils/chartStyles';
import { createPlotOptions } from './utils/plotOptions';
import { createTopicTooltipFormatter } from './utils/tooltipFormatter';
import { createTitleSubtitle } from './utils/createTitleSubtitle';

export const createTopicTrendChartOptions = (
  data: any[],
  selectedCountries: string[],
  selectedTopics: string[]
): Highcharts.Options => {
  // Get chart styles
  const styles = createChartStyles();
  
  // Get plot options
  const plotOptionsConfig = createPlotOptions();
  
  // Get title and subtitle
  const titleConfig = createTitleSubtitle(selectedCountries);
  
  // Combine all configurations into the final options object
  const options: Highcharts.Options = {
    ...styles,
    ...titleConfig,
    tooltip: {
      shared: true,
      formatter: createTopicTooltipFormatter()
    },
    ...plotOptionsConfig
  };

  return options;
};

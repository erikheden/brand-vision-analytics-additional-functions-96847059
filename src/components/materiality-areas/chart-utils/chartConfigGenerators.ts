
import { Options } from 'highcharts';
import { 
  getCommonChartOptions, 
  createTooltipFormatter, 
  createDataLabelFormatter,
  sortCategoriesByTotal,
  sortVhoTypes,
  getColor
} from './chartColorUtils';

export interface ChartDataItem {
  name: string;
  value: number;
  category: string;
}

// Create standard column chart options
export const createBarChartOptions = (
  data: ChartDataItem[], 
  title: string, 
  categories: string[]
): Options => {
  // Get all unique categories present in data
  const uniqueCategories = [...new Set(data.map(item => item.category))];
  
  // Get all unique VHO types present in data
  const vhoTypes = [...new Set(data.map(item => item.name))];
  
  // Sort VHO types and categories
  const sortedTypes = sortVhoTypes(vhoTypes);
  const sortedCategories = sortCategoriesByTotal(uniqueCategories, data);

  const commonOptions = getCommonChartOptions(title);
  
  return {
    ...commonOptions,
    xAxis: {
      categories: sortedCategories,
      title: {
        text: 'Sustainability Areas'
      }
    },
    tooltip: {
      formatter: createTooltipFormatter()
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: createDataLabelFormatter()
        },
        borderRadius: 3
      }
    },
    series: sortedTypes.map((type, index) => ({
      type: 'column', // Specify that this is a column type series
      name: type,
      data: sortedCategories.map(category => {
        const item = data.find(d => d.name === type && d.category === category);
        return item ? item.value : 0;
      }),
      color: getColor(type, index)
    }))
  };
};

// Create stacked column chart options
export const createStackedChartOptions = (
  data: ChartDataItem[], 
  title: string, 
  categories: string[]
): Options => {
  // Get all unique categories present in data
  const uniqueCategories = [...new Set(data.map(item => item.category))];
  
  // Get all unique VHO types present in data
  const vhoTypes = [...new Set(data.map(item => item.name))];
  
  // Sort VHO types and categories
  const sortedTypes = sortVhoTypes(vhoTypes);
  const sortedCategories = sortCategoriesByTotal(uniqueCategories, data);

  const commonOptions = getCommonChartOptions(title);
  
  return {
    ...commonOptions,
    xAxis: {
      categories: sortedCategories,
      title: {
        text: 'Sustainability Areas'
      }
    },
    tooltip: {
      formatter: createTooltipFormatter()
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          formatter: createDataLabelFormatter()
        },
        borderRadius: 3
      }
    },
    series: sortedTypes.map((type, index) => ({
      type: 'column', // Specify that this is a column type series
      name: type,
      data: sortedCategories.map(category => {
        const item = data.find(d => d.name === type && d.category === category);
        return item ? item.value : 0;
      }),
      color: getColor(type, index)
    }))
  };
};

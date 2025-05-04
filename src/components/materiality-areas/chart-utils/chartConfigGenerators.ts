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
    chart: {
      ...commonOptions.chart,
      spacingBottom: 20,
      spacingTop: 30,
      spacingLeft: 30,
      spacingRight: 30,
      height: 550
    },
    xAxis: {
      categories: sortedCategories,
      title: {
        text: 'Sustainability Areas',
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        },
        margin: 20
      },
      labels: {
        style: {
          fontSize: '12px'
        },
        rotation: -45,
        y: 30
      }
    },
    tooltip: {
      formatter: createTooltipFormatter()
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: createDataLabelFormatter(),
          style: {
            fontSize: '12px',
            fontWeight: 'normal'
          }
        },
        borderRadius: 3,
        pointPadding: 0.1,
        groupPadding: 0.2
      }
    },
    series: sortedTypes.map((type, index) => ({
      type: 'column' as const,
      name: type,
      data: sortedCategories.map(category => {
        const item = data.find(d => d.name === type && d.category === category);
        return item ? item.value : 0;
      }),
      color: getColor(type, index)
    }))
  };
};

// Keep the function for reference but it won't be used directly
export const createStackedChartOptions = (
  data: ChartDataItem[], 
  title: string, 
  categories: string[]
): Options => {
  // ... keep existing code
};

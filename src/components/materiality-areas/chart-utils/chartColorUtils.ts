
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';

// Color mapping for VHO types
export const getColor = (category: string, index: number) => {
  const colors = [
    '#34502b', '#7c9457', '#b7c895', '#6ec0dc', '#09657b', '#d9d9d9',
    '#25636b', '#3d7882', '#578d96', '#72a2aa', '#8db7be', '#a8ccd1'
  ];
  
  // Use consistent colors for specific categories if needed
  const colorMap: Record<string, string> = {
    'Food & Beverage': '#34502b',
    'Fashion & Apparel': '#7c9457',
    'Beauty & Personal Care': '#b7c895',
    'Home & Living': '#6ec0dc',
    'Electronics': '#09657b',
    'Travel & Tourism': '#d9d9d9'
  };
  
  return colorMap[category] || colors[index % colors.length];
};

// Define the correct sorting order for VHO types
export const vhoTypeOrder = ["Hygiene Factor", "More Of Factor"];

// Sort VHO types according to defined order
export const sortVhoTypes = (vhoTypes: string[]) => {
  return vhoTypes.sort((a, b) => {
    const indexA = vhoTypeOrder.indexOf(a);
    const indexB = vhoTypeOrder.indexOf(b);
    
    // If both are found in the ordering array, compare indices
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If one is not in the ordering array, prioritize the one that is
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither is in the ordering array, sort alphabetically
    return a.localeCompare(b);
  });
};

// For each category, calculate total percentage to sort by
export const sortCategoriesByTotal = (uniqueCategories: string[], data: any[]) => {
  const categoriesWithTotals = uniqueCategories.map(category => {
    const totalValue = data
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.value, 0);
    return { name: category, total: totalValue };
  });

  // Sort categories by total percentage (high to low)
  return categoriesWithTotals
    .sort((a, b) => b.total - a.total)
    .map(item => item.name);
};

// Create tooltip formatter function
export const createTooltipFormatter = () => {
  return function() {
    return `<b>${this.series.name}</b><br>${this.x}: ${roundPercentage(this.y)}%`;
  };
};

// Create data label formatter function
export const createDataLabelFormatter = () => {
  return function() {
    return this.y > 5 ? roundPercentage(this.y) + '%' : '';
  };
};

// Common chart styling options
export const getCommonChartOptions = (title: string) => {
  return {
    chart: {
      type: 'column',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: title,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Percentage (%)'
      },
      labels: {
        format: '{value}%'
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal'
    }
  };
};

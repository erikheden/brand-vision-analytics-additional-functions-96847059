
import { FONT_FAMILY } from '@/utils/constants';
import { ProcessedChartData } from '@/types/impact';

export const useChartOptions = (
  viewMode: 'byCategory' | 'byImpactLevel',
  selectedYear: number | null,
  selectedCategory: string,
  selectedImpactLevel: string,
  selectedCategories: string[],
  activeCountries: string[]
) => {
  const createCategoryChart = {
    chart: {
      type: 'column',
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: `Country Comparison - ${selectedImpactLevel} Impact Level (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    subtitle: {
      text: 'Comparison across categories',
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      categories: selectedCategories,
      title: {
        text: 'Category',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Percentage',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: { format: '{value}%' }
    },
    legend: {
      enabled: true,
      itemStyle: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        let html = `<div style="font-family:${FONT_FAMILY}"><b>${this.x}</b><br/>`;
        this.points?.forEach(point => {
          html += `<span style="color: ${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y.toFixed(1)}%</b><br/>`;
        });
        html += '</div>';
        return html;
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    credits: { enabled: false }
  };

  const createImpactLevelChart = {
    ...createCategoryChart,
    title: {
      text: `Country Comparison - ${selectedCategory} (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    subtitle: {
      text: 'Comparison across impact levels',
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      title: {
        text: 'Impact Level',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    }
  };

  return {
    createCategoryChart: viewMode === 'byCategory' ? createCategoryChart : null,
    createImpactLevelChart: viewMode === 'byImpactLevel' ? createImpactLevelChart : null
  };
};

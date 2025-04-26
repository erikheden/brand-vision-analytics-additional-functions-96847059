
import { useMemo } from 'react';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

export const useComparisonChartData = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategory: string,
  selectedImpactLevel: string,
  selectedYear: number | null,
  selectedCategories: string[],
  impactLevels: string[],
  activeCountries: string[]
) => {
  const createCategoryChart = useMemo(() => {
    if (!selectedImpactLevel) return { chart: { type: 'bar' }, series: [] };
    
    const seriesData = activeCountries.map(country => ({
      name: getFullCountryName(country),
      data: selectedCategories.map(category => {
        const countryData = processedData[category]?.[selectedYear]?.[selectedImpactLevel] || 0;
        return countryData * 100;
      }),
      type: 'column' as const
    }));
    
    return {
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
      series: seriesData,
      credits: { enabled: false }
    };
  }, [selectedImpactLevel, activeCountries, selectedCategories, processedData, selectedYear]);

  const createImpactLevelChart = useMemo(() => {
    if (!selectedCategory) return { chart: { type: 'bar' }, series: [] };
    
    const seriesData = activeCountries.map(country => ({
      name: getFullCountryName(country),
      data: impactLevels.map(level => {
        const countryData = processedData[selectedCategory]?.[selectedYear]?.[level] || 0;
        return countryData * 100;
      }),
      type: 'column' as const
    }));
    
    return {
      chart: {
        type: 'column',
        backgroundColor: 'white',
        style: { fontFamily: FONT_FAMILY }
      },
      title: {
        text: `Country Comparison - ${selectedCategory} (${selectedYear})`,
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      subtitle: {
        text: 'Comparison across impact levels',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      xAxis: {
        categories: impactLevels,
        title: {
          text: 'Impact Level',
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
      series: seriesData,
      credits: { enabled: false }
    };
  }, [selectedCategory, activeCountries, impactLevels, processedData, selectedYear]);

  return {
    createCategoryChart,
    createImpactLevelChart
  };
};

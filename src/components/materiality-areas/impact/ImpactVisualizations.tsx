
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { useImpactChartData } from '@/hooks/useImpactChartData';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';

interface ImpactVisualizationsProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  selectedLevels: string[];
  isLoading: boolean;
  error: Error | null;
}

const ImpactVisualizations: React.FC<ImpactVisualizationsProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  selectedLevels,
  isLoading,
  error
}) => {
  // Process chart data using the existing hook
  const chartData = useImpactChartData(
    processedData,
    selectedYear,
    selectedCategories,
    selectedLevels,
    selectedCategories,
    selectedLevels
  );
  
  // Debug data - wrapped with useEffect to prevent unnecessary logging
  React.useEffect(() => {
    console.log('ImpactVisualizations - Chart Data:', {
      byLevel: chartData.byLevel.length,
      byCategory: chartData.byCategory.length
    });
    console.log('ImpactVisualizations - Selected Year:', selectedYear);
  }, [chartData.byLevel.length, chartData.byCategory.length, selectedYear]);
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#34502b] mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading impact data...</p>
          </div>
        </div>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-500 font-medium">Error loading data</p>
          <p className="text-gray-500 mt-2">{error.message}</p>
        </div>
      </Card>
    );
  }
  
  // Empty state if no data is available
  if (
    !selectedYear || 
    selectedCategories.length === 0 || 
    selectedLevels.length === 0 ||
    (chartData.byCategory.length === 0 && chartData.byLevel.length === 0)
  ) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-gray-500">No data available for the selected filters.</p>
          <p className="text-gray-400 text-sm mt-2">
            Try selecting different categories, impact levels, or years.
          </p>
        </div>
      </Card>
    );
  }
  
  // Memoize chart options to prevent unnecessary re-renders
  const categoryChartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: `Impact by Category (${selectedYear})`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      categories: [...new Set(chartData.byCategory.map(item => item.name))],
      title: {
        text: 'Category',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Percentage',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        format: '{value}%'
      }
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        return `<div style="font-family: ${FONT_FAMILY}">
          <b>${this.x}</b><br/>
          ${this.points ? this.points.map(point => 
            `<span style="color: ${point.color}">●</span> ${point.series.name}: <b>${point.y.toFixed(1)}%</b>`
          ).join('<br/>') : ''}
        </div>`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y}%',
          style: {
            fontFamily: FONT_FAMILY
          }
        }
      }
    },
    series: selectedLevels.map(level => ({
      name: level,
      data: chartData.byCategory
        .filter(item => item.category === level)
        .map(item => item.value)
    })),
    credits: {
      enabled: false
    }
  }), [chartData.byCategory, selectedLevels, selectedYear]);
  
  // Memoize level chart options to prevent unnecessary re-renders
  const levelChartOptions = useMemo(() => ({
    chart: {
      type: 'pie',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: `Impact Level Distribution (${selectedYear})`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            fontFamily: FONT_FAMILY
          }
        }
      }
    },
    series: [{
      name: 'Impact Levels',
      colorByPoint: true,
      data: selectedLevels.map((level, index) => {
        const levelData = chartData.byLevel.filter(item => item.name === level);
        const total = levelData.reduce((sum, item) => sum + item.value, 0) / levelData.length;
        
        return {
          name: level,
          y: total,
          color: `rgba(52, 80, 43, ${0.9 - (index * 0.2)})`
        };
      })
    }],
    credits: {
      enabled: false
    }
  }), [chartData.byLevel, selectedLevels, selectedYear]);
  
  return (
    <div className="space-y-8">
      {/* Bar chart showing categories */}
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={categoryChartOptions}
          // Add immutable flag to improve performance
          immutable={true}
        />
      </Card>
      
      {/* Pie chart showing impact level distribution */}
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={levelChartOptions}
          // Add immutable flag to improve performance
          immutable={true}
        />
      </Card>
      
      {/* Analysis summary */}
      <Card className="p-4 bg-[#f1f0fb] border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-[#34502b] mb-2">Analysis Summary</h3>
        <p className="text-gray-600">
          This visualization shows the distribution of impact levels across selected categories for the year {selectedYear}.
          {selectedCategories.length > 1 ? 
            ` Multiple categories are displayed to allow for comparison.` :
            ` The selected category is displayed in detail.`
          }
        </p>
      </Card>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(ImpactVisualizations);

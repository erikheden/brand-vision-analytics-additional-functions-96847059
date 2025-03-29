
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { VHOData } from '@/hooks/useVHOData';
import { FONT_FAMILY } from '@/utils/constants';

interface VHOAreaBarChartProps {
  data: VHOData[];
}

const VHOAreaBarChart: React.FC<VHOAreaBarChartProps> = ({ data }) => {
  // Process chart data
  const { chartData, factors } = useMemo(() => {
    // Get unique areas
    const areas = [...new Set(data.map(item => item.vho_area))];
    
    // Get unique factor types
    const factorTypes = [...new Set(data.map(item => item.type_of_factor))];
    
    // Create a map of area to percentages for each factor type
    const percentagesByFactor: Record<string, Record<string, number>> = {};
    
    factorTypes.forEach(factor => {
      percentagesByFactor[factor] = {};
      
      // For each area, find the percentage for this factor
      areas.forEach(area => {
        const item = data.find(d => d.vho_area === area && d.type_of_factor === factor);
        percentagesByFactor[factor][area] = item ? item.priority_percentage * 100 : 0;
      });
    });
    
    // Sort areas by highest combined percentage
    const sortedAreas = [...areas].sort((a, b) => {
      const aTotal = factorTypes.reduce((sum, factor) => sum + (percentagesByFactor[factor][a] || 0), 0);
      const bTotal = factorTypes.reduce((sum, factor) => sum + (percentagesByFactor[factor][b] || 0), 0);
      return bTotal - aTotal;
    });
    
    return {
      chartData: {
        areas: sortedAreas,
        percentagesByFactor
      },
      factors: factorTypes
    };
  }, [data]);

  // Create series for each factor type
  const series = useMemo(() => {
    return factors.map(factor => {
      const factorLabel = factor === 'hygiene_factor' ? 'Hygiene Factors' : 'More Of Factors';
      const factorColor = factor === 'hygiene_factor' ? '#34502b' : '#5a8f41';
      
      return {
        name: factorLabel,
        type: 'bar' as const,
        data: chartData.areas.map(area => chartData.percentagesByFactor[factor][area] || 0),
        color: factorColor
      };
    });
  }, [chartData, factors]);

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 600
    },
    title: {
      text: 'Materiality Areas Priorities',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      categories: chartData.areas,
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      }
    },
    yAxis: {
      title: {
        text: 'Percentage',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        format: '{value}%',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b>: ${this.y.toFixed(1)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        }
      },
      series: {
        stacking: factors.length > 1 ? undefined : 'normal'
      }
    },
    series,
    credits: {
      enabled: false
    },
    legend: {
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    }
  };

  if (data.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No data available. Please select different criteria.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[600px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

export default VHOAreaBarChart;

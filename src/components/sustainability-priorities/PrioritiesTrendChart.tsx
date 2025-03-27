import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { MaterialityData } from '@/hooks/useGeneralMaterialityData';
import { FONT_FAMILY } from '@/utils/constants';

interface PrioritiesTrendChartProps {
  data: MaterialityData[];
  selectedAreas: string[];
}

const PrioritiesTrendChart: React.FC<PrioritiesTrendChartProps> = ({ data, selectedAreas }) => {
  const chartSeries = useMemo(() => {
    console.log("Generating trend chart series with data:", data.length, "records");
    
    const uniqueAreas = selectedAreas.length > 0 
      ? selectedAreas 
      : [...new Set(data.map(item => item.materiality_area))];
    
    console.log("Areas to display:", uniqueAreas);
    
    return uniqueAreas.map(area => {
      const areaData = data
        .filter(item => item.materiality_area === area)
        .sort((a, b) => a.year - b.year);
      
      console.log(`Area: ${area}, Data points: ${areaData.length}`);
      
      return {
        name: area,
        data: areaData.map(item => [item.year, item.percentage])
      };
    });
  }, [data, selectedAreas]);

  const yearRange = useMemo(() => {
    if (data.length === 0) return { min: 2020, max: 2025 };
    
    const years = data.map(item => item.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }, [data]);

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 500
    },
    title: {
      text: 'Sustainability Priorities Trends',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      title: {
        text: 'Year',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      min: yearRange.min,
      max: yearRange.max,
      allowDecimals: false,
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
      shared: true,
      formatter: function(this: any) {
        if (!this.points) return '';
        
        let tooltip = `<b>Year: ${this.x}</b><br/>`;
        this.points.forEach((point: any) => {
          tooltip += `${point.series.name}: ${point.y.toFixed(1)}%<br/>`;
        });
        return tooltip;
      }
    },
    plotOptions: {
      line: {
        marker: {
          symbol: 'circle',
          radius: 4
        }
      }
    },
    series: chartSeries.map((series, index) => ({
      name: series.name,
      type: 'line',
      data: series.data,
      color: getColorForIndex(index)
    })),
    credits: {
      enabled: false
    },
    legend: {
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      },
      itemWidth: 150,
      maxHeight: 120
    }
  };

  if (data.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No sustainability priorities data available. Please select a country.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[500px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

const getColorForIndex = (index: number): string => {
  const colors = [
    '#34502b', // Dark green
    '#5a8f41', // Medium green
    '#8fbc8f', // Sea green
    '#2e8b57', // Sea green 2
    '#3cb371', // Medium sea green
    '#6b8e23', // Olive drab
    '#556b2f', // Dark olive green
    '#008080', // Teal
    '#2f4f4f', // Dark slate gray
    '#006400'  // Dark green 2
  ];
  
  return colors[index % colors.length];
};

export default PrioritiesTrendChart;

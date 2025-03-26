
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { MaterialityData } from '@/hooks/useGeneralMaterialityData';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

interface ComparisonBarChartProps {
  allCountriesData: Record<string, MaterialityData[]>;
  selectedAreas: string[];
  selectedYear: number;
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ 
  allCountriesData, 
  selectedAreas,
  selectedYear
}) => {
  const chartData = useMemo(() => {
    if (!allCountriesData || Object.keys(allCountriesData).length === 0) {
      return {};
    }

    // Debug log to see what data we're working with
    console.log('Raw allCountriesData:', JSON.stringify(allCountriesData, null, 2));

    // Filter data for the selected year and areas
    const filteredData: Record<string, Record<string, number>> = {};
    
    Object.entries(allCountriesData).forEach(([country, data]) => {
      // Find data for the selected year
      const yearData = data.filter(item => item.year === selectedYear);
      
      console.log(`Country ${country} - yearData for ${selectedYear}:`, yearData);
      
      // Filter for selected areas or use all if none selected
      const areasData = selectedAreas.length > 0 
        ? yearData.filter(item => selectedAreas.includes(item.materiality_area))
        : yearData;
      
      console.log(`Country ${country} - filtered areasData:`, areasData);
      
      // Add data to filtered set
      if (areasData.length > 0) {
        filteredData[country] = {};
        areasData.forEach(area => {
          // Ensure percentage is multiplied by 100 for display
          // and that it's a valid number
          const percentage = typeof area.percentage === 'number' 
            ? area.percentage * 100 
            : parseFloat(area.percentage as any) * 100;
          
          filteredData[country][area.materiality_area] = percentage;
        });
      }
    });
    
    // Log the filtered data for debugging
    console.log('Filtered chart data:', filteredData);
    
    return filteredData;
  }, [allCountriesData, selectedAreas, selectedYear]);

  // Get all unique materiality areas across all countries
  const allAreas = useMemo(() => {
    const areas = new Set<string>();
    Object.values(chartData).forEach(country => {
      Object.keys(country).forEach(area => areas.add(area));
    });
    return Array.from(areas).sort();
  }, [chartData]);

  // Prepare series for Highcharts
  const series = useMemo(() => {
    return Object.entries(chartData).map(([country, data]) => ({
      type: 'bar' as const, // Add explicit type for TypeScript
      name: getFullCountryName(country),
      data: allAreas.map(area => data[area] || 0)
    }));
  }, [chartData, allAreas]);

  // Generate a color array
  const colors = ['#34502b', '#5c8f4a', '#84c066', '#aad68b', '#d1ebc1'];

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: Math.max(300, 50 * allAreas.length),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: `Sustainability Priorities Comparison (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      categories: allAreas,
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    yAxis: {
      title: {
        text: 'Percentage',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        format: '{value}%',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>${this.series.name}: ${this.y.toFixed(1)}%`;
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
        },
        groupPadding: 0.1
      }
    },
    legend: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      },
      maxHeight: 80
    },
    colors: colors,
    series: series,
    credits: {
      enabled: false
    }
  };

  if (Object.keys(chartData).length === 0 || series.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          {selectedAreas.length === 0 ? 
            "Please select at least one sustainability area to compare." : 
            "No data available for the selected countries and year. Please try different selections."}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Card>
  );
};

export default ComparisonBarChart;


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
      console.log('No country data available for chart');
      return {};
    }

    // Debug log to see what data we're working with
    console.log('Raw allCountriesData structure:', Object.keys(allCountriesData));
    console.log('Selected year:', selectedYear);
    console.log('Selected areas:', selectedAreas);

    // Filter data for the selected year and areas
    const filteredData: Record<string, Record<string, number>> = {};
    
    Object.entries(allCountriesData).forEach(([country, data]) => {
      // Find data for the selected year
      const yearData = data.filter(item => item.year === selectedYear);
      
      console.log(`Country ${country} - yearData count for ${selectedYear}:`, yearData.length);
      
      if (yearData.length === 0) {
        console.log(`No data for country ${country} in year ${selectedYear}`);
      } else {
        console.log(`Sample data for country ${country}:`, yearData[0]);
      }
      
      // Filter for selected areas or use all if none selected
      const areasData = selectedAreas.length > 0 
        ? yearData.filter(item => selectedAreas.includes(item.materiality_area))
        : yearData;
      
      console.log(`Country ${country} - filtered areasData count:`, areasData.length);
      
      // Add data to filtered set
      if (areasData.length > 0) {
        filteredData[country] = {};
        areasData.forEach(area => {
          // Ensure percentage is properly converted to a number and multiplied by 100 for display
          let percentage: number;
          
          if (typeof area.percentage === 'number') {
            percentage = area.percentage * 100;
          } else if (typeof area.percentage === 'string') {
            percentage = parseFloat(area.percentage) * 100;
          } else {
            console.warn(`Invalid percentage for ${area.materiality_area}:`, area.percentage);
            percentage = 0;
          }
          
          console.log(`Area ${area.materiality_area} - raw percentage:`, area.percentage, 
                     `type: ${typeof area.percentage}, converted:`, percentage);
          
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
    return Array.from(areas);
  }, [chartData]);

  // Calculate average value for each area across all countries
  const areaAverages = useMemo(() => {
    const averages: Record<string, number> = {};
    const areaCounts: Record<string, number> = {};
    
    // Calculate sum and count for each area
    Object.values(chartData).forEach(countryData => {
      Object.entries(countryData).forEach(([area, value]) => {
        if (!averages[area]) {
          averages[area] = 0;
          areaCounts[area] = 0;
        }
        averages[area] += value;
        areaCounts[area]++;
      });
    });
    
    // Calculate average for each area
    Object.keys(averages).forEach(area => {
      averages[area] = averages[area] / areaCounts[area];
    });
    
    console.log('Area averages:', averages);
    return averages;
  }, [chartData]);
  
  // Sort areas by average value (highest first)
  const sortedAreas = useMemo(() => {
    return [...allAreas].sort((a, b) => {
      return (areaAverages[b] || 0) - (areaAverages[a] || 0);
    });
  }, [allAreas, areaAverages]);

  // Prepare series for Highcharts
  const series = useMemo(() => {
    return Object.entries(chartData).map(([country, data]) => ({
      type: 'bar' as const,
      name: getFullCountryName(country),
      data: sortedAreas.map(area => data[area] || 0)
    }));
  }, [chartData, sortedAreas]);

  // Generate a color array
  const colors = ['#34502b', '#5c8f4a', '#84c066', '#aad68b', '#d1ebc1'];

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: Math.max(300, 50 * sortedAreas.length),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: `Sustainability Priorities Comparison (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      categories: sortedAreas,
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

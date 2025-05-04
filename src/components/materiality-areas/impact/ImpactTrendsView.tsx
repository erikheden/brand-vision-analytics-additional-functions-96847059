
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

interface ImpactTrendsViewProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  years: number[];
  impactLevels: string[];
  comparisonMode: boolean;
  activeCountries: string[];
  countryDataMap?: Record<string, any>;
}

const ImpactTrendsView: React.FC<ImpactTrendsViewProps> = ({
  processedData,
  selectedCategories,
  years,
  impactLevels,
  comparisonMode,
  activeCountries,
  countryDataMap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  
  // Set initial selected values when data is available
  useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    }
    
    if (impactLevels.length > 0 && !selectedLevel) {
      setSelectedLevel(impactLevels[0]);
    }
  }, [selectedCategories, impactLevels, selectedCategory, selectedLevel]);
  
  // Calculate series data with memoization to improve performance
  const seriesData = useMemo(() => {
    if (!selectedCategory || !selectedLevel || years.length === 0 || activeCountries.length === 0) {
      return [];
    }
    
    return activeCountries.map(country => {
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData || {};
      
      // Map years to data points for this country, category, and level
      const data = years.map(year => {
        // First try to get value from country-specific data
        let value = 0;
        if (countrySpecificData[selectedCategory]?.[year]?.[selectedLevel] !== undefined) {
          value = countrySpecificData[selectedCategory][year][selectedLevel];
        } 
        // Fall back to default processedData if specific data is not available
        else if (processedData[selectedCategory]?.[year]?.[selectedLevel] !== undefined) {
          value = processedData[selectedCategory][year][selectedLevel];
        }
        
        return [year, value * 100]; // Convert to percentage for display
      });
      
      return {
        name: getFullCountryName(country),
        data,
        type: 'line' as const
      };
    });
  }, [selectedCategory, selectedLevel, years, activeCountries, processedData, countryDataMap]);
  
  // Create chart options based on calculated series data
  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: 'line',
        backgroundColor: 'white',
        style: { fontFamily: FONT_FAMILY },
        height: 400
      },
      title: {
        text: `${selectedCategory} - ${selectedLevel} Impact Level Trend`,
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      xAxis: {
        title: {
          text: 'Year',
          style: { color: '#34502b', fontFamily: FONT_FAMILY }
        }
      },
      yAxis: {
        title: {
          text: 'Percentage',
          style: { color: '#34502b', fontFamily: FONT_FAMILY }
        },
        min: 0,
        max: 100,
        labels: { format: '{value}%' }
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x}: {point.y:.1f}%'
      },
      legend: {
        enabled: true
      },
      series: seriesData,
      credits: {
        enabled: false
      }
    } as Highcharts.Options;
  }, [selectedCategory, selectedLevel, seriesData]);
  
  // Display empty state if no data is available
  if (activeCountries.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least one country to view impact trends.
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Category and Level selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {selectedCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Impact Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {impactLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Chart display */}
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        {seriesData.length > 0 ? (
          <div className="h-[400px]">
            <HighchartsReact 
              highcharts={Highcharts} 
              options={chartOptions}
              immutable={true}
              updateArgs={[true, true, true]}
            />
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No trend data available for the selected category and impact level.
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImpactTrendsView;


import React from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';
import { createTooltipFormatter } from '../../sustainability-knowledge/charts/utils/tooltipUtils';
import CategorySelector from '../CategorySelector';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getFullCountryName } from '@/components/CountrySelect';

interface ImpactTrendsViewProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  years: number[];
  impactLevels: string[];
  comparisonMode?: boolean;
  activeCountries: string[]; // Changed from optional to required
}

const ImpactTrendsView: React.FC<ImpactTrendsViewProps> = ({
  processedData,
  selectedCategories,
  years,
  impactLevels,
  comparisonMode = false,
  activeCountries = []
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [activeCountryTab, setActiveCountryTab] = React.useState<string>('');
  
  // Set the first category as default when the component loads or categories change
  React.useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    } else if (selectedCategories.length > 0 && !selectedCategories.includes(selectedCategory)) {
      setSelectedCategory(selectedCategories[0]);
    }
  }, [selectedCategories, selectedCategory]);
  
  // Set the first country as default for the tabs
  React.useEffect(() => {
    if (comparisonMode && activeCountries.length > 0 && !activeCountryTab) {
      setActiveCountryTab(activeCountries[0]);
    } else if (comparisonMode && activeCountries.length > 0 && !activeCountries.includes(activeCountryTab)) {
      setActiveCountryTab(activeCountries[0]);
    }
  }, [comparisonMode, activeCountries, activeCountryTab]);
  
  if (selectedCategories.length === 0 || !selectedCategory) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select a category to view trends.
        </div>
      </Card>
    );
  }

  // Add debug logging to trace data flow issues
  console.log('ImpactTrendsView - activeCountries:', activeCountries);
  console.log('ImpactTrendsView - comparisonMode:', comparisonMode);
  console.log('ImpactTrendsView - selectedCategory:', selectedCategory);

  // Helper function to create chart options
  const createChartOptions = (country?: string): Highcharts.Options => {
    // Get the correct country data from the countryDataMap
    let countryData: Record<string, Record<string, Record<string, number>>> = processedData;
    
    console.log('Creating chart options for country:', country || 'default');
    
    const series = impactLevels.map((level, index) => {
      const data = years.map(year => {
        // Check if we have data for this category-year-level combination
        const value = countryData[selectedCategory]?.[year]?.[level] || 0;
        console.log(`Data point for ${country || 'default'}, ${selectedCategory}, ${year}, ${level}: ${value}`);
        return [year, value * 100]; // Convert to percentage
      });
  
      const colorIntensity = 0.9 - (index * 0.2);
      return {
        name: level,
        data: data,
        type: 'line' as const,
        color: `rgba(52, 80, 43, ${Math.max(0.3, colorIntensity)})`,
      };
    });
  
    return {
      chart: {
        type: 'line',
        backgroundColor: 'white',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: `Impact Level Trends - ${selectedCategory}${country ? ` in ${getFullCountryName(country)}` : ''}`,
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
        categories: years.map(String)
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
          format: '{value}%'
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: createTooltipFormatter
      },
      series: series,
      legend: {
        enabled: true,
        itemStyle: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      credits: {
        enabled: false
      }
    };
  };

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="mb-6">
        <CategorySelector 
          categories={selectedCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {comparisonMode && activeCountries.length > 0 ? (
        // Country comparison tabs
        <Tabs value={activeCountryTab} onValueChange={setActiveCountryTab}>
          <TabsList className="mb-4 bg-[#34502b]/10">
            {activeCountries.map(country => (
              <TabsTrigger 
                key={country} 
                value={country} 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                {getFullCountryName(country)}
              </TabsTrigger>
            ))}
          </TabsList>

          {activeCountries.map(country => (
            <TabsContent key={country} value={country} className="pt-4">
              <HighchartsReact highcharts={Highcharts} options={createChartOptions(country)} />
              
              <div className="mt-4 p-3 bg-[#f1f0fb] rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Trend Analysis:</strong> The chart shows how different impact levels for {selectedCategory} have evolved over time in {getFullCountryName(country)}.
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // Single view (original implementation)
        <HighchartsReact highcharts={Highcharts} options={createChartOptions()} />
      )}
    </Card>
  );
};

export default ImpactTrendsView;

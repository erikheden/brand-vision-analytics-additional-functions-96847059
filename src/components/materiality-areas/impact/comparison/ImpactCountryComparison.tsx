
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useProcessedChartData } from '@/hooks/impact-comparison/useProcessedChartData';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImpactCountryComparisonProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  years: number[];
  impactLevels: string[];
  activeCountries: string[];
  countryDataMap?: Record<string, any>;
}

const ImpactCountryComparison: React.FC<ImpactCountryComparisonProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  years,
  impactLevels,
  activeCountries,
  countryDataMap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedImpactLevel, setSelectedImpactLevel] = useState<string>('');
  const [viewMode, setViewMode] = useState<'byCategory' | 'byImpactLevel'>('byCategory');
  
  // Set initial selected values when data is loaded
  useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    }
    
    if (impactLevels.length > 0 && !selectedImpactLevel) {
      setSelectedImpactLevel(impactLevels[0]);
    }
  }, [selectedCategories, impactLevels, selectedCategory, selectedImpactLevel]);
  
  // Get processed chart data from the hook
  const { seriesData, impactLevelData } = useProcessedChartData(
    processedData,
    selectedCategory,
    selectedImpactLevel,
    selectedYear,
    selectedCategories,
    impactLevels,
    activeCountries,
    countryDataMap
  );
  
  // Create chart options based on the data from the hook
  const categoryChartOptions = React.useMemo(() => {
    if (seriesData.length === 0) return { chart: { type: 'column' }, series: [] };
    
    return {
      chart: {
        type: 'column',
        backgroundColor: 'white',
        style: { fontFamily: 'Inter, sans-serif' }
      },
      title: {
        text: `${selectedImpactLevel} Impact Level Across Categories (${selectedYear})`,
        style: { color: '#34502b', fontFamily: 'Inter, sans-serif' }
      },
      subtitle: {
        text: `Comparing ${activeCountries.length} countries`,
        style: { color: '#666', fontFamily: 'Inter, sans-serif' }
      },
      xAxis: {
        categories: selectedCategories,
        title: { text: 'Categories' },
        labels: {
          rotation: -45,
          style: { fontSize: '11px', fontFamily: 'Inter, sans-serif' }
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percentage (%)',
          style: { color: '#34502b', fontFamily: 'Inter, sans-serif' }
        },
        labels: { format: '{value}%' }
      },
      legend: {
        enabled: true,
        itemStyle: { fontFamily: 'Inter, sans-serif' }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y:.1f}%',
        shared: true
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
  }, [seriesData, selectedImpactLevel, selectedCategories, activeCountries, selectedYear]);
  
  const impactLevelChartOptions = React.useMemo(() => {
    if (impactLevelData.length === 0) return { chart: { type: 'column' }, series: [] };
    
    return {
      chart: {
        type: 'column',
        backgroundColor: 'white',
        style: { fontFamily: 'Inter, sans-serif' }
      },
      title: {
        text: `${selectedCategory} - Impact Levels Comparison (${selectedYear})`,
        style: { color: '#34502b', fontFamily: 'Inter, sans-serif' }
      },
      subtitle: {
        text: `Comparing ${activeCountries.length} countries`,
        style: { color: '#666', fontFamily: 'Inter, sans-serif' }
      },
      xAxis: {
        categories: impactLevels,
        title: { text: 'Impact Levels' }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percentage (%)',
          style: { color: '#34502b', fontFamily: 'Inter, sans-serif' }
        },
        labels: { format: '{value}%' }
      },
      legend: {
        enabled: true,
        itemStyle: { fontFamily: 'Inter, sans-serif' }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y:.1f}%',
        shared: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: impactLevelData,
      credits: { enabled: false }
    };
  }, [impactLevelData, selectedCategory, impactLevels, activeCountries, selectedYear]);
  
  // Display appropriate message if requirements aren't met
  if (activeCountries.length <= 1) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least two countries to compare impact data.
        </div>
      </Card>
    );
  }
  
  if (selectedCategories.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least one category to view comparison data.
        </div>
      </Card>
    );
  }
  
  if (!selectedYear) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select a year to view comparison data.
        </div>
      </Card>
    );
  }
  
  // Determine which chart options to use based on view mode
  const chartOptions = viewMode === 'byCategory' ? categoryChartOptions : impactLevelChartOptions;
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-medium text-[#34502b]">
            Country Comparison Analysis
          </h2>
          
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'byCategory' | 'byImpactLevel')} className="w-auto">
            <TabsList className="bg-[#34502b]/10">
              <TabsTrigger value="byCategory" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                By Category
              </TabsTrigger>
              <TabsTrigger value="byImpactLevel" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                By Impact Level
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-col md:flex-row items-start gap-6">
          {viewMode === 'byCategory' ? (
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Impact Level</label>
              <select
                value={selectedImpactLevel}
                onChange={(e) => setSelectedImpactLevel(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {impactLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
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
          )}
        </div>
        
        <div className="h-[500px]">
          <HighchartsReact 
            highcharts={Highcharts} 
            options={chartOptions}
            immutable={true}
            updateArgs={[true, true, true]}
          />
        </div>
        
        <div className="bg-[#f1f0fb] p-4 rounded-lg">
          <h3 className="font-medium text-[#34502b] mb-2">Insights</h3>
          <p className="text-sm text-gray-600">
            {viewMode === 'byCategory' 
              ? `Compare how consumers in different markets perceive ${selectedImpactLevel} impact for various sustainability categories.`
              : `Compare different levels of impact for ${selectedCategory} across your selected markets.`}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ImpactCountryComparison;

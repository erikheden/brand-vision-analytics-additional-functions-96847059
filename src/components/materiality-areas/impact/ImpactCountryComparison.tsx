
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFullCountryName } from '@/components/CountrySelect';

interface ImpactCountryComparisonProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  years: number[];
  impactLevels: string[];
  activeCountries: string[];
}

const ImpactCountryComparison: React.FC<ImpactCountryComparisonProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  years,
  impactLevels,
  activeCountries
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedImpactLevel, setSelectedImpactLevel] = useState<string>('');
  const [viewMode, setViewMode] = useState<'byCategory' | 'byImpactLevel'>('byCategory');
  
  // Set defaults when component loads or dependencies change
  useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    }
    
    if (impactLevels.length > 0 && !selectedImpactLevel) {
      setSelectedImpactLevel(impactLevels[0]);
    }
  }, [selectedCategories, impactLevels, selectedCategory, selectedImpactLevel]);
  
  // Create chart options for category comparison
  const createCategoryChart = () => {
    if (!selectedYear || !selectedImpactLevel) return {};
    
    const categories = selectedCategories;
    const series = activeCountries.map(country => {
      // Map each category to its value
      const data = categories.map(category => {
        const value = processedData[category]?.[selectedYear]?.[selectedImpactLevel] || 0;
        return value * 100; // Convert to percentage
      });
      
      return {
        name: getFullCountryName(country),
        data,
        type: 'column'
      };
    });
    
    return {
      chart: {
        type: 'column',
        height: 400
      },
      title: {
        text: `${selectedImpactLevel} Impact Level by Category (${selectedYear})`
      },
      subtitle: {
        text: 'Comparison across countries'
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Category'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percentage'
        },
        labels: {
          format: '{value}%'
        }
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.series.name}</b><br/>${this.x}: ${this.y.toFixed(1)}%`;
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: series
    };
  };
  
  // Create chart options for impact level comparison
  const createImpactLevelChart = () => {
    if (!selectedYear || !selectedCategory) return {};
    
    const series = activeCountries.map(country => {
      // Map each impact level to its value
      const data = impactLevels.map(level => {
        const value = processedData[selectedCategory]?.[selectedYear]?.[level] || 0;
        return value * 100; // Convert to percentage
      });
      
      return {
        name: getFullCountryName(country),
        data,
        type: 'column'
      };
    });
    
    return {
      chart: {
        type: 'column',
        height: 400
      },
      title: {
        text: `${selectedCategory} by Impact Level (${selectedYear})`
      },
      subtitle: {
        text: 'Comparison across countries'
      },
      xAxis: {
        categories: impactLevels,
        title: {
          text: 'Impact Level'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percentage'
        },
        labels: {
          format: '{value}%'
        }
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.series.name}</b><br/>${this.x}: ${this.y.toFixed(1)}%`;
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: series
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as 'byCategory' | 'byImpactLevel')} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="byCategory">By Category</TabsTrigger>
            <TabsTrigger value="byImpactLevel">By Impact Level</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row gap-4">
          {viewMode === 'byCategory' ? (
            <div className="w-full md:w-64">
              <Select 
                value={selectedImpactLevel} 
                onValueChange={setSelectedImpactLevel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Impact Level" />
                </SelectTrigger>
                <SelectContent>
                  {impactLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="w-full md:w-64">
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full h-[400px]">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={viewMode === 'byCategory' ? createCategoryChart() : createImpactLevelChart()} 
        />
      </div>
    </div>
  );
};

export default ImpactCountryComparison;

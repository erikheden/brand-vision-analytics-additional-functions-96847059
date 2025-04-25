
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';
import { createTooltipFormatter } from '../../sustainability-knowledge/charts/utils/tooltipUtils';
import CategorySelector from '../CategorySelector';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getFullCountryName } from '@/components/CountrySelect';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  React.useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    }
    
    if (impactLevels.length > 0 && !selectedImpactLevel) {
      setSelectedImpactLevel(impactLevels[0]);
    }
  }, [selectedCategories, impactLevels, selectedCategory, selectedImpactLevel]);
  
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
  
  // Generate chart by category for a specific impact level
  const createCategoryChart = () => {
    if (!selectedImpactLevel) return { chart: { type: 'bar' }, series: [] };
    
    const seriesData = activeCountries.map(country => {
      return {
        name: getFullCountryName(country),
        data: selectedCategories.map(category => {
          const value = processedData[category]?.[selectedYear]?.[selectedImpactLevel] || 0;
          return value * 100; // Convert to percentage
        }),
        type: 'column' as const
      };
    });
    
    return {
      chart: {
        type: 'column',
        backgroundColor: 'white',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: `Country Comparison - ${selectedImpactLevel} Impact Level (${selectedYear})`,
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      subtitle: {
        text: 'Comparison across categories',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        categories: selectedCategories,
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
      credits: {
        enabled: false
      }
    };
  };
  
  // Generate chart by impact level for a specific category
  const createImpactLevelChart = () => {
    if (!selectedCategory) return { chart: { type: 'bar' }, series: [] };
    
    const seriesData = activeCountries.map(country => {
      return {
        name: getFullCountryName(country),
        data: impactLevels.map(level => {
          const value = processedData[selectedCategory]?.[selectedYear]?.[level] || 0;
          return value * 100; // Convert to percentage
        }),
        type: 'column' as const
      };
    });
    
    return {
      chart: {
        type: 'column',
        backgroundColor: 'white',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: `Country Comparison - ${selectedCategory} (${selectedYear})`,
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      subtitle: {
        text: 'Comparison across impact levels',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        categories: impactLevels,
        title: {
          text: 'Impact Level',
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        }
      },
      yAxis: {
        min: 0,
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
      credits: {
        enabled: false
      }
    };
  };
  
  const chartOptions = viewMode === 'byCategory' ? createCategoryChart() : createImpactLevelChart();
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-medium text-[#34502b]">
            Country Comparison {selectedYear ? `(${selectedYear})` : ''}
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
        
        <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
          {viewMode === 'byCategory' ? (
            <div className="w-full md:w-1/3">
              <Label>Select Impact Level</Label>
              <Select value={selectedImpactLevel} onValueChange={setSelectedImpactLevel}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Choose an impact level" />
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
            <div className="w-full md:w-1/3">
              <CategorySelector 
                categories={selectedCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          )}
        </div>
        
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        
        <div className="p-3 bg-[#f1f0fb] rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Comparison Analysis:</strong> This chart shows how 
            {viewMode === 'byCategory' 
              ? ` different countries compare on the "${selectedImpactLevel}" impact level across various categories.`
              : ` different countries compare across impact levels for the "${selectedCategory}" category.`}
            {" "}You can see variations in sustainability impact between countries, highlighting different regional priorities and progress.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ImpactCountryComparison;

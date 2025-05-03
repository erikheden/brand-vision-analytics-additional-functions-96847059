
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import { getFullCountryName } from '@/components/CountrySelect';
import { FONT_FAMILY } from '@/utils/constants';

interface DiscussionTrendsChartProps {
  data: DiscussionTopicData[];
  selectedCountries: string[];
  selectedTopics: string[];
}

const DiscussionTrendsChart: React.FC<DiscussionTrendsChartProps> = ({
  data,
  selectedCountries,
  selectedTopics
}) => {
  const chartOptions = useMemo(() => {
    // If no topics are selected, show data for all topics
    const topicsToUse = selectedTopics.length > 0 ? selectedTopics : [...new Set(data.map(item => item.discussion_topic))];
    
    // Group data by year
    const yearGroups = data.reduce((acc, item) => {
      const year = item.year;
      if (!acc[year]) {
        acc[year] = {};
      }
      
      // Skip if this topic is not one we're interested in
      if (!topicsToUse.includes(item.discussion_topic)) {
        return acc;
      }
      
      // Create a unique key for country-topic combination
      const key = `${item.country}-${item.discussion_topic}`;
      
      if (!acc[year][key]) {
        acc[year][key] = {
          count: 0,
          total: 0
        };
      }
      
      acc[year][key].count++;
      acc[year][key].total += item.percentage;
      
      return acc;
    }, {} as Record<number, Record<string, { count: number; total: number }>>);

    // Convert the grouped data into chart format
    const chartData = Object.entries(yearGroups)
      .map(([year, values]) => {
        const point: Record<string, any> = {
          year: parseInt(year)
        };
        
        // Calculate average for each country-topic combination
        Object.entries(values).forEach(([key, data]) => {
          point[key] = (data.total / data.count) * 100; // Convert to percentage
        });
        
        return point;
      })
      .sort((a, b) => a.year - b.year);
    
    // Color palette
    const COLORS = [
      '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89',
      '#257179', '#328a94', '#3fa3ae', '#4dbcc9', '#66c7d2',
      '#7153a2', '#8c69be', '#a784d9', '#c29ff4', '#d4b8f5'
    ];
    
    // Create series for each country-topic combination
    const series: Highcharts.SeriesOptionsType[] = [];
    let colorIndex = 0;
    
    selectedCountries.forEach(country => {
      topicsToUse.forEach(topic => {
        // Check if there's actually data for this combination
        const hasData = chartData.some(point => 
          point[`${country}-${topic}`] !== undefined
        );
        
        if (hasData) {
          series.push({
            name: `${getFullCountryName(country)} - ${topic}`,
            type: 'line',
            color: COLORS[colorIndex % COLORS.length],
            data: chartData.map(point => {
              const value = point[`${country}-${topic}`];
              return value !== undefined ? [point.year, value] : null;
            }).filter(Boolean)
          });
          colorIndex++;
        }
      });
    });
    
    // Return chart options
    return {
      chart: {
        type: 'line',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: 'Discussion Topics Trends',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        title: {
          text: 'Year'
        }
      },
      yAxis: {
        title: {
          text: 'Percentage (%)'
        },
        min: 0,
        max: 100,
        labels: {
          format: '{value}%'
        }
      },
      tooltip: {
        formatter: function() {
          const point = this.point;
          const series = this.series;
          return `<b>${series.name}</b><br>Year: ${point.x}<br>Percentage: ${point.y.toFixed(1)}%`;
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        maxHeight: 200,
        scrollable: true
      },
      plotOptions: {
        line: {
          marker: {
            enabled: true
          }
        }
      },
      series: series,
      credits: {
        enabled: false
      }
    };
  }, [data, selectedCountries, selectedTopics]);

  if (!chartOptions.series || (chartOptions.series as any[]).length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No trend data available for the selected criteria.
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full h-[500px]">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
      />
    </div>
  );
};

export default DiscussionTrendsChart;

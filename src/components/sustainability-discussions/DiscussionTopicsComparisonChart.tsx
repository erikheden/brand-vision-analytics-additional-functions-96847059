
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import { FONT_FAMILY } from '@/utils/constants';

interface DiscussionTopicsComparisonChartProps {
  selectedCountries: string[];
  selectedTopics: string[];
  discussionData: DiscussionTopicData[];
}

const DiscussionTopicsComparisonChart: React.FC<DiscussionTopicsComparisonChartProps> = ({
  selectedCountries,
  selectedTopics,
  discussionData
}) => {
  // Colors for the bars
  const COLORS = ['#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89', '#257179', '#328a94'];
  
  // Create chart options
  const chartOptions = useMemo(() => {
    if (!selectedTopics.length) return {};
    
    // Process the data for the chart
    const chartData = selectedTopics.map(topic => {
      const topicData: Record<string, any> = { topic };
      
      selectedCountries.forEach((country, index) => {
        const countryData = discussionData.find(item => 
          item.discussion_topic === topic && item.country.toUpperCase() === country.toUpperCase()
        );
        
        // Convert from decimal (0-1) to percentage (0-100) if needed
        const percentage = countryData 
          ? Math.round(countryData.percentage * 100) 
          : 0;
        
        topicData[country] = percentage;
      });
      
      return topicData;
    });
    
    // Create series for each country
    const series = selectedCountries.map((country, index) => ({
      name: country,
      data: chartData.map(item => item[country]),
      color: COLORS[index % COLORS.length]
    }));

    return {
      chart: {
        type: 'column',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: 'Discussion Topics Comparison',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        categories: chartData.map(item => item.topic),
        title: {
          text: null
        },
        labels: {
          rotation: -45,
          style: {
            fontSize: '12px',
            fontFamily: FONT_FAMILY
          }
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percentage (%)',
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
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
        formatter: function() {
          return `<b>${this.x}</b><br>${this.series.name}: ${this.y}%`;
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: series,
      credits: {
        enabled: false
      }
    };
  }, [selectedTopics, selectedCountries, discussionData, COLORS]);

  if (selectedTopics.length === 0) {
    return (
      <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Please select at least one topic to compare across countries.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-medium mb-4">Discussion Topics Comparison</h3>
      
      <div className="w-full h-[450px]">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions} 
        />
      </div>
    </Card>
  );
};

export default DiscussionTopicsComparisonChart;

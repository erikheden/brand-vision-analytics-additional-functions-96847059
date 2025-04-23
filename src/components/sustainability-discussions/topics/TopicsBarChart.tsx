
import React from 'react';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';

interface TopicsBarChartProps {
  discussionData: DiscussionTopicData[];
  selectedCountries: string[];
  selectedYear: number;
  topics: string[];
}

const TopicsBarChart: React.FC<TopicsBarChartProps> = ({
  discussionData,
  selectedCountries,
  selectedYear,
  topics
}) => {
  if (!topics || topics.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">No discussion topics available</p>
      </div>
    );
  }

  // Process data for chart with sorting
  const chartData = topics.map(topic => {
    const data: Record<string, number> = {};
    
    selectedCountries.forEach(country => {
      const topicData = discussionData.find(
        item => item.discussion_topic === topic && 
               item.country === country && 
               item.year === selectedYear
      );
      
      data[country] = topicData 
        ? Math.round(topicData.percentage * 100)
        : 0;
    });
    
    return {
      name: topic,
      data: Object.values(data)
    };
  }).sort((a, b) => {
    // Sort by the average percentage across all countries
    const avgA = a.data.reduce((sum, val) => sum + val, 0) / a.data.length;
    const avgB = b.data.reduce((sum, val) => sum + val, 0) / b.data.length;
    return avgB - avgA; // Descending order
  });

  // Adjust chart height dynamically based on number of topics
  const chartHeight = Math.max(400, 60 + 40 * topics.length);

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: chartHeight,
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: `Discussion Topics Comparison (${selectedYear})`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      categories: chartData.map(item => item.name),
      title: {
        text: 'Discussion Topics',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        },
        rotation: -45,
        align: 'right'
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
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false
        },
        pointPadding: 0.2,
        borderWidth: 0,
        groupPadding: 0.1
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.series.name}</b><br/>${this.x}: ${this.y}%`;
      }
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    series: selectedCountries.map((country, index) => ({
      name: country,
      type: 'column' as const,
      data: chartData.map(item => item.data[index]),
      color: [
        '#34502b',
        '#4d7342',
        '#668c5a',
        '#7fa571',
        '#98be89',
        '#257179'
      ][index % 6]
    })),
    credits: {
      enabled: false
    }
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default TopicsBarChart;

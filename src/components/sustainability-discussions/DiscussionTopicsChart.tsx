
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card } from "@/components/ui/card";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { FONT_FAMILY } from "@/utils/constants";
import { formatPercentage } from "@/utils/formatting";

interface DiscussionTopicsChartProps {
  data: DiscussionTopicData[];
  selectedYear: number;
  selectedCountry: string;
}

const DiscussionTopicsChart: React.FC<DiscussionTopicsChartProps> = ({ 
  data, 
  selectedYear,
  selectedCountry 
}) => {
  const processedData = useMemo(() => {
    if (!data || !data.length) return [];
    
    // Filter data for the selected year
    const yearData = data.filter(item => item.year === selectedYear);
    
    // Sort by percentage in descending order
    return yearData.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  }, [data, selectedYear]);
  
  // Extract topics and percentages for the chart
  const topics = processedData.map(item => item.discussion_topic || "Unknown");
  const percentages = processedData.map(item => item.percentage || 0);
  
  // Chart options - horizontal bar chart with topics on y-axis
  const options: Highcharts.Options = {
    chart: {
      type: 'bar',  // Horizontal bars
      height: Math.max(300, 50 * Math.min(topics.length, 15)),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: `Sustainability Discussion Topics (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      title: {
        text: 'Percentage',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        format: '{value}%',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    yAxis: {
      categories: topics,
      title: {
        text: 'Discussion Topics',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.y}</b><br/>${formatPercentage(this.x, false)}`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{point.x:.1f}%',
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        groupPadding: 0.1,
        pointPadding: 0.1,
        borderWidth: 0,
        colorByPoint: true,
        colors: percentages.map((_, index) => {
          // Create a gradient from dark green to light green
          const shade = 80 - (index * (60 / Math.max(percentages.length, 1)));
          return `rgba(52, 80, 43, ${shade / 100})`;
        })
      }
    },
    series: [{
      name: 'Percentage',
      type: 'bar',
      data: percentages.map(value => value * 100), // Convert decimal to percentage
      color: '#5c8f4a'
    }],
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    }
  };
  
  if (!processedData || processedData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No discussion topics data available for {selectedCountry} in {selectedYear}
      </div>
    );
  }
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Card>
  );
};

export default DiscussionTopicsChart;

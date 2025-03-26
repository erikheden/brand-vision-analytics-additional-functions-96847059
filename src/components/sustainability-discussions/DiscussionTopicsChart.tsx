
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { FONT_FAMILY } from "@/utils/constants";

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
    if (!data.length) return [];
    
    // Filter data for the selected year
    const yearData = data.filter(item => item.year === selectedYear);
    
    // Sort by percentage in descending order
    return yearData.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  }, [data, selectedYear]);
  
  // Extract topics and percentages for the chart
  const topics = processedData.map(item => item.discussion_topic || "Unknown");
  const percentages = processedData.map(item => item.percentage || 0);
  
  // Chart options
  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: Math.max(300, 50 * topics.length),
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
        return `<b>${this.series.yAxis.categories[this.y]}</b><br/>${this.x.toFixed(1)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{x:.1f}%',
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        groupPadding: 0.1,
        pointPadding: 0.1,
        borderWidth: 0
      }
    },
    series: [{
      name: 'Percentage',
      type: 'bar',
      data: percentages.map((value, index) => ({
        y: index,
        x: value
      })),
      color: '#5c8f4a'
    }],
    credits: {
      enabled: false
    }
  };
  
  if (processedData.length === 0) {
    return (
      <div className="text-center py-12">
        No discussion topics data available for {selectedCountry} in {selectedYear}
      </div>
    );
  }
  
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DiscussionTopicsChart;

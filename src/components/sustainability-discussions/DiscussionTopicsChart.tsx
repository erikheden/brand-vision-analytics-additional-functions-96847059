
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card } from "@/components/ui/card";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { FONT_FAMILY } from "@/utils/constants";
import { getFullCountryName } from "@/components/CountrySelect";

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
  // Use memo to prevent unnecessary recalculations
  const processedData = useMemo(() => {
    if (!data || !data.length) return [];
    
    // Filter data for the selected year
    const yearData = data.filter(item => item.year === selectedYear);
    
    // Sort by percentage in descending order
    return yearData.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  }, [data, selectedYear]);
  
  // Extract topics and percentages for the chart - also memoized
  const { topics, percentages } = useMemo(() => {
    const topics = processedData.map(item => item.discussion_topic || "Unknown");
    const percentages = processedData.map(item => {
      // Convert decimal to percentage and parse as number
      return Number(((item.percentage || 0) * 100).toFixed(1));
    });
    
    return { topics, percentages };
  }, [processedData]);
  
  // Chart options - memoized to prevent unnecessary re-renders
  const options: Highcharts.Options = useMemo(() => ({
    chart: {
      type: 'bar',  // Horizontal bars
      height: Math.max(300, 50 * Math.min(topics.length, 15)),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY },
      animation: {
        duration: 500
      }
    },
    title: {
      text: `Sustainability Discussion Topics in ${getFullCountryName(selectedCountry) || selectedCountry} (${selectedYear})`,
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
        style: { color: '#34502b', fontFamily: FONT_FAMILY },
        align: 'right',
        reserveSpace: true
      }
    },
    tooltip: {
      formatter: function() {
        // Use pointIndex instead of this.point.index
        const pointIndex = this.series.data.indexOf(this.point);
        const topicName = this.series.yAxis.categories[pointIndex] || 'Unknown';
        const percentage = this.y || 0;
        
        return `<b>${topicName}</b><br/>${percentage.toFixed(1)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
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
      },
      series: {
        animation: {
          duration: 500
        }
      }
    },
    series: [{
      name: 'Percentage',
      type: 'bar',
      data: percentages,
      color: '#5c8f4a'
    }],
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    accessibility: {
      enabled: false // Disable accessibility to remove the warning
    }
  }), [topics, percentages, selectedCountry, selectedYear]);
  
  if (!processedData || processedData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12 text-gray-500">
          No discussion topics data available for {selectedCountry} in {selectedYear}
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options}
        // Add key to ensure complete re-render when country or year changes
        key={`${selectedCountry}-${selectedYear}`}
        // Prevent unnecessary updates
        immutable={true}
      />
    </Card>
  );
};

export default React.memo(DiscussionTopicsChart);

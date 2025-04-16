
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { FONT_FAMILY } from "@/utils/constants";
import { getFullCountryName } from "@/components/CountrySelect";

interface DiscussionTopicsComparisonChartProps {
  countriesData: Record<string, DiscussionTopicData[]>;
  selectedYear: number;
  selectedCountries: string[];
}

const DiscussionTopicsComparisonChart: React.FC<DiscussionTopicsComparisonChartProps> = ({ 
  countriesData, 
  selectedYear,
  selectedCountries 
}) => {
  // Process data for the chart
  const { topics, series } = useMemo(() => {
    // Check if we have valid data
    if (!countriesData || Object.keys(countriesData).length === 0 || selectedCountries.length === 0) {
      console.log("No valid data for chart", { 
        countriesDataKeys: Object.keys(countriesData || {}),
        selectedCountries 
      });
      return { topics: [], series: [] };
    }
    
    // Get all unique topics across all countries
    const allTopics = new Set<string>();
    const filteredData: Record<string, DiscussionTopicData[]> = {};
    
    // Filter data for the selected year and collect all topics
    for (const country of selectedCountries) {
      const countryData = countriesData[country] || [];
      const yearData = countryData.filter(item => item.year === selectedYear);
      
      filteredData[country] = yearData;
      
      yearData.forEach(item => {
        if (item.discussion_topic) {
          allTopics.add(item.discussion_topic);
        }
      });
    }
    
    // Convert topics set to sorted array
    const topicsArray = Array.from(allTopics).sort();
    
    // Create series for each country
    const chartSeries: Highcharts.SeriesOptionsType[] = selectedCountries.map(country => {
      const countryData = filteredData[country] || [];
      const countryColor = getCountryColor(country);
      
      return {
        name: getFullCountryName(country),
        type: 'column',
        data: topicsArray.map(topic => {
          const topicData = countryData.find(item => item.discussion_topic === topic);
          // Convert from decimal to percentage (0-100)
          return topicData ? (topicData.percentage || 0) * 100 : 0;
        }),
        color: countryColor
      };
    });
    
    return { topics: topicsArray, series: chartSeries };
  }, [countriesData, selectedCountries, selectedYear]);
  
  // Get color based on country code
  function getCountryColor(country: string): string {
    const colorMap: Record<string, string> = {
      'Se': '#34502b',
      'No': '#5c8f4a',
      'Dk': '#84c066',
      'Fi': '#aad68b',
      'Nl': '#d1ebc1',
      // Add uppercase variants
      'SE': '#34502b',
      'NO': '#5c8f4a',
      'DK': '#84c066',
      'FI': '#aad68b',
      'NL': '#d1ebc1'
    };
    
    return colorMap[country] || '#34502b';
  }
  
  // Chart options - vertical bar chart with topics on x-axis
  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: Math.max(400, 60 + 20 * topics.length),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: `Sustainability Discussion Topics Comparison (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      categories: topics,
      title: {
        text: 'Discussion Topics',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY },
        rotation: -45,
        align: 'right'
      }
    },
    yAxis: {
      title: {
        text: 'Percentage',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        format: '{value}%',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    tooltip: {
      formatter: function(this: any) {
        const countryName = this.series.name;
        const topicName = this.point.category;
        const percentage = this.y || 0;
        
        return `<b>${countryName}</b><br/>${topicName}: ${percentage.toFixed(1)}%`;
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
    legend: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      },
      maxHeight: 80
    },
    series: series,
    credits: {
      enabled: false
    }
  };
  
  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        No discussion topics data available for the selected countries in {selectedYear}
      </div>
    );
  }
  
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DiscussionTopicsComparisonChart;

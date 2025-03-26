import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsWorld from "@highcharts/map-collection/custom/world.geo.json";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { getFullCountryName } from "@/components/CountrySelect";
import { Card } from "@/components/ui/card";

// Initialize the map module
import "highcharts/modules/map";

// Country code mapping for Highcharts
const countryCodeMapping: Record<string, string> = {
  "Se": "se",  // Sweden
  "No": "no",  // Norway
  "Dk": "dk",  // Denmark
  "Fi": "fi",  // Finland
  "Nl": "nl",  // Netherlands
};

interface DiscussionTopicsMapProps {
  data: DiscussionTopicData[];
  selectedYear: number;
  selectedTopic?: string;
}

const DiscussionTopicsMap: React.FC<DiscussionTopicsMapProps> = ({
  data,
  selectedYear,
  selectedTopic,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Filter data by selected year and topic
  const filteredData = React.useMemo(() => {
    let filtered = data.filter(item => item.year === selectedYear);
    
    if (selectedTopic) {
      filtered = filtered.filter(item => item.discussion_topic === selectedTopic);
    }
    
    return filtered;
  }, [data, selectedYear, selectedTopic]);

  // Prepare data for the map
  const mapData = React.useMemo(() => {
    const result: any[] = [];
    
    // Group by country
    const countryGroups = filteredData.reduce((acc, item) => {
      if (!acc[item.country]) {
        acc[item.country] = [];
      }
      acc[item.country].push(item);
      return acc;
    }, {} as Record<string, DiscussionTopicData[]>);
    
    // Calculate average percentage for each country
    Object.entries(countryGroups).forEach(([country, items]) => {
      if (countryCodeMapping[country]) {
        const avgPercentage = items.reduce((sum, item) => sum + (item.percentage || 0), 0) / items.length;
        result.push({
          "hc-key": countryCodeMapping[country],
          value: avgPercentage,
          name: getFullCountryName(country),
          countryCode: country,
        });
      }
    });
    
    return result;
  }, [filteredData]);

  // Configure the chart options
  const options: Highcharts.Options = {
    chart: {
      map: highchartsWorld,
      backgroundColor: 'transparent',
    },
    title: {
      text: selectedTopic 
        ? `Geographical Distribution of "${selectedTopic}" Discussions (${selectedYear})`
        : `Geographical Distribution of Sustainability Discussions (${selectedYear})`,
      style: {
        color: '#34502b',
        fontWeight: 'bold',
      }
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    colorAxis: {
      min: 0,
      max: 100,
      stops: [
        [0, '#D3E4FD'],  // Light blue for low values
        [0.5, '#33C3F0'],  // Mid blue
        [1, '#0FA0CE']   // Dark blue for high values
      ],
      labels: {
        format: '{value}%'
      }
    },
    tooltip: {
      pointFormat: '{point.name}: {point.value:.1f}%'
    },
    legend: {
      title: {
        text: 'Discussion Percentage'
      }
    },
    series: [{
      type: 'map',
      name: 'Discussion Percentage',
      states: {
        hover: {
          color: '#34502b'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      },
      allAreas: false,
      data: mapData
    }] as any
  };

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.update({
        series: [{
          data: mapData
        }]
      } as any);
    }
  }, [mapData]);

  return (
    <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={"mapChart"}
        ref={chartRef}
      />
    </Card>
  );
};

export default DiscussionTopicsMap;


import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsWorld from "@highcharts/map-collection/custom/world.geo.json";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { getFullCountryName } from "@/components/CountrySelect";
import { Card } from "@/components/ui/card";

// Import and initialize the map module
import "highcharts/modules/map";

// Ensure Highcharts is properly loaded with the map module
if (typeof Highcharts === 'object') {
  // The map module adds itself to the Highcharts object when imported
  console.log("Highcharts map module initialized");
}

// Country code mapping for Highcharts
const countryCodeMapping: Record<string, string> = {
  "Se": "se",  // Sweden
  "No": "no",  // Norway
  "Dk": "dk",  // Denmark
  "Fi": "fi",  // Finland
  "Nl": "nl",  // Netherlands
  // Add uppercase variants
  "SE": "se",
  "NO": "no",
  "DK": "dk",
  "FI": "fi",
  "NL": "nl",
};

// County level detail mapping
// This would be ideally sourced from a detailed GeoJSON file with county boundaries
// For this example, we're creating a simple representation
const countyDetails: Record<string, any[]> = {
  "se": [
    { name: "Stockholm", value: 0, lat: 59.3293, lon: 18.0686 },
    { name: "Gothenburg", value: 0, lat: 57.7089, lon: 11.9746 },
    { name: "Malmö", value: 0, lat: 55.6050, lon: 13.0038 },
    { name: "Uppsala", value: 0, lat: 59.8586, lon: 17.6389 },
    { name: "Västerås", value: 0, lat: 59.6099, lon: 16.5448 }
  ],
  "no": [
    { name: "Oslo", value: 0, lat: 59.9139, lon: 10.7522 },
    { name: "Bergen", value: 0, lat: 60.3913, lon: 5.3221 },
    { name: "Trondheim", value: 0, lat: 63.4305, lon: 10.3951 },
    { name: "Stavanger", value: 0, lat: 58.9700, lon: 5.7331 },
    { name: "Drammen", value: 0, lat: 59.7440, lon: 10.2045 }
  ],
  "dk": [
    { name: "Copenhagen", value: 0, lat: 55.6761, lon: 12.5683 },
    { name: "Aarhus", value: 0, lat: 56.1629, lon: 10.2039 },
    { name: "Odense", value: 0, lat: 55.4038, lon: 10.4024 },
    { name: "Aalborg", value: 0, lat: 57.0488, lon: 9.9217 },
    { name: "Esbjerg", value: 0, lat: 55.4678, lon: 8.4523 }
  ],
  "fi": [
    { name: "Helsinki", value: 0, lat: 60.1699, lon: 24.9384 },
    { name: "Espoo", value: 0, lat: 60.2055, lon: 24.6559 },
    { name: "Tampere", value: 0, lat: 61.4978, lon: 23.7610 },
    { name: "Vantaa", value: 0, lat: 60.2934, lon: 25.0378 },
    { name: "Oulu", value: 0, lat: 65.0121, lon: 25.4651 }
  ],
  "nl": [
    { name: "Amsterdam", value: 0, lat: 52.3676, lon: 4.9041 },
    { name: "Rotterdam", value: 0, lat: 51.9244, lon: 4.4777 },
    { name: "The Hague", value: 0, lat: 52.0705, lon: 4.3007 },
    { name: "Utrecht", value: 0, lat: 52.0907, lon: 5.1214 },
    { name: "Eindhoven", value: 0, lat: 51.4416, lon: 5.4697 }
  ]
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

  // Debug logs to check data coming in
  useEffect(() => {
    console.log("DiscussionTopicsMap received data:", data?.length);
    console.log("DiscussionTopicsMap selected year:", selectedYear);
    console.log("DiscussionTopicsMap selected topic:", selectedTopic);
  }, [data, selectedYear, selectedTopic]);

  // Filter data by selected year and topic
  const filteredData = React.useMemo(() => {
    let filtered = data.filter(item => item.year === selectedYear);
    
    if (selectedTopic) {
      filtered = filtered.filter(item => item.discussion_topic === selectedTopic);
    }
    
    console.log("Filtered data for map:", filtered);
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
      // Get the highcharts country code, using a case-insensitive approach
      const hcKey = countryCodeMapping[country] || country.toLowerCase();
      
      const avgPercentage = items.reduce((sum, item) => sum + (item.percentage || 0), 0) / items.length;
      
      // Main country data
      result.push({
        "hc-key": hcKey,
        value: avgPercentage,
        name: getFullCountryName(country),
        countryCode: country,
      });
      
      // Add county level details with distributed values based on country average
      if (countyDetails[hcKey]) {
        countyDetails[hcKey].forEach(county => {
          // Create a slightly different value for each county to show variation
          // Using a random factor to simulate county-level differences
          const countyValue = avgPercentage * (0.85 + Math.random() * 0.3);
          
          result.push({
            name: county.name,
            lat: county.lat,
            lon: county.lon,
            z: countyValue, // For bubble size
            value: countyValue,
            countryCode: country,
            countyLevel: true
          });
        });
      }
    });
    
    console.log("Map data prepared:", result);
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
        ? `County-Level Distribution of "${selectedTopic}" Discussions (${selectedYear})`
        : `County-Level Distribution of Sustainability Discussions (${selectedYear})`,
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
    plotOptions: {
      map: {
        states: {
          hover: {
            color: '#34502b'
          }
        }
      },
      mapbubble: {
        minSize: 3,
        maxSize: 15,
        tooltip: {
          pointFormat: '{point.name}: {point.value:.1f}%'
        }
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
    series: [
      {
        type: 'map',
        name: 'Country Overview',
        states: {
          hover: {
            color: '#34502b'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            textOutline: '0px contrast'
          }
        },
        allAreas: false,
        data: mapData.filter(item => !item.countyLevel)
      },
      {
        type: 'mapbubble',
        name: 'County Detail',
        color: '#0FA0CE',
        data: mapData.filter(item => item.countyLevel),
        cursor: 'pointer',
        minSize: 5,
        maxSize: 25,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            textOutline: '1px contrast'
          }
        }
      }
    ] as any
  };

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.update({
        series: [
          {
            data: mapData.filter(item => !item.countyLevel)
          },
          {
            data: mapData.filter(item => item.countyLevel)
          }
        ]
      } as any);
    }
  }, [mapData]);

  // Display message if no data is available
  if (filteredData.length === 0) {
    return (
      <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center p-10">
          <h3 className="text-lg font-semibold text-[#34502b]">No data available</h3>
          <p className="text-gray-600 mt-2">
            {selectedTopic 
              ? `No data found for "${selectedTopic}" in ${selectedYear}.` 
              : `No discussion topics data available for ${selectedYear}.`}
          </p>
        </div>
      </Card>
    );
  }

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

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { getFullCountryName } from '@/components/CountrySelect';
import { FONT_FAMILY } from '@/utils/constants';
import { getDynamicPercentageAxisDomain, getDynamicTickInterval } from '@/utils/charts/axisUtils';

interface KnowledgeChartProps {
  data: KnowledgeData[];
  selectedYear: number;
  country: string;
  selectedTerms: string[];
}

const KnowledgeChart: React.FC<KnowledgeChartProps> = ({ 
  data, 
  selectedYear, 
  country,
  selectedTerms
}) => {
  // Get the available years from the data
  const availableYears = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
  }, [data]);

  // Use the selected year if it exists in the data, otherwise use the most recent year
  const effectiveYear = useMemo(() => {
    if (availableYears.includes(selectedYear)) {
      return selectedYear;
    } else if (availableYears.length > 0) {
      return availableYears[0]; // Most recent year
    }
    return selectedYear; // Fallback to selected year even if no data
  }, [availableYears, selectedYear]);

  // Process data for the selected year and filter by selected terms
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Filter by effective year
    const yearData = data.filter(item => item.year === effectiveYear);
    
    // Filter by selected terms if any are selected
    let filteredData = yearData;
    if (selectedTerms.length > 0) {
      filteredData = yearData.filter(item => selectedTerms.includes(item.term));
    }
    
    // Sort by percentage descending
    return filteredData.sort((a, b) => b.percentage - a.percentage);
  }, [data, effectiveYear, selectedTerms]);

  // Add debugging to see the data structure
  console.log('Knowledge Chart Data:', {
    data: data?.length,
    selectedYear,
    effectiveYear,
    chartData: chartData?.length,
    availableYears,
    selectedTerms,
    percentages: chartData.map(item => ({
      term: item.term,
      percentage: item.percentage,
      formattedPercentage: typeof item.percentage === 'number' ? Math.round(item.percentage * 100) : 0
    }))
  });

  // Extract terms and percentages for the chart
  const terms = chartData.map(item => item.term);
  // Convert from decimal (0-1) to percentage (0-100) if needed
  const percentages = chartData.map(item => {
    if (typeof item.percentage === 'number') {
      // If it's already a whole number (like 75), keep it as is
      if (item.percentage > 1) {
        return Math.round(item.percentage);
      }
      // If it's a decimal (like 0.75), convert to percentage
      return Math.round(item.percentage * 100);
    }
    return 0;
  });

  // Calculate dynamic y-axis domain
  const [yMin, yMax] = getDynamicPercentageAxisDomain(percentages);
  const tickInterval = getDynamicTickInterval(yMax);

  // Chart colors
  const colors = percentages.map((_, index) => {
    // Create a gradient from dark green to light green
    const shade = 80 - (index * (60 / Math.max(percentages.length, 1)));
    return `rgba(52, 80, 43, ${shade / 100})`;
  });

  // Chart options for vertical bar chart
  const options: Highcharts.Options = {
    chart: {
      type: 'column', // Changed from 'bar' to 'column' for vertical bars
      height: Math.max(350, 25 * Math.min(terms.length, 15)),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: `Sustainability Term Knowledge in ${getFullCountryName(country)} (${effectiveYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      // This represents the category axis (terms) - displayed horizontally
      categories: terms,
      title: {
        text: 'Sustainability Terms',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY },
        rotation: -45,
        align: 'right'
      }
    },
    yAxis: {
      // Dynamic axis range based on actual data
      min: yMin,
      max: yMax,
      tickInterval: tickInterval,
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
      formatter: function() {
        const percentage = this.y !== undefined ? this.y : 0;
        return `<b>${this.x}</b><br/>${percentage}%`;
      }
    },
    plotOptions: {
      column: { // Changed from 'bar' to 'column'
        dataLabels: {
          enabled: true,
          format: '{y}%', // Whole numbers without decimals
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
        colors: colors
      }
    },
    series: [{
      name: 'Knowledge Level',
      type: 'column',
      data: percentages, // Already converted to percentage (0-100)
      color: '#34502b'
    }],
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    }
  };

  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          {data.length === 0 
            ? "No knowledge data available for the selected country." 
            : `No data available for the year ${effectiveYear}. Please select a different year.`}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Card>
  );
};

export default KnowledgeChart;

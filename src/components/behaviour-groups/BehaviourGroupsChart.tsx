
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useBehaviourGroups } from "@/hooks/useBehaviourGroups";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FONT_FAMILY } from "@/utils/constants";

interface BehaviourGroupsChartProps {
  selectedCountry: string;
  viewType: "comparison" | "trend";
}

const GROUP_COLORS = {
  "Ego": "#E8A27C",
  "Moderate": "#8BA86B",
  "Smart": "#A67A54",
  "Dedicated": "#78BBC7"
};

const COLORS = Object.values(GROUP_COLORS);

const BehaviourGroupsChart = ({ selectedCountry, viewType }: BehaviourGroupsChartProps) => {
  const { data: behaviourData = [], isLoading } = useBehaviourGroups(viewType === "trend" ? selectedCountry : undefined);

  // Create chart options based on the view type
  const chartOptions = useMemo(() => {
    if (isLoading || !behaviourData.length) return {};

    if (viewType === "trend") {
      const years = [...new Set(behaviourData.map(item => item.year))].sort();
      
      const trendData = years.map(year => {
        const yearData = behaviourData.filter(item => item.year === year);
        const result: { [key: string]: any } = { year: year.toString() };
        
        yearData.forEach(item => {
          result[item.behaviour_group] = item.percentage * 100; // Convert to percentage
        });
        
        return result;
      });

      // Create series for each behavior group
      const series = Object.entries(GROUP_COLORS).map(([group, color]) => ({
        name: group,
        data: trendData.map(item => item[group] || 0),
        color: color
      }));

      return {
        chart: {
          type: 'column',
          style: {
            fontFamily: FONT_FAMILY
          }
        },
        title: {
          text: `Behaviour Groups Trend in ${selectedCountry}`,
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        xAxis: {
          categories: trendData.map(item => item.year),
          title: {
            text: 'Year'
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Percentage'
          },
          labels: {
            format: '{value}%'
          }
        },
        tooltip: {
          formatter: function() {
            return `<b>${this.series.name}</b><br/>${this.x}: ${Highcharts.numberFormat(this.y, 0)}%`;
          }
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        series: series,
        credits: {
          enabled: false
        }
      };
    } else {
      // Comparison view
      const countryGroups = [...new Set(behaviourData.map(item => item.country))];
      
      const latestYearData = countryGroups.map(country => {
        const countryData = behaviourData.filter(item => item.country === country);
        const latestYear = Math.max(...countryData.map(item => item.year));
        return countryData.filter(item => item.year === latestYear);
      }).flat();

      const comparisonData = countryGroups.map(country => {
        const countryData = latestYearData.filter(item => item.country === country);
        const result: { [key: string]: any } = { country };
        
        countryData.forEach(item => {
          result[item.behaviour_group] = item.percentage * 100; // Convert to percentage
        });
        
        return result;
      });

      // Create series for each behavior group
      const series = Object.entries(GROUP_COLORS).map(([group, color]) => ({
        name: group,
        data: comparisonData.map(country => country[group] || 0),
        color: color
      }));

      return {
        chart: {
          type: 'bar',
          style: {
            fontFamily: FONT_FAMILY
          }
        },
        title: {
          text: 'Behaviour Groups Comparison Across Countries',
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        xAxis: {
          categories: comparisonData.map(item => item.country),
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Percentage'
          },
          labels: {
            format: '{value}%'
          }
        },
        tooltip: {
          formatter: function() {
            return `<b>${this.series.name}</b><br/>${this.x}: ${Highcharts.numberFormat(this.y, 0)}%`;
          }
        },
        plotOptions: {
          bar: {
            stacking: 'percent'
          }
        },
        series: series,
        credits: {
          enabled: false
        }
      };
    }
  }, [behaviourData, selectedCountry, viewType, isLoading]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </Card>
    );
  }

  if (!behaviourData.length) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available for the selected parameters.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-80 w-full">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions}
        />
      </div>
    </Card>
  );
};

export default BehaviourGroupsChart;

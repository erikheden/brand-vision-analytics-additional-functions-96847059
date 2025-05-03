
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useBehaviourGroups } from "@/hooks/useBehaviourGroups";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FONT_FAMILY } from "@/utils/constants";

const GROUP_COLORS = {
  "Ego": "#E8A27C",
  "Moderate": "#8BA86B",
  "Smart": "#A67A54",
  "Dedicated": "#78BBC7"
};

interface BehaviourGroupsComparisonProps {
  selectedCountries: string[];
}

const BehaviourGroupsComparison = ({ selectedCountries }: BehaviourGroupsComparisonProps) => {
  const { data: behaviourData = [] } = useBehaviourGroups();

  // Get the latest year's data for each country
  const comparisonData = useMemo(() => {
    const latestData = selectedCountries.map(country => {
      const countryData = behaviourData.filter(d => d.country === country);
      const maxYear = Math.max(...countryData.map(d => d.year));
      return countryData.filter(d => d.year === maxYear);
    }).flat();

    return selectedCountries.map(country => {
      const countryYearData = latestData.filter(d => d.country === country);
      const result: { [key: string]: any } = { country };
      
      countryYearData.forEach(item => {
        result[item.behaviour_group] = item.percentage;
      });
      
      return result;
    });
  }, [behaviourData, selectedCountries]);

  // Transform data for Highcharts
  const chartOptions = useMemo(() => {
    if (!comparisonData.length) return {};
    
    // Prepare series for each behavior group
    const series = Object.entries(GROUP_COLORS).map(([group, color]) => ({
      name: group,
      data: comparisonData.map(country => ({
        name: country.country,
        y: country[group] ? country[group] * 100 : 0, // Convert to percentage
        color: color
      })),
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
        text: 'Behaviour Groups Comparison',
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
          text: 'Percentage',
          align: 'high'
        },
        labels: {
          formatter: function() {
            return this.value + '%';
          }
        }
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.series.name}</b><br/>${this.point.name}: ${Highcharts.numberFormat(this.point.y, 0)}%`;
        }
      },
      plotOptions: {
        bar: {
          stacking: 'normal',
          dataLabels: {
            enabled: false
          }
        }
      },
      legend: {
        reversed: false
      },
      series: series,
      credits: {
        enabled: false
      }
    };
  }, [comparisonData]);

  if (!comparisonData.length) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center text-gray-500">
          No data available for comparison
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-[#34502b]">
        Behaviour Groups Comparison
      </h3>
      <div className="h-[500px] w-full">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions} 
        />
      </div>
    </Card>
  );
};

export default BehaviourGroupsComparison;

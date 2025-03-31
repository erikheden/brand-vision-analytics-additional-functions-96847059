import React from "react";
import { Card } from "@/components/ui/card";
import { useBehaviourGroups } from "@/hooks/useBehaviourGroups";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

  if (viewType === "trend") {
    const years = [...new Set(behaviourData.map(item => item.year))].sort();
    
    const trendData = years.map(year => {
      const yearData = behaviourData.filter(item => item.year === year);
      const result: { [key: string]: any } = { year };
      
      yearData.forEach(item => {
        result[item.behaviour_group] = item.percentage;
      });
      
      return result;
    });

    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-[#34502b]">
          Behaviour Groups Trend in {selectedCountry}
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              stackOffset="expand"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
              <Tooltip 
                formatter={(value: number) => [`${(value * 100).toFixed(0)}%`]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              {Object.entries(GROUP_COLORS).map(([group, color]) => (
                <Bar key={group} dataKey={group} stackId="a" fill={color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  } else {
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
        result[item.behaviour_group] = item.percentage;
      });
      
      result.total = 1;
      
      return result;
    });

    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-[#34502b]">
          Behaviour Groups Comparison Across Countries
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
              stackOffset="expand"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
              <YAxis type="category" dataKey="country" />
              <Tooltip 
                formatter={(value: number) => [`${(value * 100).toFixed(0)}%`]}
                labelFormatter={(label) => `Country: ${label}`}
              />
              <Legend />
              {Object.entries(GROUP_COLORS).map(([group, color]) => (
                <Bar key={group} dataKey={group} stackId="a" fill={color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }
};

export default BehaviourGroupsChart;

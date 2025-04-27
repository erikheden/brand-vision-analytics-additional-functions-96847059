
import React from "react";
import { Card } from "@/components/ui/card";
import { useBehaviourGroups } from "@/hooks/useBehaviourGroups";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

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
  const comparisonData = React.useMemo(() => {
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <YAxis type="category" dataKey="country" />
            <Tooltip 
              formatter={(value: number) => [`${(value * 100).toFixed(0)}%`]}
              labelFormatter={(label) => `Country: ${label}`}
            />
            <Legend />
            {Object.entries(GROUP_COLORS).map(([group, color]) => (
              <Bar key={group} dataKey={group} fill={color} stackId="a" />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BehaviourGroupsComparison;

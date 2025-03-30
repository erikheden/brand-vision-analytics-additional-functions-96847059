
import React from "react";
import { Card } from "@/components/ui/card";
import { useBehaviourGroups, useYearsWithBehaviourData } from "@/hooks/useBehaviourGroups";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BehaviourGroupsDistributionProps {
  selectedCountry: string;
}

const COLORS = {
  "Ego": "#FF8042",
  "Moderate": "#FFBB28",
  "Smart": "#00C49F",
  "Dedicated": "#0088FE"
};

const BehaviourGroupsDistribution = ({ selectedCountry }: BehaviourGroupsDistributionProps) => {
  const { data: behaviourData = [], isLoading } = useBehaviourGroups(selectedCountry);
  const { data: years = [] } = useYearsWithBehaviourData(selectedCountry);
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(Math.max(...years));
    }
  }, [years, selectedYear]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </Card>
    );
  }

  if (!behaviourData.length || !selectedYear) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available for the selected parameters.</p>
        </div>
      </Card>
    );
  }

  const yearData = behaviourData.filter(item => item.year === selectedYear);
  
  if (!yearData.length) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available for the selected year.</p>
        </div>
      </Card>
    );
  }

  const pieData = yearData.map(item => ({
    name: item.behaviour_group,
    value: item.percentage,
  }));

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-lg font-semibold text-[#34502b]">
          Behaviour Groups Distribution in {selectedCountry}
        </h3>
        <div className="mt-2 md:mt-0">
          <Label htmlFor="year" className="mr-2">Year:</Label>
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year" className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BehaviourGroupsDistribution;

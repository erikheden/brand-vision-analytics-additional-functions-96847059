
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { getFullCountryName } from '@/components/CountrySelect';
import { formatPercentage } from '@/utils/formatting';

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
    console.log(`Filtered data for year ${effectiveYear}:`, yearData.length);
    
    // Filter by selected terms if any are selected
    let filteredData = yearData;
    if (selectedTerms.length > 0) {
      filteredData = yearData.filter(item => selectedTerms.includes(item.term));
    }
    console.log('Filtered data by terms:', filteredData.length);
    
    // Sort by percentage descending
    return filteredData.sort((a, b) => b.percentage - a.percentage);
  }, [data, effectiveYear, selectedTerms]);

  // Format chart data to include pre-formatted percentage values
  const formattedChartData = useMemo(() => {
    return chartData.map(item => ({
      ...item,
      formattedPercentage: formatPercentage(item.percentage, false)
    }));
  }, [chartData]);

  // Chart colors
  const COLORS = [
    '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89', '#b2d7a1', '#cbe9b9',
    '#257179', '#328a94', '#3fa3ae', '#4dbcc9', '#66c7d2', '#80d2db', '#99dde4'
  ];

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
    <Card className="p-6 bg-white border border-[#34502b]/20 rounded-xl shadow-md">
      <h2 className="text-lg font-medium mb-4">
        Sustainability Term Knowledge in {getFullCountryName(country)} ({effectiveYear})
      </h2>
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedChartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category" 
              dataKey="term" 
              width={90}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'percentage') {
                  // Format percentage to show with 1 decimal point
                  const formattedValue = value.toFixed(1);
                  return [`${formattedValue}%`, 'Knowledge Level'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Term: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="percentage" 
              name="Knowledge Level" 
              fill="#34502b"
              label={{
                position: 'right',
                formatter: (item: any) => item.formattedPercentage,
                fill: '#34502b',
                fontSize: 12
              }}
            >
              {formattedChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default KnowledgeChart;

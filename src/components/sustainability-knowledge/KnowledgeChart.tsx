
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { getFullCountryName } from '@/components/CountrySelect';

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
  // Process data for the selected year and filter by selected terms
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Filter by year
    const yearData = data.filter(item => item.year === selectedYear);
    console.log(`Filtered data for year ${selectedYear}:`, yearData.length);
    
    // Filter by selected terms if any are selected
    let filteredData = yearData;
    if (selectedTerms.length > 0) {
      filteredData = yearData.filter(item => selectedTerms.includes(item.term));
    }
    console.log('Filtered data by terms:', filteredData.length);
    
    // Sort by percentage descending
    return filteredData.sort((a, b) => b.percentage - a.percentage);
  }, [data, selectedYear, selectedTerms]);

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
            : "Please select terms to view sustainability knowledge data."}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-[#34502b]/20 rounded-xl shadow-md">
      <h2 className="text-lg font-medium mb-4">
        Sustainability Term Knowledge in {getFullCountryName(country)} ({selectedYear})
      </h2>
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
              labelFormatter={(label) => `Term: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="percentage" 
              name="Knowledge Level" 
              fill="#34502b"
            >
              {chartData.map((entry, index) => (
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

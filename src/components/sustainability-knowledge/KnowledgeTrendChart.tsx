
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { getFullCountryName } from '@/components/CountrySelect';
import { formatPercentage } from '@/utils/formatting';

interface KnowledgeTrendChartProps {
  data: KnowledgeData[];
  selectedTerms: string[];
  country: string;
}

const KnowledgeTrendChart: React.FC<KnowledgeTrendChartProps> = ({ 
  data, 
  selectedTerms,
  country
}) => {
  // Process data to show trends over years for selected terms
  const chartData = useMemo(() => {
    if (!data || data.length === 0 || selectedTerms.length === 0) return [];
    
    // Filter by selected terms
    const filteredData = data.filter(item => selectedTerms.includes(item.term));
    console.log('Filtered trend data by terms:', filteredData.length);
    
    // Group by year
    const yearGroups = filteredData.reduce((groups, item) => {
      if (!groups[item.year]) {
        groups[item.year] = {
          year: item.year,
        };
      }
      
      // Use the term as the key for the percentage
      // Multiply by 100 since the database now stores values as 0.XX instead of XX.X
      groups[item.year][item.term] = item.percentage * 100;
      
      return groups;
    }, {} as Record<number, any>);
    
    // Convert to array and sort by year
    return Object.values(yearGroups).sort((a, b) => a.year - b.year);
  }, [data, selectedTerms]);

  // Colors for different terms
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
            : selectedTerms.length === 0 
              ? "Please select terms to view sustainability knowledge trends." 
              : "No trend data available for the selected terms."}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-[#34502b]/20 rounded-xl shadow-md">
      <h2 className="text-lg font-medium mb-4">
        Sustainability Knowledge Trends in {getFullCountryName(country)}
      </h2>
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis 
              domain={[0, 100]} 
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number) => [formatPercentage(value, false), 'Percentage']}
              labelFormatter={(year) => `Year: ${year}`}
            />
            <Legend />
            {selectedTerms.map((term, index) => (
              <Line
                key={term}
                type="monotone"
                dataKey={term}
                name={term}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default KnowledgeTrendChart;


import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFullCountryName } from '@/components/CountrySelect';
import { useProcessedComparisonData } from '@/hooks/sustainability-knowledge/useProcessedComparisonData';
import { EmptyState } from './ComparisonStates';

interface KnowledgeComparisonBarChartProps {
  countriesData: Record<string, any[]>;
  selectedCountries: string[];
  selectedTerms: string[];
  selectedYear: number;
}

const KnowledgeComparisonBarChart: React.FC<KnowledgeComparisonBarChartProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms,
  selectedYear
}) => {
  // Process data using the custom hook
  const { chartData, COLORS } = useProcessedComparisonData(countriesData, selectedCountries, selectedTerms, selectedYear);

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">Please select at least one term to compare</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tickFormatter={(value) => `${value}%`}
            label={{ value: 'Knowledge Level (%)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            type="category" 
            dataKey="term" 
            width={140}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 18)}...` : value}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Knowledge Level']}
            labelFormatter={(label) => `Term: ${label}`}
          />
          <Legend formatter={(value) => getFullCountryName(value)} />
          
          {selectedCountries.map((country, index) => (
            <Bar 
              key={country}
              dataKey={country}
              name={country}
              fill={COLORS[index % COLORS.length]}
              barSize={20}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KnowledgeComparisonBarChart;

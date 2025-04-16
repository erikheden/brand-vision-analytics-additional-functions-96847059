
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFullCountryName } from '@/components/CountrySelect';
import { useProcessedTrendData } from '@/hooks/sustainability-knowledge/useProcessedTrendData';
import { EmptyState } from './ComparisonStates';

interface KnowledgeTrendComparisonLineChartProps {
  countriesData: Record<string, any[]>;
  selectedCountries: string[];
  selectedTerms: string[];
}

const KnowledgeTrendComparisonLineChart: React.FC<KnowledgeTrendComparisonLineChartProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms
}) => {
  // Process data using the custom hook
  const { chartData, lineConfigs, COUNTRY_COLORS, TERM_PATTERNS } = useProcessedTrendData(countriesData, selectedCountries, selectedTerms);

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">No trend data available for the selected criteria</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis 
            domain={[0, 100]} 
            label={{ value: 'Knowledge Level (%)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number | null) => {
              if (value === null) return ['N/A', ''];
              return [`${value}%`, 'Knowledge Level'];
            }}
            labelFormatter={(year) => `Year: ${year}`}
          />
          <Legend 
            formatter={(value) => {
              const [country, term] = value.split('-');
              return `${getFullCountryName(country)} - ${term}`;
            }}
          />
          
          {lineConfigs.map(({ dataKey, country, term }, index) => {
            const countryIndex = selectedCountries.indexOf(country);
            const termIndex = selectedTerms.indexOf(term);
            
            return (
              <Line
                key={dataKey}
                type="monotone"
                dataKey={dataKey}
                name={dataKey}
                stroke={COUNTRY_COLORS[countryIndex % COUNTRY_COLORS.length]}
                strokeDasharray={termIndex > 0 ? TERM_PATTERNS[termIndex % TERM_PATTERNS.length] : undefined}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KnowledgeTrendComparisonLineChart;

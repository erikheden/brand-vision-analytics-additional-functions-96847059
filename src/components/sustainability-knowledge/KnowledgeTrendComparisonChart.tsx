
import React, { useMemo } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFullCountryName } from '@/components/CountrySelect';

interface KnowledgeTrendComparisonChartProps {
  countriesData: Record<string, KnowledgeData[]>;
  selectedCountries: string[];
  selectedTerms: string[];
}

const KnowledgeTrendComparisonChart: React.FC<KnowledgeTrendComparisonChartProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms
}) => {
  // Colors for different countries and terms
  const COUNTRY_COLORS = [
    '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89'
  ];
  
  const TERM_PATTERNS = [
    'solid', 'dashed', 'dotted', 'dashdot'
  ];
  
  const chartData = useMemo(() => {
    if (!countriesData || Object.keys(countriesData).length === 0) return [];
    
    // Get all years from all countries
    const allYears = new Set<number>();
    Object.values(countriesData).forEach(countryData => {
      countryData.forEach(item => {
        if (selectedTerms.includes(item.term)) {
          allYears.add(item.year);
        }
      });
    });
    
    // Sort years
    const sortedYears = Array.from(allYears).sort((a, b) => a - b);
    
    // Create data points for each year
    return sortedYears.map(year => {
      const yearData: Record<string, any> = { year };
      
      // Add data for each country and term combination
      selectedCountries.forEach(country => {
        const countryData = countriesData[country] || [];
        
        selectedTerms.forEach(term => {
          const termData = countryData.find(
            item => item.term === term && item.year === year
          );
          
          // Convert from decimal (0-1) to percentage (0-100) if needed
          const percentage = termData 
            ? (typeof termData.percentage === 'number' 
                ? Math.round(termData.percentage * 100) 
                : 0)
            : null;
          
          // Store as country-term combination
          yearData[`${country}-${term}`] = percentage;
        });
      });
      
      return yearData;
    });
  }, [countriesData, selectedCountries, selectedTerms]);

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">No trend data available for the selected criteria</p>
      </div>
    );
  }

  // Create all possible combinations of country-term for the lines
  const lineConfigs = selectedCountries.flatMap(country => 
    selectedTerms.map(term => ({
      dataKey: `${country}-${term}`,
      country,
      term
    }))
  );

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

export default KnowledgeTrendComparisonChart;

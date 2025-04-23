
import React, { useMemo } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFullCountryName } from '@/components/CountrySelect';
import { Card } from '@/components/ui/card';

interface KnowledgeComparisonBarChartProps {
  countriesData: Record<string, KnowledgeData[]>;
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
  // Colors for different countries
  const COLORS = [
    '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89', 
    '#257179', '#328a94', '#3fa3ae', '#4dbcc9', '#66c7d2'
  ];
  
  // Debug logs
  console.log('KnowledgeComparisonBarChart render:', {
    selectedCountries,
    selectedTerms,
    selectedYear,
    chartDataLength: selectedTerms.length
  });
  
  const chartData = useMemo(() => {
    if (!countriesData || selectedTerms.length === 0) return [];
    
    // Create data for the selected terms across all countries
    return selectedTerms.map(term => {
      const termData: Record<string, any> = { term };
      
      selectedCountries.forEach(country => {
        const countryData = countriesData[country] || [];
        const yearData = countryData.find(
          item => item.term === term && item.year === selectedYear
        );
        
        // Convert from decimal (0-1) to percentage (0-100) if needed
        const percentage = yearData 
          ? (typeof yearData.percentage === 'number' 
              ? (yearData.percentage <= 1 ? Math.round(yearData.percentage * 100) : Math.round(yearData.percentage))
              : 0)
          : 0;
        
        termData[country] = percentage;
      });
      
      return termData;
    });
  }, [countriesData, selectedCountries, selectedTerms, selectedYear]);

  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex justify-center items-center h-60">
          <p className="text-gray-500">
            {selectedTerms.length === 0 
              ? "Please select at least one term to compare"
              : "No data available for the selected terms and year"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <h2 className="text-lg font-medium mb-4">
        Knowledge Levels Comparison ({selectedYear})
      </h2>
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
    </Card>
  );
};

export default KnowledgeComparisonBarChart;

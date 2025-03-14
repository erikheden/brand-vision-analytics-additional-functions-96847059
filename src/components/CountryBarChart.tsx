
import { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { getFullCountryName } from "@/components/CountrySelect";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { BrandData } from "@/types/brand";
import { ChartTooltip } from "./ChartTooltip";

interface CountryBarChartProps {
  allCountriesData: MultiCountryData;
  selectedBrands: string[];
  standardized: boolean;
}

// Color palette for bars
const BRAND_COLORS = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];

const CountryBarChart = ({
  allCountriesData,
  selectedBrands,
  standardized
}: CountryBarChartProps) => {
  // Process the data for 2025 (or latest year) comparison
  const processedData = useMemo(() => {
    const latestData: any[] = [];
    
    // For each country, get the 2025 (or latest) data for each brand
    Object.entries(allCountriesData).forEach(([country, countryData]) => {
      if (!countryData || countryData.length === 0) return;
      
      // Group by brand
      const brandGroups = new Map<string, BrandData[]>();
      countryData.forEach(item => {
        if (!item.Brand) return;
        if (!brandGroups.has(item.Brand)) {
          brandGroups.set(item.Brand, []);
        }
        brandGroups.get(item.Brand)?.push(item);
      });
      
      // For each brand, get the latest (2025 if available) data
      selectedBrands.forEach(brand => {
        const brandData = brandGroups.get(brand);
        if (!brandData || brandData.length === 0) return;
        
        // Sort by year to find the latest data
        brandData.sort((a, b) => (b.Year || 0) - (a.Year || 0));
        
        // Get 2025 data or latest data if 2025 is not available
        const latest = brandData.find(item => item.Year === 2025) || brandData[0];
        
        if (latest && latest.Score !== null) {
          // Calculate standardized score if needed
          let score = latest.Score;
          
          if (standardized && Array.isArray((countryData as any).marketData)) {
            // Get market data for the same year
            const marketDataForYear = (countryData as any).marketData
              .filter((item: any) => item.Year === latest.Year);
            
            if (marketDataForYear.length > 0) {
              // Calculate mean and standard deviation
              const validScores = marketDataForYear
                .map((item: any) => item.Score)
                .filter((score: any) => score !== null && !isNaN(score));
              
              const mean = validScores.reduce((sum: number, val: number) => sum + val, 0) / validScores.length;
              const stdDev = Math.sqrt(
                validScores.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / validScores.length
              );
              
              // Standardize the score
              score = stdDev === 0 ? 0 : (latest.Score - mean) / stdDev;
            }
          }
          
          // Add to the dataset with country as the x-axis category
          latestData.push({
            country: getFullCountryName(country),
            brand: brand,
            countryCode: country,
            score: score,
            year: latest.Year,
            projected: latest.Projected || false
          });
        }
      });
    });
    
    return latestData;
  }, [allCountriesData, selectedBrands, standardized]);
  
  // Organize data for the bar chart
  const chartData = useMemo(() => {
    // Group by country
    const countryGroups = new Map<string, any>();
    
    processedData.forEach(item => {
      if (!countryGroups.has(item.country)) {
        countryGroups.set(item.country, { country: item.country, countryCode: item.countryCode });
      }
      
      const countryGroup = countryGroups.get(item.country);
      countryGroup[item.brand] = item.score;
      
      // Add a flag for projected data
      if (item.projected) {
        countryGroup[`${item.brand}_projected`] = true;
      }
    });
    
    return Array.from(countryGroups.values());
  }, [processedData]);
  
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="country" />
          <YAxis 
            domain={standardized ? [-3, 3] : ['auto', 'auto']}
            tickFormatter={(value) => standardized ? `${value.toFixed(1)}σ` : value.toFixed(1)}
          />
          <Tooltip content={<ChartTooltip standardized={standardized} />} />
          <Legend wrapperStyle={{ paddingTop: 20 }} />
          {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
          
          {selectedBrands.map((brand, index) => (
            <Bar 
              key={brand} 
              dataKey={brand} 
              fill={BRAND_COLORS[index % BRAND_COLORS.length]} 
              name={brand}
              // Use a fixed opacity value instead of a function
              fillOpacity={0.9}
              // Use CSS style property for Bar component
              style={{
                opacity: 1
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryBarChart;

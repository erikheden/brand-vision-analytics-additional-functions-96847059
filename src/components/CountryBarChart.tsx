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
import { getBrandColor } from "@/utils/countryChartDataUtils";
import { FONT_FAMILY } from "@/utils/constants";

interface CountryBarChartProps {
  allCountriesData: MultiCountryData;
  selectedBrands: string[];
  standardized: boolean;
}

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
    
    // Convert to array and sort by the first brand's score (high to low)
    // This ensures the chart bars are sorted from highest to lowest values
    const dataArray = Array.from(countryGroups.values());
    
    if (selectedBrands.length > 0 && dataArray.length > 0) {
      const primaryBrand = selectedBrands[0];
      
      dataArray.sort((a, b) => {
        const scoreA = a[primaryBrand] !== undefined ? a[primaryBrand] : -Infinity;
        const scoreB = b[primaryBrand] !== undefined ? b[primaryBrand] : -Infinity;
        return scoreB - scoreA; // Sort high to low
      });
      
      console.log("Sorted chart data:", dataArray.map(item => ({
        country: item.country, 
        score: item[primaryBrand]
      })));
    }
    
    return dataArray;
  }, [processedData, selectedBrands]);
  
  // Calculate the y-axis domain similar to single country view
  const yAxisDomain = useMemo(() => {
    if (standardized) {
      return [-3, 3] as [number, number]; // Fixed domain for standardized scores
    }
    
    // Find min and max values across all brands
    let minValue = Infinity;
    let maxValue = -Infinity;
    
    chartData.forEach(dataPoint => {
      selectedBrands.forEach(brand => {
        const value = dataPoint[brand];
        if (value !== undefined && value !== null) {
          minValue = Math.min(minValue, value);
          maxValue = Math.max(maxValue, value);
        }
      });
    });
    
    if (minValue === Infinity) minValue = 0;
    if (maxValue === -Infinity) maxValue = 100;
    
    // Calculate padding (10% of the range)
    const range = maxValue - minValue;
    const padding = range * 0.1;
    
    // Set minimum to 0 if it's close to 0
    const minY = minValue > 0 && minValue < 10 ? 0 : Math.max(0, minValue - padding);
    
    // Add padding to the top 
    const maxY = maxValue + padding;
    
    // Round to nice values
    const roundedMin = Math.floor(minY / 10) * 10;
    const roundedMax = Math.ceil(maxY / 10) * 10;
    
    console.log("Y-axis domain:", [roundedMin, roundedMax]);
    
    return [roundedMin, roundedMax] as [number, number];
  }, [chartData, selectedBrands, standardized]);
  
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
          <XAxis 
            dataKey="country" 
            style={{ 
              fontFamily: FONT_FAMILY,
              fontSize: '12px',
              color: '#34502b'
            }}
          />
          <YAxis 
            domain={yAxisDomain}
            tickFormatter={(value) => standardized ? `${value.toFixed(0)}σ` : value.toFixed(0)}
            style={{ 
              fontFamily: FONT_FAMILY,
              fontSize: '12px',
              color: '#34502b'
            }}
          />
          <Tooltip content={<ChartTooltip standardized={standardized} />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: 20,
              fontFamily: FONT_FAMILY 
            }}
          />
          {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
          
          {selectedBrands.map((brand) => (
            <Bar 
              key={brand} 
              dataKey={brand} 
              fill={getBrandColor(brand)} 
              name={brand}
              fillOpacity={0.9}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryBarChart;

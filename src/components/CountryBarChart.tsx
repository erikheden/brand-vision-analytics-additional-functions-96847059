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
  ReferenceLine,
  Text
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
  
  // Calculate the y-axis domain similar to dashboard implementation
  const yAxisDomain = useMemo(() => {
    if (standardized) {
      return [-3, 3] as [number, number]; // Fixed domain for standardized scores
    }
    
    // Find max value across all brands and countries
    let maxValue = 0;
    
    chartData.forEach(dataPoint => {
      selectedBrands.forEach(brand => {
        const value = dataPoint[brand];
        if (value !== undefined && value !== null && !isNaN(value)) {
          maxValue = Math.max(maxValue, value);
        }
      });
    });
    
    // Add some padding (like in the image) and round up to nearest multiple of 25
    const paddedMax = Math.ceil((maxValue * 1.1) / 25) * 25;
    
    // Always start from 0 for bar charts (as seen in the reference image)
    return [0, paddedMax] as [number, number];
  }, [chartData, selectedBrands, standardized]);
  
  // Calculate the year for chart title
  const chartYear = useMemo(() => {
    if (processedData.length === 0) return 2025; // Default
    
    // Find the most common year in the data
    const yearCounts: Record<number, number> = {};
    processedData.forEach(item => {
      if (item.year) {
        yearCounts[item.year] = (yearCounts[item.year] || 0) + 1;
      }
    });
    
    // Find the year with the most data points
    let mostCommonYear = 2025;
    let highestCount = 0;
    
    Object.entries(yearCounts).forEach(([year, count]) => {
      if (count > highestCount) {
        highestCount = count;
        mostCommonYear = parseInt(year);
      }
    });
    
    return mostCommonYear;
  }, [processedData]);
  
  // Custom axis label component
  const AxisLabel = ({ x, y, textAnchor, children }: any) => {
    return (
      <Text 
        x={x} 
        y={y} 
        textAnchor={textAnchor} 
        verticalAnchor="middle" 
        style={{ 
          fontFamily: FONT_FAMILY, 
          fontSize: '14px', 
          fill: '#34502b',
          fontWeight: 500
        }}
      >
        {children}
      </Text>
    );
  };
  
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  return (
    <div className="w-full h-[500px]">
      {/* Chart title similar to the reference image */}
      <h3 className="text-center text-lg font-medium text-[#34502b] mb-2">
        {chartYear} Brand Scores Comparison
      </h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barGap={2}
          barSize={36}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={true} vertical={false} />
          <XAxis 
            dataKey="country" 
            style={{ 
              fontFamily: FONT_FAMILY,
              fontSize: '12px',
              color: '#34502b'
            }}
            tickMargin={10}
          />
          <YAxis 
            domain={yAxisDomain}
            tickFormatter={(value) => standardized ? `${value.toFixed(0)}σ` : value.toFixed(0)}
            style={{ 
              fontFamily: FONT_FAMILY,
              fontSize: '12px',
              color: '#34502b'
            }}
            tickCount={7}
            axisLine={true}
            label={
              <AxisLabel
                x={-35}
                y={230}
                textAnchor="middle"
                angle={-90}
              >
                Score
              </AxisLabel>
            }
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
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryBarChart;

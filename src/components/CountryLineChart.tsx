
import { useMemo } from "react";
import { 
  LineChart, 
  Line, 
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

interface CountryLineChartProps {
  allCountriesData: MultiCountryData;
  selectedBrands: string[];
  standardized: boolean;
}

// Color palette for lines
const COUNTRY_COLORS = [
  "#34502b", "#09657b", "#dd8c57", "#6ec0dc", "#7c9457",
  "#b7c895", "#dadada", "#f0d2b0", "#bce2f3", "#1d1d1b"
];

const CountryLineChart = ({
  allCountriesData,
  selectedBrands,
  standardized
}: CountryLineChartProps) => {
  // Process the data for the line chart
  const processedData = useMemo(() => {
    // If there's no data, return empty array
    if (Object.keys(allCountriesData).length === 0) {
      return { chartData: [], years: [] };
    }
    
    console.log("Processing data for line chart with countries:", Object.keys(allCountriesData));
    
    // Collect all years from all countries
    const allYears = new Set<number>();
    
    // Prepare data structure for each brand and country
    const brandCountryData: Map<string, Map<string, Map<number, number>>> = new Map();
    
    // Process data from each country
    Object.entries(allCountriesData).forEach(([country, countryData]) => {
      if (!countryData || countryData.length === 0) return;
      
      console.log(`Processing data for ${country}: ${countryData.length} entries`);
      
      // For standardization, we'll need market statistics per year
      const marketStatsByYear: Map<number, { mean: number; stdDev: number }> = new Map();
      
      if (standardized && Array.isArray((countryData as any).marketData)) {
        const marketData = (countryData as any).marketData;
        
        // Group market data by year
        const marketDataByYear = new Map<number, BrandData[]>();
        marketData.forEach((item: BrandData) => {
          if (item.Year === null || item.Score === null) return;
          
          if (!marketDataByYear.has(item.Year)) {
            marketDataByYear.set(item.Year, []);
          }
          marketDataByYear.get(item.Year)?.push(item);
        });
        
        // Calculate statistics for each year
        marketDataByYear.forEach((yearData, year) => {
          const validScores = yearData
            .map(item => item.Score)
            .filter((score): score is number => score !== null);
          
          if (validScores.length > 0) {
            const mean = validScores.reduce((sum, val) => sum + val, 0) / validScores.length;
            const variance = validScores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validScores.length;
            const stdDev = Math.sqrt(variance);
            
            marketStatsByYear.set(year, { mean, stdDev });
          }
        });
      }
      
      // Process data for each brand
      selectedBrands.forEach(brand => {
        // Filter data for this brand
        const brandData = countryData.filter(item => item.Brand === brand);
        
        console.log(`Brand ${brand} in ${country}: ${brandData.length} data points`);
        
        if (brandData.length === 0) return;
        
        // For each data point
        brandData.forEach(dataPoint => {
          if (dataPoint.Year === null || dataPoint.Score === null) return;
          
          console.log(`Data point for ${brand}/${country}/${dataPoint.Year}: ${dataPoint.Score}`);
          
          // Add to the set of all years
          allYears.add(dataPoint.Year);
          
          // Initialize data structures if needed
          if (!brandCountryData.has(brand)) {
            brandCountryData.set(brand, new Map());
          }
          const brandMap = brandCountryData.get(brand)!;
          
          if (!brandMap.has(country)) {
            brandMap.set(country, new Map());
          }
          const countryMap = brandMap.get(country)!;
          
          // Calculate score (standardized or raw)
          let score = dataPoint.Score;
          
          if (standardized) {
            const stats = marketStatsByYear.get(dataPoint.Year);
            if (stats && stats.stdDev > 0) {
              score = (score - stats.mean) / stats.stdDev;
            }
          }
          
          // Store the score
          countryMap.set(dataPoint.Year, score);
        });
      });
    });
    
    // Convert all years to sorted array
    const years = Array.from(allYears).sort((a, b) => a - b);
    
    console.log("Years in the data:", years);
    console.log("Brand-country combinations:", 
      Array.from(brandCountryData.entries()).map(([brand, countryMap]) => ({
        brand,
        countries: Array.from(countryMap.keys())
      }))
    );
    
    // Create data points for the chart
    const chartData = years.map(year => {
      const dataPoint: any = { year };
      
      // Add data for each brand and country
      brandCountryData.forEach((brandMap, brand) => {
        brandMap.forEach((countryMap, country) => {
          const score = countryMap.get(year);
          if (score !== undefined) {
            dataPoint[`${brand}-${country}`] = score;
          }
        });
      });
      
      return dataPoint;
    });
    
    return { chartData, years };
  }, [allCountriesData, selectedBrands, standardized]);
  
  const { chartData, years } = processedData;
  
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  // Create lines for each brand-country combination
  const lines: React.ReactNode[] = [];
  let lineIndex = 0;
  
  selectedBrands.forEach(brand => {
    Object.keys(allCountriesData).forEach(country => {
      // Check if we have any data for this brand-country combination
      const hasData = chartData.some(dataPoint => 
        dataPoint[`${brand}-${country}`] !== undefined
      );
      
      if (hasData) {
        const color = COUNTRY_COLORS[lineIndex % COUNTRY_COLORS.length];
        lineIndex++;
        
        lines.push(
          <Line
            key={`${brand}-${country}`}
            type="monotone"
            dataKey={`${brand}-${country}`}
            name={`${brand} (${getFullCountryName(country)})`}
            stroke={color}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6, fill: color }}
          />
        );
      }
    });
  });
  
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="year"
            type="number"
            domain={['dataMin', 'dataMax']}
            allowDecimals={false}
          />
          <YAxis 
            domain={standardized ? [-3, 3] : ['auto', 'auto']}
            tickFormatter={(value) => standardized ? `${value.toFixed(1)}σ` : value.toFixed(1)}
          />
          <Tooltip content={<ChartTooltip standardized={standardized} />} />
          <Legend wrapperStyle={{ paddingTop: 20 }} />
          {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
          
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryLineChart;

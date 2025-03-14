
import { useEffect, useMemo, useState } from "react";
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
import { BrandData } from "@/types/brand";
import { processChartData, calculateYearRange, createChartConfig } from "@/utils/chartDataUtils";
import { getFullCountryName } from "@/components/CountrySelect";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import ChartTooltip from "./ChartTooltip";

interface CountryLineChartProps {
  allCountriesData: MultiCountryData;
  selectedBrands: string[];
  standardized: boolean;
}

const CountryLineChart = ({
  allCountriesData,
  selectedBrands,
  standardized
}: CountryLineChartProps) => {
  const [chartWidth, setChartWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      setChartWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWidth);
    updateWidth();
    
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Process the data for the chart
  const processedData = useMemo(() => {
    // Create a map to store data by year
    const yearData: Record<number, any> = {};
    
    // Process each country's data
    Object.entries(allCountriesData).forEach(([country, countryData]) => {
      // Skip if there's no data for this country
      if (!countryData || countryData.length === 0) return;
      
      // Standardize scores if needed
      const processedCountryData = processChartData(countryData as BrandData[], standardized);
      
      // Merge into year data
      processedCountryData.forEach(item => {
        const year = item.year;
        
        if (!yearData[year]) {
          yearData[year] = { year };
        }
        
        // Add data for each brand in this country
        selectedBrands.forEach(brand => {
          if (item[brand] !== undefined) {
            yearData[year][`${brand}__${country}`] = item[brand];
          }
        });
      });
    });
    
    // Convert to array and sort by year
    return Object.values(yearData).sort((a, b) => a.year - b.year);
  }, [allCountriesData, selectedBrands, standardized]);
  
  // Calculate min and max years across all countries
  const yearRange = useMemo(() => {
    const allYears: number[] = [];
    
    Object.values(allCountriesData).forEach(countryData => {
      if (countryData && countryData.length > 0) {
        const countryYearRange = calculateYearRange(countryData as BrandData[]);
        allYears.push(...countryYearRange);
      }
    });
    
    return [...new Set(allYears)].sort((a, b) => a - b);
  }, [allCountriesData]);
  
  // Create config for each brand-country combination
  const chartConfig = useMemo(() => {
    const config = createChartConfig(selectedBrands);
    const enhancedConfig: Record<string, any> = {};
    
    Object.entries(allCountriesData).forEach(([country, _]) => {
      selectedBrands.forEach(brand => {
        const key = `${brand}__${country}`;
        enhancedConfig[key] = {
          ...config[brand],
          label: `${brand} (${getFullCountryName(country)})`,
        };
      });
    });
    
    return enhancedConfig;
  }, [selectedBrands, allCountriesData]);
  
  // Generate consistent line colors for each brand across countries
  const getColorForBrandCountry = (brand: string, country: string, index: number) => {
    const brandIndex = selectedBrands.indexOf(brand);
    const countryIndex = Object.keys(allCountriesData).indexOf(country);
    const baseColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    
    // Base color determined by brand
    const baseColor = baseColors[brandIndex % baseColors.length];
    
    // Adjust color based on country (make it lighter or darker)
    const darkenFactor = 1 - (countryIndex * 0.2); // Adjust by 20% for each country
    
    // Simple color adjustment (this is a basic example)
    const adjustColor = (hex: string, factor: number) => {
      // Convert hex to RGB
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      
      // Adjust each channel
      const adjustedR = Math.min(255, Math.max(0, Math.round(r * factor)));
      const adjustedG = Math.min(255, Math.max(0, Math.round(g * factor)));
      const adjustedB = Math.min(255, Math.max(0, Math.round(b * factor)));
      
      // Convert back to hex
      return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
    };
    
    return adjustColor(baseColor, darkenFactor);
  };
  
  if (processedData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  // Generate all line elements
  const lineElements = Object.keys(allCountriesData).flatMap(country => 
    selectedBrands.map((brand, index) => {
      const key = `${brand}__${country}`;
      return (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          name={`${brand} (${getFullCountryName(country)})`}
          stroke={getColorForBrandCountry(brand, country, index)}
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
          connectNulls={true}
        />
      );
    })
  );
  
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="year" 
            domain={[Math.min(...yearRange), Math.max(...yearRange)]}
            allowDecimals={false}
            type="number"
            tickCount={chartWidth < 500 ? 5 : 10}
          />
          <YAxis 
            domain={standardized ? [-3, 3] : ['auto', 'auto']}
            tickFormatter={(value) => standardized ? `${value.toFixed(1)}σ` : value.toFixed(1)}
          />
          <Tooltip content={<ChartTooltip standardized={standardized} />} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ paddingTop: 20 }}
          />
          {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
          {lineElements}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryLineChart;

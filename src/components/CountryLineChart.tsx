
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { processLineChartData } from "@/utils/countryComparison/dataProcessing";
import { getFullCountryName } from "@/components/CountrySelect";
import { useMarketData } from "@/hooks/useMarketData";
import { getBrandColor } from "@/utils/countryComparison/chartColors";
import { FONT_FAMILY } from "@/utils/constants";

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
  // Get market data for better standardization
  const { marketData } = useMarketData(Object.keys(allCountriesData));
  
  // Process data for chart
  const { chartData, years } = processLineChartData(
    allCountriesData, 
    selectedBrands, 
    standardized,
    marketData
  );
  
  // Create chart options
  const chartOptions = useMemo(() => {
    if (chartData.length === 0) return {};
    
    // Separate regular brands from "Market Average"
    const regularBrands: { brand: string; country: string; key: string }[] = [];
    const marketAverages: { brand: string; country: string; key: string }[] = [];
    
    // Process all data keys to identify brands and market averages
    chartData.forEach(point => {
      Object.keys(point).forEach(key => {
        if (key !== 'year' && key !== 'country' && point[key] !== undefined) {
          const [brand, country] = key.split('-');
          
          const combinationExists = regularBrands.concat(marketAverages).some(
            combo => combo.key === key
          );
          
          if (!combinationExists) {
            const newCombo = { brand, country, key };
            
            if (brand === "Market Average") {
              marketAverages.push(newCombo);
            } else {
              regularBrands.push(newCombo);
            }
          }
        }
      });
    });
    
    // Calculate domain for y-axis
    const allValues: number[] = [];
    chartData.forEach(point => {
      Object.keys(point).forEach(key => {
        if (key !== 'year' && key !== 'country' && point[key] !== null && typeof point[key] === 'number') {
          allValues.push(point[key] as number);
        }
      });
    });
    
    // Determine domain for y-axis
    let yMin, yMax;
    
    if (standardized) {
      // For standardized scores, use fixed domain of [-3, 3] standard deviations
      yMin = -3;
      yMax = 3;
    } else {
      // For raw scores, calculate from data with padding
      if (allValues.length === 0) {
        yMin = 0;
        yMax = 100;
      } else {
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        const range = maxValue - minValue;
        const padding = range * 0.1;
        yMin = Math.max(0, minValue - padding);
        yMax = maxValue + padding;
      }
    }
    
    // Create series for each brand-country combination
    const series: Highcharts.SeriesOptionsType[] = [];
    
    // Add regular brand series
    regularBrands.forEach(({ brand, country, key }) => {
      series.push({
        name: `${brand} (${getFullCountryName(country)})`,
        type: 'line',
        color: getBrandColor(brand),
        data: chartData
          .map(point => {
            const value = point[key];
            if (value === undefined || value === null) return null;
            return [point.year, value];
          })
          .filter(point => point !== null),
        marker: {
          enabled: true,
          radius: 4
        },
        lineWidth: 2
      });
    });
    
    // Add market average series with different style
    marketAverages.forEach(({ country, key }) => {
      series.push({
        name: `Market Average (${getFullCountryName(country)})`,
        type: 'line',
        color: '#34502b',
        dashStyle: 'Dash',
        data: chartData
          .map(point => {
            const value = point[key];
            if (value === undefined || value === null) return null;
            return [point.year, value];
          })
          .filter(point => point !== null),
        marker: {
          enabled: true,
          radius: 3,
          symbol: 'diamond'
        },
        lineWidth: 1.5
      });
    });
    
    return {
      chart: {
        type: 'line',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: standardized ? 
              'Standardized Brand Performance Across Countries' : 
              'Brand Performance Trends Across Countries',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        title: {
          text: 'Year'
        },
        labels: {
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        }
      },
      yAxis: {
        title: {
          text: standardized ? 'Standardized Score (σ)' : 'Score'
        },
        min: yMin,
        max: yMax,
        labels: {
          formatter: function() {
            return standardized ? 
              `${this.value}σ` : 
              `${this.value}`;
          },
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        plotLines: standardized ? [{
          value: 0,
          color: '#666',
          dashStyle: 'Dash',
          width: 1,
          label: {
            text: 'Market Average',
            align: 'right'
          }
        }] : undefined
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.series.name}</b><br>Year: ${this.x}<br>Value: ${standardized ? 
            `${this.y.toFixed(2)}σ` : 
            this.y.toFixed(2)}`;
        }
      },
      plotOptions: {
        line: {
          connectNulls: false
        }
      },
      legend: {
        enabled: true,
        itemStyle: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      credits: {
        enabled: false
      },
      series: series
    };
  }, [chartData, standardized]);
  
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }

  return (
    <div className="w-full h-[500px]">
      <h3 className="text-center text-lg font-medium text-[#34502b] mb-2">
        {standardized ? "Standardized Brand Performance Across Countries" : "Brand Performance Trends Across Countries"}
      </h3>
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
      />
    </div>
  );
};

export default CountryLineChart;

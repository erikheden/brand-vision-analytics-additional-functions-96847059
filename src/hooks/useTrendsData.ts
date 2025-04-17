
import { useState, useEffect, useMemo } from "react";
import { useMultiCountryMateriality } from "@/hooks/useMultiCountryMateriality";
import { MaterialityData } from "@/hooks/useGeneralMaterialityData";

export const useTrendsData = (
  selectedCountries: string[], 
  selectedAreas: string[]
) => {
  // Remove trendMode state and parameter
  const [focusedCountry, setFocusedCountry] = useState<string>("");
  
  // Fetch data for multiple countries
  const { 
    data: allCountriesData = {}, 
    isLoading, 
    error 
  } = useMultiCountryMateriality(selectedCountries);
  
  // Extract all areas from all countries' data
  const allAreas = useMemo(() => {
    const areasSet = new Set<string>();
    Object.values(allCountriesData).forEach(countryData => {
      countryData.forEach(item => areasSet.add(item.materiality_area));
    });
    return Array.from(areasSet).sort();
  }, [allCountriesData]);
  
  // Flatten data for area-focused trend
  const trendData = useMemo(() => {
    const combinedData: MaterialityData[] = [];
    Object.entries(allCountriesData).forEach(([country, data]) => {
      // Add country name to each data point
      data.forEach(item => {
        combinedData.push({
          ...item,
          materiality_area: `${item.materiality_area} (${country})`
        });
      });
    });
    return combinedData;
  }, [allCountriesData]);
  
  // Determine if we're using placeholder data
  const isPlaceholderData = useMemo(() => {
    return Object.values(allCountriesData).some(countryData => 
      countryData.length > 0 && countryData.every(item => !item.row_id)
    );
  }, [allCountriesData]);
  
  // Ensure focused country is valid
  useEffect(() => {
    if ((!focusedCountry || !selectedCountries.includes(focusedCountry)) && selectedCountries.length > 0) {
      setFocusedCountry(selectedCountries[0]);
    } else if (selectedCountries.length === 0) {
      setFocusedCountry("");
    }
  }, [selectedCountries, focusedCountry]);

  return {
    allCountriesData,
    focusedCountry,
    setFocusedCountry,
    allAreas,
    trendData,
    isPlaceholderData,
    isLoading,
    error
  };
};

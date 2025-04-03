
import { useState, useEffect, useMemo } from "react";
import { useMultiCountryMateriality } from "@/hooks/useMultiCountryMateriality";
import { MaterialityData } from "@/hooks/useGeneralMaterialityData";

export const useTrendsData = (selectedCountries: string[], selectedAreas: string[]) => {
  const [trendMode, setTrendMode] = useState<string>("countries");
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
  
  // Flatten data for the focused country or selected area
  const trendData = useMemo(() => {
    if (trendMode === "countries") {
      // For country-focused trend, return data for the focused country
      return focusedCountry && allCountriesData[focusedCountry] 
        ? allCountriesData[focusedCountry] 
        : [];
    } else {
      // For area-focused trend, combine data from all countries
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
    }
  }, [trendMode, focusedCountry, allCountriesData]);
  
  // Determine if we're using placeholder data
  const isPlaceholderData = useMemo(() => {
    return Object.values(allCountriesData).some(countryData => 
      countryData.length > 0 && countryData.every(item => !item.row_id)
    );
  }, [allCountriesData]);
  
  // When countries change, ensure focusedCountry is valid
  useEffect(() => {
    // If no country is focused but we have selected countries, set the first one as focused
    if ((!focusedCountry || !selectedCountries.includes(focusedCountry)) && selectedCountries.length > 0) {
      setFocusedCountry(selectedCountries[0]);
    }
    // If there are no selected countries, clear the focused country
    else if (selectedCountries.length === 0) {
      setFocusedCountry("");
    }
  }, [selectedCountries, focusedCountry]);

  return {
    allCountriesData,
    trendMode,
    setTrendMode,
    focusedCountry,
    setFocusedCountry,
    allAreas,
    trendData,
    isPlaceholderData,
    isLoading,
    error
  };
};


import { useState, useEffect } from 'react';
import { useSustainabilityImpactData } from '@/hooks/useSustainabilityImpactData';
import { useToast } from '@/components/ui/use-toast';
import { normalizeCountry } from '@/components/CountrySelect';

export const useImpactCategories = (selectedCountries: string[]) => {
  const { toast } = useToast();
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [countryDataMap, setCountryDataMap] = useState<Record<string, any>>({});

  // Initialize active countries when selectedCountries changes
  useEffect(() => {
    if (selectedCountries.length > 0) {
      const normalizedCountries = selectedCountries.map(country => normalizeCountry(country));
      setActiveCountries(normalizedCountries);
    } else {
      setActiveCountries([]);
    }
  }, [selectedCountries]);

  // Main data fetching for primary country (first active country)
  const {
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    getCountryData
  } = useSustainabilityImpactData(activeCountries[0] || "");

  // Fetch data for all active countries
  useEffect(() => {
    if (activeCountries.length > 0) {
      const fetchDataForAllCountries = async () => {
        const dataMap: Record<string, any> = {};
        
        for (const country of activeCountries) {
          try {
            const normalizedCountry = normalizeCountry(country);
            const { data: countryData, processedData: countryProcessedData } = 
              await getCountryData(normalizedCountry);
            
            dataMap[normalizedCountry] = {
              data: countryData,
              processedData: countryProcessedData
            };
            
            console.log(`Fetched data for country ${normalizedCountry}:`, 
              countryData ? countryData.length : 0, "rows");
            
            // Log some sample data to help debug
            if (countryProcessedData) {
              const sampleCategories = Object.keys(countryProcessedData).slice(0, 2);
              for (const cat of sampleCategories) {
                if (countryProcessedData[cat]) {
                  const years = Object.keys(countryProcessedData[cat]);
                  if (years.length > 0) {
                    const year = years[0];
                    const levels = Object.keys(countryProcessedData[cat][year]);
                    if (levels.length > 0) {
                      console.log(`Sample data for ${normalizedCountry}, ${cat}, ${year}, ${levels[0]}: 
                        ${countryProcessedData[cat][year][levels[0]]}`);
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.error(`Error fetching data for country ${country}:`, e);
          }
        }
        
        setCountryDataMap(dataMap);
      };
      
      fetchDataForAllCountries();
    } else {
      setCountryDataMap({});
    }
  }, [activeCountries, getCountryData]);

  // Auto-select first category when categories load
  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories([categories[0]]);
    }
  }, [categories]);

  // Auto-select most recent year when years data changes
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      const mostRecentYear = years[years.length - 1];
      setSelectedYear(mostRecentYear);
    }
  }, [years, selectedYear]);

  // Auto-select all impact levels when they load
  useEffect(() => {
    if (impactLevels.length > 0 && selectedLevels.length === 0) {
      setSelectedLevels([...impactLevels]);
    }
  }, [impactLevels]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleImpactLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  // Handle country selection
  const handleCountryChange = (country: string) => {
    setActiveCountries(prev => {
      const normalizedCountry = normalizeCountry(country);
      return prev.includes(normalizedCountry)
        ? prev.filter(c => c !== normalizedCountry)
        : [...prev, normalizedCountry];
    });
  };

  // Report any errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading impact data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return {
    activeCountries,
    selectedCategories,
    selectedYear,
    selectedLevels,
    data,
    processedData,
    countryDataMap,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    setActiveCountries,
    handleCountryChange,
    toggleCategory,
    setSelectedYear,
    toggleImpactLevel,
  };
};

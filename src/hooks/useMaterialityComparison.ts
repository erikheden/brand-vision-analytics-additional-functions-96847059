
import { useState, useEffect } from 'react';
import { useGeneralMaterialityData, MaterialityData } from '@/hooks/useGeneralMaterialityData';

export const useMaterialityComparison = (selectedCountries: string[]) => {
  const [allCountriesData, setAllCountriesData] = useState<Record<string, MaterialityData[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data for each country
  useEffect(() => {
    const fetchAllCountriesData = async () => {
      if (!selectedCountries.length) {
        setAllCountriesData({});
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const countryDataMap: Record<string, MaterialityData[]> = {};
        
        for (const country of selectedCountries) {
          // Use the existing hook for each country
          const { data, isLoading: countryLoading, error: countryError } = useGeneralMaterialityData(country);
          
          // Wait for data to be ready
          if (!countryLoading && !countryError && data) {
            countryDataMap[country] = data;
          }
          
          // Handle errors
          if (countryError) {
            console.error(`Error fetching data for ${country}:`, countryError);
          }
        }

        setAllCountriesData(countryDataMap);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error in useMaterialityComparison:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCountriesData();
  }, [selectedCountries]);

  return { allCountriesData, isLoading, error };
};

export default useMaterialityComparison;

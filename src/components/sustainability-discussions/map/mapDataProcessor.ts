
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { getFullCountryName } from "@/components/CountrySelect";
import { countryCodeMapping, countyDetails } from "./countryMapping";

export interface MapDataItem {
  name: string;
  value: number;
  "hc-key"?: string;
  lat?: number;
  lon?: number;
  z?: number;
  countryCode?: string;
  countyLevel?: boolean;
  realCountyData?: boolean;
}

export const processMapData = (
  filteredData: DiscussionTopicData[]
): MapDataItem[] => {
  const result: MapDataItem[] = [];
  
  // Group by country
  const countryGroups = filteredData.reduce((acc, item) => {
    if (!acc[item.country]) {
      acc[item.country] = [];
    }
    acc[item.country].push(item);
    return acc;
  }, {} as Record<string, DiscussionTopicData[]>);
  
  // Calculate average percentage for each country
  Object.entries(countryGroups).forEach(([country, items]) => {
    // Get the highcharts country code, using a case-insensitive approach
    const hcKey = countryCodeMapping[country] || country.toLowerCase();
    
    const avgPercentage = items.reduce((sum, item) => sum + (item.percentage || 0), 0) / items.length;
    
    // Main country data
    result.push({
      "hc-key": hcKey,
      value: avgPercentage,
      name: getFullCountryName(country),
      countryCode: country,
    });
    
    // Also collect actual county data from our dataset if available
    const countyData = new Map<string, number>();
    
    // Collect all real county data from the dataset
    items.forEach(item => {
      // Check if geography property exists and is different from country
      if (item.geography && item.geography !== item.country) {
        // If we have real county geography data, use it
        countyData.set(item.geography, item.percentage || 0);
      }
    });
    
    // First try to use actual county data if available
    if (countyData.size > 0) {
      // Use the real county data from the dataset
      countyData.forEach((percentage, countyName) => {
        // Find a match in our predefined county list to get coordinates
        const predefinedCounty = countyDetails[hcKey]?.find(c => 
          countyName.toLowerCase().includes(c.name.toLowerCase()) || 
          c.name.toLowerCase().includes(countyName.toLowerCase())
        );
        
        const lat = predefinedCounty?.lat || (Math.random() * 5 + 55); // Fallback with random position
        const lon = predefinedCounty?.lon || (Math.random() * 5 + 10); // Fallback with random position
        
        result.push({
          name: countyName,
          lat: lat,
          lon: lon,
          z: percentage, // For bubble size
          value: percentage,
          countryCode: country,
          countyLevel: true,
          realCountyData: true // Flag to identify real county data
        });
      });
    } else {
      // Fall back to our predefined counties with simulated values
      if (countyDetails[hcKey]) {
        countyDetails[hcKey].forEach(county => {
          // Create a slightly different value for each county to show variation
          // Using a random factor to simulate county-level differences
          const countyValue = avgPercentage * (0.85 + Math.random() * 0.3);
          
          result.push({
            name: county.name,
            lat: county.lat,
            lon: county.lon,
            z: countyValue, // For bubble size
            value: countyValue,
            countryCode: country,
            countyLevel: true
          });
        });
      }
    }
  });
  
  return result;
};

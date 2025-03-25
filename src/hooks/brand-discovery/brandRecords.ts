
/**
 * Gets unique brand records for common normalized brand names
 */
export function getUniqueBrandRecords(
  normalizedNames: string[],
  selectedCountries: string[],
  brandRecordsByCountry: Map<string, Map<string, any[]>>
): Map<string, any> {
  const uniqueRecords = new Map<string, any>();
  
  // For each common normalized brand name, find all matching brand records
  normalizedNames.forEach(normalizedName => {
    selectedCountries.forEach(country => {
      const countryRecords = brandRecordsByCountry.get(country)?.get(normalizedName) || [];
      
      if (countryRecords.length > 0) {
        // If multiple records exist for this brand in this country, use the one with highest score
        const bestRecord = countryRecords.reduce((best, current) => {
          return (!best.Score || (current.Score && current.Score > best.Score)) ? current : best;
        }, countryRecords[0]);
        
        const key = `${normalizedName}-${country}`;
        uniqueRecords.set(key, bestRecord);
      }
    });
  });
  
  console.log(`Found ${uniqueRecords.size} unique brand records across countries`);
  return uniqueRecords;
}

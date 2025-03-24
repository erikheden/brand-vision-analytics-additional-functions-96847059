
/**
 * Gets unique brand records based on normalized brand names
 */
export const getUniqueBrandRecords = (
  normalizedNames: string[],
  selectedCountries: string[],
  brandRecordsByCountry: Map<string, Map<string, any[]>>
): Map<string, any> => {
  const uniqueRecords = new Map<string, any>();
  
  normalizedNames.forEach(normalizedName => {
    // Try to find a good representative record for this brand
    let bestRecord: any = null;
    
    // First, try to find a record from any country that has a proper Score
    for (const country of selectedCountries) {
      const countryRecords = brandRecordsByCountry.get(country)?.get(normalizedName) || [];
      
      // Find a record with non-null score from this country
      const recordWithScore = countryRecords.find(record => 
        record.Score !== null && record.Score !== 0
      );
      
      if (recordWithScore) {
        bestRecord = recordWithScore;
        break;
      }
    }
    
    // If no record with score found, just use the first record we find
    if (!bestRecord) {
      for (const country of selectedCountries) {
        const countryRecords = brandRecordsByCountry.get(country)?.get(normalizedName) || [];
        
        if (countryRecords.length > 0) {
          bestRecord = countryRecords[0];
          break;
        }
      }
    }
    
    // If we found a representative record, add it to our results
    if (bestRecord) {
      uniqueRecords.set(normalizedName, bestRecord);
    }
  });
  
  return uniqueRecords;
};

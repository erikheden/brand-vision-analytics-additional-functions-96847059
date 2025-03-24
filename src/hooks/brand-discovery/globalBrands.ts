
import { normalizeBrandName } from "@/utils/industry/brandNormalization";

/**
 * Adds well-known global brands to the results even if they weren't naturally found
 */
export const addWellKnownGlobalBrands = (
  uniqueRecords: Map<string, any>,
  selectedCountries: string[],
  availableBrands: any[],
  forceAdd: boolean = false
): any[] => {
  // No global brands to add, just return the existing records
  return Array.from(uniqueRecords.values());
};

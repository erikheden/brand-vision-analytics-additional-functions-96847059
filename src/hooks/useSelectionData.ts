
import { BrandData } from "@/types/brand";
import { useCountriesQuery } from "./queries/useCountriesQuery";
import { useIndustriesQuery } from "./queries/useIndustriesQuery";
import { useBrandsQuery } from "./queries/useBrandsQuery";

export const useSelectionData = (selectedCountry: string | string[], selectedIndustries: string[]) => {
  // Use the extracted query hooks
  const { data: countries = [], error: countriesError } = useCountriesQuery();
  
  // Log countries error if present
  if (countriesError) {
    console.error("Countries query error:", countriesError);
  }

  const { data: industries = [] } = useIndustriesQuery(selectedCountry);
  const { data: brands = [] } = useBrandsQuery(selectedCountry, selectedIndustries);

  return { countries, industries, brands };
};

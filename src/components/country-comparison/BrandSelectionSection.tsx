
import { CircleCheck, AlertTriangle, Info } from "lucide-react";
import BrandSelection from "../BrandSelection";
import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";

interface BrandSelectionSectionProps {
  uniqueBrandNames: string[];
  selectedBrands: string[];
  selectedCountries: string[];
  brandsWithDataInfo?: Record<string, { hasData: boolean, countries: string[] }>;
  onBrandToggle: (brand: string, checked: boolean) => void;
  onClearBrands: () => void;
}

const BrandSelectionSection = ({
  uniqueBrandNames,
  selectedBrands,
  selectedCountries,
  brandsWithDataInfo = {},
  onBrandToggle,
  onClearBrands
}: BrandSelectionSectionProps) => {
  // Log the brand names to help debug capitalization issues
  console.log("Brand selection section - unique brand names:", uniqueBrandNames);
  
  // Count brands that have data across multiple countries
  const brandsWithData = Object.values(brandsWithDataInfo).filter(info => info.hasData).length;
  
  // Check if using fallback brands (our standard list of common brands)
  const usingFallbackBrands = uniqueBrandNames.length >= 10 && 
    uniqueBrandNames.includes("McDonald's") && 
    uniqueBrandNames.includes("Coca-Cola");
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium flex items-center gap-2 text-[#34502b]">
        <CircleCheck className="h-5 w-5" />
        Select Brands to Compare
      </h3>
      <div className="mt-2">
        {uniqueBrandNames.length > 0 ? (
          <>
            {selectedCountries.length >= 2 && (
              <div className="mb-4 text-blue-600 bg-blue-50 p-4 rounded-md flex items-start gap-2">
                <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Common brands across selected markets</p>
                  <p className="text-sm mt-1">
                    Showing {uniqueBrandNames.length} brands that exist in {selectedCountries.length > 1 ? "all" : "the"} selected {selectedCountries.length === 1 ? "country" : "countries"}.
                    {brandsWithData > 0 && ` ${brandsWithData} of these brands have comparable data.`}
                  </p>
                </div>
              </div>
            )}
            <BrandSelection
              brands={uniqueBrandNames}
              selectedBrands={selectedBrands}
              selectedCountries={selectedCountries}
              brandsWithDataInfo={brandsWithDataInfo}
              onBrandToggle={onBrandToggle}
              onClearBrands={onClearBrands}
            />
          </>
        ) : selectedCountries.length > 1 ? (
          <div className="text-amber-600 bg-amber-50 p-4 rounded-md flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">No common brands found</p>
              <p className="text-sm mt-1">
                We couldn't find any brands that exist across all the selected countries. 
                Try selecting fewer countries or different combinations.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 p-4 border border-dashed border-gray-300 rounded-md text-center">
            Select at least one country to see available brands.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandSelectionSection;

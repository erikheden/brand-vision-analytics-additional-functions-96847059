
import BrandSelection from "../BrandSelection";
import BrandSectionHeader from "./BrandSectionHeader";
import InfoMessage from "./InfoMessage";
import NoBrandsAlert from "./NoBrandsAlert";
import EmptyStateMessage from "./EmptyStateMessage";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";

interface BrandSelectionSectionProps {
  uniqueBrandNames: string[];
  selectedBrands: string[];
  selectedCountries: string[];
  brandsWithDataInfo?: Record<string, { hasData: boolean, countries: string[] }>;
  onBrandToggle: (brand: string, checked: boolean) => void;
  onBatchToggle?: (brands: string[], checked: boolean) => void;
  onClearBrands: () => void;
}

const BrandSelectionSection = ({
  uniqueBrandNames,
  selectedBrands,
  selectedCountries,
  brandsWithDataInfo = {},
  onBrandToggle,
  onBatchToggle,
  onClearBrands
}: BrandSelectionSectionProps) => {
  // Log the brand names to help debug capitalization issues
  console.log("Brand selection section - unique brand names:", uniqueBrandNames);
  
  // Count brands that have data across multiple countries
  const brandsWithData = Object.values(brandsWithDataInfo).filter(info => info.hasData).length;
  
  // Check if using fallback brands (our standard list of common brands)
  const usingFallbackBrands = uniqueBrandNames.length >= 10 && 
    uniqueBrandNames.some(brand => normalizeBrandName(brand) === normalizeBrandName("McDonald's")) && 
    uniqueBrandNames.some(brand => normalizeBrandName(brand) === normalizeBrandName("Coca-Cola"));
  
  return (
    <div className="space-y-2">
      <BrandSectionHeader />
      <div className="mt-2">
        {uniqueBrandNames.length > 0 ? (
          <>
            {selectedCountries.length >= 2 && (
              <InfoMessage 
                uniqueBrandCount={uniqueBrandNames.length} 
                brandsWithData={brandsWithData} 
              />
            )}
            <BrandSelection
              brands={uniqueBrandNames}
              selectedBrands={selectedBrands}
              selectedCountries={selectedCountries}
              brandsWithDataInfo={brandsWithDataInfo}
              onBrandToggle={onBrandToggle}
              onBatchToggle={onBatchToggle}
              onClearBrands={onClearBrands}
            />
          </>
        ) : selectedCountries.length > 1 ? (
          <NoBrandsAlert />
        ) : (
          <EmptyStateMessage />
        )}
      </div>
    </div>
  );
};

export default BrandSelectionSection;


import BrandSelection from "../BrandSelection";
import CompactBrandSectionHeader from "./CompactBrandSectionHeader";
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
  
  // Determine what content to show based on available brands and selected countries
  const renderBrandSelection = () => {
    if (uniqueBrandNames.length > 0) {
      return (
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
      );
    } else if (selectedCountries.length > 1) {
      return <NoBrandsAlert />;
    } else {
      return <EmptyStateMessage />;
    }
  };
  
  return (
    <div className="space-y-2">
      <CompactBrandSectionHeader />
      <div className="mt-2">
        {renderBrandSelection()}
      </div>
    </div>
  );
};

export default BrandSelectionSection;

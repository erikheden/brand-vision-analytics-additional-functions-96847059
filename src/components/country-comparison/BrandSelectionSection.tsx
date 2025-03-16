
import { CircleCheck } from "lucide-react";
import BrandSelection from "../BrandSelection";
import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";

interface BrandSelectionSectionProps {
  uniqueBrandNames: string[];
  selectedBrands: string[];
  selectedCountries: string[];
  onBrandToggle: (brand: string, checked: boolean) => void;
  onClearBrands: () => void;
}

const BrandSelectionSection = ({
  uniqueBrandNames,
  selectedBrands,
  selectedCountries,
  onBrandToggle,
  onClearBrands
}: BrandSelectionSectionProps) => {
  // Log the brand names to help debug capitalization issues
  console.log("Brand selection section - unique brand names:", uniqueBrandNames);
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium flex items-center gap-2 text-[#34502b]">
        <CircleCheck className="h-5 w-5" />
        Select Brands to Compare
      </h3>
      <div className="mt-2">
        <BrandSelection
          brands={uniqueBrandNames}
          selectedBrands={selectedBrands}
          onBrandToggle={onBrandToggle}
          onClearBrands={onClearBrands}
        />
      </div>
      {selectedCountries.length > 1 && uniqueBrandNames.length === 0 && (
        <div className="text-amber-600 bg-amber-50 p-3 rounded-md text-sm mt-2">
          No common brands found across the selected countries. Try different country combinations.
        </div>
      )}
    </div>
  );
};

export default BrandSelectionSection;

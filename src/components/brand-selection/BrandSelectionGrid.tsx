
import BrandCheckbox from "@/components/BrandCheckbox";

interface BrandSelectionGridProps {
  filteredBrands: string[];
  selectedBrands: string[];
  brandsWithDataInfo?: Record<string, { hasData: boolean, countries: string[] }>;
  onBrandToggle: (brand: string, checked: boolean) => void;
}

const BrandSelectionGrid = ({
  filteredBrands,
  selectedBrands,
  brandsWithDataInfo = {},
  onBrandToggle
}: BrandSelectionGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-6 max-h-[300px] overflow-y-auto">
      {filteredBrands.map((brand) => {
        const dataInfo = brandsWithDataInfo[brand];
        const hasData = !dataInfo || dataInfo.hasData;
        
        return (
          <div key={brand} className="flex items-center">
            <BrandCheckbox
              brand={brand}
              isChecked={selectedBrands.includes(brand)}
              onCheckedChange={(checked) => onBrandToggle(brand, checked)}
              className={!hasData ? "opacity-70" : ""}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BrandSelectionGrid;

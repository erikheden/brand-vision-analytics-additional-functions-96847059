
import { Label } from "@/components/ui/label";
import SelectAllButton from "./SelectAllButton";

interface BrandSelectionHeaderProps {
  filteredBrandsCount: number;
  selectedVisibleBrandsCount: number;
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  onSelectAll: () => void;
}

const BrandSelectionHeader = ({
  filteredBrandsCount,
  selectedVisibleBrandsCount,
  allVisibleSelected,
  someVisibleSelected,
  onSelectAll
}: BrandSelectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Label>Select Brands</Label>
      <div className="flex gap-2 items-center">
        <span className="text-xs text-muted-foreground">
          {filteredBrandsCount} brands total
          {selectedVisibleBrandsCount > 0 && ` (${selectedVisibleBrandsCount} selected)`}
        </span>
        <SelectAllButton 
          allVisibleSelected={allVisibleSelected}
          someVisibleSelected={someVisibleSelected}
          onClick={onSelectAll}
        />
      </div>
    </div>
  );
};

export default BrandSelectionHeader;

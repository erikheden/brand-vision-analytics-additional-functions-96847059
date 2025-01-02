import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BrandCheckboxProps {
  brand: string;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const BrandCheckbox = ({ brand, isChecked, onCheckedChange }: BrandCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={brand}
        checked={isChecked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={brand} className="truncate">{brand}</Label>
    </div>
  );
};

export default BrandCheckbox;
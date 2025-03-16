
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BrandCheckboxProps {
  brand: string;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string; // Add optional className prop
}

const BrandCheckbox = ({ 
  brand, 
  isChecked, 
  onCheckedChange,
  className 
}: BrandCheckboxProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
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

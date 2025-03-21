
import { CircleCheck } from "lucide-react";

interface CompactBrandSectionHeaderProps {
  title?: string;
  showIcon?: boolean;
}

/**
 * A more compact and reusable version of the brand section header
 * that allows customization of the title and icon visibility
 */
const CompactBrandSectionHeader = ({ 
  title = "Select Brands to Compare",
  showIcon = true
}: CompactBrandSectionHeaderProps) => {
  return (
    <h3 className="text-lg font-medium flex items-center gap-2 text-[#34502b]">
      {showIcon && <CircleCheck className="h-5 w-5" />}
      {title}
    </h3>
  );
};

export default CompactBrandSectionHeader;

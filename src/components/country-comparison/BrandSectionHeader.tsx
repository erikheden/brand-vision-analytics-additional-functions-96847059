
import { CircleCheck } from "lucide-react";

const BrandSectionHeader = () => {
  return (
    <h3 className="text-lg font-medium flex items-center gap-2 text-[#34502b]">
      <CircleCheck className="h-5 w-5" />
      Select Brands to Compare
    </h3>
  );
};

export default BrandSectionHeader;

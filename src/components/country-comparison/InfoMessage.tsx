
import { Info } from "lucide-react";

interface InfoMessageProps {
  uniqueBrandCount: number;
  brandsWithData: number;
}

const InfoMessage = ({ uniqueBrandCount, brandsWithData }: InfoMessageProps) => {
  return (
    <div className="mb-4 text-blue-600 bg-blue-50 p-4 rounded-md flex items-start gap-2">
      <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">Common brands across selected markets</p>
        <p className="text-sm mt-1">
          Showing {uniqueBrandCount} brands that exist in at least 2 selected countries.
          {brandsWithData > 0 && ` ${brandsWithData} of these brands have comparable data.`}
        </p>
      </div>
    </div>
  );
};

export default InfoMessage;

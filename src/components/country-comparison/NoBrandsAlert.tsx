
import { AlertTriangle } from "lucide-react";

const NoBrandsAlert = () => {
  return (
    <div className="text-amber-600 bg-amber-50 p-4 rounded-md flex items-start gap-2">
      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">No common brands found</p>
        <p className="text-sm mt-1">
          We couldn't find any brands that exist across the selected countries. 
          Try selecting fewer countries or different combinations.
        </p>
      </div>
    </div>
  );
};

export default NoBrandsAlert;

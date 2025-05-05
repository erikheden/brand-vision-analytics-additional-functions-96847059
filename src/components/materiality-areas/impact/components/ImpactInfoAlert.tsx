
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const ImpactInfoAlert: React.FC = () => {
  return (
    <Alert className="bg-white border border-[#34502b]/20">
      <Info className="h-4 w-4" />
      <AlertDescription className="text-gray-600 text-sm">
        <strong>Understanding impact levels:</strong> "Aware" indicates basic recognition, "Concerned" shows engagement, and "Willing to pay" represents the strongest commitment to sustainability.
      </AlertDescription>
    </Alert>
  );
};

export default ImpactInfoAlert;


import React from "react";
import { Card } from "@/components/ui/card";

const EmptySelection: React.FC = () => {
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="text-center py-10 text-gray-500">
        Please select at least one country to view sustainability knowledge data.
      </div>
    </Card>
  );
};

export default EmptySelection;

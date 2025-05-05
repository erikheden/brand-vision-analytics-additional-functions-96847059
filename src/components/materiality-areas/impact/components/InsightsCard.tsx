
import React from "react";
import { Card } from "@/components/ui/card";

interface InsightsCardProps {
  insightText: string;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ insightText }) => {
  return (
    <Card className="p-4 bg-[#f1f0fb] border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <h3 className="text-lg font-medium text-[#34502b] mb-2">Key Insights</h3>
      <p className="text-gray-600 text-sm">
        {insightText}
      </p>
    </Card>
  );
};

export default InsightsCard;

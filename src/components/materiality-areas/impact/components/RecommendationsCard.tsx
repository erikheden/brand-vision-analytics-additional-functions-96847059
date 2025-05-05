
import React from "react";
import { Card } from "@/components/ui/card";

interface RecommendationsCardProps {
  recommendations: string[];
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  return (
    <Card className="p-4 bg-[#f1f0fb] border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <h3 className="text-lg font-medium text-[#34502b] mb-2">Recommendations</h3>
      <ul className="text-gray-600 text-sm space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex gap-2">
            <span>•</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default RecommendationsCard;

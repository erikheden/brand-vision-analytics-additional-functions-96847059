
import React from "react";
import { Card } from "@/components/ui/card";

export const LoadingState: React.FC = () => (
  <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
    <div className="text-center py-12">
      <div className="animate-pulse text-[#34502b]">Loading impact data...</div>
    </div>
  </Card>
);

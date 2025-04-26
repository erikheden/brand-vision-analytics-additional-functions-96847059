
import React from 'react';
import { Card } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <Card className="p-6 h-[300px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#34502b] mx-auto"></div>
        <p className="mt-4 text-[#34502b]">Loading impact data...</p>
      </div>
    </Card>
  );
};

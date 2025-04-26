
import React from "react";
import { Card } from "@/components/ui/card";

interface ErrorStateProps {
  error: any;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
    <div className="text-center py-12 text-red-500">
      Error loading data: {error instanceof Error ? error.message : "Unknown error"}
    </div>
  </Card>
);


import React from "react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
    <div className="text-center py-12 text-gray-500">
      {message}
    </div>
  </Card>
);

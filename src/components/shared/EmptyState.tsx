
import React from "react";
import { Card } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Selected",
  message,
  icon = <ChevronUp className="h-6 w-6" />
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#34502b]/10 text-[#34502b]">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-[#34502b]">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
    </Card>
  );
};

export default EmptyState;

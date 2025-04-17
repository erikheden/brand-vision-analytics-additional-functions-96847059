
import React, { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface DashboardLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-4">{title}</h1>
      
      {description && (
        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-6">
          <p className="text-gray-600">{description}</p>
        </Card>
      )}
      
      {children}
    </div>
  );
};

export default DashboardLayout;

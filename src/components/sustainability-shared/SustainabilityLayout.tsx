
import React from "react";
import { Card } from "@/components/ui/card";
import DashboardLayout from "../layout/DashboardLayout";

interface SustainabilityLayoutProps {
  title: string;
  description: string;
  selectionPanel: React.ReactNode;
  children: React.ReactNode;
}

const SustainabilityLayout: React.FC<SustainabilityLayoutProps> = ({
  title,
  description,
  selectionPanel,
  children,
}) => {
  return (
    <DashboardLayout title={title} description={description}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          {selectionPanel}
        </div>
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SustainabilityLayout;


import React from "react";
import EmptyState from "../shared/EmptyState";
import { ChartBar } from "lucide-react";

const EmptySelection: React.FC = () => {
  return (
    <EmptyState
      title="No Countries Selected"
      message="Please select one or more countries to view sustainability influence insights."
      icon={<ChartBar className="h-6 w-6" />}
    />
  );
};

export default EmptySelection;

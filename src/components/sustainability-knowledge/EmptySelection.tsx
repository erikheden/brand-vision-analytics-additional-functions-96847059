
import React from "react";
import EmptyState from "../shared/EmptyState";
import { LineChart } from "lucide-react";

const EmptySelection: React.FC = () => {
  return (
    <EmptyState
      title="No Data Selected"
      message="Please select one or more countries to view sustainability knowledge insights."
      icon={<LineChart className="h-6 w-6" />}
    />
  );
};

export default EmptySelection;


import React from "react";
import EmptyState from "../shared/EmptyState";
import { Globe } from "lucide-react";

const EmptySelection: React.FC = () => {
  return (
    <EmptyState
      title="No Countries Selected"
      message="Please select one or more countries above to view sustainability knowledge data."
      icon={<Globe className="h-6 w-6" />}
    />
  );
};

export default EmptySelection;

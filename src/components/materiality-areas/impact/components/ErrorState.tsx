
import React from 'react';
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: Error | null;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Card className="p-6 bg-white border-2 border-red-200 rounded-xl shadow-md">
      <div className="text-center py-10 text-red-500 flex flex-col items-center">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="font-semibold">Error loading impact data</p>
        <p className="text-sm mt-2">{error?.message || 'An unknown error occurred'}</p>
      </div>
    </Card>
  );
};

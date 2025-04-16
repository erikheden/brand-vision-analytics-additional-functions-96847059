
import React from 'react';
import { Card } from '@/components/ui/card';

export const LoadingState: React.FC = () => (
  <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
    <div className="text-center py-10 text-gray-500">
      Loading knowledge data for selected countries...
    </div>
  </Card>
);

export const EmptyState: React.FC = () => (
  <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
    <div className="text-center py-10 text-gray-500">
      No knowledge data available for the selected countries.
    </div>
  </Card>
);


import React from 'react';
import { Card } from '@/components/ui/card';

const ErrorState: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Discussions</h1>
      <Card className="p-6 bg-white border-2 border-red-200 rounded-xl shadow-md">
        <div className="text-center py-10 text-red-500">
          Error loading discussion topics data. Please try again later.
        </div>
      </Card>
    </div>
  );
};

export default ErrorState;

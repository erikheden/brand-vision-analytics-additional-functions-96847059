
import React from 'react';
import { Card } from '@/components/ui/card';

interface TrendsDescriptionProps {
  description: string;
}

const TrendsDescription: React.FC<TrendsDescriptionProps> = ({ description }) => {
  return (
    <Card className="p-4 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 rounded-xl shadow-md mb-4">
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};

export default TrendsDescription;

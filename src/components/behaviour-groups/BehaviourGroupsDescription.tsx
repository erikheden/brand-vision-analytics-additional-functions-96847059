
import React from "react";
import { Card } from "@/components/ui/card";

const BehaviourGroupsDescription = () => {
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-[#34502b]">
        Understanding Sustainability Behaviour Groups
      </h3>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 p-4 border rounded-md border-[#FF8042]/30 bg-[#FF8042]/5">
            <h4 className="text-base font-semibold mb-2 text-[#FF8042]">Ego</h4>
            <p className="text-sm text-gray-600">
              This group tends to prioritize personal needs and convenience over sustainability considerations. 
              They're less likely to make purchasing decisions based on environmental or social impact.
            </p>
          </div>
          <div className="flex-1 p-4 border rounded-md border-[#FFBB28]/30 bg-[#FFBB28]/5">
            <h4 className="text-base font-semibold mb-2 text-[#FFBB28]">Moderate</h4>
            <p className="text-sm text-gray-600">
              Moderates have awareness of sustainability issues but take limited action. 
              They may occasionally choose sustainable options but are not consistently motivated by sustainability factors.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 p-4 border rounded-md border-[#00C49F]/30 bg-[#00C49F]/5">
            <h4 className="text-base font-semibold mb-2 text-[#00C49F]">Smart</h4>
            <p className="text-sm text-gray-600">
              Smart consumers actively seek sustainable options and regularly consider environmental impact in their 
              purchasing decisions. They're knowledgeable about sustainability issues and willing to pay more for sustainable products.
            </p>
          </div>
          <div className="flex-1 p-4 border rounded-md border-[#0088FE]/30 bg-[#0088FE]/5">
            <h4 className="text-base font-semibold mb-2 text-[#0088FE]">Dedicated</h4>
            <p className="text-sm text-gray-600">
              The most sustainability-focused group, Dedicated consumers make sustainability a primary factor in most of their 
              decisions. They're willing to make sacrifices for environmental and social causes, and actively advocate for 
              sustainable practices.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BehaviourGroupsDescription;

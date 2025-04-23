
import React from "react";
import MainContent from "@/components/sustainability-knowledge/MainContent";
import { KnowledgePageProvider } from "@/components/sustainability-knowledge/KnowledgePageProvider";

const SustainabilityKnowledge = () => {
  return (
    <KnowledgePageProvider>
      <MainContent />
    </KnowledgePageProvider>
  );
};

export default SustainabilityKnowledge;

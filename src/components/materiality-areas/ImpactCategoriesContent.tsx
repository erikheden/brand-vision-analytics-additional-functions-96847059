
import React from "react";
import ImpactContent from "./impact/ImpactContent";

interface ImpactCategoriesContentProps {
  selectedCountries: string[];
}

const ImpactCategoriesContent: React.FC<ImpactCategoriesContentProps> = ({ 
  selectedCountries = [] 
}) => {
  return <ImpactContent selectedCountries={selectedCountries} />;
};

export default ImpactCategoriesContent;

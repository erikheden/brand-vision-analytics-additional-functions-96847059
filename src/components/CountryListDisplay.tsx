
import React from "react";

interface CountryListDisplayProps {
  countries: string[];
  selectedBrands: string[];
}

const CountryListDisplay: React.FC<CountryListDisplayProps> = ({ 
  countries, 
  selectedBrands 
}) => {
  return (
    <div className="mt-6 mb-2 text-sm text-center text-[#34502b]/80 px-4">
      Comparing {selectedBrands.length} brand{selectedBrands.length !== 1 ? "s" : ""} across {countries.length} countr{countries.length !== 1 ? "ies" : "y"}:
      <p className="font-medium mt-2 text-[#34502b]">{countries.join(", ")}</p>
    </div>
  );
};

export default CountryListDisplay;

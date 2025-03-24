
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useMultiCountryChartData } from "@/hooks/useMultiCountryChartData";

interface BrandMatchingInfoProps {
  selectedCountries: string[];
  selectedBrands: string[];
}

const BrandMatchingInfo = ({ selectedCountries, selectedBrands }: BrandMatchingInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: countriesData, isLoading } = useMultiCountryChartData(selectedCountries, selectedBrands);
  
  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Loading brand matching data...
      </div>
    );
  }
  
  if (!countriesData || Object.keys(countriesData).length === 0) {
    return null;
  }
  
  // Create a mapping of brands across countries
  const brandMatching = selectedBrands.map(brand => {
    const countryMatches = selectedCountries.map(country => {
      const countryData = countriesData[country];
      if (!countryData) return { country, matched: false, matchMethod: null };
      
      const brandMatch = countryData.find(item => item.Brand === brand);
      return { 
        country, 
        matched: !!brandMatch, 
        matchMethod: brandMatch?.matchMethod || null,
        originalBrand: brandMatch?.OriginalBrand || null
      };
    });
    
    return {
      brand,
      matches: countryMatches,
      matchCount: countryMatches.filter(m => m.matched).length
    };
  });
  
  return (
    <div className="mt-2 bg-slate-50 rounded-md border p-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-500" />
              <span className="font-medium text-sm">
                Brand Matching Information
              </span>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="text-sm text-muted-foreground mb-2">
            This table shows which brands were successfully matched in each country and the matching method used.
          </div>
          
          <div className="rounded-md border overflow-auto max-h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Countries Matched</TableHead>
                  {selectedCountries.map(country => (
                    <TableHead key={country}>{country}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {brandMatching.map(item => (
                  <TableRow key={item.brand}>
                    <TableCell className="font-medium">{item.brand}</TableCell>
                    <TableCell>{item.matchCount} of {selectedCountries.length}</TableCell>
                    {item.matches.map(match => (
                      <TableCell key={`${item.brand}-${match.country}`} className="whitespace-nowrap">
                        {match.matched ? (
                          <div>
                            <span className="text-green-600">✓</span>
                            {match.originalBrand && match.originalBrand !== item.brand && (
                              <div className="text-xs text-slate-500">
                                as: {match.originalBrand}
                              </div>
                            )}
                            {match.matchMethod && (
                              <div className="text-xs text-slate-500">
                                via: {match.matchMethod}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default BrandMatchingInfo;

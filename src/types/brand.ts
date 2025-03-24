
// Define the possible match types that can be used in brand data
export type MatchType = "exact" | "normalized" | "partial" | "special" | "average" | "sql-match";

// Base brand data interface with common properties
export interface BrandData {
  "Row ID": number;
  Year: number | null;
  Brand: string;
  Country: string | null;
  Score: number | null;
  industry: string | null;
  OriginalBrand?: string;
  matchType?: MatchType;
  isMarketAverage?: boolean;
  Projected?: boolean;
}

// Specific interface for market average data
export interface AverageMatchBrand extends BrandData {
  matchType: "average";
  isMarketAverage: true;
}

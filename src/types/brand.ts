
export interface BrandData {
  Brand: string | null;
  Country: string | null;
  industry: string | null;
  "Row ID": number;
  Score: number | null;
  Year: number | null;
  Projected?: boolean;
  
  // Fields for brand matching
  OriginalBrand?: string | null;
  isMarketAverage?: boolean;
  matchType?: "exact" | "normalized" | "partial" | "special" | "average" | null;
}

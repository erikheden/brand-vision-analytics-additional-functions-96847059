
export interface BaseBrandData {
  Brand: string | null;
  Country: string | null;
  industry: string | null;
  "Row ID": number;
  Score: number | null;
  Year: number | null;
  Projected?: boolean;
  isMarketAverage?: boolean;
}

// Define specific types for each match type
export interface ExactMatchBrand extends BaseBrandData {
  matchType: "exact";
}

export interface NormalizedMatchBrand extends BaseBrandData {
  matchType: "normalized";
  OriginalBrand: string | null;
}

export interface PartialMatchBrand extends BaseBrandData {
  matchType: "partial";
  OriginalBrand: string | null;
}

export interface SpecialMatchBrand extends BaseBrandData {
  matchType: "special";
  OriginalBrand: string | null;
}

export interface AverageMatchBrand extends BaseBrandData {
  matchType: "average";
  OriginalBrand: string | null;
}

// Union type for all possible brand data variants
export type BrandData = 
  | ExactMatchBrand 
  | NormalizedMatchBrand 
  | PartialMatchBrand 
  | SpecialMatchBrand 
  | AverageMatchBrand
  | (BaseBrandData & { matchType?: null });

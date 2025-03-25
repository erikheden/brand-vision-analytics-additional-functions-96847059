
import { BrandData as CoreBrandData } from "@/types/brand";

export interface BrandScore {
  brand: string;
  score: number;
  year: number;
  industry: string | null;
}

export interface BrandDataSimple {
  Year: number;
  Brand: string;
  Score: number;
  Country: string;
  industry?: string | null;
  "Row ID"?: number;
  Projected?: boolean;
}

export type IndustryAverages = Record<number, Record<string, number>>;

// Re-export BrandData from core types to avoid conflicts
export type BrandData = CoreBrandData;

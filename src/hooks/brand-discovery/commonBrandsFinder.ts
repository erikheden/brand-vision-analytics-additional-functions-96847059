
// This file is kept for backward compatibility
// It re-exports the functions from the new modular files

import { findMultiCountryBrands } from './findCommonBrands';
import { levenshteinDistance } from './brandMatching';
import { addWellKnownGlobalBrands } from './globalBrands';
import { findBrandIntersection, findBrandsInMultipleCountries } from './brandIntersection';
import { getUniqueBrandRecords } from './brandRecords';

// Re-export for backward compatibility
export { 
  findMultiCountryBrands,
  levenshteinDistance,
  addWellKnownGlobalBrands,
  // Export new utility functions as well
  findBrandIntersection,
  findBrandsInMultipleCountries,
  getUniqueBrandRecords
};

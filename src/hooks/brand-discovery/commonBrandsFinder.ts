
// This file is kept for backward compatibility
// It re-exports the functions from the new modular files

import { findMultiCountryBrands } from './findCommonBrands';
import { levenshteinDistance } from './brandMatching';
import { addWellKnownGlobalBrands } from './globalBrands';

// Re-export for backward compatibility
export { 
  findMultiCountryBrands,
  levenshteinDistance,
  addWellKnownGlobalBrands
};

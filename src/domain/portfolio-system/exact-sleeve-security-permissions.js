import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';

import {
  PHASE_1_SECURITY_METADATA
} from './security-metadata.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';

import {
  getSecurityCategory
} from './security-category-universe.js';


function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return Object.freeze(value);
}


function exactKey({
  portfolioSystemId,
  variantId,
  sleeveId,
  categoryId,
  securityId
}) {
  return [
    portfolioSystemId,
    variantId,
    sleeveId,
    categoryId,
    securityId
  ].join('|');
}


/**
 * Explicit exclusions belong here when an otherwise approved catalogue
 * association must not be assessed in one exact sleeve context.
 */
export const EXACT_SLEEVE_SECURITY_EXCLUSIONS = Object.freeze([]);


const EXCLUSION_KEYS = new Set(
  EXACT_SLEEVE_SECURITY_EXCLUSIONS.map(exactKey)
);


const PORTFOLIOS = Object.values(
  CONSTITUENT_PORTFOLIOS
).flatMap((variantMap) => Object.values(variantMap));


/**
 * Canonical exact permission contract for the approved Phase 1 catalogue.
 *
 * A record is eligible only when the exact portfolio, variant and sleeve
 * permit the category, the category approves the security, verified Phase 1
 * metadata exists and no exact exclusion exists. Structural fit remains a
 * later decision and is not encoded here.
 */
export const EXACT_SLEEVE_SECURITY_PERMISSIONS = deepFreeze(
  PORTFOLIOS.flatMap((portfolio) =>
    portfolio.sleeves.flatMap((sleeve) =>
      sleeve.assetCategories.flatMap((categoryId) => {
        const category = getSecurityCategory(categoryId);

        if (!category) {
          return [];
        }

        return category.securityIds.map((securityId) => {
          const identity = {
            portfolioSystemId: portfolio.id,
            archetypeId: portfolio.archetypeId,
            variantId: portfolio.variantId,
            sleeveId: sleeve.id,
            categoryId,
            securityId
          };
          const eligibilityStatus = EXCLUSION_KEYS.has(
            exactKey(identity)
          )
            ? 'ineligible'
            : PHASE_1_SECURITY_METADATA[securityId] &&
                PHASE_1_SECURITY_REFERENCE[securityId]
                  ?.verificationStatus === 'verified'
              ? 'eligible'
              : 'pending-verification';

          return {
            ...identity,
            eligibilityStatus
          };
        });
      })
    )
  )
);

import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';

import {
  EXAMPLE_SECURITY_ASSOCIATIONS
} from './example-securities.js';

import {
  getSecurityCategory
} from './security-category-universe.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';


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


const INCREMENT_0B_ELIGIBILITY_KEYS = new Set(
  EXAMPLE_SECURITY_ASSOCIATIONS.flatMap(
    (association) =>
      association.securityIds.map(
        (securityId) =>
          exactKey({
            portfolioSystemId:
              association.portfolioId,
            variantId: association.variantId,
            sleeveId: association.sleeveId,
            categoryId:
              association.assetCategoryId,
            securityId: securityId.toLowerCase()
          })
      )
  )
);


const PORTFOLIOS = Object.values(
  CONSTITUENT_PORTFOLIOS
).flatMap(
  (variantMap) => Object.values(variantMap)
);


export const SLEEVE_SECURITY_ELIGIBILITY =
  Object.freeze(
    PORTFOLIOS.flatMap(
      (portfolio) =>
        portfolio.sleeves.flatMap(
          (sleeve) =>
            sleeve.assetCategories.flatMap(
              (categoryId) => {
                const category =
                  getSecurityCategory(categoryId);

                return category.securityIds.map(
                  (securityId) => {
                    const security =
                      PHASE_1_SECURITY_REFERENCE[
                        securityId
                      ];

                    const hasApprovedMapping =
                      INCREMENT_0B_ELIGIBILITY_KEYS.has(
                        exactKey({
                          portfolioSystemId:
                            portfolio.id,
                          variantId:
                            portfolio.variantId,
                          sleeveId: sleeve.id,
                          categoryId,
                          securityId
                        })
                      );

                    const eligibilityStatus =
                      hasApprovedMapping &&
                      security.verificationStatus ===
                        'verified'
                        ? 'eligible'
                        : hasApprovedMapping
                          ? 'pending-verification'
                          : 'pending-approval';

                    return Object.freeze({
                      portfolioSystemId:
                        portfolio.id,
                      archetypeId:
                        portfolio.archetypeId,
                      variantId:
                        portfolio.variantId,
                      sleeveId: sleeve.id,
                      categoryId,
                      securityId,
                      listingStatus: 'listed',
                      eligibilityStatus,
                      automaticallyHeld: false
                    });
                  }
                );
              }
            )
        )
    )
  );


const ELIGIBILITY_BY_KEY = new Map(
  SLEEVE_SECURITY_ELIGIBILITY.map(
    (record) => [exactKey(record), record]
  )
);


export function getExactSleeveSecurityEligibility(
  input
) {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const normalizedInput = {
    ...input,
    securityId:
      typeof input.securityId === 'string'
        ? input.securityId.toLowerCase()
        : ''
  };

  return ELIGIBILITY_BY_KEY.get(
    exactKey(normalizedInput)
  ) ?? null;
}


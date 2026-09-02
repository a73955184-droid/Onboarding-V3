import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';

import {
  PHASE_1_SECURITY_METADATA
} from './security-metadata.js';

import {
  SLEEVE_SECURITY_ELIGIBILITY
} from './sleeve-security-eligibility.js';


const PORTFOLIOS = Object.values(
  CONSTITUENT_PORTFOLIOS
).flatMap(
  (variantMap) => Object.values(variantMap)
);


const EMPTY_CATEGORIES = Object.freeze([]);


export function resolveEligibleSecurities({
  portfolioSystemId,
  variantId,
  sleeveId
} = {}) {
  const portfolio = PORTFOLIOS.find(
    (candidate) =>
      candidate.id === portfolioSystemId &&
      candidate.variantId === variantId
  );

  const sleeve = portfolio?.sleeves.find(
    (candidate) => candidate.id === sleeveId
  );

  if (!portfolio || !sleeve) {
    return Object.freeze({
      portfolioSystemId: portfolioSystemId ?? null,
      variantId: variantId ?? null,
      sleeveId: sleeveId ?? null,
      categories: EMPTY_CATEGORIES
    });
  }

  const records =
    SLEEVE_SECURITY_ELIGIBILITY.filter(
      (record) =>
        record.portfolioSystemId ===
          portfolioSystemId &&
        record.variantId === variantId &&
        record.sleeveId === sleeveId
    );

  const categories = sleeve.assetCategories.map(
    (categoryId) => {
      const categoryRecords = records.filter(
        (record) =>
          record.categoryId === categoryId &&
          record.eligibilityStatus === 'eligible' &&
          PHASE_1_SECURITY_METADATA[
            record.securityId
          ] !== undefined
      );

      return Object.freeze({
        categoryId,
        securityIds: Object.freeze(
          categoryRecords.map(
            ({ securityId }) => securityId
          )
        ),
        securities: Object.freeze(
          categoryRecords.map(
            (record) => Object.freeze({
              ...PHASE_1_SECURITY_REFERENCE[
                record.securityId
              ],
              listingStatus:
                record.listingStatus,
              eligibilityStatus:
                record.eligibilityStatus,
              automaticallyHeld: false
            })
          )
        )
      });
    }
  );

  return Object.freeze({
    portfolioSystemId,
    variantId,
    sleeveId,
    categories: Object.freeze(categories)
  });
}

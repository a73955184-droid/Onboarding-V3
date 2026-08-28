import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';


const TACTICAL_DEFERRED_REASON =
  'No universal security represents tactical allocation; the vehicle must follow an explicit tactical thesis.';


const CATEGORY_SECURITY_IDS = Object.freeze({
  'global-equity': Object.freeze(['VT']),
  'broad-us-equity': Object.freeze(['VTI']),
  'broad-international-equity': Object.freeze(['VXUS']),
  'developed-international-equity': Object.freeze(['VEA']),
  'emerging-market-equity': Object.freeze(['VWO']),

  'high-quality-bonds': Object.freeze(['BND', 'AGG']),
  'government-bonds': Object.freeze(['GOVT']),
  'short-duration-bonds': Object.freeze(['BSV']),
  'short-government-securities': Object.freeze(['VGSH', 'SGOV']),
  'investment-grade-credit': Object.freeze(['LQD']),
  'inflation-protected-bonds': Object.freeze(['TIP']),
  'cash-equivalent': Object.freeze(['SGOV']),

  'small-cap-equity': Object.freeze(['VB']),
  'small-value-equity': Object.freeze(['VBR']),
  'growth-oriented-equity': Object.freeze(['VUG']),
  'diversified-factor-equity': Object.freeze(['VFMF']),
  'quality-factor-equity': Object.freeze(['QUAL']),
  'value-factor-equity': Object.freeze(['VLUE']),

  'income-equity': Object.freeze(['SCHD']),
  'income-opportunity': Object.freeze(['PFF']),

  'real-assets': Object.freeze(['VNQ', 'IGF', 'GLDM']),
  'alternative-strategy': Object.freeze(['QAI', 'DBMF']),

  'sector-equity': Object.freeze(['XLK', 'XLV']),
  'style-equity': Object.freeze(['IWF', 'IWD']),
  'thematic-equity': Object.freeze(['ICLN', 'SOXX']),
  'selected-equity': Object.freeze(['MSFT', 'JPM']),

  'broad-preference-fund': Object.freeze(['ESGV']),
  'tactical-fund': Object.freeze([])
});


const RESEARCH_REQUIRED_CATEGORIES = new Set([
  'selected-equity',
  'thematic-equity',
  'sector-equity',
  'style-equity',
  'income-opportunity',
  'alternative-strategy'
]);


const DISTINCT_IMPLEMENTATION_CATEGORIES = new Set([
  'real-assets',
  'sector-equity',
  'style-equity',
  'thematic-equity',
  'selected-equity'
]);


function getRelationship(
  assetCategoryId,
  securityIds,
  sleeveCategoryCount
) {
  if (securityIds.length === 0) {
    return 'deferred';
  }

  if (
    sleeveCategoryCount > 1 ||
    DISTINCT_IMPLEMENTATION_CATEGORIES.has(assetCategoryId)
  ) {
    return 'category-examples';
  }

  if (securityIds.length > 1) {
    return 'alternatives';
  }

  return 'single-example';
}


function getImplementationNote(
  assetCategoryId,
  relationship
) {
  if (assetCategoryId === 'real-assets') {
    return 'These illustrate different real-asset implementations; they are neither interchangeable nor automatically additive.';
  }

  if (assetCategoryId === 'selected-equity') {
    return 'These individual equities illustrate security-level research and are not preselected portfolio holdings.';
  }

  if (assetCategoryId === 'broad-preference-fund') {
    return 'This illustrates a broad values screen and does not establish alignment with any particular investor\'s values.';
  }

  if (relationship === 'alternatives') {
    return 'These are implementation alternatives; the mapping does not imply that both are required holdings.';
  }

  if (relationship === 'category-examples') {
    return 'These examples illustrate distinct category implementations and are not automatically required together.';
  }

  return 'This security illustrates one possible implementation of the assigned asset category.';
}


function createAssociation({
  portfolio,
  sleeve,
  assetCategoryId
}) {
  const securityIds =
    CATEGORY_SECURITY_IDS[assetCategoryId];

  const relationship = getRelationship(
    assetCategoryId,
    securityIds,
    sleeve.assetCategories.length
  );

  return Object.freeze({
    archetypeId: portfolio.archetypeId,
    variantId: portfolio.variantId,
    portfolioId: portfolio.id,
    sleeveId: sleeve.id,
    assetCategoryId,
    securityIds,
    relationship,
    exampleType:
      RESEARCH_REQUIRED_CATEGORIES.has(assetCategoryId)
        ? 'research-required'
        : 'educational-implementation',
    implementationNote:
      relationship === 'deferred'
        ? null
        : getImplementationNote(assetCategoryId, relationship),
    deferredReason:
      assetCategoryId === 'tactical-fund'
        ? TACTICAL_DEFERRED_REASON
        : null
  });
}


const PORTFOLIOS = Object.values(
  CONSTITUENT_PORTFOLIOS
).flatMap(
  (variantMap) =>
    Object.values(variantMap)
);


export const EXAMPLE_SECURITY_ASSOCIATIONS = Object.freeze(
  PORTFOLIOS.flatMap(
    (portfolio) =>
      portfolio.sleeves.flatMap(
        (sleeve) =>
          sleeve.assetCategories.map(
            (assetCategoryId) =>
              createAssociation({
                portfolio,
                sleeve,
                assetCategoryId
              })
          )
      )
  )
);


export const EXAMPLE_SECURITY_CATEGORY_IDS = Object.freeze(
  Object.keys(CATEGORY_SECURITY_IDS)
);


export const TACTICAL_FUND_DEFERRED_REASON =
  TACTICAL_DEFERRED_REASON;

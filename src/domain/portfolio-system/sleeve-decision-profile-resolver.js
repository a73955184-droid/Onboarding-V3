import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';

import {
  SLEEVE_DECISION_PROFILES,
  SLEEVE_DECISION_PROFILE_ASSIGNMENTS
} from './sleeve-decision-profiles.js';


function exactKey({
  portfolioSystemId,
  variantId,
  sleeveId
}) {
  return [
    portfolioSystemId,
    variantId,
    sleeveId
  ].join('|');
}


const PORTFOLIOS = Object.values(
  CONSTITUENT_PORTFOLIOS
).flatMap(
  (variantMap) => Object.values(variantMap)
);

const PORTFOLIO_BY_EXACT_IDENTITY = new Map(
  PORTFOLIOS.map(
    (portfolio) => [
      exactKey({
        portfolioSystemId: portfolio.id,
        variantId: portfolio.variantId,
        sleeveId: ''
      }),
      portfolio
    ]
  )
);

const ASSIGNMENT_BY_EXACT_KEY = new Map(
  SLEEVE_DECISION_PROFILE_ASSIGNMENTS.map(
    (assignment) => [exactKey(assignment), assignment]
  )
);


function freezeResolvedProfile({
  assignment,
  portfolio,
  sleeve,
  profile
}) {
  return Object.freeze({
    portfolioSystemId: assignment.portfolioSystemId,
    archetypeId: portfolio.archetypeId,
    variantId: assignment.variantId,
    sleeveId: assignment.sleeveId,
    profileId: profile.profileId,
    job: profile.job,
    returnRole: profile.returnRole,
    permittedCategoryIds: Object.freeze([
      ...sleeve.assetCategories
    ]),
    permittedAssetClasses: profile.permittedAssetClasses,
    permittedStrategyTypes: profile.permittedStrategyTypes,
    permittedComplexityLevels:
      profile.permittedComplexityLevels,
    supportedGeographies: profile.supportedGeographies,
    prohibitedCharacteristics:
      profile.prohibitedCharacteristics,
    overlapDimensions: profile.overlapDimensions
  });
}


/**
 * Resolves only an exact system + variant + sleeve identity.
 * There is deliberately no lookup by sleeve ID, label, category, role,
 * archetype, or neighboring variant.
 */
export function resolveSleeveDecisionProfile({
  portfolioSystemId,
  variantId,
  sleeveId
} = {}) {
  const assignment = ASSIGNMENT_BY_EXACT_KEY.get(
    exactKey({ portfolioSystemId, variantId, sleeveId })
  );

  if (!assignment) {
    return null;
  }

  const portfolio = PORTFOLIO_BY_EXACT_IDENTITY.get(
    exactKey({
      portfolioSystemId,
      variantId,
      sleeveId: ''
    })
  );
  const sleeve = portfolio?.sleeves.find(
    ({ id }) => id === sleeveId
  );
  const profile = SLEEVE_DECISION_PROFILES[
    assignment.profileId
  ];

  if (!portfolio || !sleeve || !profile) {
    return null;
  }

  return freezeResolvedProfile({
    assignment,
    portfolio,
    sleeve,
    profile
  });
}


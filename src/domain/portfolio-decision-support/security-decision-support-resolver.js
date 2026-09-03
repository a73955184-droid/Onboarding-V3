import {
  CONSTITUENT_PORTFOLIOS
} from '../portfolio-system/constituent-portfolios.js';
import {
  getSecurityCategories
} from '../portfolio-system/security-category-universe.js';
import {
  resolveSecurityAssessmentReadiness
} from '../portfolio-system/security-assessment-readiness.js';
import {
  resolveSecurityReplacementComparison
} from '../portfolio-system/security-replacement-comparison.js';
import {
  PHASE_1_SECURITY_REFERENCE
} from '../portfolio-system/security-reference.js';
import {
  getSecurityStructuralFacts,
  resolveSecuritySleeveAlignment,
  resolveSecuritySleeveBoundaryAlignment
} from '../portfolio-system/security-sleeve-alignment.js';
import {
  resolveCrossSleeveRoleConflicts,
  resolveSecurityStructuralOverlap
} from '../portfolio-system/security-structural-overlap.js';
import {
  resolveSleeveDecisionProfile
} from '../portfolio-system/sleeve-decision-profile-resolver.js';
import {
  getExactSleeveSecurityEligibility
} from '../portfolio-system/sleeve-security-eligibility.js';
import {
  DECISION_SUPPORT_ACTIONS,
  DECISION_SUPPORT_ASSESSMENT_STATUSES,
  DECISION_SUPPORT_CONTRIBUTION_LEVELS,
  createSecurityDecisionSupportResult
} from './security-decision-support-contract.js';
import {
  resolveSecurityIncrementalContribution
} from './security-incremental-contribution.js';
import {
  resolveSecurityOptions
} from './security-option-resolver.js';
import {
  resolveSecurityOverlapInterpretation
} from './security-overlap-interpretation.js';
import {
  resolveSecurityPreferredAction
} from './security-preferred-action-resolver.js';
import {
  resolveSecurityTradeoffs
} from './security-tradeoff-resolver.js';


const PORTFOLIOS = Object.values(CONSTITUENT_PORTFOLIOS).flatMap(
  (variantMap) => Object.values(variantMap)
);


const EMPTY_TRADEOFFS = Object.freeze({
  sharedExposure: Object.freeze([]),
  distinctExposure: Object.freeze([]),
  increasedEmphasis: Object.freeze([]),
  reducedRelativeEmphasis: Object.freeze([]),
  implementationChanges: Object.freeze([])
});


function findPortfolio(portfolioSystemId, variantId) {
  return PORTFOLIOS.find(
    (portfolio) =>
      portfolio.id === portfolioSystemId &&
      portfolio.variantId === variantId
  ) ?? null;
}


function normalizeHoldings(portfolio, holdingsBySleeve) {
  if (
    holdingsBySleeve === null ||
    typeof holdingsBySleeve !== 'object' ||
    Array.isArray(holdingsBySleeve)
  ) {
    throw new TypeError('holdingsBySleeve must be an object');
  }

  const sleeveIds = new Set(portfolio.sleeves.map(({ id }) => id));

  for (const sleeveId of Object.keys(holdingsBySleeve)) {
    if (!sleeveIds.has(sleeveId)) {
      throw new TypeError(
        'holdingsBySleeve contains an unknown sleeve ID'
      );
    }
  }

  return Object.fromEntries(portfolio.sleeves.map(({ id }) => {
    const securityIds = holdingsBySleeve[id] ?? [];

    if (!Array.isArray(securityIds)) {
      throw new TypeError('Each holdingsBySleeve value must be an array');
    }

    const normalizedIds = securityIds.map((securityId) => {
      if (typeof securityId !== 'string') {
        throw new TypeError('Holding IDs must be strings');
      }

      return securityId.toLowerCase();
    });

    if (new Set(normalizedIds).size !== normalizedIds.length) {
      throw new TypeError('Holdings within a sleeve must be unique');
    }

    return [id, normalizedIds];
  }));
}


function candidateSnapshot(candidateSecurityId) {
  const candidate = PHASE_1_SECURITY_REFERENCE[candidateSecurityId];

  if (!candidate) {
    return null;
  }

  return {
    securityId: candidateSecurityId,
    ticker: candidate.symbol,
    name: candidate.name,
    issuer: candidate.issuer,
    securityType: candidate.securityType
  };
}


function sleeveContext({
  portfolioSystemId,
  variantId,
  sleeve,
  profile
}) {
  if (!sleeve || !profile) {
    return null;
  }

  return {
    portfolioSystemId,
    variantId,
    sleeveId: sleeve.id,
    sleeveLabel: sleeve.label,
    profileId: profile.profileId,
    job: profile.job,
    returnRole: profile.returnRole
  };
}


function unavailableResult({
  reasonCode,
  candidate = null,
  sleeve = null,
  profile = null,
  portfolioSystemId = null,
  variantId = null,
  readiness = null,
  eligibility = null
}) {
  return createSecurityDecisionSupportResult({
    assessmentStatus:
      DECISION_SUPPORT_ASSESSMENT_STATUSES.UNAVAILABLE,
    candidate,
    sleeveContext: sleeveContext({
      portfolioSystemId,
      variantId,
      sleeve,
      profile
    }),
    tradeoffs: EMPTY_TRADEOFFS,
    contribution: {
      level: null,
      explanation:
        'Decision-relevant structural evidence is unresolved.'
    },
    availableActions: [DECISION_SUPPORT_ACTIONS.RETURN],
    preferredAction: null,
    rationale: {
      summary: 'No preferred action was determined.',
      reasonCodes: [reasonCode]
    },
    structuralEvidence: {
      eligibility,
      readiness,
      sleeveAlignment: null,
      sleeveBoundary: null,
      overlap: null,
      replacement: null
    }
  });
}


function exactEligibility({
  candidateSecurityId,
  portfolioSystemId,
  variantId,
  targetSleeveId,
  profile
}) {
  const matchedCategoryIds = getSecurityCategories(
    candidateSecurityId
  ).filter((categoryId) =>
    profile.permittedCategoryIds.includes(categoryId)
  );
  const records = matchedCategoryIds.map((categoryId) =>
    getExactSleeveSecurityEligibility({
      portfolioSystemId,
      variantId,
      sleeveId: targetSleeveId,
      categoryId,
      securityId: candidateSecurityId
    })
  ).filter(Boolean);
  const eligibleRecord = records.find(
    ({ eligibilityStatus }) => eligibilityStatus === 'eligible'
  ) ?? null;

  return {
    status: eligibleRecord
      ? 'eligible'
      : records[0]?.eligibilityStatus ?? 'unavailable',
    matchedCategoryIds,
    records,
    eligibleRecord
  };
}


function contributionLevel({ interpretation, boundary }) {
  if (
    !boundary.aligned ||
    interpretation.interpretation === 'cross-sleeve-conflicting'
  ) {
    return DECISION_SUPPORT_CONTRIBUTION_LEVELS.CONFLICTING;
  }

  if (
    interpretation.incrementalContribution === 'none'
  ) {
    return DECISION_SUPPORT_CONTRIBUTION_LEVELS
      .NO_MEANINGFUL_ADDITION;
  }

  if (
    interpretation.interpretation === 'distinct' &&
    interpretation.incrementalContribution === 'substantial'
  ) {
    return DECISION_SUPPORT_CONTRIBUTION_LEVELS.DISTINCT;
  }

  if (interpretation.incrementalContribution === 'limited') {
    return DECISION_SUPPORT_CONTRIBUTION_LEVELS.MOSTLY_OVERLAPPING;
  }

  return DECISION_SUPPORT_CONTRIBUTION_LEVELS.INCREMENTAL;
}


function contributionExplanation(level) {
  return {
    [DECISION_SUPPORT_CONTRIBUTION_LEVELS.DISTINCT]:
      'The candidate adds a permitted role or exposure not represented in this sleeve.',
    [DECISION_SUPPORT_CONTRIBUTION_LEVELS.INCREMENTAL]:
      'The candidate changes the sleeve meaningfully while retaining shared exposure.',
    [DECISION_SUPPORT_CONTRIBUTION_LEVELS.MOSTLY_OVERLAPPING]:
      'The candidate adds a limited distinction alongside substantial existing exposure.',
    [DECISION_SUPPORT_CONTRIBUTION_LEVELS.NO_MEANINGFUL_ADDITION]:
      'The candidate does not add a meaningful structural distinction to this sleeve.',
    [DECISION_SUPPORT_CONTRIBUTION_LEVELS.CONFLICTING]:
      'The candidate conflicts with this sleeve context or a role assigned elsewhere.'
  }[level];
}


function dimensionEntries(dimensionMap, valueKey = null) {
  return Object.entries(dimensionMap).flatMap(([dimension, value]) => {
    const values = valueKey === null ? value : value[valueKey];

    return values.length > 0 ? [{ dimension, values: [...values] }] : [];
  });
}


function publicTradeoffs(incremental, tradeoffs) {
  return {
    sharedExposure: dimensionEntries(incremental.sharedDimensions),
    distinctExposure: dimensionEntries(
      incremental.distinctDimensions,
      'candidateOnly'
    ),
    increasedEmphasis: tradeoffs.concentrationChanges.filter(
      ({ direction }) => direction === 'increase'
    ),
    reducedRelativeEmphasis: tradeoffs.concentrationChanges.filter(
      ({ direction }) => direction === 'decrease-relative'
    ),
    implementationChanges: tradeoffs.whatChanges.filter(
      ({ dimension }) =>
        dimension === 'implementation' || dimension === 'complexity'
    )
  };
}


function rationaleSummary(preferredAction) {
  return {
    [DECISION_SUPPORT_ACTIONS.KEEP_CURRENT]:
      'Keeping the current sleeve implementation is the best default for this portfolio system.',
    [DECISION_SUPPORT_ACTIONS.ADD]:
      'Including the candidate is the best default for this portfolio system.',
    [DECISION_SUPPORT_ACTIONS.REPLACE]:
      'Using the candidate in place of the supported existing holding is the best default for this portfolio system.',
    [DECISION_SUPPORT_ACTIONS.SAVE_ALTERNATIVE]:
      'Saving the candidate as an alternative is the best available default.',
    [DECISION_SUPPORT_ACTIONS.RETURN]:
      'Returning without including the candidate is the best default in this sleeve context.'
  }[preferredAction];
}


/**
 * Composes Phase 2 structural evidence into the Phase 3 Portfolio Map
 * decision-support contract. It does not call or reproduce the Phase 2
 * four-outcome resolver and does not mutate holdings or calculate allocation.
 */
export function resolveSecurityDecisionSupport({
  portfolioSystemId,
  variantId,
  targetSleeveId,
  candidateSecurityId,
  holdingsBySleeve = {}
} = {}) {
  const portfolio = findPortfolio(portfolioSystemId, variantId);
  const targetSleeve = portfolio?.sleeves.find(
    ({ id }) => id === targetSleeveId
  ) ?? null;
  const profile = resolveSleeveDecisionProfile({
    portfolioSystemId,
    variantId,
    sleeveId: targetSleeveId
  });
  const normalizedCandidateId =
    typeof candidateSecurityId === 'string'
      ? candidateSecurityId.toLowerCase()
      : null;
  const candidate = normalizedCandidateId
    ? candidateSnapshot(normalizedCandidateId)
    : null;

  if (!portfolio || !targetSleeve || !profile) {
    return unavailableResult({
      reasonCode: 'unresolved-sleeve',
      candidate,
      sleeve: targetSleeve,
      profile,
      portfolioSystemId,
      variantId,
      readiness: {
        ready: false,
        subject: 'sleeve',
        missingFields: [{
          securityId: null,
          fields: ['sleeveDecisionProfile']
        }]
      }
    });
  }

  const normalizedHoldings = normalizeHoldings(
    portfolio,
    holdingsBySleeve
  );
  const holdingSecurityIds = Object.values(normalizedHoldings).flat();
  const readiness = resolveSecurityAssessmentReadiness({
    candidateSecurityId: normalizedCandidateId,
    holdingSecurityIds,
    portfolioSystemId,
    variantId,
    targetSleeveId
  });

  if (!readiness.ready) {
    return unavailableResult({
      reasonCode: readiness.subject === 'candidate'
        ? candidate
          ? 'incomplete-security-profile'
          : 'unknown-security'
        : 'missing-holdings-profile',
      candidate,
      sleeve: targetSleeve,
      profile,
      portfolioSystemId,
      variantId,
      readiness
    });
  }

  const eligibility = exactEligibility({
    candidateSecurityId: normalizedCandidateId,
    portfolioSystemId,
    variantId,
    targetSleeveId,
    profile
  });

  if (eligibility.status !== 'eligible') {
    return unavailableResult({
      reasonCode: 'exact-eligibility-unavailable',
      candidate,
      sleeve: targetSleeve,
      profile,
      portfolioSystemId,
      variantId,
      readiness,
      eligibility
    });
  }

  const comparisonContext = {
    candidateSecurityId: normalizedCandidateId,
    portfolioSystemId,
    variantId,
    sleeveId: targetSleeveId
  };
  const alignment = resolveSecuritySleeveAlignment(comparisonContext);
  const boundary = resolveSecuritySleeveBoundaryAlignment(
    comparisonContext
  );
  const candidateFacts = getSecurityStructuralFacts(
    normalizedCandidateId
  );
  const targetHoldingIds = normalizedHoldings[targetSleeveId];
  const targetHoldings = targetHoldingIds.map(
    (securityId) => getSecurityStructuralFacts(securityId)
  );
  const crossHoldings = Object.entries(normalizedHoldings).flatMap(
    ([sleeveId, securityIds]) => sleeveId === targetSleeveId
      ? []
      : securityIds.map((securityId) => ({
          sleeveId,
          security: getSecurityStructuralFacts(securityId)
        }))
  );
  const targetOverlapEvidence = targetHoldingIds.map(
    (holdingSecurityId) => ({
      holdingSleeveId: targetSleeveId,
      holdingSecurityId,
      overlap: resolveSecurityStructuralOverlap({
        ...comparisonContext,
        holdingSecurityId
      })
    })
  );
  const crossSleeve = resolveCrossSleeveRoleConflicts({
    candidateSecurityId: normalizedCandidateId,
    portfolioSystemId,
    variantId,
    targetSleeveId,
    holdingsBySleeve: normalizedHoldings
  });
  const crossOverlapEvidence = crossSleeve.comparisons;
  const incremental = resolveSecurityIncrementalContribution({
    candidate: candidateFacts,
    targetSleeve: profile,
    targetSleeveHoldings: targetHoldings,
    crossSleeveHoldings: crossHoldings,
    structuralOverlapEvidence: [
      ...targetOverlapEvidence,
      ...crossOverlapEvidence
    ]
  });
  const crossSleeveConflictEvidence = {
    status: crossSleeve.conflicts.length > 0 ? 'conflict' : 'none',
    overlappingSecurityIds: [
      ...new Set(crossSleeve.conflicts.map(
        ({ holdingSecurityId }) => holdingSecurityId
      ))
    ],
    overlappingSleeveIds: [
      ...new Set(crossSleeve.conflicts.map(
        ({ holdingSleeveId }) => holdingSleeveId
      ))
    ]
  };
  const overlapInterpretation =
    resolveSecurityOverlapInterpretation({
      incrementalContributionEvidence: incremental,
      targetSleeveOverlapEvidence: targetOverlapEvidence,
      crossSleeveOverlapEvidence: crossOverlapEvidence,
      crossSleeveConflictEvidence
    });
  const tradeoffs = resolveSecurityTradeoffs({
    incrementalContributionEvidence: incremental,
    overlapInterpretation
  });
  const replacementEvidence = targetHoldingIds.map(
    (holdingSecurityId) => resolveSecurityReplacementComparison({
      ...comparisonContext,
      holdingSecurityId
    })
  );
  const { availableActions } = resolveSecurityOptions({
    candidateSecurityId: normalizedCandidateId,
    readiness,
    sleeveBoundary: boundary,
    tradeoffs,
    targetSleeveHoldingIds: targetHoldingIds,
    replacementEvidence
  });
  const preference = resolveSecurityPreferredAction({
    tradeoffs,
    incrementalContribution:
      overlapInterpretation.incrementalContribution,
    complexityEffect: incremental.complexityChange,
    sleeveMandate: profile,
    availableActions
  });
  const level = contributionLevel({
    interpretation: overlapInterpretation,
    boundary
  });

  return createSecurityDecisionSupportResult({
    assessmentStatus: DECISION_SUPPORT_ASSESSMENT_STATUSES.COMPLETE,
    candidate,
    sleeveContext: sleeveContext({
      portfolioSystemId,
      variantId,
      sleeve: targetSleeve,
      profile
    }),
    tradeoffs: publicTradeoffs(incremental, tradeoffs),
    contribution: {
      level,
      explanation: contributionExplanation(level)
    },
    availableActions,
    preferredAction: preference.preferredAction,
    rationale: {
      summary: rationaleSummary(preference.preferredAction),
      reasonCodes: preference.reasonCodes
    },
    structuralEvidence: {
      eligibility,
      readiness,
      sleeveAlignment: alignment,
      sleeveBoundary: boundary,
      overlap: {
        interpretation: overlapInterpretation,
        incrementalContribution: incremental,
        targetSleeveComparisons: targetOverlapEvidence,
        crossSleeveComparisons: crossOverlapEvidence
      },
      replacement: replacementEvidence
    }
  });
}

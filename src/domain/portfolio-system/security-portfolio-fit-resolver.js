import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';

import {
  getSecurityCategories
} from './security-category-universe.js';

import {
  resolveSecurityFitExplanation
} from './security-fit-explanations.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';

import {
  resolveEqualWeightAllocation
} from './hypothetical-allocation-resolver.js';

import {
  getExactSleeveSecurityEligibility
} from './sleeve-security-eligibility.js';

import {
  resolveSleeveSecurityFit
} from './sleeve-security-fit-rules.js';


const PORTFOLIOS = Object.values(
  CONSTITUENT_PORTFOLIOS
).flatMap(
  (variantMap) => Object.values(variantMap)
);


function normalizeHoldings(portfolio, holdingsBySleeve) {
  if (
    !holdingsBySleeve ||
    typeof holdingsBySleeve !== 'object' ||
    Array.isArray(holdingsBySleeve)
  ) {
    throw new TypeError(
      'holdingsBySleeve must be an object'
    );
  }

  const sleeveIds = new Set(
    portfolio.sleeves.map(({ id }) => id)
  );

  for (const sleeveId of Object.keys(holdingsBySleeve)) {
    if (!sleeveIds.has(sleeveId)) {
      throw new TypeError(
        'holdingsBySleeve contains an unknown sleeve ID'
      );
    }
  }

  return Object.fromEntries(
    portfolio.sleeves.map(({ id }) => {
      const securityIds = holdingsBySleeve[id] ?? [];

      if (!Array.isArray(securityIds)) {
        throw new TypeError(
          'Each holdingsBySleeve value must be an array'
        );
      }

      const normalizedIds = securityIds.map(
        (securityId) => {
          if (typeof securityId !== 'string') {
            throw new TypeError(
              'Holding IDs must be strings'
            );
          }

          const normalizedId =
            securityId.toLowerCase();

          if (!PHASE_1_SECURITY_REFERENCE[normalizedId]) {
            throw new TypeError(
              'Holding IDs must be canonical security IDs'
            );
          }

          return normalizedId;
        }
      );

      if (
        new Set(normalizedIds).size !==
        normalizedIds.length
      ) {
        throw new TypeError(
          'Holdings within a sleeve must be unique'
        );
      }

      return [id, normalizedIds];
    })
  );
}


function resolveAfterSecurityIds({
  outcome,
  candidateSecurityId,
  affectedSecurityId,
  beforeSecurityIds
}) {
  if (outcome === 'add') {
    return [...beforeSecurityIds, candidateSecurityId];
  }

  if (outcome === 'replace') {
    return beforeSecurityIds.map(
      (securityId) =>
        securityId === affectedSecurityId
          ? candidateSecurityId
          : securityId
    );
  }

  return [...beforeSecurityIds];
}


export function resolveSecurityPortfolioFit({
  portfolioSystemId,
  variantId,
  targetSleeveId,
  candidateSecurityId,
  holdingsBySleeve
} = {}) {
  const portfolio = PORTFOLIOS.find(
    (candidate) =>
      candidate.id === portfolioSystemId &&
      candidate.variantId === variantId
  );

  if (!portfolio) {
    throw new TypeError(
      'Unknown portfolio system and variant combination'
    );
  }

  const targetSleeve = portfolio.sleeves.find(
    ({ id }) => id === targetSleeveId
  );

  if (!targetSleeve) {
    throw new TypeError(
      'Unknown target sleeve for portfolio system'
    );
  }

  if (typeof candidateSecurityId !== 'string') {
    throw new TypeError(
      'candidateSecurityId must be a string'
    );
  }

  const normalizedCandidateId =
    candidateSecurityId.toLowerCase();

  const candidate =
    PHASE_1_SECURITY_REFERENCE[
      normalizedCandidateId
    ];

  if (!candidate) {
    throw new TypeError('Unknown candidate security ID');
  }

  const normalizedHoldings = normalizeHoldings(
    portfolio,
    holdingsBySleeve
  );

  const candidateCategoryIds =
    getSecurityCategories(normalizedCandidateId);

  const targetCategoryIds =
    candidateCategoryIds.filter(
      (categoryId) =>
        targetSleeve.assetCategories.includes(categoryId)
    );

  const eligibilityRecords = targetCategoryIds.map(
    (categoryId) =>
      getExactSleeveSecurityEligibility({
        portfolioSystemId,
        variantId,
        sleeveId: targetSleeveId,
        categoryId,
        securityId: normalizedCandidateId
      })
  ).filter(Boolean);

  const exactEligibility =
    eligibilityRecords.find(
      ({ eligibilityStatus }) =>
        eligibilityStatus === 'eligible'
    ) ?? eligibilityRecords[0] ?? null;

  const fit = resolveSleeveSecurityFit({
    candidateSecurityId: normalizedCandidateId,
    candidateVerificationStatus:
      candidate.verificationStatus,
    candidateCategoryIds: targetCategoryIds,
    exactEligibility,
    targetSleeveId,
    holdingsBySleeve: normalizedHoldings
  });

  const beforeSecurityIds =
    normalizedHoldings[targetSleeveId];

  const afterSecurityIds =
    resolveAfterSecurityIds({
      outcome: fit.outcome,
      candidateSecurityId: normalizedCandidateId,
      affectedSecurityId:
        fit.affectedSecurityId,
      beforeSecurityIds
    });

  const allocationBefore =
    resolveEqualWeightAllocation({
      sleeveWeight: targetSleeve.weight,
      securityIds: beforeSecurityIds
    });

  const allocationAfter =
    resolveEqualWeightAllocation({
      sleeveWeight: targetSleeve.weight,
      securityIds: afterSecurityIds
    });

  const explanation = resolveSecurityFitExplanation({
    outcome: fit.outcome,
    reasonCode: fit.reasonCode
  });

  const overlappingSecurityIds = Object.freeze(
    [...new Set(
      fit.roleOverlaps.map(
        ({ securityId }) => securityId
      )
    )]
  );

  const overlappingSleeveIds = Object.freeze(
    [...new Set(
      fit.roleOverlaps.map(
        ({ sleeveId }) => sleeveId
      )
    )]
  );

  const mandateEffect = {
    add: 'completes',
    replace: 'reinforces',
    redundant: 'duplicates',
    'do-not-add': 'unresolved'
  }[fit.outcome];

  return Object.freeze({
    candidate: candidate,
    candidateSecurityId: normalizedCandidateId,
    targetSleeve: Object.freeze({
      portfolioSystemId,
      variantId,
      sleeveId: targetSleeveId,
      categoryIds:
        Object.freeze([...targetSleeve.assetCategories])
    }),
    sleeveAssessment: Object.freeze({
      eligibility:
        exactEligibility?.eligibilityStatus ??
        'ineligible',
      mandateEffect,
      returnRoleEffect:
        fit.outcome === 'add'
          ? 'adds-distinct-role'
          : fit.outcome === 'replace'
            ? 'reinforces-existing-role'
            : fit.outcome === 'redundant'
              ? 'repeats-existing-role'
              : 'not-established',
      structuralRiskEffect: 'not-assessed',
      effortEffect:
        fit.outcome === 'add'
          ? 'increases'
          : 'unchanged',
      overlappingSecurityIds
    }),
    portfolioAssessment: Object.freeze({
      overlappingSecurityIds,
      overlappingSleeveIds,
      missingRolesFilled:
        Object.freeze(
          fit.outcome === 'add'
            ? [...targetCategoryIds]
            : []
        ),
      concentrationsIntroduced:
        Object.freeze([]),
      systemCoherenceEffect:
        fit.outcome === 'add' ||
        fit.outcome === 'replace'
          ? 'strengthens'
          : fit.outcome === 'redundant'
            ? 'unchanged'
            : 'unresolved'
    }),
    allocationBefore,
    allocationAfter,
    outcome: fit.outcome,
    affectedSecurityId:
      fit.affectedSecurityId,
    primaryExplanation:
      explanation.primaryReason,
    explanation,
    disclosure: explanation.disclosure
  });
}

import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';

import {
  getSecurityCategories
} from './security-category-universe.js';

import {
  resolveSecurityAssessmentReadiness
} from './security-assessment-readiness.js';

import {
  ASSESSMENT_STATUSES,
  ASSESSMENT_UNAVAILABLE_REASONS,
  SECURITY_FIT_OUTCOMES
} from './security-fit-constants.js';

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


function unavailableResult({
  portfolioSystemId,
  variantId,
  targetSleeveId,
  candidateSecurityId,
  reasonCode,
  missingFields = []
}) {
  return Object.freeze({
    assessmentStatus: ASSESSMENT_STATUSES.UNAVAILABLE,
    outcome: null,
    portfolioSystemId: portfolioSystemId ?? null,
    variantId: variantId ?? null,
    targetSleeveId: targetSleeveId ?? null,
    candidateSecurityId:
      typeof candidateSecurityId === 'string'
        ? candidateSecurityId.toLowerCase()
        : null,
    reasonCode,
    missingFields: Object.freeze([...missingFields])
  });
}


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

          return securityId.toLowerCase();
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
  if (outcome === SECURITY_FIT_OUTCOMES.ADD) {
    return [...beforeSecurityIds, candidateSecurityId];
  }

  if (outcome === SECURITY_FIT_OUTCOMES.REPLACE) {
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
    return unavailableResult({
      portfolioSystemId,
      variantId,
      targetSleeveId,
      candidateSecurityId,
      reasonCode:
        ASSESSMENT_UNAVAILABLE_REASONS.UNRESOLVED_SLEEVE
    });
  }

  const targetSleeve = portfolio.sleeves.find(
    ({ id }) => id === targetSleeveId
  );

  if (!targetSleeve) {
    return unavailableResult({
      portfolioSystemId,
      variantId,
      targetSleeveId,
      candidateSecurityId,
      reasonCode:
        ASSESSMENT_UNAVAILABLE_REASONS.UNRESOLVED_SLEEVE
    });
  }

  if (typeof candidateSecurityId !== 'string') {
    return unavailableResult({
      portfolioSystemId,
      variantId,
      targetSleeveId,
      candidateSecurityId,
      reasonCode:
        ASSESSMENT_UNAVAILABLE_REASONS.UNKNOWN_SECURITY
    });
  }

  const normalizedCandidateId =
    candidateSecurityId.toLowerCase();
  const candidate =
    PHASE_1_SECURITY_REFERENCE[normalizedCandidateId];

  if (!candidate) {
    return unavailableResult({
      portfolioSystemId,
      variantId,
      targetSleeveId,
      candidateSecurityId,
      reasonCode:
        ASSESSMENT_UNAVAILABLE_REASONS.UNKNOWN_SECURITY
    });
  }

  const normalizedHoldings = normalizeHoldings(
    portfolio,
    holdingsBySleeve
  );
  const holdingSecurityIds = Object.values(
    normalizedHoldings
  ).flat();
  const readiness = resolveSecurityAssessmentReadiness({
    candidateSecurityId: normalizedCandidateId,
    holdingSecurityIds
  });

  if (!readiness.ready) {
    return unavailableResult({
      portfolioSystemId,
      variantId,
      targetSleeveId,
      candidateSecurityId,
      reasonCode:
        readiness.subject === 'candidate'
          ? ASSESSMENT_UNAVAILABLE_REASONS
              .INCOMPLETE_SECURITY_PROFILE
          : ASSESSMENT_UNAVAILABLE_REASONS
              .MISSING_HOLDINGS_PROFILE,
      missingFields: readiness.missingFields
    });
  }

  const candidateCategoryIds =
    getSecurityCategories(normalizedCandidateId);
  const targetCategoryIds = candidateCategoryIds.filter(
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
  const exactEligibility = eligibilityRecords.find(
    ({ eligibilityStatus }) =>
      eligibilityStatus === 'eligible'
  ) ?? null;

  if (!exactEligibility) {
    return unavailableResult({
      portfolioSystemId,
      variantId,
      targetSleeveId,
      candidateSecurityId,
      reasonCode:
        ASSESSMENT_UNAVAILABLE_REASONS.UNRESOLVED_SLEEVE,
      missingFields: Object.freeze([Object.freeze({
        securityId: normalizedCandidateId,
        fields: Object.freeze(['exactEligibility'])
      })])
    });
  }

  const fit = resolveSleeveSecurityFit({
    candidateSecurityId: normalizedCandidateId,
    candidateCategoryIds: targetCategoryIds,
    targetSleeveId,
    holdingsBySleeve: normalizedHoldings
  });
  const beforeSecurityIds =
    normalizedHoldings[targetSleeveId];
  const afterSecurityIds = resolveAfterSecurityIds({
    outcome: fit.outcome,
    candidateSecurityId: normalizedCandidateId,
    affectedSecurityId: fit.affectedSecurityId,
    beforeSecurityIds
  });
  const allocationBefore = resolveEqualWeightAllocation({
    sleeveWeight: targetSleeve.weight,
    securityIds: beforeSecurityIds
  });
  const allocationAfter = resolveEqualWeightAllocation({
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
    'do-not-add': 'conflicts'
  }[fit.outcome];

  return Object.freeze({
    assessmentStatus: ASSESSMENT_STATUSES.COMPLETE,
    candidate,
    candidateSecurityId: normalizedCandidateId,
    targetSleeve: Object.freeze({
      portfolioSystemId,
      variantId,
      sleeveId: targetSleeveId,
      categoryIds:
        Object.freeze([...targetSleeve.assetCategories])
    }),
    reasonCodes: Object.freeze([fit.reasonCode]),
    sleeveAssessment: Object.freeze({
      eligibility: exactEligibility.eligibilityStatus,
      mandateEffect,
      returnRoleEffect:
        fit.outcome === SECURITY_FIT_OUTCOMES.ADD
          ? 'adds-distinct-role'
          : fit.outcome === SECURITY_FIT_OUTCOMES.REPLACE
            ? 'reinforces-existing-role'
            : fit.outcome === SECURITY_FIT_OUTCOMES.REDUNDANT
              ? 'repeats-existing-role'
              : 'creates-role-conflict',
      structuralRiskEffect:
        fit.outcome === SECURITY_FIT_OUTCOMES.DO_NOT_ADD
          ? 'creates-cross-sleeve-conflict'
          : 'no-new-conflict-established',
      effortEffect:
        fit.outcome === SECURITY_FIT_OUTCOMES.ADD
          ? 'increases'
          : fit.outcome === SECURITY_FIT_OUTCOMES.REPLACE
            ? 'decreases'
            : 'unchanged',
      overlappingSecurityIds
    }),
    portfolioAssessment: Object.freeze({
      overlappingSecurityIds,
      overlappingSleeveIds,
      missingRolesFilled: Object.freeze(
        fit.outcome === SECURITY_FIT_OUTCOMES.ADD
          ? [...targetCategoryIds]
          : []
      ),
      concentrationsIntroduced: Object.freeze([]),
      systemCoherenceEffect:
        fit.outcome === SECURITY_FIT_OUTCOMES.ADD ||
        fit.outcome === SECURITY_FIT_OUTCOMES.REPLACE
          ? 'strengthens'
          : fit.outcome === SECURITY_FIT_OUTCOMES.REDUNDANT
            ? 'unchanged'
            : 'weakens'
    }),
    allocationBefore,
    allocationAfter,
    outcome: fit.outcome,
    affectedSecurityId: fit.affectedSecurityId,
    primaryExplanation: explanation.primaryReason,
    explanation,
    disclosure: explanation.disclosure
  });
}

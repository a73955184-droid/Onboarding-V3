import {
  PHASE_1_SECURITY_METADATA
} from './security-metadata.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';

import {
  resolveSleeveDecisionProfile
} from './sleeve-decision-profile-resolver.js';


export const SECURITY_FIT_DISCLOSURE =
  'Based on the selected portfolio system and hypothetical holdings. This is an educational system-fit assessment, not a personalized investment recommendation.';


const DIMENSION_LABELS = Object.freeze({
  assetClasses: 'asset class',
  geographies: 'geography',
  marketCaps: 'market capitalization',
  styles: 'investment style',
  factors: 'factor exposure',
  sectors: 'sector exposure',
  durationBand: 'duration',
  creditQualities: 'credit quality',
  incomeRole: 'income role',
  inflationSensitivity: 'inflation sensitivity',
  strategyType: 'strategy type'
});


function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return Object.freeze(value);
}


function words(value) {
  return String(value ?? '')
    .replaceAll('-', ' ')
    .replace(/\bus\b/gi, 'United States')
    .replace(/^none income role$/i, 'no assigned income role')
    .replace(
      /^none inflation sensitivity$/i,
      'no explicit inflation sensitivity'
    )
    .replace(/\bunited states\b/gi, 'United States');
}


function sentenceList(values) {
  const clean = [...new Set(values.filter(Boolean))];

  if (clean.length < 2) return clean[0] ?? '';
  if (clean.length === 2) return clean.join(' and ');

  return `${clean.slice(0, -1).join(', ')}, and ${clean.at(-1)}`;
}


function securityLabel(securityId) {
  const security = PHASE_1_SECURITY_REFERENCE[securityId];
  return security?.ticker ?? security?.name ?? 'the existing holding';
}


function securityLabels(securityIds) {
  return sentenceList(securityIds.map(securityLabel));
}


function categoryLabels(categoryIds) {
  return sentenceList(categoryIds.map(words));
}


function dimensionLabels(dimensions) {
  return sentenceList(
    dimensions.map(
      (dimension) => DIMENSION_LABELS[dimension] ?? words(dimension)
    )
  );
}


function section(label, status, explanation) {
  return {
    label,
    status,
    explanation
  };
}


function resolveRoleExplanation({
  candidateSecurityId,
  factor,
  profile
}) {
  const job = words(profile.job);
  const metadata = PHASE_1_SECURITY_METADATA[candidateSecurityId];
  const candidateCategories = categoryLabels(
    metadata?.categoryIds ?? []
  );
  const matchedCategories = categoryLabels(
    factor.matchedCategoryIds ?? []
  );

  if (factor.status === 'aligned') {
    return section(
      'Sleeve-role alignment',
      'aligned',
      `The ${matchedCategories} category classification supports this sleeve's ${job} job and its ${words(factor.matchedReturnRole)} return role.`
    );
  }

  return section(
    'Sleeve-role alignment',
    'conflict',
    `The ${candidateCategories || 'available'} category classification does not match a permitted category for this sleeve's ${job} job.`
  );
}


function boundaryEvidence(candidateSecurityId, factor) {
  const exposure = PHASE_1_SECURITY_METADATA[
    candidateSecurityId
  ]?.exposureProfile;
  const evidence = [];

  if (exposure?.strategyType) {
    evidence.push(`${words(exposure.strategyType)} strategy type`);
  }
  if (exposure?.complexity) {
    evidence.push(`${words(exposure.complexity)} complexity`);
  }
  if (exposure?.geographies?.length) {
    evidence.push(`${sentenceList(exposure.geographies.map(words))} geography`);
  }
  if (factor.durationFit !== 'not-applicable' && exposure?.durationBand) {
    evidence.push(`${words(exposure.durationBand)} duration`);
  }
  if (
    factor.creditQualityFit !== 'not-applicable' &&
    exposure?.creditQualities?.length
  ) {
    evidence.push(
      `${sentenceList(exposure.creditQualities.map(words))} credit quality`
    );
  }
  if (factor.incomeRoleFit !== 'not-applicable' && exposure?.incomeRole) {
    evidence.push(
      exposure.incomeRole === 'none'
        ? 'no assigned income role'
        : `${words(exposure.incomeRole)} income role`
    );
  }
  if (
    factor.inflationRoleFit !== 'not-applicable' &&
    exposure?.inflationSensitivity
  ) {
    evidence.push(
      exposure.inflationSensitivity === 'none'
        ? 'no explicit inflation sensitivity'
        : `${words(exposure.inflationSensitivity)} inflation sensitivity`
    );
  }

  evidence.push('breadth classification', 'thesis-monitoring requirement');
  return sentenceList(evidence);
}


function resolveBoundaryExplanation({
  candidateSecurityId,
  factor,
  profile
}) {
  const job = words(profile.job);

  if (factor.status === 'not-evaluated') {
    return section(
      'Sleeve-rule alignment',
      'not-evaluated',
      `Strategy type, complexity, geography, breadth, and thesis-monitoring metadata were not evaluated after the category conflict with this sleeve's ${job} job.`
    );
  }

  const evidence = boundaryEvidence(candidateSecurityId, factor);

  if (factor.status === 'aligned') {
    return section(
      'Sleeve-rule alignment',
      'aligned',
      `The candidate's ${evidence} align with the structural rules for this sleeve's ${job} job.`
    );
  }

  const conflicts = Object.entries({
    assetClassFit: 'asset class',
    geographyFit: 'geography',
    complexityFit: 'complexity',
    strategyFit: 'strategy type',
    breadthFit: 'breadth classification',
    thesisMonitoringFit: 'thesis-monitoring requirement',
    incomeRoleFit: 'income role',
    inflationRoleFit: 'inflation sensitivity',
    durationFit: 'duration',
    creditQualityFit: 'credit quality'
  }).filter(([key]) => factor[key] === 'conflict')
    .map(([, label]) => label);

  return section(
    'Sleeve-rule alignment',
    'conflict',
    `Within this sleeve's ${job} job, the candidate's ${evidence} conflict on ${sentenceList(conflicts)}.`
  );
}


function resolveOverlapExplanation({
  decisionFactors,
  profile,
  sleeveLabelsById
}) {
  const job = words(profile.job);
  const overlap = decisionFactors.overlap;
  const crossSleeve = decisionFactors.crossSleeveRole;

  if (crossSleeve.status === 'conflict') {
    const holdings = securityLabels(
      crossSleeve.overlappingSecurityIds ?? []
    );
    const sleeves = sentenceList(
      (crossSleeve.overlappingSleeveIds ?? []).map(
        (sleeveId) => sleeveLabelsById[sleeveId] ?? 'another sleeve'
      )
    );

    return section(
      'Existing exposure',
      'overlapping',
      `${holdings} already represents the ${job} responsibility through the ${sleeves} sleeve, based on matching category-role metadata.`
    );
  }

  if ((overlap.overlappingSecurityIds ?? []).length > 0) {
    const holdings = securityLabels(overlap.overlappingSecurityIds);
    const dimensions = dimensionLabels(overlap.sharedDimensions ?? []);

    return section(
      'Existing exposure',
      'overlapping',
      `${holdings} already provides substantially similar exposure for the ${job} job based on shared ${dimensions || 'category-role'} metadata.`
    );
  }

  if (overlap.status === 'not-evaluated') {
    return section(
      'Existing exposure',
      'not-evaluated',
      `Holding overlap was not evaluated because an earlier rule determined the fit for this sleeve's ${job} job.`
    );
  }

  const dimensions = dimensionLabels(profile.overlapDimensions);
  return section(
    'Existing exposure',
    'none',
    `No existing holding materially overlaps the ${job} job across the relevant ${dimensions} metadata.`
  );
}


function advantageLabels(advantages) {
  return sentenceList(advantages.map(words));
}


function resolveDistinctExplanation({
  decisionFactors,
  profile,
  affectedSecurityId
}) {
  const factor = decisionFactors.distinctContribution;
  const job = words(profile.job);
  const categories = categoryLabels(factor.matchedCategoryIds ?? []);

  if (factor.status === 'missing-role-filled') {
    return section(
      'Distinct contribution',
      'contributing',
      `The candidate supplies the missing ${job} job through its ${categories} category classification.`
    );
  }

  if (factor.status === 'preserves-existing-role') {
    const advantages = advantageLabels(
      decisionFactors.replacement.advantages ?? []
    );
    return section(
      'Distinct contribution',
      'replacement-advantage',
      `The candidate preserves the ${job} job performed by ${securityLabel(affectedSecurityId)} while providing the documented ${advantages} structural advantage.`
    );
  }

  if (factor.status === 'not-evaluated') {
    return section(
      'Distinct contribution',
      'not-evaluated',
      `A distinct contribution was not evaluated after an earlier conflict with this sleeve's ${job} job.`
    );
  }

  return section(
    'Distinct contribution',
    'none',
    `No additional approved structural role for this sleeve's ${job} job was identified.`
  );
}


function primaryReason({
  outcome,
  reasonCode,
  profile,
  decisionFactors,
  affectedSecurityId
}) {
  const job = words(profile.job);
  const overlaps = decisionFactors.overlap.overlappingSecurityIds ?? [];

  if (outcome === 'add') {
    return `The candidate fills a missing permitted role for this sleeve's ${job} job.`;
  }
  if (outcome === 'replace') {
    const advantages = advantageLabels(
      decisionFactors.replacement.advantages ?? []
    );
    return `The candidate can replace ${securityLabel(affectedSecurityId)} within this sleeve because ${advantages} is an explainable structural advantage for the ${job} job.`;
  }
  if (outcome === 'redundant') {
    if (reasonCode === 'duplicate-security') {
      return `${securityLabels(overlaps)} is already present and performs this sleeve's ${job} job.`;
    }
    return `${securityLabels(overlaps)} already sufficiently performs this sleeve's ${job} job.`;
  }
  if (reasonCode === 'cross-sleeve-role-conflict') {
    const holdings = securityLabels(
      decisionFactors.crossSleeveRole.overlappingSecurityIds ?? []
    );
    return `Within this selected sleeve, the candidate would repeat the ${job} responsibility already represented by ${holdings} elsewhere in the portfolio.`;
  }
  if (reasonCode === 'sleeve-boundary-conflict') {
    return `Within this selected sleeve, the candidate does not satisfy the structural boundaries for the ${job} job.`;
  }

  return `Within this selected sleeve, the candidate does not perform the permitted ${job} job.`;
}


function allocationExplanation(outcome, affectedSecurityId) {
  if (outcome === 'add') {
    return 'The affected sleeve is reweighted to include the candidate.';
  }
  if (outcome === 'replace') {
    return `The affected sleeve is reweighted after ${securityLabel(affectedSecurityId)} is replaced by the candidate.`;
  }
  return 'The hypothetical allocation remains unchanged.';
}


export function resolveSecurityFitExplanation({
  outcome,
  reasonCode,
  decisionFactors,
  candidateSecurityId,
  affectedSecurityId = null,
  portfolioSystemId,
  variantId,
  targetSleeveId,
  sleeveLabelsById = {}
}) {
  const profile = resolveSleeveDecisionProfile({
    portfolioSystemId,
    variantId,
    sleeveId: targetSleeveId
  });

  if (!profile || !decisionFactors) {
    throw new TypeError(
      'Security-fit explanation requires resolved decision evidence'
    );
  }

  const roleAlignment = resolveRoleExplanation({
    candidateSecurityId,
    factor: decisionFactors.sleeveRole,
    profile
  });
  const boundaryAlignment = resolveBoundaryExplanation({
    candidateSecurityId,
    factor: decisionFactors.sleeveBoundary,
    profile
  });
  const overlap = resolveOverlapExplanation({
    decisionFactors,
    profile,
    sleeveLabelsById
  });
  const distinctContribution = resolveDistinctExplanation({
    decisionFactors,
    profile,
    affectedSecurityId
  });
  const resolvedPrimaryReason = primaryReason({
    outcome,
    reasonCode,
    profile,
    decisionFactors,
    affectedSecurityId
  });

  return deepFreeze({
    systemFitOutcome: outcome,
    roleAlignment,
    boundaryAlignment,
    overlap,
    distinctContribution,
    primaryReason: resolvedPrimaryReason,
    effectOnSleeve: resolvedPrimaryReason,
    effectOnPortfolio:
      overlap.status === 'overlapping'
        ? overlap.explanation
        : distinctContribution.explanation,
    allocationEffect: allocationExplanation(
      outcome,
      affectedSecurityId
    ),
    disclosure: SECURITY_FIT_DISCLOSURE
  });
}

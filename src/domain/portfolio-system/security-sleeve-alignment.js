import {
  getSecurityCategories
} from './security-category-universe.js';

import {
  getSecurityExposureProfile
} from './security-exposure-profiles.js';

import {
  resolveSleeveDecisionProfile
} from './sleeve-decision-profile-resolver.js';


const BROAD_CATEGORY_IDS = new Set([
  'global-equity',
  'broad-us-equity',
  'broad-international-equity',
  'developed-international-equity',
  'emerging-market-equity',
  'high-quality-bonds',
  'government-bonds',
  'short-government-securities',
  'cash-equivalent'
]);

const NARROW_CATEGORY_IDS = new Set([
  'sector-equity',
  'thematic-equity',
  'selected-equity'
]);

const STRATEGY_CLASSIFICATIONS = Object.freeze({
  'broad-equity': Object.freeze({
    breadth: 'broad',
    thesisMonitoring: 'low'
  }),
  'fixed-income': Object.freeze({
    breadth: 'targeted',
    thesisMonitoring: 'low'
  }),
  'style-equity': Object.freeze({
    breadth: 'targeted',
    thesisMonitoring: 'moderate'
  }),
  'income-equity': Object.freeze({
    breadth: 'targeted',
    thesisMonitoring: 'moderate'
  }),
  'systematic-factor': Object.freeze({
    breadth: 'targeted',
    thesisMonitoring: 'moderate'
  }),
  'real-asset': Object.freeze({
    breadth: 'targeted',
    thesisMonitoring: 'moderate'
  }),
  'income-strategy': Object.freeze({
    breadth: 'targeted',
    thesisMonitoring: 'moderate'
  }),
  'sector-equity': Object.freeze({
    breadth: 'narrow',
    thesisMonitoring: 'moderate'
  }),
  'thematic-equity': Object.freeze({
    breadth: 'narrow',
    thesisMonitoring: 'high'
  }),
  'alternative-strategy': Object.freeze({
    breadth: 'conditional',
    thesisMonitoring: 'high'
  })
});


function freezeArray(values) {
  return Object.freeze([...values]);
}


function freezeCheck({ actual, permitted, aligned, applicable = true }) {
  return Object.freeze({
    applicable,
    aligned,
    actual: Array.isArray(actual) ? freezeArray(actual) : actual,
    permitted: permitted === null
      ? null
      : freezeArray(permitted)
  });
}


function allPermitted(actual, permitted) {
  return actual.length > 0 &&
    actual.every((value) => permitted.includes(value));
}


function asValues(value) {
  if (Array.isArray(value)) {
    return value.filter(
      (entry) => entry !== null && entry !== undefined
    );
  }

  return value === null || value === undefined
    ? []
    : [value];
}


/**
 * Breadth is determined only by approved category and strategy
 * classifications. The number of exposure values is never considered.
 */
export function classifySecurityBreadth({
  categoryIds = [],
  strategyType
} = {}) {
  const strategyBreadth = STRATEGY_CLASSIFICATIONS[
    strategyType
  ]?.breadth ?? null;

  if (categoryIds.some((categoryId) =>
    NARROW_CATEGORY_IDS.has(categoryId)
  )) {
    return 'narrow';
  }

  if (
    strategyBreadth === 'narrow' ||
    strategyBreadth === 'conditional'
  ) {
    return strategyBreadth;
  }

  if (categoryIds.some((categoryId) =>
    BROAD_CATEGORY_IDS.has(categoryId)
  )) {
    return 'broad';
  }

  return strategyBreadth;
}


export function classifyThesisMonitoring(strategyType) {
  return STRATEGY_CLASSIFICATIONS[
    strategyType
  ]?.thesisMonitoring ?? null;
}


export function getSecurityStructuralFacts(securityId) {
  if (typeof securityId !== 'string') {
    return null;
  }

  const normalizedSecurityId = securityId.toLowerCase();
  const exposure = getSecurityExposureProfile(
    normalizedSecurityId
  );

  if (!exposure) {
    return null;
  }

  const categoryIds = getSecurityCategories(
    normalizedSecurityId
  );

  return Object.freeze({
    securityId: normalizedSecurityId,
    categoryIds,
    exposure,
    breadthClassification: classifySecurityBreadth({
      categoryIds,
      strategyType: exposure.strategyType
    }),
    thesisMonitoringLevel: classifyThesisMonitoring(
      exposure.strategyType
    )
  });
}


export function resolveSecuritySleeveAlignment({
  candidateSecurityId,
  portfolioSystemId,
  variantId,
  sleeveId
} = {}) {
  const profile = resolveSleeveDecisionProfile({
    portfolioSystemId,
    variantId,
    sleeveId
  });
  const facts = getSecurityStructuralFacts(candidateSecurityId);
  const conflicts = [];

  if (!profile) {
    conflicts.push('unresolved-sleeve-profile');
  }

  if (!facts) {
    conflicts.push('unknown-security');
  }

  const matchedCategoryIds = profile && facts
    ? facts.categoryIds.filter(
        (categoryId) =>
          profile.permittedCategoryIds.includes(categoryId)
      )
    : [];

  if (profile && facts && matchedCategoryIds.length === 0) {
    conflicts.push('category-not-permitted');
  }

  const aligned = conflicts.length === 0;

  return Object.freeze({
    aligned,
    candidateSecurityId: facts?.securityId ?? null,
    sleeveProfileId: profile?.profileId ?? null,
    matchedCategoryIds: freezeArray(matchedCategoryIds),
    matchedJob: aligned ? profile.job : null,
    matchedReturnRole: aligned ? profile.returnRole : null,
    conflicts: freezeArray(conflicts)
  });
}


function detectedCharacteristics(facts) {
  const characteristics = [];
  const { exposure } = facts;

  if (exposure.strategyType === 'thematic-equity') {
    characteristics.push('narrow-theme');
  }
  if (exposure.strategyType === 'sector-equity') {
    characteristics.push('single-sector');
  }
  if ([
    'thematic-equity',
    'sector-equity',
    'alternative-strategy'
  ].includes(exposure.strategyType)) {
    characteristics.push('thesis-dependent');
  }
  if (facts.thesisMonitoringLevel === 'high') {
    characteristics.push('high-monitoring');
  }
  if (asValues(exposure.creditQualities).includes(
    'below-investment-grade'
  )) {
    characteristics.push('below-investment-grade-credit');
  }
  if (exposure.durationBand === 'long') {
    characteristics.push('long-duration');
  }

  return [...new Set(characteristics)];
}


function addConflict(conflicts, code, dimension, actual, permitted) {
  conflicts.push(Object.freeze({
    code,
    dimension,
    actual: Array.isArray(actual) ? freezeArray(actual) : actual,
    permitted: permitted === null
      ? null
      : freezeArray(permitted)
  }));
}


export function resolveSecuritySleeveBoundaryAlignment(input = {}) {
  const profile = resolveSleeveDecisionProfile(input);
  const facts = getSecurityStructuralFacts(
    input.candidateSecurityId
  );
  const sleeveAlignment = resolveSecuritySleeveAlignment(input);

  if (!profile || !facts) {
    return Object.freeze({
      aligned: false,
      candidateSecurityId: facts?.securityId ?? null,
      sleeveProfileId: profile?.profileId ?? null,
      sleeveAlignment,
      checks: Object.freeze({}),
      detectedCharacteristics: Object.freeze([]),
      conflicts: Object.freeze(
        sleeveAlignment.conflicts.map((code) =>
          Object.freeze({
            code,
            dimension: 'readiness',
            actual: null,
            permitted: null
          })
        )
      )
    });
  }

  const { exposure } = facts;
  const conflicts = [];
  const assetClasses = asValues(exposure.assetClasses);
  const geographies = asValues(exposure.geographies);
  const creditQualities = asValues(exposure.creditQualities);
  const characteristics = detectedCharacteristics(facts);
  const prohibitedMatches = characteristics.filter(
    (characteristic) =>
      profile.prohibitedCharacteristics.includes(characteristic)
  );

  const checks = {
    category: freezeCheck({
      actual: facts.categoryIds,
      permitted: profile.permittedCategoryIds,
      aligned: sleeveAlignment.aligned
    }),
    assetClasses: freezeCheck({
      actual: assetClasses,
      permitted: profile.permittedAssetClasses,
      aligned: allPermitted(
        assetClasses,
        profile.permittedAssetClasses
      )
    }),
    geographies: freezeCheck({
      actual: geographies,
      permitted: profile.supportedGeographies,
      aligned: allPermitted(
        geographies,
        profile.supportedGeographies
      )
    }),
    strategyType: freezeCheck({
      actual: exposure.strategyType,
      permitted: profile.permittedStrategyTypes,
      aligned: profile.permittedStrategyTypes.includes(
        exposure.strategyType
      )
    }),
    complexity: freezeCheck({
      actual: exposure.complexity,
      permitted: profile.permittedComplexityLevels,
      aligned: profile.permittedComplexityLevels.includes(
        exposure.complexity
      )
    }),
    breadth: freezeCheck({
      actual: facts.breadthClassification,
      permitted: profile.permittedBreadthClassifications,
      aligned: profile.permittedBreadthClassifications.includes(
        facts.breadthClassification
      )
    }),
    thesisMonitoring: freezeCheck({
      actual: facts.thesisMonitoringLevel,
      permitted: profile.permittedThesisMonitoringLevels,
      aligned: profile.permittedThesisMonitoringLevels.includes(
        facts.thesisMonitoringLevel
      )
    }),
    incomeRole: freezeCheck({
      actual: exposure.incomeRole,
      permitted: profile.permittedIncomeRoles,
      aligned: profile.permittedIncomeRoles.includes(
        exposure.incomeRole
      )
    }),
    inflationSensitivity: freezeCheck({
      actual: exposure.inflationSensitivity,
      permitted: profile.permittedInflationSensitivities,
      aligned: profile.permittedInflationSensitivities.includes(
        exposure.inflationSensitivity
      )
    }),
    durationBand: freezeCheck({
      actual: exposure.durationBand,
      permitted: profile.permittedDurationBands,
      applicable: exposure.durationBand !== null,
      aligned: exposure.durationBand === null ||
        (
          profile.permittedDurationBands !== null &&
          profile.permittedDurationBands.includes(
            exposure.durationBand
          )
        )
    }),
    creditQualities: freezeCheck({
      actual: creditQualities,
      permitted: profile.permittedCreditQualities,
      applicable: creditQualities.length > 0,
      aligned: creditQualities.length === 0 ||
        (
          profile.permittedCreditQualities !== null &&
          allPermitted(
            creditQualities,
            profile.permittedCreditQualities
          )
        )
    }),
    prohibitedCharacteristics: freezeCheck({
      actual: characteristics,
      permitted: [],
      aligned: prohibitedMatches.length === 0
    })
  };

  const conflictDefinitions = [
    ['category', 'category-not-permitted'],
    ['assetClasses', 'asset-class-not-permitted'],
    ['geographies', 'geography-not-supported'],
    ['strategyType', 'strategy-type-not-permitted'],
    ['complexity', 'complexity-not-permitted'],
    ['breadth', 'breadth-not-compatible'],
    ['thesisMonitoring', 'thesis-monitoring-not-compatible'],
    ['incomeRole', 'income-role-not-compatible'],
    ['inflationSensitivity', 'inflation-role-not-compatible'],
    ['durationBand', 'duration-not-compatible'],
    ['creditQualities', 'credit-quality-not-compatible']
  ];

  for (const [dimension, code] of conflictDefinitions) {
    const check = checks[dimension];

    if (!check.aligned) {
      addConflict(
        conflicts,
        code,
        dimension,
        check.actual,
        check.permitted
      );
    }
  }

  for (const characteristic of prohibitedMatches) {
    addConflict(
      conflicts,
      'prohibited-characteristic',
      'prohibitedCharacteristics',
      characteristic,
      []
    );
  }

  return Object.freeze({
    aligned: conflicts.length === 0,
    candidateSecurityId: facts.securityId,
    sleeveProfileId: profile.profileId,
    sleeveAlignment,
    checks: Object.freeze(checks),
    detectedCharacteristics: freezeArray(characteristics),
    conflicts: freezeArray(conflicts)
  });
}

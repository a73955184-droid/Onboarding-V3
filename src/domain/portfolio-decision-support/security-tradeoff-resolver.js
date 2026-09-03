/**
 * Resolves evidence-backed structural benefits, costs, and changes.
 *
 * The resolver consumes Phase 3 contribution and overlap interpretation. It
 * does not choose an action, score a security, or reconstruct metadata.
 */

const DIMENSION_LABELS = Object.freeze({
  assetClasses: 'asset-class',
  geographies: 'geographic',
  marketCaps: 'market-cap',
  styles: 'style',
  factors: 'factor',
  sectors: 'sector',
  durationBand: 'duration',
  creditQualities: 'credit-quality',
  incomeRole: 'income-role',
  inflationSensitivity: 'inflation-role',
  strategyType: 'strategy',
  themes: 'thematic'
});


const VALUE_LABELS = Object.freeze({
  equity: 'equity',
  'fixed-income': 'fixed income',
  commodity: 'commodity',
  'real-asset': 'real asset',
  'united-states': 'U.S.',
  'ex-united-states': 'international',
  'developed-ex-united-states': 'developed international',
  'emerging-markets': 'emerging-markets',
  global: 'global',
  'large-cap': 'large',
  'mid-cap': 'mid-sized',
  'small-cap': 'small',
  'broad-equity': 'broad equity',
  'systematic-factor': 'systematic factor',
  'sector-equity': 'sector equity',
  'thematic-equity': 'thematic equity',
  'investment-grade': 'investment-grade',
  government: 'government',
  explicit: 'explicit',
  indirect: 'indirect'
});


function isPlainObject(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value);
}


function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}


function assertArray(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array`);
  }
}


function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return Object.freeze(value);
}


function humanize(value) {
  return VALUE_LABELS[value] ?? String(value).replaceAll('-', ' ');
}


function joinLabels(values) {
  const labels = values.map(humanize);

  if (labels.length <= 1) {
    return labels[0] ?? '';
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(', ')}, and ${labels.at(-1)}`;
}


function item({
  code,
  dimension = null,
  values = [],
  direction = null,
  explanation
}) {
  return {
    code,
    dimension,
    values: [...values],
    direction,
    explanation
  };
}


function uniqueItems(items) {
  const seen = new Set();

  return items.filter(({ code, dimension, values, direction }) => {
    const key = JSON.stringify([code, dimension, values, direction]);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}


function distinctExposureBenefits(evidence) {
  const definitions = [
    ['assetClasses', 'adds-asset-class-exposure'],
    ['geographies', 'adds-geographic-exposure'],
    ['marketCaps', 'adds-market-cap-exposure'],
    ['factors', 'adds-factor-exposure'],
    ['sectors', 'adds-sector-exposure'],
    ['durationBand', 'adds-duration-exposure'],
    ['creditQualities', 'adds-credit-quality-exposure'],
    ['themes', 'adds-thematic-exposure']
  ];

  return definitions.flatMap(([dimension, code]) => {
    const values = evidence.distinctDimensions[dimension]
      ?.candidateOnly ?? [];

    if (values.length === 0) {
      return [];
    }

    return [item({
      code,
      dimension,
      values,
      direction: 'add',
      explanation:
        `Adds ${joinLabels(values)} ${DIMENSION_LABELS[dimension]} exposure to this sleeve.`
    })];
  });
}


function roleBenefits(evidence) {
  const benefits = [];

  if (evidence.distinctRole.present) {
    benefits.push(item({
      code: 'adds-distinct-permitted-role',
      dimension: 'categoryRole',
      values: evidence.distinctRole.categoryIds,
      direction: 'add',
      explanation:
        'Adds a permitted structural role not currently represented in this sleeve.'
    }));
  }

  if (evidence.incrementalIncomeRole !== null) {
    benefits.push(item({
      code: 'adds-income-role',
      dimension: 'incomeRole',
      values: [evidence.incrementalIncomeRole],
      direction: 'add',
      explanation:
        `Adds a ${humanize(evidence.incrementalIncomeRole)} income role to this sleeve.`
    }));
  }

  if (evidence.incrementalInflationRole !== null) {
    benefits.push(item({
      code: 'adds-inflation-role',
      dimension: 'inflationSensitivity',
      values: [evidence.incrementalInflationRole],
      direction: 'add',
      explanation:
        `Adds ${humanize(evidence.incrementalInflationRole)} inflation sensitivity to this sleeve.`
    }));
  }

  return benefits;
}


function capConcentrationChanges(evidence) {
  const changes = [];
  const increased =
    evidence.incrementalCapExposure.increasedEmphasis;
  const reduced =
    evidence.incrementalCapExposure.reducedRelativeEmphasis;
  const isUsExposure = (
    evidence.sharedDimensions.geographies ?? []
  ).includes('united-states');

  if (increased.length > 0) {
    const geography = isUsExposure ? ' U.S.' : '';
    changes.push(item({
      code: 'increases-market-cap-emphasis',
      dimension: 'marketCaps',
      values: increased,
      direction: 'increase',
      explanation:
        `Increases emphasis on ${joinLabels(increased)}${geography} companies within the sleeve.`
    }));
  }

  if (reduced.length > 0) {
    changes.push(item({
      code: 'reduces-relative-market-cap-emphasis',
      dimension: 'marketCaps',
      values: reduced,
      direction: 'decrease-relative',
      explanation:
        `Reduces the relative contribution of ${joinLabels(reduced)} companies within the sleeve.`
    }));
  }

  return changes;
}


function overlapCost(interpretation) {
  if (![
    'near-interchangeable',
    'overlapping-but-additive'
  ].includes(interpretation.interpretation)) {
    return null;
  }

  const qualifier = {
    high: 'highly',
    medium: 'meaningfully',
    low: 'partially',
    none: ''
  }[interpretation.overlapLevel];
  const qualifiedOverlap = qualifier
    ? `${qualifier} overlapping`
    : 'overlapping';

  return item({
    code: 'adds-overlapping-holding',
    dimension: 'implementation',
    values: [],
    direction: 'increase',
    explanation:
      `Adds another ${qualifiedOverlap} holding to this sleeve.`
  });
}


function crossSleeveCost(interpretation) {
  if (interpretation.interpretation !== 'cross-sleeve-conflicting') {
    return null;
  }

  return item({
    code: 'duplicates-role-across-sleeves',
    dimension: 'categoryRole',
    values: interpretation.structuralEvidence.crossSleeveConflict
      .overlappingSecurityIds,
    direction: 'duplicate',
    explanation:
      'Duplicates a structural role already assigned to another sleeve.'
  });
}


function complexityTradeoffs(evidence) {
  const { direction, candidateLevel, existingLevels } =
    evidence.complexityChange;

  if (['unchanged', 'unresolved'].includes(direction)) {
    return [];
  }

  const explanation = {
    introduced:
      `Introduces a ${humanize(candidateLevel)}-complexity implementation to the sleeve.`,
    higher:
      `Raises implementation complexity from ${joinLabels(existingLevels)} to ${humanize(candidateLevel)}.`,
    lower:
      `Lowers implementation complexity from ${joinLabels(existingLevels)} to ${humanize(candidateLevel)}.`,
    mixed:
      `Changes implementation complexity relative to the sleeve's existing holdings.`
  }[direction];

  return [item({
    code: `${direction}-complexity`,
    dimension: 'complexity',
    values: [candidateLevel, ...existingLevels].filter(Boolean),
    direction,
    explanation
  })];
}


function sharedExposureItem(evidence, interpretation) {
  const dimensions = Object.keys(evidence.sharedDimensions);

  if (dimensions.length === 0) {
    return null;
  }

  const dimensionLabels = dimensions.map(
    (dimension) => DIMENSION_LABELS[dimension] ?? humanize(dimension)
  );
  const sharing = interpretation.overlapLevel === 'high'
    ? 'heavily shared'
    : 'shared';
  const isCoreUsEquity =
    (evidence.sharedDimensions.assetClasses ?? []).includes('equity') &&
    (evidence.sharedDimensions.geographies ?? [])
      .includes('united-states');
  const explanation = isCoreUsEquity
    ? `Core U.S. equity exposure remains ${sharing}.`
    : `${joinLabels(dimensionLabels)} exposure ${
        dimensions.length === 1 ? 'remains' : 'remain'
      } ${sharing}.`;

  return item({
    code: 'retains-shared-structural-exposure',
    dimension: 'multiple',
    values: dimensions,
    direction: 'unchanged',
    explanation
  });
}


function unchangedComplexityItem(evidence) {
  if (evidence.complexityChange.direction !== 'unchanged') {
    return null;
  }

  return item({
    code: 'retains-implementation-complexity',
    dimension: 'complexity',
    values: [evidence.complexityChange.candidateLevel].filter(Boolean),
    direction: 'unchanged',
    explanation: 'Implementation complexity remains similar.'
  });
}


function implementationChange(interpretation) {
  const explanations = {
    'adds-another-overlapping-holding':
      'Adds another implementation alongside overlapping target-sleeve exposure.',
    'introduces-first-target-sleeve-holding':
      'Introduces the first implementation in the target sleeve.',
    'adds-higher-complexity-holding':
      'Adds an implementation that is more complex than current target-sleeve holdings.',
    'adds-distinct-implementation':
      'Adds an implementation with limited existing target-sleeve coverage.',
    'duplicates-role-across-sleeves':
      'Extends a structural role across sleeves where upstream evidence assigns responsibility elsewhere.'
  };

  return item({
    code: interpretation.implementationEffect,
    dimension: 'implementation',
    values: [],
    direction: 'change',
    explanation: explanations[interpretation.implementationEffect]
  });
}


/**
 * Produces tradeoff evidence without selecting or implying an action.
 */
export function resolveSecurityTradeoffs({
  incrementalContributionEvidence,
  overlapInterpretation
} = {}) {
  assertPlainObject(
    incrementalContributionEvidence,
    'incrementalContributionEvidence'
  );
  assertPlainObject(overlapInterpretation, 'overlapInterpretation');
  assertPlainObject(
    incrementalContributionEvidence.sharedDimensions,
    'incrementalContributionEvidence.sharedDimensions'
  );
  assertPlainObject(
    incrementalContributionEvidence.distinctDimensions,
    'incrementalContributionEvidence.distinctDimensions'
  );
  assertPlainObject(
    incrementalContributionEvidence.distinctRole,
    'incrementalContributionEvidence.distinctRole'
  );
  assertPlainObject(
    incrementalContributionEvidence.incrementalCapExposure,
    'incrementalContributionEvidence.incrementalCapExposure'
  );
  assertPlainObject(
    incrementalContributionEvidence.complexityChange,
    'incrementalContributionEvidence.complexityChange'
  );
  assertPlainObject(
    overlapInterpretation.structuralEvidence,
    'overlapInterpretation.structuralEvidence'
  );
  assertArray(
    incrementalContributionEvidence.incrementalCapExposure
      .increasedEmphasis,
    'incrementalContributionEvidence.incrementalCapExposure.increasedEmphasis'
  );
  assertArray(
    incrementalContributionEvidence.incrementalCapExposure
      .reducedRelativeEmphasis,
    'incrementalContributionEvidence.incrementalCapExposure.reducedRelativeEmphasis'
  );

  const concentrationChanges = capConcentrationChanges(
    incrementalContributionEvidence
  );
  const complexityChanges = complexityTradeoffs(
    incrementalContributionEvidence
  );
  const benefits = uniqueItems([
    ...roleBenefits(incrementalContributionEvidence),
    ...distinctExposureBenefits(incrementalContributionEvidence),
    ...concentrationChanges.filter(
      ({ direction }) => direction === 'increase'
    ),
    ...complexityChanges.filter(
      ({ direction }) => direction === 'lower'
    )
  ]);
  const costs = uniqueItems([
    overlapCost(overlapInterpretation),
    crossSleeveCost(overlapInterpretation),
    ...concentrationChanges.filter(
      ({ direction }) => direction === 'decrease-relative'
    ),
    ...complexityChanges.filter(
      ({ direction }) => ['higher', 'mixed'].includes(direction)
    )
  ].filter(Boolean));
  const staysSimilar = [
    sharedExposureItem(
      incrementalContributionEvidence,
      overlapInterpretation
    ),
    unchangedComplexityItem(incrementalContributionEvidence)
  ].filter(Boolean);
  const whatChanges = uniqueItems([
    ...benefits,
    ...costs,
    ...complexityChanges,
    implementationChange(overlapInterpretation)
  ]);

  return deepFreeze({
    benefits,
    costs,
    whatChanges,
    whatStaysSimilar: staysSimilar,
    concentrationChanges,
    complexityChanges
  });
}

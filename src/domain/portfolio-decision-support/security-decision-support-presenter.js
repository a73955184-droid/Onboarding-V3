import {
  PHASE_1_SECURITY_REFERENCE
} from '../portfolio-system/security-reference.js';


const DIMENSION_LABELS = Object.freeze({
  assetClasses: 'asset type',
  geographies: 'markets and regions',
  marketCaps: 'company size',
  styles: 'investment style',
  factors: 'factor exposure',
  sectors: 'sector exposure',
  durationBand: 'bond duration',
  creditQualities: 'credit quality',
  incomeRole: 'income role',
  inflationSensitivity: 'inflation protection',
  strategyType: 'investment approach',
  themes: 'theme'
});


const VALUE_LABELS = Object.freeze({
  equity: 'equity',
  'fixed-income': 'bonds',
  'real-asset': 'real assets',
  commodity: 'commodities',
  'multi-asset': 'multiple asset types',
  'hybrid-security': 'hybrid securities',
  'united-states': 'U.S.',
  'ex-united-states': 'international markets',
  'developed-ex-united-states':
    'developed markets outside the U.S.',
  'emerging-markets': 'emerging markets',
  global: 'global markets',
  'large-cap': 'large companies',
  'mid-cap': 'mid-sized companies',
  'small-cap': 'small companies',
  'broad-equity': 'broad-market investing',
  'style-equity': 'style-focused investing',
  'income-equity': 'income-oriented equity investing',
  'systematic-factor': 'systematic factor investing',
  'sector-equity': 'sector-focused investing',
  'thematic-equity': 'theme-focused investing',
  'investment-grade': 'investment-grade bonds',
  government: 'government bonds',
  'below-investment-grade': 'below-investment-grade bonds',
  'ultra-short': 'ultra-short term',
  short: 'short term',
  intermediate: 'intermediate term',
  long: 'long term',
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  supporting: 'supporting',
  primary: 'primary',
  indirect: 'indirect',
  explicit: 'explicit'
});


const JOB_LABELS = Object.freeze({
  'primary-strategic-foundation': 'Long-term foundation',
  'geographic-diversification': 'Geographic diversification',
  'structural-equity-diversification': 'Equity diversification',
  'stability-and-resilience': 'Stability and resilience',
  'income-generation': 'Income generation',
  'inflation-protection': 'Inflation protection',
  'factor-improvement': 'Targeted portfolio improvement',
  'real-asset-diversification': 'Real-asset diversification',
  'alternative-strategy-diversification':
    'Alternative-strategy diversification',
  'supplemental-growth': 'Additional growth exposure',
  'conditional-tactical-allocation': 'Tactical allocation',
  'bounded-opportunity-research': 'Opportunity research',
  'capital-access': 'Ready access to cash'
});


const CONTRIBUTION_LABELS = Object.freeze({
  distinct: 'Adds a missing role',
  incremental: 'Adds a meaningful difference',
  'mostly-overlapping': 'Adds a limited difference',
  'no-meaningful-addition': 'Adds no meaningful difference',
  conflicting: 'Conflicts with this sleeve context'
});


const OVERLAP_LABELS = Object.freeze({
  'near-interchangeable': 'Very similar implementation',
  'overlapping-but-additive':
    'Shared exposure with a meaningful difference',
  distinct: 'Limited existing coverage',
  'cross-sleeve-conflicting': 'Role already assigned elsewhere'
});


function isPlainObject(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value);
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


function unique(values) {
  return [...new Set(values.filter(Boolean))];
}


function words(value) {
  return VALUE_LABELS[value] ?? String(value).replaceAll('-', ' ');
}


function joinWords(values) {
  const labels = unique(values.map(words));

  if (labels.length < 2) return labels[0] ?? '';
  if (labels.length === 2) return labels.join(' and ');
  return `${labels.slice(0, -1).join(', ')}, and ${labels.at(-1)}`;
}


function securityLabel(securityId) {
  const security = PHASE_1_SECURITY_REFERENCE[securityId];
  return security?.symbol ?? security?.ticker ?? securityId.toUpperCase();
}


function holdingIds(decisionSupport, scope) {
  const comparisons = scope === 'target'
    ? decisionSupport.structuralEvidence.overlap
      .targetSleeveComparisons
    : decisionSupport.structuralEvidence.overlap
      .crossSleeveComparisons;

  return unique(comparisons.filter(
    ({ overlap }) =>
      overlap.comparisonAvailable && overlap.overlapLevel !== 'none'
  ).map(({ holdingSecurityId }) => holdingSecurityId));
}


function exposureItems(entries, relationship) {
  return entries.map(({ dimension, values }) => {
    const presentedValues = joinWords(values);
    const dimensionLabel = DIMENSION_LABELS[dimension] ?? words(dimension);

    if (relationship === 'shared') {
      return dimension === 'strategyType'
        ? `Both use ${presentedValues}.`
        : `Both cover ${presentedValues} by ${dimensionLabel}.`;
    }

    return dimension === 'strategyType'
      ? `Adds a ${presentedValues} approach.`
      : `Adds ${presentedValues} by ${dimensionLabel}.`;
  });
}


function existingExposureItems(decisionSupport) {
  const targetIds = holdingIds(decisionSupport, 'target');
  const crossIds = holdingIds(decisionSupport, 'cross');
  const items = [];

  if (targetIds.length > 0) {
    items.push(
      `${joinWords(targetIds.map(securityLabel))} already provide${
        targetIds.length === 1 ? 's' : ''
      } related exposure in this sleeve.`
    );
  } else {
    items.push('This sleeve does not currently hold a similar investment.');
  }

  if (crossIds.length > 0) {
    items.push(
      `${joinWords(crossIds.map(securityLabel))} provide${
        crossIds.length === 1 ? 's' : ''
      } related exposure elsewhere in the portfolio.`
    );
  }

  return unique(items);
}


function contributionItems(decisionSupport) {
  const items = [{
    distinct:
      'This fills a role that is currently missing from the sleeve.',
    incremental:
      'This adds a meaningful difference while keeping much of the same exposure.',
    'mostly-overlapping':
      'Most of this exposure is already present, with only a limited difference.',
    'no-meaningful-addition':
      'This does not add a meaningful difference to the sleeve.',
    conflicting:
      'This does not match how the selected sleeve is intended to be used.'
  }[decisionSupport.contribution.level]];
  items.push(...exposureItems(
    decisionSupport.tradeoffs.distinctExposure,
    'distinct'
  ));
  items.push(...decisionSupport.tradeoffs.increasedEmphasis.map(
    ({ explanation }) => explanation
  ));
  return unique(items);
}


function overlapItems(decisionSupport) {
  const targetIds = holdingIds(decisionSupport, 'target');
  const crossIds = holdingIds(decisionSupport, 'cross');
  const items = exposureItems(
    decisionSupport.tradeoffs.sharedExposure,
    'shared'
  );

  if (targetIds.length > 0) {
    items.unshift(
      `The candidate overlaps with ${
        joinWords(targetIds.map(securityLabel))
      } in this sleeve.`
    );
  } else if (crossIds.length > 0) {
    items.unshift(
      `The candidate overlaps with ${
        joinWords(crossIds.map(securityLabel))
      } elsewhere in the portfolio.`
    );
  } else if (items.length === 0) {
    items.push('No material existing overlap was identified.');
  }

  return unique(items);
}


function mixChangeItems(decisionSupport) {
  const changes = [
    ...decisionSupport.tradeoffs.increasedEmphasis,
    ...decisionSupport.tradeoffs.reducedRelativeEmphasis
  ].map(({ explanation }) => explanation);

  return changes.length > 0
    ? unique(changes)
    : ['The sleeve’s overall mix would remain substantially the same.'];
}


function tradeoffItems(decisionSupport) {
  const changes = [];
  const codes = new Set(
    decisionSupport.tradeoffs.implementationChanges.map(({ code }) => code)
  );

  if (
    codes.has('adds-overlapping-holding') ||
    codes.has('adds-another-overlapping-holding')
  ) {
    changes.push('Adds another holding with much of the same exposure.');
  }

  const descriptions = {
    'introduces-first-target-sleeve-holding':
      'Introduces the first holding in this sleeve.',
    'adds-higher-complexity-holding':
      'Adds a holding that is more complex to monitor.',
    'adds-distinct-implementation':
      'Adds another holding with a different exposure pattern.',
    'duplicates-role-across-sleeves':
      'Repeats a role that is already assigned to another sleeve.',
    'introduced-complexity':
      'Introduces another implementation to maintain.',
    'higher-complexity':
      'Increases the complexity of the sleeve.',
    'lower-complexity':
      'Offers a less complex way to fill this role.',
    'mixed-complexity':
      'Changes the sleeve’s implementation complexity.'
  };

  for (const code of codes) {
    if (descriptions[code]) changes.push(descriptions[code]);
  }

  if (decisionSupport.contribution.level === 'conflicting') {
    changes.unshift(
      'The candidate does not match how this sleeve is intended to be used.'
    );
  }

  return changes.length > 0
    ? unique(changes)
    : ['No additional implementation tradeoff was identified.'];
}


function replacementTarget(decisionSupport) {
  return decisionSupport.structuralEvidence.replacement.find(
    ({ replacementJustified }) => replacementJustified
  )?.holdingSecurityId ?? null;
}


function actionPresentation(action, decisionSupport) {
  const ticker = decisionSupport.candidate?.ticker ?? 'the candidate';
  const targetId = replacementTarget(decisionSupport);
  const target = targetId ? securityLabel(targetId) : 'the existing holding';
  const presentations = {
    'keep-current': {
      label: 'Keep this sleeve as it is',
      description: 'Make no change to the sleeve’s current holdings.'
    },
    add: {
      label: `Include ${ticker}`,
      description:
        `Include ${ticker} alongside the sleeve’s current holdings.`
    },
    replace: {
      label: `Use ${ticker} instead of ${target}`,
      description:
        `Substitute ${ticker} for ${target} within this sleeve.`
    },
    'save-alternative': {
      label: 'Save as an alternative',
      description:
        `Keep ${ticker} available for later consideration without changing the sleeve.`
    },
    return: {
      label: 'Return without making a change',
      description: 'Leave this sleeve unchanged and review other choices.'
    }
  };

  return {
    action,
    ...presentations[action]
  };
}


function technicalDetails(decisionSupport) {
  const evidence = decisionSupport.structuralEvidence;
  const interpretation = evidence.overlap.interpretation;
  const dimensions = unique([
    ...decisionSupport.tradeoffs.sharedExposure,
    ...decisionSupport.tradeoffs.distinctExposure
  ].map(({ dimension }) => DIMENSION_LABELS[dimension] ?? words(dimension)));

  return [
    {
      label: 'Sleeve purpose',
      value: JOB_LABELS[decisionSupport.sleeveContext.job] ??
        words(decisionSupport.sleeveContext.job)
    },
    {
      label: 'Candidate contribution',
      value: CONTRIBUTION_LABELS[decisionSupport.contribution.level]
    },
    {
      label: 'Information check',
      value: evidence.readiness.ready ? 'Complete' : 'Incomplete'
    },
    {
      label: 'Sleeve rules',
      value: evidence.sleeveBoundary.aligned
        ? 'Aligned'
        : 'Not aligned'
    },
    {
      label: 'Existing coverage',
      value: OVERLAP_LABELS[interpretation.interpretation]
    },
    ...(dimensions.length > 0
      ? [{
          label: 'Evidence considered',
          value: joinWords(dimensions)
        }]
      : [])
  ];
}


function unavailablePresentation(decisionSupport) {
  const reasonCode = decisionSupport?.rationale?.reasonCodes?.[0];
  const message = {
    'unknown-security':
      'This investment does not have a verified catalogue record.',
    'incomplete-security-profile':
      'Some information needed for this comparison is still unresolved.',
    'missing-holdings-profile':
      'Some information about an existing holding is still unresolved.',
    'exact-eligibility-unavailable':
      'This investment’s eligibility for the selected sleeve is unresolved.',
    'unresolved-sleeve':
      'The selected portfolio sleeve could not be resolved.'
  }[reasonCode] ??
    'There is not enough verified information to complete this comparison.';

  return deepFreeze({
    status: 'unavailable',
    heading: 'Assessment unavailable',
    context: null,
    message,
    sections: [],
    actions: [{
      action: 'return',
      label: 'Return to available choices',
      description: 'Review another investment or sleeve.'
    }]
  });
}


/**
 * Translates a completed Phase 3 result into ordered novice-facing sections.
 * It does not infer decisions or alter structural evidence.
 */
export function presentSecurityDecisionSupport({
  decisionSupport
} = {}) {
  if (!isPlainObject(decisionSupport)) {
    throw new TypeError('decisionSupport must be an object');
  }

  if (decisionSupport.assessmentStatus === 'unavailable') {
    return unavailablePresentation(decisionSupport);
  }

  if (decisionSupport.assessmentStatus !== 'complete') {
    throw new TypeError('decisionSupport has an unknown assessment status');
  }

  const preferredAction = actionPresentation(
    decisionSupport.preferredAction,
    decisionSupport
  );
  const otherActions = decisionSupport.availableActions
    .filter((action) => action !== decisionSupport.preferredAction)
    .map((action) => actionPresentation(action, decisionSupport));

  return deepFreeze({
    status: 'complete',
    heading: 'Portfolio decision support',
    context:
      `${decisionSupport.candidate.ticker} for ${
        decisionSupport.sleeveContext.sleeveLabel
      }`,
    message:
      'The default reflects this portfolio system. Other listed choices remain valid when their tradeoffs are intentional.',
    sections: [
      {
        id: 'what-you-already-have',
        label: 'What you already have',
        items: existingExposureItems(decisionSupport)
      },
      {
        id: 'what-this-adds',
        label: 'What this adds',
        items: contributionItems(decisionSupport)
      },
      {
        id: 'where-they-overlap',
        label: 'Where they overlap',
        items: overlapItems(decisionSupport)
      },
      {
        id: 'how-your-mix-would-change',
        label: 'How your mix would change',
        items: mixChangeItems(decisionSupport)
      },
      {
        id: 'tradeoffs',
        label: 'Tradeoffs',
        items: tradeoffItems(decisionSupport)
      },
      {
        id: 'best-default',
        label: 'Best default for this sleeve',
        items: [decisionSupport.rationale.summary],
        action: preferredAction
      },
      {
        id: 'other-valid-choices',
        label: 'Other valid choices',
        items: otherActions.length > 0
          ? ['These choices remain available if their tradeoffs match your intent.']
          : ['No other action is available for this assessment.'],
        actions: otherActions
      },
      {
        id: 'assessment-details',
        label: 'See assessment details',
        optional: true,
        items: [],
        fields: technicalDetails(decisionSupport)
      }
    ],
    actions: decisionSupport.availableActions.map(
      (action) => actionPresentation(action, decisionSupport)
    )
  });
}

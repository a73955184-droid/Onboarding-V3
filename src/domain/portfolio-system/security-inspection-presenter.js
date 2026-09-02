import {
  PHASE_1_SECURITY_METADATA
} from './security-metadata.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';

import {
  getSecurityStructuralFacts,
  resolveSecuritySleeveAlignment,
  resolveSecuritySleeveBoundaryAlignment
} from './security-sleeve-alignment.js';

import {
  resolveSleeveDecisionProfile
} from './sleeve-decision-profile-resolver.js';


const VALUE_LABELS = Object.freeze({
  equity: 'Equity',
  'real-asset': 'Real asset',
  'fixed-income': 'Fixed income',
  commodity: 'Commodity',
  'multi-asset': 'Multi-asset',
  'hybrid-security': 'Hybrid security',
  global: 'Global',
  'ex-united-states': 'Outside the United States',
  'united-states': 'United States',
  'developed-ex-united-states':
    'Developed markets outside the United States',
  'emerging-markets': 'Emerging markets',
  'large-cap': 'Large cap',
  'mid-cap': 'Mid cap',
  'small-cap': 'Small cap',
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  broad: 'Broad',
  targeted: 'Targeted',
  narrow: 'Narrow',
  conditional: 'Conditional',
  'ultra-short': 'Ultra short',
  short: 'Short',
  intermediate: 'Intermediate',
  long: 'Long',
  government: 'Government',
  'investment-grade': 'Investment grade',
  mixed: 'Mixed',
  'below-investment-grade': 'Below investment grade',
  supporting: 'Supporting',
  primary: 'Primary',
  indirect: 'Indirect',
  explicit: 'Explicit'
});


const STRATEGY_LABELS = Object.freeze({
  'broad-equity': 'Broad-market strategy',
  'style-equity': 'Style-focused equity strategy',
  'income-equity': 'Income-oriented equity strategy',
  'systematic-factor': 'Systematic factor strategy',
  'sector-equity': 'Sector equity strategy',
  'thematic-equity': 'Thematic equity strategy',
  'fixed-income': 'Fixed-income strategy',
  'real-asset': 'Real-asset strategy',
  'alternative-strategy': 'Alternative strategy',
  'income-strategy': 'Income strategy'
});


const ASSESSMENT_CHECKS = Object.freeze([
  'Whether this role is already represented',
  'Whether a similar holding exists in another sleeve',
  'Whether including it would create unnecessary overlap',
  'Whether another holding is a replacement candidate'
]);


function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) deepFreeze(nested);
  return Object.freeze(value);
}


function title(value) {
  if (VALUE_LABELS[value]) return VALUE_LABELS[value];

  return String(value)
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}


function presentValues(value) {
  const values = Array.isArray(value) ? value : [value];

  return values
    .filter(
      (entry) =>
        entry !== null &&
        entry !== undefined &&
        entry !== '' &&
        entry !== 'unknown' &&
        entry !== 'none'
    )
    .map(title)
    .join(', ');
}


function field(label, value) {
  return value ? { label, value } : null;
}


function fields(values) {
  return values.filter(Boolean);
}


function roleValue(categoryId) {
  return title(categoryId);
}


function rolePresentation(value, emptyValue) {
  if (value === 'none') return emptyValue;
  return presentValues(value);
}


/**
 * Builds presentation-ready, pre-assessment facts for one candidate and
 * exact sleeve. It exposes no portfolio-fit outcome and compares no holdings.
 */
export function presentSecurityInspection({
  portfolioSystemId,
  variantId,
  sleeveId,
  categoryId,
  securityId
} = {}) {
  const normalizedSecurityId =
    typeof securityId === 'string'
      ? securityId.toLowerCase()
      : '';
  const security = PHASE_1_SECURITY_REFERENCE[normalizedSecurityId];
  const metadata = PHASE_1_SECURITY_METADATA[normalizedSecurityId];
  const facts = getSecurityStructuralFacts(normalizedSecurityId);
  const profile = resolveSleeveDecisionProfile({
    portfolioSystemId,
    variantId,
    sleeveId
  });

  if (!security || !metadata || !facts || !profile) return null;

  const alignment = resolveSecuritySleeveAlignment({
    candidateSecurityId: normalizedSecurityId,
    portfolioSystemId,
    variantId,
    sleeveId
  });
  const boundary = resolveSecuritySleeveBoundaryAlignment({
    candidateSecurityId: normalizedSecurityId,
    portfolioSystemId,
    variantId,
    sleeveId
  });
  const exposure = metadata.exposureProfile;
  const presentedCategoryId = categoryId ??
    alignment.matchedCategoryIds[0] ??
    metadata.categoryIds[0];
  const isEquity = exposure.assetClasses.includes('equity');
  const durationApplicable = profile.permittedDurationBands !== null;
  const creditApplicable = profile.permittedCreditQualities !== null;

  const structuralExposure = fields([
    field('Asset class', presentValues(exposure.assetClasses)),
    field('Geography', presentValues(exposure.geographies)),
    isEquity
      ? field('Market capitalization', presentValues(exposure.marketCaps))
      : null,
    isEquity ? field('Style', presentValues(exposure.styles)) : null,
    isEquity ? field('Factors', presentValues(exposure.factors)) : null,
    isEquity ? field('Sectors', presentValues(exposure.sectors)) : null,
    durationApplicable
      ? field('Duration', presentValues(exposure.durationBand))
      : null,
    creditApplicable
      ? field('Credit quality', presentValues(exposure.creditQualities))
      : null,
    field(
      'Strategy',
      STRATEGY_LABELS[exposure.strategyType] ??
        presentValues(exposure.strategyType)
    )
  ]);

  const implementationCharacter = fields([
    field('Complexity', presentValues(exposure.complexity)),
    field(
      'Income role',
      rolePresentation(exposure.incomeRole, 'No dedicated income role')
    ),
    field(
      'Inflation linkage',
      rolePresentation(
        exposure.inflationSensitivity,
        'No explicit inflation linkage'
      )
    ),
    field('Breadth', presentValues(facts.breadthClassification)),
    field(
      'Thesis monitoring',
      facts.thesisMonitoringLevel === 'low'
        ? 'Low monitoring requirement'
        : presentValues(facts.thesisMonitoringLevel)
    )
  ]);

  return deepFreeze({
    security: {
      ticker: security.ticker,
      name: security.name,
      sourceUrl: security.sourceUrl ?? null
    },
    sections: {
      role: {
        label: 'Role it can play',
        items: [roleValue(presentedCategoryId)]
      },
      structuralExposure: {
        label: 'Structural exposure',
        fields: structuralExposure
      },
      implementationCharacter: {
        label: 'Implementation character',
        fields: implementationCharacter
      },
      sleeveAlignment: {
        label: 'Sleeve alignment',
        fields: [
          field(
            'Permitted category',
            profile.permittedCategoryIds.includes(presentedCategoryId)
              ? 'Yes'
              : 'No'
          ),
          field('Supports', title(profile.job)),
          field(
            'Matches sleeve effort boundary',
            boundary.checks.complexity?.aligned ? 'Yes' : 'No'
          ),
          field(
            'Matches sleeve structural rules',
            alignment.aligned && boundary.aligned ? 'Yes' : 'No'
          )
        ]
      },
      assessmentChecks: {
        label: 'Assess fit will check',
        items: ASSESSMENT_CHECKS
      }
    }
  });
}

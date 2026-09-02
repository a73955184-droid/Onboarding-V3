import assert from 'node:assert/strict';

import {
  getMissingRequiredProfileFields,
  resolveSecurityAssessmentFieldRequirements
} from '../src/domain/portfolio-system/security-assessment-field-requirements.js';

import {
  resolveSecurityAssessmentReadiness
} from '../src/domain/portfolio-system/security-assessment-readiness.js';

import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';


const equityContext = {
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  sleeveId: 'usCore'
};

const equityRequirements =
  resolveSecurityAssessmentFieldRequirements(equityContext);

assert.ok(equityRequirements);
assert.ok(
  equityRequirements.requiredProfileFields.includes('marketCaps')
);
assert.ok(
  equityRequirements.requiredProfileFields.includes('styles')
);
assert.ok(
  equityRequirements.requiredProfileFields.includes('factors')
);
assert.equal(
  equityRequirements.requiredProfileFields.includes('durationBand'),
  false
);
assert.equal(
  equityRequirements.requiredProfileFields.includes('creditQualities'),
  false
);

const syntheticEquityProfile = {
  assetClasses: ['equity'],
  geographies: ['united-states'],
  marketCaps: ['large-cap'],
  styles: [],
  factors: [],
  sectors: [],
  durationBand: 'unknown',
  creditQualities: ['unknown'],
  strategyType: 'broad-equity',
  complexity: 'low',
  evidenceSourceUrls: ['https://example.test/equity']
};

assert.deepEqual(
  getMissingRequiredProfileFields({
    exposureProfile: syntheticEquityProfile,
    requiredProfileFields:
      equityRequirements.requiredProfileFields
  }),
  [],
  'Irrelevant bond fields must not block an equity assessment'
);

assert.equal(
  resolveSecurityAssessmentReadiness({
    ...equityContext,
    candidateSecurityId: 'vti',
    holdingSecurityIds: ['itot']
  }).ready,
  true
);


const incomeBondContext = {
  portfolioSystemId: 'BFO-intentional',
  variantId: 'intentional',
  sleeveId: 'income'
};

const incomeBondRequirements =
  resolveSecurityAssessmentFieldRequirements(
    incomeBondContext
  );

for (const field of [
  'assetClasses',
  'durationBand',
  'creditQualities',
  'incomeRole',
  'strategyType',
  'complexity'
]) {
  assert.ok(
    incomeBondRequirements.requiredProfileFields.includes(field),
    `Income bond assessment must require ${field}`
  );
}

const syntheticBondProfile = {
  assetClasses: ['fixed-income'],
  geographies: ['united-states'],
  durationBand: 'intermediate',
  creditQualities: ['unknown'],
  incomeRole: 'primary',
  strategyType: 'fixed-income',
  complexity: 'moderate',
  evidenceSourceUrls: ['https://example.test/bond']
};

assert.deepEqual(
  getMissingRequiredProfileFields({
    exposureProfile: syntheticBondProfile,
    requiredProfileFields:
      incomeBondRequirements.requiredProfileFields
  }),
  ['creditQualities']
);


const stabilityContext = {
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  sleeveId: 'stability'
};

const incompleteHolding = resolveSecurityAssessmentReadiness({
  ...stabilityContext,
  candidateSecurityId: 'bnd',
  holdingSecurityIds: ['vfmf']
});

assert.equal(incompleteHolding.ready, false);
assert.equal(incompleteHolding.subject, 'holdings');
assert.equal(
  incompleteHolding.missingFields[0].securityId,
  'vfmf'
);
assert.ok(
  incompleteHolding.missingFields[0].fields.includes(
    'durationBand'
  )
);
assert.ok(
  incompleteHolding.missingFields[0].fields.includes(
    'creditQualities'
  )
);


const unavailableFit = resolveSecurityPortfolioFit({
  portfolioSystemId: 'ES-essential',
  variantId: 'essential',
  targetSleeveId: 'stability',
  candidateSecurityId: 'bnd',
  holdingsBySleeve: {
    broadGrowthCore: ['vfmf']
  }
});

assert.equal(unavailableFit.assessmentStatus, 'unavailable');
assert.equal(unavailableFit.outcome, null);
assert.notEqual(unavailableFit.outcome, 'do-not-add');
assert.equal(
  unavailableFit.reasonCode,
  'missing-holdings-profile'
);
assert.equal('allocationBefore' in unavailableFit, false);
assert.equal('allocationAfter' in unavailableFit, false);

console.log(
  'Security assessment readiness test passed: exact sleeve profiles require relevant fields and stop missing data before fit or allocation.'
);


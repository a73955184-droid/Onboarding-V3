import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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


const opportunityContext = {
  portfolioSystemId: 'IP-engaged',
  variantId: 'engaged',
  sleeveId: 'selectedIncomeOpportunities'
};
const opportunityRequirements =
  resolveSecurityAssessmentFieldRequirements(
    opportunityContext
  );
const notApplicableDurationProfile = {
  assetClasses: ['fixed-income'],
  geographies: ['united-states'],
  marketCaps: null,
  styles: [],
  factors: [],
  sectors: null,
  durationBand: null,
  creditQualities: ['below-investment-grade'],
  incomeRole: 'primary',
  strategyType: 'income-strategy',
  complexity: 'moderate',
  evidenceSourceUrls: ['https://example.test/income-opportunity']
};

assert.ok(
  opportunityRequirements.requiredProfileFields.includes(
    'durationBand'
  )
);
assert.deepEqual(
  getMissingRequiredProfileFields({
    exposureProfile: notApplicableDurationProfile,
    requiredProfileFields:
      opportunityRequirements.requiredProfileFields
  }),
  [],
  'Verified absence and not-applicable values must remain ready'
);
assert.deepEqual(
  getMissingRequiredProfileFields({
    exposureProfile: {
      ...notApplicableDurationProfile,
      durationBand: 'unknown'
    },
    requiredProfileFields:
      opportunityRequirements.requiredProfileFields
  }),
  ['durationBand'],
  'Applicable but unresolved duration must remain missing'
);

const absentDurationProfile = {
  ...notApplicableDurationProfile
};
delete absentDurationProfile.durationBand;

assert.deepEqual(
  getMissingRequiredProfileFields({
    exposureProfile: absentDurationProfile,
    requiredProfileFields:
      opportunityRequirements.requiredProfileFields
  }),
  ['durationBand'],
  'An absent required duration must remain missing'
);

const nullDurationReadiness =
  resolveSecurityAssessmentReadiness({
    ...opportunityContext,
    candidateSecurityId: 'hyg'
  });
const nullDurationAdd = resolveSecurityPortfolioFit({
  ...opportunityContext,
  targetSleeveId: opportunityContext.sleeveId,
  candidateSecurityId: 'hyg',
  holdingsBySleeve: {}
});
const nullDurationDuplicate = resolveSecurityPortfolioFit({
  ...opportunityContext,
  targetSleeveId: opportunityContext.sleeveId,
  candidateSecurityId: 'hyg',
  holdingsBySleeve: {
    selectedIncomeOpportunities: ['hyg']
  }
});

assert.equal(nullDurationReadiness.ready, true);
assert.equal(nullDurationAdd.assessmentStatus, 'complete');
assert.equal(nullDurationAdd.outcome, 'add');
assert.equal(nullDurationDuplicate.assessmentStatus, 'complete');
assert.equal(nullDurationDuplicate.outcome, 'redundant');

for (const securityId of [
  'angl', 'bkln', 'faln', 'hyg', 'hylb', 'jnk', 'srln'
]) {
  assert.equal(
    resolveSecurityAssessmentReadiness({
      ...opportunityContext,
      candidateSecurityId: securityId
    }).ready,
    true,
    `${securityId} null duration must remain not applicable`
  );
}

const unresolvedDurationCandidate =
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'ES-essential',
    variantId: 'essential',
    targetSleeveId: 'stability',
    candidateSecurityId: 'bndw',
    holdingsBySleeve: {}
  });

assert.equal(
  unresolvedDurationCandidate.assessmentStatus,
  'unavailable'
);
assert.equal(
  unresolvedDurationCandidate.reasonCode,
  'incomplete-security-profile'
);
assert.equal(unresolvedDurationCandidate.outcome, null);
assert.ok(
  unresolvedDurationCandidate.missingFields[0].fields.includes(
    'durationBand'
  )
);
assert.equal('allocationBefore' in unresolvedDurationCandidate, false);
assert.equal('allocationAfter' in unresolvedDurationCandidate, false);

const requirementSource = readFileSync(
  new URL(
    '../src/domain/portfolio-system/security-assessment-field-requirements.js',
    import.meta.url
  ),
  'utf8'
);

for (const ticker of [
  'ANGL', 'BKLN', 'FALN', 'HYG', 'HYLB', 'JNK', 'SRLN'
]) {
  assert.doesNotMatch(
    requirementSource.toLowerCase(),
    new RegExp(`['\"]${ticker.toLowerCase()}['\"]`),
    'Readiness must not contain ticker-specific exceptions'
  );
}


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

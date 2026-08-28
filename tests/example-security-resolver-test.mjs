import assert from 'node:assert/strict';

import {
  EXAMPLE_SECURITY_ASSOCIATIONS,
  TACTICAL_FUND_DEFERRED_REASON
} from '../src/domain/portfolio-system/example-securities.js';

import {
  resolveExampleSecurities
} from '../src/domain/portfolio-system/example-security-resolver.js';


const globalCore = resolveExampleSecurities({
  archetypeId: 'ES',
  variantId: 'essential',
  sleeveId: 'broadGrowthCore'
});

assert.deepEqual(globalCore.map((result) => result.securityId), ['VT']);
assert.ok(Object.isFrozen(globalCore));
assert.ok(Object.isFrozen(globalCore[0]));
assert.ok(Object.isFrozen(globalCore[0].primaryRisks));
assert.ok(Object.isFrozen(globalCore[0].variantGuidance));
assert.equal(globalCore[0].variantGuidance.comparisonDepth, 'minimal');
assert.equal(globalCore[0].variantGuidance.monitoringBurden, 'low');

assert.deepEqual(
  resolveExampleSecurities({
    archetypeId: 'ES',
    variantId: 'essential',
    sleeveId: 'stability'
  }).map((result) => result.securityId),
  ['BND', 'AGG'],
  'Resolver must preserve deliberate alternative ordering'
);

assert.deepEqual(
  resolveExampleSecurities({
    archetypeId: 'ES',
    variantId: 'engaged',
    sleeveId: 'internationalCore'
  }).map((result) => result.securityId),
  ['VEA', 'VWO'],
  'Resolver must preserve category and security ordering'
);

const engaged = resolveExampleSecurities({
  archetypeId: 'GA',
  variantId: 'engaged',
  sleeveId: 'alternativeStrategy'
});

assert.equal(engaged[0].variantGuidance.comparisonDepth, 'detailed');
assert.equal(engaged[0].variantGuidance.monitoringBurden, 'high');
assert.ok(engaged.every((result) => result.exampleType === 'research-required'));

const pending = engaged.find((result) => result.securityId === 'QAI');
assert.ok(pending, 'Expected QAI alternative example');
assert.equal(pending.verificationStatus, 'pending');
assert.equal(pending.sourceUrl, null);

for (const invalidRequest of [
  {},
  { archetypeId: 'UNKNOWN', variantId: 'essential', sleeveId: 'stability' },
  { archetypeId: 'ES', variantId: 'unknown', sleeveId: 'stability' },
  { archetypeId: 'ES', variantId: 'essential', sleeveId: 'Stability' },
  { archetypeId: 'GD', variantId: 'essential', sleeveId: 'broadGrowthCore' }
]) {
  const result = resolveExampleSecurities(invalidRequest);
  assert.deepEqual(result, []);
  assert.ok(Object.isFrozen(result));
}

const firstResolution = resolveExampleSecurities({
  archetypeId: 'BFO',
  variantId: 'engaged',
  sleeveId: 'realAssets'
});

assert.throws(() => {
  firstResolution.push('mutation');
}, TypeError);

assert.throws(() => {
  firstResolution[0].name = 'mutation';
}, TypeError);

const secondResolution = resolveExampleSecurities({
  archetypeId: 'BFO',
  variantId: 'engaged',
  sleeveId: 'realAssets'
});

assert.deepEqual(secondResolution, firstResolution, 'Resolution must not mutate source records');

const tacticalDeferred = EXAMPLE_SECURITY_ASSOCIATIONS.find(
  (association) =>
    association.archetypeId === 'TO' &&
    association.variantId === 'engaged' &&
    association.sleeveId === 'tacticalAllocation' &&
    association.assetCategoryId === 'tactical-fund'
);

assert.ok(tacticalDeferred);
assert.deepEqual(tacticalDeferred.securityIds, []);
assert.equal(tacticalDeferred.relationship, 'deferred');
assert.equal(tacticalDeferred.deferredReason, TACTICAL_FUND_DEFERRED_REASON);

for (const association of EXAMPLE_SECURITY_ASSOCIATIONS.filter(
  (candidate) => candidate.relationship === 'alternatives'
)) {
  assert.match(association.implementationNote, /not imply that both are required holdings/i);
}

for (const association of EXAMPLE_SECURITY_ASSOCIATIONS.filter(
  (candidate) => candidate.assetCategoryId === 'real-assets'
)) {
  assert.equal(association.relationship, 'category-examples');
  assert.match(association.implementationNote, /neither interchangeable nor automatically additive/i);
}

console.log('Example security resolver test passed.');
console.log('Validated exact matching, ordering, immutability and propagation rules.');

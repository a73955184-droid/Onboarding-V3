import assert from 'node:assert/strict';

import {
  EXAMPLE_SECURITY_CONTEXTS
} from '../src/domain/portfolio-system/example-security-context.js';


const REQUIRED_STRING_FIELDS = [
  'portfolioJob',
  'whyItFits',
  'whyItMayNotFit',
  'diversificationContribution',
  'overlapCheck',
  'monitoring',
  'reconsiderWhen',
  'exampleType',
  'disclosure'
];

assert.ok(Object.isFrozen(EXAMPLE_SECURITY_CONTEXTS));
assert.equal(EXAMPLE_SECURITY_CONTEXTS.length, 197);

for (const context of EXAMPLE_SECURITY_CONTEXTS) {
  const label = [
    context.archetypeId,
    context.variantId,
    context.sleeveId,
    context.assetCategoryId,
    context.securityId
  ].join('/');

  assert.ok(Object.isFrozen(context), label + ': context must be frozen');

  for (const field of REQUIRED_STRING_FIELDS) {
    assert.equal(typeof context[field], 'string', label + ': missing ' + field);
    assert.ok(context[field].length > 0, label + ': empty ' + field);
  }

  assert.ok(Array.isArray(context.primaryRisks), label + ': risks must be an array');
  assert.ok(context.primaryRisks.length > 0, label + ': risks must not be empty');
  assert.ok(Object.isFrozen(context.primaryRisks), label + ': risks must be frozen');

  assert.match(
    context.whyItFits,
    /^For the .+ sleeve,/,
    label + ': fit reasoning must identify the exact sleeve'
  );

  assert.match(
    context.portfolioJob,
    /^[^:]+: .+/,
    label + ': portfolio job must identify the exact portfolio system'
  );
}

const contextsFor = (categoryId) =>
  EXAMPLE_SECURITY_CONTEXTS.filter(
    (context) => context.assetCategoryId === categoryId
  );

for (const categoryId of [
  'broad-international-equity',
  'developed-international-equity',
  'emerging-market-equity'
]) {
  for (const context of contextsFor(categoryId)) {
    assert.match(JSON.stringify(context), /currency-risk/);
    assert.match(JSON.stringify(context), /cross-market/i);
  }
}

for (const categoryId of [
  'high-quality-bonds',
  'government-bonds',
  'short-duration-bonds',
  'investment-grade-credit'
]) {
  for (const context of contextsFor(categoryId)) {
    assert.match(JSON.stringify(context), /interest-rate-risk/);
  }
}

for (const categoryId of [
  'small-value-equity',
  'diversified-factor-equity',
  'quality-factor-equity',
  'value-factor-equity',
  'style-equity'
]) {
  for (const context of contextsFor(categoryId)) {
    assert.match(JSON.stringify(context), /tracking-error/);
    assert.match(JSON.stringify(context), /underperform/i);
  }
}

for (const context of contextsFor('cash-equivalent')) {
  assert.match(context.whyItMayNotFit, /not cash or a bank deposit/i);
  assert.match(context.whyItMayNotFit, /traded security/i);
}

for (const context of contextsFor('income-equity')) {
  assert.match(context.whyItMayNotFit, /does not provide principal stability/i);
}

for (const context of contextsFor('alternative-strategy')) {
  assert.equal(context.exampleType, 'research-required');
  assert.match(JSON.stringify(context.primaryRisks), /leverage-risk/);
  assert.match(context.whyItMayNotFit, /complex/i);
}

for (const categoryId of [
  'sector-equity',
  'thematic-equity',
  'selected-equity'
]) {
  for (const context of contextsFor(categoryId)) {
    assert.equal(context.exampleType, 'research-required');
    assert.match(JSON.stringify(context), /concentrat/i);
  }
}

assert.ok(
  new Set(EXAMPLE_SECURITY_CONTEXTS.map((context) => context.portfolioJob)).size > 75,
  'Context should preserve substantial sleeve-specific portfolio-job variation'
);

console.log('Example security context test passed.');
console.log('Validated 197 exact contextual mappings and category-specific risk boundaries.');

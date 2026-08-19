import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  QUESTIONS
} from '../src/content/questions.js';

import {
  INVESTOR_NEED_TRACEABILITY_COPY
} from '../src/content/investor-need-traceability-copy.js';

import {
  CANONICAL_SYSTEM_CAPABILITIES,
  PORTFOLIO_SYSTEM_CAPABILITY_FULFILLMENT,
  PORTFOLIO_SYSTEM_IDS,
  toCanonicalCapabilityId
} from '../src/content/portfolio-system-capability-fulfillment-copy.js';

import {
  PORTFOLIO_ARCHETYPES
} from '../src/domain/portfolio-system/portfolio-archetypes.js';


const canonicalResponses = [];

for (const question of QUESTIONS) {
  for (const option of question.options) {
    const capability =
      INVESTOR_NEED_TRACEABILITY_COPY
        [question.screenKey]
        ?.[option.id]
        ?.systemCapability;

    assert.ok(
      capability,
      `${question.screenKey}.${option.id} must retain its canonical capability mapping`
    );

    canonicalResponses.push({
      id:
        toCanonicalCapabilityId(
          capability.label
        ),
      label:
        capability.label,
      questionId:
        question.screenKey,
      responseId:
        option.id
    });
  }
}


const canonicalCapabilityIds =
  canonicalResponses.map(
    capability => capability.id
  );
const uniqueCapabilityIds =
  new Set(
    canonicalCapabilityIds
  );
const archetypeIds =
  Object.keys(
    PORTFOLIO_ARCHETYPES
  );
const matrixCapabilityIds =
  Object.keys(
    PORTFOLIO_SYSTEM_CAPABILITY_FULFILLMENT
  );


assert.equal(
  canonicalResponses.length,
  43,
  'The eight quiz questions should expose 43 selectable responses'
);
assert.equal(
  uniqueCapabilityIds.size,
  43,
  'All 43 selectable responses currently have distinct canonical capabilities'
);
assert.deepEqual(
  PORTFOLIO_SYSTEM_IDS,
  ['ES', 'GD', 'FT', 'BFO', 'GA', 'TO', 'IP'],
  'The matrix should use the seven canonical portfolio-system IDs'
);
assert.deepEqual(
  new Set(PORTFOLIO_SYSTEM_IDS),
  new Set(archetypeIds),
  'Matrix portfolio-system IDs should match the canonical archetype source'
);
assert.deepEqual(
  CANONICAL_SYSTEM_CAPABILITIES.map(
    capability => ({
      id: capability.id,
      label: capability.label,
      questionId: capability.questionId,
      responseId: capability.responseId
    })
  ),
  canonicalResponses,
  'The exported capability inventory should derive exactly from traceability source'
);
assert.deepEqual(
  new Set(matrixCapabilityIds),
  uniqueCapabilityIds,
  'Matrix capability keys should exactly match the canonical capability inventory'
);


let fulfillmentEntryCount = 0;

for (const capabilityId of canonicalCapabilityIds) {
  const row =
    PORTFOLIO_SYSTEM_CAPABILITY_FULFILLMENT[
      capabilityId
    ];

  assert.ok(
    Object.isFrozen(row),
    `${capabilityId} fulfillment row should be frozen`
  );
  assert.deepEqual(
    new Set(Object.keys(row)),
    new Set(PORTFOLIO_SYSTEM_IDS),
    `${capabilityId} should contain exactly seven portfolio systems`
  );
  assert.equal(
    new Set(Object.values(row)).size,
    PORTFOLIO_SYSTEM_IDS.length,
    `${capabilityId} should describe all seven systems distinctly`
  );

  for (const archetypeId of PORTFOLIO_SYSTEM_IDS) {
    const copy = row[archetypeId];

    fulfillmentEntryCount += 1;

    assert.equal(
      typeof copy,
      'string',
      `${capabilityId}.${archetypeId} should be a string`
    );
    assert.ok(
      copy.trim().length > 0,
      `${capabilityId}.${archetypeId} should be non-empty`
    );
    assert.doesNotMatch(
      copy,
      /\b(?:TBD|TODO|placeholder|undefined|null)\b/i,
      `${capabilityId}.${archetypeId} should contain approved fulfillment copy`
    );
    assert.notEqual(
      copy.trim(),
      '-',
      `${capabilityId}.${archetypeId} should not be a placeholder dash`
    );
  }
}


assert.equal(
  matrixCapabilityIds.length,
  uniqueCapabilityIds.size,
  'Matrix capability count should equal canonical capability count'
);
assert.equal(
  fulfillmentEntryCount,
  uniqueCapabilityIds.size * PORTFOLIO_SYSTEM_IDS.length,
  'Total fulfillment entries should equal canonical capabilities × seven systems'
);
assert.equal(
  fulfillmentEntryCount,
  301,
  'The current canonical matrix should contain 301 fulfillment entries'
);


for (const [
  capabilityId,
  firstArchetypeId,
  secondArchetypeId
] of [
  ['bounded-experimentation-framework', 'ES', 'GA'],
  ['structured-engagement-framework', 'ES', 'TO'],
  ['near-term-capital-protection-framework', 'IP', 'GA'],
  ['fit-evaluation-framework', 'FT', 'BFO']
]) {
  const firstCopy =
    PORTFOLIO_SYSTEM_CAPABILITY_FULFILLMENT
      [capabilityId]
      [firstArchetypeId];
  const secondCopy =
    PORTFOLIO_SYSTEM_CAPABILITY_FULFILLMENT
      [capabilityId]
      [secondArchetypeId];

  assert.ok(firstCopy.trim());
  assert.ok(secondCopy.trim());
  assert.notEqual(
    firstCopy,
    secondCopy,
    `${capabilityId} should describe ${firstArchetypeId} and ${secondArchetypeId} distinctly`
  );
}


const portfolioSystemFitSource =
  readFileSync(
    new URL(
      '../src/features/recommendation/PortfolioSystemFitScreen.js',
      import.meta.url
    ),
    'utf8'
  );

assert.doesNotMatch(
  portfolioSystemFitSource,
  /portfolio-system-capability-fulfillment-copy|PORTFOLIO_SYSTEM_CAPABILITY_FULFILLMENT/,
  'The future fulfillment matrix must not be wired into PortfolioSystemFitScreen yet'
);


console.log(
  `Portfolio-system capability fulfillment tests passed: ${uniqueCapabilityIds.size} capabilities × ${PORTFOLIO_SYSTEM_IDS.length} systems = ${fulfillmentEntryCount} entries.`
);

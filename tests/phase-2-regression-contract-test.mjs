import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

import { route } from '../src/application/router.js';

import {
  QUESTIONS
} from '../src/content/questions.js';

import {
  ASSESSMENT_VERSION
} from '../src/domain/assessment-config.js';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  resolveEqualWeightAllocation
} from '../src/domain/portfolio-system/hypothetical-allocation-resolver.js';

import {
  PHASE_1_APPROVED_SECURITY_IDS,
  SECURITY_CATEGORY_UNIVERSE
} from '../src/domain/portfolio-system/security-category-universe.js';

import {
  PHASE_1_SECURITY_METADATA_RECORDS
} from '../src/domain/portfolio-system/security-metadata.js';

import {
  resolveSleeveDecisionProfile
} from '../src/domain/portfolio-system/sleeve-decision-profile-resolver.js';

import {
  resolveEligibleSecurities
} from '../src/domain/portfolio-system/sleeve-security-eligibility-resolver.js';

import {
  createPortfolioCurationSession,
  selectCurationCandidate
} from '../src/features/recommendation/portfolio-curation-session.js';


const ARCHETYPE_IDS = [
  'ES',
  'GD',
  'FT',
  'BFO',
  'GA',
  'TO',
  'IP'
];
const VARIANT_IDS = ['essential', 'intentional', 'engaged'];
const portfolios = Object.values(CONSTITUENT_PORTFOLIOS)
  .flatMap((variants) => Object.values(variants));
const sleeves = portfolios.flatMap(
  (portfolio) => portfolio.sleeves.map(
    (sleeve) => ({ portfolio, sleeve })
  )
);


// Approved universe and associations remain exact.
assert.equal(PHASE_1_APPROVED_SECURITY_IDS.length, 261);
assert.equal(new Set(PHASE_1_APPROVED_SECURITY_IDS).size, 261);
assert.equal(PHASE_1_SECURITY_METADATA_RECORDS.length, 261);
assert.equal(
  SECURITY_CATEGORY_UNIVERSE.reduce(
    (total, category) => total + category.securityIds.length,
    0
  ),
  307
);
assert.deepEqual(
  [...PHASE_1_APPROVED_SECURITY_IDS].sort(),
  PHASE_1_SECURITY_METADATA_RECORDS
    .map(({ securityId }) => securityId)
    .sort()
);


// All canonical systems and exact sleeve identities still resolve.
assert.deepEqual(Object.keys(CONSTITUENT_PORTFOLIOS), ARCHETYPE_IDS);
assert.equal(portfolios.length, 21);
assert.equal(sleeves.length, 107);

for (const archetypeId of ARCHETYPE_IDS) {
  assert.deepEqual(
    Object.keys(CONSTITUENT_PORTFOLIOS[archetypeId]),
    VARIANT_IDS
  );
}

assert.deepEqual(
  portfolios.map(({ id }) => id),
  ARCHETYPE_IDS.flatMap(
    (archetypeId) =>
      VARIANT_IDS.map((variantId) => `${archetypeId}-${variantId}`)
  )
);

for (const { portfolio, sleeve } of sleeves) {
  const profile = resolveSleeveDecisionProfile({
    portfolioSystemId: portfolio.id,
    variantId: portfolio.variantId,
    sleeveId: sleeve.id
  });

  assert.ok(
    profile,
    `${portfolio.id}/${portfolio.variantId}/${sleeve.id} must resolve`
  );
  assert.equal(profile.sleeveId, sleeve.id);
}


// Eligibility is browse-only: it creates neither holdings nor outcomes.
for (const { portfolio, sleeve } of sleeves) {
  const eligibility = resolveEligibleSecurities({
    portfolioSystemId: portfolio.id,
    variantId: portfolio.variantId,
    sleeveId: sleeve.id
  });

  for (const category of eligibility.categories) {
    for (const security of category.securities) {
      assert.equal(security.automaticallyHeld, false);
      assert.equal('outcome' in security, false);
    }
  }

  assert.equal('outcome' in sleeve, false);
}

for (const security of PHASE_1_SECURITY_METADATA_RECORDS) {
  assert.equal('outcome' in security, false);
}


// Curation begins empty and selection never generates an assessment.
const sessionSleeves = portfolios[0].sleeves.map((sleeve) => ({
  id: sleeve.id,
  assetCategories: sleeve.assetCategories.map((id) => ({ id }))
}));
const session = createPortfolioCurationSession(sessionSleeves);

for (const sleeve of sessionSleeves) {
  assert.deepEqual(session.holdingsBySleeve[sleeve.id], []);
  assert.equal(session.assessmentBySleeve[sleeve.id], null);
}

selectCurationCandidate(session, sessionSleeves[0].id, 'vt');
assert.equal(session.assessmentBySleeve[sessionSleeves[0].id], null);


// Equal weighting remains exact at full precision and display precision.
const thirds = resolveEqualWeightAllocation({
  sleeveWeight: 0.1,
  securityIds: ['vti', 'vbr', 'qual']
});

assert.deepEqual(
  thirds.holdings.map(({ weight }) => weight),
  [0.1 / 3, 0.1 / 3, 0.1 / 3]
);
assert.equal(thirds.totalWeight, 0.1);
assert.equal(
  thirds.holdings.reduce(
    (total, { displayWeight }) => total + displayWeight,
    0
  ),
  0.1
);


// Quiz identities and scoring remain on their canonical version.
const EXPECTED_QUESTION_OPTIONS = Object.freeze({
  setup: [
    'not_started', 'simple_start', 'etfs_stocks', 'collected', 'established'
  ],
  transition: [
    'what_to_do', 'doing_right', 'missing', 'change', 'compare'
  ],
  decisionStyle: ['start', 'pick', 'fit', 'sell', 'enough'],
  marketPsychology: ['balance', 'market', 'holding', 'idea', 'rarely'],
  evolution: ['understand', 'monitor', 'frequency', 'effort', 'experiment'],
  tradeoff: ['tell_me', 'occasional', 'periodic', 'explore', 'active'],
  age: ['under3', '3to5', '5to10', '10plus', 'multiple', 'unsure'],
  goals: [
    'start_confident', 'understand', 'monitor', 'act', 'choose', 'explore',
    'income'
  ]
});

assert.equal(ASSESSMENT_VERSION, '3.1.0');
assert.deepEqual(
  Object.fromEntries(
    QUESTIONS.map(({ screenKey, options }) => [
      screenKey,
      options.map(({ id }) => id)
    ])
  ),
  EXPECTED_QUESTION_OPTIONS
);

const scoringContract = QUESTIONS.map(({ screenKey, min, max, options }) => ({
  screenKey,
  min,
  max,
  options: options.map(({ id, scores }) => ({ id, scores }))
}));
const scoringFingerprint = crypto.createHash('sha256')
  .update(JSON.stringify(scoringContract))
  .digest('hex');

assert.equal(
  scoringFingerprint,
  'ed7bbb77ec3920af113e67192d7f23391ae8912bb8abbd47d30061fdefee2b0f'
);


// Route behavior and the dependency-free package boundary remain unchanged.
const routeCases = Object.freeze({
  '': { name: 'welcome' },
  '#/assessment/3': { name: 'assessment', step: 3 },
  '#/recommendation': { name: 'investor-profile' },
  '#/recommendation/profile': { name: 'investor-profile' },
  '#/recommendation/jobs': { name: 'investor-profile-jobs' },
  '#/recommendation/profile-jobs': { name: 'investor-profile-jobs' },
  '#/recommendation/system-fit': { name: 'portfolio-system-fit' },
  '#/recommendation/system': { name: 'investing-system' },
  '#/recommendation/portfolio': { name: 'portfolio-map' },
  '#/not-a-route': { name: 'welcome' }
});
const originalLocation = globalThis.location;

try {
  for (const [hash, expected] of Object.entries(routeCases)) {
    globalThis.location = { hash };
    assert.deepEqual(route(), expected);
  }
} finally {
  if (originalLocation === undefined) {
    delete globalThis.location;
  } else {
    globalThis.location = originalLocation;
  }
}

const packageJson = JSON.parse(fs.readFileSync(
  new URL('../package.json', import.meta.url),
  'utf8'
));

assert.deepEqual(
  Object.keys(packageJson).sort(),
  ['name', 'private', 'scripts', 'type']
);
assert.equal(packageJson.name, 'aaronbux-onboarding-v3-1');
assert.equal(packageJson.private, true);
assert.equal(packageJson.type, 'module');
assert.equal('dependencies' in packageJson, false);
assert.equal('devDependencies' in packageJson, false);

console.log(
  'Phase 2 regression contract test passed: catalogues, canonical identities, allocation, state, quiz scoring, routes and dependencies are preserved.'
);

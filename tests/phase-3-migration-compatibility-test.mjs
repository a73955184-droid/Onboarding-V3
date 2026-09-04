import assert from 'node:assert/strict';
import fs from 'node:fs';

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
  SECURITY_FIT_OUTCOMES
} from '../src/domain/portfolio-system/security-fit-constants.js';
import {
  PHASE_1_SECURITY_METADATA_RECORDS
} from '../src/domain/portfolio-system/security-metadata.js';
import {
  resolveSecurityPortfolioFit
} from '../src/domain/portfolio-system/security-portfolio-fit-resolver.js';
import {
  resolveSecurityDecisionSupport
} from '../src/domain/portfolio-decision-support/security-decision-support-resolver.js';
import {
  createPortfolioCurationSession,
  selectCurationCandidate
} from '../src/features/recommendation/portfolio-curation-session.js';


const read = (relativePath) => fs.readFileSync(
  new URL(relativePath, import.meta.url),
  'utf8'
);
const phase2Source = read(
  '../src/domain/portfolio-system/security-portfolio-fit-resolver.js'
);
const phase3Source = read(
  '../src/domain/portfolio-decision-support/security-decision-support-resolver.js'
);
const screenSource = read(
  '../src/features/recommendation/PortfolioMapScreen.js'
);
const curationSource = read(
  '../src/features/recommendation/portfolio-curation-session.js'
);
const phase3Directory = new URL(
  '../src/domain/portfolio-decision-support/',
  import.meta.url
);
const phase3Files = fs.readdirSync(phase3Directory)
  .filter((name) => name.endsWith('.js'));
const phase3Sources = Object.fromEntries(phase3Files.map((name) => [
  name,
  fs.readFileSync(new URL(name, phase3Directory), 'utf8')
]));


// Phase 2 remains callable and preserves all four terminal outcomes.
const phase2Fixtures = [
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'FT-intentional',
    variantId: 'intentional',
    targetSleeveId: 'smallValueImprovement',
    candidateSecurityId: 'avuv',
    holdingsBySleeve: {}
  }),
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'ES-essential',
    variantId: 'essential',
    targetSleeveId: 'stability',
    candidateSecurityId: 'bnd',
    holdingsBySleeve: { stability: ['lqd'] }
  }),
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'ES-intentional',
    variantId: 'intentional',
    targetSleeveId: 'usCore',
    candidateSecurityId: 'itot',
    holdingsBySleeve: { usCore: ['vti'] }
  }),
  resolveSecurityPortfolioFit({
    portfolioSystemId: 'GD-intentional',
    variantId: 'intentional',
    targetSleeveId: 'inflationResilience',
    candidateSecurityId: 'pave',
    holdingsBySleeve: {}
  })
];

assert.deepEqual(
  new Set(phase2Fixtures.map(({ outcome }) => outcome)),
  new Set(Object.values(SECURITY_FIT_OUTCOMES))
);
assert.equal(
  phase2Fixtures.every(({ assessmentStatus }) =>
    assessmentStatus === 'complete'
  ),
  true
);
assert.match(phase2Source, /@deprecated[\s\S]*Portfolio Map/);


// Portfolio Map owns only Phase 3 presentation and action dispatch.
assert.match(screenSource, /resolveSecurityDecisionSupport\(\{/);
assert.match(screenSource, /presentSecurityDecisionSupport\(\{/);
assert.doesNotMatch(screenSource, /resolveSecurityPortfolioFit/);
assert.doesNotMatch(screenSource, /security-portfolio-fit-resolver/);


// The Phase 3 composition API imports the authoritative Phase 2 primitives.
for (const primitiveModule of [
  'security-assessment-readiness',
  'sleeve-security-eligibility',
  'security-sleeve-alignment',
  'security-structural-overlap',
  'security-replacement-comparison',
  'sleeve-decision-profile-resolver'
]) {
  assert.match(
    phase3Source,
    new RegExp(`portfolio-system/${primitiveModule}\\.js`),
    `Phase 3 must reuse ${primitiveModule}`
  );
}
assert.doesNotMatch(
  phase3Source,
  /security-portfolio-fit-resolver|resolveSecurityPortfolioFit/
);


// No Phase 3 module redeclares an authoritative structural primitive.
for (const [fileName, source] of Object.entries(phase3Sources)) {
  for (const primitiveName of [
    'resolveSecurityAssessmentReadiness',
    'getExactSleeveSecurityEligibility',
    'resolveSecuritySleeveAlignment',
    'resolveSecuritySleeveBoundaryAlignment',
    'resolveSecurityStructuralOverlap',
    'resolveCrossSleeveRoleConflicts',
    'resolveSecurityReplacementComparison',
    'resolveSleeveDecisionProfile'
  ]) {
    assert.doesNotMatch(
      source,
      new RegExp(`(?:function|const|let|class)\\s+${primitiveName}\\b`),
      `${fileName} must not redeclare ${primitiveName}`
    );
  }
}


// Catalogue identities and counts remain unchanged across the migration.
const portfolios = Object.values(CONSTITUENT_PORTFOLIOS)
  .flatMap((variants) => Object.values(variants));
const sleeves = portfolios.flatMap(({ sleeves: instances }) => instances);

assert.equal(PHASE_1_APPROVED_SECURITY_IDS.length, 261);
assert.equal(PHASE_1_SECURITY_METADATA_RECORDS.length, 261);
assert.equal(
  SECURITY_CATEGORY_UNIVERSE.reduce(
    (count, { securityIds }) => count + securityIds.length,
    0
  ),
  307
);
assert.equal(portfolios.length, 21);
assert.equal(sleeves.length, 107);


// Assessment is read-only: selection and resolution create no holdings.
const session = createPortfolioCurationSession([{
  id: 'usCore',
  assetCategories: [{ id: 'broad-us-equity' }]
}]);

selectCurationCandidate(session, 'usCore', 'voo');
assert.deepEqual(session.holdingsBySleeve.usCore, []);
assert.equal(session.assessmentBySleeve.usCore, null);

const holdingsBySleeve = { usCore: ['vti'] };
const holdingsBefore = JSON.stringify(holdingsBySleeve);
const phase3Result = resolveSecurityDecisionSupport({
  portfolioSystemId: 'ES-intentional',
  variantId: 'intentional',
  targetSleeveId: 'usCore',
  candidateSecurityId: 'voo',
  holdingsBySleeve
});

assert.equal(JSON.stringify(holdingsBySleeve), holdingsBefore);
assert.equal('holdings' in phase3Result, false);
assert.equal('outcome' in phase3Result, false);
assert.deepEqual(session.holdingsBySleeve.usCore, []);


// Phase 3 and temporary curation add no persistence or brokerage behavior.
const statefulApiPattern =
  /localStorage|sessionStorage|indexedDB|XMLHttpRequest|WebSocket|fetch\s*\(|executeTrade|placeOrder|brokerageClient/;

for (const [fileName, source] of [
  ...Object.entries(phase3Sources),
  ['portfolio-curation-session.js', curationSource]
]) {
  assert.doesNotMatch(
    source,
    statefulApiPattern,
    `${fileName} must remain local, temporary decision support`
  );
}


// Equal weighting retains the established full- and display-precision rules.
const equalWeight = resolveEqualWeightAllocation({
  sleeveWeight: 0.1,
  securityIds: ['vti', 'vbr', 'qual']
});

assert.deepEqual(
  equalWeight.holdings.map(({ weight }) => weight),
  [0.1 / 3, 0.1 / 3, 0.1 / 3]
);
assert.equal(equalWeight.totalWeight, 0.1);
assert.equal(
  equalWeight.holdings.reduce(
    (total, { displayWeight }) => total + displayWeight,
    0
  ),
  0.1
);


console.log(
  'Phase 3 migration compatibility test passed: Phase 2 remains stable while Portfolio Map delegates user-facing semantics to Phase 3.'
);

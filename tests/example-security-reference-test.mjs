import assert from 'node:assert/strict';

import {
  SECURITY_REFERENCE
} from '../src/domain/portfolio-system/security-reference.js';

import {
  EXAMPLE_SECURITY_ASSOCIATIONS
} from '../src/domain/portfolio-system/example-securities.js';


const securities = Object.values(SECURITY_REFERENCE);

assert.equal(
  securities.length,
  37,
  'Expected the complete initial security universe'
);

assert.ok(
  Object.isFrozen(SECURITY_REFERENCE),
  'Security reference catalogue must be frozen'
);

const ids = new Set();
const symbols = new Set();

for (const security of securities) {
  assert.ok(
    Object.isFrozen(security),
    security.id + ': security record must be frozen'
  );

  assert.equal(
    security.id,
    security.symbol,
    security.id + ': symbol must match the stable security ID'
  );

  assert.ok(!ids.has(security.id), 'Duplicate security ID: ' + security.id);
  assert.ok(!symbols.has(security.symbol), 'Duplicate symbol: ' + security.symbol);

  ids.add(security.id);
  symbols.add(security.symbol);

  assert.ok(security.name, security.id + ': missing name');
  assert.ok(security.issuer, security.id + ': missing issuer');
  assert.ok(security.exposureSummary, security.id + ': missing exposure summary');
  assert.equal(security.verifiedAsOf, '2026-08-28');

  assert.ok(
    ['verified', 'pending'].includes(security.verificationStatus),
    security.id + ': invalid verification status'
  );

  if (security.verificationStatus === 'pending') {
    assert.equal(
      security.sourceUrl,
      null,
      security.id + ': pending verification must not carry an unverified issuer URL'
    );
  } else {
    assert.match(
      security.sourceUrl,
      /^https:\/\//,
      security.id + ': verified security must have an issuer URL'
    );
  }
}

assert.deepEqual(
  securities
    .filter((security) => security.verificationStatus === 'pending')
    .map((security) => security.id),
  ['QAI'],
  'Only QAI should retain pending issuer-page verification'
);

for (const securityId of ['MSFT', 'JPM']) {
  assert.equal(
    SECURITY_REFERENCE[securityId].securityType,
    'Individual equity'
  );

  const associations = EXAMPLE_SECURITY_ASSOCIATIONS.filter(
    (association) =>
      association.securityIds.includes(securityId)
  );

  assert.ok(associations.length > 0, securityId + ': expected research examples');

  for (const association of associations) {
    assert.equal(association.exampleType, 'research-required');
    assert.match(association.implementationNote, /not preselected portfolio holdings/i);
  }
}

console.log('Example security reference test passed.');
console.log('Validated 37 immutable security records with one pending verification.');

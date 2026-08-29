import assert from 'node:assert/strict';

import {
  PHASE_1_SECURITY_REFERENCE
} from '../src/domain/portfolio-system/security-reference.js';

import {
  SECURITY_EXPOSURE_PROFILES
} from '../src/domain/portfolio-system/security-exposure-profiles.js';


const securities = Object.values(
  PHASE_1_SECURITY_REFERENCE
);

assert.equal(securities.length, 267);
assert.equal(
  Object.keys(SECURITY_EXPOSURE_PROFILES).length,
  securities.length
);

for (const security of securities) {
  assert.equal(
    security.securityId,
    security.securityId.toLowerCase()
  );
  assert.equal(
    security.ticker,
    security.ticker.toUpperCase()
  );

  if (security.verificationStatus === 'verified') {
    assert.ok(security.sourceUrl);
    assert.ok(security.verifiedAt);
  }

  const profile =
    SECURITY_EXPOSURE_PROFILES[security.securityId];

  assert.ok(profile);
  assert.equal(profile.securityId, security.securityId);
  assert.equal(profile.verificationStatus, 'pending');
  assert.deepEqual(profile.assetClasses, ['unknown']);
  assert.deepEqual(profile.evidenceSourceUrls, []);
}

const unresolved = securities.filter(
  ({ name, issuer, sourceUrl }) =>
    !name || !issuer || !sourceUrl
);

assert.equal(unresolved.length, 231);

console.log(
  'Security exposure profile test passed: unresolved facts remain explicit and uninferred.'
);


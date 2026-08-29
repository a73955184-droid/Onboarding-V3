import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  PHASE_1_SECURITY_METADATA,
  PHASE_1_SECURITY_METADATA_RECORDS
} from '../src/domain/portfolio-system/security-metadata.js';
import {
  PHASE_1_SECURITY_REFERENCE,
  SECURITY_REFERENCE
} from '../src/domain/portfolio-system/security-reference.js';
import {
  SECURITY_EXPOSURE_PROFILES,
  SECURITY_EXPOSURE_PROFILE_FIELDS,
  getMissingExposureProfileFields
} from '../src/domain/portfolio-system/security-exposure-profiles.js';
import {
  COMPLEXITY_LEVELS,
  INCOME_ROLES,
  INFLATION_SENSITIVITIES
} from '../src/domain/portfolio-system/security-fit-constants.js';
import {
  SECURITY_CATEGORY_UNIVERSE
} from '../src/domain/portfolio-system/security-category-universe.js';

const manifest = JSON.parse(fs.readFileSync(
  new URL('../docs/specs/phase-1-security-metadata-manifest.json', import.meta.url),
  'utf8'
));
const approvedIds = manifest.securities.map(({ securityId }) => securityId);
const legacyOnlyIds = ['bndw', 'esgv', 'jpm', 'msft', 'soxx', 'vfmf'];

assert.equal(manifest.securities.length, 261);
assert.equal(PHASE_1_SECURITY_METADATA_RECORDS.length, 261);
assert.deepEqual(PHASE_1_SECURITY_METADATA_RECORDS, manifest.securities);
assert.deepEqual(Object.keys(PHASE_1_SECURITY_METADATA), approvedIds);
assert.equal(
  manifest.securities.reduce(
    (total, security) => total + security.categoryIds.length,
    0
  ),
  307
);

const manifestAssociations = manifest.securities.flatMap(
  ({ securityId, categoryIds }) =>
    categoryIds.map((categoryId) => `${categoryId}|${securityId}`)
).sort();
const runtimeAssociations = SECURITY_CATEGORY_UNIVERSE.flatMap(
  ({ categoryId, securityIds }) =>
    securityIds.map((securityId) => `${categoryId}|${securityId}`)
).sort();
assert.deepEqual(runtimeAssociations, manifestAssociations);

const securities = Object.values(PHASE_1_SECURITY_REFERENCE);
assert.equal(securities.length, 267);
assert.equal(Object.keys(SECURITY_EXPOSURE_PROFILES).length, securities.length);

for (const securityId of approvedIds) {
  const security = PHASE_1_SECURITY_REFERENCE[securityId];
  const metadata = PHASE_1_SECURITY_METADATA[securityId];
  const profile = SECURITY_EXPOSURE_PROFILES[securityId];

  assert.ok(security);
  assert.equal(security.verificationStatus, 'verified');
  assert.equal(security.ticker, metadata.ticker);
  assert.equal(security.name, metadata.name);
  assert.equal(security.issuer, metadata.issuer);
  assert.equal(security.sourceUrl, metadata.sourceUrl);
  assert.ok(profile);
  assert.equal(profile.verificationStatus, 'verified');
  assert.deepEqual(
    getMissingExposureProfileFields(securityId, SECURITY_EXPOSURE_PROFILE_FIELDS),
    []
  );
  assert.ok(INCOME_ROLES.includes(profile.incomeRole));
  assert.ok(INFLATION_SENSITIVITIES.includes(profile.inflationSensitivity));
  assert.ok(COMPLEXITY_LEVELS.includes(profile.complexity));

  for (const prohibitedField of [
    'outcome', 'assessmentStatus', 'allocationBefore', 'allocationAfter'
  ]) {
    assert.equal(prohibitedField in security, false);
    assert.equal(prohibitedField in metadata, false);
    assert.equal(prohibitedField in profile, false);
  }
}

assert.deepEqual(
  securities
    .filter(({ securityId }) => !approvedIds.includes(securityId))
    .map(({ securityId }) => securityId)
    .sort(),
  legacyOnlyIds
);

for (const securityId of legacyOnlyIds) {
  const profile = SECURITY_EXPOSURE_PROFILES[securityId];
  assert.equal(profile.verificationStatus, 'pending');
  assert.deepEqual(profile.assetClasses, ['unknown']);
  assert.deepEqual(profile.evidenceSourceUrls, []);
}

assert.equal(SECURITY_REFERENCE.QAI.verificationStatus, 'pending');
assert.equal(PHASE_1_SECURITY_REFERENCE.qai.verificationStatus, 'verified');
assert.equal(
  PHASE_1_SECURITY_REFERENCE.qai.sourceUrl,
  PHASE_1_SECURITY_METADATA.qai.sourceUrl
);

console.log(
  'Security metadata test passed: 261 manifest records, 307 associations, six isolated legacy records and an explicit QAI boundary.'
);

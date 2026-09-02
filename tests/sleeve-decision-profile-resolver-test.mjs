import assert from 'node:assert/strict';

import {
  CONSTITUENT_PORTFOLIOS
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  SECURITY_CATEGORY_IDS
} from '../src/domain/portfolio-system/security-category-universe.js';

import {
  SECURITY_EXPOSURE_PROFILE_FIELDS
} from '../src/domain/portfolio-system/security-exposure-profiles.js';

import {
  PHASE_1_SECURITY_METADATA
} from '../src/domain/portfolio-system/security-metadata.js';

import {
  SLEEVE_SECURITY_ELIGIBILITY
} from '../src/domain/portfolio-system/sleeve-security-eligibility.js';

import {
  SLEEVE_BOUNDARY_COMPATIBILITY,
  SLEEVE_DECISION_PROFILES,
  SLEEVE_DECISION_PROFILE_ASSIGNMENTS,
  SLEEVE_DECISION_PROFILE_VOCABULARY
} from '../src/domain/portfolio-system/sleeve-decision-profiles.js';

import {
  resolveSleeveDecisionProfile
} from '../src/domain/portfolio-system/sleeve-decision-profile-resolver.js';


const constituentSnapshot = JSON.stringify(
  CONSTITUENT_PORTFOLIOS
);

const portfolios = Object.values(
  CONSTITUENT_PORTFOLIOS
).flatMap(
  (variantMap) => Object.values(variantMap)
);

const sleeveInstances = portfolios.flatMap(
  (portfolio) => portfolio.sleeves.map(
    (sleeve) => ({ portfolio, sleeve })
  )
);

const exactKey = ({
  portfolioSystemId,
  variantId,
  sleeveId
}) => [
  portfolioSystemId,
  variantId,
  sleeveId
].join('|');

const expectedKeys = new Set(
  sleeveInstances.map(({ portfolio, sleeve }) =>
    exactKey({
      portfolioSystemId: portfolio.id,
      variantId: portfolio.variantId,
      sleeveId: sleeve.id
    })
  )
);

const assignmentKeys = SLEEVE_DECISION_PROFILE_ASSIGNMENTS.map(
  exactKey
);


assert.equal(portfolios.length, 21);
assert.equal(sleeveInstances.length, 107);
assert.equal(SLEEVE_DECISION_PROFILE_ASSIGNMENTS.length, 107);
assert.equal(new Set(assignmentKeys).size, 107);
assert.deepEqual(new Set(assignmentKeys), expectedKeys);

assert.ok(
  Object.keys(SLEEVE_DECISION_PROFILES).length <
    SLEEVE_DECISION_PROFILE_ASSIGNMENTS.length,
  'Decision criteria must be reused instead of copied per sleeve'
);

for (const assignment of SLEEVE_DECISION_PROFILE_ASSIGNMENTS) {
  assert.ok(
    SLEEVE_DECISION_PROFILES[assignment.profileId],
    exactKey(assignment) + ': unknown reusable profile'
  );
}

assert.deepEqual(
  new Set(
    SLEEVE_DECISION_PROFILE_ASSIGNMENTS.map(
      ({ profileId }) => profileId
    )
  ),
  new Set(Object.keys(SLEEVE_DECISION_PROFILES)),
  'Every reusable profile must be assigned to at least one sleeve'
);

assert.deepEqual(
  new Set(Object.keys(SLEEVE_BOUNDARY_COMPATIBILITY)),
  new Set(Object.keys(SLEEVE_DECISION_PROFILES)),
  'Every reusable profile must define boundary compatibility criteria'
);


for (const { portfolio, sleeve } of sleeveInstances) {
  const resolved = resolveSleeveDecisionProfile({
    portfolioSystemId: portfolio.id,
    variantId: portfolio.variantId,
    sleeveId: sleeve.id
  });

  assert.ok(
    resolved,
    `${portfolio.id}|${portfolio.variantId}|${sleeve.id}: missing profile`
  );
  assert.equal(resolved.portfolioSystemId, portfolio.id);
  assert.equal(resolved.archetypeId, portfolio.archetypeId);
  assert.equal(resolved.variantId, portfolio.variantId);
  assert.equal(resolved.sleeveId, sleeve.id);
  assert.deepEqual(
    resolved.permittedCategoryIds,
    sleeve.assetCategories
  );
  assert.ok(Object.isFrozen(resolved));
  assert.ok(Object.isFrozen(resolved.permittedCategoryIds));
}


for (const eligibility of SLEEVE_SECURITY_ELIGIBILITY.filter(
  ({ eligibilityStatus }) => eligibilityStatus === 'eligible'
)) {
  const resolved = resolveSleeveDecisionProfile({
    portfolioSystemId: eligibility.portfolioSystemId,
    variantId: eligibility.variantId,
    sleeveId: eligibility.sleeveId
  });
  const exposure = PHASE_1_SECURITY_METADATA[
    eligibility.securityId
  ]?.exposureProfile;

  assert.ok(resolved);
  assert.ok(exposure);

  for (const assetClass of exposure.assetClasses) {
    assert.ok(
      resolved.permittedAssetClasses.includes(assetClass),
      `${exactKey(eligibility)}|${eligibility.securityId}: disallowed asset class ${assetClass}`
    );
  }

  assert.ok(
    resolved.permittedStrategyTypes.includes(
      exposure.strategyType
    ),
    `${exactKey(eligibility)}|${eligibility.securityId}: disallowed strategy type ${exposure.strategyType}`
  );
  assert.ok(
    resolved.permittedComplexityLevels.includes(
      exposure.complexity
    ),
    `${exactKey(eligibility)}|${eligibility.securityId}: disallowed complexity ${exposure.complexity}`
  );

  for (const geography of exposure.geographies) {
    assert.ok(
      resolved.supportedGeographies.includes(geography),
      `${exactKey(eligibility)}|${eligibility.securityId}: unsupported geography ${geography}`
    );
  }
}


assert.equal(
  resolveSleeveDecisionProfile({
    portfolioSystemId: 'FT-intentional',
    variantId: 'engaged',
    sleeveId: 'durableCore'
  }),
  null,
  'A system ID must not fall through to another variant'
);

assert.equal(
  resolveSleeveDecisionProfile({
    portfolioSystemId: 'FT-engaged',
    variantId: 'intentional',
    sleeveId: 'durableCore'
  }),
  null,
  'A variant must not fall through to a matching sleeve in another system'
);

assert.equal(
  resolveSleeveDecisionProfile({
    portfolioSystemId: 'FT-engaged',
    variantId: 'engaged',
    sleeveId: 'smallValueImprovement'
  }),
  null,
  'A sleeve must not fall through to a neighboring variant'
);

assert.equal(
  resolveSleeveDecisionProfile({
    portfolioSystemId: 'ES-essential',
    variantId: 'essential',
    sleeveId: 'durableCore'
  }),
  null,
  'A sleeve must not fall through to another portfolio system'
);


function assertApprovedValues(values, vocabulary, label) {
  assert.ok(Array.isArray(values), label + ' must be an array');
  assert.ok(values.length > 0, label + ' must not be empty');
  assert.equal(
    new Set(values).size,
    values.length,
    label + ' must not contain duplicates'
  );

  for (const value of values) {
    assert.ok(
      vocabulary.includes(value),
      `${label} contains unapproved value: ${value}`
    );
  }
}


for (const [profileId, profile] of Object.entries(
  SLEEVE_DECISION_PROFILES
)) {
  assert.equal(profile.profileId, profileId);
  assert.ok(
    SLEEVE_DECISION_PROFILE_VOCABULARY.jobs.includes(
      profile.job
    )
  );
  assert.ok(
    SLEEVE_DECISION_PROFILE_VOCABULARY.returnRoles.includes(
      profile.returnRole
    )
  );

  assertApprovedValues(
    profile.permittedAssetClasses,
    SLEEVE_DECISION_PROFILE_VOCABULARY.assetClasses,
    profileId + '.permittedAssetClasses'
  );
  assertApprovedValues(
    profile.permittedStrategyTypes,
    SLEEVE_DECISION_PROFILE_VOCABULARY.strategyTypes,
    profileId + '.permittedStrategyTypes'
  );
  assertApprovedValues(
    profile.permittedComplexityLevels,
    SLEEVE_DECISION_PROFILE_VOCABULARY.complexityLevels,
    profileId + '.permittedComplexityLevels'
  );
  assertApprovedValues(
    profile.supportedGeographies,
    SLEEVE_DECISION_PROFILE_VOCABULARY.geographies,
    profileId + '.supportedGeographies'
  );
  assertApprovedValues(
    profile.prohibitedCharacteristics,
    SLEEVE_DECISION_PROFILE_VOCABULARY.prohibitedCharacteristics,
    profileId + '.prohibitedCharacteristics'
  );
  assertApprovedValues(
    profile.overlapDimensions,
    SLEEVE_DECISION_PROFILE_VOCABULARY.overlapDimensions,
    profileId + '.overlapDimensions'
  );

  for (const dimension of profile.overlapDimensions) {
    assert.ok(
      SECURITY_EXPOSURE_PROFILE_FIELDS.includes(dimension),
      `${profileId} references unknown exposure field: ${dimension}`
    );
  }

  assert.ok(Object.isFrozen(profile));

  const boundary = SLEEVE_BOUNDARY_COMPATIBILITY[profileId];

  assertApprovedValues(
    boundary.permittedBreadthClassifications,
    SLEEVE_DECISION_PROFILE_VOCABULARY.breadthClassifications,
    profileId + '.permittedBreadthClassifications'
  );
  assertApprovedValues(
    boundary.permittedThesisMonitoringLevels,
    SLEEVE_DECISION_PROFILE_VOCABULARY.thesisMonitoringLevels,
    profileId + '.permittedThesisMonitoringLevels'
  );
  assertApprovedValues(
    boundary.permittedIncomeRoles,
    SLEEVE_DECISION_PROFILE_VOCABULARY.incomeRoles,
    profileId + '.permittedIncomeRoles'
  );
  assertApprovedValues(
    boundary.permittedInflationSensitivities,
    SLEEVE_DECISION_PROFILE_VOCABULARY.inflationSensitivities,
    profileId + '.permittedInflationSensitivities'
  );

  if (boundary.permittedDurationBands !== null) {
    assertApprovedValues(
      boundary.permittedDurationBands,
      SLEEVE_DECISION_PROFILE_VOCABULARY.durationBands,
      profileId + '.permittedDurationBands'
    );
  }

  if (boundary.permittedCreditQualities !== null) {
    assertApprovedValues(
      boundary.permittedCreditQualities,
      SLEEVE_DECISION_PROFILE_VOCABULARY.creditQualities,
      profileId + '.permittedCreditQualities'
    );
  }
}


for (const { portfolio, sleeve } of sleeveInstances) {
  const resolved = resolveSleeveDecisionProfile({
    portfolioSystemId: portfolio.id,
    variantId: portfolio.variantId,
    sleeveId: sleeve.id
  });

  assertApprovedValues(
    resolved.permittedCategoryIds,
    SECURITY_CATEGORY_IDS,
    exactKey(resolved) + '.permittedCategoryIds'
  );
}


assert.equal(
  JSON.stringify(CONSTITUENT_PORTFOLIOS),
  constituentSnapshot,
  'Resolving decision profiles must not change constituent portfolios'
);

console.log(
  'Sleeve decision profile resolver test passed: 107 exact sleeves use reusable, vocabulary-safe criteria without fallback or constituent mutation.'
);

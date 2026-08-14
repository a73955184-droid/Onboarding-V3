import assert from 'node:assert/strict';

import {
  getConstituentPortfolio,
  getAvailablePortfolioVariants
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  CLAIM_TYPES,
  SYSTEM_ROLES,
  EVIDENCE_TAGS
} from '../src/domain/portfolio-philosophy/philosophy-constants.js';

import {
  PHILOSOPHY_SOURCES
} from '../src/domain/portfolio-philosophy/philosophy-sources.js';

import {
  ARCHETYPE_PHILOSOPHIES
} from '../src/domain/portfolio-philosophy/archetype-philosophies.js';

import {
  VARIANT_PHILOSOPHIES
} from '../src/domain/portfolio-philosophy/variant-philosophies.js';

import {
  SLEEVE_PHILOSOPHIES
} from '../src/domain/portfolio-philosophy/sleeve-philosophies.js';


const ARCHETYPES = [
  'ES',
  'GD',
  'FT',
  'BFO',
  'GA',
  'TO',
  'IP'
];

const VARIANTS = [
  'essential',
  'intentional',
  'engaged'
];

const VALID_CLAIM_TYPES = new Set(
  Object.values(CLAIM_TYPES)
);

const VALID_SYSTEM_ROLES = new Set(
  Object.values(SYSTEM_ROLES)
);

const VALID_EVIDENCE_TAGS = new Set(
  Object.values(EVIDENCE_TAGS)
);


function validateSourceIds(sourceIds, context) {
  assert.ok(
    Array.isArray(sourceIds),
    context + ': sourceIds must be an array'
  );

  for (const sourceId of sourceIds) {
    assert.ok(
      PHILOSOPHY_SOURCES[sourceId],
      context + ': unknown sourceId "' + sourceId + '"'
    );
  }
}


function validateEvidenceTags(tags, context) {
  assert.ok(
    Array.isArray(tags),
    context + ': allowedEvidenceTags must be an array'
  );

  for (const tag of tags) {
    assert.ok(
      VALID_EVIDENCE_TAGS.has(tag),
      context + ': unknown evidence tag "' + tag + '"'
    );
  }
}


/*
 * ------------------------------------------------------------
 * 1. Verify source corpus
 * ------------------------------------------------------------
 */

for (const [sourceId, source] of Object.entries(PHILOSOPHY_SOURCES)) {
  assert.equal(
    source.id,
    sourceId,
    'Source key/id mismatch for ' + sourceId
  );

  assert.ok(
    source.organization,
    sourceId + ': missing organization'
  );

  assert.ok(
    source.title,
    sourceId + ': missing title'
  );

  assert.ok(
    source.url,
    sourceId + ': missing url'
  );

  assert.ok(
    Array.isArray(source.principles),
    sourceId + ': principles must be an array'
  );
}


/*
 * ------------------------------------------------------------
 * 2. Verify all 7 archetype philosophies
 * ------------------------------------------------------------
 */

for (const archetypeId of ARCHETYPES) {
  const philosophy = ARCHETYPE_PHILOSOPHIES[archetypeId];

  assert.ok(
    philosophy,
    'Missing archetype philosophy for ' + archetypeId
  );

  assert.equal(
    philosophy.archetypeId,
    archetypeId,
    'Archetype ID mismatch for ' + archetypeId
  );

  assert.ok(
    philosophy.philosophyName,
    archetypeId + ': missing philosophyName'
  );

  assert.ok(
    philosophy.summary,
    archetypeId + ': missing summary'
  );

  assert.ok(
    Array.isArray(philosophy.governingPrinciples),
    archetypeId + ': governingPrinciples must be an array'
  );

  validateSourceIds(
    philosophy.sourceIds || [],
    archetypeId + ' archetype'
  );

  assert.ok(
    VALID_CLAIM_TYPES.has(philosophy.claimType),
    archetypeId + ': invalid claimType "' + philosophy.claimType + '"'
  );
}


/*
 * ------------------------------------------------------------
 * 3. Verify the 3 global variant philosophies
 * ------------------------------------------------------------
 */

for (const variantId of VARIANTS) {
  const philosophy = VARIANT_PHILOSOPHIES[variantId];

  assert.ok(
    philosophy,
    'Missing variant philosophy for ' + variantId
  );

  assert.equal(
    philosophy.variantId,
    variantId,
    'Variant ID mismatch for ' + variantId
  );

  assert.ok(
    philosophy.philosophyName,
    variantId + ': missing philosophyName'
  );

  assert.ok(
    philosophy.summary,
    variantId + ': missing summary'
  );

  assert.ok(
    philosophy.characteristics,
    variantId + ': missing characteristics'
  );

  assert.ok(
    VALID_CLAIM_TYPES.has(philosophy.claimType),
    variantId + ': invalid claimType "' + philosophy.claimType + '"'
  );
}


/*
 * ------------------------------------------------------------
 * 4. Verify existing portfolio system still exposes 7 x 3
 * ------------------------------------------------------------
 */

for (const archetypeId of ARCHETYPES) {
  const availableVariants =
    getAvailablePortfolioVariants(archetypeId);

  assert.deepEqual(
    [...availableVariants].sort(),
    [...VARIANTS].sort(),
    archetypeId + ': current portfolio implementation does not expose all 3 variants'
  );
}


/*
 * ------------------------------------------------------------
 * 5. Verify philosophy coverage against REAL constituent IDs
 *
 * Existing constituent-portfolios.js is authoritative.
 * We do not change constituent IDs to satisfy philosophy data.
 * ------------------------------------------------------------
 */

let portfolioCount = 0;
let constituentSleeveCount = 0;
let philosophySleeveCount = 0;

for (const archetypeId of ARCHETYPES) {
  const archetypeSleeveMap =
    SLEEVE_PHILOSOPHIES[archetypeId];

  assert.ok(
    archetypeSleeveMap,
    'Missing sleeve philosophy archetype ' + archetypeId
  );

  for (const variantId of VARIANTS) {
    portfolioCount += 1;

    const portfolio =
      getConstituentPortfolio(archetypeId, variantId);

    assert.ok(
      portfolio,
      archetypeId + '/' + variantId + ': constituent portfolio not found'
    );

    assert.ok(
      Array.isArray(portfolio.sleeves),
      archetypeId + '/' + variantId + ': sleeves must be an array'
    );

    const philosophySleeves =
      archetypeSleeveMap[variantId];

    assert.ok(
      philosophySleeves,
      archetypeId + '/' + variantId + ': missing sleeve philosophy variant'
    );

    const realSleeveIds =
      portfolio.sleeves.map((sleeve) => sleeve.id);

    const philosophySleeveIds =
      Object.keys(philosophySleeves);

    constituentSleeveCount += realSleeveIds.length;
    philosophySleeveCount += philosophySleeveIds.length;

    /*
     * Every real constituent sleeve must have philosophy metadata.
     */
    for (const sleeveId of realSleeveIds) {
      assert.ok(
        philosophySleeves[sleeveId],
        archetypeId +
          '/' +
          variantId +
          ': missing philosophy for real sleeve "' +
          sleeveId +
          '"'
      );
    }

    /*
     * Philosophy corpus must not invent sleeves that do not exist.
     */
    for (const sleeveId of philosophySleeveIds) {
      assert.ok(
        realSleeveIds.includes(sleeveId),
        archetypeId +
          '/' +
          variantId +
          ': philosophy contains unknown sleeve "' +
          sleeveId +
          '"'
      );
    }

    /*
     * Portfolio weights remain an existing-code invariant.
     * Philosophy corpus does not participate in allocation.
     */
    const totalWeight = portfolio.sleeves.reduce(
      (sum, sleeve) => sum + sleeve.weight,
      0
    );

    assert.ok(
      Math.abs(totalWeight - 1) < 0.0001,
      archetypeId +
        '/' +
        variantId +
        ': existing constituent weights do not sum to 1'
    );
  }
}


/*
 * ------------------------------------------------------------
 * 6. Validate each sleeve philosophy record itself
 * ------------------------------------------------------------
 */

for (const [archetypeId, variantMap] of Object.entries(
  SLEEVE_PHILOSOPHIES
)) {
  assert.ok(
    ARCHETYPES.includes(archetypeId),
    'Unknown philosophy archetype "' + archetypeId + '"'
  );

  for (const [variantId, sleeveMap] of Object.entries(variantMap)) {
    assert.ok(
      VARIANTS.includes(variantId),
      archetypeId + ': unknown philosophy variant "' + variantId + '"'
    );

    for (const [sleeveId, philosophy] of Object.entries(sleeveMap)) {
      const context =
        archetypeId + '/' + variantId + '/' + sleeveId;

      assert.ok(
        VALID_SYSTEM_ROLES.has(philosophy.systemRole),
        context +
          ': invalid systemRole "' +
          philosophy.systemRole +
          '"'
      );

      assert.ok(
        philosophy.philosophy,
        context + ': missing philosophy object'
      );

      assert.ok(
        philosophy.philosophy.whyItExists,
        context + ': missing whyItExists'
      );

      assert.ok(
        philosophy.philosophy.contributionToSystem,
        context + ': missing contributionToSystem'
      );

      assert.ok(
        Array.isArray(
          philosophy.philosophy.governingPrinciples
        ),
        context + ': governingPrinciples must be an array'
      );

      assert.ok(
        philosophy.provenance,
        context + ': missing provenance'
      );

      assert.ok(
        VALID_CLAIM_TYPES.has(
          philosophy.provenance.claimType
        ),
        context +
          ': invalid provenance claimType "' +
          philosophy.provenance.claimType +
          '"'
      );

      validateSourceIds(
        philosophy.provenance.sourceIds || [],
        context
      );

      assert.ok(
        philosophy.personalization,
        context + ': missing personalization object'
      );

      assert.equal(
        typeof philosophy.personalization.requiresEvidence,
        'boolean',
        context + ': requiresEvidence must be boolean'
      );

      validateEvidenceTags(
        philosophy.personalization.allowedEvidenceTags || [],
        context
      );

      if (
        philosophy.personalization
          .prohibitedClaimsWithoutEvidence !== undefined
      ) {
        assert.ok(
          Array.isArray(
            philosophy.personalization
              .prohibitedClaimsWithoutEvidence
          ),
          context +
            ': prohibitedClaimsWithoutEvidence must be an array'
        );
      }
    }
  }
}


/*
 * ------------------------------------------------------------
 * Summary
 * ------------------------------------------------------------
 */

assert.equal(
  portfolioCount,
  21,
  'Expected 21 current portfolio systems'
);

assert.equal(
  philosophySleeveCount,
  constituentSleeveCount,
  'Philosophy sleeve count does not match current constituent sleeve count'
);

console.log(
  'Portfolio philosophy corpus passed.'
);

console.log(
  'Validated ' +
    portfolioCount +
    ' portfolio systems and ' +
    constituentSleeveCount +
    ' constituent sleeves.'
);

console.log(
  'No recommendation or portfolio-construction logic was exercised or changed.'
);

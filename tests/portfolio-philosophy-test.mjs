```js
import assert from 'node:assert/strict';

import {
  getConstituentPortfolio,
  getAvailablePortfolioVariants
} from '../src/domain/portfolio-system/constituent-portfolios.js';

import {
  resolvePortfolioPhilosophy,
  getArchetypePhilosophy,
  getVariantPhilosophy,
  getSleevePhilosophy,
  getPhilosophySource
} from '../src/domain/portfolio-philosophy/philosophy-resolver.js';

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

import {
  SYSTEM_ROLES
} from '../src/domain/portfolio-philosophy/philosophy-constants.js';


const ARCHETYPE_IDS = [
  'ES',
  'GD',
  'FT',
  'BFO',
  'GA',
  'TO',
  'IP'
];

const EXPECTED_VARIANTS = [
  'essential',
  'intentional',
  'engaged'
];

const VALID_SYSTEM_ROLES =
  new Set(
    Object.values(
      SYSTEM_ROLES
    )
  );


function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function assertSourceIdsExist(sourceIds = [], context = '') {
  for (const sourceId of sourceIds) {
    assert.ok(
      getPhilosophySource(sourceId),
      context + ': unknown philosophy source "' + sourceId + '"'
    );
  }
}

/**
 * ------------------------------------------------------------
 * Basic lookup tests
 * ------------------------------------------------------------
 */

assert.equal(
  getArchetypePhilosophy(
    'ES'
  )?.archetypeId,
  'ES'
);

assert.equal(
  getVariantPhilosophy(
    'essential'
  )?.variantId,
  'essential'
);

assert.ok(
  getSleevePhilosophy(
    'ES',
    'essential',
    'broadGrowthCore'
  ),
  'Expected ES essential broadGrowthCore philosophy metadata'
);

assert.equal(
  getArchetypePhilosophy(
    'UNKNOWN'
  ),
  null
);

assert.equal(
  getVariantPhilosophy(
    'unknown'
  ),
  null
);

assert.equal(
  getSleevePhilosophy(
    'ES',
    'essential',
    'unknownSleeve'
  ),
  null
);


/**
 * ------------------------------------------------------------
 * Validate top-level archetype corpus
 * ------------------------------------------------------------
 */

for (
  const archetypeId
  of ARCHETYPE_IDS
) {
  const philosophy =
    ARCHETYPE_PHILOSOPHIES[
      archetypeId
    ];

  assert.ok(
    philosophy,
    `Missing archetype philosophy for ${archetypeId}`
  );

  assert.equal(
    philosophy.archetypeId,
    archetypeId,
    `Archetype ID mismatch for ${archetypeId}`
  );

  assert.ok(
    philosophy.philosophyName,
    `${archetypeId}: missing philosophyName`
  );

  assert.ok(
    philosophy.summary,
    `${archetypeId}: missing summary`
  );

  assertSourceIdsExist(
    philosophy.sourceIds,
    `${archetypeId} archetype`
  );
}


/**
 * ------------------------------------------------------------
 * Validate variant corpus
 * ------------------------------------------------------------
 */

for (
  const variantId
  of EXPECTED_VARIANTS
) {
  const philosophy =
    VARIANT_PHILOSOPHIES[
      variantId
    ];

  assert.ok(
    philosophy,
    `Missing variant philosophy for ${variantId}`
  );

  assert.equal(
    philosophy.variantId,
    variantId,
    `Variant ID mismatch for ${variantId}`
  );

  assert.ok(
    philosophy.philosophyName,
    `${variantId}: missing philosophyName`
  );

  assert.ok(
    philosophy.summary,
    `${variantId}: missing summary`
  );
}


/**
 * ------------------------------------------------------------
 * Validate every current 7 x 3 portfolio combination
 * ------------------------------------------------------------
 */

let portfolioCount = 0;
let sleeveCount = 0;

for (
  const archetypeId
  of ARCHETYPE_IDS
) {
  const availableVariants =
    getAvailablePortfolioVariants(
      archetypeId
    );

  assert.deepEqual(
    [...availableVariants].sort(),
    [...EXPECTED_VARIANTS].sort(),
    `${archetypeId}: expected essential, intentional and engaged variants`
  );

  for (
    const variantId
    of EXPECTED_VARIANTS
  ) {
    portfolioCount += 1;

    const portfolio =
      getConstituentPortfolio(
        archetypeId,
        variantId
      );

    const before =
      clone(portfolio);

    assert.ok(
      Array.isArray(
        portfolio.sleeves
      ),
      `${archetypeId}/${variantId}: sleeves must be an array`
    );

    assert.ok(
      portfolio.sleeves.length >
        0,
      `${archetypeId}/${variantId}: expected at least one sleeve`
    );

    const resolved =
      resolvePortfolioPhilosophy({
        archetypeId,
        variantId,
        sleeves:
          portfolio.sleeves
      });

    assert.equal(
      resolved.coverage
        .archetypeResolved,
      true,
      `${archetypeId}/${variantId}: archetype philosophy was not resolved`
    );

    assert.equal(
      resolved.coverage
        .variantResolved,
      true,
      `${archetypeId}/${variantId}: variant philosophy was not resolved`
    );

    assert.equal(
      resolved.coverage
        .sleevesTotal,
      portfolio.sleeves.length,
      `${archetypeId}/${variantId}: sleeve total mismatch`
    );

    assert.equal(
      resolved.coverage
        .sleevesResolved,
      portfolio.sleeves.length,
      `${archetypeId}/${variantId}: not every sleeve has philosophy metadata. Missing: ${
        resolved.coverage
          .missingSleeveIds
          .join(', ')
      }`
    );

    assert.deepEqual(
      resolved.coverage
        .missingSleeveIds,
      [],
      `${archetypeId}/${variantId}: philosophy coverage contains missing sleeves`
    );

    for (
      const entry
      of resolved.sleeves
    ) {
      sleeveCount += 1;

      const {
        sleeve,
        philosophy
      } = entry;

      assert.ok(
        sleeve?.id,
        `${archetypeId}/${variantId}: resolved sleeve missing ID`
      );

      assert.ok(
        philosophy,
        `${archetypeId}/${variantId}/${sleeve?.id}: missing philosophy`
      );

      assert.ok(
        VALID_SYSTEM_ROLES.has(
          philosophy.systemRole
        ),
        `${archetypeId}/${variantId}/${sleeve.id}: invalid systemRole "${philosophy.systemRole}"`
      );

      assert.ok(
        philosophy
          .philosophy
          ?.whyItExists,
        `${archetypeId}/${variantId}/${sleeve.id}: missing whyItExists`
      );

      assert.ok(
        philosophy
          .philosophy
          ?.contributionToSystem,
        `${archetypeId}/${variantId}/${sleeve.id}: missing contributionToSystem`
      );

      assert.ok(
        philosophy.provenance,
        `${archetypeId}/${variantId}/${sleeve.id}: missing provenance`
      );

      assertSourceIdsExist(
        philosophy
          .provenance
          ?.sourceIds,
        `${archetypeId}/${variantId}/${sleeve.id}`
      );
    }

    /**
     * The philosophy resolver must be read-only.
     *
     * Portfolio construction must remain byte-for-byte equivalent
     * to its state before philosophy resolution.
     */
    assert.deepEqual(
      portfolio,
      before,
      `${archetypeId}/${variantId}: philosophy resolution mutated the constituent portfolio`
    );

    /**
     * Existing sleeve weights must still sum to 100%.
     */
    const totalWeight =
      portfolio.sleeves.reduce(
        (
          sum,
          sleeve
        ) =>
          sum +
          sleeve.weight,
        0
      );

    assert.ok(
      Math.abs(
        totalWeight - 1
      ) < 0.0001,
      `${archetypeId}/${variantId}: constituent weights no longer sum to 1`
    );
  }
}


/**
 * ------------------------------------------------------------
 * Validate that corpus keys do not reference nonexistent
 * portfolio variants or sleeves.
 * ------------------------------------------------------------
 */

for (
  const [
    archetypeId,
    variantMap
  ]
  of Object.entries(
    SLEEVE_PHILOSOPHIES
  )
) {
  assert.ok(
    ARCHETYPE_IDS.includes(
      archetypeId
    ),
    `Sleeve philosophy contains unknown archetype "${archetypeId}"`
  );

  for (
    const [
      variantId,
      sleeveMap
    ]
    of Object.entries(
      variantMap
    )
  ) {
    assert.ok(
      EXPECTED_VARIANTS.includes(
        variantId
      ),
      `${archetypeId}: philosophy contains unknown variant "${variantId}"`
    );

    const portfolio =
      getConstituentPortfolio(
        archetypeId,
        variantId
      );

    const realSleeveIds =
      new Set(
        portfolio.sleeves.map(
          (sleeve) =>
            sleeve.id
        )
      );

    for (
      const philosophySleeveId
      of Object.keys(
        sleeveMap
      )
    ) {
      assert.ok(
        realSleeveIds.has(
          philosophySleeveId
        ),
        `${archetypeId}/${variantId}: philosophy contains sleeve "${philosophySleeveId}" that does not exist in constituent-portfolios.js`
      );
    }
  }
}


/**
 * ------------------------------------------------------------
 * Validate source records themselves
 * ------------------------------------------------------------
 */

for (
  const [
    sourceId,
    source
  ]
  of Object.entries(
    PHILOSOPHY_SOURCES
  )
) {
  assert.equal(
    source.id,
    sourceId,
    `Source key/id mismatch for ${sourceId}`
  );

  assert.ok(
    source.organization,
    `${sourceId}: missing organization`
  );

  assert.ok(
    source.title,
    `${sourceId}: missing title`
  );

  assert.ok(
    source.url,
    `${sourceId}: missing URL`
  );

  assert.ok(
    Array.isArray(
      source.principles
    ),
    `${sourceId}: principles must be an array`
  );
}


assert.equal(
  portfolioCount,
  21,
  `Expected exactly 21 portfolio systems but validated ${portfolioCount}`
);


console.log(
  `Portfolio philosophy tests passed: ${portfolioCount} systems and ${sleeveCount} sleeves validated.`
);
```

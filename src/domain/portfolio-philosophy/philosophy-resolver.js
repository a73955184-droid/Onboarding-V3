```js
import { PHILOSOPHY_SOURCES } from './philosophy-sources.js';
import { ARCHETYPE_PHILOSOPHIES } from './archetype-philosophies.js';
import { VARIANT_PHILOSOPHIES } from './variant-philosophies.js';
import { SLEEVE_PHILOSOPHIES } from './sleeve-philosophies.js';

/**
 * Return the approved philosophy definition for a portfolio archetype.
 *
 * This is a read-only lookup.
 * It does not participate in archetype resolution.
 */
export function getArchetypePhilosophy(archetypeId) {
  if (!archetypeId) {
    return null;
  }

  return (
    ARCHETYPE_PHILOSOPHIES[
      archetypeId
    ] || null
  );
}


/**
 * Return the approved philosophy definition for a profile variant.
 *
 * This is a read-only lookup.
 * It does not participate in variant resolution.
 */
export function getVariantPhilosophy(variantId) {
  if (!variantId) {
    return null;
  }

  return (
    VARIANT_PHILOSOPHIES[
      variantId
    ] || null
  );
}


/**
 * Return the approved philosophy definition for one constituent sleeve.
 *
 * Lookup uses:
 *
 * archetypeId
 *   -> variantId
 *      -> exact constituent sleeve ID
 *
 * Existing constituent IDs are authoritative.
 */
export function getSleevePhilosophy(
  archetypeId,
  variantId,
  sleeveId
) {
  if (
    !archetypeId ||
    !variantId ||
    !sleeveId
  ) {
    return null;
  }

  return (
    SLEEVE_PHILOSOPHIES?.[
      archetypeId
    ]?.[
      variantId
    ]?.[
      sleeveId
    ] || null
  );
}


/**
 * Return one approved philosophy source.
 */
export function getPhilosophySource(
  sourceId
) {
  if (!sourceId) {
    return null;
  }

  return (
    PHILOSOPHY_SOURCES[
      sourceId
    ] || null
  );
}


/**
 * Resolve an array of source IDs into source records.
 *
 * Unknown source IDs are omitted here.
 * Coverage validation is handled separately so this resolver
 * can fail safely at runtime.
 */
export function resolveSourceIds(
  sourceIds = []
) {
  if (!Array.isArray(sourceIds)) {
    return [];
  }

  return sourceIds
    .map((sourceId) =>
      getPhilosophySource(
        sourceId
      )
    )
    .filter(Boolean);
}


/**
 * Build a count of semantic sleeve roles in a constituent portfolio.
 *
 * Example:
 *
 * {
 *   foundation: 1,
 *   'stability-resilience': 1,
 *   'liquidity-access': 1
 * }
 */
function buildRoleMix(
  resolvedSleeves
) {
  return resolvedSleeves.reduce(
    (
      roleMix,
      entry
    ) => {
      const role =
        entry.philosophy
          ?.systemRole;

      if (!role) {
        return roleMix;
      }

      roleMix[role] =
        (
          roleMix[role] ||
          0
        ) + 1;

      return roleMix;
    },
    {}
  );
}


/**
 * Resolve philosophy metadata for an already-selected portfolio.
 *
 * IMPORTANT:
 *
 * This function explains an existing recommendation.
 * It does not:
 *
 * - select an archetype
 * - select a variant
 * - change sleeve weights
 * - add or remove sleeves
 * - alter portfolio construction
 *
 * The caller supplies the existing constituent sleeves.
 */
export function resolvePortfolioPhilosophy({
  archetypeId,
  variantId,
  sleeves = []
} = {}) {
  const safeSleeves =
    Array.isArray(sleeves)
      ? sleeves
      : [];

  const archetype =
    getArchetypePhilosophy(
      archetypeId
    );

  const variant =
    getVariantPhilosophy(
      variantId
    );

  const resolvedSleeves =
    safeSleeves.map(
      (sleeve) => {
        const philosophy =
          getSleevePhilosophy(
            archetypeId,
            variantId,
            sleeve?.id
          );

        const sourceIds =
          philosophy
            ?.provenance
            ?.sourceIds ||
          [];

        return {
          sleeve,
          philosophy,
          sources:
            resolveSourceIds(
              sourceIds
            )
        };
      }
    );

  const missingSleeveIds =
    resolvedSleeves
      .filter(
        (entry) =>
          !entry.philosophy
      )
      .map(
        (entry) =>
          entry.sleeve?.id
      )
      .filter(Boolean);

  return {
    archetype,

    archetypeSources:
      resolveSourceIds(
        archetype?.sourceIds ||
          []
      ),

    variant,

    structure: {
      sleeveCount:
        safeSleeves.length,

      roleMix:
        buildRoleMix(
          resolvedSleeves
        )
    },

    sleeves:
      resolvedSleeves,

    coverage: {
      archetypeResolved:
        Boolean(archetype),

      variantResolved:
        Boolean(variant),

      sleevesTotal:
        safeSleeves.length,

      sleevesResolved:
        resolvedSleeves.filter(
          (entry) =>
            Boolean(
              entry.philosophy
            )
        ).length,

      missingSleeveIds
    }
  };
}
```

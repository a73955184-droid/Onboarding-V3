import { PHILOSOPHY_SOURCES } from './philosophy-sources.js';
import { ARCHETYPE_PHILOSOPHIES } from './archetype-philosophies.js';
import { VARIANT_PHILOSOPHIES } from './variant-philosophies.js';
import { SLEEVE_PHILOSOPHIES } from './sleeve-philosophies.js';

export function resolvePortfolioPhilosophy({
  archetypeId,
  variantId,
  sleeves = []
} = {}) {
  const archetype =
    ARCHETYPE_PHILOSOPHIES?.[archetypeId] ?? null;

  const variant =
    VARIANT_PHILOSOPHIES?.[variantId] ?? null;

  const archetypeSourceIds =
    archetype?.sourceIds ?? [];

  const archetypeSources =
    archetypeSourceIds
      .map(
        (sourceId) =>
          PHILOSOPHY_SOURCES?.[sourceId] ?? null
      )
      .filter(Boolean);

  const resolvedSleeves =
    (
      Array.isArray(sleeves)
        ? sleeves
        : []
    ).map(
      (sleeve) => {
        const philosophy =
          SLEEVE_PHILOSOPHIES
            ?.[archetypeId]
            ?.[variantId]
            ?.[sleeve.id] ??
          null;

        const sourceIds =
          philosophy
            ?.provenance
            ?.sourceIds ??
          [];

        const sources =
          sourceIds
            .map(
              (sourceId) =>
                PHILOSOPHY_SOURCES?.[sourceId] ?? null
            )
            .filter(Boolean);

        return {
          sleeve,
          philosophy,
          sources
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

    /*
     * Fully resolved authoritative source records supporting
     * the archetype-level philosophy.
     */
    archetypeSources,

    variant,

    /*
     * Existing constituent sleeve data joined with the
     * corresponding approved philosophy metadata and sources.
     */
    sleeves:
      resolvedSleeves,

    /*
     * Development diagnostics.
     *
     * Missing philosophy metadata should not crash the app.
     * Instead, expose the coverage gap here.
     */
    coverage: {
      archetypeResolved:
        Boolean(archetype),

      variantResolved:
        Boolean(variant),

      sleevesTotal:
        resolvedSleeves.length,

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

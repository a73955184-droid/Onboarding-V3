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

  const resolvedSleeves = (Array.isArray(sleeves) ? sleeves : []).map(
    (sleeve) => {
      const philosophy =
        SLEEVE_PHILOSOPHIES?.[archetypeId]?.[variantId]?.[sleeve.id] ??
        null;

      const sourceIds =
        philosophy?.provenance?.sourceIds ?? [];

      return {
        sleeve,
        philosophy,
        sources: sourceIds
          .map((id) => PHILOSOPHY_SOURCES?.[id] ?? null)
          .filter(Boolean)
      };
    }
  );

  return {
    archetype,
    variant,

    sleeves: resolvedSleeves,

    coverage: {
      archetypeResolved: Boolean(archetype),
      variantResolved: Boolean(variant),

      sleevesTotal: resolvedSleeves.length,

      sleevesResolved: resolvedSleeves.filter(
        (entry) => Boolean(entry.philosophy)
      ).length,

      missingSleeveIds: resolvedSleeves
        .filter((entry) => !entry.philosophy)
        .map((entry) => entry.sleeve?.id)
        .filter(Boolean)
    }
  };
}

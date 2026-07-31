import { getPortfolioArchetype } from "./portfolio-archetypes.js";
import {
  resolveProfileVariant,
} from "./profile-variant-resolver.js";
import {
  getConstituentPortfolio,
} from "./constituent-portfolios.js";
import {
  applyTimeHorizonRules,
  validatePortfolioWeights,
} from "./allocation-rules.js";
import {
  resolveAssetCategories,
} from "./asset-catalog.js";
import {
  resolveMarketTrends,
} from "./market-trend-catalog.js";

function calculateEffortMix(sleeves) {
  const initial = {
    veryLow: 0,
    low: 0,
    moderate: 0,
    high: 0,
  };

  const effortMix = sleeves.reduce((mix, sleeve) => {
    const key =
      sleeve.effort === "very-low"
        ? "veryLow"
        : sleeve.effort;

    if (Object.hasOwn(mix, key)) {
      mix[key] += sleeve.weight;
    }

    return mix;
  }, initial);

  return Object.fromEntries(
    Object.entries(effortMix).map(([key, value]) => [
      key,
      Math.round(value * 10000) / 10000,
    ]),
  );
}

function populateSleeve(sleeve) {
  return {
    ...sleeve,

    assetCategories: resolveAssetCategories(
      sleeve.assetCategories,
    ),

    marketTrends: resolveMarketTrends(
      sleeve.marketTrendTags,
    ),
  };
}

export function composePortfolioSystem(assessmentResult) {
  if (!assessmentResult?.archetypeId) {
    throw new Error(
      "Cannot compose portfolio without an archetypeId.",
    );
  }

  const archetype = getPortfolioArchetype(
    assessmentResult.archetypeId,
  );

  const profileVariantId = resolveProfileVariant({
    stageId: assessmentResult.stageId,
    styleId: assessmentResult.styleId,
    signals: assessmentResult.signals,
  });

  const constituentPortfolio = getConstituentPortfolio(
    assessmentResult.archetypeId,
    profileVariantId,
  );

  const horizonAdjustedSleeves = applyTimeHorizonRules(
    constituentPortfolio.sleeves,
    assessmentResult.timeHorizon,
  );

  if (!validatePortfolioWeights(horizonAdjustedSleeves)) {
    throw new Error(
      "Composed portfolio weights do not total 100%.",
    );
  }

  const sleeves = horizonAdjustedSleeves.map(
    populateSleeve,
  );

  return {
    system: {
      id: archetype.id,
      name: archetype.name,
      systemName: archetype.systemName,
      philosophy: archetype.philosophy,
      invariant: archetype.invariant,
    },

    profileVariantId,

    profileContext: {
      stageId: assessmentResult.stageId,
      styleId: assessmentResult.styleId,
      modifierId: assessmentResult.modifierId,
      timeHorizon: assessmentResult.timeHorizon,
    },

    sleeves,

    effortMix: calculateEffortMix(sleeves),

    totals: {
      sleeveCount: sleeves.length,
      portfolioWeight: sleeves.reduce(
        (sum, sleeve) => sum + sleeve.weight,
        0,
      ),
    },
  };
}

const HORIZON_RULES = Object.freeze({
  under_3_years: {
    growthAdjustment: -0.20,
    stabilityAdjustment: 0.10,
    liquidityAdjustment: 0.10,
    removeHighEffortSleeves: true,
  },

  years_3_to_5: {
    growthAdjustment: -0.10,
    stabilityAdjustment: 0.05,
    liquidityAdjustment: 0.05,
    removeHighEffortSleeves: false,
  },

  years_5_to_10: {
    growthAdjustment: 0,
    stabilityAdjustment: 0,
    liquidityAdjustment: 0,
    removeHighEffortSleeves: false,
  },

  years_10_to_15: {
    growthAdjustment: 0.05,
    stabilityAdjustment: -0.05,
    liquidityAdjustment: 0,
    removeHighEffortSleeves: false,
  },

  over_15_years: {
    growthAdjustment: 0.10,
    stabilityAdjustment: -0.05,
    liquidityAdjustment: -0.05,
    removeHighEffortSleeves: false,
  },
});

const GROWTH_ROLES = new Set([
  "primary-growth",
  "primary-long-term-progress",
]);

const STABILITY_ROLES = new Set([
  "risk-reduction",
  "capital-preservation",
]);

const LIQUIDITY_ROLES = new Set([
  "capital-access",
  "planned-access",
]);

function roundWeight(value) {
  return Math.round(value * 10000) / 10000;
}

function normalizeWeights(sleeves) {
  const total = sleeves.reduce(
    (sum, sleeve) => sum + sleeve.weight,
    0,
  );

  if (total <= 0) {
    throw new Error("Portfolio cannot have a zero allocation.");
  }

  const normalized = sleeves.map((sleeve) => ({
    ...sleeve,
    weight: roundWeight(sleeve.weight / total),
  }));

  const normalizedTotal = normalized.reduce(
    (sum, sleeve) => sum + sleeve.weight,
    0,
  );

  const roundingDifference = roundWeight(1 - normalizedTotal);

  if (roundingDifference !== 0 && normalized.length > 0) {
    const largestSleeveIndex = normalized.reduce(
      (largestIndex, sleeve, index, source) =>
        sleeve.weight > source[largestIndex].weight
          ? index
          : largestIndex,
      0,
    );

    normalized[largestSleeveIndex] = {
      ...normalized[largestSleeveIndex],
      weight: roundWeight(
        normalized[largestSleeveIndex].weight +
          roundingDifference,
      ),
    };
  }

  return normalized;
}

export function applyTimeHorizonRules(
  sleeves,
  timeHorizon,
) {
  const rules = HORIZON_RULES[timeHorizon];

  if (!rules) {
    return normalizeWeights(sleeves);
  }

  let adjustedSleeves = sleeves.map((sleeve) => {
    let adjustment = 0;

    if (GROWTH_ROLES.has(sleeve.returnFunction)) {
      adjustment += rules.growthAdjustment;
    }

    if (STABILITY_ROLES.has(sleeve.returnFunction)) {
      adjustment += rules.stabilityAdjustment;
    }

    if (LIQUIDITY_ROLES.has(sleeve.returnFunction)) {
      adjustment += rules.liquidityAdjustment;
    }

    return {
      ...sleeve,
      weight: Math.max(0, sleeve.weight + adjustment),
    };
  });

  if (rules.removeHighEffortSleeves) {
    adjustedSleeves = adjustedSleeves.filter(
      (sleeve) => sleeve.effort !== "high",
    );
  }

  return normalizeWeights(adjustedSleeves);
}

export function validatePortfolioWeights(sleeves) {
  const total = sleeves.reduce(
    (sum, sleeve) => sum + sleeve.weight,
    0,
  );

  return Math.abs(total - 1) < 0.0001;
}

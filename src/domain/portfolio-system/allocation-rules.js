/**
 * Portfolio allocation rules
 *
 * This file adjusts a constituent portfolio after the quiz has resolved:
 *
 * - portfolio archetype;
 * - profile variant;
 * - time horizon.
 *
 * It intentionally works with relative multipliers instead of subtracting
 * fixed percentage points from every matching sleeve. That prevents a
 * portfolio with several growth sleeves from being over-adjusted.
 */

const HORIZON_RULES = Object.freeze({
  under_3_years: {
    growthMultiplier: 0.55,
    stabilityMultiplier: 1.45,
    liquidityMultiplier: 1.75,
    incomeMultiplier: 1.10,
    diversificationMultiplier: 0.90,
    improvementMultiplier: 0.65,
    opportunityMultiplier: 0,
    tacticalMultiplier: 0,
    protectionMultiplier: 1.15,
    removeHighEffortSleeves: true
  },

  years_3_to_5: {
    growthMultiplier: 0.75,
    stabilityMultiplier: 1.30,
    liquidityMultiplier: 1.40,
    incomeMultiplier: 1.05,
    diversificationMultiplier: 0.95,
    improvementMultiplier: 0.80,
    opportunityMultiplier: 0.50,
    tacticalMultiplier: 0.40,
    protectionMultiplier: 1.10,
    removeHighEffortSleeves: false
  },

  years_5_to_10: {
    growthMultiplier: 1,
    stabilityMultiplier: 1,
    liquidityMultiplier: 1,
    incomeMultiplier: 1,
    diversificationMultiplier: 1,
    improvementMultiplier: 1,
    opportunityMultiplier: 1,
    tacticalMultiplier: 1,
    protectionMultiplier: 1,
    removeHighEffortSleeves: false
  },

  over_10_years: {
    growthMultiplier: 1.15,
    stabilityMultiplier: 0.80,
    liquidityMultiplier: 0.75,
    incomeMultiplier: 0.90,
    diversificationMultiplier: 1.05,
    improvementMultiplier: 1.10,
    opportunityMultiplier: 1.10,
    tacticalMultiplier: 1,
    protectionMultiplier: 0.95,
    removeHighEffortSleeves: false
  },

  multiple_horizons: {
    growthMultiplier: 1,
    stabilityMultiplier: 1.10,
    liquidityMultiplier: 1.20,
    incomeMultiplier: 1,
    diversificationMultiplier: 1.05,
    improvementMultiplier: 0.95,
    opportunityMultiplier: 0.80,
    tacticalMultiplier: 0.75,
    protectionMultiplier: 1.05,
    removeHighEffortSleeves: false
  },

  unspecified: {
    growthMultiplier: 0.90,
    stabilityMultiplier: 1.15,
    liquidityMultiplier: 1.20,
    incomeMultiplier: 1,
    diversificationMultiplier: 1,
    improvementMultiplier: 0.85,
    opportunityMultiplier: 0.60,
    tacticalMultiplier: 0.50,
    protectionMultiplier: 1.05,
    removeHighEffortSleeves: false
  }
});


const ROLE_GROUPS = Object.freeze({
  growth: new Set([
    'primary-growth',
    'primary-long-term-progress',
    'long-term-growth',
    'supporting-growth'
  ]),

  stability: new Set([
    'risk-reduction',
    'capital-preservation',
    'portfolio-resilience',
    'resilience'
  ]),

  liquidity: new Set([
    'capital-access',
    'planned-access',
    'liquidity',
    'readiness'
  ]),

  income: new Set([
    'income-generation',
    'recurring-cash-flow',
    'income-and-preservation',
    'cash-flow'
  ]),

  diversification: new Set([
    'geographic-diversification',
    'risk-source-diversification',
    'diversification',
    'inflation-diversification'
  ]),

  improvement: new Set([
    'supporting-progress',
    'targeted-improvement',
    'incremental-improvement'
  ]),

  opportunity: new Set([
    'optional-upside',
    'optional-upside-and-learning',
    'selected-opportunity'
  ]),

  tactical: new Set([
    'conditional-upside',
    'conditional-return',
    'tactical-return'
  ]),

  protection: new Set([
    'inflation-protection',
    'purchasing-power-protection',
    'downside-protection'
  ])
});


function roundWeight(value) {
  return Math.round(value * 10000) / 10000;
}


function getRoleMultiplier(
  returnFunction,
  rules
) {
  if (
    ROLE_GROUPS.growth.has(
      returnFunction
    )
  ) {
    return rules.growthMultiplier;
  }

  if (
    ROLE_GROUPS.stability.has(
      returnFunction
    )
  ) {
    return rules.stabilityMultiplier;
  }

  if (
    ROLE_GROUPS.liquidity.has(
      returnFunction
    )
  ) {
    return rules.liquidityMultiplier;
  }

  if (
    ROLE_GROUPS.income.has(
      returnFunction
    )
  ) {
    return rules.incomeMultiplier;
  }

  if (
    ROLE_GROUPS.diversification.has(
      returnFunction
    )
  ) {
    return rules.diversificationMultiplier;
  }

  if (
    ROLE_GROUPS.improvement.has(
      returnFunction
    )
  ) {
    return rules.improvementMultiplier;
  }

  if (
    ROLE_GROUPS.opportunity.has(
      returnFunction
    )
  ) {
    return rules.opportunityMultiplier;
  }

  if (
    ROLE_GROUPS.tactical.has(
      returnFunction
    )
  ) {
    return rules.tacticalMultiplier;
  }

  if (
    ROLE_GROUPS.protection.has(
      returnFunction
    )
  ) {
    return rules.protectionMultiplier;
  }

  return 1;
}


function removeDisallowedSleeves(
  sleeves,
  rules
) {
  return sleeves.filter(
    (sleeve) => {
      if (
        rules.removeHighEffortSleeves &&
        sleeve.effort === 'high'
      ) {
        return false;
      }

      const multiplier =
        getRoleMultiplier(
          sleeve.returnFunction,
          rules
        );

      return multiplier > 0;
    }
  );
}


function applyMultipliers(
  sleeves,
  rules
) {
  return sleeves.map(
    (sleeve) => {
      const multiplier =
        getRoleMultiplier(
          sleeve.returnFunction,
          rules
        );

      return {
        ...sleeve,

        weight:
          Math.max(
            0,
            sleeve.weight *
              multiplier
          )
      };
    }
  );
}


export function normalizeWeights(
  sleeves
) {
  if (
    !Array.isArray(
      sleeves
    ) ||
    sleeves.length === 0
  ) {
    throw new Error(
      'Portfolio must contain at least one sleeve.'
    );
  }

  const total =
    sleeves.reduce(
      (
        sum,
        sleeve
      ) =>
        sum +
        (
          Number(
            sleeve.weight
          ) || 0
        ),
      0
    );

  if (
    total <= 0
  ) {
    throw new Error(
      'Portfolio allocation cannot total zero.'
    );
  }

  const normalized =
    sleeves.map(
      (sleeve) => ({
        ...sleeve,

        weight:
          roundWeight(
            (
              Number(
                sleeve.weight
              ) || 0
            ) /
              total
          )
      })
    );

  const normalizedTotal =
    normalized.reduce(
      (
        sum,
        sleeve
      ) =>
        sum +
        sleeve.weight,
      0
    );

  const roundingDifference =
    roundWeight(
      1 -
      normalizedTotal
    );

  if (
    roundingDifference !== 0
  ) {
    const largestIndex =
      normalized.reduce(
        (
          largestIndex,
          sleeve,
          index,
          source
        ) =>
          sleeve.weight >
          source[
            largestIndex
          ].weight
            ? index
            : largestIndex,
        0
      );

    normalized[
      largestIndex
    ] = {
      ...normalized[
        largestIndex
      ],

      weight:
        roundWeight(
          normalized[
            largestIndex
          ].weight +
            roundingDifference
        )
    };
  }

  return normalized;
}


export function applyTimeHorizonRules(
  sleeves,
  timeHorizon
) {
  if (
    !Array.isArray(
      sleeves
    )
  ) {
    throw new TypeError(
      'sleeves must be an array.'
    );
  }

  const rules =
    HORIZON_RULES[
      timeHorizon
    ];

  if (!rules) {
    return normalizeWeights(
      sleeves
    );
  }

  const permittedSleeves =
    removeDisallowedSleeves(
      sleeves,
      rules
    );

  if (
    permittedSleeves.length ===
    0
  ) {
    throw new Error(
      `Time-horizon rules removed every sleeve for "${timeHorizon}".`
    );
  }

  const adjustedSleeves =
    applyMultipliers(
      permittedSleeves,
      rules
    );

  return normalizeWeights(
    adjustedSleeves
  );
}


export function validatePortfolioWeights(
  sleeves
) {
  if (
    !Array.isArray(
      sleeves
    ) ||
    sleeves.length === 0
  ) {
    return false;
  }

  const allWeightsValid =
    sleeves.every(
      (sleeve) =>
        Number.isFinite(
          sleeve.weight
        ) &&
        sleeve.weight >= 0 &&
        sleeve.weight <= 1
    );

  if (
    !allWeightsValid
  ) {
    return false;
  }

  const total =
    sleeves.reduce(
      (
        sum,
        sleeve
      ) =>
        sum +
        sleeve.weight,
      0
    );

  return (
    Math.abs(
      total - 1
    ) <
    0.0001
  );
}


export function getTimeHorizonRule(
  timeHorizon
) {
  const rule =
    HORIZON_RULES[
      timeHorizon
    ];

  return rule
    ? {
        ...rule
      }
    : null;
}


export {
  HORIZON_RULES
};

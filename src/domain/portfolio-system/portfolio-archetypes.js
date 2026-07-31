/**
 * Defines the invariant structure and permitted sleeves for each
 * AaronBux portfolio archetype.
 *
 * The investor profile may personalize an archetype within these
 * boundaries, but it must not change the archetype's core philosophy.
 */

export const SLEEVE_STATUS = Object.freeze({
  REQUIRED: "required",
  OPTIONAL: "optional",
  INACTIVE: "inactive",
});

export const PORTFOLIO_ARCHETYPES = Object.freeze({
  ES: {
    id: "ES",
    name: "Effortless Portfolio",
    systemName: "A simple long-term investing system",

    philosophy:
      "Capture broad market progress using a small number of diversified holdings and minimal ongoing intervention.",

    invariant:
      "Broad holdings must dominate and the system must remain simple to maintain.",

    sleeves: {
      broadGrowthCore: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.55,
        default: 0.70,
        max: 0.85,
      },

      stability: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.10,
        default: 0.20,
        max: 0.35,
      },

      liquidity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.10,
        max: 0.25,
      },

      personalPreference: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.05,
      },
    },
  },

  GD: {
    id: "GD",
    name: "Global Diversified Portfolio",
    systemName: "A globally diversified investing system",

    philosophy:
      "Reduce dependence on any one country, region, asset class, or source of return.",

    invariant:
      "The portfolio must maintain meaningful exposure to more than one geographic and economic return source.",

    sleeves: {
      usEquity: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.20,
        default: 0.35,
        max: 0.50,
      },

      developedInternational: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.15,
        default: 0.25,
        max: 0.35,
      },

      emergingMarkets: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.10,
        max: 0.15,
      },

      smallCapDiversification: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.10,
      },

      stability: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.10,
        default: 0.20,
        max: 0.35,
      },

      realAssetDiversifier: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.10,
      },

      liquidity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.10,
        max: 0.20,
      },
    },
  },

  FT: {
    id: "FT",
    name: "Systematic Improvement Portfolio",
    systemName: "A systematic improvement system",

    philosophy:
      "Maintain a durable diversified base and add only improvements that solve a defined portfolio limitation.",

    invariant:
      "Every non-core exposure must state the problem it solves and justify its added cost, complexity, and effort.",

    sleeves: {
      durableCore: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.40,
        default: 0.60,
        max: 0.75,
      },

      globalDiversification: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.15,
        max: 0.25,
      },

      stability: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.10,
        default: 0.15,
        max: 0.30,
      },

      targetedImprovement: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.05,
        default: 0.10,
        max: 0.20,
      },

      strategicDiversifier: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.10,
      },

      researchCapacity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.05,
      },

      liquidity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.20,
      },
    },
  },

  BFO: {
    id: "BFO",
    name: "Balanced Multi-Purpose Portfolio",
    systemName: "A balanced multi-purpose investing system",

    philosophy:
      "Assign different parts of the portfolio distinct jobs across growth, stability, access, income, and diversification.",

    invariant:
      "Every active sleeve must perform a distinct portfolio job and no optional sleeve may dominate the system.",

    sleeves: {
      growth: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.25,
        default: 0.45,
        max: 0.65,
      },

      stability: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.10,
        default: 0.20,
        max: 0.35,
      },

      liquidity: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.05,
        default: 0.10,
        max: 0.25,
      },

      income: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.10,
        max: 0.25,
      },

      diversifiers: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.10,
        max: 0.20,
      },

      realAssets: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.10,
      },

      opportunity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.05,
      },
    },
  },

  GA: {
    id: "GA",
    name: "Growth & Alternatives Portfolio",
    systemName: "A foundation plus exploration system",

    philosophy:
      "Use a broad growth foundation while adding bounded alternative or higher-growth return sources.",

    invariant:
      "The diversified growth foundation must remain the main return engine and alternatives must stay bounded.",

    sleeves: {
      growthCore: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.35,
        default: 0.55,
        max: 0.75,
      },

      growthEnhancers: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.15,
        max: 0.20,
      },

      realAssets: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.10,
        max: 0.15,
      },

      alternativeStrategy: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.05,
        default: 0.10,
        max: 0.20,
      },

      stability: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.05,
        default: 0.10,
        max: 0.25,
      },

      opportunityCapacity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.05,
      },

      liquidity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.05,
        max: 0.15,
      },
    },
  },

  TO: {
    id: "TO",
    name: "Opportunity Portfolio",
    systemName: "A long-term base with a limited active area",

    philosophy:
      "Protect a permanent long-term base while reserving explicit, bounded capacity for tactical and security-specific opportunities.",

    invariant:
      "The long-term core cannot be governed by ordinary short-term market views.",

    sleeves: {
      permanentCore: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.45,
        default: 0.65,
        max: 0.80,
      },

      stabilityReserve: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.10,
        default: 0.15,
        max: 0.25,
      },

      tacticalAllocation: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.10,
        max: 0.15,
      },

      thematicOpportunities: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.10,
      },

      securitySelection: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.10,
      },

      opportunityCapacity: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.05,
        default: 0.10,
        max: 0.15,
      },

      liquidity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.10,
      },
    },
  },

  IP: {
    id: "IP",
    name: "Income Preservation Portfolio",
    systemName: "A dependable-needs and growth system",

    philosophy:
      "Separate money needed for access or dependable income from money that can remain invested for measured long-term growth.",

    invariant:
      "Liquidity, income reliability, and resilience must take priority over yield maximization.",

    sleeves: {
      liquidity: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.10,
        default: 0.20,
        max: 0.35,
      },

      shortDurationIncome: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.10,
        default: 0.20,
        max: 0.30,
      },

      coreFixedIncome: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.15,
        default: 0.25,
        max: 0.40,
      },

      incomeEquity: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.15,
        max: 0.25,
      },

      measuredGrowth: {
        status: SLEEVE_STATUS.REQUIRED,
        min: 0.10,
        default: 0.20,
        max: 0.35,
      },

      inflationProtection: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0.10,
        max: 0.20,
      },

      selectedIncomeOpportunities: {
        status: SLEEVE_STATUS.OPTIONAL,
        min: 0,
        default: 0,
        max: 0.10,
      },
    },
  },
});

export function getPortfolioArchetype(archetypeId) {
  const archetype = PORTFOLIO_ARCHETYPES[archetypeId];

  if (!archetype) {
    throw new Error(`Unknown portfolio archetype: ${archetypeId}`);
  }

  return archetype;
}

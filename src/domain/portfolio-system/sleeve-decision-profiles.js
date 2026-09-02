/**
 * Machine-readable criteria for sleeve structural-fit decisions.
 *
 * Criteria are reusable by semantic role. Exact system/variant/sleeve
 * assignments are intentionally separate so the same criteria are not
 * copied into every constituent sleeve instance.
 */

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return Object.freeze(value);
}


export const SLEEVE_DECISION_PROFILE_VOCABULARY = deepFreeze({
  jobs: [
    'primary-strategic-foundation',
    'geographic-diversification',
    'structural-equity-diversification',
    'stability-and-resilience',
    'income-generation',
    'inflation-protection',
    'factor-improvement',
    'real-asset-diversification',
    'alternative-strategy-diversification',
    'supplemental-growth',
    'conditional-tactical-allocation',
    'bounded-opportunity-research',
    'capital-access'
  ],

  returnRoles: [
    'primary-growth',
    'geographic-diversification',
    'risk-source-diversification',
    'risk-reduction',
    'income-generation',
    'inflation-protection',
    'supporting-progress',
    'supporting-growth',
    'conditional-return',
    'optional-upside-and-learning',
    'capital-access'
  ],

  assetClasses: [
    'equity',
    'real-asset',
    'fixed-income',
    'commodity',
    'multi-asset',
    'hybrid-security'
  ],

  strategyTypes: [
    'broad-equity',
    'style-equity',
    'income-equity',
    'systematic-factor',
    'sector-equity',
    'thematic-equity',
    'fixed-income',
    'real-asset',
    'alternative-strategy',
    'income-strategy'
  ],

  complexityLevels: [
    'low',
    'moderate',
    'high'
  ],

  breadthClassifications: [
    'broad',
    'targeted',
    'narrow',
    'conditional'
  ],

  thesisMonitoringLevels: [
    'low',
    'moderate',
    'high'
  ],

  incomeRoles: [
    'none',
    'supporting',
    'primary'
  ],

  inflationSensitivities: [
    'none',
    'indirect',
    'explicit'
  ],

  durationBands: [
    'ultra-short',
    'short',
    'intermediate',
    'broad',
    'long'
  ],

  creditQualities: [
    'government',
    'investment-grade',
    'mixed',
    'below-investment-grade'
  ],

  geographies: [
    'global',
    'ex-united-states',
    'united-states',
    'developed-ex-united-states',
    'emerging-markets'
  ],

  prohibitedCharacteristics: [
    'narrow-theme',
    'single-sector',
    'speculative',
    'thesis-dependent',
    'high-monitoring',
    'below-investment-grade-credit',
    'equity-dominant',
    'long-duration',
    'illiquid',
    'core-substitution',
    'unbounded-position',
    'missing-explicit-thesis',
    'unrelated-return-objective'
  ],

  overlapDimensions: [
    'assetClasses',
    'geographies',
    'marketCaps',
    'styles',
    'factors',
    'sectors',
    'durationBand',
    'creditQualities',
    'incomeRole',
    'inflationSensitivity',
    'strategyType'
  ]
});


const EQUITY_OVERLAP_DIMENSIONS = [
  'assetClasses',
  'geographies',
  'marketCaps',
  'styles',
  'factors',
  'sectors',
  'strategyType'
];

const FIXED_INCOME_OVERLAP_DIMENSIONS = [
  'assetClasses',
  'geographies',
  'durationBand',
  'creditQualities',
  'incomeRole',
  'inflationSensitivity',
  'strategyType'
];

const BROAD_GEOGRAPHIES = [
  'global',
  'ex-united-states',
  'united-states',
  'developed-ex-united-states',
  'emerging-markets'
];


export const SLEEVE_DECISION_PROFILES = deepFreeze({
  'strategic-foundation': {
    profileId: 'strategic-foundation',
    job: 'primary-strategic-foundation',
    returnRole: 'primary-growth',
    permittedAssetClasses: ['equity'],
    permittedStrategyTypes: ['broad-equity'],
    permittedComplexityLevels: ['low'],
    supportedGeographies: BROAD_GEOGRAPHIES,
    prohibitedCharacteristics: [
      'narrow-theme',
      'single-sector',
      'speculative',
      'thesis-dependent',
      'high-monitoring'
    ],
    overlapDimensions: EQUITY_OVERLAP_DIMENSIONS
  },

  'geographic-diversification': {
    profileId: 'geographic-diversification',
    job: 'geographic-diversification',
    returnRole: 'geographic-diversification',
    permittedAssetClasses: ['equity'],
    permittedStrategyTypes: [
      'broad-equity',
      'style-equity',
      'systematic-factor'
    ],
    permittedComplexityLevels: ['low', 'moderate'],
    supportedGeographies: BROAD_GEOGRAPHIES,
    prohibitedCharacteristics: [
      'narrow-theme',
      'single-sector',
      'speculative',
      'thesis-dependent',
      'high-monitoring'
    ],
    overlapDimensions: EQUITY_OVERLAP_DIMENSIONS
  },

  'structural-equity-diversification': {
    profileId: 'structural-equity-diversification',
    job: 'structural-equity-diversification',
    returnRole: 'risk-source-diversification',
    permittedAssetClasses: ['equity'],
    permittedStrategyTypes: [
      'broad-equity',
      'style-equity',
      'systematic-factor'
    ],
    permittedComplexityLevels: ['low', 'moderate'],
    supportedGeographies: ['united-states'],
    prohibitedCharacteristics: [
      'narrow-theme',
      'single-sector',
      'speculative',
      'thesis-dependent',
      'high-monitoring'
    ],
    overlapDimensions: EQUITY_OVERLAP_DIMENSIONS
  },

  stability: {
    profileId: 'stability',
    job: 'stability-and-resilience',
    returnRole: 'risk-reduction',
    permittedAssetClasses: ['fixed-income'],
    permittedStrategyTypes: ['fixed-income'],
    permittedComplexityLevels: ['low', 'moderate'],
    supportedGeographies: ['global', 'united-states'],
    prohibitedCharacteristics: [
      'speculative',
      'below-investment-grade-credit',
      'equity-dominant',
      'thesis-dependent',
      'high-monitoring'
    ],
    overlapDimensions: FIXED_INCOME_OVERLAP_DIMENSIONS
  },

  income: {
    profileId: 'income',
    job: 'income-generation',
    returnRole: 'income-generation',
    permittedAssetClasses: [
      'fixed-income',
      'equity',
      'hybrid-security'
    ],
    permittedStrategyTypes: [
      'fixed-income',
      'income-equity',
      'income-strategy'
    ],
    permittedComplexityLevels: ['low', 'moderate'],
    supportedGeographies: ['global', 'united-states'],
    prohibitedCharacteristics: [
      'speculative',
      'missing-explicit-thesis',
      'unrelated-return-objective'
    ],
    overlapDimensions: [
      'assetClasses',
      'geographies',
      'durationBand',
      'creditQualities',
      'incomeRole',
      'strategyType'
    ]
  },

  'inflation-protection': {
    profileId: 'inflation-protection',
    job: 'inflation-protection',
    returnRole: 'inflation-protection',
    permittedAssetClasses: [
      'fixed-income',
      'real-asset',
      'commodity',
      'equity'
    ],
    permittedStrategyTypes: [
      'fixed-income',
      'real-asset',
      'sector-equity'
    ],
    permittedComplexityLevels: ['low', 'moderate'],
    supportedGeographies: ['global', 'united-states'],
    prohibitedCharacteristics: [
      'speculative',
      'unrelated-return-objective',
      'high-monitoring'
    ],
    overlapDimensions: [
      'assetClasses',
      'geographies',
      'sectors',
      'durationBand',
      'creditQualities',
      'inflationSensitivity',
      'strategyType'
    ]
  },

  'factor-improvement': {
    profileId: 'factor-improvement',
    job: 'factor-improvement',
    returnRole: 'supporting-progress',
    permittedAssetClasses: ['equity'],
    permittedStrategyTypes: [
      'systematic-factor',
      'style-equity',
      'income-equity'
    ],
    permittedComplexityLevels: ['low', 'moderate'],
    supportedGeographies: ['global', 'united-states'],
    prohibitedCharacteristics: [
      'narrow-theme',
      'single-sector',
      'speculative',
      'unbounded-position',
      'high-monitoring'
    ],
    overlapDimensions: EQUITY_OVERLAP_DIMENSIONS
  },

  'real-assets': {
    profileId: 'real-assets',
    job: 'real-asset-diversification',
    returnRole: 'risk-source-diversification',
    permittedAssetClasses: [
      'real-asset',
      'commodity',
      'equity',
      'fixed-income'
    ],
    permittedStrategyTypes: [
      'real-asset',
      'sector-equity',
      'fixed-income'
    ],
    permittedComplexityLevels: ['low', 'moderate'],
    supportedGeographies: ['global', 'united-states'],
    prohibitedCharacteristics: [
      'speculative',
      'unbounded-position',
      'unrelated-return-objective'
    ],
    overlapDimensions: [
      'assetClasses',
      'geographies',
      'sectors',
      'inflationSensitivity',
      'strategyType'
    ]
  },

  'alternative-strategy': {
    profileId: 'alternative-strategy',
    job: 'alternative-strategy-diversification',
    returnRole: 'risk-source-diversification',
    permittedAssetClasses: [
      'multi-asset',
      'equity',
      'real-asset',
      'commodity'
    ],
    permittedStrategyTypes: [
      'alternative-strategy',
      'real-asset',
      'sector-equity'
    ],
    permittedComplexityLevels: ['moderate', 'high'],
    supportedGeographies: ['global', 'united-states'],
    prohibitedCharacteristics: [
      'speculative',
      'unbounded-position',
      'missing-explicit-thesis',
      'core-substitution'
    ],
    overlapDimensions: [
      'assetClasses',
      'geographies',
      'marketCaps',
      'styles',
      'factors',
      'sectors',
      'strategyType'
    ]
  },

  'growth-enhancement': {
    profileId: 'growth-enhancement',
    job: 'supplemental-growth',
    returnRole: 'supporting-growth',
    permittedAssetClasses: ['equity'],
    permittedStrategyTypes: [
      'broad-equity',
      'style-equity',
      'systematic-factor',
      'thematic-equity'
    ],
    permittedComplexityLevels: ['low', 'moderate', 'high'],
    supportedGeographies: BROAD_GEOGRAPHIES,
    prohibitedCharacteristics: [
      'speculative',
      'unbounded-position',
      'core-substitution',
      'missing-explicit-thesis'
    ],
    overlapDimensions: EQUITY_OVERLAP_DIMENSIONS
  },

  'tactical-allocation': {
    profileId: 'tactical-allocation',
    job: 'conditional-tactical-allocation',
    returnRole: 'conditional-return',
    permittedAssetClasses: ['equity', 'multi-asset'],
    permittedStrategyTypes: [
      'sector-equity',
      'style-equity',
      'systematic-factor',
      'alternative-strategy'
    ],
    permittedComplexityLevels: ['moderate', 'high'],
    supportedGeographies: ['global', 'united-states'],
    prohibitedCharacteristics: [
      'unbounded-position',
      'missing-explicit-thesis',
      'core-substitution'
    ],
    overlapDimensions: EQUITY_OVERLAP_DIMENSIONS
  },

  'opportunity-capacity': {
    profileId: 'opportunity-capacity',
    job: 'bounded-opportunity-research',
    returnRole: 'optional-upside-and-learning',
    permittedAssetClasses: [
      'equity',
      'fixed-income',
      'hybrid-security',
      'real-asset',
      'commodity'
    ],
    permittedStrategyTypes: [
      'broad-equity',
      'thematic-equity',
      'income-strategy',
      'sector-equity',
      'real-asset'
    ],
    permittedComplexityLevels: ['moderate', 'high'],
    supportedGeographies: BROAD_GEOGRAPHIES,
    prohibitedCharacteristics: [
      'unbounded-position',
      'missing-explicit-thesis',
      'core-substitution'
    ],
    overlapDimensions: [
      'assetClasses',
      'geographies',
      'marketCaps',
      'styles',
      'factors',
      'sectors',
      'durationBand',
      'creditQualities',
      'incomeRole',
      'strategyType'
    ]
  },

  liquidity: {
    profileId: 'liquidity',
    job: 'capital-access',
    returnRole: 'capital-access',
    permittedAssetClasses: ['fixed-income'],
    permittedStrategyTypes: ['fixed-income', 'income-strategy'],
    permittedComplexityLevels: ['low', 'moderate'],
    supportedGeographies: ['united-states'],
    prohibitedCharacteristics: [
      'speculative',
      'below-investment-grade-credit',
      'equity-dominant',
      'long-duration',
      'illiquid',
      'thesis-dependent',
      'high-monitoring'
    ],
    overlapDimensions: FIXED_INCOME_OVERLAP_DIMENSIONS
  }
});


/**
 * Boundary checks that supplement the core profile criteria. A null
 * duration/credit list means that dimension is not applicable to the
 * role unless the candidate is a fixed-income security.
 */
export const SLEEVE_BOUNDARY_COMPATIBILITY = deepFreeze({
  'strategic-foundation': {
    permittedBreadthClassifications: ['broad'],
    permittedThesisMonitoringLevels: ['low'],
    permittedIncomeRoles: ['none', 'supporting'],
    permittedInflationSensitivities: ['none', 'indirect'],
    permittedDurationBands: null,
    permittedCreditQualities: null
  },
  'geographic-diversification': {
    permittedBreadthClassifications: ['broad', 'targeted'],
    permittedThesisMonitoringLevels: ['low', 'moderate'],
    permittedIncomeRoles: ['none', 'supporting'],
    permittedInflationSensitivities: ['none', 'indirect'],
    permittedDurationBands: null,
    permittedCreditQualities: null
  },
  'structural-equity-diversification': {
    permittedBreadthClassifications: ['broad', 'targeted'],
    permittedThesisMonitoringLevels: ['low', 'moderate'],
    permittedIncomeRoles: ['none', 'supporting'],
    permittedInflationSensitivities: ['none', 'indirect'],
    permittedDurationBands: null,
    permittedCreditQualities: null
  },
  stability: {
    permittedBreadthClassifications: ['broad', 'targeted'],
    permittedThesisMonitoringLevels: ['low', 'moderate'],
    permittedIncomeRoles: ['supporting', 'primary'],
    permittedInflationSensitivities: ['none', 'indirect'],
    permittedDurationBands: [
      'ultra-short', 'short', 'intermediate', 'broad', 'long'
    ],
    permittedCreditQualities: [
      'government', 'investment-grade', 'mixed'
    ]
  },
  income: {
    permittedBreadthClassifications: ['broad', 'targeted'],
    permittedThesisMonitoringLevels: ['low', 'moderate'],
    permittedIncomeRoles: ['supporting', 'primary'],
    permittedInflationSensitivities: ['none', 'indirect', 'explicit'],
    permittedDurationBands: [
      'ultra-short', 'short', 'intermediate', 'broad', 'long'
    ],
    permittedCreditQualities: [
      'government', 'investment-grade', 'mixed'
    ]
  },
  'inflation-protection': {
    permittedBreadthClassifications: ['broad', 'targeted', 'narrow'],
    permittedThesisMonitoringLevels: ['low', 'moderate'],
    permittedIncomeRoles: ['none', 'supporting', 'primary'],
    permittedInflationSensitivities: ['indirect', 'explicit'],
    permittedDurationBands: [
      'ultra-short', 'short', 'intermediate', 'broad', 'long'
    ],
    permittedCreditQualities: [
      'government', 'investment-grade', 'mixed'
    ]
  },
  'factor-improvement': {
    permittedBreadthClassifications: ['targeted'],
    permittedThesisMonitoringLevels: ['low', 'moderate'],
    permittedIncomeRoles: ['none', 'supporting', 'primary'],
    permittedInflationSensitivities: ['none', 'indirect'],
    permittedDurationBands: null,
    permittedCreditQualities: null
  },
  'real-assets': {
    permittedBreadthClassifications: ['targeted', 'narrow'],
    permittedThesisMonitoringLevels: ['low', 'moderate'],
    permittedIncomeRoles: ['none', 'supporting', 'primary'],
    permittedInflationSensitivities: ['indirect', 'explicit'],
    permittedDurationBands: [
      'ultra-short', 'short', 'intermediate', 'broad', 'long'
    ],
    permittedCreditQualities: [
      'government', 'investment-grade', 'mixed'
    ]
  },
  'alternative-strategy': {
    permittedBreadthClassifications: ['targeted', 'narrow', 'conditional'],
    permittedThesisMonitoringLevels: ['moderate', 'high'],
    permittedIncomeRoles: ['none', 'supporting', 'primary'],
    permittedInflationSensitivities: ['none', 'indirect', 'explicit'],
    permittedDurationBands: null,
    permittedCreditQualities: null
  },
  'growth-enhancement': {
    permittedBreadthClassifications: ['broad', 'targeted', 'narrow'],
    permittedThesisMonitoringLevels: ['low', 'moderate', 'high'],
    permittedIncomeRoles: ['none', 'supporting'],
    permittedInflationSensitivities: ['none', 'indirect', 'explicit'],
    permittedDurationBands: null,
    permittedCreditQualities: null
  },
  'tactical-allocation': {
    permittedBreadthClassifications: ['targeted', 'narrow', 'conditional'],
    permittedThesisMonitoringLevels: ['moderate', 'high'],
    permittedIncomeRoles: ['none', 'supporting', 'primary'],
    permittedInflationSensitivities: ['none', 'indirect', 'explicit'],
    permittedDurationBands: null,
    permittedCreditQualities: null
  },
  'opportunity-capacity': {
    permittedBreadthClassifications: [
      'broad', 'targeted', 'narrow', 'conditional'
    ],
    permittedThesisMonitoringLevels: ['low', 'moderate', 'high'],
    permittedIncomeRoles: ['none', 'supporting', 'primary'],
    permittedInflationSensitivities: ['none', 'indirect', 'explicit'],
    permittedDurationBands: [
      'ultra-short', 'short', 'intermediate', 'broad', 'long'
    ],
    permittedCreditQualities: [
      'government', 'investment-grade', 'mixed',
      'below-investment-grade'
    ]
  },
  liquidity: {
    permittedBreadthClassifications: ['broad', 'targeted'],
    permittedThesisMonitoringLevels: ['low', 'moderate'],
    permittedIncomeRoles: ['supporting', 'primary'],
    permittedInflationSensitivities: ['none'],
    permittedDurationBands: ['ultra-short', 'short'],
    permittedCreditQualities: [
      'government', 'investment-grade', 'mixed'
    ]
  }
});


const SYSTEM_VARIANT_SLEEVE_PROFILE_IDS = {
  'ES-essential': ['essential', {
    broadGrowthCore: 'strategic-foundation',
    stability: 'stability',
    liquidity: 'liquidity'
  }],
  'ES-intentional': ['intentional', {
    usCore: 'strategic-foundation',
    internationalCore: 'geographic-diversification',
    stability: 'stability',
    liquidity: 'liquidity'
  }],
  'ES-engaged': ['engaged', {
    usCore: 'strategic-foundation',
    internationalCore: 'geographic-diversification',
    stability: 'stability',
    liquidity: 'liquidity',
    personalPreference: 'opportunity-capacity'
  }],
  'GD-essential': ['essential', {
    globalEquity: 'strategic-foundation',
    globalStability: 'stability',
    liquidity: 'liquidity'
  }],
  'GD-intentional': ['intentional', {
    usEquity: 'strategic-foundation',
    developedInternational: 'geographic-diversification',
    emergingMarkets: 'geographic-diversification',
    stability: 'stability',
    inflationResilience: 'inflation-protection',
    liquidity: 'liquidity'
  }],
  'GD-engaged': ['engaged', {
    usEquity: 'strategic-foundation',
    developedInternational: 'geographic-diversification',
    emergingMarkets: 'geographic-diversification',
    smallCapDiversification: 'structural-equity-diversification',
    stability: 'stability',
    realAssetDiversifier: 'real-assets',
    liquidity: 'liquidity'
  }],
  'FT-essential': ['essential', {
    durableCore: 'strategic-foundation',
    stability: 'stability',
    targetedImprovement: 'factor-improvement'
  }],
  'FT-intentional': ['intentional', {
    durableCore: 'strategic-foundation',
    globalDiversification: 'geographic-diversification',
    stability: 'stability',
    qualityImprovement: 'factor-improvement',
    smallValueImprovement: 'factor-improvement',
    liquidity: 'liquidity'
  }],
  'FT-engaged': ['engaged', {
    durableCore: 'strategic-foundation',
    globalDiversification: 'geographic-diversification',
    stability: 'stability',
    factorImprovements: 'factor-improvement',
    strategicDiversifier: 'real-assets',
    researchCapacity: 'opportunity-capacity'
  }],
  'BFO-essential': ['essential', {
    growth: 'strategic-foundation',
    stability: 'stability',
    liquidity: 'liquidity'
  }],
  'BFO-intentional': ['intentional', {
    growth: 'strategic-foundation',
    income: 'income',
    stability: 'stability',
    diversifiers: 'real-assets',
    liquidity: 'liquidity',
    opportunity: 'opportunity-capacity'
  }],
  'BFO-engaged': ['engaged', {
    globalGrowth: 'strategic-foundation',
    income: 'income',
    stability: 'stability',
    realAssets: 'real-assets',
    strategicAlternatives: 'alternative-strategy',
    liquidity: 'liquidity',
    selectedOpportunities: 'opportunity-capacity'
  }],
  'GA-essential': ['essential', {
    growthCore: 'strategic-foundation',
    alternativeStrategy: 'alternative-strategy',
    stability: 'stability',
    liquidity: 'liquidity'
  }],
  'GA-intentional': ['intentional', {
    growthCore: 'strategic-foundation',
    growthEnhancers: 'growth-enhancement',
    realAssets: 'real-assets',
    alternativeStrategy: 'alternative-strategy',
    stability: 'stability',
    liquidity: 'liquidity'
  }],
  'GA-engaged': ['engaged', {
    globalGrowthCore: 'strategic-foundation',
    structuralGrowth: 'growth-enhancement',
    smallEmergingGrowth: 'growth-enhancement',
    realAssets: 'real-assets',
    alternativeStrategy: 'alternative-strategy',
    stability: 'stability',
    opportunityCapacity: 'opportunity-capacity'
  }],
  'TO-essential': ['essential', {
    permanentCore: 'strategic-foundation',
    stabilityReserve: 'stability',
    opportunityCapacity: 'opportunity-capacity'
  }],
  'TO-intentional': ['intentional', {
    permanentCore: 'strategic-foundation',
    stabilityReserve: 'stability',
    tacticalAllocation: 'tactical-allocation',
    opportunitySelection: 'opportunity-capacity',
    liquidity: 'liquidity'
  }],
  'TO-engaged': ['engaged', {
    permanentCore: 'strategic-foundation',
    stabilityReserve: 'stability',
    tacticalAllocation: 'tactical-allocation',
    thematicOpportunities: 'opportunity-capacity',
    securitySelection: 'opportunity-capacity',
    liquidity: 'liquidity'
  }],
  'IP-essential': ['essential', {
    highQualityIncome: 'income',
    liquidity: 'liquidity',
    measuredGrowth: 'growth-enhancement',
    inflationProtection: 'inflation-protection'
  }],
  'IP-intentional': ['intentional', {
    immediateLiquidity: 'liquidity',
    shortDurationIncome: 'income',
    coreFixedIncome: 'stability',
    incomeEquity: 'income',
    measuredGrowth: 'growth-enhancement',
    inflationProtection: 'inflation-protection'
  }],
  'IP-engaged': ['engaged', {
    liquidityLadder: 'liquidity',
    governmentBonds: 'stability',
    investmentGradeCredit: 'income',
    inflationProtection: 'inflation-protection',
    dividendEquity: 'income',
    globalGrowth: 'growth-enhancement',
    selectedIncomeOpportunities: 'opportunity-capacity'
  }]
};


export const SLEEVE_DECISION_PROFILE_ASSIGNMENTS = deepFreeze(
  Object.entries(SYSTEM_VARIANT_SLEEVE_PROFILE_IDS).flatMap(
    ([portfolioSystemId, [variantId, sleeveProfileIds]]) =>
      Object.entries(sleeveProfileIds).map(
        ([sleeveId, profileId]) => ({
          portfolioSystemId,
          variantId,
          sleeveId,
          profileId
        })
      )
  )
);

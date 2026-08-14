import {
  CLAIM_TYPES,
  SYSTEM_ROLES,
  EVIDENCE_TAGS
} from './philosophy-constants.js';

const externalAaronBux = CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX;

function sleeve({
  systemRole,
  whyItExists,
  contributionToSystem,
  governingPrinciples = [],
  sourceIds = [],
  requiresEvidence = false,
  allowedEvidenceTags = [],
  prohibitedClaimsWithoutEvidence = [],
  noEvidenceCopy = null
}) {
  return Object.freeze({
    systemRole,

    philosophy: {
      whyItExists,
      contributionToSystem,
      governingPrinciples
    },

    provenance: {
      claimType: externalAaronBux,
      sourceIds
    },

    personalization: {
      requiresEvidence,
      allowedEvidenceTags,
      prohibitedClaimsWithoutEvidence,
      ...(noEvidenceCopy ? { noEvidenceCopy } : {})
    }
  });
}

const SYSTEM_DESIGN_ONLY =
  'This role is part of the portfolio system design rather than a personal requirement inferred directly from your quiz.';

const LIQUIDITY_DESIGN_ONLY =
  'This liquidity role comes from the portfolio system design and was not inferred as a personal requirement from your quiz.';

const STABILITY_DESIGN_ONLY =
  'This stability role is part of the portfolio system design rather than a need inferred directly from your quiz.';

const OPPORTUNITY_DESIGN_ONLY =
  'This optional opportunity role is part of the portfolio system design. It should only be personalized when your quiz contains corresponding exploration or opportunity-seeking evidence.';

export const SLEEVE_PHILOSOPHIES = Object.freeze({

  // ============================================================
  // ES — SIMPLE DIVERSIFIED LONG-TERM INVESTING
  // ============================================================

  ES: Object.freeze({

    essential: Object.freeze({

      broadGrowthCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,

        whyItExists:
          'Provides one dominant long-term progress engine through broad diversified exposure.',

        contributionToSystem:
          'Allows most long-term growth responsibility to remain concentrated in one understandable structural role rather than many independent investment choices.',

        governingPrinciples: [
          'broad-diversification',
          'strategic-long-term-core',
          'portfolio-simplicity'
        ],

        sourceIds: [
          'FIDELITY_SIMPLE_DIVERSIFIED',
          'FIDELITY_DIVERSIFICATION'
        ],

        allowedEvidenceTags: [
          EVIDENCE_TAGS.SIMPLICITY,
          EVIDENCE_TAGS.BROAD_DIVERSIFICATION,
          EVIDENCE_TAGS.LOW_INVOLVEMENT
        ]
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,

        whyItExists:
          'Creates a portfolio role whose purpose is different from long-term growth.',

        contributionToSystem:
          'Prevents the growth foundation from being responsible for both long-term progress and portfolio stability.',

        governingPrinciples: [
          'asset-role-separation',
          'stocks-bonds-different-functions'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.VOLATILITY_CONCERN,
          EVIDENCE_TAGS.CAPITAL_PRESERVATION
        ],

        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,

        whyItExists:
          'Keeps accessible capital structurally separate from assets intended for long-term progress.',

        contributionToSystem:
          'Reduces the need to disturb long-term portfolio roles when capital must remain accessible.',

        governingPrinciples: [
          'liquidity-constraint',
          'capital-by-purpose'
        ],

        sourceIds: [
          'CFA_PORTFOLIO_PLANNING',
          'JPM_GOALS_BASED'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.SHORT_TIME_HORIZON,
          EVIDENCE_TAGS.MULTIPLE_TIME_HORIZONS,
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL,
          EVIDENCE_TAGS.INCOME_GOAL
        ],

        prohibitedClaimsWithoutEvidence: [
          'You need 10% liquidity.',
          'You told us you need cash.',
          'Your investor stage requires liquidity.'
        ],

        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    intentional: Object.freeze({

      usCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,

        whyItExists:
          'Makes the US portion of the long-term growth foundation explicit rather than aggregating all equity exposure into one sleeve.',

        contributionToSystem:
          'Preserves a broad strategic core while making geographic composition easier to understand and review.',

        governingPrinciples: [
          'broad-diversification',
          'strategic-long-term-core',
          'regional-diversification'
        ],

        sourceIds: [
          'FIDELITY_SIMPLE_DIVERSIFIED',
          'FIDELITY_DIVERSIFICATION'
        ],

        allowedEvidenceTags: [
          EVIDENCE_TAGS.BROAD_DIVERSIFICATION
        ]
      }),

      internationalCore: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,

        whyItExists:
          'Adds non-US long-term equity exposure so the growth foundation does not depend entirely on one geographic market.',

        contributionToSystem:
          'Makes geographic diversification an explicit portfolio role while remaining part of the low-intervention strategic foundation.',

        governingPrinciples: [
          'global-diversification',
          'regional-diversification'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.GLOBAL_DIVERSIFICATION,
          EVIDENCE_TAGS.BROAD_DIVERSIFICATION
        ],

        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,

        whyItExists:
          'Maintains a portfolio function distinct from the geographically separated growth sleeves.',

        contributionToSystem:
          'Provides structural resilience without requiring the US or international growth sleeves to perform that job.',

        governingPrinciples: [
          'asset-role-separation'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.VOLATILITY_CONCERN
        ],

        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,

        whyItExists:
          'Separates accessible capital from the long-term US and international portfolio foundation.',

        contributionToSystem:
          'Allows the long-term sleeves to retain their strategic roles without also serving near-term access needs.',

        governingPrinciples: [
          'liquidity-constraint',
          'capital-by-purpose'
        ],

        sourceIds: [
          'CFA_PORTFOLIO_PLANNING',
          'JPM_GOALS_BASED'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.SHORT_TIME_HORIZON,
          EVIDENCE_TAGS.MULTIPLE_TIME_HORIZONS,
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],

        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    engaged: Object.freeze({

      usCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,

        whyItExists:
          'Preserves a broad US strategic foundation even when the portfolio allows greater personalization.',

        contributionToSystem:
          'Keeps higher-engagement decisions subordinate to a broad long-term core.',

        governingPrinciples: [
          'strategic-long-term-core',
          'broad-diversification'
        ],

        sourceIds: [
          'FIDELITY_SIMPLE_DIVERSIFIED',
          'BLACKROCK_CORE_SATELLITE'
        ]
      }),

      internationalCore: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,

        whyItExists:
          'Maintains geographic diversification alongside the US core.',

        contributionToSystem:
          'Prevents personalization from eliminating the international component of the strategic foundation.',

        governingPrinciples: [
          'global-diversification'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ]
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,

        whyItExists:
          'Preserves a separate resilience role around the growth-oriented foundation.',

        contributionToSystem:
          'Keeps the portfolio from turning greater engagement into an all-growth structure.',

        governingPrinciples: [
          'asset-role-separation'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.VOLATILITY_CONCERN
        ],

        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,

        whyItExists:
          'Maintains accessible capital outside both the strategic core and personalization sleeve.',

        contributionToSystem:
          'Protects long-term and preference-driven positions from being used to meet unrelated access needs.',

        governingPrinciples: [
          'liquidity-constraint'
        ],

        sourceIds: [
          'CFA_PORTFOLIO_PLANNING'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL,
          EVIDENCE_TAGS.SHORT_TIME_HORIZON
        ],

        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      }),

      personalPreference: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,

        whyItExists:
          'Creates a small bounded area for personal investment preferences without allowing those choices to redefine the broad strategic foundation.',

        contributionToSystem:
          'Separates preference-driven decisions from the portfolio roles that are required for the ES philosophy to function.',

        governingPrinciples: [
          'bounded-satellites',
          'strategic-core'
        ],

        sourceIds: [
          'BLACKROCK_CORE_SATELLITE'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.EXPLORATION,
          EVIDENCE_TAGS.ACTIVE_INVOLVEMENT,
          EVIDENCE_TAGS.RESEARCH_EFFORT
        ],

        prohibitedClaimsWithoutEvidence: [
          'You need a personal preference sleeve.',
          'Your portfolio should include speculative ideas.'
        ],

        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      })
    })
  }),

  // ============================================================
  // GD — GLOBAL STRATEGIC DIVERSIFICATION
  // ============================================================

  GD: Object.freeze({

    essential: Object.freeze({

      globalEquity: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,

        whyItExists:
          'Combines global equity markets into one broad long-term growth foundation.',

        contributionToSystem:
          'Provides diversified participation across geographic markets without requiring separate regional decisions.',

        governingPrinciples: [
          'global-diversification',
          'broad-diversification'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        allowedEvidenceTags: [
          EVIDENCE_TAGS.GLOBAL_DIVERSIFICATION,
          EVIDENCE_TAGS.BROAD_DIVERSIFICATION
        ]
      }),

      globalStability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,

        whyItExists:
          'Adds a broadly diversified stabilizing role distinct from global equity exposure.',

        contributionToSystem:
          'Reduces dependence on equity markets as the portfolio only source of economic behavior.',

        governingPrinciples: [
          'asset-role-separation',
          'diversification'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.VOLATILITY_CONCERN
        ],

        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,

        whyItExists:
          'Separates accessible capital from the globally diversified strategic allocation.',

        contributionToSystem:
          'Allows the global growth and stability roles to remain long-term rather than serving immediate access needs.',

        governingPrinciples: [
          'liquidity-constraint'
        ],

        sourceIds: [
          'CFA_PORTFOLIO_PLANNING'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL,
          EVIDENCE_TAGS.SHORT_TIME_HORIZON
        ],

        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    intentional: Object.freeze({

      usEquity: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,

        whyItExists:
          'Makes US equity exposure explicit within the global allocation.',

        contributionToSystem:
          'Creates a visible regional role that can be compared with other geographic exposures without changing the overall diversification philosophy.',

        governingPrinciples: [
          'regional-diversification'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ]
      }),

      developedInternational: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,

        whyItExists:
          'Adds developed-market exposure outside the US.',

        contributionToSystem:
          'Reduces dependence on a single developed equity market and makes regional diversification separately observable.',

        governingPrinciples: [
          'regional-diversification',
          'global-diversification'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ]
      }),

      emergingMarkets: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,

        whyItExists:
          'Adds exposure to emerging economies that are not fully represented by developed markets.',

        contributionToSystem:
          'Broadens the set of geographic and economic growth drivers in the portfolio.',

        governingPrinciples: [
          'global-diversification'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        requiresEvidence: true,

        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,

        whyItExists:
          'Provides a non-equity portfolio role alongside the regional growth sleeves.',

        contributionToSystem:
          'Maintains resilience while geographic diversification handles a different portfolio problem.',

        governingPrinciples: [
          'asset-role-separation'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.VOLATILITY_CONCERN
        ],

        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      inflationResilience: sleeve({
        systemRole: SYSTEM_ROLES.INFLATION_PROTECTION,

        whyItExists:
          'Adds a portfolio role designed to respond differently when inflation affects purchasing power.',

        contributionToSystem:
          'Expands diversification beyond geography to include a distinct economic risk.',

        governingPrinciples: [
          'inflation-protection',
          'purchasing-power-risk'
        ],

        sourceIds: [
          'FIDELITY_INFLATION',
          'FIDELITY_ALTERNATIVES'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.INFLATION_CONCERN
        ],

        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,

        whyItExists:
          'Maintains a small accessible reserve separate from the diversified strategic roles.',

        contributionToSystem:
          'Preserves implementation flexibility without requiring regional sleeves to be used for near-term access.',

        governingPrinciples: [
          'liquidity-constraint'
        ],

        sourceIds: [
          'CFA_PORTFOLIO_PLANNING'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],

        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    engaged: Object.freeze({

      usEquity: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Maintains broad US exposure as one component of the globally diversified strategic foundation.',
        contributionToSystem:
          'Keeps a major developed market explicitly represented while additional diversification dimensions are introduced.',
        governingPrinciples: ['regional-diversification'],
        sourceIds: ['FIDELITY_DIVERSIFICATION']
      }),

      developedInternational: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Maintains developed-market exposure outside the US.',
        contributionToSystem:
          'Separates major international exposure for more granular monitoring.',
        governingPrinciples: ['regional-diversification'],
        sourceIds: ['FIDELITY_DIVERSIFICATION']
      }),

      emergingMarkets: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Introduces developing-market economic exposure.',
        contributionToSystem:
          'Expands geographic and economic diversification beyond developed markets.',
        governingPrinciples: ['global-diversification'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      smallCapDiversification: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Reduces dependence on large-company equity exposure by introducing a separate company-size dimension.',
        contributionToSystem:
          'Extends diversification beyond geography into another source of equity-market differentiation.',
        governingPrinciples: [
          'diversification',
          'size'
        ],
        sourceIds: [
          'FIDELITY_DIVERSIFICATION',
          'MSCI_FACTOR_INVESTING'
        ],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Preserves a non-equity resilience role as equity diversification becomes more granular.',
        contributionToSystem:
          'Maintains structural balance rather than allowing additional diversification sleeves to turn the portfolio into an all-equity system.',
        governingPrinciples: ['asset-role-separation'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.VOLATILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      realAssetDiversifier: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Introduces economic exposures that differ from conventional listed equity and bond markets.',
        contributionToSystem:
          'Extends diversification from geographic and company-size dimensions into real-economy drivers.',
        governingPrinciples: [
          'real-assets',
          'alternative-diversification'
        ],
        sourceIds: [
          'FIDELITY_ALTERNATIVES'
        ],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Keeps a small accessible reserve outside the more granular strategic exposures.',
        contributionToSystem:
          'Maintains capital-access flexibility without converting diversified long-term sleeves into cash-management tools.',
        governingPrinciples: ['liquidity-constraint'],
        sourceIds: ['CFA_PORTFOLIO_PLANNING'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    })
  }),

  // ============================================================
  // FT — STRATEGIC CORE + SYSTEMATIC IMPROVEMENT
  // ============================================================

  FT: Object.freeze({

    essential: Object.freeze({

      durableCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,

        whyItExists:
          'Keeps the majority of the portfolio in a durable strategic foundation while improvements remain subordinate.',

        contributionToSystem:
          'Creates a stable reference portfolio against which proposed improvements can be evaluated.',

        governingPrinciples: [
          'strategic-core',
          'bounded-satellites'
        ],

        sourceIds: [
          'BLACKROCK_CORE_SATELLITE'
        ]
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,

        whyItExists:
          'Maintains a separate resilience role so improvement decisions do not redefine the overall portfolio structure.',

        contributionToSystem:
          'Keeps portfolio support separate from the sleeve responsible for improvement.',

        governingPrinciples: [
          'asset-role-separation'
        ],

        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.VOLATILITY_CONCERN
        ],

        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      targetedImprovement: sleeve({
        systemRole: SYSTEM_ROLES.BOUNDED_IMPROVEMENT,

        whyItExists:
          'Creates limited capacity for a systematic improvement without allowing that improvement to redefine the durable core.',

        contributionToSystem:
          'Makes portfolio improvement explicit, measurable and structurally bounded.',

        governingPrinciples: [
          'bounded-satellites',
          'factor-investing'
        ],

        sourceIds: [
          'BLACKROCK_CORE_SATELLITE',
          'MSCI_FACTOR_INVESTING'
        ],

        requiresEvidence: true,

        allowedEvidenceTags: [
          EVIDENCE_TAGS.COMPARE_ALTERNATIVES,
          EVIDENCE_TAGS.RESEARCH_EFFORT,
          EVIDENCE_TAGS.OPTIMIZATION,
          EVIDENCE_TAGS.REPEATABLE_FRAMEWORK
        ],

        prohibitedClaimsWithoutEvidence: [
          'You need factor exposure.',
          'This will improve your returns.'
        ],

        noEvidenceCopy:
          'This improvement role is part of the FT portfolio philosophy rather than a requirement inferred directly from your quiz.'
      })
    }),

    intentional: Object.freeze({

      durableCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Keeps a durable strategic portfolio at the center of the system.',
        contributionToSystem:
          'Provides the reference foundation against which each explicit improvement must justify its role.',
        governingPrinciples: [
          'strategic-core',
          'bounded-satellites'
        ],
        sourceIds: ['BLACKROCK_CORE_SATELLITE']
      }),

      globalDiversification: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Addresses geographic concentration as a structural portfolio issue rather than treating it as a tactical bet.',
        contributionToSystem:
          'Broadens the durable foundation without changing the improvement philosophy.',
        governingPrinciples: [
          'global-diversification'
        ],
        sourceIds: ['FIDELITY_DIVERSIFICATION']
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Maintains resilience separately from the sleeves intended to improve return characteristics.',
        contributionToSystem:
          'Keeps optimization from consuming portfolio roles intended for stability.',
        governingPrinciples: ['asset-role-separation'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.VOLATILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      qualityImprovement: sleeve({
        systemRole: SYSTEM_ROLES.BOUNDED_IMPROVEMENT,
        whyItExists:
          'Introduces a bounded systematic quality exposure as one explicit improvement to the broad core.',
        contributionToSystem:
          'Makes the improvement thesis visible and separately reviewable rather than embedding it throughout the core.',
        governingPrinciples: [
          'factor-investing',
          'quality',
          'bounded-satellites'
        ],
        sourceIds: [
          'MSCI_FACTOR_INVESTING',
          'BLACKROCK_CORE_SATELLITE'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.OPTIMIZATION,
          EVIDENCE_TAGS.COMPARE_ALTERNATIVES,
          EVIDENCE_TAGS.REPEATABLE_FRAMEWORK
        ]
      }),

      smallValueImprovement: sleeve({
        systemRole: SYSTEM_ROLES.BOUNDED_IMPROVEMENT,
        whyItExists:
          'Creates a separate bounded size/value exposure rather than allowing factor tilts to redefine the core.',
        contributionToSystem:
          'Adds a second explicit improvement whose behavior can be evaluated independently.',
        governingPrinciples: [
          'factor-investing',
          'value',
          'size',
          'bounded-satellites'
        ],
        sourceIds: [
          'MSCI_FACTOR_INVESTING',
          'BLACKROCK_CORE_SATELLITE'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.OPTIMIZATION,
          EVIDENCE_TAGS.RESEARCH_EFFORT
        ]
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Keeps accessible capital outside the strategic core and improvement sleeves.',
        contributionToSystem:
          'Prevents portfolio improvement decisions from being disrupted by unrelated access needs.',
        governingPrinciples: ['liquidity-constraint'],
        sourceIds: ['CFA_PORTFOLIO_PLANNING'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    engaged: Object.freeze({

      durableCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Keeps a durable strategic core dominant even when the portfolio supports more research-intensive improvements.',
        contributionToSystem:
          'Prevents higher-engagement sleeves from redefining the entire investment system.',
        governingPrinciples: [
          'strategic-core',
          'bounded-satellites'
        ],
        sourceIds: ['BLACKROCK_CORE_SATELLITE']
      }),

      globalDiversification: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Broadens geographic exposure within the strategic portion of the system.',
        contributionToSystem:
          'Separates structural diversification from research-driven improvement.',
        governingPrinciples: ['global-diversification'],
        sourceIds: ['FIDELITY_DIVERSIFICATION']
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Maintains a resilience role independent of improvement and research decisions.',
        contributionToSystem:
          'Keeps the higher-engagement system anchored by a distinct support function.',
        governingPrinciples: ['asset-role-separation'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      factorImprovements: sleeve({
        systemRole: SYSTEM_ROLES.BOUNDED_IMPROVEMENT,
        whyItExists:
          'Combines systematic factor improvements into an explicitly bounded portfolio role.',
        contributionToSystem:
          'Allows several researched improvements while keeping them subordinate to the durable core.',
        governingPrinciples: [
          'factor-investing',
          'bounded-satellites'
        ],
        sourceIds: [
          'MSCI_FACTOR_INVESTING',
          'BLACKROCK_CORE_SATELLITE'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.OPTIMIZATION,
          EVIDENCE_TAGS.RESEARCH_EFFORT,
          EVIDENCE_TAGS.REPEATABLE_FRAMEWORK
        ]
      }),

      strategicDiversifier: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Adds a return or risk source intended to differ from the broad core and factor-improvement sleeves.',
        contributionToSystem:
          'Prevents the improvement system from relying entirely on one family of systematic equity exposures.',
        governingPrinciples: [
          'alternative-diversification'
        ],
        sourceIds: [
          'FIDELITY_ALTERNATIVES'
        ],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      researchCapacity: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,
        whyItExists:
          'Creates a deliberately small area for researching and testing ideas without requiring the core portfolio to absorb them.',
        contributionToSystem:
          'Separates learning and experimentation from the strategic and systematic parts of the portfolio.',
        governingPrinciples: [
          'bounded-satellites',
          'strategic-core'
        ],
        sourceIds: [
          'BLACKROCK_CORE_SATELLITE'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.RESEARCH_EFFORT,
          EVIDENCE_TAGS.EXPLORATION,
          EVIDENCE_TAGS.ACTIVE_INVOLVEMENT
        ],
        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      })
    })
  }),

  // ============================================================
  // BFO — ROLE-BASED MULTI-PURPOSE PORTFOLIO
  // ============================================================

  BFO: Object.freeze({

    essential: Object.freeze({

      growth: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Assigns long-term capital growth its own explicit portfolio job.',
        contributionToSystem:
          'Prevents growth objectives from being mixed with stability or near-term access needs.',
        governingPrinciples: [
          'goal-based-investing',
          'growth-role',
          'capital-by-purpose'
        ],
        sourceIds: ['JPM_GOALS_BASED']
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Assigns portfolio resilience a separate job from growth.',
        contributionToSystem:
          'Allows the portfolio to pursue long-term growth without expecting growth assets to also provide stability.',
        governingPrinciples: [
          'role-separation',
          'asset-role-separation'
        ],
        sourceIds: [
          'JPM_GOALS_BASED',
          'FIDELITY_DIVERSIFICATION'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN,
          EVIDENCE_TAGS.CAPITAL_PRESERVATION
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Assigns accessible capital its own role rather than mixing it with long-term growth or stability assets.',
        contributionToSystem:
          'Makes capital access a visible portfolio job and protects longer-term roles from near-term spending needs.',
        governingPrinciples: [
          'liquidity-role',
          'capital-by-purpose'
        ],
        sourceIds: [
          'JPM_GOALS_BASED',
          'CFA_PORTFOLIO_PLANNING'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL,
          EVIDENCE_TAGS.SHORT_TIME_HORIZON,
          EVIDENCE_TAGS.MULTIPLE_TIME_HORIZONS
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    intentional: Object.freeze({

      growth: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Maintains long-term capital growth as a distinct primary portfolio job.',
        contributionToSystem:
          'Separates wealth-building from income, stability, liquidity and opportunity roles.',
        governingPrinciples: [
          'goal-based-investing',
          'growth-role'
        ],
        sourceIds: ['JPM_GOALS_BASED']
      }),

      income: sleeve({
        systemRole: SYSTEM_ROLES.INCOME,
        whyItExists:
          'Creates a dedicated portfolio role for recurring cash-flow generation.',
        contributionToSystem:
          'Prevents the growth and stability sleeves from also being expected to satisfy income needs.',
        governingPrinciples: [
          'income-spending-role',
          'capital-by-purpose'
        ],
        sourceIds: ['JPM_GOALS_BASED'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INCOME_GOAL
        ],
        prohibitedClaimsWithoutEvidence: [
          'You need income from your portfolio.'
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Separates resilience from both growth and income generation.',
        contributionToSystem:
          'Allows each major portfolio job to remain independently understandable.',
        governingPrinciples: ['role-separation'],
        sourceIds: [
          'JPM_GOALS_BASED',
          'FIDELITY_DIVERSIFICATION'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      diversifiers: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Creates a dedicated role for return sources intended to behave differently from the main growth sleeve.',
        contributionToSystem:
          'Extends the portfolio beyond growth, income and stability without making those primary sleeves more complex.',
        governingPrinciples: [
          'alternative-diversification',
          'role-separation'
        ],
        sourceIds: [
          'FIDELITY_ALTERNATIVES',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Maintains a dedicated capital-access role.',
        contributionToSystem:
          'Keeps near-term flexibility distinct from the other portfolio jobs.',
        governingPrinciples: [
          'liquidity-role',
          'capital-by-purpose'
        ],
        sourceIds: [
          'JPM_GOALS_BASED',
          'CFA_PORTFOLIO_PLANNING'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      }),

      opportunity: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,
        whyItExists:
          'Creates a small optional capacity for selected ideas without allowing them to redefine the major portfolio jobs.',
        contributionToSystem:
          'Separates opportunity seeking from growth, income, stability and liquidity roles.',
        governingPrinciples: [
          'bounded-satellites'
        ],
        sourceIds: ['BLACKROCK_CORE_SATELLITE'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.EXPLORATION,
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING
        ],
        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      })
    }),

    engaged: Object.freeze({

      globalGrowth: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Provides a globally diversified long-term growth role.',
        contributionToSystem:
          'Keeps capital growth as a clearly defined job inside a more complex multi-role portfolio.',
        governingPrinciples: [
          'growth-role',
          'global-diversification'
        ],
        sourceIds: [
          'JPM_GOALS_BASED',
          'FIDELITY_DIVERSIFICATION'
        ]
      }),

      income: sleeve({
        systemRole: SYSTEM_ROLES.INCOME,
        whyItExists:
          'Maintains recurring income generation as a separate portfolio job.',
        contributionToSystem:
          'Makes cash-flow objectives independently observable and reviewable.',
        governingPrinciples: ['income-spending-role'],
        sourceIds: ['JPM_GOALS_BASED'],
        requiresEvidence: true,
        allowedEvidenceTags: [EVIDENCE_TAGS.INCOME_GOAL],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Maintains a dedicated resilience role inside the multi-purpose system.',
        contributionToSystem:
          'Keeps growth, income, alternatives and opportunities from carrying the responsibility for stability.',
        governingPrinciples: ['role-separation'],
        sourceIds: [
          'JPM_GOALS_BASED',
          'FIDELITY_DIVERSIFICATION'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      realAssets: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Creates a dedicated role for real-economy and inflation-sensitive exposures.',
        contributionToSystem:
          'Adds economic drivers different from conventional growth, income and stability assets.',
        governingPrinciples: [
          'real-assets',
          'inflation-resilience'
        ],
        sourceIds: ['FIDELITY_ALTERNATIVES'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INFLATION_CONCERN
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      strategicAlternatives: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Adds a bounded nontraditional strategy role distinct from public-market growth and income.',
        contributionToSystem:
          'Broadens the system return-source architecture without allowing alternatives to dominate.',
        governingPrinciples: [
          'alternative-diversification',
          'bounded-satellites'
        ],
        sourceIds: [
          'FIDELITY_ALTERNATIVES',
          'BLACKROCK_CORE_SATELLITE'
        ],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Preserves a separate access and flexibility role.',
        contributionToSystem:
          'Keeps the multi-purpose portfolio from having to liquidate unrelated sleeves for near-term capital needs.',
        governingPrinciples: [
          'liquidity-role',
          'capital-by-purpose'
        ],
        sourceIds: [
          'JPM_GOALS_BASED',
          'CFA_PORTFOLIO_PLANNING'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      }),

      selectedOpportunities: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,
        whyItExists:
          'Provides a tightly bounded area for selected high-conviction ideas.',
        contributionToSystem:
          'Keeps optional idea generation separate from the roles required for the portfolio to function.',
        governingPrinciples: [
          'bounded-satellites'
        ],
        sourceIds: ['BLACKROCK_CORE_SATELLITE'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING,
          EVIDENCE_TAGS.EXPLORATION,
          EVIDENCE_TAGS.RESEARCH_EFFORT
        ],
        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      })
    })
  }),

  // ============================================================
  // GA — GROWTH CORE + ALTERNATIVE RETURN SOURCES
  // ============================================================

  GA: Object.freeze({

    essential: Object.freeze({

      growthCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Keeps broad public-market growth as the dominant long-term return engine.',
        contributionToSystem:
          'Ensures alternative exposures remain supplements rather than replacements for the strategic growth foundation.',
        governingPrinciples: [
          'growth-core',
          'strategic-core'
        ],
        sourceIds: [
          'BLACKROCK_CORE_SATELLITE',
          'FIDELITY_DIVERSIFICATION'
        ]
      }),

      alternativeStrategy: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Introduces a bounded return source intended to differ from the broad public-market growth foundation.',
        contributionToSystem:
          'Allows the system to diversify economic return drivers without letting alternatives dominate.',
        governingPrinciples: [
          'alternative-diversification',
          'bounded-non-core-exposure'
        ],
        sourceIds: [
          'FIDELITY_ALTERNATIVES',
          'BLACKROCK_CORE_SATELLITE'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.EXPLORATION
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Provides a modest structural counterweight to the strongly growth-oriented architecture.',
        contributionToSystem:
          'Prevents the foundation and alternatives from becoming the portfolio only economic roles.',
        governingPrinciples: ['asset-role-separation'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Maintains accessible capital outside both the growth foundation and alternative exposure.',
        contributionToSystem:
          'Keeps near-term access needs from forcing changes to higher-volatility portfolio roles.',
        governingPrinciples: ['liquidity-constraint'],
        sourceIds: ['CFA_PORTFOLIO_PLANNING'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    intentional: Object.freeze({

      growthCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Preserves broad diversified growth as the largest portfolio role.',
        contributionToSystem:
          'Creates a strategic anchor around which differentiated growth and alternative exposures can be organized.',
        governingPrinciples: [
          'growth-core',
          'strategic-core'
        ],
        sourceIds: [
          'BLACKROCK_CORE_SATELLITE'
        ]
      }),

      growthEnhancers: sleeve({
        systemRole: SYSTEM_ROLES.GROWTH_ENHANCER,
        whyItExists:
          'Creates a bounded supplemental growth role distinct from the broad foundation.',
        contributionToSystem:
          'Allows targeted growth exposure to be monitored separately without changing the strategic core.',
        governingPrinciples: [
          'bounded-satellites'
        ],
        sourceIds: ['BLACKROCK_CORE_SATELLITE'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.EXPLORATION,
          EVIDENCE_TAGS.RESEARCH_EFFORT
        ],
        prohibitedClaimsWithoutEvidence: [
          'This sleeve will increase your returns.'
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      realAssets: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Adds real-economy and inflation-sensitive exposure separate from financial-market growth assets.',
        contributionToSystem:
          'Broadens the portfolio economic-driver mix.',
        governingPrinciples: [
          'real-assets',
          'inflation-resilience'
        ],
        sourceIds: ['FIDELITY_ALTERNATIVES'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INFLATION_CONCERN
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      alternativeStrategy: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Adds a separately monitored alternative return source.',
        contributionToSystem:
          'Diversifies beyond both broad growth and real assets while remaining bounded.',
        governingPrinciples: [
          'alternative-diversification',
          'bounded-satellites'
        ],
        sourceIds: [
          'FIDELITY_ALTERNATIVES',
          'BLACKROCK_CORE_SATELLITE'
        ],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Retains a resilience role as non-core growth and alternative exposures increase.',
        contributionToSystem:
          'Keeps portfolio support structurally independent from return-seeking sleeves.',
        governingPrinciples: ['asset-role-separation'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Maintains limited accessible capital outside the more differentiated return-seeking sleeves.',
        contributionToSystem:
          'Provides flexibility without requiring growth or alternative exposures to serve cash-access purposes.',
        governingPrinciples: ['liquidity-constraint'],
        sourceIds: ['CFA_PORTFOLIO_PLANNING'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    engaged: Object.freeze({

      globalGrowthCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Keeps a broad global growth foundation dominant even when several specialized return sources are permitted.',
        contributionToSystem:
          'Provides the strategic anchor that prevents the engaged portfolio from becoming a collection of unrelated ideas.',
        governingPrinciples: [
          'strategic-core',
          'global-diversification'
        ],
        sourceIds: [
          'BLACKROCK_CORE_SATELLITE',
          'FIDELITY_DIVERSIFICATION'
        ]
      }),

      structuralGrowth: sleeve({
        systemRole: SYSTEM_ROLES.GROWTH_ENHANCER,
        whyItExists:
          'Creates a bounded role for long-duration or structural growth themes.',
        contributionToSystem:
          'Separates higher-conviction growth theses from the broad global core.',
        governingPrinciples: [
          'bounded-satellites'
        ],
        sourceIds: ['BLACKROCK_CORE_SATELLITE'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.EXPLORATION,
          EVIDENCE_TAGS.RESEARCH_EFFORT
        ]
      }),

      smallEmergingGrowth: sleeve({
        systemRole: SYSTEM_ROLES.GROWTH_ENHANCER,
        whyItExists:
          'Adds growth exposure outside large developed-market companies.',
        contributionToSystem:
          'Broadens the sources of growth while keeping them structurally distinct from the core.',
        governingPrinciples: [
          'global-diversification',
          'size'
        ],
        sourceIds: [
          'FIDELITY_DIVERSIFICATION',
          'MSCI_FACTOR_INVESTING'
        ],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      realAssets: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Adds real-economy exposure to a portfolio otherwise strongly oriented toward financial growth assets.',
        contributionToSystem:
          'Introduces differentiated economic drivers and potential inflation sensitivity.',
        governingPrinciples: [
          'real-assets',
          'inflation-resilience'
        ],
        sourceIds: ['FIDELITY_ALTERNATIVES'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INFLATION_CONCERN
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      alternativeStrategy: sleeve({
        systemRole: SYSTEM_ROLES.DIVERSIFIER,
        whyItExists:
          'Adds a bounded nontraditional strategy role.',
        contributionToSystem:
          'Provides a return source distinct from the core and specialized growth sleeves.',
        governingPrinciples: [
          'alternative-diversification'
        ],
        sourceIds: ['FIDELITY_ALTERNATIVES'],
        requiresEvidence: true,
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      stability: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Preserves a structural resilience role despite the greater number of growth and alternative exposures.',
        contributionToSystem:
          'Keeps the engaged system from becoming entirely dependent on return-seeking sleeves.',
        governingPrinciples: ['asset-role-separation'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      opportunityCapacity: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,
        whyItExists:
          'Creates a hard boundary around ideas that do not belong in the strategic growth or diversifier sleeves.',
        contributionToSystem:
          'Allows experimentation while protecting the portfolio required structure.',
        governingPrinciples: [
          'bounded-satellites'
        ],
        sourceIds: ['BLACKROCK_CORE_SATELLITE'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING,
          EVIDENCE_TAGS.EXPLORATION,
          EVIDENCE_TAGS.ACTIVE_INVOLVEMENT
        ],
        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      })
    })
  }),

  // ============================================================
  // TO — STRATEGIC CORE + BOUNDED TACTICAL OPPORTUNITY
  // ============================================================

  TO: Object.freeze({

    essential: Object.freeze({

      permanentCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Keeps most capital in a permanent strategic portfolio that is not governed by ordinary short-term market views.',
        contributionToSystem:
          'Creates a protected foundation against which all opportunity decisions remain explicitly secondary.',
        governingPrinciples: [
          'strategic-core',
          'strategic-asset-allocation'
        ],
        sourceIds: [
          'BLACKROCK_CORE_SATELLITE',
          'CFA_PORTFOLIO_PLANNING'
        ]
      }),

      stabilityReserve: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Provides structural resilience and reserve capacity alongside the permanent core.',
        contributionToSystem:
          'Separates stability from the capital permitted to pursue opportunities.',
        governingPrinciples: [
          'asset-role-separation'
        ],
        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      opportunityCapacity: sleeve({
        systemRole: SYSTEM_ROLES.TACTICAL_CONDITIONAL,
        whyItExists:
          'Creates an explicit upper boundary around capital that may respond to selected opportunities.',
        contributionToSystem:
          'Prevents short-term opportunity seeking from governing the permanent portfolio.',
        governingPrinciples: [
          'tactical-asset-allocation',
          'bounded-satellites'
        ],
        sourceIds: [
          'CFA_PORTFOLIO_PLANNING',
          'BLACKROCK_CORE_SATELLITE'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING,
          EVIDENCE_TAGS.ACTIVE_INVOLVEMENT,
          EVIDENCE_TAGS.EXPLORATION
        ],
        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      })
    }),

    intentional: Object.freeze({

      permanentCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Preserves a majority strategic allocation outside ordinary tactical decision-making.',
        contributionToSystem:
          'Provides the long-term reference point around which active decisions are bounded.',
        governingPrinciples: [
          'strategic-core',
          'strategic-asset-allocation'
        ],
        sourceIds: [
          'BLACKROCK_CORE_SATELLITE',
          'CFA_PORTFOLIO_PLANNING'
        ]
      }),

      stabilityReserve: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Maintains a separate resilience and reserve function.',
        contributionToSystem:
          'Keeps tactical and security-specific positions from being responsible for portfolio stability.',
        governingPrinciples: ['asset-role-separation'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      tacticalAllocation: sleeve({
        systemRole: SYSTEM_ROLES.TACTICAL_CONDITIONAL,
        whyItExists:
          'Separates condition-driven allocation changes from the permanent strategic portfolio.',
        contributionToSystem:
          'Makes tactical decisions visible, bounded and independently reviewable.',
        governingPrinciples: [
          'tactical-asset-allocation'
        ],
        sourceIds: ['CFA_PORTFOLIO_PLANNING'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.ACTIVE_INVOLVEMENT,
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING
        ]
      }),

      opportunitySelection: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,
        whyItExists:
          'Separates security- or thesis-specific opportunities from broader tactical allocation decisions.',
        contributionToSystem:
          'Allows individual ideas to be evaluated without confusing them with the portfolio strategic or tactical allocation layers.',
        governingPrinciples: [
          'bounded-satellites'
        ],
        sourceIds: ['BLACKROCK_CORE_SATELLITE'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.RESEARCH_EFFORT,
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING,
          EVIDENCE_TAGS.EXPLORATION
        ],
        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Maintains implementation and access capacity outside the permanent and opportunity sleeves.',
        contributionToSystem:
          'Reduces the need to disturb the permanent core when capital must remain available.',
        governingPrinciples: ['liquidity-constraint'],
        sourceIds: ['CFA_PORTFOLIO_PLANNING'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    }),

    engaged: Object.freeze({

      permanentCore: sleeve({
        systemRole: SYSTEM_ROLES.FOUNDATION,
        whyItExists:
          'Keeps half of the portfolio structurally outside tactical, thematic and security-selection decisions.',
        contributionToSystem:
          'Prevents frequent decision-making from replacing the long-term strategic portfolio.',
        governingPrinciples: [
          'strategic-core',
          'strategic-asset-allocation'
        ],
        sourceIds: [
          'BLACKROCK_CORE_SATELLITE',
          'CFA_PORTFOLIO_PLANNING'
        ]
      }),

      stabilityReserve: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Maintains a separate source of resilience around the permanent core.',
        contributionToSystem:
          'Keeps active opportunity sleeves from carrying defensive responsibilities.',
        governingPrinciples: ['asset-role-separation'],
        sourceIds: ['FIDELITY_DIVERSIFICATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: STABILITY_DESIGN_ONLY
      }),

      tacticalAllocation: sleeve({
        systemRole: SYSTEM_ROLES.TACTICAL_CONDITIONAL,
        whyItExists:
          'Creates dedicated capital for condition-driven changes in allocation.',
        contributionToSystem:
          'Separates market-regime decisions from permanent and security-specific holdings.',
        governingPrinciples: ['tactical-asset-allocation'],
        sourceIds: ['CFA_PORTFOLIO_PLANNING'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.ACTIVE_INVOLVEMENT,
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING
        ]
      }),

      thematicOpportunities: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,
        whyItExists:
          'Creates a bounded role for thematic theses that are neither permanent allocation nor broad tactical positioning.',
        contributionToSystem:
          'Keeps thematic conviction isolated from the strategic foundation.',
        governingPrinciples: ['bounded-satellites'],
        sourceIds: ['BLACKROCK_CORE_SATELLITE'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.EXPLORATION,
          EVIDENCE_TAGS.RESEARCH_EFFORT
        ]
      }),

      securitySelection: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,
        whyItExists:
          'Creates a separately bounded role for security-specific research and selection.',
        contributionToSystem:
          'Prevents individual security theses from becoming indistinguishable from strategic portfolio construction.',
        governingPrinciples: ['bounded-satellites'],
        sourceIds: ['BLACKROCK_CORE_SATELLITE'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.RESEARCH_EFFORT,
          EVIDENCE_TAGS.ACTIVE_INVOLVEMENT,
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING
        ],
        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Maintains accessible implementation capital outside active and strategic exposures.',
        contributionToSystem:
          'Preserves flexibility without requiring sales from unrelated portfolio roles.',
        governingPrinciples: ['liquidity-constraint'],
        sourceIds: ['CFA_PORTFOLIO_PLANNING'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      })
    })
  }),

  // ============================================================
  // IP — NEEDS-BASED INCOME + PRESERVATION
  // ============================================================

  IP: Object.freeze({

    essential: Object.freeze({

      highQualityIncome: sleeve({
        systemRole: SYSTEM_ROLES.INCOME,
        whyItExists:
          'Makes dependable income generation a dominant portfolio function while emphasizing quality and resilience.',
        contributionToSystem:
          'Provides the primary income role rather than forcing growth or liquidity assets to produce recurring cash flow.',
        governingPrinciples: [
          'income-role',
          'capital-preservation'
        ],
        sourceIds: [
          'JPM_GOALS_BASED',
          'FIDELITY_DIVERSIFICATION'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INCOME_GOAL,
          EVIDENCE_TAGS.CAPITAL_PRESERVATION
        ],
        prohibitedClaimsWithoutEvidence: [
          'You need portfolio income.'
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      liquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Keeps capital intended for access separate from income and long-term growth assets.',
        contributionToSystem:
          'Allows the other sleeves to retain longer-term roles without being used to satisfy immediate capital needs.',
        governingPrinciples: [
          'liquidity-constraint',
          'capital-by-purpose'
        ],
        sourceIds: [
          'CFA_PORTFOLIO_PLANNING',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL,
          EVIDENCE_TAGS.SHORT_TIME_HORIZON,
          EVIDENCE_TAGS.MULTIPLE_TIME_HORIZONS
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      }),

      measuredGrowth: sleeve({
        systemRole: SYSTEM_ROLES.GROWTH_ENHANCER,
        whyItExists:
          'Maintains a bounded long-term growth role inside a portfolio primarily organized around income and preservation.',
        contributionToSystem:
          'Helps the system retain long-horizon growth potential without allowing growth to dominate income and access priorities.',
        governingPrinciples: [
          'growth-role',
          'capital-by-purpose'
        ],
        sourceIds: [
          'JPM_GOALS_BASED',
          'FIDELITY_DIVERSIFICATION'
        ]
      }),

      inflationProtection: sleeve({
        systemRole: SYSTEM_ROLES.INFLATION_PROTECTION,
        whyItExists:
          'Creates a separate role for purchasing-power risk.',
        contributionToSystem:
          'Prevents nominal income and liquidity assets from being expected to address inflation on their own.',
        governingPrinciples: [
          'inflation-protection',
          'purchasing-power-risk'
        ],
        sourceIds: [
          'FIDELITY_INFLATION'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INFLATION_CONCERN
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      })
    }),

    intentional: Object.freeze({

      immediateLiquidity: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Separates capital intended for immediate or near-term access from income-producing and growth assets.',
        contributionToSystem:
          'Creates a clearly defined first layer for capital-access requirements.',
        governingPrinciples: [
          'liquidity-constraint',
          'capital-by-purpose'
        ],
        sourceIds: [
          'CFA_PORTFOLIO_PLANNING',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL,
          EVIDENCE_TAGS.SHORT_TIME_HORIZON
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      }),

      shortDurationIncome: sleeve({
        systemRole: SYSTEM_ROLES.INCOME,
        whyItExists:
          'Creates a separate income role with a shorter-duration character than the core fixed-income sleeve.',
        contributionToSystem:
          'Allows income generation and duration exposure to be monitored separately.',
        governingPrinciples: [
          'income-role',
          'time-horizon'
        ],
        sourceIds: [
          'CFA_PORTFOLIO_PLANNING',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INCOME_GOAL,
          EVIDENCE_TAGS.SHORT_TIME_HORIZON
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      coreFixedIncome: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Provides the main fixed-income foundation for income and portfolio resilience.',
        contributionToSystem:
          'Separates dependable fixed-income exposure from liquidity, equity-income and growth roles.',
        governingPrinciples: [
          'asset-role-separation',
          'income-role',
          'capital-preservation'
        ],
        sourceIds: [
          'FIDELITY_DIVERSIFICATION',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INCOME_GOAL,
          EVIDENCE_TAGS.CAPITAL_PRESERVATION
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      incomeEquity: sleeve({
        systemRole: SYSTEM_ROLES.INCOME,
        whyItExists:
          'Creates an equity-based income role distinct from fixed-income sources.',
        contributionToSystem:
          'Diversifies how the portfolio generates income while retaining equity growth characteristics.',
        governingPrinciples: [
          'income-role',
          'diversification'
        ],
        sourceIds: [
          'FIDELITY_DIVERSIFICATION',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INCOME_GOAL
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      measuredGrowth: sleeve({
        systemRole: SYSTEM_ROLES.GROWTH_ENHANCER,
        whyItExists:
          'Keeps a separately bounded long-term growth role inside the income-oriented system.',
        contributionToSystem:
          'Supports longer-term capital growth without making growth the portfolio dominant purpose.',
        governingPrinciples: [
          'growth-role',
          'capital-by-purpose'
        ],
        sourceIds: [
          'JPM_GOALS_BASED'
        ]
      }),

      inflationProtection: sleeve({
        systemRole: SYSTEM_ROLES.INFLATION_PROTECTION,
        whyItExists:
          'Makes purchasing-power protection a separately visible portfolio job.',
        contributionToSystem:
          'Addresses an economic risk not necessarily solved by nominal income or growth sleeves.',
        governingPrinciples: [
          'inflation-protection',
          'purchasing-power-risk'
        ],
        sourceIds: ['FIDELITY_INFLATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INFLATION_CONCERN
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      })
    }),

    engaged: Object.freeze({

      liquidityLadder: sleeve({
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,
        whyItExists:
          'Organizes accessible capital across planned time horizons rather than treating liquidity as one undifferentiated pool.',
        contributionToSystem:
          'Makes timing of capital access explicit within the income-preservation architecture.',
        governingPrinciples: [
          'liquidity-constraint',
          'time-horizon',
          'capital-by-purpose'
        ],
        sourceIds: [
          'CFA_PORTFOLIO_PLANNING',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL,
          EVIDENCE_TAGS.MULTIPLE_TIME_HORIZONS,
          EVIDENCE_TAGS.SHORT_TIME_HORIZON
        ],
        noEvidenceCopy: LIQUIDITY_DESIGN_ONLY
      }),

      governmentBonds: sleeve({
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,
        whyItExists:
          'Creates a high-quality fixed-income resilience role separate from credit risk.',
        contributionToSystem:
          'Allows government-rate exposure and credit exposure to be monitored independently.',
        governingPrinciples: [
          'asset-role-separation',
          'capital-preservation'
        ],
        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.CAPITAL_PRESERVATION,
          EVIDENCE_TAGS.STABILITY_CONCERN
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      investmentGradeCredit: sleeve({
        systemRole: SYSTEM_ROLES.INCOME,
        whyItExists:
          'Creates a dedicated credit-income role within explicit quality boundaries.',
        contributionToSystem:
          'Separates credit risk and income generation from government-bond resilience.',
        governingPrinciples: [
          'income-role',
          'asset-role-separation'
        ],
        sourceIds: [
          'FIDELITY_DIVERSIFICATION'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INCOME_GOAL
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      inflationProtection: sleeve({
        systemRole: SYSTEM_ROLES.INFLATION_PROTECTION,
        whyItExists:
          'Creates a dedicated sleeve for purchasing-power risk.',
        contributionToSystem:
          'Separates inflation sensitivity from nominal government and credit income.',
        governingPrinciples: [
          'inflation-protection',
          'purchasing-power-risk'
        ],
        sourceIds: ['FIDELITY_INFLATION'],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INFLATION_CONCERN
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      dividendEquity: sleeve({
        systemRole: SYSTEM_ROLES.INCOME,
        whyItExists:
          'Adds an equity-based source of income distinct from government and credit bonds.',
        contributionToSystem:
          'Diversifies the portfolio income architecture while retaining exposure to corporate growth.',
        governingPrinciples: [
          'income-role',
          'diversification'
        ],
        sourceIds: [
          'FIDELITY_DIVERSIFICATION',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INCOME_GOAL
        ],
        noEvidenceCopy: SYSTEM_DESIGN_ONLY
      }),

      globalGrowth: sleeve({
        systemRole: SYSTEM_ROLES.GROWTH_ENHANCER,
        whyItExists:
          'Retains a global long-term growth role inside a portfolio whose dominant purposes are income and preservation.',
        contributionToSystem:
          'Supports long-term purchasing power without allowing growth to overtake the system income and resilience architecture.',
        governingPrinciples: [
          'growth-role',
          'global-diversification'
        ],
        sourceIds: [
          'JPM_GOALS_BASED',
          'FIDELITY_DIVERSIFICATION'
        ]
      }),

      selectedIncomeOpportunities: sleeve({
        systemRole: SYSTEM_ROLES.EXPLORATION_RESEARCH,
        whyItExists:
          'Creates bounded capacity for selected higher-effort income ideas without changing the core income and preservation structure.',
        contributionToSystem:
          'Separates opportunistic income research from the government, credit and dividend roles required for the system to function.',
        governingPrinciples: [
          'bounded-satellites',
          'income-role'
        ],
        sourceIds: [
          'BLACKROCK_CORE_SATELLITE',
          'JPM_GOALS_BASED'
        ],
        requiresEvidence: true,
        allowedEvidenceTags: [
          EVIDENCE_TAGS.INCOME_GOAL,
          EVIDENCE_TAGS.RESEARCH_EFFORT,
          EVIDENCE_TAGS.ACTIVE_INVOLVEMENT,
          EVIDENCE_TAGS.OPPORTUNITY_SEEKING
        ],
        noEvidenceCopy: OPPORTUNITY_DESIGN_ONLY
      })
    })
  })
});

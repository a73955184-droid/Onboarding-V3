/**
 * Constituent Portfolio Catalogue
 *
 * Defines three portfolio variants for each of the seven AaronBux
 * portfolio archetypes:
 *
 * - essential
 * - intentional
 * - engaged
 *
 * Each variant supplies a complete sleeve allocation totaling 100%.
 *
 * The portfolio archetype determines the portfolio philosophy.
 * The profile variant determines sleeve count, granularity, effort,
 * asset categories, monitoring cadence, and bounded flexibility.
 */

function createSleeve({
  id,
  label,
  weight,
  returnFunction,
  effort,
  assetCategories,
  reviewCadence,
  marketTrendTags = [],
  startsUnallocated = false,
  description = null,
  monitoringGuidance = null
}) {
  return {
    id,
    label,
    weight,
    returnFunction,
    effort,
    assetCategories,
    reviewCadence,
    marketTrendTags,
    startsUnallocated,
    description,
    monitoringGuidance
  };
}


function createPortfolio({
  id,
  archetypeId,
  variantId,
  name,
  summary,
  sleeves
}) {
  return {
    id,
    archetypeId,
    variantId,
    name,
    summary,
    sleeves
  };
}


export const CONSTITUENT_PORTFOLIOS =
  Object.freeze({
    /*
     * ================================================================
     * ES — Effortless Portfolio
     * ================================================================
     *
     * Invariant:
     * Broad holdings dominate and the system remains simple.
     */

    ES: {
      essential: createPortfolio({
        id:
          'ES-essential',

        archetypeId:
          'ES',

        variantId:
          'essential',

        name:
          'Essential Effortless Portfolio',

        summary:
          'A small number of broad holdings designed to support long-term progress with minimal intervention.',

        sleeves: [
          createSleeve({
            id:
              'broadGrowthCore',

            label:
              'Broad Growth Core',

            weight:
              0.70,

            returnFunction:
              'primary-long-term-progress',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'The primary long-term growth engine, implemented through broad diversified exposure.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.20,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Reduces dependence on equity markets and supports portfolio resilience.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.10,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Keeps near-term money available and separate from long-term investments.'
          })
        ]
      }),


      intentional: createPortfolio({
        id:
          'ES-intentional',

        archetypeId:
          'ES',

        variantId:
          'intentional',

        name:
          'Intentional Effortless Portfolio',

        summary:
          'A simple portfolio with geographic exposures separated for clearer understanding and periodic rebalancing.',

        sleeves: [
          createSleeve({
            id:
              'usCore',

            label:
              'US Core',

            weight:
              0.45,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Broad exposure to the US equity market.'
          }),

          createSleeve({
            id:
              'internationalCore',

            label:
              'International Core',

            weight:
              0.25,

            returnFunction:
              'geographic-diversification',

            effort:
              'low',

            assetCategories: [
              'broad-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'international-growth',
              'currency'
            ],

            description:
              'Reduces dependence on one country and one economic environment.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.20,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides a lower-volatility counterweight to equity exposure.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.10,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Supports near-term access without disrupting long-term holdings.'
          })
        ]
      }),


      engaged: createPortfolio({
        id:
          'ES-engaged',

        archetypeId:
          'ES',

        variantId:
          'engaged',

        name:
          'Engaged Effortless Portfolio',

        summary:
          'A broad passive foundation with a small, controlled area for personal preferences.',

        sleeves: [
          createSleeve({
            id:
              'usCore',

            label:
              'US Core',

            weight:
              0.40,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Broad US exposure remains one of the main long-term growth engines.'
          }),

          createSleeve({
            id:
              'internationalCore',

            label:
              'International Core',

            weight:
              0.25,

            returnFunction:
              'geographic-diversification',

            effort:
              'low',

            assetCategories: [
              'developed-international-equity',
              'emerging-market-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'international-growth',
              'currency'
            ],

            description:
              'Adds developed and emerging-market exposure without changing the passive philosophy.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.20,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Supports resilience and reduces reliance on equity performance.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.10,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Keeps accessible capital separate from long-term investments.'
          }),

          createSleeve({
            id:
              'personalPreference',

            label:
              'Personal Preference',

            weight:
              0.05,

            returnFunction:
              'limited-customization',

            effort:
              'moderate',

            assetCategories: [
              'broad-preference-fund'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'theme-specific'
            ],

            description:
              'Allows limited customization without redefining the broad passive portfolio.'
          })
        ]
      })
    },


    /*
     * ================================================================
     * GD — Global Diversified Portfolio
     * ================================================================
     *
     * Invariant:
     * The portfolio must retain meaningful exposure to multiple
     * geographic and economic return sources.
     */

    GD: {
      essential: createPortfolio({
        id:
          'GD-essential',

        archetypeId:
          'GD',

        variantId:
          'essential',

        name:
          'Essential Global Diversified Portfolio',

        summary:
          'Broad global equity and bond exposure packaged into a small number of understandable sleeves.',

        sleeves: [
          createSleeve({
            id:
              'globalEquity',

            label:
              'Global Equity',

            weight:
              0.70,

            returnFunction:
              'primary-long-term-progress',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'international-growth',
              'currency'
            ],

            description:
              'Provides broad exposure across countries and regions through one primary growth sleeve.'
          }),

          createSleeve({
            id:
              'globalStability',

            label:
              'Global Stability',

            weight:
              0.20,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Balances the equity allocation with high-quality fixed income.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.10,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Provides accessible reserves without requiring the sale of long-term holdings.'
          })
        ]
      }),


      intentional: createPortfolio({
        id:
          'GD-intentional',

        archetypeId:
          'GD',

        variantId:
          'intentional',

        name:
          'Intentional Global Diversified Portfolio',

        summary:
          'A globally diversified system with visible regional, stability, inflation, and liquidity roles.',

        sleeves: [
          createSleeve({
            id:
              'usEquity',

            label:
              'US Equity',

            weight:
              0.35,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Provides broad exposure to the US equity market.'
          }),

          createSleeve({
            id:
              'developedInternational',

            label:
              'Developed International',

            weight:
              0.25,

            returnFunction:
              'geographic-diversification',

            effort:
              'low',

            assetCategories: [
              'developed-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'international-growth',
              'currency'
            ],

            description:
              'Adds developed-market exposure outside the United States.'
          }),

          createSleeve({
            id:
              'emergingMarkets',

            label:
              'Emerging Markets',

            weight:
              0.10,

            returnFunction:
              'geographic-diversification',

            effort:
              'moderate',

            assetCategories: [
              'emerging-market-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'emerging-markets',
              'currency',
              'global-growth'
            ],

            description:
              'Adds exposure to economies and return drivers not fully represented in developed markets.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.20,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides resilience when equity markets are under pressure.'
          }),

          createSleeve({
            id:
              'inflationResilience',

            label:
              'Inflation Resilience',

            weight:
              0.05,

            returnFunction:
              'inflation-protection',

            effort:
              'moderate',

            assetCategories: [
              'inflation-protected-bonds',
              'real-assets'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'real-asset-valuations'
            ],

            description:
              'Adds limited protection against loss of purchasing power.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.05,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Maintains near-term access without interrupting long-term exposures.'
          })
        ]
      }),


      engaged: createPortfolio({
        id:
          'GD-engaged',

        archetypeId:
          'GD',

        variantId:
          'engaged',

        name:
          'Engaged Global Diversified Portfolio',

        summary:
          'A more granular global system that reduces dependence on region, company size, and traditional stock-and-bond exposures.',

        sleeves: [
          createSleeve({
            id:
              'usEquity',

            label:
              'US Equity',

            weight:
              0.30,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Maintains broad US exposure while leaving more room for other return sources.'
          }),

          createSleeve({
            id:
              'developedInternational',

            label:
              'Developed International',

            weight:
              0.20,

            returnFunction:
              'geographic-diversification',

            effort:
              'low',

            assetCategories: [
              'developed-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'international-growth',
              'currency'
            ],

            description:
              'Adds developed-market exposure outside the United States.'
          }),

          createSleeve({
            id:
              'emergingMarkets',

            label:
              'Emerging Markets',

            weight:
              0.10,

            returnFunction:
              'geographic-diversification',

            effort:
              'moderate',

            assetCategories: [
              'emerging-market-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'emerging-markets',
              'currency'
            ],

            description:
              'Adds bounded exposure to developing economies.'
          }),

          createSleeve({
            id:
              'smallCapDiversification',

            label:
              'Small-Cap Diversification',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'moderate',

            assetCategories: [
              'small-cap-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'small-cap-cycle',
              'valuation-spread'
            ],

            description:
              'Reduces reliance on the largest public companies.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.15,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides resilience and a source of rebalancing capacity.'
          }),

          createSleeve({
            id:
              'realAssetDiversifier',

            label:
              'Real-Asset Diversifier',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'moderate',

            assetCategories: [
              'real-assets'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'real-asset-valuations'
            ],

            description:
              'Adds exposure to assets with return drivers distinct from conventional equities.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.05,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Provides accessible reserves and rebalancing flexibility.'
          })
        ]
      })
    },


    /*
     * ================================================================
     * FT — Systematic Improvement Portfolio
     * ================================================================
     *
     * Invariant:
     * Every non-core exposure must solve a defined portfolio limitation.
     */

    FT: {
      essential: createPortfolio({
        id:
          'FT-essential',

        archetypeId:
          'FT',

        variantId:
          'essential',

        name:
          'Essential Systematic Improvement Portfolio',

        summary:
          'A durable broad foundation with one carefully bounded improvement sleeve.',

        sleeves: [
          createSleeve({
            id:
              'durableCore',

            label:
              'Durable Core',

            weight:
              0.70,

            returnFunction:
              'primary-long-term-progress',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Carries most expected long-term progress without requiring constant evaluation.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.20,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Reduces reliance on the equity market and supports resilience.'
          }),

          createSleeve({
            id:
              'targetedImprovement',

            label:
              'Targeted Improvement',

            weight:
              0.10,

            returnFunction:
              'supporting-progress',

            effort:
              'moderate',

            assetCategories: [
              'diversified-factor-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'factor-evidence',
              'valuation-spread',
              'portfolio-overlap'
            ],

            description:
              'Attempts to improve one defined limitation without replacing the durable core.'
          })
        ]
      }),


      intentional: createPortfolio({
        id:
          'FT-intentional',

        archetypeId:
          'FT',

        variantId:
          'intentional',

        name:
          'Intentional Systematic Improvement Portfolio',

        summary:
          'A durable core supported by geographic diversification, stability, and two evidence-based improvements.',

        sleeves: [
          createSleeve({
            id:
              'durableCore',

            label:
              'Durable Core',

            weight:
              0.40,

            returnFunction:
              'primary-long-term-progress',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Remains the primary source of long-term market exposure.'
          }),

          createSleeve({
            id:
              'globalDiversification',

            label:
              'Global Diversification',

            weight:
              0.20,

            returnFunction:
              'geographic-diversification',

            effort:
              'low',

            assetCategories: [
              'broad-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'international-growth',
              'currency'
            ],

            description:
              'Reduces dependence on one country and one market environment.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.15,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides resilience and a source of rebalancing capacity.'
          }),

          createSleeve({
            id:
              'qualityImprovement',

            label:
              'Quality Improvement',

            weight:
              0.10,

            returnFunction:
              'supporting-progress',

            effort:
              'moderate',

            assetCategories: [
              'quality-factor-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'factor-evidence',
              'quality-spread',
              'portfolio-overlap'
            ],

            description:
              'Adds a defined quality exposure that must continue to justify its role.'
          }),

          createSleeve({
            id:
              'smallValueImprovement',

            label:
              'Small-Value Improvement',

            weight:
              0.10,

            returnFunction:
              'supporting-progress',

            effort:
              'moderate',

            assetCategories: [
              'small-value-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'valuation-spread',
              'small-cap-cycle',
              'factor-evidence'
            ],

            description:
              'Adds a bounded exposure intended to address concentration in large growth-oriented companies.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.05,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Provides accessible reserves without disrupting the long-term system.'
          })
        ]
      }),


      engaged: createPortfolio({
        id:
          'FT-engaged',

        archetypeId:
          'FT',

        variantId:
          'engaged',

        name:
          'Engaged Systematic Improvement Portfolio',

        summary:
          'A durable foundation with multiple evidence-based improvements and a small research capacity.',

        sleeves: [
          createSleeve({
            id:
              'durableCore',

            label:
              'Durable Core',

            weight:
              0.45,

            returnFunction:
              'primary-long-term-progress',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity',
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Carries most expected progress and should remain comparatively simple.'
          }),

          createSleeve({
            id:
              'globalDiversification',

            label:
              'Global Diversification',

            weight:
              0.15,

            returnFunction:
              'geographic-diversification',

            effort:
              'low',

            assetCategories: [
              'broad-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'international-growth',
              'currency'
            ],

            description:
              'Reduces dependence on the domestic market.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.10,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides portfolio resilience and rebalancing capacity.'
          }),

          createSleeve({
            id:
              'factorImprovements',

            label:
              'Factor Improvements',

            weight:
              0.15,

            returnFunction:
              'supporting-progress',

            effort:
              'moderate',

            assetCategories: [
              'quality-factor-equity',
              'value-factor-equity',
              'small-value-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'factor-evidence',
              'valuation-spread',
              'portfolio-overlap'
            ],

            description:
              'Combines selected evidence-based improvements that must each retain a defined purpose.'
          }),

          createSleeve({
            id:
              'strategicDiversifier',

            label:
              'Strategic Diversifier',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'moderate',

            assetCategories: [
              'real-assets'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'real-asset-valuations'
            ],

            description:
              'Adds a return source intended to remain distinct from the durable core.'
          }),

          createSleeve({
            id:
              'researchCapacity',

            label:
              'Research Capacity',

            weight:
              0.05,

            returnFunction:
              'optional-upside-and-learning',

            effort:
              'high',

            assetCategories: [
              'selected-equity',
              'thematic-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'company-specific',
              'theme-specific'
            ],

            startsUnallocated:
              true,

            description:
              'A bounded area for researched ideas that begins unallocated.'
          })
        ]
      })
    },


    /*
     * ================================================================
     * BFO — Balanced Multi-Purpose Portfolio
     * ================================================================
     *
     * Invariant:
     * Every active sleeve performs a distinct portfolio job.
     */

    BFO: {
      essential: createPortfolio({
        id:
          'BFO-essential',

        archetypeId:
          'BFO',

        variantId:
          'essential',

        name:
          'Essential Balanced Multi-Purpose Portfolio',

        summary:
          'A clear separation between long-term growth, stability, and accessible money.',

        sleeves: [
          createSleeve({
            id:
              'growth',

            label:
              'Growth',

            weight:
              0.55,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Supports long-term compounding.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.30,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides resilience and reduces dependence on equity markets.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.15,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Supports near-term access and planned spending.'
          })
        ]
      }),


      intentional: createPortfolio({
        id:
          'BFO-intentional',

        archetypeId:
          'BFO',

        variantId:
          'intentional',

        name:
          'Intentional Balanced Multi-Purpose Portfolio',

        summary:
          'A portfolio in which growth, income, stability, diversification, liquidity, and opportunity each have a stated role.',

        sleeves: [
          createSleeve({
            id:
              'growth',

            label:
              'Growth',

            weight:
              0.40,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity',
              'broad-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'international-growth'
            ],

            description:
              'Provides the main source of long-term capital growth.'
          }),

          createSleeve({
            id:
              'income',

            label:
              'Income',

            weight:
              0.20,

            returnFunction:
              'income-generation',

            effort:
              'moderate',

            assetCategories: [
              'high-quality-bonds',
              'income-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'interest-rates',
              'credit-conditions',
              'dividend-sustainability'
            ],

            description:
              'Supports recurring cash flow without relying on yield alone.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.15,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'government-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides a dependable counterweight to growth assets.'
          }),

          createSleeve({
            id:
              'diversifiers',

            label:
              'Diversifiers',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'moderate',

            assetCategories: [
              'real-assets',
              'inflation-protected-bonds'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'real-asset-valuations'
            ],

            description:
              'Adds return sources that are intended to behave differently from the main growth sleeve.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.10,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Maintains near-term access and portfolio flexibility.'
          }),

          createSleeve({
            id:
              'opportunity',

            label:
              'Selected Opportunities',

            weight:
              0.05,

            returnFunction:
              'optional-upside',

            effort:
              'high',

            assetCategories: [
              'selected-equity',
              'thematic-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'company-specific',
              'theme-specific'
            ],

            startsUnallocated:
              true,

            description:
              'A small bounded capacity for selected ideas.'
          })
        ]
      }),


      engaged: createPortfolio({
        id:
          'BFO-engaged',

        archetypeId:
          'BFO',

        variantId:
          'engaged',

        name:
          'Engaged Balanced Multi-Purpose Portfolio',

        summary:
          'A multi-role system with distinct growth, income, stability, real-asset, alternative, liquidity, and opportunity sleeves.',

        sleeves: [
          createSleeve({
            id:
              'globalGrowth',

            label:
              'Global Growth',

            weight:
              0.35,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity',
              'developed-international-equity',
              'emerging-market-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'international-growth',
              'currency'
            ],

            description:
              'Provides diversified long-term growth across regions.'
          }),

          createSleeve({
            id:
              'income',

            label:
              'Income',

            weight:
              0.15,

            returnFunction:
              'income-generation',

            effort:
              'moderate',

            assetCategories: [
              'investment-grade-credit',
              'income-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'credit-conditions',
              'interest-rates',
              'dividend-sustainability'
            ],

            description:
              'Supports recurring income through multiple sources.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.15,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'government-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Protects the portfolio from relying entirely on risk assets.'
          }),

          createSleeve({
            id:
              'realAssets',

            label:
              'Real Assets',

            weight:
              0.10,

            returnFunction:
              'inflation-diversification',

            effort:
              'moderate',

            assetCategories: [
              'real-assets'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'real-asset-valuations'
            ],

            description:
              'Adds exposure to real estate, infrastructure, and inflation-sensitive assets.'
          }),

          createSleeve({
            id:
              'strategicAlternatives',

            label:
              'Strategic Alternatives',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'high',

            assetCategories: [
              'alternative-strategy'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'alternative-strategy-evidence',
              'correlation-change'
            ],

            description:
              'Adds a bounded strategy intended to behave differently from traditional stock and bond holdings.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.10,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Supports planned needs and provides optionality.'
          }),

          createSleeve({
            id:
              'selectedOpportunities',

            label:
              'Selected Opportunities',

            weight:
              0.05,

            returnFunction:
              'optional-upside-and-learning',

            effort:
              'high',

            assetCategories: [
              'selected-equity',
              'thematic-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'company-specific',
              'theme-specific'
            ],

            startsUnallocated:
              true,

            description:
              'Provides limited capacity for selected ideas without allowing them to redefine the portfolio.'
          })
        ]
      })
    },


    /*
     * ================================================================
     * GA — Growth & Alternatives Portfolio
     * ================================================================
     *
     * Invariant:
     * Growth remains the main engine and alternatives remain bounded.
     */

    GA: {
      essential: createPortfolio({
        id:
          'GA-essential',

        archetypeId:
          'GA',

        variantId:
          'essential',

        name:
          'Essential Growth & Alternatives Portfolio',

        summary:
          'A broad growth foundation with one bounded alternative exposure and a modest stability layer.',

        sleeves: [
          createSleeve({
            id:
              'growthCore',

            label:
              'Broad Growth Core',

            weight:
              0.70,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Carries most expected long-term progress.'
          }),

          createSleeve({
            id:
              'alternativeStrategy',

            label:
              'Diversified Alternatives',

            weight:
              0.15,

            returnFunction:
              'risk-source-diversification',

            effort:
              'moderate',

            assetCategories: [
              'real-assets',
              'alternative-strategy'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'alternative-strategy-evidence'
            ],

            description:
              'Adds a bounded return source that is intended to remain distinct from the growth core.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.10,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides limited resilience and rebalancing capacity.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.05,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Maintains accessible reserves.'
          })
        ]
      }),


      intentional: createPortfolio({
        id:
          'GA-intentional',

        archetypeId:
          'GA',

        variantId:
          'intentional',

        name:
          'Intentional Growth & Alternatives Portfolio',

        summary:
          'A broad growth core supported by growth enhancers, real assets, an alternative strategy, stability, and liquidity.',

        sleeves: [
          createSleeve({
            id:
              'growthCore',

            label:
              'Broad Growth Core',

            weight:
              0.50,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity',
              'broad-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'international-growth'
            ],

            description:
              'Remains the primary return engine.'
          }),

          createSleeve({
            id:
              'growthEnhancers',

            label:
              'Growth Enhancers',

            weight:
              0.15,

            returnFunction:
              'supporting-growth',

            effort:
              'moderate',

            assetCategories: [
              'small-cap-equity',
              'growth-oriented-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'small-cap-cycle',
              'growth-valuations'
            ],

            description:
              'Adds selected exposures intended to enhance long-term growth.'
          }),

          createSleeve({
            id:
              'realAssets',

            label:
              'Real Assets',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'moderate',

            assetCategories: [
              'real-assets'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'real-asset-valuations'
            ],

            description:
              'Adds exposure to real estate, infrastructure, or other real assets.'
          }),

          createSleeve({
            id:
              'alternativeStrategy',

            label:
              'Alternative Strategy',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'high',

            assetCategories: [
              'alternative-strategy'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'alternative-strategy-evidence',
              'correlation-change'
            ],

            description:
              'Adds a strategy with a return pattern intended to remain distinct from conventional equities.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.10,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'government-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides limited resilience during weaker growth environments.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.05,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Maintains accessible reserves.'
          })
        ]
      }),


      engaged: createPortfolio({
        id:
          'GA-engaged',

        archetypeId:
          'GA',

        variantId:
          'engaged',

        name:
          'Engaged Growth & Alternatives Portfolio',

        summary:
          'A granular growth system with bounded structural themes, alternatives, real assets, stability, and research capacity.',

        sleeves: [
          createSleeve({
            id:
              'globalGrowthCore',

            label:
              'Global Growth Core',

            weight:
              0.40,

            returnFunction:
              'primary-growth',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity',
              'broad-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'international-growth'
            ],

            description:
              'Carries most expected long-term growth.'
          }),

          createSleeve({
            id:
              'structuralGrowth',

            label:
              'Structural Growth',

            weight:
              0.15,

            returnFunction:
              'supporting-growth',

            effort:
              'high',

            assetCategories: [
              'thematic-equity',
              'growth-oriented-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'theme-specific',
              'growth-valuations'
            ],

            description:
              'Adds selected long-duration growth themes within a bounded allocation.'
          }),

          createSleeve({
            id:
              'smallEmergingGrowth',

            label:
              'Small & Emerging Growth',

            weight:
              0.10,

            returnFunction:
              'supporting-growth',

            effort:
              'moderate',

            assetCategories: [
              'small-cap-equity',
              'emerging-market-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'small-cap-cycle',
              'emerging-markets'
            ],

            description:
              'Adds growth sources outside large developed-market companies.'
          }),

          createSleeve({
            id:
              'realAssets',

            label:
              'Real Assets',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'moderate',

            assetCategories: [
              'real-assets'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'real-asset-valuations'
            ],

            description:
              'Adds exposure to physical and inflation-sensitive assets.'
          }),

          createSleeve({
            id:
              'alternativeStrategy',

            label:
              'Alternative Strategy',

            weight:
              0.10,

            returnFunction:
              'risk-source-diversification',

            effort:
              'high',

            assetCategories: [
              'alternative-strategy'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'alternative-strategy-evidence',
              'correlation-change'
            ],

            description:
              'Provides a bounded strategy with distinct return behavior.'
          }),

          createSleeve({
            id:
              'stability',

            label:
              'Stability',

            weight:
              0.10,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'government-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides a limited counterweight to the portfolio’s growth orientation.'
          }),

          createSleeve({
            id:
              'opportunityCapacity',

            label:
              'Opportunity Capacity',

            weight:
              0.05,

            returnFunction:
              'optional-upside-and-learning',

            effort:
              'high',

            assetCategories: [
              'selected-equity',
              'thematic-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'company-specific',
              'theme-specific'
            ],

            startsUnallocated:
              true,

            description:
              'A small allocation reserved for researched ideas that pass the system’s criteria.'
          })
        ]
      })
    },


    /*
     * ================================================================
     * TO — Opportunity Portfolio
     * ================================================================
     *
     * Invariant:
     * A permanent long-term core remains protected from tactical behavior.
     */

    TO: {
      essential: createPortfolio({
        id:
          'TO-essential',

        archetypeId:
          'TO',

        variantId:
          'essential',

        name:
          'Essential Opportunity Portfolio',

        summary:
          'A large permanent core with a small, explicitly bounded opportunity allowance.',

        sleeves: [
          createSleeve({
            id:
              'permanentCore',

            label:
              'Permanent Core',

            weight:
              0.75,

            returnFunction:
              'primary-long-term-progress',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'The primary long-term portfolio that should not be governed by ordinary short-term views.'
          }),

          createSleeve({
            id:
              'stabilityReserve',

            label:
              'Stability Reserve',

            weight:
              0.15,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds',
              'cash-equivalent'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'short-term-rates'
            ],

            description:
              'Provides resilience and preserves flexibility.'
          }),

          createSleeve({
            id:
              'opportunityCapacity',

            label:
              'Opportunity Capacity',

            weight:
              0.10,

            returnFunction:
              'optional-upside-and-learning',

            effort:
              'high',

            assetCategories: [
              'selected-equity',
              'thematic-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'company-specific',
              'theme-specific'
            ],

            startsUnallocated:
              true,

            description:
              'A bounded capacity for selected opportunities that begins unallocated.'
          })
        ]
      }),


      intentional: createPortfolio({
        id:
          'TO-intentional',

        archetypeId:
          'TO',

        variantId:
          'intentional',

        name:
          'Intentional Opportunity Portfolio',

        summary:
          'A protected core supported by a stability reserve and separate tactical and security-specific opportunity sleeves.',

        sleeves: [
          createSleeve({
            id:
              'permanentCore',

            label:
              'Permanent Core',

            weight:
              0.60,

            returnFunction:
              'primary-long-term-progress',

            effort:
              'low',

            assetCategories: [
              'broad-us-equity',
              'broad-international-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Remains protected from ordinary tactical decisions.'
          }),

          createSleeve({
            id:
              'stabilityReserve',

            label:
              'Stability Reserve',

            weight:
              0.15,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'government-bonds',
              'cash-equivalent'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'short-term-rates'
            ],

            description:
              'Provides resilience and a source of optional capital.'
          }),

          createSleeve({
            id:
              'tacticalAllocation',

            label:
              'Tactical Allocation',

            weight:
              0.10,

            returnFunction:
              'conditional-return',

            effort:
              'high',

            assetCategories: [
              'sector-equity',
              'style-equity'
            ],

            reviewCadence:
              'condition-driven',

            marketTrendTags: [
              'market-regime',
              'sector-cycle',
              'valuation-spread'
            ],

            description:
              'Supports bounded allocation changes governed by predefined conditions.'
          }),

          createSleeve({
            id:
              'opportunitySelection',

            label:
              'Opportunity Selection',

            weight:
              0.10,

            returnFunction:
              'optional-upside',

            effort:
              'high',

            assetCategories: [
              'selected-equity',
              'thematic-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'company-specific',
              'theme-specific'
            ],

            startsUnallocated:
              true,

            description:
              'Supports selected ideas with written theses, limits, and review conditions.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.05,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Maintains readiness without forcing changes to the permanent core.'
          })
        ]
      }),


      engaged: createPortfolio({
        id:
          'TO-engaged',

        archetypeId:
          'TO',

        variantId:
          'engaged',

        name:
          'Engaged Opportunity Portfolio',

        summary:
          'A permanent core surrounded by separate tactical, thematic, security-selection, stability, and liquidity sleeves.',

        sleeves: [
          createSleeve({
            id:
              'permanentCore',

            label:
              'Permanent Core',

            weight:
              0.50,

            returnFunction:
              'primary-long-term-progress',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Protects the long-term portfolio from active decision creep.'
          }),

          createSleeve({
            id:
              'stabilityReserve',

            label:
              'Stability Reserve',

            weight:
              0.10,

            returnFunction:
              'risk-reduction',

            effort:
              'low',

            assetCategories: [
              'government-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides resilience and rebalancing capacity.'
          }),

          createSleeve({
            id:
              'tacticalAllocation',

            label:
              'Tactical Allocation',

            weight:
              0.15,

            returnFunction:
              'conditional-return',

            effort:
              'high',

            assetCategories: [
              'sector-equity',
              'style-equity',
              'tactical-fund'
            ],

            reviewCadence:
              'condition-driven',

            marketTrendTags: [
              'market-regime',
              'sector-cycle',
              'valuation-spread'
            ],

            description:
              'Supports condition-based changes within a predefined range.'
          }),

          createSleeve({
            id:
              'thematicOpportunities',

            label:
              'Thematic Opportunities',

            weight:
              0.10,

            returnFunction:
              'optional-upside',

            effort:
              'high',

            assetCategories: [
              'thematic-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'theme-specific',
              'regulatory-change'
            ],

            startsUnallocated:
              true,

            description:
              'Supports bounded thematic exposure governed by an explicit thesis.'
          }),

          createSleeve({
            id:
              'securitySelection',

            label:
              'Security Selection',

            weight:
              0.10,

            returnFunction:
              'optional-upside-and-learning',

            effort:
              'high',

            assetCategories: [
              'selected-equity'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'company-specific',
              'earnings',
              'competitive-change'
            ],

            startsUnallocated:
              true,

            description:
              'Allows a small collection of researched securities with explicit invalidation rules.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.05,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Maintains optionality and supports tactical implementation.'
          })
        ]
      })
    },


    /*
     * ================================================================
     * IP — Income Preservation Portfolio
     * ================================================================
     *
     * Invariant:
     * Liquidity, income reliability, and resilience take priority over
     * yield maximization.
     */

    IP: {
      essential: createPortfolio({
        id:
          'IP-essential',

        archetypeId:
          'IP',

        variantId:
          'essential',

        name:
          'Essential Income Preservation Portfolio',

        summary:
          'A dependable system combining accessible reserves, high-quality income, measured growth, and inflation protection.',

        sleeves: [
          createSleeve({
            id:
              'highQualityIncome',

            label:
              'High-Quality Income',

            weight:
              0.45,

            returnFunction:
              'income-and-preservation',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'credit-conditions'
            ],

            description:
              'Supports dependable income while prioritizing quality and resilience.'
          }),

          createSleeve({
            id:
              'liquidity',

            label:
              'Liquidity',

            weight:
              0.25,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Provides accessible capital for near-term needs.'
          }),

          createSleeve({
            id:
              'measuredGrowth',

            label:
              'Measured Growth',

            weight:
              0.25,

            returnFunction:
              'long-term-growth',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Supports long-term purchasing power without dominating the portfolio.'
          }),

          createSleeve({
            id:
              'inflationProtection',

            label:
              'Inflation Protection',

            weight:
              0.05,

            returnFunction:
              'inflation-protection',

            effort:
              'low',

            assetCategories: [
              'inflation-protected-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'inflation'
            ],

            description:
              'Provides limited protection against the loss of purchasing power.'
          })
        ]
      }),


      intentional: createPortfolio({
        id:
          'IP-intentional',

        archetypeId:
          'IP',

        variantId:
          'intentional',

        name:
          'Intentional Income Preservation Portfolio',

        summary:
          'A role-based income system separating immediate liquidity, short-duration income, core bonds, income equities, measured growth, and inflation protection.',

        sleeves: [
          createSleeve({
            id:
              'immediateLiquidity',

            label:
              'Immediate Liquidity',

            weight:
              0.15,

            returnFunction:
              'capital-access',

            effort:
              'very-low',

            assetCategories: [
              'cash-equivalent'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Supports planned near-term spending and emergency access.'
          }),

          createSleeve({
            id:
              'shortDurationIncome',

            label:
              'Short-Duration Income',

            weight:
              0.20,

            returnFunction:
              'income-generation',

            effort:
              'low',

            assetCategories: [
              'short-duration-bonds'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'short-term-rates',
              'credit-conditions'
            ],

            description:
              'Provides income while limiting sensitivity to longer-term rate changes.'
          }),

          createSleeve({
            id:
              'coreFixedIncome',

            label:
              'Core Fixed Income',

            weight:
              0.25,

            returnFunction:
              'income-and-preservation',

            effort:
              'low',

            assetCategories: [
              'high-quality-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'credit-conditions',
              'inflation'
            ],

            description:
              'Provides dependable income and portfolio resilience.'
          }),

          createSleeve({
            id:
              'incomeEquity',

            label:
              'Income Equity',

            weight:
              0.15,

            returnFunction:
              'income-generation',

            effort:
              'moderate',

            assetCategories: [
              'income-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'dividend-sustainability',
              'company-earnings'
            ],

            description:
              'Adds equity income with measured growth potential.'
          }),

          createSleeve({
            id:
              'measuredGrowth',

            label:
              'Measured Growth',

            weight:
              0.15,

            returnFunction:
              'long-term-growth',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'market-concentration'
            ],

            description:
              'Supports long-term purchasing power while remaining bounded.'
          }),

          createSleeve({
            id:
              'inflationProtection',

            label:
              'Inflation Protection',

            weight:
              0.10,

            returnFunction:
              'inflation-protection',

            effort:
              'moderate',

            assetCategories: [
              'inflation-protected-bonds',
              'real-assets'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'inflation',
              'real-asset-valuations'
            ],

            description:
              'Helps address the risk that income loses purchasing power.'
          })
        ]
      }),


      engaged: createPortfolio({
        id:
          'IP-engaged',

        archetypeId:
          'IP',

        variantId:
          'engaged',

        name:
          'Engaged Income Preservation Portfolio',

        summary:
          'A granular income system separating liquidity, government bonds, credit, inflation protection, dividend equity, global growth, and selected income opportunities.',

        sleeves: [
          createSleeve({
            id:
              'liquidityLadder',

            label:
              'Liquidity Ladder',

            weight:
              0.15,

            returnFunction:
              'planned-access',

            effort:
              'low',

            assetCategories: [
              'cash-equivalent',
              'short-government-securities'
            ],

            reviewCadence:
              'as-needs-change',

            marketTrendTags: [
              'short-term-rates'
            ],

            description:
              'Organizes accessible money around anticipated spending needs.'
          }),

          createSleeve({
            id:
              'governmentBonds',

            label:
              'Government Bonds',

            weight:
              0.20,

            returnFunction:
              'capital-preservation',

            effort:
              'low',

            assetCategories: [
              'government-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'interest-rates',
              'inflation'
            ],

            description:
              'Provides high-quality resilience and dependable portfolio structure.'
          }),

          createSleeve({
            id:
              'investmentGradeCredit',

            label:
              'Investment-Grade Credit',

            weight:
              0.15,

            returnFunction:
              'income-generation',

            effort:
              'moderate',

            assetCategories: [
              'investment-grade-credit'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'credit-conditions',
              'interest-rates'
            ],

            description:
              'Adds income while retaining explicit credit-quality boundaries.'
          }),

          createSleeve({
            id:
              'inflationProtection',

            label:
              'Inflation Protection',

            weight:
              0.10,

            returnFunction:
              'inflation-protection',

            effort:
              'low',

            assetCategories: [
              'inflation-protected-bonds'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'inflation'
            ],

            description:
              'Supports purchasing-power resilience.'
          }),

          createSleeve({
            id:
              'dividendEquity',

            label:
              'Dividend Equity',

            weight:
              0.15,

            returnFunction:
              'income-generation',

            effort:
              'moderate',

            assetCategories: [
              'income-equity'
            ],

            reviewCadence:
              'quarterly',

            marketTrendTags: [
              'dividend-sustainability',
              'company-earnings'
            ],

            description:
              'Provides equity income with measured long-term growth potential.'
          }),

          createSleeve({
            id:
              'globalGrowth',

            label:
              'Global Growth',

            weight:
              0.15,

            returnFunction:
              'long-term-growth',

            effort:
              'low',

            assetCategories: [
              'global-equity'
            ],

            reviewCadence:
              'annual',

            marketTrendTags: [
              'broad-market',
              'international-growth'
            ],

            description:
              'Supports long-term purchasing power without overtaking income and preservation priorities.'
          }),

          createSleeve({
            id:
              'selectedIncomeOpportunities',

            label:
              'Selected Income Opportunities',

            weight:
              0.10,

            returnFunction:
              'optional-upside',

            effort:
              'high',

            assetCategories: [
              'income-opportunity',
              'real-assets'
            ],

            reviewCadence:
              'thesis-driven',

            marketTrendTags: [
              'credit-conditions',
              'distribution-sustainability',
              'real-asset-valuations'
            ],

            startsUnallocated:
              true,

            description:
              'A bounded area for selected income ideas that meet explicit quality and sustainability criteria.'
          })
        ]
      })
    }
  });


export function getConstituentPortfolio(
  archetypeId,
  variantId
) {
  const archetypeVariants =
    CONSTITUENT_PORTFOLIOS[
      archetypeId
    ];

  if (!archetypeVariants) {
    throw new Error(
      `No constituent portfolios are defined for archetype "${archetypeId}".`
    );
  }

  const portfolio =
    archetypeVariants[
      variantId
    ];

  if (!portfolio) {
    throw new Error(
      `No "${variantId}" constituent portfolio is defined for archetype "${archetypeId}".`
    );
  }

  if (
    typeof structuredClone ===
    'function'
  ) {
    return structuredClone(
      portfolio
    );
  }

  return JSON.parse(
    JSON.stringify(
      portfolio
    )
  );
}


export function hasConstituentPortfolio(
  archetypeId,
  variantId
) {
  return Boolean(
    CONSTITUENT_PORTFOLIOS[
      archetypeId
    ]?.[
      variantId
    ]
  );
}


export function getAvailablePortfolioVariants(
  archetypeId
) {
  const archetypeVariants =
    CONSTITUENT_PORTFOLIOS[
      archetypeId
    ];

  if (!archetypeVariants) {
    return [];
  }

  return Object.keys(
    archetypeVariants
  );
}


export function validateConstituentPortfolio(
  portfolio
) {
  if (
    !portfolio ||
    !Array.isArray(
      portfolio.sleeves
    ) ||
    portfolio.sleeves.length ===
      0
  ) {
    return false;
  }

  const validWeights =
    portfolio.sleeves.every(
      (sleeve) =>
        Number.isFinite(
          sleeve.weight
        ) &&
        sleeve.weight >= 0 &&
        sleeve.weight <= 1
    );

  if (!validWeights) {
    return false;
  }

  const total =
    portfolio.sleeves.reduce(
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

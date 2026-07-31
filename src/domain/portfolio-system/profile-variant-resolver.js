const sleeve = ({
  id,
  label,
  weight,
  returnFunction,
  effort,
  assetCategories,
  reviewCadence,
  marketTrendTags = [],
  startsUnallocated = false,
}) => ({
  id,
  label,
  weight,
  returnFunction,
  effort,
  assetCategories,
  reviewCadence,
  marketTrendTags,
  startsUnallocated,
});

export const CONSTITUENT_PORTFOLIOS = Object.freeze({
  ES: {
    essential: {
      sleeves: [
        sleeve({
          id: "broadGrowthCore",
          label: "Broad Growth Core",
          weight: 0.70,
          returnFunction: "primary-long-term-progress",
          effort: "low",
          assetCategories: ["global-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["broad-market", "global-growth"],
        }),

        sleeve({
          id: "stability",
          label: "Stability",
          weight: 0.20,
          returnFunction: "risk-reduction",
          effort: "low",
          assetCategories: ["high-quality-bonds"],
          reviewCadence: "annual",
          marketTrendTags: ["interest-rates", "inflation"],
        }),

        sleeve({
          id: "liquidity",
          label: "Liquidity",
          weight: 0.10,
          returnFunction: "capital-access",
          effort: "very-low",
          assetCategories: ["cash-equivalent"],
          reviewCadence: "as-needs-change",
          marketTrendTags: ["short-term-rates"],
        }),
      ],
    },

    intentional: {
      sleeves: [
        sleeve({
          id: "usCore",
          label: "US Core",
          weight: 0.45,
          returnFunction: "primary-growth",
          effort: "low",
          assetCategories: ["broad-us-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["us-market", "market-concentration"],
        }),

        sleeve({
          id: "internationalCore",
          label: "International Core",
          weight: 0.25,
          returnFunction: "geographic-diversification",
          effort: "low",
          assetCategories: ["broad-international-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["international-growth", "currency"],
        }),

        sleeve({
          id: "stability",
          label: "Stability",
          weight: 0.20,
          returnFunction: "risk-reduction",
          effort: "low",
          assetCategories: ["high-quality-bonds"],
          reviewCadence: "annual",
          marketTrendTags: ["interest-rates", "inflation"],
        }),

        sleeve({
          id: "liquidity",
          label: "Liquidity",
          weight: 0.10,
          returnFunction: "capital-access",
          effort: "very-low",
          assetCategories: ["cash-equivalent"],
          reviewCadence: "as-needs-change",
          marketTrendTags: ["short-term-rates"],
        }),
      ],
    },

    engaged: {
      sleeves: [
        sleeve({
          id: "usCore",
          label: "US Core",
          weight: 0.40,
          returnFunction: "primary-growth",
          effort: "low",
          assetCategories: ["broad-us-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["us-market", "market-concentration"],
        }),

        sleeve({
          id: "internationalCore",
          label: "International Core",
          weight: 0.25,
          returnFunction: "geographic-diversification",
          effort: "low",
          assetCategories: [
            "developed-international-equity",
            "emerging-market-equity",
          ],
          reviewCadence: "annual",
          marketTrendTags: ["international-growth", "currency"],
        }),

        sleeve({
          id: "stability",
          label: "Stability",
          weight: 0.20,
          returnFunction: "risk-reduction",
          effort: "low",
          assetCategories: ["high-quality-bonds"],
          reviewCadence: "annual",
          marketTrendTags: ["interest-rates", "inflation"],
        }),

        sleeve({
          id: "liquidity",
          label: "Liquidity",
          weight: 0.10,
          returnFunction: "capital-access",
          effort: "very-low",
          assetCategories: ["cash-equivalent"],
          reviewCadence: "as-needs-change",
          marketTrendTags: ["short-term-rates"],
        }),

        sleeve({
          id: "personalPreference",
          label: "Personal Preference",
          weight: 0.05,
          returnFunction: "limited-customization",
          effort: "moderate",
          assetCategories: ["broad-preference-fund"],
          reviewCadence: "quarterly",
          marketTrendTags: ["theme-specific"],
        }),
      ],
    },
  },

  FT: {
    essential: {
      sleeves: [
        sleeve({
          id: "durableCore",
          label: "Durable Core",
          weight: 0.70,
          returnFunction: "primary-long-term-progress",
          effort: "low",
          assetCategories: ["global-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["broad-market", "market-concentration"],
        }),

        sleeve({
          id: "stability",
          label: "Stability",
          weight: 0.20,
          returnFunction: "risk-reduction",
          effort: "low",
          assetCategories: ["high-quality-bonds"],
          reviewCadence: "annual",
          marketTrendTags: ["interest-rates", "inflation"],
        }),

        sleeve({
          id: "targetedImprovement",
          label: "Targeted Improvement",
          weight: 0.10,
          returnFunction: "supporting-progress",
          effort: "moderate",
          assetCategories: ["diversified-factor-equity"],
          reviewCadence: "quarterly",
          marketTrendTags: [
            "factor-evidence",
            "valuation-spread",
            "portfolio-overlap",
          ],
        }),
      ],
    },

    intentional: {
      sleeves: [
        sleeve({
          id: "durableCore",
          label: "Durable Core",
          weight: 0.40,
          returnFunction: "primary-long-term-progress",
          effort: "low",
          assetCategories: ["broad-us-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["broad-market", "market-concentration"],
        }),

        sleeve({
          id: "globalDiversification",
          label: "Global Diversification",
          weight: 0.20,
          returnFunction: "geographic-diversification",
          effort: "low",
          assetCategories: ["broad-international-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["international-growth", "currency"],
        }),

        sleeve({
          id: "stability",
          label: "Stability",
          weight: 0.15,
          returnFunction: "risk-reduction",
          effort: "low",
          assetCategories: ["high-quality-bonds"],
          reviewCadence: "annual",
          marketTrendTags: ["interest-rates", "inflation"],
        }),

        sleeve({
          id: "qualityImprovement",
          label: "Quality Improvement",
          weight: 0.10,
          returnFunction: "supporting-progress",
          effort: "moderate",
          assetCategories: ["quality-factor-equity"],
          reviewCadence: "quarterly",
          marketTrendTags: ["factor-evidence", "quality-spread"],
        }),

        sleeve({
          id: "smallValueImprovement",
          label: "Small-Value Improvement",
          weight: 0.10,
          returnFunction: "supporting-progress",
          effort: "moderate",
          assetCategories: ["small-value-equity"],
          reviewCadence: "quarterly",
          marketTrendTags: ["valuation-spread", "small-cap-cycle"],
        }),

        sleeve({
          id: "liquidity",
          label: "Liquidity",
          weight: 0.05,
          returnFunction: "capital-access",
          effort: "very-low",
          assetCategories: ["cash-equivalent"],
          reviewCadence: "as-needs-change",
          marketTrendTags: ["short-term-rates"],
        }),
      ],
    },

    engaged: {
      sleeves: [
        sleeve({
          id: "durableCore",
          label: "Durable Core",
          weight: 0.45,
          returnFunction: "primary-long-term-progress",
          effort: "low",
          assetCategories: ["broad-us-equity", "global-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["broad-market", "market-concentration"],
        }),

        sleeve({
          id: "globalDiversification",
          label: "Global Diversification",
          weight: 0.15,
          returnFunction: "geographic-diversification",
          effort: "low",
          assetCategories: ["broad-international-equity"],
          reviewCadence: "annual",
          marketTrendTags: ["international-growth", "currency"],
        }),

        sleeve({
          id: "stability",
          label: "Stability",
          weight: 0.10,
          returnFunction: "risk-reduction",
          effort: "low",
          assetCategories: ["high-quality-bonds"],
          reviewCadence: "annual",
          marketTrendTags: ["interest-rates", "inflation"],
        }),

        sleeve({
          id: "factorImprovements",
          label: "Factor Improvements",
          weight: 0.15,
          returnFunction: "supporting-progress",
          effort: "moderate",
          assetCategories: [
            "quality-factor-equity",
            "value-factor-equity",
            "small-value-equity",
          ],
          reviewCadence: "quarterly",
          marketTrendTags: ["factor-evidence", "valuation-spread"],
        }),

        sleeve({
          id: "strategicDiversifier",
          label: "Strategic Diversifier",
          weight: 0.10,
          returnFunction: "risk-source-diversification",
          effort: "moderate",
          assetCategories: ["real-assets"],
          reviewCadence: "quarterly",
          marketTrendTags: ["inflation", "real-asset-valuations"],
        }),

        sleeve({
          id: "researchCapacity",
          label: "Research Capacity",
          weight: 0.05,
          returnFunction: "optional-upside-and-learning",
          effort: "high",
          assetCategories: ["selected-equity", "thematic-equity"],
          reviewCadence: "thesis-driven",
          marketTrendTags: ["company-specific", "theme-specific"],
          startsUnallocated: true,
        }),
      ],
    },
  },

  /*
   * Add GD, BFO, GA, TO and IP using the same structure.
   *
   * Keep this first pull request smaller:
   * implement ES and FT end-to-end, verify the engine and UI,
   * then add the remaining five archetypes.
   */
});

export function getConstituentPortfolio(archetypeId, variantId) {
  const archetypeVariants = CONSTITUENT_PORTFOLIOS[archetypeId];

  if (!archetypeVariants) {
    throw new Error(
      `No constituent portfolios defined for archetype: ${archetypeId}`,
    );
  }

  const portfolio = archetypeVariants[variantId];

  if (!portfolio) {
    throw new Error(
      `No ${variantId} portfolio defined for archetype: ${archetypeId}`,
    );
  }

  return structuredClone(portfolio);
}

export const MARKET_TREND_CATALOG = Object.freeze({
  "broad-market": {
    id: "broad-market",
    label: "Broad market conditions",
    defaultRelevance: "informational",
    reviewQuestion:
      "Has anything changed the long-term role this sleeve performs?",
  },

  "market-concentration": {
    id: "market-concentration",
    label: "Market concentration",
    defaultRelevance: "review",
    reviewQuestion:
      "Has concentration materially changed the diversification provided by this sleeve?",
  },

  "international-growth": {
    id: "international-growth",
    label: "International growth conditions",
    defaultRelevance: "informational",
    reviewQuestion:
      "Does the geographic exposure still provide the intended diversification?",
  },

  currency: {
    id: "currency",
    label: "Currency movement",
    defaultRelevance: "informational",
    reviewQuestion:
      "Is currency movement changing the long-term role, or only short-term performance?",
  },

  "interest-rates": {
    id: "interest-rates",
    label: "Interest-rate conditions",
    defaultRelevance: "review",
    reviewQuestion:
      "Does the sleeve's duration still fit the investor's time horizon and stability needs?",
  },

  inflation: {
    id: "inflation",
    label: "Inflation trend",
    defaultRelevance: "review",
    reviewQuestion:
      "Does the portfolio still have enough purchasing-power resilience?",
  },

  "short-term-rates": {
    id: "short-term-rates",
    label: "Short-term interest rates",
    defaultRelevance: "informational",
    reviewQuestion:
      "Does the reserve still meet the investor's access and liquidity needs?",
  },

  "factor-evidence": {
    id: "factor-evidence",
    label: "Factor evidence",
    defaultRelevance: "review",
    reviewQuestion:
      "Does the original evidence for this improvement remain credible over the intended evaluation period?",
  },

  "valuation-spread": {
    id: "valuation-spread",
    label: "Valuation spread",
    defaultRelevance: "informational",
    reviewQuestion:
      "Has the relative valuation changed enough to revisit the sleeve's expected role?",
  },

  "portfolio-overlap": {
    id: "portfolio-overlap",
    label: "Portfolio overlap",
    defaultRelevance: "review",
    reviewQuestion:
      "Is this sleeve still providing exposure that the durable core does not already provide?",
  },

  "company-specific": {
    id: "company-specific",
    label: "Company-specific developments",
    defaultRelevance: "review",
    reviewQuestion:
      "Has the evidence supporting the original company thesis changed?",
  },

  "theme-specific": {
    id: "theme-specific",
    label: "Theme-specific developments",
    defaultRelevance: "review",
    reviewQuestion:
      "Is the theme progressing according to the original investment thesis?",
  },
});

export function resolveMarketTrends(trendIds = []) {
  return trendIds.map((trendId) => {
    const trend = MARKET_TREND_CATALOG[trendId];

    return trend
      ? structuredClone(trend)
      : {
          id: trendId,
          label: trendId,
          defaultRelevance: "informational",
          reviewQuestion:
            "Does this development change the sleeve's intended role?",
        };
  });
}

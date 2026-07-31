export const ASSET_CATALOG = Object.freeze({
  "global-equity": {
    id: "global-equity",
    label: "Broad global equity",
    assetType: "ETF",
    effort: "low",

    defaultOptions: [
      {
        id: "global-equity-default",
        displayName: "Broad global equity ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "broad-us-equity": {
    id: "broad-us-equity",
    label: "Broad US equity",
    assetType: "ETF",
    effort: "low",

    defaultOptions: [
      {
        id: "broad-us-equity-default",
        displayName: "Broad US total-market ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "broad-international-equity": {
    id: "broad-international-equity",
    label: "Broad international equity",
    assetType: "ETF",
    effort: "low",

    defaultOptions: [
      {
        id: "broad-international-equity-default",
        displayName: "Broad international equity ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "developed-international-equity": {
    id: "developed-international-equity",
    label: "Developed international equity",
    assetType: "ETF",
    effort: "low",

    defaultOptions: [
      {
        id: "developed-international-default",
        displayName: "Developed-market equity ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "emerging-market-equity": {
    id: "emerging-market-equity",
    label: "Emerging-market equity",
    assetType: "ETF",
    effort: "moderate",

    defaultOptions: [
      {
        id: "emerging-market-default",
        displayName: "Broad emerging-market ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "high-quality-bonds": {
    id: "high-quality-bonds",
    label: "High-quality fixed income",
    assetType: "Bond ETF",
    effort: "low",

    defaultOptions: [
      {
        id: "high-quality-bond-default",
        displayName: "Broad high-quality bond ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "cash-equivalent": {
    id: "cash-equivalent",
    label: "Cash and short-term reserves",
    assetType: "Cash equivalent",
    effort: "very-low",

    defaultOptions: [
      {
        id: "cash-equivalent-default",
        displayName:
          "Cash, money-market fund, or short-term government exposure",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "diversified-factor-equity": {
    id: "diversified-factor-equity",
    label: "Diversified factor exposure",
    assetType: "ETF",
    effort: "moderate",

    defaultOptions: [
      {
        id: "factor-equity-default",
        displayName: "Diversified factor equity ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "quality-factor-equity": {
    id: "quality-factor-equity",
    label: "Quality factor",
    assetType: "ETF",
    effort: "moderate",

    defaultOptions: [
      {
        id: "quality-factor-default",
        displayName: "Quality-factor equity ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "value-factor-equity": {
    id: "value-factor-equity",
    label: "Value factor",
    assetType: "ETF",
    effort: "moderate",

    defaultOptions: [
      {
        id: "value-factor-default",
        displayName: "Value-factor equity ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "small-value-equity": {
    id: "small-value-equity",
    label: "Small-cap value",
    assetType: "ETF",
    effort: "moderate",

    defaultOptions: [
      {
        id: "small-value-default",
        displayName: "Small-cap value ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "real-assets": {
    id: "real-assets",
    label: "Real assets",
    assetType: "ETF or fund",
    effort: "moderate",

    defaultOptions: [
      {
        id: "real-assets-default",
        displayName:
          "Broad real-estate, infrastructure, or inflation-sensitive fund",
        ticker: null,
        status: "default-category",
      },
    ],
  },

  "selected-equity": {
    id: "selected-equity",
    label: "Selected company",
    assetType: "Stock",
    effort: "high",
    defaultOptions: [],
  },

  "thematic-equity": {
    id: "thematic-equity",
    label: "Thematic exposure",
    assetType: "ETF",
    effort: "high",
    defaultOptions: [],
  },

  "broad-preference-fund": {
    id: "broad-preference-fund",
    label: "Preference-aligned diversified exposure",
    assetType: "ETF",
    effort: "moderate",

    defaultOptions: [
      {
        id: "preference-fund-default",
        displayName:
          "Broad values, sustainability, or preference-aligned ETF",
        ticker: null,
        status: "default-category",
      },
    ],
  },
});

export function resolveAssetCategories(categoryIds = []) {
  return categoryIds.map((categoryId) => {
    const category = ASSET_CATALOG[categoryId];

    if (!category) {
      return {
        id: categoryId,
        label: categoryId,
        assetType: "Unknown",
        effort: "unknown",
        defaultOptions: [],
      };
    }

    return structuredClone(category);
  });
}

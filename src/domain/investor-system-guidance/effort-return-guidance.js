/*
 * Investor System Guidance
 * Effort vs Return Guidance
 *
 * PURPOSE
 * -------
 * Explain how much investor attention the resolved portfolio system
 * requires, where that effort belongs, and why additional activity
 * may be unnecessary or redundant for some sleeves.
 *
 * IMPORTANT
 * ---------
 * This file does NOT:
 *
 * - predict returns
 * - promise outperformance
 * - claim maximum return
 * - alter sleeve weights
 * - alter review cadence
 * - alter Style resolution
 * - alter portfolio construction
 *
 * It explains the relationship between:
 *
 *   portfolio role
 *   return contribution
 *   effort requirement
 *   monitoring cadence
 *
 * in a user-led investing system.
 */


export const STYLE_EFFORT_GUIDANCE = Object.freeze({

  guided_autopilot: Object.freeze({
    styleId: 'guided_autopilot',

    investorQuestion:
      'How can I keep investing simple without ignoring something important?',

    primaryNeed:
      'Keep routine portfolio management light and make it obvious where additional attention is actually useful.',

    effortPrinciple:
      'Most capital should sit in roles where frequent intervention is not part of the job.',

    userFacingSummary:
      'Your system should keep most investing decisions infrequent and concentrate attention only where new information can materially change a portfolio decision.',

    excessiveEffortWarning:
      'Checking low-effort sleeves more often does not automatically improve the decision. Extra monitoring can become redundant when the sleeve role and assumptions have not changed.'
  }),


  steady_steward: Object.freeze({
    styleId: 'steady_steward',

    investorQuestion:
      'How often should I review my portfolio without constantly reacting to it?',

    primaryNeed:
      'Use a regular review rhythm while keeping routine changes limited.',

    effortPrinciple:
      'Attention should follow the review cadence of each sleeve rather than daily market movement.',

    userFacingSummary:
      'Your system should support scheduled review, with more attention only when a sleeve reaches a meaningful review condition.',

    excessiveEffortWarning:
      'Frequent checking can create more decisions without improving the portfolio job when nothing material has changed.'
  }),


  systematic_improver: Object.freeze({
    styleId: 'systematic_improver',

    investorQuestion:
      'Where is additional research worth the effort?',

    primaryNeed:
      'Spend more attention only on portfolio roles where comparison or improvement is part of the mandate.',

    effortPrinciple:
      'Research effort should be concentrated in sleeves where a defined portfolio property can actually be improved.',

    userFacingSummary:
      'Your system should separate low-maintenance portfolio roles from the smaller set of decisions where comparison, research, and improvement can add value to the process.',

    excessiveEffortWarning:
      'More analysis becomes unnecessary when it does not improve a defined portfolio job or merely duplicates an exposure already present.'
  }),


  bounded_explorer: Object.freeze({
    styleId: 'bounded_explorer',

    investorQuestion:
      'How can I explore new ideas without turning my whole portfolio into a research project?',

    primaryNeed:
      'Keep the strategic portfolio low-maintenance while giving selected ideas a bounded place for additional research.',

    effortPrinciple:
      'Higher-effort activity should live in explicitly limited sleeves rather than spread across the whole portfolio.',

    userFacingSummary:
      'Your system should protect a low-effort foundation while reserving a smaller part of the portfolio for ideas that genuinely deserve more research.',

    excessiveEffortWarning:
      'Exploration becomes inefficient when every sleeve is treated as an active research problem.'
  }),


  active_navigator: Object.freeze({
    styleId: 'active_navigator',

    investorQuestion:
      'Which parts of my portfolio actually deserve frequent attention?',

    primaryNeed:
      'Direct higher-frequency attention toward the sleeves whose mandates genuinely depend on changing information.',

    effortPrinciple:
      'Active effort should be targeted rather than applied uniformly across the portfolio.',

    userFacingSummary:
      'Your system should show you which sleeves are designed for active monitoring and which should remain anchored to longer-term rules.',

    excessiveEffortWarning:
      'Activity is redundant when it is applied to portfolio roles whose decision horizon is longer than the information being monitored.'
  })
});


const EFFORT_LEVEL_GUIDANCE = Object.freeze({

  'very-low': Object.freeze({
    effortId: 'very-low',

    label:
      'Very low effort',

    meaning:
      'This sleeve should require little routine attention.',

    usefulAttention:
      'Review when the investor need, sleeve role, or access requirement changes.',

    redundantAttention:
      'Frequent market checking is usually unnecessary because ordinary market movement does not change the sleeve job.'
  }),


  low: Object.freeze({
    effortId: 'low',

    label:
      'Low effort',

    meaning:
      'This sleeve is designed to operate primarily through broad portfolio rules rather than frequent decisions.',

    usefulAttention:
      'Review at the defined cadence or when a material structural condition changes.',

    redundantAttention:
      'Daily or reactive monitoring usually adds decision activity without changing the long-term portfolio role.'
  }),


  moderate: Object.freeze({
    effortId: 'moderate',

    label:
      'Moderate effort',

    meaning:
      'This sleeve has a more specific mandate that benefits from periodic research or comparison.',

    usefulAttention:
      'Review the thesis, portfolio contribution, and relevant signals on a defined schedule.',

    redundantAttention:
      'Research becomes excessive when new information does not affect the sleeve mandate or materially improve the decision.'
  }),


  high: Object.freeze({
    effortId: 'high',

    label:
      'Higher effort',

    meaning:
      'This sleeve requires more active research because its role depends on changing conditions, selected opportunities, or specific theses.',

    usefulAttention:
      'Monitor the signals and assumptions directly connected to the sleeve mandate.',

    redundantAttention:
      'High effort is still bounded. Research outside the sleeve thesis or beyond its allocation role can add complexity without improving the system.'
  })
});


function percentage(value) {
  if (typeof value !== 'number') {
    return 0;
  }

  return Math.round(value * 100);
}


function normalizeEffortKey(value) {
  if (value === 'veryLow') {
    return 'very-low';
  }

  return value;
}


function buildEffortDistribution(structure = {}) {
  const effortMix =
    structure.effortMix ?? {};

  const entries = [];

  for (const [rawKey, weight] of Object.entries(effortMix)) {
    if (
      typeof weight !== 'number' ||
      weight <= 0
    ) {
      continue;
    }

    const effortId =
      normalizeEffortKey(rawKey);

    const guidance =
      EFFORT_LEVEL_GUIDANCE[
        effortId
      ] ?? null;

    entries.push({
      effortId,

      label:
        guidance?.label ??
        effortId,

      weight,

      percent:
        percentage(weight),

      meaning:
        guidance?.meaning ??
        null,

      usefulAttention:
        guidance?.usefulAttention ??
        null,

      redundantAttention:
        guidance?.redundantAttention ??
        null
    });
  }

  return entries;
}


function buildSleeveEffortGuidance(
  sleeves = []
) {
  return sleeves.map(
    (sleeve) => {
      const effortId =
        sleeve?.operatingProfile?.effort ??
        sleeve?.effort ??
        null;

      const effort =
        EFFORT_LEVEL_GUIDANCE[
          effortId
        ] ?? null;

      return {
        sleeveId:
          sleeve.id,

        sleeveLabel:
          sleeve.label,

        weight:
          sleeve.weight,

        weightPercent:
          typeof sleeve.weightPercent === 'number'
            ? sleeve.weightPercent
            : percentage(sleeve.weight),

        systemRole:
          sleeve?.role?.id ??
          sleeve.systemRole ??
          null,

        returnFunction:
          sleeve?.operatingProfile?.returnFunction ??
          sleeve.returnFunction ??
          null,

        effortId,

        effortLabel:
          effort?.label ??
          sleeve?.operatingProfile?.effortLabel ??
          effortId,

        reviewCadence:
          sleeve?.operatingProfile?.reviewCadence ??
          sleeve.reviewCadence ??
          null,

        reviewCadenceLabel:
          sleeve?.operatingProfile?.reviewCadenceLabel ??
          null,

        whyThisEffort:
          effort?.meaning ??
          null,

        usefulAttention:
          effort?.usefulAttention ??
          null,

        redundantAttention:
          effort?.redundantAttention ??
          null
      };
    }
  );
}


/*
 * Public API
 *
 * Takes the already-resolved Style and the portfolio structure.
 *
 * It does not calculate Style.
 */
export function getEffortReturnGuidance({
  styleId,
  structure = {},
  sleeves = []
} = {}) {
  if (!styleId) {
    return null;
  }

  const styleGuidance =
    STYLE_EFFORT_GUIDANCE[
      styleId
    ];

  if (!styleGuidance) {
    return null;
  }

  const distribution =
    buildEffortDistribution(
      structure
    );

  const sleeveGuidance =
    buildSleeveEffortGuidance(
      sleeves
    );

  const lowEffortPercent =
    typeof structure.lowEffortPercent ===
    'number'
      ? structure.lowEffortPercent
      : percentage(
          structure.lowEffortWeight
        );

  const higherEffortPercent =
    sleeveGuidance.reduce(
      (total, sleeve) => {
        if (
          sleeve.effortId === 'moderate' ||
          sleeve.effortId === 'high'
        ) {
          return (
            total +
            (
              sleeve.weightPercent ??
              0
            )
          );
        }

        return total;
      },
      0
    );

  return {
    styleId,

    investorQuestion:
      styleGuidance.investorQuestion,

    primaryNeed:
      styleGuidance.primaryNeed,

    effortPrinciple:
      styleGuidance.effortPrinciple,

    userFacingSummary:
      styleGuidance.userFacingSummary,

    excessiveEffortWarning:
      styleGuidance.excessiveEffortWarning,

    portfolioEffort: {
      lowEffortPercent,

      higherEffortPercent,

      distribution,

      summary:
        lowEffortPercent >= 80
          ? 'Most of this portfolio is intentionally designed to require little routine attention.'
          : higherEffortPercent >= 30
            ? 'A meaningful part of this portfolio is designed for periodic or higher-effort decision-making.'
            : 'Most portfolio roles remain low maintenance, while a smaller set of sleeves receives additional research and monitoring.'
    },

    sleeves:
      sleeveGuidance,

    returnEffortPrinciple: {
      title:
        'Use effort where it can change a meaningful portfolio decision.',

      explanation:
        'The goal is not to maximize activity. Each sleeve has a return role and an appropriate level of attention. Additional research is useful when it can change the quality of a decision for that role; otherwise it can become redundant effort or unnecessary complexity.',

      noPerformancePromise:
        'The system does not assume that more monitoring produces higher returns or that any effort level guarantees a particular investment outcome.'
    },

    systemBoundary: {
      useful:
        'Effort is useful when it helps evaluate an asset, signal, or portfolio change that is relevant to the sleeve mandate.',

      excessive:
        'Effort is excessive when the information being monitored cannot materially change the sleeve role, thesis, or decision.',

      redundant:
        'Effort is redundant when additional research only repeats exposure or analysis already represented elsewhere in the portfolio system.'
    }
  };
}


export function getEffortLevelGuidance(
  effortId
) {
  if (!effortId) {
    return null;
  }

  return (
    EFFORT_LEVEL_GUIDANCE[
      effortId
    ] ?? null
  );
}

export const PROFILE_VARIANTS = Object.freeze({
  ESSENTIAL: "essential",
  INTENTIONAL: "intentional",
  ENGAGED: "engaged",
});

const STAGE_LEVEL = Object.freeze({
  foundation_builder: 1,
  portfolio_organizer: 2,
  system_builder: 3,
  intentional_optimizer: 4,
  adaptive_investor: 5,
});

const STYLE_LEVEL = Object.freeze({
  guided_autopilot: 1,
  steady_steward: 2,
  systematic_improver: 3,
  bounded_explorer: 4,
  active_navigator: 5,
});

const HIGH_ENGAGEMENT_SIGNALS = new Set([
  "active_review",
  "research_interest",
  "strategy_comparison",
  "portfolio_construction_curiosity",
  "opportunity_interest",
  "tactical_interest",
  "security_selection_interest",
]);

function countSignals(signals = [], acceptedSignals) {
  if (!Array.isArray(signals)) {
    return 0;
  }

  return signals.reduce(
    (count, signal) => count + (acceptedSignals.has(signal) ? 1 : 0),
    0,
  );
}

/**
 * Resolves structural portfolio complexity.
 *
 * This is not a risk-tolerance score.
 * It determines how many distinct portfolio concepts the user can
 * reasonably operate and how much decision involvement is appropriate.
 */
export function resolveProfileVariant({
  stageId,
  styleId,
  signals = [],
}) {
  const stageLevel = STAGE_LEVEL[stageId] ?? 2;
  const styleLevel = STYLE_LEVEL[styleId] ?? 2;
  const engagementSignals = countSignals(signals, HIGH_ENGAGEMENT_SIGNALS);

  if (
    stageLevel >= 4 &&
    styleLevel >= 4 &&
    engagementSignals >= 1
  ) {
    return PROFILE_VARIANTS.ENGAGED;
  }

  if (
    stageLevel >= 3 ||
    styleLevel >= 3 ||
    engagementSignals >= 2
  ) {
    return PROFILE_VARIANTS.INTENTIONAL;
  }

  return PROFILE_VARIANTS.ESSENTIAL;
}

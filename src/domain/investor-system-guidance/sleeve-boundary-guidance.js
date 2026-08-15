/*
 * Investor System Guidance
 * Sleeve Boundary Guidance
 *
 * PURPOSE
 * -------
 * Explain the operating boundaries of a portfolio sleeve.
 *
 * A sleeve is not just an allocation bucket.
 * It is a bounded mandate with:
 *
 * - a portfolio job
 * - eligible asset types
 * - a return contribution
 * - relevant monitoring signals
 * - an appropriate effort level
 * - a review cadence
 * - boundaries around what does not belong
 *
 * IMPORTANT
 * ---------
 * This file does NOT:
 *
 * - select securities
 * - recommend trades
 * - change portfolio construction
 * - change sleeve weights
 * - change asset categories
 * - predict returns
 *
 * It only translates existing sleeve roles and metadata into
 * user-facing system boundaries.
 */


export const SLEEVE_ROLE_BOUNDARIES = Object.freeze({

  foundation: Object.freeze({
    systemRole: 'foundation',

    investorQuestion:
      'What should serve as the durable base of my portfolio?',

    job:
      'Provide the primary strategic portfolio foundation.',

    returnContribution:
      'Support the portfolio main long-term return objective.',

    whatBelongs:
      'Broad, durable exposures that are intended to remain part of the portfolio through ordinary market cycles.',

    whatUsuallyDoesNotBelong:
      'Short-term ideas, speculative positions, narrow themes, or assets that require constant thesis monitoring.',

    redundancyCheck:
      'A new asset may be redundant if it provides substantially the same exposure or return role as the existing foundation.',

    relevantSignals:
      'Structural changes that could affect the long-term role, diversification, concentration, or assumptions behind the foundation.',

    irrelevantNoise:
      'Daily price movement, headlines unrelated to the long-term role, and short-lived market narratives.',

    effortBoundary:
      'More frequent attention is usually unnecessary unless the foundation role or assumptions materially change.',

    actionBoundary:
      'A change should be considered only when the strategic role, required exposure, or underlying portfolio need changes.',

    userFacingSummary:
      'This is the part of the portfolio designed to do the heavy lifting. New ideas should not enter this sleeve unless they genuinely belong in the long-term foundation.'
  }),


  'required-support': Object.freeze({
    systemRole: 'required-support',

    investorQuestion:
      'What supporting role does the system need in order to function as designed?',

    job:
      'Support the portfolio foundation with a distinct required function.',

    returnContribution:
      'Improve the overall system by providing a role the foundation should not be expected to perform.',

    whatBelongs:
      'Assets that directly support the portfolio function assigned to this sleeve.',

    whatUsuallyDoesNotBelong:
      'Assets whose main purpose overlaps another sleeve or introduces a different portfolio job.',

    redundancyCheck:
      'An asset is redundant if the required support role is already sufficiently represented elsewhere.',

    relevantSignals:
      'Signals that can change whether this support function is still performing its intended job.',

    irrelevantNoise:
      'Information unrelated to the support role.',

    effortBoundary:
      'Monitoring should remain proportional to the importance and expected stability of the support function.',

    actionBoundary:
      'Reconsider only when the support role no longer functions as intended or the portfolio need changes.',

    userFacingSummary:
      'This sleeve exists because the system needs a supporting function that should stay separate from the main growth or opportunity roles.'
  }),


  'stability-resilience': Object.freeze({
    systemRole: 'stability-resilience',

    investorQuestion:
      'What part of my portfolio is responsible for resilience rather than growth?',

    job:
      'Reduce dependence on the portfolio growth engines and provide a distinct resilience role.',

    returnContribution:
      'Support portfolio stability rather than maximize upside.',

    whatBelongs:
      'Assets whose main portfolio purpose is resilience, quality, lower volatility, or defensive diversification.',

    whatUsuallyDoesNotBelong:
      'High-volatility growth ideas or speculative positions whose behavior conflicts with the stability mandate.',

    redundancyCheck:
      'Adding more defensive assets may be redundant if they perform the same resilience job without changing the overall system meaningfully.',

    relevantSignals:
      'Interest-rate conditions, inflation, credit quality, duration, and changes in the portfolio need for resilience.',

    irrelevantNoise:
      'Short-term equity headlines that do not change the stability role.',

    effortBoundary:
      'Frequent trading is usually unnecessary because the sleeve role is structural rather than tactical.',

    actionBoundary:
      'Review when the resilience need, duration assumptions, quality profile, or portfolio role materially changes.',

    userFacingSummary:
      'This sleeve is not trying to win the same race as the growth sleeve. Its job is to make the overall system more resilient.'
  }),


  'liquidity-access': Object.freeze({
    systemRole: 'liquidity-access',

    investorQuestion:
      'What part of my portfolio should remain available when I need access to capital?',

    job:
      'Keep accessible capital separate from longer-term investment roles.',

    returnContribution:
      'Prioritize access and capital availability over long-horizon return seeking.',

    whatBelongs:
      'Cash-equivalent or short-duration assets intended primarily for access, flexibility, or near-term needs.',

    whatUsuallyDoesNotBelong:
      'Assets that require long holding periods, high volatility tolerance, or significant monitoring to justify ownership.',

    redundancyCheck:
      'Additional liquidity assets may be redundant if they do not improve access, timing, or capital-management needs.',

    relevantSignals:
      'Short-term rates, liquidity needs, upcoming cash requirements, and changes in access requirements.',

    irrelevantNoise:
      'Long-term market themes that do not affect the sleeve access role.',

    effortBoundary:
      'This sleeve should usually require very little routine research.',

    actionBoundary:
      'Review when the investor access need changes or when the sleeve no longer provides the required level of liquidity.',

    userFacingSummary:
      'This sleeve exists to keep money available. It should not be asked to perform the same return job as long-term investments.'
  }),


  diversifier: Object.freeze({
    systemRole: 'diversifier',

    investorQuestion:
      'What does this add that I do not already have?',

    job:
      'Introduce a meaningfully different source of return or risk behavior.',

    returnContribution:
      'Reduce dependence on the dominant portfolio exposures by adding a distinct return or risk driver.',

    whatBelongs:
      'Assets whose behavior or economic exposure is sufficiently different from the portfolio foundation.',

    whatUsuallyDoesNotBelong:
      'Assets that appear different by name but largely duplicate existing exposures.',

    redundancyCheck:
      'If the new asset moves for substantially the same reasons as an existing sleeve, it may not provide meaningful diversification.',

    relevantSignals:
      'Correlation, concentration, economic-driver changes, regional or factor exposure, and other signals tied to the diversification thesis.',

    irrelevantNoise:
      'Performance differences that do not change whether the sleeve is actually diversifying the system.',

    effortBoundary:
      'Research should focus on whether the sleeve remains meaningfully differentiated, not on constant performance comparison.',

    actionBoundary:
      'Review when the diversifier stops providing a distinct portfolio function or becomes duplicative.',

    userFacingSummary:
      'A diversifier earns its place by adding something genuinely different. If it behaves like something you already own, the added complexity may not be useful.'
  }),


  'bounded-improvement': Object.freeze({
    systemRole: 'bounded-improvement',

    investorQuestion:
      'What specific portfolio property is this sleeve trying to improve?',

    job:
      'Improve a defined portfolio characteristic without allowing the improvement to redefine the core.',

    returnContribution:
      'Seek a targeted improvement in a specific return, risk, quality, factor, or diversification property.',

    whatBelongs:
      'Assets or strategies whose contribution can be tied to a clearly defined improvement objective.',

    whatUsuallyDoesNotBelong:
      'Ideas that are attractive in isolation but cannot explain what portfolio property they improve.',

    redundancyCheck:
      'A proposed improvement may be redundant if another sleeve already targets the same portfolio property.',

    relevantSignals:
      'Signals directly tied to the improvement thesis, factor behavior, relative characteristics, and whether the targeted property remains useful.',

    irrelevantNoise:
      'General market information that does not affect the specific improvement objective.',

    effortBoundary:
      'Moderate research is appropriate because the sleeve has a specific improvement thesis, but analysis beyond that thesis can become unnecessary.',

    actionBoundary:
      'Review when the improvement no longer provides a distinct benefit or the added complexity is no longer justified.',

    userFacingSummary:
      'This sleeve must be able to answer one question: what exactly gets better because it exists?'
  }),


  'growth-enhancer': Object.freeze({
    systemRole: 'growth-enhancer',

    investorQuestion:
      'What additional source of growth does this add beyond the core?',

    job:
      'Provide supplemental growth exposure without replacing the broad strategic foundation.',

    returnContribution:
      'Seek additional growth participation through a more targeted exposure.',

    whatBelongs:
      'Growth-oriented exposures that are intentionally more specific than the portfolio foundation.',

    whatUsuallyDoesNotBelong:
      'Assets that simply duplicate the broad core or introduce unrelated objectives.',

    redundancyCheck:
      'A growth enhancer may be redundant if the existing foundation already provides most of the same exposure.',

    relevantSignals:
      'Signals tied to the specific growth thesis, sector, region, structural trend, or exposure being used.',

    irrelevantNoise:
      'Market information unrelated to the targeted growth source.',

    effortBoundary:
      'More attention than the foundation may be justified, but monitoring should remain focused on the specific enhancement thesis.',

    actionBoundary:
      'Review when the targeted growth thesis weakens, duplicates the core, or requires more effort than its portfolio contribution justifies.',

    userFacingSummary:
      'This sleeve is allowed to pursue more targeted growth, but it should remain supplemental to the broad foundation.'
  }),


  'exploration-research': Object.freeze({
    systemRole: 'exploration-research',

    investorQuestion:
      'Where can I research and test new ideas without disrupting the rest of my portfolio?',

    job:
      'Create a bounded place for higher-uncertainty ideas and learning.',

    returnContribution:
      'Provide limited exposure to ideas with uncertain but potentially differentiated upside.',

    whatBelongs:
      'Selected ideas that require more research and do not belong in the permanent strategic portfolio.',

    whatUsuallyDoesNotBelong:
      'Core exposures, essential liquidity, or assets that should be held regardless of the exploratory thesis.',

    redundancyCheck:
      'An exploratory idea may be redundant if it reproduces exposure already present in the core or another opportunity sleeve.',

    relevantSignals:
      'Thesis-specific market, sector, company, technology, or structural-trend information.',

    irrelevantNoise:
      'Information unrelated to the specific idea being researched.',

    effortBoundary:
      'Higher effort is expected, but it must remain bounded to the research thesis and the sleeve allocation.',

    actionBoundary:
      'Review when the thesis changes, the allocation boundary is exceeded, or the effort required no longer justifies the potential contribution.',

    userFacingSummary:
      'This is the part of the system where curiosity belongs. The boundary keeps exploration from becoming the whole portfolio.'
  }),


  'tactical-conditional': Object.freeze({
    systemRole: 'tactical-conditional',

    investorQuestion:
      'When is a changing market condition important enough to justify a portfolio adjustment?',

    job:
      'Create a bounded role for decisions that depend on changing conditions rather than permanent portfolio objectives.',

    returnContribution:
      'Seek a conditional portfolio benefit when a predefined market or economic condition is relevant.',

    whatBelongs:
      'Positions or allocation changes supported by an explicit tactical condition or thesis.',

    whatUsuallyDoesNotBelong:
      'Permanent strategic exposures that should not depend on short-term market timing.',

    redundancyCheck:
      'A tactical position may be redundant if the existing portfolio already expresses the same exposure without requiring a new conditional decision.',

    relevantSignals:
      'The market, valuation, regime, economic, or portfolio conditions explicitly associated with the tactical mandate.',

    irrelevantNoise:
      'Unrelated headlines and market movement that do not affect the predefined condition.',

    effortBoundary:
      'Higher monitoring effort is justified only while the tactical condition remains active and decision-relevant.',

    actionBoundary:
      'Review when the triggering condition changes, the thesis expires, or the tactical role no longer adds enough value to justify the effort.',

    userFacingSummary:
      'This sleeve gives changing market views a defined place, but those views are not allowed to rewrite the permanent portfolio.'
  }),


  income: Object.freeze({
    systemRole: 'income',

    investorQuestion:
      'What part of the portfolio is responsible for producing income?',

    job:
      'Provide a distinct cash-flow role within the portfolio.',

    returnContribution:
      'Generate recurring income while operating within the risk characteristics of the sleeve.',

    whatBelongs:
      'Assets whose primary portfolio role includes reliable or intentional income generation.',

    whatUsuallyDoesNotBelong:
      'Assets selected mainly for speculative appreciation without an income role.',

    redundancyCheck:
      'Additional income assets may be redundant if they increase complexity without improving income source diversification or quality.',

    relevantSignals:
      'Yield, credit quality, distribution sustainability, duration, and other factors directly tied to income generation.',

    irrelevantNoise:
      'Price movements that do not materially affect the ability of the sleeve to perform its income job.',

    effortBoundary:
      'Monitoring should focus on income quality and sustainability rather than constant price comparison.',

    actionBoundary:
      'Review when the income need changes or the sleeve ability to generate the intended cash flow deteriorates.',

    userFacingSummary:
      'This sleeve has a cash-flow job. It should be evaluated on whether it continues to perform that job, not only on price movement.'
  }),


  'inflation-protection': Object.freeze({
    systemRole: 'inflation-protection',

    investorQuestion:
      'What part of my portfolio is intended to address purchasing-power risk?',

    job:
      'Provide a distinct portfolio response to inflation and purchasing-power risk.',

    returnContribution:
      'Help the portfolio behave differently when inflation affects real purchasing power.',

    whatBelongs:
      'Assets whose portfolio role has a direct or meaningful relationship to inflation or real-value preservation.',

    whatUsuallyDoesNotBelong:
      'Assets that are labeled defensive but do not meaningfully contribute to the inflation-protection objective.',

    redundancyCheck:
      'An additional inflation-sensitive asset may be redundant if the system already has sufficient exposure to the same economic driver.',

    relevantSignals:
      'Inflation, real rates, purchasing-power conditions, and other factors directly tied to the protection thesis.',

    irrelevantNoise:
      'Market events that do not affect inflation risk or the sleeve protection role.',

    effortBoundary:
      'Monitoring should focus on whether the inflation-protection role remains necessary and effective rather than daily price movement.',

    actionBoundary:
      'Review when inflation risk, portfolio needs, or the economic behavior of the sleeve changes materially.',

    userFacingSummary:
      'This sleeve exists to solve a specific purchasing-power problem. It should not become a general-purpose diversifier.'
  })
});


/*
 * Build a bounded-system explanation for one already-resolved sleeve.
 *
 * The existing sleeve metadata remains authoritative.
 * This guidance only adds interpretation.
 */

export function getSleeveBoundaryGuidance(
  sleeve
) {
  if (!sleeve) {
    return null;
  }

  const systemRole =
    sleeve?.role?.id ??
    sleeve.systemRole ??
    null;

  if (!systemRole) {
    return null;
  }

  const guidance =
    SLEEVE_ROLE_BOUNDARIES[
      systemRole
    ];

  if (!guidance) {
    return null;
  }

  return {
    sleeveId:
      sleeve.id ?? null,

    sleeveLabel:
      sleeve.label ?? null,

    systemRole,

    investorQuestion:
      guidance.investorQuestion,

    job:
      guidance.job,

    returnContribution:
      guidance.returnContribution,

    whatBelongs:
      guidance.whatBelongs,

    whatUsuallyDoesNotBelong:
      guidance.whatUsuallyDoesNotBelong,

    redundancyCheck:
      guidance.redundancyCheck,

    relevantSignals:
      guidance.relevantSignals,

    irrelevantNoise:
      guidance.irrelevantNoise,

    effortBoundary:
      guidance.effortBoundary,

    actionBoundary:
      guidance.actionBoundary,

    userFacingSummary:
      guidance.userFacingSummary,

    /*
     * Preserve the actual resolved implementation data.
     *
     * These values are not invented by this guidance file.
     */
    implementation: {
      weight:
        sleeve.weight ?? null,

      weightPercent:
        sleeve.weightPercent ?? null,

      returnFunction:
        sleeve?.operatingProfile?.returnFunction ??
        sleeve.returnFunction ??
        null,

      effort:
        sleeve?.operatingProfile?.effort ??
        sleeve.effort ??
        null,

      effortLabel:
        sleeve?.operatingProfile?.effortLabel ??
        null,

      reviewCadence:
        sleeve?.operatingProfile?.reviewCadence ??
        sleeve.reviewCadence ??
        null,

      reviewCadenceLabel:
        sleeve?.operatingProfile?.reviewCadenceLabel ??
        null,

      assetCategories:
        sleeve.assetCategories ?? [],

      marketTrendTags:
        sleeve?.monitoring?.marketTrendTags ??
        sleeve.marketTrendTags ??
        [],

      marketTrends:
        sleeve?.monitoring?.marketTrends ??
        sleeve.marketTrends ??
        []
    }
  };
}


export function getSleeveBoundaries(
  sleeves = []
) {
  if (!Array.isArray(sleeves)) {
    return [];
  }

  return sleeves
    .map(
      getSleeveBoundaryGuidance
    )
    .filter(Boolean);
}

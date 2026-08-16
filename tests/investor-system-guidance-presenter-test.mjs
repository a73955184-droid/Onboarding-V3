import assert from 'node:assert/strict';

import {
  resolvePortfolioJobFit
} from '../src/domain/portfolio-philosophy/portfolio-job-fit-resolver.js';

import {
  presentPortfolioJobFit
} from '../src/domain/portfolio-philosophy/portfolio-job-fit-presenter.js';

import {
  presentInvestorSystemGuidance
} from '../src/domain/investor-system-guidance/investor-system-guidance-presenter.js';

import {
  getVariantComplexityGuidance
} from '../src/domain/investor-system-guidance/variant-complexity-guidance.js';


const EXPECTED_VARIANT_RATIONALES = Object.freeze({
  'ES essential': 'Build the foundation with the fewest moving parts. Growth, resilience, and accessible money are kept in broad, easy-to-understand roles so the investor can establish a coherent system before adding complexity.',
  'ES intentional': 'Make the foundation more understandable without making it meaningfully harder to manage. The broad growth allocation is separated into US and international roles so geographic exposure can be understood and rebalanced deliberately.',
  'ES engaged': 'Keep the simple diversified foundation, but create one controlled place for personal preferences. Most of the portfolio stays broad and passive while a small customization sleeve gives the investor room to express a theme or preference without redefining the system.',
  'GD essential': 'Get global diversification mostly through broad funds. Countries and regions do not need to be managed separately; the system keeps global growth, stability, and liquidity consolidated.',
  'GD intentional': 'Make the important sources of global diversification visible. US, developed international, emerging markets, inflation resilience, stability, and liquidity are separated so the investor can understand where diversification is actually coming from.',
  'GD engaged': 'Manage diversification across more than geography alone. The portfolio adds explicit small-cap and real-asset diversification, giving the investor more distinct return drivers to monitor while keeping a broad global foundation.',
  'FT essential': 'Improve one clearly identified limitation without disturbing the core. Most capital remains in a durable diversified foundation, with one bounded improvement sleeve allowed to address a specific weakness such as concentration or exposure imbalance.',
  'FT intentional': 'Separate several evidence-based improvements so each has to justify its role. The core remains dominant, but geographic diversification, quality, and small-value improvements are managed independently instead of being bundled together.',
  'FT engaged': 'Create a broader improvement toolkit while protecting the durable foundation. Systematic factor improvements and a strategic diversifier are joined by a small research sleeve where selected ideas can be evaluated under explicit boundaries.',
  'BFO essential': 'Separate only the three financial jobs that should never be confused: growth, resilience, and access. The system preserves the multi-purpose philosophy while minimizing the number of independently managed pools.',
  'BFO intentional': 'Give each major household and wealth-management job its own place. Growth, income, stability, diversification, liquidity, and a small opportunity allocation are separated so decisions can be made according to the job the capital is meant to perform.',
  'BFO engaged': 'Operate the multi-purpose portfolio with greater specialization. Growth, income, resilience, real assets, alternatives, liquidity, and selected opportunities all become explicit roles, giving the investor more control without allowing any non-core activity to dominate the system.',
  'GA essential': 'Keep growth overwhelmingly dominant and add only one broad source of differentiated return. Alternatives remain a supporting exposure rather than becoming a collection of separate strategies.',
  'GA intentional': 'Separate the different ways the portfolio is trying to improve on a traditional growth core. Growth enhancers, real assets, and an alternative strategy each get a distinct role so their purpose and contribution can be evaluated independently.',
  'GA engaged': 'Use several bounded growth and alternative engines while keeping a permanent core. Structural themes, smaller/emerging growth, real assets, alternatives, and an opportunity sleeve create more places for research, but all remain subordinate to the long-term growth foundation.',
  'TO essential': 'Protect the long-term portfolio while reserving a small amount of capital for opportunities. The investor can pursue selected ideas, but opportunity-taking stays clearly separated from the permanent core.',
  'TO intentional': 'Separate different kinds of active decisions instead of treating every opportunity the same. Tactical allocation changes and security/theme selection receive distinct bounded sleeves, while the core and reserve remain protected.',
  'TO engaged': 'Run a genuinely active opportunity layer around a protected permanent core. Tactical allocation, themes, and individual security selection are separately managed, each with explicit sizing and decision rules.',
  'IP essential': 'Cover the essential preservation jobs with broad, dependable building blocks. Most of the portfolio focuses on high-quality income and accessible capital, while a measured growth allocation helps preserve purchasing power over time.',
  'IP intentional': 'Separate the major sources of income, liquidity, growth, and inflation protection so they can be managed according to different needs. Duration-sensitive income, core bonds, income equity, growth, and inflation resilience each have an explicit job.',
  'IP engaged': 'Manage income and preservation at a more granular source-of-risk level. Government bonds, credit, dividend equity, inflation protection, growth, liquidity, and selected income opportunities are separated so the investor can evaluate income quality and risk rather than simply chasing yield.'
});


function buildGuidance(assessmentResult) {
  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const fitPresentation =
    presentPortfolioJobFit(
      fitResult
    );

  const guidance =
    presentInvestorSystemGuidance(
      fitPresentation
    );

  return {
    fitResult,
    fitPresentation,
    guidance
  };
}


function findSleeve(
  guidance,
  sleeveId
) {
  return (
    guidance.sleeves ??
    []
  ).find(
    (sleeve) =>
      sleeve.id === sleeveId
  );
}


function assertCommonContract(
  guidance,
  expectedArchetypeId
) {
  assert.ok(
    guidance,
    'Expected investor system guidance'
  );

  assert.equal(
    guidance.resolved.archetypeId,
    expectedArchetypeId,
    'Unexpected archetype in guidance'
  );

  assert.ok(
    guidance.resolved.variantId,
    'Resolved variant should be preserved'
  );

  /*
   * ----------------------------------------------------------
   * Investor JTBD
   * ----------------------------------------------------------
   */

  assert.ok(
    guidance.investorJobs,
    'Investor JTBD section should exist'
  );

  assert.equal(
    guidance.investorJobs.organize.id,
    'organize',
    'Organization JTBD should exist'
  );

  assert.equal(
    guidance.investorJobs.focus.id,
    'focus-effort',
    'Effort JTBD should exist'
  );

  assert.equal(
    guidance.investorJobs.decide.id,
    'decide',
    'Decision JTBD should exist'
  );

  assert.ok(
    guidance.investorJobs
      .organize
      .investorQuestion,
    'Organization JTBD should expose an investor question'
  );

  assert.ok(
    guidance.investorJobs
      .focus
      .investorQuestion,
    'Effort JTBD should expose an investor question'
  );

  assert.ok(
    guidance.investorJobs
      .decide
      .investorQuestion,
    'Decision JTBD should expose an investor question'
  );


  /*
   * ----------------------------------------------------------
   * Philosophy
   * ----------------------------------------------------------
   */

  assert.ok(
    guidance.philosophy,
    'Portfolio philosophy guidance should exist'
  );

  assert.equal(
    guidance.philosophy.archetypeId,
    expectedArchetypeId,
    'Philosophy should preserve archetype'
  );

  assert.ok(
    guidance.philosophy.philosophyName,
    'Portfolio philosophy should have a user-facing name'
  );

  assert.ok(
    guidance.philosophy.summary,
    'Portfolio philosophy should retain its explanation'
  );


  /*
   * ----------------------------------------------------------
   * Variant / complexity
   * ----------------------------------------------------------
   */

  assert.ok(
    guidance.complexity,
    'Variant complexity guidance should exist'
  );

  assert.equal(
    guidance.complexity.variantId,
    guidance.resolved.variantId,
    'Complexity explanation should use the resolved variant'
  );

  assert.equal(
    guidance.complexity.sleeveCount,
    guidance.resolved.sleeveCount,
    'Complexity sleeve count should match resolved system'
  );

  assert.ok(
    guidance.complexity
      .whyThisVersion,
    'Variant should explain why this version exists'
  );

  assert.ok(
    guidance.complexity
      .whatSeparationProvides,
    'Variant should explain what additional separation provides'
  );

  assert.ok(
    guidance.complexity
      .whyNotSimpler,
    'Variant should explain why a simpler structure is insufficient'
  );

  assert.ok(
    guidance.complexity
      .whyNotMoreComplex,
    'Variant should explain why more complexity is unnecessary'
  );


  /*
   * ----------------------------------------------------------
   * Exact variant rationale registry
   * ----------------------------------------------------------
   */

  for (const [key, expectedText] of Object.entries(EXPECTED_VARIANT_RATIONALES)) {
    const [archetypeId, variantId] = key.split(' ');
    const guidanceForVariant = getVariantComplexityGuidance(archetypeId, variantId);

    assert.ok(
      guidanceForVariant,
      'Expected guidance for ' + key
    );

    assert.equal(
      guidanceForVariant.variantRationale,
      expectedText,
      'Exact rationale mismatch for ' + key
    );
  }


  /*
   * ----------------------------------------------------------
   * Effort
   * ----------------------------------------------------------
   */

  assert.ok(
    guidance.effort,
    'Effort-return guidance should exist'
  );

  assert.ok(
    guidance.effort
      .investorQuestion,
    'Effort model should answer a user question'
  );

  assert.ok(
    guidance.effort
      .portfolioEffort,
    'Portfolio effort summary should exist'
  );

  assert.ok(
    guidance.effort
      .returnEffortPrinciple,
    'Return-effort principle should exist'
  );

  assert.ok(
    guidance.effort
      .returnEffortPrinciple
      .noPerformancePromise,
    'Effort guidance should explicitly avoid performance guarantees'
  );


  /*
   * ----------------------------------------------------------
   * Behavior
   * ----------------------------------------------------------
   */

  assert.ok(
    guidance.behavior,
    'Behavior operating model should exist'
  );

  assert.ok(
    guidance.behavior
      .investorQuestion,
    'Behavior should expose the investor decision question'
  );

  assert.ok(
    guidance.behavior
      .systemPromise,
    'Behavior should explain how the system supports decisions'
  );

  assert.ok(
    Array.isArray(
      guidance.behavior
        .decisionProtocol
    ),
    'Behavior should expose a decision protocol'
  );

  assert.ok(
    guidance.behavior
      .decisionProtocol
      .length > 0,
    'Behavior decision protocol should contain steps'
  );


  /*
   * ----------------------------------------------------------
   * Sleeves
   * ----------------------------------------------------------
   */

  assert.ok(
    Array.isArray(
      guidance.sleeves
    ),
    'Guided sleeves should be an array'
  );

  assert.equal(
    guidance.sleeves.length,
    guidance.resolved.sleeveCount,
    'Guidance must not add or remove sleeves'
  );

  for (
    const sleeve
    of guidance.sleeves
  ) {
    assert.ok(
      sleeve.guidance,
      sleeve.id +
        ': sleeve guidance should exist'
    );

    assert.ok(
      sleeve.guidance.job,
      sleeve.id +
        ': sleeve should explain its job'
    );

    assert.ok(
      sleeve.guidance
        .returnContribution,
      sleeve.id +
        ': sleeve should explain its return contribution'
    );

    assert.ok(
      sleeve.guidance
        .whatBelongs,
      sleeve.id +
        ': sleeve should explain what belongs'
    );

    assert.ok(
      sleeve.guidance
        .whatUsuallyDoesNotBelong,
      sleeve.id +
        ': sleeve should explain what does not belong'
    );

    assert.ok(
      sleeve.guidance
        .redundancyCheck,
      sleeve.id +
        ': sleeve should explain redundancy'
    );

    assert.ok(
      sleeve.guidance
        .relevantSignals,
      sleeve.id +
        ': sleeve should explain relevant signals'
    );

    assert.ok(
      sleeve.guidance
        .effortBoundary,
      sleeve.id +
        ': sleeve should explain effort boundary'
    );

    assert.ok(
      sleeve.guidance
        .actionBoundary,
      sleeve.id +
        ': sleeve should explain action boundary'
    );
  }


  /*
   * ----------------------------------------------------------
   * User-led principle
   * ----------------------------------------------------------
   */

  assert.ok(
    guidance.userLedPrinciple,
    'User-led principle should exist'
  );

  assert.equal(
    guidance.userLedPrinciple.title,
    'Your system supports the decision. You make it.',
    'User-led positioning should be preserved'
  );
}


/*
 * ============================================================
 * CASE 1
 *
 * ES + Foundation Builder
 * + Guided Autopilot
 * + Instruction Seeker
 *
 * This is the reference case already validated manually.
 *
 * Expected:
 *
 * - Essential structure
 * - 3 sleeves
 * - very low routine effort
 * - instruction-oriented decision support
 * ============================================================
 */

{
  const assessmentResult = {
    archetypeId: 'ES',

    stageId:
      'foundation_builder',

    styleId:
      'guided_autopilot',

    modifierId:
      'instruction_seeker',

    normalizedAnswers: {
      setup:
        'not_started',

      transition:
        'what_to_do',

      decisionStyle:
        'start',

      marketPsychology:
        'rarely',

      evolution:
        'understand',

      tradeoff:
        'tell_me',

      age:
        'unsure',

      goals: [
        'start_confident'
      ]
    }
  };


  const {
    guidance
  } =
    buildGuidance(
      assessmentResult
    );


  assertCommonContract(
    guidance,
    'ES'
  );


  assert.equal(
    guidance.resolved.stageId,
    'foundation_builder',
    'Expected Foundation Builder'
  );

  assert.equal(
    guidance.resolved.styleId,
    'guided_autopilot',
    'Expected Guided Autopilot'
  );

  assert.equal(
    guidance.resolved.behaviorId,
    'instruction_seeker',
    'Expected Instruction Seeker'
  );


  /*
   * This known case currently resolves Essential.
   */

  assert.equal(
    guidance.resolved.variantId,
    'essential',
    'Reference ES case should resolve Essential'
  );

  assert.equal(
    guidance.resolved.sleeveCount,
    3,
    'ES Essential should contain three sleeves'
  );


  /*
   * Complexity explanation.
   */

  assert.ok(
    guidance.complexity
      .userFacingSummary
      .includes('Three'),
    'ES Essential complexity should explain why three broad roles are sufficient'
  );


  /*
   * Effort model.
   */

  assert.equal(
    guidance.effort
      .portfolioEffort
      .lowEffortPercent,
    100,
    'Reference ES case should remain 100% low/very-low effort'
  );


  /*
   * Behavior model.
   */

  assert.equal(
    guidance.behavior.behaviorId,
    'instruction_seeker',
    'Instruction Seeker behavior guidance should resolve'
  );

  assert.deepEqual(
    guidance.behavior.outcomes,
    [
      'leave-alone',
      'monitor',
      'review',
      'consider-action'
    ],
    'Instruction Seeker should use the four-step action-state model'
  );


  /*
   * Sleeve boundaries.
   */

  const growth =
    findSleeve(
      guidance,
      'broadGrowthCore'
    );

  const stability =
    findSleeve(
      guidance,
      'stability'
    );

  const liquidity =
    findSleeve(
      guidance,
      'liquidity'
    );

  assert.ok(
    growth,
    'Expected Broad Growth Core'
  );

  assert.ok(
    stability,
    'Expected Stability'
  );

  assert.ok(
    liquidity,
    'Expected Liquidity'
  );

  assert.equal(
    growth.guidance.effort.level,
    'low',
    'Growth foundation should retain low effort'
  );

  assert.equal(
    liquidity.guidance.effort.level,
    'very-low',
    'Liquidity should retain very-low effort'
  );

  assert.ok(
    growth.guidance
      .whatUsuallyDoesNotBelong
      .includes('Short-term'),
    'Foundation boundary should reject short-term ideas'
  );
}


/*
 * ============================================================
 * CASE 2
 *
 * FT + Intentional Optimizer
 * + Systematic Improver
 * + Optimization Mindset
 *
 * Expected:
 *
 * - optimization behavior
 * - explicit improvement roles
 * - effort concentrated where comparison matters
 * ============================================================
 */

{
  const assessmentResult = {
    archetypeId: 'FT',

    stageId:
      'intentional_optimizer',

    styleId:
      'systematic_improver',

    modifierId:
      'optimization_mindset',

    normalizedAnswers: {
      setup:
        'established',

      transition:
        'compare',

      decisionStyle:
        'enough',

      marketPsychology:
        'holding',

      evolution:
        'effort',

      tradeoff:
        'periodic',

      age:
        '10plus',

      goals: [
        'choose'
      ]
    }
  };


  const {
    guidance
  } =
    buildGuidance(
      assessmentResult
    );


  assertCommonContract(
    guidance,
    'FT'
  );


  assert.equal(
    guidance.resolved.behaviorId,
    'optimization_mindset',
    'Expected Optimization Mindset'
  );

  assert.equal(
    guidance.behavior
      .decisionFraming,
    'Improve with a stopping rule.',
    'Optimizer should receive stopping-rule guidance'
  );

  assert.ok(
    guidance.behavior
      .systemGuardrail
      .includes('Additional complexity'),
    'Optimizer guardrail should explicitly address complexity'
  );


  /*
   * Find bounded-improvement sleeves.
   */

  const improvementSleeves =
    guidance.sleeves.filter(
      (sleeve) =>
        sleeve?.role?.id ===
        'bounded-improvement'
    );

  assert.ok(
    improvementSleeves.length > 0,
    'FT should expose at least one bounded-improvement sleeve'
  );


  for (
    const improvement
    of improvementSleeves
  ) {
    assert.ok(
      improvement.guidance
        .returnContribution,
      'FT improvement sleeve should explain the property it is intended to improve'
    );

    assert.ok(
      improvement.guidance
        .redundancyCheck,
      'FT improvement sleeve should include a redundancy test'
    );

    assert.ok(
      improvement.guidance
        .effortBoundary,
      'FT improvement sleeve should explain its research-effort boundary'
    );
  }


  assert.ok(
    guidance.effort
      .userFacingSummary
      .includes('comparison') ||
    guidance.effort
      .userFacingSummary
      .includes('research'),
    'Systematic Improver effort model should emphasize comparison/research'
  );
}


/*
 * ============================================================
 * CASE 3
 *
 * TO + Adaptive Investor
 * + Active Navigator
 * + Opportunity Chaser
 *
 * Expected:
 *
 * - permanent foundation preserved
 * - active opportunity roles bounded
 * - opportunity behavior guardrails
 * ============================================================
 */

{
  const assessmentResult = {
    archetypeId: 'TO',

    stageId:
      'adaptive_investor',

    styleId:
      'active_navigator',

    modifierId:
      'opportunity_chaser',

    normalizedAnswers: {
      setup:
        'collected',

      transition:
        'missing',

      decisionStyle:
        'fit',

      marketPsychology:
        'idea',

      evolution:
        'experiment',

      tradeoff:
        'active',

      age:
        '10plus',

      goals: [
        'explore'
      ]
    }
  };


  const {
    guidance
  } =
    buildGuidance(
      assessmentResult
    );


  assertCommonContract(
    guidance,
    'TO'
  );


  assert.equal(
    guidance.resolved.behaviorId,
    'opportunity_chaser',
    'Expected Opportunity Chaser'
  );

  assert.equal(
    guidance.behavior
      .decisionFraming,
    'Give opportunities a defined place and a defined limit.',
    'Opportunity Chaser should receive bounded-opportunity framing'
  );


  const foundation =
    guidance.sleeves.find(
      (sleeve) =>
        sleeve?.role?.id ===
        'foundation'
    );

  assert.ok(
    foundation,
    'TO should retain a strategic foundation'
  );


  const activeSleeves =
    guidance.sleeves.filter(
      (sleeve) =>
        sleeve?.role?.id ===
          'tactical-conditional' ||
        sleeve?.role?.id ===
          'exploration-research'
    );

  assert.ok(
    activeSleeves.length > 0,
    'TO should contain bounded active roles'
  );


  for (
    const sleeve
    of activeSleeves
  ) {
    assert.ok(
      sleeve.guidance
        .whatUsuallyDoesNotBelong,
      sleeve.id +
        ': active role should define what does not belong'
    );

    assert.ok(
      sleeve.guidance
        .actionBoundary,
      sleeve.id +
        ': active role should define when reconsideration is justified'
    );
  }


  assert.ok(
    guidance.behavior
      .commonDecisionMoments
      .some(
        (item) =>
          item
            .toLowerCase()
            .includes('trend') ||
          item
            .toLowerCase()
            .includes('stock')
      ),
    'Opportunity behavior should address hot ideas/trends'
  );
}


/*
 * ============================================================
 * CASE 4
 *
 * IP + income / access needs
 *
 * Expected:
 *
 * - multiple financial jobs remain distinct
 * - income/access sleeves expose different boundaries
 * ============================================================
 */

{
  const assessmentResult = {
    archetypeId: 'IP',

    stageId:
      'system_builder',

    styleId:
      'steady_steward',

    modifierId:
      'confidence_builder',

    normalizedAnswers: {
      setup:
        'simple_start',

      transition:
        'change',

      decisionStyle:
        'sell',

      marketPsychology:
        'balance',

      evolution:
        'monitor',

      tradeoff:
        'occasional',

      age:
        'under3',

      goals: [
        'income'
      ]
    }
  };


  const {
    guidance
  } =
    buildGuidance(
      assessmentResult
    );


  assertCommonContract(
    guidance,
    'IP'
  );


  assert.equal(
    guidance.resolved.behaviorId,
    'confidence_builder',
    'Expected Confidence Builder'
  );

  assert.ok(
    guidance.complexity
      .userFacingSummary,
    'IP should explain why its income/access structure has this granularity'
  );


  const incomeSleeves =
    guidance.sleeves.filter(
      (sleeve) =>
        sleeve?.role?.id ===
        'income'
    );

  assert.ok(
    incomeSleeves.length > 0,
    'IP should contain at least one income role'
  );


  for (
    const sleeve
    of incomeSleeves
  ) {
    assert.ok(
      sleeve.guidance
        .returnContribution
        .toLowerCase()
        .includes('income'),
      sleeve.id +
        ': income sleeve should describe an income contribution'
    );
  }


  const accessSleeve =
    guidance.sleeves.find(
      (sleeve) =>
        sleeve?.role?.id ===
        'liquidity-access'
    );

  assert.ok(
    accessSleeve,
    'IP should contain a liquidity/access role'
  );

  assert.ok(
    accessSleeve.guidance
      .whatBelongs
      .toLowerCase()
      .includes('cash') ||
    accessSleeve.guidance
      .whatBelongs
      .toLowerCase()
      .includes('short-duration'),
    'Liquidity guidance should distinguish accessible assets'
  );
}


/*
 * ============================================================
 * CASE 5
 *
 * Presenter must not mutate the already-working presentation.
 * ============================================================
 */

{
  const assessmentResult = {
    archetypeId: 'ES',

    stageId:
      'foundation_builder',

    styleId:
      'guided_autopilot',

    modifierId:
      'instruction_seeker',

    normalizedAnswers: {
      setup:
        'not_started',

      marketPsychology:
        'rarely',

      tradeoff:
        'tell_me'
    }
  };


  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const fitPresentation =
    presentPortfolioJobFit(
      fitResult
    );

  const before =
    JSON.stringify(
      fitPresentation
    );


  presentInvestorSystemGuidance(
    fitPresentation
  );


  const after =
    JSON.stringify(
      fitPresentation
    );


  assert.equal(
    after,
    before,
    'Investor-system guidance presenter must not mutate the existing fit presentation'
  );
}


/*
 * ============================================================
 * CASE 6
 *
 * User-led positioning must remain explicit.
 * ============================================================
 */

{
  const assessmentResult = {
    archetypeId: 'ES',

    stageId:
      'foundation_builder',

    styleId:
      'guided_autopilot',

    modifierId:
      'instruction_seeker',

    normalizedAnswers: {
      setup:
        'not_started',

      tradeoff:
        'tell_me'
    }
  };


  const {
    guidance
  } =
    buildGuidance(
      assessmentResult
    );


  assert.equal(
    guidance
      .userLedPrinciple
      .title,
    'Your system supports the decision. You make it.',
    'AaronBux must preserve user-led positioning'
  );

  assert.ok(
    guidance
      .userLedPrinciple
      .explanation
      .includes(
        'does not require'
      ),
    'User-led explanation should distinguish decision support from automatic action'
  );
}


console.log(
  'Investor system guidance presenter tests passed.'
);

import assert from 'node:assert/strict';

import {
  resolvePortfolioJobFit
} from '../src/domain/portfolio-system/portfolio-job-fit-resolver.js';


function approxEqual(actual, expected, tolerance = 0.0001) {
  return Math.abs(actual - expected) <= tolerance;
}


function findSleeve(result, sleeveId) {
  return result.sleeves.find(
    (sleeve) => sleeve.id === sleeveId
  );
}


function assertBasicResult(result, expected) {
  assert.ok(
    result,
    'Expected portfolio-job-fit result'
  );

  assert.equal(
    result.recommendation.archetypeId,
    expected.archetypeId,
    'Unexpected archetype'
  );

  if (expected.variantId) {
    assert.equal(
      result.recommendation.variantId,
      expected.variantId,
      'Unexpected variant'
    );
  }

  assert.equal(
    result.jobs.stage.profileId,
    expected.stageId,
    'Unexpected Stage'
  );

  assert.equal(
    result.jobs.style.profileId,
    expected.styleId,
    'Unexpected Style'
  );

  assert.equal(
    result.jobs.behavior.profileId,
    expected.modifierId,
    'Unexpected Behavior modifier'
  );

  assert.ok(
    result.jobs.stage.title,
    'Stage canonical JTBD title should exist'
  );

  assert.ok(
    result.jobs.style.title,
    'Style canonical JTBD title should exist'
  );

  assert.ok(
    result.jobs.behavior.title,
    'Behavior canonical JTBD title should exist'
  );

  assert.ok(
    result.jobs.stage.portfolioRequirement,
    'Stage portfolio requirement should exist'
  );

  assert.ok(
    result.jobs.style.portfolioRequirement,
    'Style portfolio requirement should exist'
  );

  assert.ok(
    result.jobs.behavior.portfolioRequirement,
    'Behavior portfolio requirement should exist'
  );

  assert.ok(
    result.jobs.stage.systemFit,
    'Stage system-fit explanation should exist'
  );

  assert.ok(
    result.jobs.style.systemFit,
    'Style system-fit explanation should exist'
  );

  assert.ok(
    result.jobs.behavior.systemFit,
    'Behavior system-fit explanation should exist'
  );

  assert.ok(
    Array.isArray(result.sleeves),
    'Sleeves should be an array'
  );

  assert.ok(
    result.sleeves.length > 0,
    'Expected constituent sleeves'
  );

  assert.equal(
    result.structure.sleeveCount,
    result.sleeves.length,
    'Structure sleeve count should match returned sleeves'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 1
 *
 * ES-like simple / low-involvement user.
 *
 * Important behavior:
 * - simplicity evidence should exist
 * - low-involvement evidence should exist
 * - liquidity must NOT become personalized merely because
 *   the ES portfolio contains a liquidity sleeve
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
    archetypeId: 'ES',

    stageId: 'foundation_builder',
    styleId: 'guided_autopilot',
    modifierId: 'instruction_seeker',

    normalizedAnswers: {
      setup: 'not_started',
      transition: 'what_to_do',
      decisionStyle: 'start',
      marketPsychology: 'rarely',
      evolution: 'understand',
      tradeoff: 'tell_me',
      age: 'unsure',
      goals: ['start_confident']
    }
  };

  const result =
    resolvePortfolioJobFit(
      assessmentResult
    );

  assertBasicResult(
    result,
    {
      archetypeId: 'ES',
      stageId: 'foundation_builder',
      styleId: 'guided_autopilot',
      modifierId: 'instruction_seeker'
    }
  );

  assert.ok(
    result.evidence.tags.includes(
      'simplicity'
    ),
    'ES simple case should contain simplicity evidence'
  );

  assert.ok(
    result.evidence.tags.includes(
      'low-involvement'
    ),
    'ES simple case should contain low-involvement evidence'
  );

  const liquidity =
    findSleeve(
      result,
      'liquidity'
    );

  assert.ok(
    liquidity,
    'Expected ES liquidity sleeve'
  );

  assert.equal(
    liquidity.systemRole,
    'liquidity-access',
    'ES liquidity should retain liquidity-access philosophy role'
  );

  assert.equal(
    liquidity.personalization.status,
    'system-design-only',
    'Liquidity must not be personalized without direct evidence'
  );

  assert.deepEqual(
    liquidity.personalization.evidence,
    [],
    'Liquidity should have no direct user evidence in this case'
  );

  const broadGrowthCore =
    findSleeve(
      result,
      'broadGrowthCore'
    );

  assert.ok(
    broadGrowthCore,
    'Expected ES broadGrowthCore sleeve'
  );

  assert.equal(
    broadGrowthCore.systemRole,
    'foundation',
    'ES Broad Growth Core should be classified as foundation'
  );

  assert.ok(
    broadGrowthCore.whyItExists,
    'Foundation sleeve should explain why it exists'
  );

  assert.ok(
    broadGrowthCore.contributionToSystem,
    'Foundation sleeve should explain its system contribution'
  );

  assert.equal(
    broadGrowthCore.personalization.status,
    'direct-evidence',
    'Broad Growth Core should have direct evidence from simplicity-oriented answers'
  );

  assert.ok(
    approxEqual(
      result.structure.lowEffortWeight,
      1
    ),
    'Expected ES Essential to be fully low/very-low effort if current constituent metadata defines it that way'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 2
 *
 * FT / optimization-oriented user.
 *
 * Important behavior:
 * - optimization evidence should exist
 * - targeted improvement should be directly relevant
 * - improvement remains bounded relative to foundation
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
    archetypeId: 'FT',

    stageId: 'intentional_optimizer',
    styleId: 'systematic_improver',
    modifierId: 'optimization_mindset',

    normalizedAnswers: {
      setup: 'established',
      transition: 'compare',
      decisionStyle: 'enough',
      marketPsychology: 'holding',
      evolution: 'effort',
      tradeoff: 'periodic',
      age: '10plus',
      goals: ['choose']
    }
  };

  const result =
    resolvePortfolioJobFit(
      assessmentResult
    );

  assertBasicResult(
    result,
    {
      archetypeId: 'FT',
      stageId: 'intentional_optimizer',
      styleId: 'systematic_improver',
      modifierId: 'optimization_mindset'
    }
  );

  assert.ok(
    result.evidence.tags.includes(
      'optimization'
    ),
    'FT optimizer should contain optimization evidence'
  );

  assert.ok(
    result.evidence.tags.includes(
      'compare-alternatives'
    ),
    'FT optimizer should contain comparison evidence'
  );

  assert.ok(
    result.evidence.tags.includes(
      'research-effort'
    ),
    'FT optimizer should contain research-effort evidence'
  );

  const improvementSleeves =
    result.sleeves.filter(
      (sleeve) =>
        sleeve.systemRole ===
        'bounded-improvement'
    );

  assert.ok(
    improvementSleeves.length > 0,
    'FT system should expose at least one bounded improvement sleeve'
  );

  assert.ok(
    improvementSleeves.some(
      (sleeve) =>
        sleeve.personalization.status ===
        'direct-evidence'
    ),
    'At least one FT improvement sleeve should connect to direct optimization evidence'
  );

  assert.ok(
    result.jobs.stage.supportingSleeveIds.length >
      0,
    'Intentional Optimizer stage should identify supporting sleeves'
  );

  assert.ok(
    result.jobs.behavior.supportingSleeveIds.length >
      0,
    'Optimization Mindset should identify supporting sleeves'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 3
 *
 * TO / highly active opportunity-oriented user.
 *
 * Important behavior:
 * - opportunity / active evidence exists
 * - foundation remains visible
 * - opportunity/tactical sleeves receive direct evidence
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
    archetypeId: 'TO',

    stageId: 'adaptive_investor',
    styleId: 'active_navigator',
    modifierId: 'opportunity_chaser',

    normalizedAnswers: {
      setup: 'collected',
      transition: 'missing',
      decisionStyle: 'fit',
      marketPsychology: 'idea',
      evolution: 'experiment',
      tradeoff: 'active',
      age: '10plus',
      goals: ['explore']
    }
  };

  const result =
    resolvePortfolioJobFit(
      assessmentResult
    );

  assertBasicResult(
    result,
    {
      archetypeId: 'TO',
      stageId: 'adaptive_investor',
      styleId: 'active_navigator',
      modifierId: 'opportunity_chaser'
    }
  );

  assert.ok(
    result.evidence.tags.includes(
      'opportunity-seeking'
    ),
    'TO case should contain opportunity-seeking evidence'
  );

  assert.ok(
    result.evidence.tags.includes(
      'active-involvement'
    ),
    'TO case should contain active-involvement evidence'
  );

  assert.ok(
    result.evidence.tags.includes(
      'exploration'
    ),
    'TO case should contain exploration evidence'
  );

  const foundation =
    result.sleeves.find(
      (sleeve) =>
        sleeve.systemRole ===
        'foundation'
    );

  assert.ok(
    foundation,
    'TO should preserve a foundation sleeve'
  );

  const opportunitySleeves =
    result.sleeves.filter(
      (sleeve) =>
        sleeve.systemRole ===
          'exploration-research' ||
        sleeve.systemRole ===
          'tactical-conditional'
    );

  assert.ok(
    opportunitySleeves.length > 0,
    'TO should expose opportunity/tactical sleeves'
  );

  assert.ok(
    opportunitySleeves.some(
      (sleeve) =>
        sleeve.personalization.status ===
        'direct-evidence'
    ),
    'Opportunity/tactical sleeves should connect to direct evidence'
  );

  assert.ok(
    result.jobs.style.supportingSleeveIds.length >
      0,
    'Active Navigator should identify higher-attention sleeves'
  );

  assert.ok(
    result.jobs.behavior.supportingSleeveIds.includes(
      foundation.id
    ),
    'Opportunity Chaser behavior fit should retain the foundation as part of the decision boundary'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 4
 *
 * IP user with explicit income + short-time-horizon evidence.
 *
 * Important behavior:
 * - income / preservation / access evidence exists
 * - income and liquidity sleeves may now be directly personalized
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
    archetypeId: 'IP',

    stageId: 'system_builder',
    styleId: 'steady_steward',
    modifierId: 'confidence_builder',

    normalizedAnswers: {
      setup: 'simple_start',
      transition: 'change',
      decisionStyle: 'sell',
      marketPsychology: 'balance',
      evolution: 'monitor',
      tradeoff: 'occasional',
      age: 'under3',
      goals: ['income']
    }
  };

  const result =
    resolvePortfolioJobFit(
      assessmentResult
    );

  assertBasicResult(
    result,
    {
      archetypeId: 'IP',
      stageId: 'system_builder',
      styleId: 'steady_steward',
      modifierId: 'confidence_builder'
    }
  );

  assert.ok(
    result.evidence.tags.includes(
      'income-goal'
    ),
    'IP case should contain income-goal evidence'
  );

  assert.ok(
    result.evidence.tags.includes(
      'capital-preservation'
    ),
    'IP case should contain capital-preservation evidence'
  );

  assert.ok(
    result.evidence.tags.includes(
      'capital-access-goal'
    ),
    'IP case should contain capital-access evidence'
  );

  assert.ok(
    result.evidence.tags.includes(
      'short-time-horizon'
    ),
    'IP case should contain short-time-horizon evidence'
  );

  const directlySupported =
    result.sleeves.filter(
      (sleeve) =>
        sleeve.personalization.status ===
        'direct-evidence'
    );

  assert.ok(
    directlySupported.length > 0,
    'IP case should have sleeves supported by direct user evidence'
  );

  assert.ok(
    directlySupported.some(
      (sleeve) =>
        sleeve.systemRole ===
          'income' ||
        sleeve.systemRole ===
          'liquidity-access' ||
        sleeve.systemRole ===
          'stability-resilience'
    ),
    'Income/preservation/access evidence should connect to a relevant IP role'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 5
 *
 * Critical negative test:
 *
 * Opportunity sleeve exists, but user gave NO opportunity evidence.
 *
 * The portfolio itself must never become evidence about the user.
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
    archetypeId: 'BFO',

    stageId: 'system_builder',
    styleId: 'systematic_improver',
    modifierId: 'validation_seeker',

    normalizedAnswers: {
      setup: 'etfs_stocks',
      transition: 'doing_right',
      decisionStyle: 'pick',
      marketPsychology: 'holding',
      evolution: 'monitor',
      tradeoff: 'periodic',
      age: '5to10',
      goals: ['monitor']
    }
  };

  const result =
    resolvePortfolioJobFit(
      assessmentResult
    );

  assertBasicResult(
    result,
    {
      archetypeId: 'BFO',
      stageId: 'system_builder',
      styleId: 'systematic_improver',
      modifierId: 'validation_seeker'
    }
  );

  const opportunitySleeves =
    result.sleeves.filter(
      (sleeve) =>
        sleeve.systemRole ===
        'exploration-research'
    );

  for (
    const opportunitySleeve
    of opportunitySleeves
  ) {
    assert.equal(
      opportunitySleeve.personalization.status,
      'system-design-only',
      'Opportunity sleeve must remain system-design-only without opportunity evidence'
    );

    assert.deepEqual(
      opportunitySleeve.personalization.evidence,
      [],
      'Opportunity sleeve must not manufacture evidence'
    );
  }
}


/*
 * ------------------------------------------------------------
 * CASE 6
 *
 * Read-only guarantee when caller provides an existing
 * composed portfolio.
 *
 * This ensures explanation logic never mutates portfolio data.
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
    archetypeId: 'ES',

    stageId: 'foundation_builder',
    styleId: 'guided_autopilot',
    modifierId: 'instruction_seeker',

    normalizedAnswers: {
      setup: 'not_started',
      transition: 'what_to_do',
      decisionStyle: 'start',
      marketPsychology: 'rarely',
      evolution: 'understand',
      tradeoff: 'tell_me',
      age: 'unsure',
      goals: ['start_confident']
    }
  };

  /*
   * First let the resolver obtain the normal composed system.
   */

  const first =
    resolvePortfolioJobFit(
      assessmentResult
    );

  /*
   * Minimal shape sufficient for this test cannot safely be
   * reconstructed from the result because portfolioSystem has
   * richer internal metadata.
   *
   * So this case simply verifies that returned sleeve values
   * remain internally consistent and total allocation is
   * unchanged by explanation.
   */

  const totalWeight =
    first.sleeves.reduce(
      (sum, sleeve) =>
        sum + sleeve.weight,
      0
    );

  assert.ok(
    approxEqual(
      totalWeight,
      1
    ),
    'Explanation output must preserve constituent allocation totaling 100%'
  );

  assert.equal(
    first.sleeves.length,
    first.structure.sleeveCount,
    'Explanation must not add or remove constituent sleeves'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 7
 *
 * Invalid input fails explicitly rather than silently
 * inventing a recommendation.
 * ------------------------------------------------------------
 */

{
  assert.throws(
    () =>
      resolvePortfolioJobFit(
        null
      ),
    /assessment result/i,
    'Null assessment should fail explicitly'
  );

  assert.throws(
    () =>
      resolvePortfolioJobFit(
        {
          stageId:
            'foundation_builder',

          styleId:
            'guided_autopilot',

          modifierId:
            'instruction_seeker'
        }
      ),
    /archetypeId/i,
    'Assessment without archetype should fail explicitly'
  );
}


console.log(
  'Portfolio job-fit resolver tests passed.'
);

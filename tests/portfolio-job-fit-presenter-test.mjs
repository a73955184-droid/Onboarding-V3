import assert from 'node:assert/strict';

import {
  resolvePortfolioJobFit
} from '../src/domain/portfolio-system/portfolio-job-fit-resolver.js';

import {
  presentPortfolioJobFit
} from '../src/domain/portfolio-philosophy/portfolio-job-fit-presenter.js';


function findSleeve(presentation, sleeveId) {
  return presentation.sleeves.items.find(
    (sleeve) => sleeve.id === sleeveId
  );
}


/*
 * ============================================================
 * CASE 1
 * ES + simple / low-involvement profile
 *
 * Validates the most important presentation distinction:
 *
 * Broad Growth Core
 *   -> direct evidence
 *
 * Stability / Liquidity
 *   -> system-design-only
 * ============================================================
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

  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const presentation =
    presentPortfolioJobFit(
      fitResult
    );


  /*
   * Screen contract
   */

  assert.equal(
    presentation.screen.id,
    'portfolio-system-fit',
    'Unexpected screen ID'
  );

  assert.ok(
    presentation.screen.title,
    'Screen should have a title'
  );


  /*
   * Evidence should be intentionally compressed.
   */

  assert.ok(
    Array.isArray(
      presentation.evidence.items
    ),
    'Evidence items should be an array'
  );

  assert.ok(
    presentation.evidence.items.length > 0,
    'Expected some user evidence'
  );

  assert.ok(
    presentation.evidence.items.length <= 4,
    'Default top-level evidence should be capped at 4 items'
  );


  /*
   * Canonical JTBD must survive presentation.
   */

  assert.equal(
    presentation.jobs.stage.title,
    'Start with a clear structure',
    'Stage JTBD title should be preserved'
  );

  assert.equal(
    presentation.jobs.style.title,
    'Keep routine decisions simple',
    'Style JTBD title should be preserved'
  );

  assert.equal(
    presentation.jobs.behavior.title,
    'Know the next step',
    'Behavior JTBD title should be preserved'
  );

  assert.ok(
    presentation.jobs.stage.portfolioRequirement,
    'Stage portfolio requirement should be present'
  );

  assert.ok(
    presentation.jobs.stage.systemFit,
    'Stage system-fit explanation should be present'
  );


  /*
   * Philosophy presentation
   */

  assert.equal(
    presentation.philosophy.archetype.id,
    'ES',
    'Expected ES archetype'
  );

  assert.ok(
    presentation.philosophy.archetype.title,
    'Archetype philosophy title should exist'
  );

  assert.ok(
    presentation.philosophy.archetype.summary,
    'Archetype philosophy summary should exist'
  );

  assert.ok(
    presentation.philosophy.variant.id,
    'Variant ID should exist'
  );

  assert.ok(
    presentation.philosophy.variant.title,
    'Variant philosophy title should exist'
  );


  /*
   * Structure
   */

  assert.equal(
    presentation.structure.sleeveCount,
    3,
    'ES Essential should present 3 sleeves for this resolved case'
  );

  assert.equal(
    presentation.structure.lowEffortPercent,
    100,
    'ES Essential should present 100% low/very-low effort'
  );


  /*
   * Broad Growth Core
   */

  const growth =
    findSleeve(
      presentation,
      'broadGrowthCore'
    );

  assert.ok(
    growth,
    'Broad Growth Core should be presented'
  );

  assert.equal(
    growth.weightPercent,
    70,
    'Broad Growth Core should display 70%'
  );

  assert.equal(
    growth.role.label,
    'Foundation',
    'Foundation role should be translated for UI'
  );

  assert.ok(
    growth.whyItExists,
    'Growth sleeve should explain why it exists'
  );

  assert.ok(
    growth.contributionToSystem,
    'Growth sleeve should explain its system contribution'
  );

  assert.equal(
    growth.userFit.type,
    'direct-evidence',
    'Growth should retain direct-evidence status'
  );

  assert.ok(
    growth.userFit.evidence.length > 0,
    'Growth direct evidence should be presented'
  );

  assert.ok(
    growth.userFit.evidence.length <= 3,
    'Sleeve evidence should be capped at 3 items'
  );


  /*
   * Stability
   */

  const stability =
    findSleeve(
      presentation,
      'stability'
    );

  assert.ok(
    stability,
    'Stability sleeve should be presented'
  );

  assert.equal(
    stability.role.label,
    'Stability & resilience',
    'Stability role should have readable label'
  );

  assert.equal(
    stability.userFit.type,
    'system-design-only',
    'Stability must remain system-design-only without quiz evidence'
  );

  assert.deepEqual(
    stability.userFit.evidence,
    [],
    'Stability should not manufacture user evidence'
  );

  assert.ok(
    stability.userFit.explanation,
    'System-design-only sleeve should explain that distinction'
  );


  /*
   * Liquidity
   */

  const liquidity =
    findSleeve(
      presentation,
      'liquidity'
    );

  assert.ok(
    liquidity,
    'Liquidity sleeve should be presented'
  );

  assert.equal(
    liquidity.weightPercent,
    10,
    'Liquidity should display 10%'
  );

  assert.equal(
    liquidity.role.label,
    'Liquidity & access',
    'Liquidity role should have readable label'
  );

  assert.equal(
    liquidity.userFit.type,
    'system-design-only',
    'Liquidity must not appear personalized without evidence'
  );

  assert.deepEqual(
    liquidity.userFit.evidence,
    [],
    'Liquidity should have no manufactured evidence'
  );

  assert.ok(
    liquidity.userFit.explanation.includes(
      'portfolio system design'
    ),
    'Liquidity explanation should preserve the system-design distinction'
  );


  /*
   * Existing operating metadata survives presentation.
   */

  assert.equal(
    growth.operatingProfile.effortLabel,
    'Low effort',
    'Effort should receive readable presentation label'
  );

  assert.equal(
    growth.operatingProfile.reviewCadenceLabel,
    'Annual review',
    'Review cadence should receive readable presentation label'
  );

  assert.equal(
    liquidity.operatingProfile.effortLabel,
    'Very low effort',
    'Very-low effort should receive readable label'
  );

  assert.equal(
    liquidity.operatingProfile.reviewCadenceLabel,
    'Review as needs change',
    'Needs-driven cadence should receive readable label'
  );
}


/*
 * ============================================================
 * CASE 2
 * Evidence-limit option
 *
 * Presenter should control display density without modifying
 * underlying evidence.
 * ============================================================
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

  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const presentation =
    presentPortfolioJobFit(
      fitResult,
      {
        evidenceLimit: 2
      }
    );

  assert.equal(
    presentation.evidence.items.length,
    2,
    'Custom evidence limit should be respected'
  );
}


/*
 * ============================================================
 * CASE 3
 * FT optimizer
 *
 * Improvement sleeve should remain explicitly bounded and
 * evidence-backed.
 * ============================================================
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

  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const presentation =
    presentPortfolioJobFit(
      fitResult
    );

  assert.equal(
    presentation.philosophy.archetype.id,
    'FT',
    'Expected FT archetype'
  );

  assert.equal(
    presentation.jobs.stage.title,
    'Improve what already works',
    'Intentional Optimizer canonical JTBD should survive presentation'
  );

  assert.equal(
    presentation.jobs.style.title,
    'Compare choices with a clear rule',
    'Systematic Improver canonical JTBD should survive presentation'
  );

  assert.equal(
    presentation.jobs.behavior.title,
    'Improve with a stopping rule',
    'Optimization Mindset canonical JTBD should survive presentation'
  );

  const improvementSleeves =
    presentation.sleeves.items.filter(
      (sleeve) =>
        sleeve.role.id ===
        'bounded-improvement'
    );

  assert.ok(
    improvementSleeves.length > 0,
    'FT should present a bounded-improvement role'
  );

  assert.ok(
    improvementSleeves.some(
      (sleeve) =>
        sleeve.userFit.type ===
        'direct-evidence'
    ),
    'At least one FT improvement sleeve should retain direct evidence'
  );

  for (
    const improvement
    of improvementSleeves
  ) {
    assert.ok(
      improvement.whyItExists,
      'Improvement sleeve should explain its portfolio-philosophy rationale'
    );

    assert.ok(
      improvement.contributionToSystem,
      'Improvement sleeve should explain its contribution to the whole system'
    );
  }
}


/*
 * ============================================================
 * CASE 4
 * TO active/opportunity profile
 *
 * Presenter must preserve the distinction between permanent
 * foundation and bounded active roles.
 * ============================================================
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

  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const presentation =
    presentPortfolioJobFit(
      fitResult
    );

  assert.equal(
    presentation.philosophy.archetype.id,
    'TO',
    'Expected TO archetype'
  );

  const foundation =
    presentation.sleeves.items.find(
      (sleeve) =>
        sleeve.role.id ===
        'foundation'
    );

  assert.ok(
    foundation,
    'TO presentation should retain a foundation role'
  );

  const activeSleeves =
    presentation.sleeves.items.filter(
      (sleeve) =>
        sleeve.role.id ===
          'tactical-conditional' ||
        sleeve.role.id ===
          'exploration-research'
    );

  assert.ok(
    activeSleeves.length > 0,
    'TO should present bounded active roles'
  );

  assert.ok(
    activeSleeves.some(
      (sleeve) =>
        sleeve.userFit.type ===
        'direct-evidence'
    ),
    'TO active roles should retain relevant direct quiz evidence'
  );

  assert.ok(
    presentation.jobs.behavior.systemFit,
    'Opportunity Chaser decision explanation should exist'
  );
}


/*
 * ============================================================
 * CASE 5
 * IP with explicit income / access evidence
 *
 * Unlike ES liquidity above, IP roles should be allowed to
 * surface direct evidence when the user actually supplied it.
 * ============================================================
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

  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const presentation =
    presentPortfolioJobFit(
      fitResult
    );

  assert.equal(
    presentation.philosophy.archetype.id,
    'IP',
    'Expected IP archetype'
  );

  const directlySupported =
    presentation.sleeves.items.filter(
      (sleeve) =>
        sleeve.userFit.type ===
        'direct-evidence'
    );

  assert.ok(
    directlySupported.length > 0,
    'IP should expose direct-evidence portfolio roles'
  );

  assert.ok(
    directlySupported.some(
      (sleeve) =>
        sleeve.role.id ===
          'income' ||
        sleeve.role.id ===
          'liquidity-access' ||
        sleeve.role.id ===
          'stability-resilience'
    ),
    'Income/access/preservation evidence should connect to an appropriate IP role'
  );

  for (
    const sleeve
    of directlySupported
  ) {
    assert.ok(
      sleeve.userFit.evidence.length > 0,
      'Direct-evidence presentation must retain evidence'
    );
  }
}


/*
 * ============================================================
 * CASE 6
 * Critical negative test
 *
 * A portfolio may contain an opportunity sleeve without the
 * user ever expressing opportunity interest.
 *
 * Presentation must preserve system-design-only.
 * ============================================================
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

  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const presentation =
    presentPortfolioJobFit(
      fitResult
    );

  const opportunitySleeves =
    presentation.sleeves.items.filter(
      (sleeve) =>
        sleeve.role.id ===
        'exploration-research'
    );

  for (
    const opportunity
    of opportunitySleeves
  ) {
    assert.equal(
      opportunity.userFit.type,
      'system-design-only',
      'Opportunity role must not become personalized without evidence'
    );

    assert.deepEqual(
      opportunity.userFit.evidence,
      [],
      'Opportunity role must not manufacture quiz evidence'
    );
  }
}


/*
 * ============================================================
 * CASE 7
 * Source metadata survives presentation
 * ============================================================
 */

{
  const assessmentResult = {
    archetypeId: 'ES',

    stageId: 'foundation_builder',
    styleId: 'guided_autopilot',
    modifierId: 'instruction_seeker',

    normalizedAnswers: {
      setup: 'not_started',
      marketPsychology: 'rarely',
      tradeoff: 'tell_me'
    }
  };

  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const presentation =
    presentPortfolioJobFit(
      fitResult
    );

  assert.ok(
    presentation.philosophy.archetype.sources.length > 0,
    'Archetype philosophy should retain source metadata'
  );

  for (
    const source
    of presentation.philosophy.archetype.sources
  ) {
    assert.ok(
      source.organization,
      'Source should retain organization'
    );

    assert.ok(
      source.title,
      'Source should retain title'
    );

    assert.ok(
      source.url,
      'Source should retain URL'
    );
  }

  const growth =
    findSleeve(
      presentation,
      'broadGrowthCore'
    );

  assert.ok(
    growth.sources.length > 0,
    'Sleeve philosophy should retain source metadata'
  );
}


/*
 * ============================================================
 * CASE 8
 * Invalid input should fail explicitly
 * ============================================================
 */

{
  assert.throws(
    () =>
      presentPortfolioJobFit(
        null
      ),
    /portfolio job-fit result/i,
    'Null fit result should fail explicitly'
  );
}


/*
 * ============================================================
 * CASE 9
 * Presenter is presentation-only
 *
 * It must not mutate the domain result.
 * ============================================================
 */

{
  const assessmentResult = {
    archetypeId: 'ES',

    stageId: 'foundation_builder',
    styleId: 'guided_autopilot',
    modifierId: 'instruction_seeker',

    normalizedAnswers: {
      setup: 'not_started',
      marketPsychology: 'rarely',
      tradeoff: 'tell_me'
    }
  };

  const fitResult =
    resolvePortfolioJobFit(
      assessmentResult
    );

  const before =
    JSON.stringify(
      fitResult
    );

  presentPortfolioJobFit(
    fitResult
  );

  const after =
    JSON.stringify(
      fitResult
    );

  assert.equal(
    after,
    before,
    'Presenter must not mutate the portfolio-job-fit result'
  );
}


console.log(
  'Portfolio job-fit presenter tests passed.'
);

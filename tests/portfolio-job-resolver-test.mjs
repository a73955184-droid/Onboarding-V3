import assert from 'node:assert';
import {
  STAGE_PORTFOLIO_JOBS,
  STYLE_PORTFOLIO_JOBS,
  BEHAVIOR_PORTFOLIO_JOBS
} from '../src/domain/portfolio-jobs/investor-portfolio-jobs.js';
import { PORTFOLIO_ARCHETYPES } from '../src/domain/portfolio-system/portfolio-archetypes.js';
import { VARIANT_JOB_SUPPORT } from '../src/domain/portfolio-jobs/portfolio-job-support.js';
import { resolvePortfolioJobImplications } from '../src/domain/portfolio-jobs/portfolio-job-resolver.js';

const sampleRequest = {
  stageId: 'foundation_builder',
  styleId: 'steady_steward',
  modifierId: 'confidence_builder',
  archetypeId: 'BFO',
  portfolioSystem: {
    system: {
      systemName: PORTFOLIO_ARCHETYPES.BFO.systemName
    },
    profileVariantId: 'essential'
  }
};

function assertSection(section, expectedJobMap) {
  assert(section, 'Expected section result');
  assert(section.job, 'Expected section to include job data');
  assert.strictEqual(typeof section.implication, 'string');
  assert(section.implication.length > 0, 'Expected non-empty implication text');
  assert(Array.isArray(section.support.details), 'Expected support details array');
  assert(section.support.details.length > 0, 'Expected at least one support detail');
  assert.strictEqual(section.job.jobType, expectedJobMap[section.sourceId]?.jobType || section.job.jobType);
}

const stageIds = Object.keys(STAGE_PORTFOLIO_JOBS);
for (const stageId of stageIds) {
  const result = resolvePortfolioJobImplications({
    ...sampleRequest,
    stageId
  });
  assert(result.stage, `Expected resolver output for stageId ${stageId}`);
  assertSection(result.stage, STAGE_PORTFOLIO_JOBS);
}

const styleIds = Object.keys(STYLE_PORTFOLIO_JOBS);
for (const styleId of styleIds) {
  const result = resolvePortfolioJobImplications({
    ...sampleRequest,
    styleId
  });
  assert(result.style, `Expected resolver output for styleId ${styleId}`);
  assertSection(result.style, STYLE_PORTFOLIO_JOBS);
}

const modifierIds = Object.keys(BEHAVIOR_PORTFOLIO_JOBS);
for (const modifierId of modifierIds) {
  const result = resolvePortfolioJobImplications({
    ...sampleRequest,
    modifierId
  });
  assert(result.modifier, `Expected resolver output for modifierId ${modifierId}`);
  assertSection(result.modifier, BEHAVIOR_PORTFOLIO_JOBS);
}

const archetypeIds = Object.keys(PORTFOLIO_ARCHETYPES);
for (const archetypeId of archetypeIds) {
  const result = resolvePortfolioJobImplications({
    ...sampleRequest,
    archetypeId
  });
  assert(result.stage, `Expected stage output for archetypeId ${archetypeId}`);
  assert(result.style, `Expected style output for archetypeId ${archetypeId}`);
  assert(result.modifier, `Expected modifier output for archetypeId ${archetypeId}`);
  assert(result.stage.support.details.length > 0, `Expected stage support details for ${archetypeId}`);
}

const variantIds = Object.keys(VARIANT_JOB_SUPPORT);
for (const variantId of variantIds) {
  const result = resolvePortfolioJobImplications({
    ...sampleRequest,
    portfolioSystem: {
      system: {
        systemName: PORTFOLIO_ARCHETYPES.BFO.systemName
      },
      profileVariantId: variantId
    }
  });
  assert(result.stage.support.details.length > 0, `Expected variant support details for ${variantId}`);
  assert(result.style.support.details.length > 0, `Expected variant support details for ${variantId}`);
  assert(result.modifier.support.details.length > 0, `Expected variant support details for ${variantId}`);
}

const fallbackResult = resolvePortfolioJobImplications({
  stageId: 'foundation_builder',
  styleId: 'steady_steward',
  modifierId: 'confidence_builder',
  archetypeId: 'UNKNOWN',
  portfolioSystem: {
    system: {
      systemName: 'Unknown Portfolio'
    },
    profileVariantId: 'essential'
  }
});
assert(fallbackResult.stage, 'Fallback stage should be present');
assert(fallbackResult.stage.implication.length > 0, 'Fallback implication should still be returned');

console.log('Portfolio job resolver test passed.');

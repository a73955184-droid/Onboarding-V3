import {
  STAGE_PORTFOLIO_JOBS,
  STYLE_PORTFOLIO_JOBS,
  BEHAVIOR_PORTFOLIO_JOBS
} from './investor-portfolio-jobs.js';
import {
  getArchetypeJobSupport,
  getVariantJobSupport
} from './portfolio-job-support.js';

const SUPPORT_KEYS = {
  stage: 'evolutionSupport',
  style: 'interactionSupport',
  modifier: 'decisionSupport'
};

const FALLBACK_JOB = {
  id: 'unknown',
  title: 'Portfolio support',
  description:
    'The recommended portfolio is intended to support this part of your profile even when specific domain details are unavailable.',
  intent:
    'Help you move forward with the existing recommendation by keeping the portfolio aligned with its core design.'
};

const FALLBACK_SUPPORT = {
  details: [
    'Portfolio support details are unavailable, but the recommendation still reflects your resolved profile and portfolio structure.'
  ]
};

function getJobDefinition(category, sourceId) {
  const jobMap =
    category === 'stage'
      ? STAGE_PORTFOLIO_JOBS
      : category === 'style'
      ? STYLE_PORTFOLIO_JOBS
      : BEHAVIOR_PORTFOLIO_JOBS;

  return jobMap[sourceId] || FALLBACK_JOB;
}

function buildSectionSupport(category, archetypeSupport, variantSupport) {
  const archetypeSection = archetypeSupport?.[SUPPORT_KEYS[category]] || null;

  return {
    archetype: archetypeSection,
    variant: variantSupport || null,
    details: buildSupportDetails(category, archetypeSection, variantSupport)
  };
}

function buildSupportDetails(category, archetypeSection, variantSupport) {
  const details = [];

  if (archetypeSection?.description) {
    details.push(archetypeSection.description);
  }

  if (Array.isArray(archetypeSection?.details)) {
    details.push(...archetypeSection.details);
  }

  if (variantSupport?.summary) {
    details.push(variantSupport.summary);
  }

  return details.length ? details : FALLBACK_SUPPORT.details;
}

function buildStageImplication(job, archetypeSupport, variantSupport, assessmentResult) {
  if (!job || !archetypeSupport || !variantSupport) {
    return FALLBACK_SUPPORT.details[0];
  }

  const portfolioName = assessmentResult?.portfolioSystem?.system?.systemName || archetypeSupport.systemName;

  return `Your recommended ${portfolioName} helps ${job.intent.toLowerCase()} by keeping the portfolio’s required roles stable while allowing the right parts of the system to evolve in a controlled way. It does this using the archetype’s core rule — ${archetypeSupport.invariant} — and the ${variantSupport.structureLevel} variant expression of the plan.`;
}

function buildStyleImplication(job, archetypeSupport, variantSupport) {
  if (!job || !archetypeSupport || !variantSupport) {
    return FALLBACK_SUPPORT.details[0];
  }

  return `This portfolio should surface review items according to your ${job.title.toLowerCase()} preference: focus on the most meaningful sleeve roles, keep routine activity quiet, and pay attention only when changes matter to the archetype’s intended balance. The ${variantSupport.reviewGranularity} review style helps the system show the right level of detail without creating unnecessary noise.`;
}

function buildBehaviorImplication(job, archetypeSupport, variantSupport) {
  if (!job || !archetypeSupport || !variantSupport) {
    return FALLBACK_SUPPORT.details[0];
  }

  return `When the system surfaces a review signal, it should help you decide by comparing the change against the portfolio’s structure and the archetype’s invariant. That means checking whether the move fits the plan, whether it is still within the stable core, and whether it truly warrants action instead of leaving it alone or reviewing it further.`;
}

function createSectionEntry(category, assessmentResult) {
  const sourceId = assessmentResult?.[`${category}Id`];
  const job = getJobDefinition(category, sourceId);
  const archetypeSupport = getArchetypeJobSupport(assessmentResult?.archetypeId);
  const variantSupport = getVariantJobSupport(
    assessmentResult?.portfolioSystem?.profileVariantId || assessmentResult?.variantId,
  );

  return {
    sourceId,
    jobType: job.jobType,
    job,
    support: buildSectionSupport(category, archetypeSupport, variantSupport),
    implication:
      category === 'stage'
        ? buildStageImplication(job, archetypeSupport, variantSupport, assessmentResult)
        : category === 'style'
        ? buildStyleImplication(job, archetypeSupport, variantSupport)
        : buildBehaviorImplication(job, archetypeSupport, variantSupport)
  };
}

export function resolvePortfolioJobImplications(assessmentResult) {
  if (!assessmentResult) {
    return {
      stage: null,
      style: null,
      modifier: null
    };
  }

  return {
    stage: createSectionEntry('stage', assessmentResult),
    style: createSectionEntry('style', assessmentResult),
    modifier: createSectionEntry('modifier', assessmentResult)
  };
}

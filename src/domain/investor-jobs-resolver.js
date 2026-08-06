import {
  INVESTOR_JOB_CATALOG,
  JOB_SOURCE_MAP,
  JOB_EVIDENCE_KEYS,
  ARCHETYPE_FIT_PHRASES,
  ARCHETYPE_DISPLAY_NAMES,
  getQuestionLabel,
  getQuestionOptionLabel
} from './investor-jobs.js';

function normalizeSelectedOptionIds(answer) {
  if (answer == null) {
    return [];
  }

  if (typeof answer === 'string') {
    const trimmed = answer.trim();
    return trimmed ? [trimmed] : [];
  }

  if (Array.isArray(answer)) {
    return answer
      .map((item) => (typeof item === 'string' ? item.trim() : null))
      .filter(Boolean);
  }

  if (typeof answer === 'object') {
    if (Array.isArray(answer.selectedOptionIds)) {
      return answer.selectedOptionIds.filter((value) => typeof value === 'string');
    }

    if (typeof answer.optionId === 'string') {
      return [answer.optionId];
    }

    if (typeof answer.selectedOptionId === 'string') {
      return [answer.selectedOptionId];
    }

    if (Array.isArray(answer.optionIds)) {
      return normalizeSelectedOptionIds(answer.optionIds);
    }

    if (Array.isArray(answer.value)) {
      return normalizeSelectedOptionIds(answer.value);
    }

    if (typeof answer.value === 'string') {
      return normalizeSelectedOptionIds(answer.value);
    }
  }

  return [];
}

function buildAnswerEvidence(normalizedAnswers, keys) {
  const evidence = [];

  for (const key of keys || []) {
    const selectedIds = normalizeSelectedOptionIds(normalizedAnswers?.[key]);

    if (!selectedIds.length) {
      continue;
    }

    const labels = selectedIds
      .map((id) => getQuestionOptionLabel(key, id))
      .filter(Boolean);

    if (!labels.length) {
      continue;
    }

    evidence.push(`${getQuestionLabel(key)}: ${labels.join(' · ')}`);
  }

  if (!evidence.length) {
    evidence.push('Your answers support this job through the profile you selected.');
  }

  return evidence;
}

function resolveJobIds(assessmentResult) {
  const stageJobId = JOB_SOURCE_MAP.stage[assessmentResult.stageId];
  const styleJobId = JOB_SOURCE_MAP.style[assessmentResult.styleId];
  const modifierJobId = JOB_SOURCE_MAP.modifier[assessmentResult.modifierId];

  return [stageJobId, styleJobId, modifierJobId].filter(Boolean);
}

function formatArchetypeConnection(archetypeId) {
  const archetypePhrase = ARCHETYPE_FIT_PHRASES[archetypeId];
  const archetypeName = ARCHETYPE_DISPLAY_NAMES[archetypeId] || archetypeId;

  if (!archetypePhrase) {
    return `This job supports the recommended ${archetypeName} archetype.`;
  }

  return `This job supports the recommended ${archetypeName} archetype by helping the portfolio ${archetypePhrase}`;
}

export function resolveInvestorJobs(assessmentResult) {
  if (!assessmentResult) {
    return [];
  }

  const selectedJobIds = resolveJobIds(assessmentResult);
  const uniqueJobIds = [...new Set(selectedJobIds)];

  return uniqueJobIds.slice(0, 3).map((jobId) => {
    const job = INVESTOR_JOB_CATALOG[jobId];

    if (!job) {
      return null;
    }

    return {
      id: job.id,
      title: job.title,
      description: job.description,
      answerEvidence: buildAnswerEvidence(
        assessmentResult.normalizedAnswers,
        JOB_EVIDENCE_KEYS[job.id]
      ),
      portfolioDesignImplication: `${job.portfolioDesignImplication} ${formatArchetypeConnection(
        assessmentResult.archetypeId
      )}`
    };
  }).filter(Boolean);
}

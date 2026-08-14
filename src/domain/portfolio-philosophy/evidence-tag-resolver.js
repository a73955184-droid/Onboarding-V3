import { EVIDENCE_TAGS } from './philosophy-constants.js';

export function resolveEvidenceTags(assessmentResult = {}) {
  const tags = new Set();
  const evidenceByTag = {};

  const answers =
    assessmentResult.normalizedAnswers ??
    assessmentResult.answers ??
    {};

  function add(tag, evidence) {
    tags.add(tag);

    if (!evidenceByTag[tag]) {
      evidenceByTag[tag] = [];
    }

    evidenceByTag[tag].push(evidence);
  }

  // Add only mappings you can trace directly
  // to actual answer IDs in the current assessment payload.

  return {
    tags: [...tags],
    evidenceByTag
  };
}

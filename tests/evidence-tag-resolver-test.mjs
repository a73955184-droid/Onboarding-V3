import assert from 'node:assert/strict';

import {
  resolveEvidenceTags,
  hasEvidenceTag,
  getEvidenceForTag
} from '../src/domain/portfolio-philosophy/evidence-tag-resolver.js';

import {
  EVIDENCE_TAGS
} from '../src/domain/portfolio-philosophy/philosophy-constants.js';


/*
 * ------------------------------------------------------------
 * CASE 1
 * Guided / simple / low-involvement pattern
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
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
    resolveEvidenceTags(
      assessmentResult
    );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.SIMPLICITY
    ),
    'Case 1 should resolve SIMPLICITY'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.LOW_INVOLVEMENT
    ),
    'Case 1 should resolve LOW_INVOLVEMENT'
  );

  assert.equal(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.OPPORTUNITY_SEEKING
    ),
    false,
    'Case 1 should not resolve OPPORTUNITY_SEEKING'
  );

  assert.equal(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.INCOME_GOAL
    ),
    false,
    'Case 1 should not resolve INCOME_GOAL'
  );

  const simplicityEvidence =
    getEvidenceForTag(
      result,
      EVIDENCE_TAGS.SIMPLICITY
    );

  assert.ok(
    simplicityEvidence.length > 0,
    'Case 1 should retain traceable evidence for SIMPLICITY'
  );

  assert.ok(
    simplicityEvidence.some(
      (item) =>
        item.questionId === 'setup' &&
        item.optionId === 'not_started'
    ),
    'Case 1 should trace SIMPLICITY back to setup/not_started'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 2
 * Research / optimization pattern
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
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
    resolveEvidenceTags(
      assessmentResult
    );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.COMPARE_ALTERNATIVES
    ),
    'Case 2 should resolve COMPARE_ALTERNATIVES'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.OPTIMIZATION
    ),
    'Case 2 should resolve OPTIMIZATION'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.RESEARCH_EFFORT
    ),
    'Case 2 should resolve RESEARCH_EFFORT'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.REPEATABLE_FRAMEWORK
    ),
    'Case 2 should resolve REPEATABLE_FRAMEWORK'
  );

  assert.equal(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.LOW_INVOLVEMENT
    ),
    false,
    'Case 2 should not resolve LOW_INVOLVEMENT'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 3
 * Exploration / active involvement pattern
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
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
    resolveEvidenceTags(
      assessmentResult
    );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.EXPLORATION
    ),
    'Case 3 should resolve EXPLORATION'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.OPPORTUNITY_SEEKING
    ),
    'Case 3 should resolve OPPORTUNITY_SEEKING'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.ACTIVE_INVOLVEMENT
    ),
    'Case 3 should resolve ACTIVE_INVOLVEMENT'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.RESEARCH_EFFORT
    ),
    'Case 3 should resolve RESEARCH_EFFORT'
  );

  const opportunityEvidence =
    getEvidenceForTag(
      result,
      EVIDENCE_TAGS.OPPORTUNITY_SEEKING
    );

  assert.ok(
    opportunityEvidence.some(
      (item) =>
        item.questionId ===
          'marketPsychology' &&
        item.optionId === 'idea'
    ),
    'Case 3 should trace OPPORTUNITY_SEEKING to marketPsychology/idea'
  );

  assert.ok(
    opportunityEvidence.some(
      (item) =>
        item.questionId ===
          'tradeoff' &&
        item.optionId === 'active'
    ),
    'Case 3 should trace OPPORTUNITY_SEEKING to tradeoff/active'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 4
 * Income / preservation / access evidence
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
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
    resolveEvidenceTags(
      assessmentResult
    );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.INCOME_GOAL
    ),
    'Case 4 should resolve INCOME_GOAL'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.CAPITAL_PRESERVATION
    ),
    'Case 4 should resolve CAPITAL_PRESERVATION'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
    ),
    'Case 4 should resolve CAPITAL_ACCESS_GOAL'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.SHORT_TIME_HORIZON
    ),
    'Case 4 should resolve SHORT_TIME_HORIZON'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.VOLATILITY_CONCERN
    ),
    'Case 4 should resolve VOLATILITY_CONCERN'
  );

  const incomeEvidence =
    getEvidenceForTag(
      result,
      EVIDENCE_TAGS.INCOME_GOAL
    );

  assert.deepEqual(
    incomeEvidence.map(
      (item) => item.optionId
    ),
    ['income'],
    'Case 4 INCOME_GOAL should come only from goals/income'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 5
 * Multi-select goal handling
 * ------------------------------------------------------------
 */

{
  const assessmentResult = {
    normalizedAnswers: {
      goals: [
        'monitor',
        'explore'
      ]
    }
  };

  const result =
    resolveEvidenceTags(
      assessmentResult
    );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.EXPLORATION
    ),
    'Case 5 should resolve EXPLORATION from second selected goal'
  );

  assert.ok(
    hasEvidenceTag(
      result,
      EVIDENCE_TAGS.OPPORTUNITY_SEEKING
    ),
    'Case 5 should resolve OPPORTUNITY_SEEKING from goals/explore'
  );

  assert.equal(
    result.selectedAnswers.length,
    2,
    'Case 5 should preserve both selected goals'
  );
}


/*
 * ------------------------------------------------------------
 * CASE 6
 * Empty / missing assessment must fail safely
 * ------------------------------------------------------------
 */

{
  const result =
    resolveEvidenceTags({});

  assert.deepEqual(
    result.tags,
    [],
    'Empty assessment should return no evidence tags'
  );

  assert.deepEqual(
    result.evidenceByTag,
    {},
    'Empty assessment should return empty evidenceByTag'
  );

  assert.deepEqual(
    result.selectedAnswers,
    [],
    'Empty assessment should return no selected answers'
  );
}


console.log(
  'Evidence tag resolver tests passed.'
);

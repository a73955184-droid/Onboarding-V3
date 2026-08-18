import assert from 'node:assert/strict';

import {
  QUESTIONS
} from '../src/content/questions.js';

import {
  getInvestorNeedTraceability
} from '../src/content/investor-need-traceability-copy.js';

import {
  QUIZ_ANSWER_EXPLAINABILITY_COPY,
  getQuizAnswerExplainabilityCopy
} from '../src/content/quiz-answer-explainability-copy.js';

import {
  assessAnswers
} from '../src/domain/assessment-engine.js';

import {
  resolveRecommendationExplainability
} from '../src/domain/recommendation-explainability-resolver.js';

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
  renderRecommendationExplainability
} from '../src/features/recommendation/PortfolioSystemFitScreen.js';


const FIXTURES = Object.freeze({
  ES: Object.freeze({
    expectedVariant: 'essential',
    answers: Object.freeze({
      setup: ['not_started'],
      transition: ['what_to_do'],
      decisionStyle: ['start'],
      marketPsychology: ['balance'],
      evolution: ['understand'],
      tradeoff: ['tell_me'],
      age: ['under3'],
      goals: ['start_confident']
    })
  }),
  GD: Object.freeze({
    expectedVariant: 'intentional',
    answers: Object.freeze({
      setup: ['simple_start'],
      transition: ['doing_right'],
      decisionStyle: ['pick'],
      marketPsychology: ['market'],
      evolution: ['monitor'],
      tradeoff: ['occasional'],
      age: ['10plus'],
      goals: ['monitor']
    })
  }),
  FT: Object.freeze({
    expectedVariant: 'intentional',
    answers: Object.freeze({
      setup: ['established'],
      transition: ['compare'],
      decisionStyle: ['enough'],
      marketPsychology: ['holding'],
      evolution: ['effort'],
      tradeoff: ['periodic'],
      age: ['10plus'],
      goals: ['choose']
    })
  }),
  BFO: Object.freeze({
    expectedVariant: 'intentional',
    answers: Object.freeze({
      setup: ['simple_start'],
      transition: ['doing_right'],
      decisionStyle: ['sell'],
      marketPsychology: ['balance'],
      evolution: ['frequency'],
      tradeoff: ['periodic'],
      age: ['multiple'],
      goals: ['understand']
    })
  }),
  GA: Object.freeze({
    expectedVariant: 'intentional',
    answers: Object.freeze({
      setup: ['collected'],
      transition: ['missing'],
      decisionStyle: ['fit'],
      marketPsychology: ['idea'],
      evolution: ['experiment'],
      tradeoff: ['explore'],
      age: ['10plus'],
      goals: ['explore']
    })
  }),
  TO: Object.freeze({
    expectedVariant: 'intentional',
    answers: Object.freeze({
      setup: ['not_started'],
      transition: ['what_to_do'],
      decisionStyle: ['sell'],
      marketPsychology: ['holding'],
      evolution: ['effort'],
      tradeoff: ['active'],
      age: ['under3'],
      goals: ['explore']
    })
  }),
  IP: Object.freeze({
    expectedVariant: 'essential',
    answers: Object.freeze({
      setup: ['not_started'],
      transition: ['what_to_do'],
      decisionStyle: ['pick'],
      marketPsychology: ['market'],
      evolution: ['effort'],
      tradeoff: ['active'],
      age: ['under3'],
      goals: ['income']
    })
  })
});


function recommendationSnapshot(
  result
) {
  return JSON.stringify({
    archetypeId:
      result.archetypeId,
    secondaryArchetypeId:
      result.secondaryArchetypeId,
    stageId:
      result.stageId,
    styleId:
      result.styleId,
    modifierId:
      result.modifierId,
    scores:
      result.scores,
    variantId:
      result
        .portfolioSystem
        .profileVariantId,
    system:
      result
        .portfolioSystem
        .system,
    sleeves:
      result
        .portfolioSystem
        .sleeves
  });
}


for (const [
  expectedArchetype,
  fixture
] of Object.entries(FIXTURES)) {
  const result =
    assessAnswers(
      fixture.answers
    );

  assert.equal(
    result.archetypeId,
    expectedArchetype,
    `${expectedArchetype} fixture preserves its archetype result`
  );

  assert.equal(
    result
      .portfolioSystem
      .profileVariantId,
    fixture.expectedVariant,
    `${expectedArchetype} fixture preserves its variant result`
  );

  const before =
    recommendationSnapshot(
      result
    );

  const explainability =
    resolveRecommendationExplainability(
      result,
      result.portfolioSystem
    );

  assert.equal(
    recommendationSnapshot(result),
    before,
    `${expectedArchetype} explainability is a read-only projection`
  );

  assert.equal(
    explainability.finalArchetypeId,
    expectedArchetype
  );

  assert.equal(
    explainability.finalVariantId,
    fixture.expectedVariant
  );
}


let answerCount = 0;

for (const question of QUESTIONS) {
  const copyGroup =
    QUIZ_ANSWER_EXPLAINABILITY_COPY
      [question.screenKey];

  assert.ok(
    copyGroup,
    `${question.screenKey} has an explainability copy group`
  );

  assert.deepEqual(
    Object.keys(copyGroup).sort(),
    question.options
      .map((option) => option.id)
      .sort(),
    `${question.screenKey} has exactly one explanation record per live answer ID`
  );

  for (const option of question.options) {
    answerCount += 1;

    assert.ok(
      getQuizAnswerExplainabilityCopy(
        question.screenKey,
        option.id
      ),
      `${question.screenKey}/${option.id} resolves explanation copy`
    );

    const traceability =
      getInvestorNeedTraceability(
        question.screenKey,
        option.id
      );

    assert.ok(
      traceability?.investorNeed
    );
    assert.ok(
      traceability
        ?.portfolioConsequence
        ?.label
    );
    assert.ok(
      traceability
        ?.systemCapability
        ?.label
    );
  }
}

assert.equal(
  answerCount,
  43,
  'All 43 live quiz answers have complete explainability mappings'
);


const SHARED_SIGNALS = Object.freeze([
  ['marketPsychology', 'idea', { GA: 2, TO: 2 }],
  ['marketPsychology', 'rarely', { ES: 2, GD: 2 }],
  ['evolution', 'monitor', { GD: 2, BFO: 2 }],
  ['tradeoff', 'periodic', { BFO: 2, FT: 2 }],
  ['goals', 'monitor', { GD: 2, BFO: 2 }]
]);

const sharedResult =
  assessAnswers(
    FIXTURES.GA.answers
  );

for (const [
  questionId,
  answerId,
  expectedScores
] of SHARED_SIGNALS) {
  const option =
    QUESTIONS
      .find(
        (question) =>
          question.screenKey ===
          questionId
      )
      .options
      .find(
        (candidate) =>
          candidate.id === answerId
      );

  assert.deepEqual(
    option.scores,
    expectedScores,
    `${questionId}/${answerId} retains both tied score contributions`
  );

  const answers =
    structuredClone(
      FIXTURES.GA.answers
    );

  answers[questionId] =
    [answerId];

  const result =
    assessAnswers(answers);

  const resolved =
    resolveRecommendationExplainability(
      result,
      result.portfolioSystem
    ).selectedAnswers.find(
      (answer) =>
        answer.questionId === questionId &&
        answer.answerId === answerId
    );

  assert.equal(
    resolved.sharedSignal,
    true
  );
  assert.equal(
    resolved.tiltStrength,
    'shared'
  );
  assert.match(
    resolved.signalLabel,
    /^Shared /
  );
  assert.doesNotMatch(
    resolved.signalLabel,
    /Decisive/
  );
}

assert.ok(sharedResult);


const finalFtAnswers =
  structuredClone(
    FIXTURES.FT.answers
  );

finalFtAnswers.decisionStyle =
  ['fit'];

const finalFtResult =
  assessAnswers(
    finalFtAnswers
  );

assert.equal(
  finalFtResult.archetypeId,
  'FT',
  'Fulfillment fixture must finish with Systematic Improvement'
);

const fitEvidence =
  resolveRecommendationExplainability(
    finalFtResult,
    finalFtResult.portfolioSystem
  ).selectedAnswers.find(
    (answer) =>
      answer.questionId === 'decisionStyle' &&
      answer.answerId === 'fit'
  );

assert.equal(
  fitEvidence.archetypeTilt[0].archetype,
  'GA',
  'The selected fit answer itself most strongly favors GA'
);
assert.equal(
  fitEvidence.fulfillment.archetypeId,
  'FT',
  'Fulfillment resolves against the actual final archetype'
);
assert.equal(
  fitEvidence.fulfillment.source,
  'final-system-definition',
  'A non-primary winner derives fulfillment from the actual portfolio definition'
);
assert.match(
  fitEvidence.fulfillment.copy,
  /Systematic Improvement Portfolio/
);
assert.doesNotMatch(
  fitEvidence.fulfillment.copy,
  /Growth & Alternatives provides explicit destinations/
);


const gaAssessment =
  assessAnswers(
    FIXTURES.GA.answers
  );

const gaFit =
  resolvePortfolioJobFit(
    gaAssessment
  );

const gaPresentation =
  presentPortfolioJobFit(
    gaFit
  );

const gaGuidance =
  presentInvestorSystemGuidance(
    gaPresentation
  );

const uiModel =
  gaGuidance
    .recommendationReveal
    .recommendationExplainability;

assert.equal(
  uiModel.strongestEvidence.length,
  5,
  'UI model surfaces at most five strongest winning signals'
);

assert.deepEqual(
  uiModel.strongestEvidence
    .slice(0, 3)
    .map((answer) => answer.answerId),
  ['experiment', 'explore', 'explore'],
  'Strongest GA +3 evidence is ranked before moderate signals'
);

const html =
  renderRecommendationExplainability(
    uiModel
  );

assert.match(
  html,
  /Why this system rose to the top/
);
assert.match(
  html,
  /What your answers say your system needs/
);
assert.match(
  html,
  /How your recommended system provides that/
);
assert.match(
  html,
  /Trying new ideas without disrupting everything else/
);
assert.match(
  html,
  /Bounded-experimentation framework/
);
assert.doesNotMatch(
  html,
  /\+3|raw score|weightedWinningContribution/
);

for (const invalidText of [
  'undefined',
  'null',
  '[object Object]'
]) {
  assert.ok(
    !html.includes(invalidText),
    `Rendered explainability omits ${invalidText}`
  );
}

const escapedHtml =
  renderRecommendationExplainability({
    summary: '<script>alert(1)</script>',
    strongestEvidence: [{
      answerText: '<unsafe>',
      signalLabel: 'Shared & safe',
      tiltExplanation: 'A < B'
    }],
    capabilities: [{
      label: '<capability>',
      copy: 'Need & rule',
      fulfillment: {
        copy: '<fulfillment>'
      }
    }],
    variantExplanation: {
      label: '<variant>',
      copy: '<copy>'
    }
  });

assert.doesNotMatch(
  escapedHtml,
  /<script>|<unsafe>|<capability>|<fulfillment>|<variant>|<copy>/
);
assert.match(
  escapedHtml,
  /Shared &amp; safe/
);


console.log(
  'Recommendation explainability tests passed.'
);

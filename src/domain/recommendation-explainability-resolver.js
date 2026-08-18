import {
  QUESTIONS
} from '../content/questions.js';

import {
  getInvestorNeedTraceability
} from '../content/investor-need-traceability-copy.js';

import {
  getQuizAnswerExplainabilityCopy
} from '../content/quiz-answer-explainability-copy.js';

import {
  PORTFOLIO_ARCHETYPES
} from './portfolio-system/portfolio-archetypes.js';


const STRENGTH_LABELS = Object.freeze({
  decisive: 'Decisive',
  strong: 'Strong',
  moderate: 'Moderate',
  shared: 'Shared',
  supporting: 'Supporting'
});


function getArchetypeName(
  archetypeId
) {
  return (
    PORTFOLIO_ARCHETYPES
      ?.[archetypeId]
      ?.name ??
    archetypeId
  ).replace(
    / Portfolio$/,
    ''
  );
}


function getQuestionIndex() {
  return new Map(
    QUESTIONS.map(
      (question, questionIndex) => [
        question.screenKey,
        {
          question,
          questionIndex,
          options: new Map(
            question.options.map(
              (option) => [
                option.id,
                option
              ]
            )
          )
        }
      ]
    )
  );
}


const QUESTION_INDEX =
  getQuestionIndex();


function getSelectedAnswerIds(
  assessmentResult
) {
  const answers =
    assessmentResult
      ?.normalizedAnswers ??
    assessmentResult
      ?.answers ??
    {};

  return QUESTIONS.flatMap(
    (question) => {
      const rawAnswer =
        answers
          ?.[question.screenKey];

      const answerIds =
        Array.isArray(rawAnswer)
          ? rawAnswer
          : rawAnswer == null
            ? []
            : [rawAnswer];

      return answerIds
        .map((answer, selectionIndex) => ({
          questionId:
            question.screenKey,
          answerId:
            typeof answer === 'string'
              ? answer
              : answer?.optionId ??
                answer?.id ??
                null,
          selectionIndex
        }))
        .filter(
          (answer) =>
            Boolean(
              answer.answerId &&
              QUESTION_INDEX
                .get(answer.questionId)
                ?.options
                ?.has(answer.answerId)
            )
        );
    }
  );
}


function getTiltStrength({
  configuredStrength,
  score,
  sharedSignal
}) {
  if (sharedSignal) {
    return 'shared';
  }

  if (configuredStrength) {
    return configuredStrength;
  }

  if (score >= 3) {
    return 'strong';
  }

  if (score >= 2) {
    return 'moderate';
  }

  return 'supporting';
}


function buildFallbackTiltExplanation({
  archetypeName,
  investorNeed,
  strength
}) {
  return `${STRENGTH_LABELS[strength]} ${archetypeName} signal because this response indicates a need for ${investorNeed.toLowerCase()}, which the existing recommendation scoring treats as support for that system.`;
}


function buildSignalLabel({
  archetypeTilt,
  finalArchetypeId,
  strength,
  sharedSignal
}) {
  if (sharedSignal) {
    const maxScore =
      Math.max(
        ...archetypeTilt.map(
          (tilt) => tilt.score
        )
      );

    const names =
      archetypeTilt
        .filter(
          (tilt) =>
            tilt.score === maxScore
        )
        .map(
          (tilt) =>
            getArchetypeName(
              tilt.archetype
            )
        )
        .join(' / ');

    return `Shared ${names} signal`;
  }

  return `${STRENGTH_LABELS[strength]} ${getArchetypeName(finalArchetypeId)} signal`;
}


function getActiveSleeves(
  portfolioSystem
) {
  return (
    portfolioSystem
      ?.sleeves ??
    []
  )
    .filter(
      (sleeve) =>
        Number(sleeve?.weight) > 0
    )
    .sort(
      (first, second) =>
        Number(second.weight) -
        Number(first.weight)
    );
}


export function getCapabilityFulfillment({
  systemCapability,
  finalArchetypeId,
  finalVariantId,
  portfolioSystem,
  fulfillmentCopy = {}
}) {
  if (
    !systemCapability?.label ||
    !finalArchetypeId ||
    !portfolioSystem?.system
  ) {
    throw new Error(
      'Capability fulfillment requires a capability and the actual final portfolio system.'
    );
  }

  const approvedCopy =
    fulfillmentCopy
      ?.[finalArchetypeId];

  if (approvedCopy) {
    return {
      archetypeId:
        finalArchetypeId,
      variantId:
        finalVariantId,
      source:
        'approved-answer-copy',
      copy:
        approvedCopy
    };
  }

  const systemName =
    portfolioSystem
      .system
      .name ??
    getArchetypeName(
      finalArchetypeId
    );

  const sleeveLabels =
    getActiveSleeves(
      portfolioSystem
    )
      .slice(0, 3)
      .map(
        (sleeve) => sleeve.label
      )
      .filter(Boolean);

  const sleevePhrase =
    sleeveLabels.length > 0
      ? sleeveLabels.join(', ')
      : 'its defined portfolio roles';

  const invariant =
    portfolioSystem
      .system
      .invariant;

  const variantPhrase =
    finalVariantId
      ? ` In its ${finalVariantId} version, the number and operating detail of those roles follow the involvement and review profile already resolved from your answers.`
      : '';

  return {
    archetypeId:
      finalArchetypeId,
    variantId:
      finalVariantId,
    source:
      'final-system-definition',
    copy:
      `${systemName} provides this capability through ${sleevePhrase}, with each part assigned a defined portfolio job.${invariant ? ` The system keeps that support inside its governing boundary: ${invariant}` : ''}${variantPhrase}`
  };
}


function resolveAnswer({
  questionId,
  answerId,
  selectionIndex,
  finalArchetypeId,
  finalVariantId,
  portfolioSystem
}) {
  const questionEntry =
    QUESTION_INDEX.get(
      questionId
    );

  const option =
    questionEntry
      ?.options
      ?.get(answerId);

  if (!option) {
    throw new Error(
      `Missing quiz option for explainability: ${questionId}/${answerId}`
    );
  }

  const traceability =
    getInvestorNeedTraceability(
      questionId,
      answerId
    );

  const copy =
    getQuizAnswerExplainabilityCopy(
      questionId,
      answerId
    );

  if (!traceability || !copy) {
    throw new Error(
      `Missing response explainability mapping: ${questionId}/${answerId}`
    );
  }

  const archetypeTilt =
    Object.entries(
      option.scores ?? {}
    ).map(
      ([archetype, score]) => ({
        archetype,
        score:
          Number(score) || 0
      })
    );

  const maxScore =
    Math.max(
      0,
      ...archetypeTilt.map(
        (tilt) => tilt.score
      )
    );

  const sharedSignal =
    archetypeTilt.filter(
      (tilt) =>
        tilt.score === maxScore
    ).length > 1;

  const scoreForWinner =
    Number(
      option
        .scores
        ?.[finalArchetypeId]
    ) || 0;

  const selectionWeight =
    selectionIndex === 0
      ? 1
      : 0.75;

  const strength =
    getTiltStrength({
      configuredStrength:
        copy.tiltStrength,
      score:
        scoreForWinner,
      sharedSignal
    });

  const fulfillment =
    getCapabilityFulfillment({
      systemCapability:
        traceability
          .systemCapability,
      finalArchetypeId,
      finalVariantId,
      portfolioSystem,
      fulfillmentCopy:
        copy.fulfillment
    });

  return {
    questionId,
    answerId,
    questionText:
      questionEntry
        .question
        .heading,
    answerText:
      option.label,
    selectionOrder:
      selectionIndex + 1,
    selectionWeight,
    investorNeed:
      traceability
        .investorNeed,
    portfolioConsequence:
      traceability
        .portfolioConsequence,
    systemCapability:
      traceability
        .systemCapability,
    archetypeTilt,
    winningArchetypeId:
      finalArchetypeId,
    winningArchetypeScore:
      scoreForWinner,
    weightedWinningContribution:
      scoreForWinner *
      selectionWeight,
    sharedSignal,
    tiltStrength:
      strength,
    signalLabel:
      buildSignalLabel({
        archetypeTilt,
        finalArchetypeId,
        strength,
        sharedSignal
      }),
    tiltExplanation:
      copy.tiltExplanation ??
      buildFallbackTiltExplanation({
        archetypeName:
          getArchetypeName(
            finalArchetypeId
          ),
        investorNeed:
          traceability
            .investorNeed,
        strength
      }),
    fulfillment
  };
}


function rankForWinner(
  answers
) {
  return [
    ...answers
  ].sort(
    (first, second) =>
      second
        .weightedWinningContribution -
        first
          .weightedWinningContribution ||
      second
        .winningArchetypeScore -
        first
          .winningArchetypeScore ||
      QUESTION_INDEX
        .get(first.questionId)
        .questionIndex -
        QUESTION_INDEX
          .get(second.questionId)
          .questionIndex ||
      first.selectionOrder -
        second.selectionOrder
  );
}


function deduplicateCapabilities(
  rankedAnswers
) {
  const capabilities =
    new Map();

  rankedAnswers.forEach(
    (answer) => {
      const key =
        answer
          .systemCapability
          .label;

      if (!capabilities.has(key)) {
        capabilities.set(
          key,
          {
            ...answer.systemCapability,
            fulfillment:
              answer.fulfillment,
            supportingAnswers: []
          }
        );
      }

      capabilities
        .get(key)
        .supportingAnswers
        .push({
          questionId:
            answer.questionId,
          answerId:
            answer.answerId,
          answerText:
            answer.answerText
        });
    }
  );

  return [
    ...capabilities.values()
  ];
}


function buildSummary(
  rankedEvidence,
  finalArchetypeId
) {
  const needs =
    [
      ...new Set(
        rankedEvidence
          .slice(0, 3)
          .map(
            (answer) =>
              answer.investorNeed
                .replace(/^A /, '')
                .toLowerCase()
          )
      )
    ];

  if (needs.length === 0) {
    return `Your selected answers collectively gave ${getArchetypeName(finalArchetypeId)} the strongest score.`;
  }

  const needPhrase =
    needs.length === 1
      ? needs[0]
      : `${needs.slice(0, -1).join(', ')} and ${needs.at(-1)}`;

  return `Several of your strongest answers pointed to the same pattern: ${needPhrase}. Together, those answers gave ${getArchetypeName(finalArchetypeId)} the strongest support.`;
}


export function resolveRecommendationExplainability(
  assessmentResult,
  portfolioSystem =
    assessmentResult?.portfolioSystem
) {
  const finalArchetypeId =
    assessmentResult
      ?.archetypeId;

  const finalVariantId =
    portfolioSystem
      ?.profileVariantId;

  if (
    !finalArchetypeId ||
    !finalVariantId ||
    !portfolioSystem
  ) {
    throw new Error(
      'Recommendation explainability requires an already-resolved archetype, variant, and portfolio system.'
    );
  }

  const selectedAnswers =
    getSelectedAnswerIds(
      assessmentResult
    ).map(
      (answer) =>
        resolveAnswer({
          ...answer,
          finalArchetypeId,
          finalVariantId,
          portfolioSystem
        })
    );

  const rankedAnswers =
    rankForWinner(
      selectedAnswers
    );

  const strongestEvidence =
    rankedAnswers
      .filter(
        (answer) =>
          answer
            .winningArchetypeScore > 0
      )
      .slice(0, 5);

  return {
    finalArchetypeId,
    finalArchetypeName:
      getArchetypeName(
        finalArchetypeId
      ),
    finalVariantId,
    summary:
      buildSummary(
        strongestEvidence,
        finalArchetypeId
      ),
    strongestEvidence,
    capabilities:
      deduplicateCapabilities(
        rankedAnswers
      ),
    selectedAnswers:
      rankedAnswers,
    variantExplanation: {
      variantId:
        finalVariantId,
      label:
        finalVariantId[0]
          .toUpperCase() +
        finalVariantId.slice(1),
      copy:
        `Your answers about involvement, research and review determine how actively this system should operate. That separate stage, style and behavior logic is why your recommended system uses the ${finalVariantId[0].toUpperCase() + finalVariantId.slice(1)} version.`
    }
  };
}


export default resolveRecommendationExplainability;

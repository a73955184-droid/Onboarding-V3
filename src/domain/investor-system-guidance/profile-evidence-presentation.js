import {
  getQuestionLabel,
  getQuestionOptionLabel
} from '../investor-jobs.js';

import {
  getInvestorNeedTraceability
} from '../../content/investor-need-traceability-copy.js';


export const PROFILE_EVIDENCE_QUESTION_IDS = Object.freeze({
  stage: Object.freeze([
    'setup',
    'evolution'
  ]),

  style: Object.freeze([
    'tradeoff',
    'marketPsychology'
  ]),

  behavior: Object.freeze([
    'transition',
    'decisionStyle'
  ])
});


function getAnswerIds(
  answers,
  questionId
) {
  const answer =
    answers?.[questionId];

  if (Array.isArray(answer)) {
    return answer.filter(
      (value) =>
        typeof value === 'string'
    );
  }

  if (typeof answer === 'string') {
    return [answer];
  }

  if (
    answer &&
    typeof answer === 'object'
  ) {
    if (
      Array.isArray(
        answer.selectedOptionIds
      )
    ) {
      return answer
        .selectedOptionIds
        .filter(
          (value) =>
            typeof value ===
            'string'
        );
    }

    if (
      typeof answer.optionId ===
      'string'
    ) {
      return [answer.optionId];
    }
  }

  return [];
}


export function groupSelectedAnswerEvidence(
  selectedAnswers = [],
  questionIds
) {
  if (!Array.isArray(selectedAnswers)) {
    return [];
  }

  const orderedQuestionIds =
    Array.isArray(questionIds)
      ? questionIds
      : [
          ...new Set(
            selectedAnswers
              .map(
                (answer) =>
                  answer?.questionId
              )
              .filter(Boolean)
          )
        ];

  return orderedQuestionIds
    .map((questionId) => {
      const seenOptionIds =
        new Set();

      const responses =
        selectedAnswers
          .filter(
            (answer) =>
              answer?.questionId ===
              questionId
          )
          .filter((answer) => {
            const optionId =
              answer?.optionId;

            if (
              typeof optionId !==
                'string' ||
              seenOptionIds.has(
                optionId
              )
            ) {
              return false;
            }

            seenOptionIds.add(
              optionId
            );

            return true;
          })
          .map((answer) => ({
            optionId:
              answer.optionId,
            answerText:
              answer.answerText ??
              getQuestionOptionLabel(
                questionId,
                answer.optionId
              )
          }))
          .filter(
            (answer) =>
              Boolean(
                answer.answerText
              )
          );

      return {
        questionId,
        questionLabel:
          getQuestionLabel(
            questionId
          ),
        responses
      };
    })
    .filter(
      (group) =>
        group.responses.length > 0
    );
}


export function getGroupedEvidenceForDimension(
  selectedAnswers,
  dimension
) {
  return groupSelectedAnswerEvidence(
    selectedAnswers,
    PROFILE_EVIDENCE_QUESTION_IDS[
      dimension
    ] ?? []
  );
}


export function getGroupedEvidenceFromAnswers(
  answers,
  dimension
) {
  const questionIds =
    PROFILE_EVIDENCE_QUESTION_IDS[
      dimension
    ] ?? [];

  const selectedAnswers =
    questionIds.flatMap(
      (questionId) =>
        getAnswerIds(
          answers,
          questionId
        ).map((optionId) => ({
          questionId,
          optionId,
          answerText:
            getQuestionOptionLabel(
              questionId,
              optionId
            )
        }))
    );

  return groupSelectedAnswerEvidence(
    selectedAnswers,
    questionIds
  );
}


export function buildGroupedTraceability(
  groupedEvidence = []
) {
  if (!Array.isArray(groupedEvidence)) {
    return [];
  }

  return groupedEvidence
    .map((group) => ({
      questionId:
        group.questionId,

      questionLabel:
        group.questionLabel,

      responses:
        Array.isArray(group.responses)
          ? group.responses
              .map((response) => {
                const traceability =
                  getInvestorNeedTraceability(
                    group.questionId,
                    response.optionId
                  );

                if (!traceability) {
                  return null;
                }

                return {
                  optionId:
                    response.optionId,

                  answerText:
                    response.answerText,

                  investorNeed:
                    traceability
                      .investorNeed,

                  portfolioConsequence:
                    traceability
                      .portfolioConsequence,

                  systemCapability:
                    traceability
                      .systemCapability
                };
              })
              .filter(Boolean)
          : []
    }))
    .filter(
      (group) =>
        group.responses.length > 0
    );
}

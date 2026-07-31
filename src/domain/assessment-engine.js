import {
  QUESTIONS
} from '../content/questions.js';

import {
  ASSESSMENT_VERSION,
  STAGES,
  STYLES,
  MODIFIERS,
  OPTION_LOGIC,
  TIME_HORIZON_OPTION_IDS
} from './assessment-config.js';

import {
  composePortfolioSystem
} from './portfolio-system/portfolio-composer.js';


const ARCHETYPE_IDS = Object.freeze([
  'BFO',
  'GD',
  'FT',
  'GA',
  'TO',
  'IP',
  'ES'
]);


const DEFAULT_ARCHETYPE_ID =
  'BFO';

const DEFAULT_STAGE_ID =
  'portfolio_organizer';

const DEFAULT_STYLE_ID =
  'steady_steward';

const DEFAULT_MODIFIER_ID =
  'validation_seeker';


/*
 * Only these archetypes currently have all three constituent portfolio
 * variants defined in constituent-portfolios.js.
 *
 * Add GD, BFO, GA, TO and IP here only after their essential,
 * intentional and engaged portfolios have been implemented.
 */
const IMPLEMENTED_PORTFOLIO_ARCHETYPES =
  new Set([
    'ES',
    'FT'
  ]);


/*
 * Active Navigator should not be produced from one isolated answer.
 * At least two distinct active-investing signals must be present.
 */
const ACTIVE_STYLE_SIGNALS =
  new Set([
    'opportunity seeking',
    'active exploration',
    'control preference',
    'opportunity pressure'
  ]);


function createScoreMap(
  ids
) {
  return Object.fromEntries(
    ids.map(
      (id) => [
        id,
        0
      ]
    )
  );
}


function createEmptyScores() {
  return {
    archetype:
      createScoreMap(
        ARCHETYPE_IDS
      ),

    stage:
      createScoreMap(
        Object.keys(
          STAGES
        )
      ),

    style:
      createScoreMap(
        Object.keys(
          STYLES
        )
      ),

    modifier:
      createScoreMap(
        Object.keys(
          MODIFIERS
        )
      )
  };
}


function cloneValue(
  value
) {
  if (
    typeof structuredClone ===
    'function'
  ) {
    return structuredClone(
      value
    );
  }

  return JSON.parse(
    JSON.stringify(
      value
    )
  );
}


function normalizeSelectedOptionIds(
  answer
) {
  if (answer == null) {
    return [];
  }

  if (
    typeof answer ===
    'string'
  ) {
    const trimmed =
      answer.trim();

    return trimmed
      ? [trimmed]
      : [];
  }

  if (
    Array.isArray(
      answer
    )
  ) {
    return answer
      .map((item) => {
        if (
          typeof item ===
          'string'
        ) {
          return item.trim();
        }

        if (
          item &&
          typeof item ===
          'object'
        ) {
          return (
            item.id ??
            item.optionId ??
            item.selectedOptionId ??
            null
          );
        }

        return null;
      })
      .filter(Boolean);
  }

  if (
    typeof answer !==
    'object'
  ) {
    return [];
  }

  if (
    typeof answer.optionId ===
    'string'
  ) {
    return [
      answer.optionId
    ];
  }

  if (
    typeof answer.selectedOptionId ===
    'string'
  ) {
    return [
      answer.selectedOptionId
    ];
  }

  if (
    Array.isArray(
      answer.optionIds
    )
  ) {
    return normalizeSelectedOptionIds(
      answer.optionIds
    );
  }

  if (
    Array.isArray(
      answer.selectedOptionIds
    )
  ) {
    return normalizeSelectedOptionIds(
      answer.selectedOptionIds
    );
  }

  if (
    Array.isArray(
      answer.value
    )
  ) {
    return normalizeSelectedOptionIds(
      answer.value
    );
  }

  if (
    typeof answer.value ===
    'string'
  ) {
    return normalizeSelectedOptionIds(
      answer.value
    );
  }

  return [];
}


export function normalizeAssessmentAnswers(
  answers = {}
) {
  if (
    !answers ||
    typeof answers !==
      'object' ||
    Array.isArray(
      answers
    )
  ) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(
      answers
    ).map(
      ([
        questionId,
        answer
      ]) => [
        questionId,
        normalizeSelectedOptionIds(
          answer
        )
      ]
    )
  );
}


/*
 * screenKey is the stable question identifier used throughout the
 * application:
 *
 * setup
 * transition
 * decisionStyle
 * marketPsychology
 * evolution
 * tradeoff
 * age
 * goals
 */
function getQuestionId(
  question,
  index
) {
  return (
    question?.id ??
    question?.questionId ??
    question?.screenKey ??
    question?.key ??
    String(
      index + 1
    )
  );
}


function getQuestionList() {
  if (
    Array.isArray(
      QUESTIONS
    )
  ) {
    return QUESTIONS;
  }

  if (
    QUESTIONS &&
    typeof QUESTIONS ===
      'object'
  ) {
    return Object.values(
      QUESTIONS
    );
  }

  return [];
}


function getQuestionOptions(
  question
) {
  if (
    Array.isArray(
      question?.options
    )
  ) {
    return question.options;
  }

  if (
    Array.isArray(
      question?.cards
    )
  ) {
    return question.cards;
  }

  return [];
}


function getOptionId(
  option
) {
  return (
    option?.id ??
    option?.optionId ??
    option?.value ??
    null
  );
}


function buildQuestionIndex() {
  return getQuestionList()
    .reduce(
      (
        questionIndex,
        question,
        index
      ) => {
        const questionId =
          getQuestionId(
            question,
            index
          );

        const optionIndex =
          getQuestionOptions(
            question
          ).reduce(
            (
              options,
              option
            ) => {
              const optionId =
                getOptionId(
                  option
                );

              if (optionId) {
                options[
                  optionId
                ] = option;
              }

              return options;
            },
            {}
          );

        questionIndex[
          questionId
        ] = {
          question,
          options:
            optionIndex
        };

        return questionIndex;
      },
      {}
    );
}


const QUESTION_INDEX =
  buildQuestionIndex();


function getQuestionEntry(
  questionId
) {
  return (
    QUESTION_INDEX[
      questionId
    ] ??
    null
  );
}


function getConfiguredOptionLogic(
  questionId,
  optionId
) {
  return (
    OPTION_LOGIC?.[
      questionId
    ]?.[
      optionId
    ] ??
    {}
  );
}


function addScores(
  target,
  additions,
  weight = 1
) {
  if (
    !additions ||
    typeof additions !==
      'object' ||
    Array.isArray(
      additions
    )
  ) {
    return;
  }

  Object.entries(
    additions
  ).forEach(
    ([
      id,
      rawValue
    ]) => {
      const value =
        Number(
          rawValue
        );

      if (
        !Number.isFinite(
          value
        )
      ) {
        return;
      }

      if (
        !Object.hasOwn(
          target,
          id
        )
      ) {
        target[id] = 0;
      }

      target[id] +=
        value * weight;
    }
  );
}


function sortScores(
  scores
) {
  return Object.entries(
    scores
  )
    .map(
      ([
        id,
        score
      ], index) => ({
        id,
        score:
          Number(
            score
          ) || 0,
        index
      })
    )
    .sort(
      (
        first,
        second
      ) => {
        if (
          second.score !==
          first.score
        ) {
          return (
            second.score -
            first.score
          );
        }

        return (
          first.index -
          second.index
        );
      }
    );
}


function resolveScore(
  scores,
  fallbackId
) {
  const ranked =
    sortScores(
      scores
    );

  const primary =
    ranked[0];

  const secondary =
    ranked[1];

  if (
    !primary ||
    primary.score <= 0
  ) {
    return {
      id:
        fallbackId,

      score:
        0,

      runnerUpId:
        null,

      runnerUpScore:
        0,

      margin:
        0,

      ranked
    };
  }

  return {
    id:
      primary.id,

    score:
      primary.score,

    runnerUpId:
      secondary?.score > 0
        ? secondary.id
        : null,

    runnerUpScore:
      secondary?.score > 0
        ? secondary.score
        : 0,

    margin:
      primary.score -
      (
        secondary?.score > 0
          ? secondary.score
          : 0
      ),

    ranked
  };
}


function collectOptionSignals(
  option,
  logic
) {
  const signals = [];

  if (
    Array.isArray(
      option?.signals
    )
  ) {
    signals.push(
      ...option.signals
    );
  }

  if (
    Array.isArray(
      logic?.signals
    )
  ) {
    signals.push(
      ...logic.signals
    );
  }

  if (
    typeof option?.signal ===
    'string'
  ) {
    signals.push(
      option.signal
    );
  }

  if (
    typeof logic?.signal ===
    'string'
  ) {
    signals.push(
      logic.signal
    );
  }

  return signals.filter(
    Boolean
  );
}


function createEvidenceItem({
  questionId,
  optionId,
  option,
  selectionOrder,
  weight
}) {
  return {
    questionId,
    optionId,

    selectionOrder,
    weight,

    label:
      option?.label ??
      option?.title ??
      option?.text ??
      optionId,

    helper:
      option?.helper ??
      option?.description ??
      null
  };
}


function resolveTimeHorizon(
  normalizedAnswers
) {
  const selectedHorizonIds =
    normalizedAnswers.age ??
    [];

  for (
    const optionId
    of selectedHorizonIds
  ) {
    const mapped =
      TIME_HORIZON_OPTION_IDS[
        optionId
      ];

    if (mapped) {
      return mapped;
    }
  }

  return null;
}


function applyActiveStyleGuardrail({
  styleId,
  signals
}) {
  if (
    styleId !==
    'active_navigator'
  ) {
    return styleId;
  }

  const matchedSignals =
    new Set(
      signals.filter(
        (signal) =>
          ACTIVE_STYLE_SIGNALS.has(
            signal
          )
      )
    );

  if (
    matchedSignals.size <
    2
  ) {
    return 'bounded_explorer';
  }

  return styleId;
}


function calculateConfidence({
  archetypeResolution,
  stageResolution,
  styleResolution,
  modifierResolution,
  answeredQuestionCount
}) {
  let score = 45;

  if (
    archetypeResolution.margin >=
    4
  ) {
    score += 20;
  } else if (
    archetypeResolution.margin >=
    2
  ) {
    score += 10;
  }

  if (
    stageResolution.margin >=
    2
  ) {
    score += 5;
  }

  if (
    styleResolution.margin >=
    2
  ) {
    score += 5;
  }

  if (
    modifierResolution.margin >=
    2
  ) {
    score += 5;
  }

  if (
    answeredQuestionCount ===
    getQuestionList().length
  ) {
    score += 10;
  }

  score =
    Math.max(
      0,
      Math.min(
        95,
        score
      )
    );

  return {
    score,

    level:
      score >= 80
        ? 'high'
        : score >= 60
          ? 'medium'
          : 'low'
  };
}


export function isAssessmentComplete(
  answers = {}
) {
  const normalizedAnswers =
    normalizeAssessmentAnswers(
      answers
    );

  return getQuestionList()
    .every(
      (
        question,
        index
      ) => {
        if (
          question?.required ===
          false
        ) {
          return true;
        }

        const questionId =
          getQuestionId(
            question,
            index
          );

        const selectedIds =
          normalizedAnswers[
            questionId
          ] ?? [];

        const minimumSelections =
          Number.isFinite(
            question?.min
          )
            ? question.min
            : 1;

        return (
          selectedIds.length >=
          minimumSelections
        );
      }
    );
}


export function getFirstUnansweredQuestionId(
  answers = {}
) {
  const normalizedAnswers =
    normalizeAssessmentAnswers(
      answers
    );

  const questions =
    getQuestionList();

  for (
    let index = 0;
    index <
    questions.length;
    index += 1
  ) {
    const question =
      questions[index];

    if (
      question?.required ===
      false
    ) {
      continue;
    }

    const questionId =
      getQuestionId(
        question,
        index
      );

    const selectedIds =
      normalizedAnswers[
        questionId
      ] ?? [];

    const minimumSelections =
      Number.isFinite(
        question?.min
      )
        ? question.min
        : 1;

    if (
      selectedIds.length <
      minimumSelections
    ) {
      return questionId;
    }
  }

  return null;
}


export function assessAnswers(
  answers = {}
) {
  const normalizedAnswers =
    normalizeAssessmentAnswers(
      answers
    );

  const scores =
    createEmptyScores();

  const evidence = [];
  const collectedSignals = [];

  let answeredQuestionCount =
    0;

  for (
    const [
      questionId,
      selectedOptionIds
    ]
    of Object.entries(
      normalizedAnswers
    )
  ) {
    if (
      selectedOptionIds.length ===
      0
    ) {
      continue;
    }

    const questionEntry =
      getQuestionEntry(
        questionId
      );

    if (!questionEntry) {
      console.warn(
        `Unknown assessment question: ${questionId}`
      );

      continue;
    }

    answeredQuestionCount +=
      1;

    selectedOptionIds.forEach(
      (
        optionId,
        selectionIndex
      ) => {
        const option =
          questionEntry
            .options[
              optionId
            ];

        if (!option) {
          console.warn(
            `Unknown assessment option: ${questionId}/${optionId}`
          );

          return;
        }

        /*
         * First selected answer receives full weight.
         * Second selected answer receives 75% weight.
         */
        const weight =
          selectionIndex === 0
            ? 1
            : 0.75;

        const logic =
          getConfiguredOptionLogic(
            questionId,
            optionId
          );

        /*
         * Archetype scoring lives on the quiz option itself.
         */
        addScores(
          scores.archetype,
          option.scores,
          weight
        );

        /*
         * Investor stage, operating style and behavioral modifier
         * scoring live in assessment-config.js.
         */
        addScores(
          scores.stage,
          logic.stage,
          weight
        );

        addScores(
          scores.style,
          logic.style,
          weight
        );

        addScores(
          scores.modifier,
          logic.modifier,
          weight
        );

        collectedSignals.push(
          ...collectOptionSignals(
            option,
            logic
          )
        );

        evidence.push(
          createEvidenceItem({
            questionId,
            optionId,
            option,
            selectionOrder:
              selectionIndex + 1,
            weight
          })
        );
      }
    );
  }

  const archetypeResolution =
    resolveScore(
      scores.archetype,
      DEFAULT_ARCHETYPE_ID
    );

  const stageResolution =
    resolveScore(
      scores.stage,
      DEFAULT_STAGE_ID
    );

  const initialStyleResolution =
    resolveScore(
      scores.style,
      DEFAULT_STYLE_ID
    );

  const modifierResolution =
    resolveScore(
      scores.modifier,
      DEFAULT_MODIFIER_ID
    );

  const signals =
    [
      ...new Set(
        collectedSignals
      )
    ];

  const styleId =
    applyActiveStyleGuardrail({
      styleId:
        initialStyleResolution.id,
      signals
    });

  const timeHorizon =
    resolveTimeHorizon(
      normalizedAnswers
    );

  const confidence =
    calculateConfidence({
      archetypeResolution,
      stageResolution,
      styleResolution:
        initialStyleResolution,
      modifierResolution,
      answeredQuestionCount
    });

  const assessmentResult = {
    assessmentVersion:
      ASSESSMENT_VERSION,

    archetypeId:
      archetypeResolution.id,

    secondaryArchetypeId:
      archetypeResolution
        .runnerUpId,

    stageId:
      stageResolution.id,

    styleId,

    modifierId:
      modifierResolution.id,

    secondaryModifierId:
      modifierResolution
        .runnerUpId,

    timeHorizon,

    signals,
    evidence,
    confidence,

    scores: {
      archetype:
        cloneValue(
          scores.archetype
        ),

      stage:
        cloneValue(
          scores.stage
        ),

      style:
        cloneValue(
          scores.style
        ),

      modifier:
        cloneValue(
          scores.modifier
        )
    },

    normalizedAnswers:
      cloneValue(
        normalizedAnswers
      ),

    answers:
      cloneValue(
        answers
      ),

    portfolioSystem:
      null,

    portfolioSystemError:
      null
  };

  /*
   * Constituent portfolio generation currently exists only for ES
   * and FT. Other archetype results still remain valid assessment
   * results and continue to use the existing static system screen.
   */
  if (
    IMPLEMENTED_PORTFOLIO_ARCHETYPES
      .has(
        assessmentResult
          .archetypeId
      )
  ) {
    try {
      assessmentResult
        .portfolioSystem =
          composePortfolioSystem(
            assessmentResult
          );
    } catch (error) {
      console.error(
        'Portfolio composition failed:',
        error
      );

      assessmentResult
        .portfolioSystemError = {
          name:
            error?.name ??
            'PortfolioCompositionError',

          message:
            error?.message ??
            'Portfolio composition failed.'
        };
    }
  }

  return assessmentResult;
}


/*
 * Compatibility aliases for tests or modules using earlier naming.
 */
export const calculateAssessment =
  assessAnswers;

export const generateAssessmentResult =
  assessAnswers;


export default assessAnswers;

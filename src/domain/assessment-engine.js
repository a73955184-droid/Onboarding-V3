import { QUESTIONS } from "../content/questions.js";
import * as assessmentConfig from "./assessment-config.js";
import {
  composePortfolioSystem,
} from "./portfolio-system/portfolio-composer.js";

/**
 * Assessment Engine
 *
 * Responsibilities:
 * - validate and normalize saved quiz answers;
 * - recompute all scores from the current answer set;
 * - resolve portfolio archetype, investor stage, operating style,
 *   and behavioral modifier;
 * - preserve supporting evidence;
 * - produce the constituent portfolio system.
 *
 * This file must not:
 * - read or modify the DOM;
 * - read from localStorage;
 * - contain UI copy;
 * - mutate answers incrementally.
 */

const DEFAULT_ARCHETYPE_ID = "BFO";
const DEFAULT_STAGE_ID = "portfolio_organizer";
const DEFAULT_STYLE_ID = "steady_steward";
const DEFAULT_MODIFIER_ID = "evidence_seeker";

const IMPLEMENTED_PORTFOLIO_ARCHETYPES = new Set([
  "ES",
  "GD",
  "FT",
  "BFO",
  "GA",
  "TO",
  "IP",
]);

/**
 * Supports either of these configuration exports:
 *
 * OPTION_LOGIC
 * OPTION_PROFILE_LOGIC
 * PROFILE_LOGIC
 *
 * This makes the engine more tolerant while the repository is evolving.
 */
const OPTION_LOGIC =
  assessmentConfig.OPTION_LOGIC ??
  assessmentConfig.OPTION_PROFILE_LOGIC ??
  assessmentConfig.PROFILE_LOGIC ??
  {};

const ARCHETYPE_COMPATIBILITY =
  assessmentConfig.ARCHETYPE_COMPATIBILITY ??
  assessmentConfig.STYLE_ARCHETYPE_COMPATIBILITY ??
  {};

const TIME_HORIZON_OPTION_IDS =
  assessmentConfig.TIME_HORIZON_OPTION_IDS ??
  assessmentConfig.TIME_HORIZON_MAP ??
  {};

/**
 * Creates a plain score object from a list of stable IDs.
 */
function createScoreMap(ids = []) {
  return ids.reduce((scores, id) => {
    scores[id] = 0;
    return scores;
  }, {});
}

/**
 * Adds numeric score contributions without mutating the source map.
 */
function addScores(target, additions) {
  if (!additions || typeof additions !== "object") {
    return target;
  }

  Object.entries(additions).forEach(([id, rawValue]) => {
    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      return;
    }

    if (!Object.hasOwn(target, id)) {
      target[id] = 0;
    }

    target[id] += value;
  });

  return target;
}

/**
 * Converts a quiz answer into a normalized array of selected option IDs.
 *
 * Supported answer shapes:
 *
 * "option-id"
 *
 * ["option-a", "option-b"]
 *
 * {
 *   optionId: "option-id"
 * }
 *
 * {
 *   selectedOptionIds: ["option-a", "option-b"]
 * }
 */
function normalizeSelectedOptionIds(answer) {
  if (answer == null) {
    return [];
  }

  if (typeof answer === "string") {
    return answer.trim() ? [answer] : [];
  }

  if (Array.isArray(answer)) {
    return answer
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  if (typeof answer !== "object") {
    return [];
  }

  if (typeof answer.optionId === "string") {
    return [answer.optionId];
  }

  if (typeof answer.selectedOptionId === "string") {
    return [answer.selectedOptionId];
  }

  if (Array.isArray(answer.optionIds)) {
    return normalizeSelectedOptionIds(answer.optionIds);
  }

  if (Array.isArray(answer.selectedOptionIds)) {
    return normalizeSelectedOptionIds(
      answer.selectedOptionIds,
    );
  }

  if (Array.isArray(answer.value)) {
    return normalizeSelectedOptionIds(answer.value);
  }

  if (typeof answer.value === "string") {
    return normalizeSelectedOptionIds(answer.value);
  }

  return [];
}

/**
 * Supports questions exported either as:
 *
 * QUESTIONS = [...]
 *
 * or:
 *
 * QUESTIONS = {
 *   questionId: {...}
 * }
 */
function getQuestionList() {
  if (Array.isArray(QUESTIONS)) {
    return QUESTIONS;
  }

  if (QUESTIONS && typeof QUESTIONS === "object") {
    return Object.values(QUESTIONS);
  }

  return [];
}

function getQuestionId(question, index) {
  return (
    question?.id ??
    question?.questionId ??
    question?.key ??
    String(index + 1)
  );
}

function getQuestionOptions(question) {
  if (Array.isArray(question?.options)) {
    return question.options;
  }

  if (Array.isArray(question?.cards)) {
    return question.cards;
  }

  return [];
}

function getOptionId(option) {
  return (
    option?.id ??
    option?.optionId ??
    option?.value ??
    null
  );
}

function buildQuestionIndex() {
  return getQuestionList().reduce(
    (questionIndex, question, index) => {
      const questionId = getQuestionId(question, index);

      const optionIndex = getQuestionOptions(
        question,
      ).reduce((options, option) => {
        const optionId = getOptionId(option);

        if (optionId) {
          options[optionId] = option;
        }

        return options;
      }, {});

      questionIndex[questionId] = {
        question,
        options: optionIndex,
      };

      return questionIndex;
    },
    {},
  );
}

const QUESTION_INDEX = buildQuestionIndex();

/**
 * Saved answers may use either current question IDs or numeric screen IDs.
 * This method resolves both where possible.
 */
function getQuestionEntry(questionId) {
  if (QUESTION_INDEX[questionId]) {
    return QUESTION_INDEX[questionId];
  }

  const normalizedQuestionId = String(questionId);

  const directMatch = Object.entries(
    QUESTION_INDEX,
  ).find(([id]) => String(id) === normalizedQuestionId);

  return directMatch?.[1] ?? null;
}

function findOptionGlobally(optionId) {
  for (const entry of Object.values(QUESTION_INDEX)) {
    if (entry.options[optionId]) {
      return entry.options[optionId];
    }
  }

  return null;
}

/**
 * Gets profile logic stored separately in assessment-config.js.
 *
 * Supported structures:
 *
 * OPTION_LOGIC[optionId]
 *
 * OPTION_LOGIC[questionId][optionId]
 */
function getConfiguredOptionLogic(
  questionId,
  optionId,
) {
  const directLogic = OPTION_LOGIC[optionId];

  if (directLogic) {
    return directLogic;
  }

  const questionLogic = OPTION_LOGIC[questionId];

  if (
    questionLogic &&
    typeof questionLogic === "object"
  ) {
    return questionLogic[optionId] ?? {};
  }

  return {};
}

/**
 * Reads score maps using multiple supported field names.
 */
function getDimensionScores(source, dimension) {
  if (!source || typeof source !== "object") {
    return {};
  }

  const aliases = {
    archetype: [
      "archetype",
      "archetypes",
      "archetypeScores",
      "scores",
    ],

    stage: [
      "stage",
      "stages",
      "stageScores",
    ],

    style: [
      "style",
      "styles",
      "styleScores",
    ],

    modifier: [
      "modifier",
      "modifiers",
      "modifierScores",
    ],
  };

  for (const key of aliases[dimension] ?? []) {
    const candidate = source[key];

    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      return candidate;
    }
  }

  return {};
}

function getOptionSignals(option, logic) {
  const combinedSignals = [
    ...(Array.isArray(option?.signals)
      ? option.signals
      : []),

    ...(Array.isArray(logic?.signals)
      ? logic.signals
      : []),
  ];

  if (typeof option?.signal === "string") {
    combinedSignals.push(option.signal);
  }

  if (typeof logic?.signal === "string") {
    combinedSignals.push(logic.signal);
  }

  return [...new Set(combinedSignals.filter(Boolean))];
}

function getOptionEvidence(
  questionId,
  optionId,
  option,
) {
  return {
    questionId,
    optionId,

    label:
      option?.label ??
      option?.title ??
      option?.text ??
      optionId,

    explanation:
      option?.signalDescription ??
      option?.explanation ??
      option?.description ??
      null,
  };
}

function sortScoreEntries(scores) {
  return Object.entries(scores).sort(
    ([firstId, firstScore], [secondId, secondScore]) => {
      if (secondScore !== firstScore) {
        return secondScore - firstScore;
      }

      return firstId.localeCompare(secondId);
    },
  );
}

function resolveHighestScore(
  scores,
  fallbackId,
) {
  const ranked = sortScoreEntries(scores);

  if (ranked.length === 0) {
    return {
      id: fallbackId,
      score: 0,
      runnerUpId: null,
      runnerUpScore: 0,
      margin: 0,
    };
  }

  const [primary, secondary] = ranked;

  return {
    id: primary?.[0] ?? fallbackId,
    score: primary?.[1] ?? 0,
    runnerUpId: secondary?.[0] ?? null,
    runnerUpScore: secondary?.[1] ?? 0,

    margin:
      (primary?.[1] ?? 0) -
      (secondary?.[1] ?? 0),
  };
}

function getCompatibilityValue(styleId, archetypeId) {
  const styleRules =
    ARCHETYPE_COMPATIBILITY[styleId];

  if (!styleRules) {
    return 0;
  }

  const value = styleRules[archetypeId];

  if (typeof value === "number") {
    return value;
  }

  switch (value) {
    case "preferred":
      return 2;

    case "restricted":
      return -2;

    case "prohibited":
      return Number.NEGATIVE_INFINITY;

    case "allowed":
    default:
      return 0;
  }
}

function resolveArchetypeWithCompatibility(
  archetypeScores,
  styleId,
) {
  const compatibleScores = {};

  Object.entries(archetypeScores).forEach(
    ([archetypeId, rawScore]) => {
      /*
       * ES is currently treated as a portfolio archetype in the
       * prototype. If it later becomes only an evolution-stage
       * classification, remove it from the constituent catalogue
       * and resolve it before this step.
       */
      const compatibility = getCompatibilityValue(
        styleId,
        archetypeId,
      );

      if (
        compatibility ===
        Number.NEGATIVE_INFINITY
      ) {
        return;
      }

      compatibleScores[archetypeId] =
        rawScore + compatibility;
    },
  );

  return resolveHighestScore(
    compatibleScores,
    DEFAULT_ARCHETYPE_ID,
  );
}

function resolveTimeHorizon(
  answers,
  selectedOptions,
) {
  /*
   * First check whether the saved state contains an explicit
   * normalized horizon.
   */
  const explicitHorizon =
    answers.timeHorizon ??
    answers.time_horizon ??
    answers.investingTimeHorizon;

  if (typeof explicitHorizon === "string") {
    return explicitHorizon;
  }

  /*
   * Then check mappings declared in assessment-config.js.
   */
  for (const selected of selectedOptions) {
    const mappedHorizon =
      TIME_HORIZON_OPTION_IDS[selected.optionId];

    if (mappedHorizon) {
      return mappedHorizon;
    }

    const optionHorizon =
      selected.option?.timeHorizon ??
      selected.option?.time_horizon ??
      selected.logic?.timeHorizon ??
      selected.logic?.time_horizon;

    if (optionHorizon) {
      return optionHorizon;
    }
  }

  return null;
}

function calculateConfidence({
  archetypeResolution,
  stageResolution,
  styleResolution,
  modifierResolution,
  selectedOptionCount,
}) {
  let confidence = 50;

  if (archetypeResolution.margin >= 4) {
    confidence += 20;
  } else if (archetypeResolution.margin >= 2) {
    confidence += 10;
  }

  if (stageResolution.margin >= 2) {
    confidence += 5;
  }

  if (styleResolution.margin >= 2) {
    confidence += 5;
  }

  if (modifierResolution.margin >= 2) {
    confidence += 5;
  }

  if (selectedOptionCount >= 8) {
    confidence += 10;
  } else if (selectedOptionCount >= 5) {
    confidence += 5;
  }

  confidence = Math.max(
    0,
    Math.min(100, confidence),
  );

  const level =
    confidence >= 80
      ? "high"
      : confidence >= 60
        ? "medium"
        : "low";

  return {
    score: confidence,
    level,
  };
}

/**
 * Normalizes answers without mutating the supplied value.
 */
export function normalizeAssessmentAnswers(
  answers = {},
) {
  if (
    !answers ||
    typeof answers !== "object" ||
    Array.isArray(answers)
  ) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(answers).map(
      ([questionId, answer]) => [
        questionId,
        normalizeSelectedOptionIds(answer),
      ],
    ),
  );
}

/**
 * Returns true when every configured question has at least one answer.
 *
 * Optional questions can declare:
 *
 * required: false
 */
export function isAssessmentComplete(
  answers = {},
) {
  const normalized =
    normalizeAssessmentAnswers(answers);

  return getQuestionList().every(
    (question, index) => {
      if (question?.required === false) {
        return true;
      }

      const questionId = getQuestionId(
        question,
        index,
      );

      return (
        Array.isArray(normalized[questionId]) &&
        normalized[questionId].length > 0
      );
    },
  );
}

/**
 * Returns the first unanswered required question ID.
 */
export function getFirstUnansweredQuestionId(
  answers = {},
) {
  const normalized =
    normalizeAssessmentAnswers(answers);

  const unanswered = getQuestionList().find(
    (question, index) => {
      if (question?.required === false) {
        return false;
      }

      const questionId = getQuestionId(
        question,
        index,
      );

      return (
        !Array.isArray(normalized[questionId]) ||
        normalized[questionId].length === 0
      );
    },
  );

  if (!unanswered) {
    return null;
  }

  const unansweredIndex =
    getQuestionList().indexOf(unanswered);

  return getQuestionId(
    unanswered,
    unansweredIndex,
  );
}

/**
 * Main assessment entrypoint.
 */
export function assessAnswers(
  answers = {},
) {
  const normalizedAnswers =
    normalizeAssessmentAnswers(answers);

  const archetypeScores = {};
  const stageScores = {};
  const styleScores = {};
  const modifierScores = {};

  const selectedOptions = [];
  const signals = [];
  const evidence = [];

  Object.entries(normalizedAnswers).forEach(
    ([questionId, optionIds]) => {
      const questionEntry =
        getQuestionEntry(questionId);

      optionIds.forEach((optionId) => {
        const option =
          questionEntry?.options?.[optionId] ??
          findOptionGlobally(optionId);

        if (!option) {
          console.warn(
            `Assessment option not found: ${questionId}/${optionId}`,
          );

          return;
        }

        const logic = getConfiguredOptionLogic(
          questionId,
          optionId,
        );

        /*
         * Archetype scoring primarily comes from option.scores.
         * This repairs the earlier problem where obsolete
         * OPTION_LOGIC IDs prevented archetype scoring.
         */
        addScores(
          archetypeScores,
          getDimensionScores(option, "archetype"),
        );

        /*
         * Preserve support for archetype contributions that
         * still live in assessment-config.js.
         */
        addScores(
          archetypeScores,
          getDimensionScores(logic, "archetype"),
        );

        addScores(
          stageScores,
          getDimensionScores(option, "stage"),
        );

        addScores(
          stageScores,
          getDimensionScores(logic, "stage"),
        );

        addScores(
          styleScores,
          getDimensionScores(option, "style"),
        );

        addScores(
          styleScores,
          getDimensionScores(logic, "style"),
        );

        addScores(
          modifierScores,
          getDimensionScores(option, "modifier"),
        );

        addScores(
          modifierScores,
          getDimensionScores(logic, "modifier"),
        );

        const optionSignals = getOptionSignals(
          option,
          logic,
        );

        signals.push(...optionSignals);

        evidence.push(
          getOptionEvidence(
            questionId,
            optionId,
            option,
          ),
        );

        selectedOptions.push({
          questionId,
          optionId,
          option,
          logic,
        });
      });
    },
  );

  const stageResolution = resolveHighestScore(
    stageScores,
    DEFAULT_STAGE_ID,
  );

  const styleResolution = resolveHighestScore(
    styleScores,
    DEFAULT_STYLE_ID,
  );

  const modifierResolution = resolveHighestScore(
    modifierScores,
    DEFAULT_MODIFIER_ID,
  );

  const archetypeResolution =
    resolveArchetypeWithCompatibility(
      archetypeScores,
      styleResolution.id,
    );

  const timeHorizon = resolveTimeHorizon(
    answers,
    selectedOptions,
  );

  const uniqueSignals = [...new Set(signals)];

  const confidence = calculateConfidence({
    archetypeResolution,
    stageResolution,
    styleResolution,
    modifierResolution,
    selectedOptionCount: selectedOptions.length,
  });

  const assessmentResult = {
    archetypeId: archetypeResolution.id,

    secondaryArchetypeId:
      archetypeResolution.runnerUpId,

    stageId: stageResolution.id,
    styleId: styleResolution.id,
    modifierId: modifierResolution.id,

    timeHorizon,

    signals: uniqueSignals,
    evidence,

    confidence,

    scores: {
      archetype: archetypeScores,
      stage: stageScores,
      style: styleScores,
      modifier: modifierScores,
    },

    normalizedAnswers,

    /*
     * Keep the original answer shape so the UI and state layer
     * can preserve the user's selections exactly.
     */
    answers: structuredClone(answers),
  };

  /*
   * Compose the portfolio only for archetypes whose constituent
   * portfolios are currently implemented.
   *
   * This lets the assessment continue working while you add the
   * 21 combinations incrementally.
   */
  if (
    IMPLEMENTED_PORTFOLIO_ARCHETYPES.has(
      assessmentResult.archetypeId,
    )
  ) {
    try {
      assessmentResult.portfolioSystem =
        composePortfolioSystem(assessmentResult);

      assessmentResult.portfolioSystemError =
        null;
    } catch (error) {
      console.error(
        "Portfolio composition failed:",
        error,
      );

      assessmentResult.portfolioSystem = null;

      assessmentResult.portfolioSystemError = {
        name: error?.name ?? "Error",
        message:
          error?.message ??
          "Portfolio composition failed.",
      };
    }
  } else {
    assessmentResult.portfolioSystem = null;

    assessmentResult.portfolioSystemError = {
      name: "UnsupportedArchetypeError",
      message:
        `Constituent portfolio composition has not yet been implemented for ${assessmentResult.archetypeId}.`,
    };
  }

  return assessmentResult;
}

/**
 * Alias retained for screens or tests that use the older function name.
 */
export const calculateAssessment =
  assessAnswers;

/**
 * Alias retained for code that refers to the recommendation result.
 */
export const generateAssessmentResult =
  assessAnswers;

export default assessAnswers;

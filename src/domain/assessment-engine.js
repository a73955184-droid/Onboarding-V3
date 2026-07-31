import './assessment-config.js';

import {
  QUESTIONS
} from '../content/questions.js';


const SCORE_KEYS = [
  'BFO',
  'GD',
  'FT',
  'GA',
  'TO',
  'IP',
  'ES'
];

const STAGE_KEYS =
  Object.keys(globalThis.STAGES);

const STYLE_KEYS =
  Object.keys(globalThis.STYLES);

const MODIFIER_KEYS =
  Object.keys(globalThis.MODIFIERS);


/**
 * Creates a score object where every supplied key starts at zero.
 *
 * Example:
 *
 * zeroMap(['BFO', 'GD'])
 *
 * returns:
 *
 * {
 *   BFO: 0,
 *   GD: 0
 * }
 */
function zeroMap(keys) {
  return Object.fromEntries(
    keys.map((key) => [key, 0])
  );
}


/**
 * Creates a new blank assessment state.
 */
export function emptyState() {
  return {
    version:
      globalThis.ASSESSMENT_VERSION,

    archetypeScores:
      zeroMap(SCORE_KEYS),

    stageScores:
      zeroMap(STAGE_KEYS),

    styleScores:
      zeroMap(STYLE_KEYS),

    modifierScores:
      zeroMap(MODIFIER_KEYS),

    answers: {},

    metadata: {},

    signals: [],

    result: null
  };
}


/**
 * Adds a score mapping to a target score object.
 *
 * The weight allows the first selected answer to count fully and the
 * second selected answer to count at 75%.
 */
export function addScores(
  target,
  mapping,
  weight = 1
) {
  for (
    const [key, value]
    of Object.entries(mapping || {})
  ) {
    target[key] =
      (target[key] || 0) +
      Number(value) * weight;
  }
}


/**
 * Converts a score map into a descending ranked list.
 *
 * Ties retain the original order of the score-map keys.
 */
function rankScores(scores) {
  return Object.entries(scores)
    .map(([id, score], index) => ({
      id,
      score: Number(score) || 0,
      index
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.index - b.index;
    });
}


/**
 * Returns the question configuration for a saved screen key.
 */
function getQuestion(screenKey) {
  return QUESTIONS.find(
    (question) =>
      question.screenKey === screenKey
  );
}


/**
 * Normalizes a saved answer.
 *
 * Older state versions may contain either:
 *
 * - an answer object with an id
 * - a raw option ID string
 */
function getAnswerId(answer) {
  if (typeof answer === 'string') {
    return answer;
  }

  return answer?.id || null;
}


/**
 * Applies one question's selected options to all four scoring systems.
 *
 * Archetype scoring comes from:
 *
 * question.options[n].scores
 *
 * Stage, style, modifier, behavioral signals, and metadata come from:
 *
 * globalThis.OPTION_LOGIC[screenKey][optionId]
 */
function scoreQuestion(
  state,
  question,
  selectedAnswerIds
) {
  const selectedOptions =
    selectedAnswerIds
      .map((optionId) =>
        question.options.find(
          (option) =>
            option.id === optionId
        )
      )
      .filter(Boolean);

  selectedOptions.forEach(
    (option, selectionIndex) => {
      const weight =
        selectionIndex === 0
          ? 1
          : 0.75;

      const logic =
        globalThis
          .OPTION_LOGIC?.[
            question.screenKey
          ]?.[
            option.id
          ] || {};

      /*
       * Archetype scoring already exists in questions.js.
       *
       * This is the critical fix. The previous engine looked only for
       * logic.archetype, even though the current quiz stores those
       * scores in option.scores.
       */
      addScores(
        state.archetypeScores,
        option.scores,
        weight
      );

      addScores(
        state.stageScores,
        logic.stage,
        weight
      );

      addScores(
        state.styleScores,
        logic.style,
        weight
      );

      addScores(
        state.modifierScores,
        logic.modifier,
        weight
      );

      /*
       * Signals are qualitative guardrails rather than numeric scores.
       *
       * They are intentionally stored once per selected answer. The
       * second-answer weight affects score values but not whether a
       * behavioral signal exists.
       */
      if (Array.isArray(logic.signals)) {
        state.signals.push(
          ...logic.signals
        );
      }

      if (logic.metadata) {
        Object.assign(
          state.metadata,
          logic.metadata
        );
      }
    }
  );
}


/**
 * Rebuilds all assessment scores from the saved answers.
 *
 * This prevents double counting when someone:
 *
 * - goes back to an earlier question
 * - changes an answer
 * - revisits a screen
 * - completes the assessment more than once in the same session
 *
 * The previous implementation added new scores on top of old scores.
 */
function rebuildScores(state) {
  const rebuilt = emptyState();

  rebuilt.answers = {
    ...(state.answers || {})
  };

  for (const question of QUESTIONS) {
    const savedAnswers =
      rebuilt.answers[
        question.screenKey
      ];

    if (
      !Array.isArray(savedAnswers) ||
      savedAnswers.length === 0
    ) {
      continue;
    }

    const selectedAnswerIds =
      savedAnswers
        .map(getAnswerId)
        .filter(Boolean);

    scoreQuestion(
      rebuilt,
      question,
      selectedAnswerIds
    );
  }

  rebuilt.metadata.lastStep =
    state.metadata?.lastStep || null;

  return rebuilt;
}


/**
 * Selects the final result from the four score maps.
 */
export function resolveAssessment(state) {
  const archetypes =
    rankScores(
      state.archetypeScores ||
      zeroMap(SCORE_KEYS)
    );

  const stages =
    rankScores(
      state.stageScores ||
      zeroMap(STAGE_KEYS)
    );

  const styles =
    rankScores(
      state.styleScores ||
      zeroMap(STYLE_KEYS)
    );

  const modifiers =
    rankScores(
      state.modifierScores ||
      zeroMap(MODIFIER_KEYS)
    );

  const primaryArchetype =
    archetypes[0]?.score > 0
      ? archetypes[0].id
      : 'GD';

  const secondaryArchetype =
    archetypes[1]?.score > 0
      ? archetypes[1].id
      : null;

  const primaryStage =
    stages[0]?.score > 0
      ? stages[0].id
      : 'portfolio_organizer';

  let primaryStyle =
    styles[0]?.score > 0
      ? styles[0].id
      : 'steady_steward';

  const primaryModifier =
    modifiers[0]?.score > 0
      ? modifiers[0].id
      : 'confidence_builder';

  const secondaryModifier =
    modifiers[1]?.score > 0
      ? modifiers[1].id
      : null;

  /*
   * Active Navigator guardrail
   *
   * Someone should receive Active Navigator only when at least two
   * active-investing behavioral signals are present.
   *
   * This prevents one opportunity-oriented response from creating an
   * overly active recommendation.
   */
  if (
    primaryStyle ===
    'active_navigator'
  ) {
    const qualifyingSignals =
      new Set([
        'opportunity seeking',
        'active exploration',
        'control preference',
        'opportunity pressure'
      ]);

    const matchedSignals =
      new Set(
        (state.signals || [])
          .filter((signal) =>
            qualifyingSignals.has(signal)
          )
      );

    if (matchedSignals.size < 2) {
      primaryStyle =
        'bounded_explorer';
    }
  }

  /*
   * Retain the current heuristic confidence value for compatibility.
   *
   * It is not yet displayed as a statistical probability. We can
   * revisit this later without changing the current recommendation
   * behavior.
   */
  const positiveArchetypeTotal =
    archetypes.reduce(
      (total, archetype) =>
        total +
        Math.max(
          0,
          archetype.score
        ),
      0
    );

  const topArchetypeScore =
    Math.max(
      0,
      archetypes[0]?.score || 0
    );

  const confidence =
    positiveArchetypeTotal > 0
      ? Math.round(
          Math.max(
            35,
            Math.min(
              95,
              (
                topArchetypeScore /
                positiveArchetypeTotal
              ) *
                100 +
                35
            )
          )
        )
      : 35;

  return {
    archetypeId:
      primaryArchetype,

    secondaryArchetypeId:
      secondaryArchetype,

    stageId:
      primaryStage,

    styleId:
      primaryStyle,

    modifierId:
      primaryModifier,

    secondaryModifierId:
      secondaryModifier,

    confidence
  };
}


/**
 * Saves an answer and recalculates the complete assessment.
 *
 * This function is called after each quiz screen.
 */
export function applyAnswer(
  state,
  config,
  selectedIds
) {
  const safeState =
    state &&
    typeof state === 'object'
      ? state
      : emptyState();

  const validSelectedIds =
    Array.isArray(selectedIds)
      ? selectedIds
      : [];

  const chosenOptions =
    validSelectedIds
      .map((optionId) =>
        config.options.find(
          (option) =>
            option.id === optionId
        )
      )
      .filter(Boolean);

  /*
   * Preserve the selected option ID, visible label, screen title, and
   * selection order. Recommendation screens use these saved labels as
   * evidence beneath the result copy.
   */
  safeState.answers =
    safeState.answers || {};

  safeState.answers[
    config.screenKey
  ] =
    chosenOptions.map(
      (option, index) => ({
        id:
          option.id,

        label:
          option.label,

        screen:
          config.title,

        selectionOrder:
          index + 1
      })
    );

  safeState.metadata =
    safeState.metadata || {};

  safeState.metadata.lastStep =
    config.screenKey;

  /*
   * Recalculate from every saved answer rather than adding the latest
   * answer to scores that may already contain a previous selection.
   */
  const rebuilt =
    rebuildScores(safeState);

  rebuilt.metadata.lastStep =
    config.screenKey;

  /*
   * Keep the result current after every step. This makes profile and
   * system rendering reliable even when the user returns to a prior
   * question and changes an answer.
   */
  rebuilt.result =
    resolveAssessment(rebuilt);

  return rebuilt;
}

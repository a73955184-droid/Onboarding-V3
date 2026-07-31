import {
  assessAnswers,
  getFirstUnansweredQuestionId,
  isAssessmentComplete,
} from "../domain/assessment-engine.js";

/**
 * Application State
 *
 * Responsibilities:
 * - hold the current quiz answers;
 * - persist compatible state to localStorage;
 * - recompute the assessment result from answers;
 * - invalidate older incompatible storage versions;
 * - expose a small subscription API.
 *
 * Assessment scores and portfolio-system composition are always
 * recomputed from answers. They are never incrementally mutated.
 */

export const STORAGE_VERSION = 4;

export const STORAGE_KEY =
  `aaronbux-onboarding-state-v${STORAGE_VERSION}`;

const LEGACY_STORAGE_KEYS = [
  "aaronbux-onboarding-state",
  "aaronbux-assessment-state",
  "aaronbux-onboarding-state-v1",
  "aaronbux-onboarding-state-v2",
  "aaronbux-onboarding-state-v3",
];

const listeners = new Set();

function createInitialState() {
  return {
    version: STORAGE_VERSION,

    answers: {},

    assessmentResult: null,

    navigation: {
      currentQuestionId: null,
      completed: false,
    },

    ui: {
      selectedSleeveId: null,
    },

    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

let state = createInitialState();

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function clone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function safeReadStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(
      `Unable to read localStorage key "${key}".`,
      error,
    );

    return null;
  }
}

function safeWriteStorage(key, value) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );

    return true;
  } catch (error) {
    console.warn(
      `Unable to write localStorage key "${key}".`,
      error,
    );

    return false;
  }
}

function safeRemoveStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(
      `Unable to remove localStorage key "${key}".`,
      error,
    );
  }
}

function removeLegacyStorage() {
  LEGACY_STORAGE_KEYS.forEach(
    safeRemoveStorage,
  );
}

function normalizeAnswers(answers) {
  if (!isPlainObject(answers)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(answers).filter(
      ([questionId, answer]) =>
        typeof questionId === "string" &&
        answer != null,
    ),
  );
}

function sanitizeNavigation(navigation) {
  if (!isPlainObject(navigation)) {
    return {
      currentQuestionId: null,
      completed: false,
    };
  }

  return {
    currentQuestionId:
      typeof navigation.currentQuestionId ===
      "string"
        ? navigation.currentQuestionId
        : null,

    completed:
      navigation.completed === true,
  };
}

function sanitizeUi(ui) {
  if (!isPlainObject(ui)) {
    return {
      selectedSleeveId: null,
    };
  }

  return {
    selectedSleeveId:
      typeof ui.selectedSleeveId === "string"
        ? ui.selectedSleeveId
        : null,
  };
}

/**
 * The generated assessment is intentionally not trusted when loading
 * saved state. It is recomputed from answers so stale results cannot
 * survive scoring or portfolio-rule changes.
 */
function hydrateState(rawState) {
  const initialState = createInitialState();

  if (!isPlainObject(rawState)) {
    return initialState;
  }

  if (rawState.version !== STORAGE_VERSION) {
    return initialState;
  }

  const answers = normalizeAnswers(
    rawState.answers,
  );

  const completed =
    isAssessmentComplete(answers);

  const assessmentResult = completed
    ? safelyAssessAnswers(answers)
    : null;

  return {
    ...initialState,

    answers,

    assessmentResult,

    navigation: {
      ...sanitizeNavigation(
        rawState.navigation,
      ),

      currentQuestionId:
        rawState.navigation?.currentQuestionId ??
        getFirstUnansweredQuestionId(answers),

      completed,
    },

    ui: sanitizeUi(rawState.ui),

    metadata: {
      createdAt:
        typeof rawState.metadata?.createdAt ===
        "string"
          ? rawState.metadata.createdAt
          : initialState.metadata.createdAt,

      updatedAt: new Date().toISOString(),
    },
  };
}

function safelyAssessAnswers(answers) {
  try {
    return assessAnswers(answers);
  } catch (error) {
    console.error(
      "Assessment calculation failed:",
      error,
    );

    return null;
  }
}

function persistState() {
  safeWriteStorage(
    STORAGE_KEY,
    state,
  );
}

function notifyListeners() {
  const snapshot = getState();

  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (error) {
      console.error(
        "Application state listener failed:",
        error,
      );
    }
  });
}

function commit(nextState) {
  state = {
    ...nextState,

    version: STORAGE_VERSION,

    metadata: {
      ...nextState.metadata,
      updatedAt: new Date().toISOString(),
    },
  };

  persistState();
  notifyListeners();

  return getState();
}

/**
 * Loads the current storage schema.
 *
 * Older versions are intentionally removed because score identifiers,
 * profile classifications, and generated portfolio structures changed.
 */
export function initializeState() {
  removeLegacyStorage();

  const serialized =
    safeReadStorage(STORAGE_KEY);

  if (!serialized) {
    state = createInitialState();
    persistState();

    return getState();
  }

  try {
    const parsed = JSON.parse(serialized);

    state = hydrateState(parsed);
  } catch (error) {
    console.warn(
      "Saved onboarding state was malformed and has been reset.",
      error,
    );

    state = createInitialState();
    safeRemoveStorage(STORAGE_KEY);
  }

  persistState();

  return getState();
}

export function getState() {
  return clone(state);
}

export function getAnswers() {
  return clone(state.answers);
}

export function getAssessmentResult() {
  return state.assessmentResult
    ? clone(state.assessmentResult)
    : null;
}

export function getPortfolioSystem() {
  return state.assessmentResult
    ?.portfolioSystem
    ? clone(
        state.assessmentResult
          .portfolioSystem,
      )
    : null;
}

export function getAnswer(questionId) {
  if (
    typeof questionId !== "string" ||
    !questionId
  ) {
    return null;
  }

  const answer =
    state.answers[questionId];

  return answer == null
    ? null
    : clone(answer);
}

/**
 * Saves or replaces one complete question answer.
 *
 * Accepted answer values include:
 * - a selected option ID;
 * - an array of selected option IDs;
 * - a structured selection object.
 */
export function setAnswer(
  questionId,
  answer,
) {
  if (
    typeof questionId !== "string" ||
    !questionId.trim()
  ) {
    throw new TypeError(
      "questionId must be a non-empty string.",
    );
  }

  if (answer == null) {
    return removeAnswer(questionId);
  }

  const answers = {
    ...state.answers,
    [questionId]: clone(answer),
  };

  return updateDerivedState({
    ...state,
    answers,
  });
}

/**
 * Alias for screen code that uses saveAnswer terminology.
 */
export const saveAnswer = setAnswer;

/**
 * Replaces multiple answers in one operation.
 */
export function setAnswers(
  answerUpdates,
) {
  if (!isPlainObject(answerUpdates)) {
    throw new TypeError(
      "answerUpdates must be a plain object.",
    );
  }

  const answers = {
    ...state.answers,
    ...clone(answerUpdates),
  };

  return updateDerivedState({
    ...state,
    answers,
  });
}

/**
 * Replaces the entire answer collection.
 */
export function replaceAnswers(
  answers,
) {
  return updateDerivedState({
    ...state,
    answers: normalizeAnswers(answers),
  });
}

export function removeAnswer(
  questionId,
) {
  if (
    typeof questionId !== "string" ||
    !questionId
  ) {
    return getState();
  }

  const answers = {
    ...state.answers,
  };

  delete answers[questionId];

  return updateDerivedState({
    ...state,
    answers,
  });
}

function updateDerivedState(nextState) {
  const answers = normalizeAnswers(
    nextState.answers,
  );

  const completed =
    isAssessmentComplete(answers);

  const assessmentResult = completed
    ? safelyAssessAnswers(answers)
    : null;

  const firstUnansweredQuestionId =
    completed
      ? null
      : getFirstUnansweredQuestionId(
          answers,
        );

  /*
   * Preserve the selected sleeve only when it still exists in the
   * newly generated portfolio.
   */
  const previousSelectedSleeveId =
    nextState.ui?.selectedSleeveId ??
    null;

  const availableSleeveIds = new Set(
    assessmentResult?.portfolioSystem
      ?.sleeves?.map((sleeve) => sleeve.id) ??
      [],
  );

  const selectedSleeveId =
    previousSelectedSleeveId &&
    availableSleeveIds.has(
      previousSelectedSleeveId,
    )
      ? previousSelectedSleeveId
      : assessmentResult?.portfolioSystem
          ?.sleeves?.[0]?.id ??
        null;

  return commit({
    ...nextState,

    answers,

    assessmentResult,

    navigation: {
      ...nextState.navigation,

      currentQuestionId:
        firstUnansweredQuestionId,

      completed,
    },

    ui: {
      ...nextState.ui,
      selectedSleeveId,
    },
  });
}

/**
 * Explicitly recomputes the profile and portfolio from saved answers.
 *
 * Useful after development-time rule changes or before showing the
 * recommendation route.
 */
export function recomputeAssessment() {
  return updateDerivedState({
    ...state,
  });
}

/**
 * Older code may call calculateRecommendation.
 */
export const calculateRecommendation =
  recomputeAssessment;

/**
 * Sets the question currently being viewed without changing answers.
 */
export function setCurrentQuestionId(
  questionId,
) {
  const normalizedQuestionId =
    typeof questionId === "string" &&
    questionId.trim()
      ? questionId
      : null;

  return commit({
    ...state,

    navigation: {
      ...state.navigation,
      currentQuestionId:
        normalizedQuestionId,
    },
  });
}

/**
 * Stores which portfolio sleeve is open in the system screen.
 */
export function setSelectedSleeveId(
  sleeveId,
) {
  const sleeves =
    state.assessmentResult
      ?.portfolioSystem?.sleeves ??
    [];

  if (sleeveId == null) {
    return commit({
      ...state,

      ui: {
        ...state.ui,
        selectedSleeveId: null,
      },
    });
  }

  const sleeveExists = sleeves.some(
    (sleeve) => sleeve.id === sleeveId,
  );

  if (!sleeveExists) {
    console.warn(
      `Cannot select unknown portfolio sleeve: ${sleeveId}`,
    );

    return getState();
  }

  return commit({
    ...state,

    ui: {
      ...state.ui,
      selectedSleeveId: sleeveId,
    },
  });
}

export function getSelectedSleeve() {
  const portfolioSystem =
    state.assessmentResult
      ?.portfolioSystem;

  if (!portfolioSystem) {
    return null;
  }

  const selectedSleeveId =
    state.ui.selectedSleeveId;

  const sleeve =
    portfolioSystem.sleeves.find(
      (candidate) =>
        candidate.id ===
        selectedSleeveId,
    ) ??
    portfolioSystem.sleeves[0] ??
    null;

  return sleeve ? clone(sleeve) : null;
}

/**
 * State subscriptions are optional but useful once the sleeve UI
 * becomes interactive.
 *
 * Returns an unsubscribe function.
 */
export function subscribe(listener) {
  if (typeof listener !== "function") {
    throw new TypeError(
      "State subscriber must be a function.",
    );
  }

  listeners.add(listener);

  return function unsubscribe() {
    listeners.delete(listener);
  };
}

/**
 * Clears quiz answers, generated results, and UI selections.
 */
export function resetState() {
  state = createInitialState();

  safeRemoveStorage(STORAGE_KEY);
  persistState();
  notifyListeners();

  return getState();
}

/**
 * Alias for older assessment-screen code.
 */
export const resetAssessment =
  resetState;

/**
 * Export a stable appState facade for modules that prefer object-style
 * access rather than individual imports.
 */
export const appState = Object.freeze({
  initialize: initializeState,
  getState,
  getAnswers,
  getAnswer,
  getAssessmentResult,
  getPortfolioSystem,
  getSelectedSleeve,
  setAnswer,
  saveAnswer,
  setAnswers,
  replaceAnswers,
  removeAnswer,
  recomputeAssessment,
  calculateRecommendation,
  setCurrentQuestionId,
  setSelectedSleeveId,
  subscribe,
  reset: resetState,
});

/*
 * Initialize automatically when running in the browser.
 *
 * Tests running without window/localStorage can call initializeState()
 * after installing their own browser mocks.
 */
if (
  typeof window !== "undefined" &&
  window.localStorage
) {
  initializeState();
}

export default appState;

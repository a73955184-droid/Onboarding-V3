import {
  emptyState
} from '../domain/assessment-engine.js';


const KEY =
  'aaronbux-onboarding-state-v3';


export function loadState() {
  try {
    const storedState =
      sessionStorage.getItem(KEY);

    if (!storedState) {
      return emptyState();
    }

    const parsedState =
      JSON.parse(storedState);

    if (
      !parsedState ||
      typeof parsedState !== 'object'
    ) {
      return emptyState();
    }

    /*
     * If the stored assessment version does not match the current
     * scoring configuration, discard the old result and begin with a
     * clean state.
     */
    if (
      parsedState.version !==
      globalThis.ASSESSMENT_VERSION
    ) {
      sessionStorage.removeItem(KEY);
      return emptyState();
    }

    return parsedState;
  } catch (error) {
    console.warn(
      'Unable to load AaronBux assessment state.',
      error
    );

    sessionStorage.removeItem(KEY);

    return emptyState();
  }
}


export function saveState(state) {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify(state)
    );
  } catch (error) {
    console.warn(
      'Unable to save AaronBux assessment state.',
      error
    );
  }
}


export function resetState() {
  sessionStorage.removeItem(KEY);
}

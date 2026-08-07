import {
  getState,
  getAssessmentResult,
  resetState
} from '../../application/state.js';

import {
  navigate
} from '../../application/router.js';

import {
  QUESTIONS
} from '../../content/questions.js';


const STAGE_VIEW = {
  foundation_builder: {
    name: 'Building your foundation',
    summary:
      'You need a clear starting structure and a small number of understandable decisions.',
    headline:
      'You are building confidence through a clearer starting point.'
  },

  portfolio_organizer: {
    name: 'Organizing what you already have',
    summary:
      'You have begun investing, but the pieces do not yet feel connected by one clear reason.',
    headline:
      'You are ready to turn separate choices into one understandable approach.'
  },

  system_builder: {
    name: 'Building a repeatable approach',
    summary:
      'You are moving beyond isolated choices and want clearer rules for monitoring and change.',
    headline:
      'You are ready for a repeatable way to oversee your investments.'
  },

  intentional_optimizer: {
    name: 'Improving with intention',
    summary:
      'You want to compare alternatives and improve outcomes without changing direction unnecessarily.',
    headline:
      'You are ready to focus effort where it can make a meaningful difference.'
  },

  adaptive_investor: {
    name: 'Adapting within boundaries',
    summary:
      'You are comfortable exploring selected ideas, provided they remain connected to a larger plan.',
    headline:
      'You are ready to explore without letting every opportunity redefine your approach.'
  }
};


const STYLE_VIEW = {
  guided_autopilot: {
    name: 'Low-touch and guided',
    copy:
      'Routine decisions should stay simple and mostly automatic, with attention requested only when something meaningful changes.'
  },

  steady_steward: {
    name: 'Calm and periodic',
    copy:
      'You are most likely to stay consistent with occasional reviews and limited, understandable changes.'
  },

  systematic_improver: {
    name: 'Structured and evidence-led',
    copy:
      'You prefer repeatable criteria for comparing choices, deciding what matters, and knowing when research is sufficient.'
  },

  bounded_explorer: {
    name: 'Stable with room to explore',
    copy:
      'You want a dependable base while reserving a limited amount of time and money for selected ideas.'
  },

  active_navigator: {
    name: 'Involved within clear limits',
    copy:
      'You are willing to monitor selected opportunities more closely, but decisions need explicit triggers and boundaries.'
  }
};


const MODIFIER_VIEW = {
  validation_seeker: {
    name: 'Evidence before confidence',
    copy:
      'You trust decisions more when you can see why they fit your situation and compare them with reasonable alternatives.'
  },

  instruction_seeker: {
    name: 'Clear next steps',
    copy:
      'Uncertainty becomes easier when it is translated into a specific action: begin, review, wait, rebalance, or research further.'
  },

  confidence_builder: {
    name: 'Reassurance through structure',
    copy:
      'Predetermined review points and limits can help normal market movement feel less like a reason to rethink everything.'
  },

  opportunity_chaser: {
    name: 'Curiosity needs boundaries',
    copy:
      'New ideas are motivating, but they are easier to manage when their size, role, and review point are decided first.'
  },

  optimization_mindset: {
    name: 'Improvement needs a stopping rule',
    copy:
      'You naturally look for better choices; a consistent standard can prevent improvement from becoming endless comparison.'
  }
};


const EVIDENCE_MAP = {
  stage: [
    'setup',
    'evolution'
  ],

  style: [
    'tradeoff',
    'marketPsychology'
  ],

  modifier: [
    'transition',
    'decisionStyle'
  ]
};


const QUESTION_LABELS = {
  setup:
    'How you invest today',

  transition:
    'What sends you searching',

  decisionStyle:
    'How you make a choice',

  marketPsychology:
    'What gets your attention',

  evolution:
    'What feels incomplete',

  tradeoff:
    'How involved you want to be'
};


const QUESTION_BY_KEY =
  Object.fromEntries(
    QUESTIONS.map(
      (question) => [
        question.screenKey,
        question
      ]
    )
  );


function getAnswerIds(
  state,
  key
) {
  const answer =
    state.answers?.[key];

  if (Array.isArray(answer)) {
    return answer.filter(
      (value) =>
        typeof value === 'string'
    );
  }

  if (
    typeof answer === 'string'
  ) {
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
      return [
        answer.optionId
      ];
    }
  }

  return [];
}


function getAnswerLabels(
  state,
  key
) {
  const selectedIds =
    getAnswerIds(
      state,
      key
    );

  const question =
    QUESTION_BY_KEY[key];

  if (!question) {
    return [];
  }

  const labelById =
    Object.fromEntries(
      question.options.map(
        (option) => [
          option.id,
          option.label
        ]
      )
    );

  return selectedIds
    .map(
      (optionId) =>
        labelById[optionId]
    )
    .filter(Boolean);
}


function evidence(
  state,
  keys
) {
  return keys
    .map((key) => ({
      key,
      labels:
        getAnswerLabels(
          state,
          key
        )
    }))
    .filter(
      ({ labels }) =>
        labels.length > 0
    )
    .map(
      ({ key, labels }) => `
        <strong>
          ${QUESTION_LABELS[key]}:
        </strong>

        ${labels.join(' · ')}
      `
    )
    .join('<br>');
}


export function renderInvestorProfile(
  root
) {
  document.title =
    'AaronBux - Your Investor Profile';

  const state =
    getState();

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <button
            class="btn btn-secondary"
            id="backBtn"
            type="button"
          >
            Back
          </button>

          <div style="text-align: center">
            <div class="brand">
              AaronBux
            </div>

            <div class="step-label">
              Your investor profile
            </div>
          </div>

          <button
            class="btn btn-secondary"
            id="restartBtn"
            type="button"
          >
            Restart
          </button>
        </div>

        <div class="progress-track">
          <div
            class="progress-fill"
            style="width: 92%"
          ></div>
        </div>
      </header>

      <main class="main">
        <div
          id="missingState"
          class="card panel"
          style="display: none"
        >
          <h2>
            We could not find your answers.
          </h2>

          <p class="lead">
            Complete the assessment before viewing your investor profile.
          </p>

          <button
            id="startAssessmentBtn"
            class="btn btn-primary"
            type="button"
          >
            Start assessment
          </button>
        </div>

        <section
          id="result"
          style="display: none"
        >
          <div class="card panel result-hero">
            <span class="pill">
              Your investor profile
            </span>

            <h1 id="profileHeadline"></h1>

            <p
              class="lead"
              id="profileSummary"
            ></p>
          </div>

          <div class="result-grid">
            <article class="profile-card">
              <span class="pill">
                Where you are now
              </span>

              <h2 id="stageName"></h2>

              <p id="stageCopy"></p>

              <div
                class="evidence"
                id="stageEvidence"
              ></div>
            </article>

            <article class="profile-card">
              <span class="pill">
                How you prefer to invest
              </span>

              <h2 id="styleName"></h2>

              <p id="styleCopy"></p>

              <div
                class="evidence"
                id="styleEvidence"
              ></div>
            </article>

            <article class="profile-card">
              <span class="pill">
                What affects confidence
              </span>

              <h2 id="modifierName"></h2>

              <p id="modifierCopy"></p>

              <div
                class="evidence"
                id="modifierEvidence"
              ></div>
            </article>
          </div>

          <div class="next-row">
            <button
              id="systemBtn"
              class="btn btn-primary"
              type="button"
            >
              See your investing system
            </button>
          </div>
        </section>
      </main>
    </div>
  `;

  const backButton =
    root.querySelector(
      '#backBtn'
    );

  const restartButton =
    root.querySelector(
      '#restartBtn'
    );

  const missingState =
    root.querySelector(
      '#missingState'
    );

  const result =
    root.querySelector(
      '#result'
    );

  backButton.addEventListener(
    'click',
    () => {
      navigate(
        `assessment/${QUESTIONS.length}`
      );
    }
  );

  restartButton.addEventListener(
    'click',
    () => {
      resetState();
      navigate('');
    }
  );

  if (
    !state.answers ||
    Object.keys(
      state.answers
    ).length === 0
  ) {
    missingState.style.display =
      'block';

    root
      .querySelector(
        '#startAssessmentBtn'
      )
      .addEventListener(
        'click',
        () => {
          navigate(
            'assessment/1'
          );
        }
      );

    return;
  }

  const assessmentResult =
    getAssessmentResult();

  if (!assessmentResult) {
    missingState.style.display =
      'block';

    root
      .querySelector(
        '#startAssessmentBtn'
      )
      .addEventListener(
        'click',
        () => {
          navigate(
            'assessment/1'
          );
        }
      );

    return;
  }

  const stage =
    STAGE_VIEW[
      assessmentResult.stageId
    ] ||
    STAGE_VIEW.portfolio_organizer;

  const style =
    STYLE_VIEW[
      assessmentResult.styleId
    ] ||
    STYLE_VIEW.steady_steward;

  const modifier =
    MODIFIER_VIEW[
      assessmentResult.modifierId
    ] ||
    MODIFIER_VIEW.confidence_builder;

  result.style.display =
    'block';

  root
    .querySelector(
      '#profileHeadline'
    )
    .textContent =
      stage.headline;

  root
    .querySelector(
      '#profileSummary'
    )
    .textContent =
      'Your answers describe both where investing becomes difficult and the way you are most likely to stay confident and consistent.';

  root
    .querySelector(
      '#stageName'
    )
    .textContent =
      stage.name;

  root
    .querySelector(
      '#stageCopy'
    )
    .textContent =
      stage.summary;

  root
    .querySelector(
      '#styleName'
    )
    .textContent =
      style.name;

  root
    .querySelector(
      '#styleCopy'
    )
    .textContent =
      style.copy;

  root
    .querySelector(
      '#modifierName'
    )
    .textContent =
      modifier.name;

  root
    .querySelector(
      '#modifierCopy'
    )
    .textContent =
      modifier.copy;

  root
    .querySelector(
      '#stageEvidence'
    )
    .innerHTML =
      evidence(
        state,
        EVIDENCE_MAP.stage
      );

  root
    .querySelector(
      '#styleEvidence'
    )
    .innerHTML =
      evidence(
        state,
        EVIDENCE_MAP.style
      );

  root
    .querySelector(
      '#modifierEvidence'
    )
    .innerHTML =
      evidence(
        state,
        EVIDENCE_MAP.modifier
      );

  root
    .querySelector(
      '#systemBtn'
    )
    .addEventListener(
      'click',
      () => {
        navigate(
          'recommendation/profile-jobs'
        );
      }
    );
}

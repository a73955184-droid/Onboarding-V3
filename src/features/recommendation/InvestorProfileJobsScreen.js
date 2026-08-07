import {
  getState,
  getAssessmentResult,
  resetState
} from '../../application/state.js';

import { navigate } from '../../application/router.js';
import { resolveInvestorJobs } from '../../domain/investor-jobs-resolver.js';
import { JOB_SOURCE_MAP } from '../../domain/investor-jobs.js';
import { QUESTIONS } from '../../content/questions.js';

// This experimental screen intentionally mirrors the exact existing
// InvestorProfileScreen diagnosis copy and evidence helper behavior.
// Consolidate only after the experiment is validated.
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
  stage: ['setup', 'evolution'],
  style: ['tradeoff', 'marketPsychology'],
  modifier: ['transition', 'decisionStyle']
};

const QUESTION_LABELS = {
  setup: 'How you invest today',
  transition: 'What sends you searching',
  decisionStyle: 'How you make a choice',
  marketPsychology: 'What gets your attention',
  evolution: 'What feels incomplete',
  tradeoff: 'How involved you want to be'
};

const QUESTION_BY_KEY =
  Object.fromEntries(
    QUESTIONS.map((question) => [question.screenKey, question])
  );

function getAnswerIds(state, key) {
  const answer = state.answers?.[key];

  if (Array.isArray(answer)) {
    return answer.filter((value) => typeof value === 'string');
  }

  if (typeof answer === 'string') {
    return [answer];
  }

  if (answer && typeof answer === 'object') {
    if (Array.isArray(answer.selectedOptionIds)) {
      return answer.selectedOptionIds.filter((value) => typeof value === 'string');
    }

    if (typeof answer.optionId === 'string') {
      return [answer.optionId];
    }
  }

  return [];
}

function getAnswerLabels(state, key) {
  const selectedIds = getAnswerIds(state, key);
  const question = QUESTION_BY_KEY[key];

  if (!question) {
    return [];
  }

  const labelById = Object.fromEntries(
    question.options.map((option) => [option.id, option.label])
  );

  return selectedIds.map((optionId) => labelById[optionId]).filter(Boolean);
}

function evidence(state, keys) {
  return keys
    .map((key) => ({
      key,
      labels: getAnswerLabels(state, key)
    }))
    .filter(({ labels }) => labels.length > 0)
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

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getProfileSection(assessmentResult, state, section) {
  const stage = STAGE_VIEW[assessmentResult.stageId] || STAGE_VIEW.portfolio_organizer;
  const style = STYLE_VIEW[assessmentResult.styleId] || STYLE_VIEW.steady_steward;
  const modifier = MODIFIER_VIEW[assessmentResult.modifierId] || MODIFIER_VIEW.confidence_builder;

  if (section === 'stage') {
    return {
      label: 'WHERE YOU ARE NOW',
      title: stage.name,
      copy: stage.summary,
      evidence: evidence(state, EVIDENCE_MAP.stage)
    };
  }

  if (section === 'style') {
    return {
      label: 'HOW YOU PREFER TO INVEST',
      title: style.name,
      copy: style.copy,
      evidence: evidence(state, EVIDENCE_MAP.style)
    };
  }

  return {
    label: 'HOW YOU MAKE PORTFOLIO DECISIONS',
    title: modifier.name,
    copy: modifier.copy,
    evidence: evidence(state, EVIDENCE_MAP.modifier)
  };
}

function renderSection(sectionData, job) {
  if (!job) {
    return '';
  }

  return `
    <article class="profile-card card panel">
      <span class="pill">${escapeHtml(sectionData.label)}</span>
      <h2>${escapeHtml(sectionData.title)}</h2>
      <p>${escapeHtml(sectionData.copy)}</p>

      <div class="evidence">
        ${sectionData.evidence}
      </div>

      <div class="section-block">
        <span class="pill">What your portfolio needs to help you do next</span>
        <h3>${escapeHtml(job.title)}</h3>
        <p>${escapeHtml(job.description)}</p>
      </div>

      <div class="job-implication">
        <strong>How your recommended portfolio supports this</strong>
        <p>${escapeHtml(job.portfolioDesignImplication)}</p>
      </div>
    </article>
  `;
}

export function renderInvestorProfileJobs(root) {
  document.title = 'AaronBux - Profile + Jobs';

  const state = getState();

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <button class="btn btn-secondary" id="backBtn" type="button">Back</button>
          <div style="text-align: center">
            <div class="brand">AaronBux</div>
            <div class="step-label">How your profile becomes your investing jobs</div>
          </div>
          <button class="btn btn-secondary" id="restartBtn" type="button">Restart</button>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width: 92%"></div></div>
      </header>

      <main class="main">
        <div id="missingState" class="card panel" style="display: none">
          <h2>We could not find your answers.</h2>
          <p class="lead">Complete the assessment before viewing this recommendation summary.</p>
          <button id="startAssessmentBtn" class="btn btn-primary" type="button">Start assessment</button>
        </div>

        <section id="result" style="display: none">
          <div class="card panel result-hero">
            <span class="pill">How your answers become this recommendation</span>
            <h1>How your investing profile and jobs connect</h1>
            <p class="lead">This page explains how your assessment answers lead to your profile and the jobs your investing system must solve next.</p>
          </div>

          <div class="result-grid" id="profileJobsGrid"></div>

          <div class="card panel">
            <h2>WHAT THIS MEANS FOR YOUR INVESTING SYSTEM</h2>
            <p class="lead">These three investor jobs together define the requirements used to shape the investing system you will review next.</p>
          </div>

          <div class="next-row">
            <button id="systemBtn" class="btn btn-primary" type="button">See your investing system</button>
          </div>
        </section>
      </main>
    </div>
  `;

  const backBtn = root.querySelector('#backBtn');
  const restartBtn = root.querySelector('#restartBtn');
  const missingState = root.querySelector('#missingState');
  const result = root.querySelector('#result');

  backBtn.addEventListener('click', () => {
    navigate('recommendation/jobs');
  });

  restartBtn.addEventListener('click', () => {
    resetState();
    navigate('');
  });

  if (!state.answers || Object.keys(state.answers).length === 0) {
    missingState.style.display = 'block';
    root.querySelector('#startAssessmentBtn').addEventListener('click', () => navigate('assessment/1'));
    return;
  }

  const assessmentResult = getAssessmentResult();

  if (!assessmentResult) {
    missingState.style.display = 'block';
    root.querySelector('#startAssessmentBtn').addEventListener('click', () => navigate('assessment/1'));
    return;
  }

  const jobs = resolveInvestorJobs(assessmentResult);
  const jobById = Object.fromEntries(jobs.map((job) => [job.id, job]));

  const stageJob = jobById[JOB_SOURCE_MAP.stage[assessmentResult.stageId]];
  const styleJob = jobById[JOB_SOURCE_MAP.style[assessmentResult.styleId]];
  const modifierJob = jobById[JOB_SOURCE_MAP.modifier[assessmentResult.modifierId]];

  result.style.display = 'block';
  root.querySelector('#profileJobsGrid').innerHTML = `
    ${renderSection(getProfileSection(assessmentResult, state, 'stage'), stageJob)}
    ${renderSection(getProfileSection(assessmentResult, state, 'style'), styleJob)}
    ${renderSection(getProfileSection(assessmentResult, state, 'modifier'), modifierJob)}
  `;

  root.querySelector('#systemBtn').addEventListener('click', () => {
    navigate('recommendation/system');
  });
}

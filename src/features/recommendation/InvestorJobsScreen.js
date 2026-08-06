import {
  getState,
  getAssessmentResult,
  resetState
} from '../../application/state.js';

import { navigate } from '../../application/router.js';
import { resolveInvestorJobs } from '../../domain/investor-jobs-resolver.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderEvidence(evidence) {
  return evidence
    .map(
      (item) => `
        <div class="job-evidence-item">
          <strong>${escapeHtml(item.split(':')[0])}:</strong>
          ${escapeHtml(item.slice(item.indexOf(':') + 1).trim())}
        </div>
      `
    )
    .join('');
}

function renderJobCard(job) {
  return `
    <article class="card panel job-card">
      <h3>${escapeHtml(job.title)}</h3>
      <p>${escapeHtml(job.description)}</p>
      <div class="job-evidence">
        ${renderEvidence(job.answerEvidence)}
      </div>
      <div class="job-implication">
        <strong>Portfolio implication:</strong>
        <p>${escapeHtml(job.portfolioDesignImplication)}</p>
      </div>
    </article>
  `;
}

function renderJobsExplanation(jobs) {
  if (!jobs || !jobs.length) {
    return `
      <p>
        We use your investor profile and answer evidence to connect the jobs you need with the recommended portfolio approach.
      </p>
    `;
  }

  const titles = jobs.map((job) => job.title);
  const headline =
    titles.length === 1
      ? titles[0]
      : titles.length === 2
      ? `${titles[0]} and ${titles[1]}`
      : `${titles[0]}, ${titles[1]}, and ${titles[2]}`;

  return `
    <p>
      Your answers reveal that you need ${escapeHtml(headline.toLowerCase())}.
      This helps explain why the recommended portfolio archetype should support those jobs instead of asking you to manage unrelated complexity.
    </p>
  `;
}

export function renderInvestorJobs(root) {
  document.title = 'AaronBux - Your Investing Jobs';

  const state = getState();

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <button class="btn btn-secondary" id="backBtn" type="button">Back</button>
          <div style="text-align: center">
            <div class="brand">AaronBux</div>
            <div class="step-label">What your answers reveal</div>
          </div>
          <button class="btn btn-secondary" id="restartBtn" type="button">Restart</button>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width: 92%"></div></div>
      </header>

      <main class="main investor-jobs-page">
        <div id="missingState" class="card panel" style="display: none">
          <h2>We could not find your answers.</h2>
          <p class="lead">Complete the assessment before viewing your investing jobs.</p>
          <button id="startAssessmentBtn" class="btn btn-primary" type="button">Start assessment</button>
        </div>

        <section id="result" style="display: none">
          <div class="card panel result-hero">
            <span class="pill">What your answers reveal</span>
            <h1>Your investing jobs</h1>
            <p class="lead">We translate your quiz answers into the jobs your portfolio should support next.</p>
          </div>

          <div class="job-grid" id="jobGrid"></div>

          <div class="card panel" id="assessmentSummary">
            <h2>Our assessment</h2>
            <div id="assessmentExplanation"></div>
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

  backBtn.addEventListener('click', () => {
    navigate('recommendation/profile');
  });

  restartBtn.addEventListener('click', () => {
    resetState();
    navigate('');
  });

  const missingState = root.querySelector('#missingState');
  const result = root.querySelector('#result');

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

  result.style.display = 'block';
  root.querySelector('#jobGrid').innerHTML = jobs.map((job) => renderJobCard(job)).join('');
  root.querySelector('#assessmentExplanation').innerHTML = renderJobsExplanation(jobs);
  root.querySelector('#systemBtn').addEventListener('click', () => {
    navigate('recommendation/system');
  });
}

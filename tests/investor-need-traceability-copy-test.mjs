import assert from 'node:assert/strict';
import { QUESTIONS } from '../src/content/questions.js';
import {
  INVESTOR_NEED_TRACEABILITY_COPY,
  getInvestorNeedTraceability
} from '../src/content/investor-need-traceability-copy.js';

const EXPECTED_TRACEABILITY = {
  setup: {
    not_started: ['A clear starting structure', 'Starting-structure rules', 'Define the purpose of each portfolio part before additional investments are added.'],
    simple_start: ['Clarity about the existing foundation', 'Foundation-clarity rules', 'Show what job each part of the existing foundation performs and whether an important role is missing.'],
    etfs_stocks: ['Organization across existing investments', 'Portfolio-organization rules', 'Organize existing investments by portfolio job so gaps, overlap, and unclear roles become visible.'],
    collected: ['Reconciliation of accumulated investments', 'Investment-reconciliation rules', 'Identify which accumulated investments still belong, which overlap, and which no longer serve a clear portfolio purpose.'],
    established: ['Selective improvement without unnecessary disruption', 'Selective-improvement rules', 'Require a proposed change to provide a defined improvement before altering parts of the portfolio that already work.']
  },
  transition: {
    what_to_do: ['Next-step clarity', 'Next-step rules', 'Translate uncertainty into a clear decision question and an understandable next step.'],
    doing_right: ['Reasoning validation', 'Reasoning-validation rules', 'Test whether the original reason for the current approach still holds before recommending a change.'],
    missing: ['Portfolio-completeness clarity', 'Portfolio-completeness rules', 'Distinguish a genuine missing portfolio role from an additional investment that would only duplicate existing exposure or add complexity.'],
    change: ['Change/no-change clarity', 'Change/no-change rules', 'Define what should trigger reconsideration and what should normally be left alone.'],
    compare: ['Comparison clarity', 'Comparison rules', 'Compare alternatives against the job they need to perform, rather than treating every attractive option as equally useful.']
  },
  decisionStyle: {
    start: ['Starting-decision confidence', 'Starting-decision rules', 'Support an understandable and appropriately bounded first decision without requiring the investor to find a perfect option.'],
    pick: ['Investment-selection clarity', 'Selection rules', 'Compare funds, stocks, or other choices using criteria tied to the portfolio job they are expected to perform.'],
    fit: ['New-idea fit clarity', 'Fit + redundancy rules', 'Require a new idea to improve an existing purpose, fill a missing purpose, or contribute something meaningfully different before adding it.'],
    sell: ['Sell/reduce/leave-alone clarity', 'Action rules', 'Distinguish when an investment should be left alone, reviewed, reduced, replaced, or removed based on whether it still performs its intended job.'],
    enough: ['Research-stopping clarity', 'Research-stopping rules', 'Define what evidence could materially change the decision and stop additional research when it is unlikely to improve the choice.']
  },
  marketPsychology: {
    balance: ['Balance-change context', 'Balance-context rules', 'Explain account-balance changes through the portfolio roles that were affected before treating movement as a reason to act.'],
    market: ['Market-noise filtering', 'Market-signal rules', 'Distinguish market events that materially affect a portfolio role from headlines and movements that do not change the decision.'],
    holding: ['Holding-specific review clarity', 'Holding-review rules', 'Evaluate news or price movement by whether it changes the reason an investment belongs in the portfolio.'],
    idea: ['New-idea attention control', 'New-idea attention rules', 'Prevent a new idea from becoming a portfolio decision until its purpose, fit, and overlap have been evaluated.'],
    rarely: ['Meaningful exception alerts', 'Exception-alert rules', 'Surface only the limited events that materially affect a portfolio role or require an investor decision.']
  },
  evolution: {
    understand: ['Portfolio-role clarity', 'Portfolio-role rules', 'Assign every important part of the portfolio a clear job and expected contribution.'],
    monitor: ['Monitoring clarity', 'Monitoring rules', 'Define what information matters for each portfolio role and what information can normally be ignored.'],
    frequency: ['Review-frequency clarity', 'Review-cadence rules', 'Define when each portfolio part should be reviewed and what should trigger an earlier review.'],
    effort: ['Improvement-effort clarity', 'Improvement-effort rules', 'Direct research and effort toward changes that can meaningfully improve the portfolio rather than changes that only add complexity.'],
    experiment: ['Safe experimentation and evolution', 'Bounded-experimentation rules', 'Give new ideas a defined purpose, limit, and review point so experimentation cannot disrupt the portfolio foundation.']
  },
  tradeoff: {
    tell_me: ['Minimal guided involvement', 'Guided-interaction rules', 'Keep routine decisions limited and direct attention only to situations that genuinely require investor review.'],
    occasional: ['Light, exception-based involvement', 'Exception-based interaction rules', 'Keep routine portfolio attention low and require action only when a defined review condition is reached.'],
    periodic: ['A predictable review rhythm', 'Scheduled-review rules', 'Organize portfolio decisions around planned reviews rather than continuous reactions to market events.'],
    explore: ['Bounded research freedom', 'Bounded-research rules', 'Contain deeper research within selected portfolio roles so it does not increase the effort required across the entire portfolio.'],
    active: ['Structured active involvement', 'Active-involvement rules', 'Organize frequent monitoring and decisions within explicit portfolio-role, allocation, and action boundaries.']
  },
  age: {
    under3: ['Near-term access and stability', 'Near-term capital rules', 'Keep money needed soon accessible and protected from portfolio risks that require more time to recover.'],
    '3to5': ['Medium-term dependability and flexibility', 'Medium-term capital rules', 'Separate money that must become dependable within three to five years from money that can remain invested longer.'],
    '5to10': ['Balanced progress and flexibility', 'Intermediate-horizon rules', 'Balance continued growth with increasing flexibility as the expected use of the money approaches.'],
    '10plus': ['Long-term growth consistency', 'Long-term capital rules', 'Protect the long-term return engine from unnecessary decisions driven by short-term market movement.'],
    multiple: ['Separation by goal and timeline', 'Multi-horizon rules', 'Separate money with different goals and timelines so each part can follow an appropriate growth, stability, and review policy.'],
    unsure: ['Purpose and timeline clarification', 'Timeline-uncertainty rules', 'Preserve flexibility and avoid unnecessary commitment until the purpose and expected use of the money become clearer.']
  },
  goals: {
    start_confident: ['Confident starting guidance', 'Confident-start rules', 'Present a clear first structure and explain why each part is included before introducing additional choices.'],
    understand: ['Whole-portfolio understanding', 'Whole-portfolio rules', 'Show how individual investments work together and what each one contributes to the overall system.'],
    monitor: ['Attention prioritization', 'Attention-priority rules', 'Identify what deserves investor attention, why it matters, and which portfolio decision it could change.'],
    act: ['Act/leave-alone clarity', 'Act/leave-alone rules', 'Distinguish when something should be monitored, reviewed, changed, or deliberately left alone.'],
    choose: ['Repeatable investment selection', 'Repeatable-selection rules', 'Evaluate investment choices using consistent criteria tied to the role they must perform in the portfolio.'],
    explore: ['Purposeful, bounded exploration', 'Exploration rules', 'Require every experiment to have a defined purpose, allocation limit, and review point before it enters the portfolio.'],
    income: ['Dependable income and capital protection', 'Income-and-protection rules', 'Separate money needed for dependable income or access from money that can remain invested for longer-term growth.']
  }
};

const questionIds = QUESTIONS.map(({ screenKey }) => screenKey);
const catalogueQuestionIds = Object.keys(INVESTOR_NEED_TRACEABILITY_COPY);

assert.equal(
  new Set(questionIds).size,
  questionIds.length,
  'Every quiz screenKey is unique'
);
assert.deepEqual(
  [...catalogueQuestionIds].sort(),
  [...questionIds].sort(),
  'Every current quiz screenKey has exactly one catalogue group, with no extra groups'
);

let mappedResponseCount = 0;
const catalogueSnapshot = JSON.stringify(INVESTOR_NEED_TRACEABILITY_COPY);

for (const question of QUESTIONS) {
  const group = INVESTOR_NEED_TRACEABILITY_COPY[question.screenKey];
  const optionIds = question.options.map(({ id }) => id);
  const catalogueOptionIds = Object.keys(group);

  assert.equal(
    new Set(optionIds).size,
    optionIds.length,
    `Every option ID for ${question.screenKey} is unique`
  );
  assert.deepEqual(
    [...catalogueOptionIds].sort(),
    [...optionIds].sort(),
    `Every option for ${question.screenKey} has exactly one record, with no extra records`
  );
  assert.ok(Object.isFrozen(group), `${question.screenKey} group is frozen`);

  for (const option of question.options) {
    const record = group[option.id];
    const [expectedInvestorNeed, expectedLabel, expectedCopy] =
      EXPECTED_TRACEABILITY[question.screenKey][option.id];
    const resolvedRecord = getInvestorNeedTraceability(question.screenKey, option.id);
    mappedResponseCount += 1;

    assert.ok(Object.isFrozen(record), `${question.screenKey}.${option.id} record is frozen`);
    assert.equal(typeof record.investorNeed, 'string', `${question.screenKey}.${option.id} has string copy`);
    assert.notEqual(record.investorNeed.trim(), '', `${question.screenKey}.${option.id} has non-empty copy`);
    assert.equal(record.investorNeed, expectedInvestorNeed, `${question.screenKey}.${option.id} preserves its investor need`);
    assert.deepEqual(
      Object.keys(record.portfolioConsequence).sort(),
      ['copy', 'label'],
      `${question.screenKey}.${option.id} consequence contains exactly label and copy`
    );
    assert.ok(
      Object.isFrozen(record.portfolioConsequence),
      `${question.screenKey}.${option.id} consequence is frozen`
    );
    assert.equal(typeof record.portfolioConsequence.label, 'string', `${question.screenKey}.${option.id} has a string consequence label`);
    assert.notEqual(record.portfolioConsequence.label.trim(), '', `${question.screenKey}.${option.id} has a non-empty consequence label`);
    assert.equal(record.portfolioConsequence.label, expectedLabel, `${question.screenKey}.${option.id} has the expected consequence label`);
    assert.equal(typeof record.portfolioConsequence.copy, 'string', `${question.screenKey}.${option.id} has string consequence copy`);
    assert.notEqual(record.portfolioConsequence.copy.trim(), '', `${question.screenKey}.${option.id} has non-empty consequence copy`);
    assert.equal(record.portfolioConsequence.copy, expectedCopy, `${question.screenKey}.${option.id} has the expected consequence copy`);
    assert.strictEqual(
      resolvedRecord,
      record,
      `${question.screenKey}.${option.id} resolves by IDs to its exact catalogue record`
    );
    assert.equal(resolvedRecord.portfolioConsequence.label, expectedLabel, `${question.screenKey}.${option.id} lookup returns the expected label`);
    assert.equal(resolvedRecord.portfolioConsequence.copy, expectedCopy, `${question.screenKey}.${option.id} lookup returns the expected copy`);
  }
}

assert.equal(mappedResponseCount, 43, 'The current catalogue maps exactly 43 responses');
assert.ok(Object.isFrozen(INVESTOR_NEED_TRACEABILITY_COPY), 'Top-level catalogue is frozen');

assert.equal(getInvestorNeedTraceability('unknown-question', 'start'), null, 'Unknown question IDs return null');
assert.equal(getInvestorNeedTraceability('setup', 'unknown-option'), null, 'Unknown option IDs return null');

const invalidLookups = [
  [],
  [undefined, undefined],
  [null, null],
  [1, 2],
  [{}, {}],
  [[], []],
  ['setup', undefined],
  [undefined, 'not_started']
];

for (const args of invalidLookups) {
  assert.equal(getInvestorNeedTraceability(...args), null, `Invalid lookup ${JSON.stringify(args)} returns null`);
}

assert.notStrictEqual(
  getInvestorNeedTraceability('evolution', 'understand'),
  getInvestorNeedTraceability('goals', 'understand'),
  'Question and option IDs, rather than labels or option IDs alone, identify records'
);

assert.equal(
  JSON.stringify(INVESTOR_NEED_TRACEABILITY_COPY),
  catalogueSnapshot,
  'Lookups do not mutate the catalogue or its records'
);

console.log('Investor need traceability copy tests passed.');

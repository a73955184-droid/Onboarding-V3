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

const EXPECTED_CAPABILITIES = {
  setup: {
    not_started: ['Portfolio-architecture framework', 'Establish a small set of defined portfolio roles before presenting additional investments or optional exposures.'],
    simple_start: ['Foundation diagnostic framework', 'Map the existing foundation to portfolio jobs and identify any missing, unclear, or unsupported role.'],
    etfs_stocks: ['Portfolio role-mapping framework', 'Assign existing investments to portfolio roles and reveal where exposures overlap, leave gaps, or lack a defined purpose.'],
    collected: ['Portfolio reconciliation framework', 'Review accumulated investments against their intended jobs and classify them as contributing, overlapping, unclear, or no longer needed.'],
    established: ['Controlled-improvement framework', 'Test whether a proposed change solves a defined limitation and whether its benefit justifies disrupting the existing system.']
  },
  transition: {
    what_to_do: ['Decision-framing framework', 'Convert a broad concern into the specific portfolio question being decided and the next step needed to resolve it.'],
    doing_right: ['Decision-validation framework', 'Compare the current approach with its original purpose, assumptions, and portfolio role before treating doubt as a reason to change.'],
    missing: ['Gap-and-redundancy framework', 'Identify whether the portfolio lacks a necessary job or whether a proposed addition duplicates a job already being performed.'],
    change: ['Change-detection framework', 'Distinguish ordinary market movement from a meaningful reason to review or change something.'],
    compare: ['Comparison framework', 'Compare options against the portfolio job they are meant to perform and the tradeoffs each introduces.']
  },
  decisionStyle: {
    start: ['Starting-decision framework', 'Present a coherent first step, explain the role it establishes, and limit the number of decisions required to begin.'],
    pick: ['Role-based selection framework', 'Evaluate investment choices using criteria derived from the required portfolio role, expected contribution, risks, costs, and effort.'],
    fit: ['Fit-evaluation framework', 'Test where the idea belongs, what it adds, what it overlaps with, and whether it improves the existing portfolio enough to justify inclusion.'],
    sell: ['Action-decision framework', 'Structure the choice among leave alone, monitor, review, reduce, replace, or exit based on whether the investment still performs its intended role.'],
    enough: ['Research-stopping framework', 'Identify the remaining information that could change the decision and conclude research when additional evidence is unlikely to alter the result.']
  },
  marketPsychology: {
    balance: ['Balance-attribution framework', 'Connect account-level movement to the portfolio parts that caused it and determine whether any affected role actually requires review.'],
    market: ['Market-signal filtering framework', 'Route market events to the roles they may affect and suppress information that does not alter a portfolio assumption or decision.'],
    holding: ['Holding-thesis review framework', 'Test new holding-specific information against the investment’s intended job and original reason for inclusion.'],
    idea: ['Idea-intake framework', 'Hold new ideas in an evaluation stage until the system identifies their proposed role, contribution, overlap, and decision relevance.'],
    rarely: ['Decision-relevant alerting framework', 'Notify the investor only when new information crosses a defined threshold or creates a decision that cannot reasonably wait.']
  },
  evolution: {
    understand: ['Portfolio-role definition framework', 'Define what each portfolio part is meant to accomplish and how it contributes to the overall system.'],
    monitor: ['Role-based monitoring framework', 'Connect each portfolio role to relevant signals, ignorable noise, and the information that could justify review.'],
    frequency: ['Review-cadence framework', 'Assign planned review intervals and exception triggers according to the purpose and attention needs of each portfolio role.'],
    effort: ['Effort-allocation framework', 'Show where additional research could improve a meaningful portfolio outcome and where more effort would only increase complexity.'],
    experiment: ['Bounded-experimentation framework', 'Contain experimental ideas within explicit role, allocation, and review boundaries while protecting the portfolio foundation.']
  },
  tradeoff: {
    tell_me: ['Guided-interaction framework', 'Minimize routine decisions and surface only the limited questions or exceptions that require investor input.'],
    occasional: ['Exception-management framework', 'Keep the portfolio low-maintenance until a defined role, threshold, or review condition is materially affected.'],
    periodic: ['Scheduled-review framework', 'Consolidate routine portfolio decisions into repeatable review periods while allowing earlier review only for meaningful exceptions.'],
    explore: ['Research-boundary framework', 'Identify where deeper research is permitted and keep the remaining portfolio roles on a stable, lower-effort operating rhythm.'],
    active: ['Structured-engagement framework', 'Support frequent involvement while tying attention and action to defined roles, limits, and decision conditions.']
  },
  age: {
    under3: ['Near-term capital protection framework', 'Separate near-term money, prioritize access and stability, and limit exposure to losses that may not recover before the money is needed.'],
    '3to5': ['Time-horizon segmentation framework', 'Divide medium-term capital from longer-term growth capital and assign each part an appropriate risk and review policy.'],
    '5to10': ['Horizon-transition framework', 'Adjust the balance between growth, stability, and access as the expected use date becomes closer.'],
    '10plus': ['Long-term discipline framework', 'Keep long-term capital governed by its intended horizon and prevent ordinary short-term events from redefining the strategy.'],
    multiple: ['Goal-and-horizon segmentation framework', 'Assign capital to separate goal-based roles with distinct timelines, risk needs, and review expectations.'],
    unsure: ['Timeline-uncertainty framework', 'Maintain adaptable roles and accessible capacity until the investor can define the money’s purpose and expected use.']
  },
  goals: {
    start_confident: ['Guided-start framework', 'Present an understandable initial portfolio structure, explain each role, and defer unnecessary choices until the foundation is clear.'],
    understand: ['Whole-portfolio mapping framework', 'Connect individual investments to portfolio roles and show how those roles combine to support the overall objective.'],
    monitor: ['Attention-prioritization framework', 'Rank information by its relevance to portfolio roles and show which decision, if any, the information could affect.'],
    act: ['Action-threshold framework', 'Classify portfolio situations into leave alone, monitor, review, or change states using explicit decision thresholds.'],
    choose: ['Repeatable-selection framework', 'Apply the same role-based criteria and tradeoff tests whenever comparable investment choices are evaluated.'],
    explore: ['Exploration-governance framework', 'Require experimental ideas to specify their purpose, allowed size, success criteria, and review or exit conditions.'],
    income: ['Income-and-capital protection framework', 'Organize capital into dependable-income, access, protection, and longer-term growth roles with different operating rules.']
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
    const [expectedCapabilityLabel, expectedCapabilityCopy] =
      EXPECTED_CAPABILITIES[question.screenKey][option.id];
    const resolvedRecord = getInvestorNeedTraceability(question.screenKey, option.id);
    mappedResponseCount += 1;

    assert.ok(Object.isFrozen(record), `${question.screenKey}.${option.id} record is frozen`);
    assert.deepEqual(
      Object.keys(record).sort(),
      ['investorNeed', 'portfolioConsequence', 'systemCapability'].sort(),
      `${question.screenKey}.${option.id} contains exactly the traceability fields`
    );
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
    assert.deepEqual(
      Object.keys(record.systemCapability).sort(),
      ['copy', 'label'],
      `${question.screenKey}.${option.id} capability contains exactly label and copy`
    );
    assert.ok(
      Object.isFrozen(record.systemCapability),
      `${question.screenKey}.${option.id} capability is frozen`
    );
    assert.equal(typeof record.systemCapability.label, 'string', `${question.screenKey}.${option.id} has a string capability label`);
    assert.notEqual(record.systemCapability.label.trim(), '', `${question.screenKey}.${option.id} has a non-empty capability label`);
    assert.equal(record.systemCapability.label, expectedCapabilityLabel, `${question.screenKey}.${option.id} has the expected capability label`);
    assert.equal(typeof record.systemCapability.copy, 'string', `${question.screenKey}.${option.id} has string capability copy`);
    assert.notEqual(record.systemCapability.copy.trim(), '', `${question.screenKey}.${option.id} has non-empty capability copy`);
    assert.equal(record.systemCapability.copy, expectedCapabilityCopy, `${question.screenKey}.${option.id} has the expected capability copy`);
    assert.strictEqual(
      resolvedRecord,
      record,
      `${question.screenKey}.${option.id} resolves by IDs to its exact catalogue record`
    );
    assert.equal(resolvedRecord.portfolioConsequence.label, expectedLabel, `${question.screenKey}.${option.id} lookup returns the expected label`);
    assert.equal(resolvedRecord.portfolioConsequence.copy, expectedCopy, `${question.screenKey}.${option.id} lookup returns the expected copy`);
    assert.equal(resolvedRecord.systemCapability.label, expectedCapabilityLabel, `${question.screenKey}.${option.id} lookup returns the expected capability label`);
    assert.equal(resolvedRecord.systemCapability.copy, expectedCapabilityCopy, `${question.screenKey}.${option.id} lookup returns the expected capability copy`);
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

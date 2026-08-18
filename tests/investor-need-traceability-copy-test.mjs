import assert from 'node:assert/strict';
import { QUESTIONS } from '../src/content/questions.js';
import {
  INVESTOR_NEED_TRACEABILITY_COPY,
  getInvestorNeedTraceability
} from '../src/content/investor-need-traceability-copy.js';

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
    mappedResponseCount += 1;

    assert.ok(Object.isFrozen(record), `${question.screenKey}.${option.id} record is frozen`);
    assert.equal(typeof record.investorNeed, 'string', `${question.screenKey}.${option.id} has string copy`);
    assert.notEqual(record.investorNeed.trim(), '', `${question.screenKey}.${option.id} has non-empty copy`);
    assert.strictEqual(
      getInvestorNeedTraceability(question.screenKey, option.id),
      record,
      `${question.screenKey}.${option.id} resolves by IDs to its exact catalogue record`
    );
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

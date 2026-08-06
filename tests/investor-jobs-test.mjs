import assert from 'node:assert';
import fs from 'node:fs';
import { generateAssessmentResult } from '../src/domain/assessment-engine.js';
import { resolveInvestorJobs } from '../src/domain/investor-jobs-resolver.js';
import { renderInvestorJobs } from '../src/features/recommendation/InvestorJobsScreen.js';

const sampleAnswers = {
  setup: ['simple_start'],
  transition: ['doing_right'],
  decisionStyle: ['pick'],
  marketPsychology: 'market',
  evolution: 'understand',
  tradeoff: 'occasional',
  age: '5to10',
  goals: ['understand']
};

const assessmentResult = generateAssessmentResult(sampleAnswers);
assert(assessmentResult, 'Expected assessmentResult to be generated');
assert(Array.isArray(assessmentResult.jobs), 'Expected jobs property on assessmentResult');
assert(assessmentResult.jobs.length >= 2, 'Expected at least two resolved jobs');

for (const job of assessmentResult.jobs) {
  assert.strictEqual(typeof job.id, 'string');
  assert.strictEqual(typeof job.title, 'string');
  assert.strictEqual(typeof job.description, 'string');
  assert(Array.isArray(job.answerEvidence), 'Expected answerEvidence array');
  assert(job.answerEvidence.length > 0, 'Expected each job to include answer evidence');
  assert.strictEqual(typeof job.portfolioDesignImplication, 'string');
}

assert.strictEqual(typeof renderInvestorJobs, 'function', 'Expected InvestorJobsScreen export to load');

const css = fs.readFileSync(new URL('../assets/css/recommendation.css', import.meta.url), 'utf8');
const forbiddenTokens = [':root', '--accent', '--bg', '--surface', '--text', '--muted', '--radius'];
for (const token of forbiddenTokens) {
  assert(!css.includes(token), `CSS must not redefine shared token or :root: ${token}`);
}

const jobs = resolveInvestorJobs(assessmentResult);
assert.strictEqual(jobs.length, assessmentResult.jobs.length, 'Resolver should be deterministic with the generated result');

console.log('Investor jobs test passed.');

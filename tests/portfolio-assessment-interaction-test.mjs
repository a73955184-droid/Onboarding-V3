import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  revealCurationAssessment
} from '../src/features/recommendation/PortfolioMapScreen.js';


const focusCalls = [];
const scrollCalls = [];
const assessmentElement = {
  focus(options) {
    focusCalls.push(options);
  },
  scrollIntoView(options) {
    scrollCalls.push(options);
  }
};
const container = {
  querySelector(selector) {
    assert.equal(selector, '[data-curation-assessment]');
    return assessmentElement;
  }
};

assert.equal(revealCurationAssessment(container), true);
assert.deepEqual(focusCalls, [{ preventScroll: true }]);
assert.deepEqual(scrollCalls, [{ behavior: 'smooth', block: 'nearest' }]);
assert.equal(
  revealCurationAssessment({ querySelector: () => null }),
  false
);


const source = fs.readFileSync(
  new URL(
    '../src/features/recommendation/PortfolioMapScreen.js',
    import.meta.url
  ),
  'utf8'
);
const branchStart = source.indexOf(
  "action === 'assess-fit' && candidateId"
);
const branchEnd = source.indexOf(
  "action === 'add' && candidateId",
  branchStart
);
const assessmentBranch = source.slice(branchStart, branchEnd);

assert.ok(branchStart > -1, 'Delegated Assess fit click branch exists');
assert.match(assessmentBranch, /assessingSleeveId = sleeve\.id/);
assert.match(assessmentBranch, /updateAllocationPanel\(sleeve\)/);
assert.match(
  assessmentBranch,
  /revealCurationAssessment\(allocationPanel\)/
);
assert.match(assessmentBranch, /globalThis\.setTimeout/);
assert.match(assessmentBranch, /resolveSecurityDecisionSupport\(\{/);
assert.match(assessmentBranch, /setCurationAssessment\(/);
assert.match(assessmentBranch, /assessmentStatus: 'unavailable'/);
assert.doesNotMatch(assessmentBranch, /resolveSecurityPortfolioFit/);
assert.doesNotMatch(assessmentBranch, /addCurationHolding\(/);
assert.doesNotMatch(assessmentBranch, /removeCurationHolding\(/);
assert.doesNotMatch(assessmentBranch, /replaceCurationHolding\(/);
assert.match(source, /action === 'add-existing-holding' && candidateId/);
assert.match(source, /action === 'remove-existing-holding'/);
assert.match(source, /Assessing&amp;hellip;|Assessing&hellip;/);
assert.match(
  source,
  /Comparing this investment with the current portfolio&hellip;/
);
assert.match(source, /data-curation-assessment/);
assert.match(source, /tabindex="-1"/);

console.log(
  'Portfolio assessment interaction test passed: click handling shows pending feedback, stores the result, rerenders and reveals the assessment.'
);

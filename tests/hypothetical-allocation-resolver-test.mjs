import assert from 'node:assert/strict';

import {
  resolveEqualWeightAllocation
} from '../src/domain/portfolio-system/hypothetical-allocation-resolver.js';


const twoHoldings = resolveEqualWeightAllocation({
  sleeveWeight: 0.2,
  securityIds: ['qual', 'avuv']
});

assert.deepEqual(
  twoHoldings.holdings.map(({ weight }) => weight),
  [0.1, 0.1]
);
assert.equal(twoHoldings.displayTotal, 0.2);

const thirds = resolveEqualWeightAllocation({
  sleeveWeight: 0.1,
  securityIds: ['vti', 'vbr', 'qual']
});

assert.equal(
  thirds.holdings.reduce(
    (total, holding) =>
      total + holding.displayWeight,
    0
  ),
  0.1
);

assert.equal(
  resolveEqualWeightAllocation({
    sleeveWeight: 0.1,
    securityIds: []
  }).state,
  'unallocated-within-hypothetical-portfolio'
);

assert.throws(
  () => resolveEqualWeightAllocation({
    sleeveWeight: 0.1,
    securityIds: ['vti', 'vti']
  }),
  /unique/
);

console.log(
  'Hypothetical allocation resolver test passed: equal weights preserve sleeve totals.'
);


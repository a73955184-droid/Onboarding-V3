import assert from 'node:assert';
import { normalizeWeights, calculateSleeveArcs, renderPortfolioRing } from '../src/features/recommendation/portfolio-ring.js';
import { composePortfolioSystem } from '../src/domain/portfolio-system/portfolio-composer.js';

// basic normalization tests
const sleevesA = [ { id: 'a', weight: 0.7 }, { id: 'b', weight: 0.2 }, { id: 'c', weight: 0.1 } ];
const normA = normalizeWeights(sleevesA);
assert(normA.length === 3, 'normalization length');
assert(Math.abs(normA.reduce((s,n)=>s+n,0) - 1) < 0.0001, 'normalized sums to 1');

// percentage-style weights
const sleevesB = [ { id: 'a', weight: 70 }, { id: 'b', weight: 20 }, { id: 'c', weight: 10 } ];
const normB = normalizeWeights(sleevesB);
assert(Math.abs(normB[0] - 0.7) < 0.0001, 'percent style normalized');

// zero weights fallback
const sleevesZero = [ { id: 'a', weight: 0 }, { id: 'b', weight: 0 } ];
const normZ = normalizeWeights(sleevesZero);
assert(Math.abs(normZ[0] - 0.5) < 0.0001, 'zero weights split equally');

// arcs
const arcs = calculateSleeveArcs(sleevesA);
assert(arcs.length === sleevesA.length, 'arcs count match sleeves');

// render produces entries for each sleeve id
const svg = renderPortfolioRing({ sleeves: sleevesA, selectedSleeveId: 'a' });
for (const s of sleevesA) {
  assert(svg.includes(`data-sleeve-id="${s.id}"`), `svg includes ${s.id}`);
}

// compose a real portfolio system for an archetype
const assessmentResult = {
  archetypeId: 'ES',
  stageId: 'portfolio_organizer',
  styleId: 'steady_steward',
  signals: [],
  modifierId: 'validation_seeker',
  timeHorizon: 'long'
};

const composed = composePortfolioSystem(assessmentResult);
assert(composed && Array.isArray(composed.sleeves) && composed.sleeves.length >= 2, 'composed portfolio produced sleeves');

console.log('Portfolio map tests passed.');

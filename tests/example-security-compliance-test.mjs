import assert from 'node:assert/strict';

import {
  SECURITY_REFERENCE
} from '../src/domain/portfolio-system/security-reference.js';

import {
  EXAMPLE_SECURITY_ASSOCIATIONS,
  TACTICAL_FUND_DEFERRED_REASON
} from '../src/domain/portfolio-system/example-securities.js';

import {
  EXAMPLE_SECURITY_CONTEXTS
} from '../src/domain/portfolio-system/example-security-context.js';

import {
  EXAMPLE_SECURITY_VARIANT_GUIDANCE
} from '../src/domain/portfolio-system/example-security-variant-guidance.js';


const strings = [];

for (const security of Object.values(SECURITY_REFERENCE)) {
  strings.push(
    security.name,
    security.securityType,
    security.issuer,
    security.exposureSummary
  );
}

for (const association of EXAMPLE_SECURITY_ASSOCIATIONS) {
  strings.push(
    association.implementationNote,
    association.deferredReason
  );
}

for (const context of EXAMPLE_SECURITY_CONTEXTS) {
  strings.push(
    context.portfolioJob,
    context.whyItFits,
    context.whyItMayNotFit,
    context.diversificationContribution,
    ...context.primaryRisks,
    context.overlapCheck,
    context.monitoring,
    context.reconsiderWhen,
    context.exampleType,
    context.disclosure
  );
}

for (const guidance of Object.values(EXAMPLE_SECURITY_VARIANT_GUIDANCE)) {
  strings.push(
    guidance.comparisonDepth,
    guidance.monitoringBurden,
    guidance.implementationRule
  );
}

strings.push(TACTICAL_FUND_DEFERRED_REASON);

const corpus = strings.filter(Boolean).join('\n');

const prohibitedPhrases = [
  'you should buy',
  'you should sell',
  'we recommend',
  'recommended security',
  'best etf',
  'best fund',
  'safe investment',
  'guaranteed',
  'guarantee',
  'will reduce losses',
  'prevents losses',
  'will increase returns',
  'will outperform',
  'meets the -1.9%',
  'meets the −1.9%',
  'downside floor',
  'loss floor',
  'optimal portfolio'
];

for (const phrase of prohibitedPhrases) {
  assert.ok(
    !corpus.toLowerCase().includes(phrase.toLowerCase()),
    'Prohibited phrase found: ' + phrase
  );
}

assert.doesNotMatch(
  corpus,
  /\b(?:expected|projected|forecast|target)\s+(?:annual\s+)?returns?\b[^\n]*\d+(?:\.\d+)?\s*%/i,
  'Numeric expected-return claim found'
);

assert.doesNotMatch(
  corpus,
  /\b(?:ytd|one-year|three-year|five-year|current performance|past performance)\b/i,
  'Current or historical performance claim found'
);

assert.doesNotMatch(
  corpus,
  /\b(?:current yield|sec yield|distribution yield|yield is)\b/i,
  'Current yield claim found'
);

assert.doesNotMatch(
  corpus,
  /\bprice target\b|\btarget price\b|\$\s*\d+(?:\.\d+)?/i,
  'Price target or current price claim found'
);

assert.doesNotMatch(
  corpus,
  /\b(?:buy|sell|hold)\s+(?:this|the|shares?\s+of|[A-Z]{1,5}\b)/,
  'Buy, sell or hold instruction found'
);

assert.doesNotMatch(
  corpus,
  /\b(?:appropriate|suitable)\s+for\s+(?:all|every)\s+investors?\b/i,
  'Universal investor-suitability claim found'
);

assert.doesNotMatch(
  corpus,
  /diversification\s+(?:ensures|protects|eliminates|prevents)/i,
  'Diversification-protection claim found'
);

console.log('Example security compliance test passed.');
console.log('Scanned all newly authored user-facing catalogue strings.');

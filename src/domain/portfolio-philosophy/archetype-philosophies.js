import { CLAIM_TYPES } from './philosophy-constants.js';

export const ARCHETYPE_PHILOSOPHIES = Object.freeze({
  ES: {
    archetypeId: 'ES',

    philosophyName:
      'Simple diversified long-term investing',

    summary:
      'Use broad diversified exposures, separate essential portfolio roles, and avoid unnecessary complexity and intervention.',

    governingPrinciples: [
      'broad-diversification',
      'strategic-long-term-core',
      'portfolio-simplicity',
      'low-unnecessary-intervention'
    ],

    sourceIds: [
      'FIDELITY_SIMPLE_DIVERSIFIED',
      'FIDELITY_DIVERSIFICATION'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  GD: {
    archetypeId: 'GD',

    philosophyName:
      'Global strategic diversification',

    summary:
      'Spread portfolio exposure across geographic and economic return sources so outcomes do not depend excessively on one market.',

    governingPrinciples: [
      'global-diversification',
      'regional-diversification',
      'multiple-return-sources'
    ],

    sourceIds: [
      'FIDELITY_DIVERSIFICATION'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  FT: {
    archetypeId: 'FT',

    philosophyName:
      'Strategic core with systematic improvements',

    summary:
      'Keep a durable strategic core dominant and permit only bounded improvements with a clearly stated purpose.',

    governingPrinciples: [
      'strategic-core',
      'bounded-satellites',
      'factor-investing',
      'explicit-improvement-purpose'
    ],

    sourceIds: [
      'BLACKROCK_CORE_SATELLITE',
      'MSCI_FACTOR_INVESTING'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  BFO: {
    archetypeId: 'BFO',

    philosophyName:
      'Role-based multi-purpose portfolio',

    summary:
      'Assign different pools of capital distinct jobs across growth, stability, income, liquidity and diversification.',

    governingPrinciples: [
      'goal-based-investing',
      'capital-by-purpose',
      'role-separation'
    ],

    sourceIds: [
      'JPM_GOALS_BASED'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  GA: {
    archetypeId: 'GA',

    philosophyName:
      'Growth core with bounded alternative return sources',

    summary:
      'Preserve a dominant growth foundation while adding bounded exposures with economic drivers different from the core.',

    governingPrinciples: [
      'growth-core',
      'alternative-diversification',
      'real-assets',
      'bounded-non-core-exposure'
    ],

    sourceIds: [
      'BLACKROCK_CORE_SATELLITE',
      'FIDELITY_ALTERNATIVES'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  TO: {
    archetypeId: 'TO',

    philosophyName:
      'Strategic core with bounded tactical opportunity',

    summary:
      'Separate permanent strategic capital from tactical, thematic and security-specific decisions so short-term views cannot redefine the whole portfolio.',

    governingPrinciples: [
      'strategic-core',
      'tactical-allocation',
      'bounded-opportunity-capital'
    ],

    sourceIds: [
      'BLACKROCK_CORE_SATELLITE',
      'CFA_PORTFOLIO_PLANNING'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  IP: {
    archetypeId: 'IP',

    philosophyName:
      'Needs-based income and preservation',

    summary:
      'Separate liquidity, dependable income, resilience, purchasing-power protection and measured growth into distinct portfolio roles.',

    governingPrinciples: [
      'liquidity-constraint',
      'income-role',
      'capital-preservation',
      'inflation-protection',
      'measured-growth'
    ],

    sourceIds: [
      'CFA_PORTFOLIO_PLANNING',
      'JPM_GOALS_BASED',
      'FIDELITY_INFLATION'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  }
});

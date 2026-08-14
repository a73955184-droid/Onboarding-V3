import { CLAIM_TYPES } from './philosophy-constants.js';

export const VARIANT_PHILOSOPHIES = Object.freeze({
  essential: {
    variantId: 'essential',

    philosophyName:
      'Minimum structural expression',

    summary:
      'Express the portfolio philosophy using the smallest set of broad roles required for the system to function.',

    characteristics: {
      sleeveGranularity: 'broad',
      structuralComplexity: 'low',
      optionalCapacity: 'minimal',
      reviewDetail: 'low'
    },

    prohibitedInterpretations: [
      'Essential does not mean conservative.',
      'Essential does not automatically mean lower risk.',
      'Essential does not mean beginner.'
    ],

    claimType: CLAIM_TYPES.AARONBUX_DESIGN
  },

  intentional: {
    variantId: 'intentional',

    philosophyName:
      'Explicit role separation',

    summary:
      'Separate exposures where doing so improves understanding, control, monitoring or decision quality.',

    characteristics: {
      sleeveGranularity: 'moderate',
      structuralComplexity: 'moderate',
      optionalCapacity: 'bounded',
      reviewDetail: 'scheduled'
    },

    prohibitedInterpretations: [
      'Intentional does not imply higher expected return.',
      'Intentional does not automatically imply higher risk.'
    ],

    claimType: CLAIM_TYPES.AARONBUX_DESIGN
  },

  engaged: {
    variantId: 'engaged',

    philosophyName:
      'Strategic foundation with bounded higher-engagement capacity',

    summary:
      'Preserve the portfolio strategic foundation while exposing more granular, research-intensive or conditional roles.',

    characteristics: {
      sleeveGranularity: 'high',
      structuralComplexity: 'higher',
      optionalCapacity: 'explicit',
      reviewDetail: 'higher'
    },

    prohibitedInterpretations: [
      'Engaged does not mean the entire portfolio should be actively traded.',
      'Engaged does not automatically mean aggressive.'
    ],

    claimType: CLAIM_TYPES.AARONBUX_DESIGN
  }
});

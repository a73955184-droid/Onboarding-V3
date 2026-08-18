import { CLAIM_TYPES } from './philosophy-constants.js';

export const ARCHETYPE_PHILOSOPHIES = Object.freeze({
  ES: {
    archetypeId: 'ES',

    investorProblem: {
      question:
        'How do I establish a coherent portfolio?',

      meaning:
        'The investor’s main problem is not optimization yet; it is structure. They may have scattered holdings, a retirement account, or a few funds, but not a clear system. This archetype is about turning “things I own” into a portfolio with a sensible foundation, understandable roles, and a way to know what belongs or does not belong.'
    },

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

    variantJobImpact: {
      evolution: {
        level: 'Low'
      },

      interaction: {
        level: 'High'
      },

      decisionMaking: {
        level: 'Medium'
      },

      mainReason:
        'Accommodate involvement without losing simplicity'
    },

    sourceIds: [
      'FIDELITY_SIMPLE_DIVERSIFIED',
      'FIDELITY_DIVERSIFICATION'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  GD: {
    archetypeId: 'GD',

    investorProblem: {
      question:
        'How do I avoid depending on a narrow set of markets?',

      meaning:
        'The core problem is concentration. The investor wants broad participation in global economic growth rather than relying too heavily on one country, one asset class, one sector, or a small set of return drivers. The job of the system is to spread exposure deliberately and reduce dependence on any single source of performance.'
    },

    philosophyName:
      'Global strategic diversification',

    summary:
      'Spread portfolio exposure across geographic and economic return sources so outcomes do not depend excessively on one market.',

    governingPrinciples: [
      'global-diversification',
      'regional-diversification',
      'multiple-return-sources'
    ],

    variantJobImpact: {
      evolution: {
        level: 'Medium'
      },

      interaction: {
        level: 'High'
      },

      decisionMaking: {
        level: 'Medium–High'
      },

      mainReason:
        'More deliberate diversification'
    },

    sourceIds: [
      'FIDELITY_DIVERSIFICATION'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  FT: {
    archetypeId: 'FT',

    investorProblem: {
      question:
        'How do I systematically tilt beyond market-cap weighting?',

      meaning:
        'The investor already accepts diversification, but wants a more deliberate way to shape the portfolio. Instead of picking individual stocks opportunistically, they want rules-based exposure to characteristics such as value, quality, size, momentum, or similar systematic factors. The question becomes: “Can I improve or express a view without turning the portfolio into stock picking?”'
    },

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

    variantJobImpact: {
      evolution: {
        level: 'Medium'
      },

      interaction: {
        level: 'High'
      },

      decisionMaking: {
        level: 'High'
      },

      mainReason:
        'Research/evaluate systematic improvements'
    },

    sourceIds: [
      'BLACKROCK_CORE_SATELLITE',
      'MSCI_FACTOR_INVESTING'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  BFO: {
    archetypeId: 'BFO',

    investorProblem: {
      question:
        'How do I manage several financial jobs simultaneously?',

      meaning:
        'This investor does not want every dollar doing the same job. Some capital may need to grow, some provide stability, some remain liquid, some generate income, and some may be reserved for selective opportunities. The core problem is role separation and coordination: how do these different pools work together as one wealth system?'
    },

    philosophyName:
      'Role-based multi-purpose portfolio',

    summary:
      'Assign different pools of capital distinct jobs across growth, stability, income, liquidity and diversification.',

    governingPrinciples: [
      'goal-based-investing',
      'capital-by-purpose',
      'role-separation'
    ],

    variantJobImpact: {
      evolution: {
        level: 'High'
      },

      interaction: {
        level: 'High'
      },

      decisionMaking: {
        level: 'Medium'
      },

      mainReason:
        'More differentiated capital jobs'
    },

    sourceIds: [
      'JPM_GOALS_BASED'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  GA: {
    archetypeId: 'GA',

    investorProblem: {
      question:
        'How do I pursue growth while broadening the sources of return?',

      meaning:
        'The investor still wants long-term growth to dominate, but does not want the entire portfolio dependent on conventional public equities and bonds. The problem is finding additional return or diversification engines — potentially alternatives, real assets, or differentiated exposures — without losing the growth orientation of the overall portfolio.'
    },

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

    variantJobImpact: {
      evolution: {
        level: 'Medium'
      },

      interaction: {
        level: 'High'
      },

      decisionMaking: {
        level: 'High'
      },

      mainReason:
        'Research differentiated return sources'
    },

    sourceIds: [
      'BLACKROCK_CORE_SATELLITE',
      'FIDELITY_ALTERNATIVES'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  TO: {
    archetypeId: 'TO',

    investorProblem: {
      question:
        'How do I deliberately make room for changing opportunities?',

      meaning:
        'The investor wants to respond to market conditions, themes, valuation differences, or specific opportunities. The problem is not simply “how do I invest actively?” but “how do I make active decisions without destabilizing the entire portfolio?” A well-designed version of this archetype needs a stable base plus clearly bounded areas where tactical judgment is allowed.'
    },

    philosophyName:
      'Strategic core with bounded tactical opportunity',

    summary:
      'Separate permanent strategic capital from tactical, thematic and security-specific decisions so short-term views cannot redefine the whole portfolio.',

    governingPrinciples: [
      'strategic-core',
      'tactical-allocation',
      'bounded-opportunity-capital'
    ],

    variantJobImpact: {
      evolution: {
        level: 'Medium'
      },

      interaction: {
        level: 'High'
      },

      decisionMaking: {
        level: 'Very High'
      },

      mainReason:
        'Accommodate bounded active judgment'
    },

    sourceIds: [
      'BLACKROCK_CORE_SATELLITE',
      'CFA_PORTFOLIO_PLANNING'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  },

  IP: {
    archetypeId: 'IP',

    investorProblem: {
      question:
        'How do I generate usable income while protecting capital?',

      meaning:
        'Here, the investor’s priority shifts away from maximizing long-term upside. The system needs to support cash flow, liquidity, resilience, and preservation of purchasing power or principal. The main question is how to make the portfolio reliably support real-world needs without exposing too much of the capital base to unnecessary volatility.'
    },

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

    variantJobImpact: {
      evolution: {
        level: 'High'
      },

      interaction: {
        level: 'Medium'
      },

      decisionMaking: {
        level: 'High'
      },

      mainReason:
        'Coordinate real-world capital needs'
    },

    sourceIds: [
      'CFA_PORTFOLIO_PLANNING',
      'JPM_GOALS_BASED',
      'FIDELITY_INFLATION'
    ],

    claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX
  }
});

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

    variantExplanations: {
      essential: {
        copy:
          'The Essential version organizes your investments around a simple foundation for long-term growth, stability, and accessible money. Each category represents a fundamental purpose for your money rather than a particular investment idea or strategy. The system keeps those purposes easy to understand and deliberately limits additional investment ideas, because your answers suggest that getting the foundation organized matters more right now than having more things to research or manage.'
      },

      intentional: {
        copy:
          'The Intentional version keeps the same simple foundation for long-term growth, stability, and accessible money, while giving you room to make selected improvements as your investing needs develop. Your answers suggest that you want to understand what you own and make thoughtful changes without creating unnecessary complexity, so additional investments should have a clear reason for improving diversification, stability, or another existing purpose rather than simply adding more things to the portfolio.'
      },

      engaged: {
        copy:
          'The Engaged version keeps a simple diversified foundation while giving you more room to research and compare different ways of fulfilling its purposes. Your answers suggest that you are comfortable spending more time learning and making investment choices, so the system can accommodate more differentiated investments when they make a meaningful contribution while still protecting the simplicity of the overall portfolio.'
      }
    },

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

    variantExplanations: {
      essential: {
        copy:
          'The Essential version organizes your investments so that long-term growth does not depend too heavily on a single market or part of the world. The categories represent major sources of global participation rather than individual countries, themes, or investment ideas. The system keeps diversification straightforward because your answers suggest that gaining meaningful exposure beyond your dominant market matters more than researching and managing individual geographic opportunities.'
      },

      intentional: {
        copy:
          'The Intentional version keeps global diversification as the foundation while giving selected regions or sources of economic growth a more explicit purpose when they add something meaningfully different. Your answers suggest that you want to understand where your diversification comes from and make thoughtful improvements, so the system lets you examine whether an additional investment reduces an existing concentration or adds a genuinely different source of growth rather than simply increasing the number of markets you own.'
      },

      engaged: {
        copy:
          'The Engaged version organizes global diversification in greater detail because your answers suggest that you are willing to research how different markets, regions, and economic sources contribute to the portfolio. The system gives you more places to express those interests when they serve a distinct diversification purpose, while requiring each addition to improve the portfolio’s global balance rather than becoming an isolated geographic bet.'
      }
    },

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
        'How do I improve an existing portfolio without constantly rebuilding it?',

      meaning:
        'The investor already has a workable portfolio foundation but wants a disciplined way to improve it. The challenge is deciding which limitations are worth addressing, which changes would genuinely add value, and which ideas would only add overlap or complexity. This archetype is about making targeted, evidence-based improvements while keeping the durable parts of the portfolio intact.'
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

    variantExplanations: {
      essential: {
        copy:
          'The Essential version keeps diversified long-term investments as the foundation and allows only a limited, clearly defined improvement beyond them. That improvement exists to change a specific characteristic of the portfolio—such as quality, value, company size, or another systematic investment characteristic—rather than to create a collection of individual investment ideas. Your answers suggest that you want some opportunity to improve the foundation without taking on substantial additional research and decision-making.'
      },

      intentional: {
        copy:
          'The Intentional version keeps diversified investments as the foundation while giving selected systematic improvements their own clearly defined purposes. Your answers suggest that you are willing to investigate whether characteristics such as quality, value, or company size can improve what you already own, so the system gives those ideas a place when you can explain what they are intended to improve and whether that contribution justifies the additional investment.'
      },

      engaged: {
        copy:
          'The Engaged version keeps the diversified foundation intact while allowing you to research and compare multiple systematic ways of improving it. Your answers suggest that you are comfortable spending more time evaluating different investment characteristics, so the system can distinguish among those purposes and let you make more deliberate choices about which improvements deserve a place, without turning that research into individual stock picking.'
      }
    },

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

    variantExplanations: {
      essential: {
        copy:
          'The Essential version organizes your investments around three fundamental purposes: Growth, Stability, and Liquidity. Growth is intended to build wealth over time, Stability helps reduce dependence on growth investments when markets are difficult, and Liquidity keeps money available for near-term needs or flexibility. These are broad categories because each describes a major purpose for your money rather than a particular investment idea or strategy, and the Essential version stops there because your portfolio can gain the organizing benefits of the Balanced Multi-Purpose approach without giving you additional areas to research, compare, or manage.'
      },

      intentional: {
        copy:
          'The Intentional version starts with the same fundamental purposes—Growth, Stability, and Liquidity—but gives selected investment ideas an additional, clearly defined purpose in your portfolio. Your answers suggest that you want room to explore ideas without disrupting what already works, so an additional investment should improve an existing part of the portfolio, add a genuinely different source of diversification or return, or otherwise have a clear reason for being there instead of simply becoming another investment you own.'
      },

      engaged: {
        copy:
          'The Engaged version keeps Growth, Stability, and Liquidity as the foundation while giving more of your investment interests their own defined purposes. Your answers suggest that you are willing to spend more time researching different ways your money can contribute, so the system can distinguish additional purposes such as generating income, adding another source of growth, improving diversification, or pursuing selected opportunities when there is a clear reason to do so, while the fundamental purposes continue to anchor the portfolio.'
      }
    },

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

    variantExplanations: {
      essential: {
        copy:
          'The Essential version keeps long-term growth as the main purpose of the portfolio while adding a limited source of diversification whose behavior or economic drivers differ from conventional growth investments. The additional category has a specific job rather than existing simply because an alternative investment is interesting, and the system keeps that role limited because your answers suggest that you want diversification beyond conventional investments without taking on substantial additional research or complexity.'
      },

      intentional: {
        copy:
          'The Intentional version keeps long-term growth at the center while giving selected alternative sources of return or diversification a clearly defined purpose. Your answers suggest that you are interested in exploring investments beyond conventional markets, so the system gives those ideas a place when they add an economic driver that is meaningfully different from what you already own and when you can identify what contribution the additional investment is expected to make.'
      },

      engaged: {
        copy:
          'The Engaged version keeps growth as the foundation while allowing you to investigate multiple differentiated sources of return and diversification. Your answers suggest that you are willing to spend more time understanding why alternatives, real assets, or other differentiated investments behave differently, so the system can give more of those interests a defined purpose when each adds something distinct rather than simply increasing portfolio complexity.'
      }
    },

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

    variantExplanations: {
      essential: {
        copy:
          'The Essential version separates the investments intended to remain in place for the long term from a limited area for selected opportunities. This allows you to act on an investment idea without allowing that idea to redefine the rest of the portfolio, and the opportunity area remains deliberately limited because your answers suggest that you value some flexibility while still wanting most of your money to follow a stable long-term plan.'
      },

      intentional: {
        copy:
          'The Intentional version keeps the long-term portfolio protected while giving selected opportunities a clearly defined place and purpose. Your answers suggest that you want to act on some market conditions, themes, valuations, or investment ideas, so the system lets you evaluate those opportunities separately—why you are considering them, what you expect them to contribute, and when that reasoning would no longer hold—without continually changing the investments intended to remain long term.'
      },

      engaged: {
        copy:
          'The Engaged version preserves a stable long-term portfolio while giving you more room to research and make decisions about changing opportunities. Your answers suggest that active judgment is an important part of how you want to invest, so the system can accommodate more differentiated themes, market views, or selected investments, but each decision must have a defined purpose and remain separate from the money that is not meant to respond to short-term opportunities.'
      }
    },

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

    variantExplanations: {
      essential: {
        copy:
          'The Essential version organizes your investments around the money you need to keep accessible, the money expected to provide dependable income and stability, and the money that can continue growing for the future. These categories represent fundamental real-world purposes rather than individual investment strategies, and the system keeps them straightforward because meeting those needs reliably matters more than creating additional areas that require research and ongoing decisions.'
      },

      intentional: {
        copy:
          'The Intentional version starts with accessible money, dependable income, stability, and measured long-term growth, while giving important needs a more clearly defined purpose when treating them separately improves the plan. Your answers suggest that you want to make deliberate choices about how the portfolio supports real-world needs, so the system can distinguish concerns such as maintaining purchasing power, improving income, or protecting money needed at different times when doing so helps you make better decisions about that capital.'
      },

      engaged: {
        copy:
          'The Engaged version keeps liquidity, income, preservation, and measured growth as the foundation while allowing you to research different ways of meeting those needs. Your answers suggest that you are willing to spend more time comparing income sources, protection against inflation, stability investments, and growth opportunities, so the system can give those needs more distinct purposes when the differences are useful, while keeping the portfolio focused on supporting real-world spending and capital needs rather than maximizing investment activity.'
      }
    },

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

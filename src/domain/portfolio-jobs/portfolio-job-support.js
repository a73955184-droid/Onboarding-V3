import { PORTFOLIO_ARCHETYPES } from '../portfolio-system/portfolio-archetypes.js';

export const VARIANT_JOB_SUPPORT = Object.freeze({
  essential: {
    reviewGranularity: 'high-level',
    attentionLevel: 'limited',
    structureLevel: 'simple',
    decisionGranularity: 'broad',
    summary:
      'The system stays focused on the biggest portfolio roles and avoids detailed review unless the core plan shifts.'
  },

  intentional: {
    reviewGranularity: 'moderate',
    attentionLevel: 'selective',
    structureLevel: 'balanced',
    decisionGranularity: 'specific',
    summary:
      'Review is focused on the areas that matter most, with enough detail to make deliberate decisions without overreacting.'
  },

  engaged: {
    reviewGranularity: 'detailed',
    attentionLevel: 'active',
    structureLevel: 'nuanced',
    decisionGranularity: 'precise',
    summary:
      'The portfolio is watched more closely, with stronger signals required before making changes.'
  }
});

const ARCHETYPE_JOB_SUPPORT = Object.freeze({
  ES: {
    systemName: PORTFOLIO_ARCHETYPES.ES.systemName,
    philosophy: PORTFOLIO_ARCHETYPES.ES.philosophy,
    invariant: PORTFOLIO_ARCHETYPES.ES.invariant,

    evolutionSupport: {
      description:
        'A broad growth core with essential stability keeps the system simple and easy to evolve in the right direction.',
      details: [
        'Required sleeves anchor the portfolio so it can move forward without changing its fundamental role.',
        'Optional sleeves are limited and remain small, preventing complexity from growing too quickly.'
      ]
    },

    interactionSupport: {
      description:
        'This archetype is designed to stay quiet most of the time and only surface the most important portfolio updates.',
      details: [
        'Required sleeves define the main portfolio roles, so attention is reserved for meaningful deviations.',
        'Optional sleeves are only highlighted when they materially affect the plan.'
      ]
    },

    decisionSupport: {
      description:
        'Decisions are guided by a firm rule: broad market holdings should remain dominant while the rest of the portfolio stays bounded.',
      details: [
        'This makes it easier to tell whether a change is a normal market movement or a real structural adjustment.',
        'The portfolio encourages leaving the core alone unless the plan itself needs to evolve.'
      ]
    }
  },

  GD: {
    systemName: PORTFOLIO_ARCHETYPES.GD.systemName,
    philosophy: PORTFOLIO_ARCHETYPES.GD.philosophy,
    invariant: PORTFOLIO_ARCHETYPES.GD.invariant,

    evolutionSupport: {
      description:
        'A globally diversified core keeps multiple return sources connected, which helps the portfolio evolve without over-concentrating on any one market.',
      details: [
        'Required geographic sleeves maintain broad exposure and prevent the portfolio from drifting toward a single region.',
        'Optional sleeves are only allowed when they complement the global diversification objective.'
      ]
    },

    interactionSupport: {
      description:
        'The portfolio surfaces reviews around its geographic and stability balance, rather than around every regional or market swing.',
      details: [
        'Attention is centered on maintaining broad diversification across equity regions and stability sleeves.',
        'Optional exposures are monitored only when they affect the portfolio’s intended diversification boundaries.'
      ]
    },

    decisionSupport: {
      description:
        'The portfolio makes decisions easier by measuring changes against the diversification invariant, not against short-term market noise.',
      details: [
        'Evaluate action by checking whether a signal would move the portfolio away from its multi-region foundation.',
        'The system encourages staying with the diversified base unless a new position clearly fills a defined gap.'
      ]
    }
  },

  FT: {
    systemName: PORTFOLIO_ARCHETYPES.FT.systemName,
    philosophy: PORTFOLIO_ARCHETYPES.FT.philosophy,
    invariant: PORTFOLIO_ARCHETYPES.FT.invariant,

    evolutionSupport: {
      description:
        'A durable core plus targeted improvements makes it possible to evolve the portfolio in a controlled way.',
      details: [
        'The durable core stays dominant while additional sleeves are added only when they solve a specific limitation.',
        'This keeps evolution focused on clear portfolio problems instead of adding complexity for its own sake.'
      ]
    },

    interactionSupport: {
      description:
        'Interactions are driven by whether a potential change has a clear improvement purpose, not by every market signal.',
      details: [
        'The system highlights only those opportunities that match the portfolio’s improvement criteria.',
        'Most of the portfolio remains stable, while targeted sleeves are reviewed selectively.'
      ]
    },

    decisionSupport: {
      description:
        'Decisions are anchored in the portfolio’s core rule: every non-core exposure must justify its cost, complexity, and effort.',
      details: [
        'This helps you decide whether a proposed change is worth making or whether the portfolio should remain unchanged.',
        'It reduces uncertainty by comparing actions against a known improvement standard.'
      ]
    }
  },

  BFO: {
    systemName: PORTFOLIO_ARCHETYPES.BFO.systemName,
    philosophy: PORTFOLIO_ARCHETYPES.BFO.philosophy,
    invariant: PORTFOLIO_ARCHETYPES.BFO.invariant,

    evolutionSupport: {
      description:
        'Distinct portfolio roles for growth, stability, and liquidity make it easier to evolve one part without destabilizing another.',
      details: [
        'Required sleeves form the backbone of the portfolio while optional sleeves remain explicitly supplementary.',
        'This supports evolution by keeping each section’s purpose clear and separate.'
      ]
    },

    interactionSupport: {
      description:
        'The system is built to show which part of the portfolio deserves attention and which parts are meant to stay steady.',
      details: [
        'Required sleeves are the baseline, and optional sleeves are only surfaced when they change the portfolio’s balance.',
        'This makes the review process more focused and easier to understand.'
      ]
    },

    decisionSupport: {
      description:
        'Decisions are based on whether a change improves a specific portfolio job without blurring the roles of other sleeves.',
      details: [
        'This helps you compare options and avoid making changes that conflict with the portfolio’s balanced design.',
        'It supports clear tradeoffs between growth, stability, and optional diversification.'
      ]
    }
  },

  GA: {
    systemName: PORTFOLIO_ARCHETYPES.GA.systemName,
    philosophy: PORTFOLIO_ARCHETYPES.GA.philosophy,
    invariant: PORTFOLIO_ARCHETYPES.GA.invariant,

    evolutionSupport: {
      description:
        'A strong growth foundation with bounded alternative sleeves helps evolution stay disciplined and purposeful.',
      details: [
        'The growth core remains the main return engine while alternatives are contained by the archetype’s rules.',
        'This makes it easier to evolve toward higher conviction without losing the portfolio’s foundation.'
      ]
    },

    interactionSupport: {
      description:
        'Interactions focus on the balance between the stable growth core and the limited exploratory components.',
      details: [
        'Attention is given to how optional sleeves affect the portfolio’s long-term foundation.',
        'The system keeps the growth base quiet unless the exploratory portion needs review.'
      ]
    },

    decisionSupport: {
      description:
        'Decisions are guided by the need to keep the growth foundation dominant while allowing only clearly bounded ideas.',
      details: [
        'This helps you decide if a new idea is worth adding or if it should remain outside the core portfolio.',
        'It reduces uncertainty by comparing changes against the portfolio’s main growth purpose.'
      ]
    }
  },

  TO: {
    systemName: PORTFOLIO_ARCHETYPES.TO.systemName,
    philosophy: PORTFOLIO_ARCHETYPES.TO.philosophy,
    invariant: PORTFOLIO_ARCHETYPES.TO.invariant,

    evolutionSupport: {
      description:
        'A permanent long-term base with a limited active area helps evolution stay centered on the portfolio’s core mission.',
      details: [
        'Required sleeves protect the long-term core so active allocations cannot redefine the whole portfolio.',
        'Active sleeves are bounded and only evolve when their purpose is explicitly justified.'
      ]
    },

    interactionSupport: {
      description:
        'The system watches active opportunity areas more closely while keeping the long-term base stable.',
      details: [
        'Required sleeves are treated as the foundation, and only the tactical area gets more frequent attention.',
        'This helps avoid letting short-term ideas dominate the portfolio’s long-term plan.'
      ]
    },

    decisionSupport: {
      description:
        'Decisions are made by comparing active opportunities to the portfolio’s permanent core and strict boundaries.',
      details: [
        'This helps you choose whether an idea should be left alone, reviewed more deeply, or kept within its allotted capacity.',
        'It prevents frequent changes from bleeding into the long-term base.'
      ]
    }
  },

  IP: {
    systemName: PORTFOLIO_ARCHETYPES.IP.systemName,
    philosophy: PORTFOLIO_ARCHETYPES.IP.philosophy,
    invariant: PORTFOLIO_ARCHETYPES.IP.invariant,

    evolutionSupport: {
      description:
        'A separate income and liquidity foundation makes it possible to evolve growth without compromising dependable needs.',
      details: [
        'Required sleeves protect access and income, while growth exposure is managed within its own predefined role.',
        'This makes evolution more stable by keeping different portfolio jobs distinct.'
      ]
    },

    interactionSupport: {
      description:
        'The system surfaces updates around the portfolio’s dependable layers and its measured growth sleeve.',
      details: [
        'Required income and liquidity sleeves are the anchors, so most review is reserved for changes that affect those roles.',
        'Growth and optional income ideas are only highlighted when they impact the portfolio’s resilience.'
      ]
    },

    decisionSupport: {
      description:
        'Decisions are guided by whether a change helps the portfolio maintain its income and access priorities while still supporting growth.',
      details: [
        'This helps you avoid acting on short-term yield or idea-seeking without a clear effect on the portfolio’s needs.',
        'It supports choices that preserve the portfolio’s dependable core.'
      ]
    }
  }
});

export function getArchetypeJobSupport(archetypeId) {
  return ARCHETYPE_JOB_SUPPORT[archetypeId] || null;
}

export function getVariantJobSupport(variantId) {
  return VARIANT_JOB_SUPPORT[variantId] || null;
}

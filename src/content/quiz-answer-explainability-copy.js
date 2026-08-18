/*
 * Response-level recommendation explanation copy.
 *
 * Archetype weights intentionally do not live here. The resolver reads them
 * from questions.js so this projection cannot drift from assessment scoring.
 * Investor needs and capabilities likewise remain owned by
 * investor-need-traceability-copy.js.
 */

function explanation({
  tiltExplanation = null,
  tiltStrength = null,
  fulfillment = {}
}) {
  return Object.freeze({
    tiltExplanation,
    tiltStrength,
    fulfillment: Object.freeze({
      ...fulfillment
    })
  });
}


export const QUIZ_ANSWER_EXPLAINABILITY_COPY = Object.freeze({
  setup: Object.freeze({
    not_started: explanation({
      tiltExplanation: 'Strongly favors an Effortless-style foundation: establishing a coherent starting structure matters more than optimizing an already developed portfolio.',
      fulfillment: {
        ES: 'Effortless gives you a small number of clearly defined roles—broad growth, stability and, when needed, accessible money—so you can establish the structure first rather than making a series of disconnected investment choices.'
      }
    }),
    simple_start: explanation({
      tiltExplanation: 'Strongly favors a Global Diversified orientation because you already have a broad foundation and primarily need to understand, maintain and diversify it rather than rebuild from scratch.',
      fulfillment: {
        GD: 'Global Diversified makes the major sources of your existing foundation explicit—US, international, stability and optional diversifiers—so you can see what job the foundation already performs and where a meaningful gap may exist.'
      }
    }),
    etfs_stocks: explanation({
      tiltExplanation: 'Moderately favors Systematic Improvement because you already have a foundation but need a clearer method for understanding and evaluating additions around it.',
      fulfillment: {
        FT: 'Systematic Improvement gives the durable core a defined role and forces additional holdings into explicit improvement or diversification roles, making overlap, unclear holdings and genuine improvements easier to distinguish.'
      }
    }),
    collected: explanation({
      tiltExplanation: 'Moderately favors Growth & Alternatives because accumulated ideas suggest a willingness to explore, together with a need for clearer boundaries around the foundation and exploratory areas.',
      fulfillment: {
        GA: 'Growth & Alternatives separates the main growth engine from enhancement, alternative and opportunity roles. That lets accumulated ideas be evaluated according to whether they strengthen the foundation, add a distinct return source or simply duplicate something already present.'
      }
    }),
    established: explanation({
      tiltExplanation: 'Strongly favors Systematic Improvement because you already have an intentional system and are more likely to benefit from disciplined improvement than wholesale reconstruction.',
      fulfillment: {
        FT: 'Systematic Improvement preserves a durable diversified base and requires every non-core addition to solve a defined limitation. Changes therefore have to demonstrate an improvement before disrupting parts of your portfolio that already work.'
      }
    })
  }),

  transition: Object.freeze({
    what_to_do: explanation({
      tiltExplanation: 'A strong Effortless signal because the decision space needs to be reduced into a clear next step.',
      fulfillment: {
        ES: 'Effortless reduces the decision into a small set of portfolio roles and establishes the foundation first, giving you a clear next structural decision instead of another list of investments to compare.'
      }
    }),
    doing_right: explanation({
      tiltExplanation: 'Strongly favors Balanced Multi-Purpose because you are seeking validation that the different parts of the portfolio serve legitimate purposes.',
      fulfillment: {
        BFO: 'Balanced Multi-Purpose assigns growth, stability, access, income and diversification different jobs. That makes it possible to validate whether your current choices still serve their intended purpose before deciding that anything needs to change.'
      }
    }),
    missing: explanation({
      tiltExplanation: 'Moderately favors Systematic Improvement because the central problem is identifying whether a real portfolio limitation exists before introducing another holding.',
      fulfillment: {
        FT: 'Systematic Improvement treats the durable core as the baseline and permits additional exposures only when they solve a defined limitation. That helps distinguish a genuine portfolio gap from another investment that mainly adds overlap or complexity.'
      }
    }),
    change: explanation({
      tiltExplanation: 'Strongly favors Balanced Multi-Purpose because role-based rules can distinguish meaningful changes from ordinary market movement.',
      fulfillment: {
        BFO: 'Balanced Multi-Purpose gives each sleeve a distinct purpose, so movement alone is not a reason to act. You review a part of the portfolio when its ability to perform its job changes—not simply because its price moved.'
      }
    }),
    compare: explanation({
      tiltExplanation: 'A strong Systematic Improvement signal because you need a repeatable method for comparing alternatives against the specific job they are meant to perform.',
      fulfillment: {
        FT: 'Systematic Improvement evaluates alternatives against the specific limitation or portfolio job they are expected to improve. The question becomes “which option solves this problem best?” rather than “which investment looks best in isolation?”'
      }
    })
  }),

  decisionStyle: Object.freeze({
    start: explanation({
      fulfillment: {
        ES: 'Effortless starts with a broad diversified foundation and a limited number of essential roles, reducing how many decisions must be right before your portfolio can function coherently.'
      }
    }),
    pick: explanation({
      fulfillment: {
        FT: 'Systematic Improvement first defines the job that needs to be performed and then compares candidates on their contribution, risk, cost and effort. The role determines the comparison criteria.'
      }
    }),
    fit: explanation({
      tiltExplanation: 'Moderately favors Growth & Alternatives because you want to consider new opportunities but need a framework that determines whether they legitimately belong in the existing system.',
      fulfillment: {
        GA: 'Growth & Alternatives provides explicit destinations for new ideas—growth enhancer, alternative, real asset or bounded opportunity—while protecting the growth core. A new idea has to show where it belongs and what it contributes before entering the system.'
      }
    }),
    sell: explanation({
      fulfillment: {
        BFO: 'Balanced Multi-Purpose evaluates the investment against the job its sleeve is meant to perform. If that role remains intact, leaving it alone is legitimate; review, reduction or replacement follows when the investment stops performing that job.'
      }
    }),
    enough: explanation({
      fulfillment: {
        FT: 'Systematic Improvement begins with a defined portfolio problem and improvement test. Once the remaining research is unlikely to change whether the candidate solves that problem, further research no longer improves the decision.'
      }
    })
  }),

  marketPsychology: Object.freeze({
    balance: explanation({
      fulfillment: {
        BFO: 'Balanced Multi-Purpose decomposes the account into functional roles. Instead of reacting to the total balance, you can see whether growth, stability, income or another portfolio job caused the movement and whether that role actually needs attention.'
      }
    }),
    market: explanation({
      fulfillment: {
        GD: 'Global Diversified spreads responsibility across several geographic and economic return sources. A headline can therefore be evaluated according to which portfolio role it affects rather than being treated as a reason to reconsider the entire portfolio.'
      }
    }),
    holding: explanation({
      fulfillment: {
        FT: 'Systematic Improvement gives non-core investments an explicit reason for being present. New information matters when it changes the investment’s ability to solve that defined portfolio problem—not simply because the holding attracts attention.'
      }
    }),
    idea: explanation({
      tiltStrength: 'shared',
      tiltExplanation: 'This is shared evidence for Growth & Alternatives and Opportunity Portfolio; by itself it does not distinguish between them.',
      fulfillment: {
        GA: 'Growth & Alternatives routes new ideas into bounded enhancement or alternative roles without disturbing the growth core.',
        TO: 'Opportunity Portfolio keeps new ideas inside a deliberately limited opportunity area while the permanent long-term core remains outside ordinary tactical decisions.'
      }
    }),
    rarely: explanation({
      tiltStrength: 'shared',
      tiltExplanation: 'This is shared evidence for Effortless and Global Diversified; by itself it does not distinguish between them.'
    })
  }),

  evolution: Object.freeze({
    understand: explanation({
      fulfillment: {
        ES: 'Effortless collapses the portfolio into a small number of understandable functions. Every major part has a reason for existing, making the system understandable before additional complexity is introduced.'
      }
    }),
    monitor: explanation({
      tiltStrength: 'shared',
      tiltExplanation: 'This is shared evidence for Global Diversified and Balanced Multi-Purpose; by itself it does not distinguish between them.'
    }),
    frequency: explanation({
      fulfillment: {
        BFO: 'Balanced Multi-Purpose separates portfolio jobs whose monitoring needs differ. Growth, access, income and stability do not have to generate the same review cadence, allowing attention to follow purpose rather than market activity.'
      }
    }),
    effort: explanation({
      fulfillment: {
        FT: 'Systematic Improvement concentrates effort on targeted improvements and research capacity while leaving the durable core comparatively stable. More effort is justified where it can solve a meaningful limitation—not everywhere in the portfolio.'
      }
    }),
    experiment: explanation({
      tiltExplanation: 'This is one of the strongest Growth & Alternatives signals because you explicitly want exploration while protecting the integrity of the existing portfolio.',
      fulfillment: {
        GA: 'Growth & Alternatives explicitly separates the dominant growth foundation from bounded alternatives, enhancers and opportunity capacity. Experiments therefore have a defined place and limit without being allowed to redefine the long-term portfolio.'
      }
    })
  }),

  tradeoff: Object.freeze({
    tell_me: explanation({
      fulfillment: {
        ES: 'Effortless keeps most responsibility in broad strategic portfolio roles and minimizes optional decisions. The system asks for attention mainly when a meaningful exception requires it.'
      }
    }),
    occasional: explanation({
      fulfillment: {
        GD: 'Global Diversified distributes long-term exposure across several durable return sources and is designed to be maintained rather than continuously repositioned. Review becomes occasional and exception-driven.'
      }
    }),
    periodic: explanation({
      tiltStrength: 'shared',
      tiltExplanation: 'This is shared evidence for Balanced Multi-Purpose and Systematic Improvement; by itself it does not distinguish between them.'
    }),
    explore: explanation({
      fulfillment: {
        GA: 'Growth & Alternatives concentrates additional research in selected enhancer, alternative and opportunity roles while the growth foundation remains relatively low effort. You can explore without turning the entire portfolio into a research project.'
      }
    }),
    active: explanation({
      fulfillment: {
        TO: 'Opportunity Portfolio creates a permanent core that ordinary tactical views cannot govern and a separate, bounded area for tactical allocations, themes and security-specific opportunities. Your activity therefore has somewhere to operate without taking over the long-term plan.'
      }
    })
  }),

  age: Object.freeze({
    under3: explanation({
      tiltStrength: 'decisive',
      fulfillment: {
        IP: 'Income Preservation explicitly separates liquidity, short-duration income and core fixed-income roles from measured long-term growth. Money needed soon therefore does not depend on assets that may require many years to recover from losses.'
      }
    }),
    '3to5': explanation({
      fulfillment: {
        IP: 'Income Preservation separates capital that needs increasing dependability from money that can remain invested for measured growth, allowing different risk and review policies for different time horizons.'
      }
    }),
    '5to10': explanation({
      fulfillment: {
        BFO: 'Balanced Multi-Purpose can assign growth, stability and access separate jobs, allowing the balance among those roles to evolve as the expected use of the money becomes closer.'
      }
    }),
    '10plus': explanation({
      fulfillment: {
        GD: 'Global Diversified gives long-horizon capital exposure to several broad return sources and keeps the strategy anchored to diversification rather than allowing ordinary short-term market events to redefine it.'
      }
    }),
    multiple: explanation({
      tiltStrength: 'decisive',
      fulfillment: {
        BFO: 'Balanced Multi-Purpose is explicitly built around different jobs for different pools of money—growth, stability, access, income and diversification—so different goals do not have to operate under one universal risk and review rule.'
      }
    }),
    unsure: explanation({
      fulfillment: {
        ES: 'Effortless keeps the initial structure simple and flexible while the purpose of the money becomes clearer, avoiding unnecessary specialization before the timeline actually requires it.'
      }
    })
  }),

  goals: Object.freeze({
    start_confident: explanation({
      fulfillment: {
        ES: 'Effortless begins with a small understandable portfolio architecture and explains the function of each major part before exposing additional choices.'
      }
    }),
    understand: explanation({
      fulfillment: {
        BFO: 'Balanced Multi-Purpose organizes investments by distinct portfolio jobs. Instead of viewing holdings independently, you can see how growth, stability, access, income and diversifiers collectively produce the overall system.'
      }
    }),
    monitor: explanation({
      tiltStrength: 'shared',
      tiltExplanation: 'This is shared evidence for Global Diversified and Balanced Multi-Purpose; by itself it does not distinguish between them.'
    }),
    act: explanation({
      fulfillment: {
        BFO: 'Balanced Multi-Purpose gives every portfolio part a defined job, making “leave alone,” “monitor,” “review” and “change” legitimate states based on whether that job is still being performed.'
      }
    }),
    choose: explanation({
      tiltStrength: 'decisive',
      fulfillment: {
        FT: 'Systematic Improvement defines the portfolio problem first and applies the same role, contribution, risk, complexity and effort tests to each candidate. Investment selection becomes a repeatable system rather than a series of isolated judgments.'
      }
    }),
    explore: explanation({
      tiltExplanation: 'This is a strong Growth & Alternatives signal because you want exploration to remain purposeful and bounded by the long-term direction.',
      fulfillment: {
        GA: 'Growth & Alternatives protects a dominant growth foundation while giving exploration its own bounded roles. New ideas must have a purpose, acceptable size and review condition before they can influence the portfolio.'
      }
    }),
    income: explanation({
      tiltStrength: 'decisive',
      fulfillment: {
        IP: 'Income Preservation explicitly separates liquidity, dependable-income, fixed-income and measured-growth responsibilities, preventing money needed for access or income from being governed by the same rules as long-term growth capital.'
      }
    })
  })
});


export function getQuizAnswerExplainabilityCopy(
  questionId,
  answerId
) {
  return (
    QUIZ_ANSWER_EXPLAINABILITY_COPY
      ?.[questionId]
      ?.[answerId] ??
    null
  );
}

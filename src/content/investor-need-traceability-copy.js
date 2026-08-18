export const INVESTOR_NEED_TRACEABILITY_COPY = Object.freeze({
  setup: Object.freeze({
    not_started: Object.freeze({
      investorNeed: 'A clear starting structure',
      portfolioConsequence: Object.freeze({
        label: 'Starting-structure rules',
        copy: 'Define the purpose of each portfolio part before additional investments are added.'
      }),
      systemCapability: Object.freeze({
        label: 'Portfolio-architecture framework',
        copy: 'Establish a small set of defined portfolio roles before presenting additional investments or optional exposures.'
      })
    }),

    simple_start: Object.freeze({
      investorNeed: 'Clarity about the existing foundation',
      portfolioConsequence: Object.freeze({
        label: 'Foundation-clarity rules',
        copy: 'Show what job each part of the existing foundation performs and whether an important role is missing.'
      }),
      systemCapability: Object.freeze({
        label: 'Foundation diagnostic framework',
        copy: 'Map the existing foundation to portfolio jobs and identify any missing, unclear, or unsupported role.'
      })
    }),

    etfs_stocks: Object.freeze({
      investorNeed: 'Organization across existing investments',
      portfolioConsequence: Object.freeze({
        label: 'Portfolio-organization rules',
        copy: 'Organize existing investments by portfolio job so gaps, overlap, and unclear roles become visible.'
      }),
      systemCapability: Object.freeze({
        label: 'Portfolio role-mapping framework',
        copy: 'Assign existing investments to portfolio roles and reveal where exposures overlap, leave gaps, or lack a defined purpose.'
      })
    }),

    collected: Object.freeze({
      investorNeed: 'Reconciliation of accumulated investments',
      portfolioConsequence: Object.freeze({
        label: 'Investment-reconciliation rules',
        copy: 'Identify which accumulated investments still belong, which overlap, and which no longer serve a clear portfolio purpose.'
      }),
      systemCapability: Object.freeze({
        label: 'Portfolio reconciliation framework',
        copy: 'Review accumulated investments against their intended jobs and classify them as contributing, overlapping, unclear, or no longer needed.'
      })
    }),

    established: Object.freeze({
      investorNeed: 'Selective improvement without unnecessary disruption',
      portfolioConsequence: Object.freeze({
        label: 'Selective-improvement rules',
        copy: 'Require a proposed change to provide a defined improvement before altering parts of the portfolio that already work.'
      }),
      systemCapability: Object.freeze({
        label: 'Controlled-improvement framework',
        copy: 'Test whether a proposed change solves a defined limitation and whether its benefit justifies disrupting the existing system.'
      })
    })
  }),

  transition: Object.freeze({
    what_to_do: Object.freeze({
      investorNeed: 'Next-step clarity',
      portfolioConsequence: Object.freeze({
        label: 'Next-step rules',
        copy: 'Translate uncertainty into a clear decision question and an understandable next step.'
      }),
      systemCapability: Object.freeze({
        label: 'Decision-framing framework',
        copy: 'Convert a broad concern into the specific portfolio question being decided and the next step needed to resolve it.'
      })
    }),

    doing_right: Object.freeze({
      investorNeed: 'Reasoning validation',
      portfolioConsequence: Object.freeze({
        label: 'Reasoning-validation rules',
        copy: 'Test whether the original reason for the current approach still holds before recommending a change.'
      }),
      systemCapability: Object.freeze({
        label: 'Decision-validation framework',
        copy: 'Compare the current approach with its original purpose, assumptions, and portfolio role before treating doubt as a reason to change.'
      })
    }),

    missing: Object.freeze({
      investorNeed: 'Portfolio-completeness clarity',
      portfolioConsequence: Object.freeze({
        label: 'Portfolio-completeness rules',
        copy: 'Distinguish a genuine missing portfolio role from an additional investment that would only duplicate existing exposure or add complexity.'
      }),
      systemCapability: Object.freeze({
        label: 'Gap-and-redundancy framework',
        copy: 'Identify whether the portfolio lacks a necessary job or whether a proposed addition duplicates a job already being performed.'
      })
    }),

    change: Object.freeze({
      investorNeed: 'Change/no-change clarity',
      portfolioConsequence: Object.freeze({
        label: 'Change/no-change rules',
        copy: 'Define what should trigger reconsideration and what should normally be left alone.'
      }),
      systemCapability: Object.freeze({
        label: 'Change-detection framework',
        copy: 'Distinguish ordinary market movement from a meaningful reason to review or change something.'
      })
    }),

    compare: Object.freeze({
      investorNeed: 'Comparison clarity',
      portfolioConsequence: Object.freeze({
        label: 'Comparison rules',
        copy: 'Compare alternatives against the job they need to perform, rather than treating every attractive option as equally useful.'
      }),
      systemCapability: Object.freeze({
        label: 'Comparison framework',
        copy: 'Compare options against the portfolio job they are meant to perform and the tradeoffs each introduces.'
      })
    })
  }),

  decisionStyle: Object.freeze({
    start: Object.freeze({
      investorNeed: 'Starting-decision confidence',
      portfolioConsequence: Object.freeze({
        label: 'Starting-decision rules',
        copy: 'Support an understandable and appropriately bounded first decision without requiring the investor to find a perfect option.'
      }),
      systemCapability: Object.freeze({
        label: 'Starting-decision framework',
        copy: 'Present a coherent first step, explain the role it establishes, and limit the number of decisions required to begin.'
      })
    }),

    pick: Object.freeze({
      investorNeed: 'Investment-selection clarity',
      portfolioConsequence: Object.freeze({
        label: 'Selection rules',
        copy: 'Compare funds, stocks, or other choices using criteria tied to the portfolio job they are expected to perform.'
      }),
      systemCapability: Object.freeze({
        label: 'Role-based selection framework',
        copy: 'Evaluate investment choices using criteria derived from the required portfolio role, expected contribution, risks, costs, and effort.'
      })
    }),

    fit: Object.freeze({
      investorNeed: 'New-idea fit clarity',
      portfolioConsequence: Object.freeze({
        label: 'Fit + redundancy rules',
        copy: 'Require a new idea to improve an existing purpose, fill a missing purpose, or contribute something meaningfully different before adding it.'
      }),
      systemCapability: Object.freeze({
        label: 'Fit-evaluation framework',
        copy: 'Test where the idea belongs, what it adds, what it overlaps with, and whether it improves the existing portfolio enough to justify inclusion.'
      })
    }),

    sell: Object.freeze({
      investorNeed: 'Sell/reduce/leave-alone clarity',
      portfolioConsequence: Object.freeze({
        label: 'Action rules',
        copy: 'Distinguish when an investment should be left alone, reviewed, reduced, replaced, or removed based on whether it still performs its intended job.'
      }),
      systemCapability: Object.freeze({
        label: 'Action-decision framework',
        copy: 'Structure the choice among leave alone, monitor, review, reduce, replace, or exit based on whether the investment still performs its intended role.'
      })
    }),

    enough: Object.freeze({
      investorNeed: 'Research-stopping clarity',
      portfolioConsequence: Object.freeze({
        label: 'Research-stopping rules',
        copy: 'Define what evidence could materially change the decision and stop additional research when it is unlikely to improve the choice.'
      }),
      systemCapability: Object.freeze({
        label: 'Research-stopping framework',
        copy: 'Identify the remaining information that could change the decision and conclude research when additional evidence is unlikely to alter the result.'
      })
    })
  }),

  marketPsychology: Object.freeze({
    balance: Object.freeze({
      investorNeed: 'Balance-change context',
      portfolioConsequence: Object.freeze({
        label: 'Balance-context rules',
        copy: 'Explain account-balance changes through the portfolio roles that were affected before treating movement as a reason to act.'
      }),
      systemCapability: Object.freeze({
        label: 'Balance-attribution framework',
        copy: 'Connect account-level movement to the portfolio parts that caused it and determine whether any affected role actually requires review.'
      })
    }),

    market: Object.freeze({
      investorNeed: 'Market-noise filtering',
      portfolioConsequence: Object.freeze({
        label: 'Market-signal rules',
        copy: 'Distinguish market events that materially affect a portfolio role from headlines and movements that do not change the decision.'
      }),
      systemCapability: Object.freeze({
        label: 'Market-signal filtering framework',
        copy: 'Route market events to the roles they may affect and suppress information that does not alter a portfolio assumption or decision.'
      })
    }),

    holding: Object.freeze({
      investorNeed: 'Holding-specific review clarity',
      portfolioConsequence: Object.freeze({
        label: 'Holding-review rules',
        copy: 'Evaluate news or price movement by whether it changes the reason an investment belongs in the portfolio.'
      }),
      systemCapability: Object.freeze({
        label: 'Holding-thesis review framework',
        copy: 'Test new holding-specific information against the investment’s intended job and original reason for inclusion.'
      })
    }),

    idea: Object.freeze({
      investorNeed: 'New-idea attention control',
      portfolioConsequence: Object.freeze({
        label: 'New-idea attention rules',
        copy: 'Prevent a new idea from becoming a portfolio decision until its purpose, fit, and overlap have been evaluated.'
      }),
      systemCapability: Object.freeze({
        label: 'Idea-intake framework',
        copy: 'Hold new ideas in an evaluation stage until the system identifies their proposed role, contribution, overlap, and decision relevance.'
      })
    }),

    rarely: Object.freeze({
      investorNeed: 'Meaningful exception alerts',
      portfolioConsequence: Object.freeze({
        label: 'Exception-alert rules',
        copy: 'Surface only the limited events that materially affect a portfolio role or require an investor decision.'
      }),
      systemCapability: Object.freeze({
        label: 'Decision-relevant alerting framework',
        copy: 'Notify the investor only when new information crosses a defined threshold or creates a decision that cannot reasonably wait.'
      })
    })
  }),

  evolution: Object.freeze({
    understand: Object.freeze({
      investorNeed: 'Portfolio-role clarity',
      portfolioConsequence: Object.freeze({
        label: 'Portfolio-role rules',
        copy: 'Assign every important part of the portfolio a clear job and expected contribution.'
      }),
      systemCapability: Object.freeze({
        label: 'Portfolio-role definition framework',
        copy: 'Define what each portfolio part is meant to accomplish and how it contributes to the overall system.'
      })
    }),

    monitor: Object.freeze({
      investorNeed: 'Monitoring clarity',
      portfolioConsequence: Object.freeze({
        label: 'Monitoring rules',
        copy: 'Define what information matters for each portfolio role and what information can normally be ignored.'
      }),
      systemCapability: Object.freeze({
        label: 'Role-based monitoring framework',
        copy: 'Connect each portfolio role to relevant signals, ignorable noise, and the information that could justify review.'
      })
    }),

    frequency: Object.freeze({
      investorNeed: 'Review-frequency clarity',
      portfolioConsequence: Object.freeze({
        label: 'Review-cadence rules',
        copy: 'Define when each portfolio part should be reviewed and what should trigger an earlier review.'
      }),
      systemCapability: Object.freeze({
        label: 'Review-cadence framework',
        copy: 'Assign planned review intervals and exception triggers according to the purpose and attention needs of each portfolio role.'
      })
    }),

    effort: Object.freeze({
      investorNeed: 'Improvement-effort clarity',
      portfolioConsequence: Object.freeze({
        label: 'Improvement-effort rules',
        copy: 'Direct research and effort toward changes that can meaningfully improve the portfolio rather than changes that only add complexity.'
      }),
      systemCapability: Object.freeze({
        label: 'Effort-allocation framework',
        copy: 'Show where additional research could improve a meaningful portfolio outcome and where more effort would only increase complexity.'
      })
    }),

    experiment: Object.freeze({
      investorNeed: 'Safe experimentation and evolution',
      portfolioConsequence: Object.freeze({
        label: 'Bounded-experimentation rules',
        copy: 'Give new ideas a defined purpose, limit, and review point so experimentation cannot disrupt the portfolio foundation.'
      }),
      systemCapability: Object.freeze({
        label: 'Bounded-experimentation framework',
        copy: 'Contain experimental ideas within explicit role, allocation, and review boundaries while protecting the portfolio foundation.'
      })
    })
  }),

  tradeoff: Object.freeze({
    tell_me: Object.freeze({
      investorNeed: 'Minimal guided involvement',
      portfolioConsequence: Object.freeze({
        label: 'Guided-interaction rules',
        copy: 'Keep routine decisions limited and direct attention only to situations that genuinely require investor review.'
      }),
      systemCapability: Object.freeze({
        label: 'Guided-interaction framework',
        copy: 'Minimize routine decisions and surface only the limited questions or exceptions that require investor input.'
      })
    }),

    occasional: Object.freeze({
      investorNeed: 'Light, exception-based involvement',
      portfolioConsequence: Object.freeze({
        label: 'Exception-based interaction rules',
        copy: 'Keep routine portfolio attention low and require action only when a defined review condition is reached.'
      }),
      systemCapability: Object.freeze({
        label: 'Exception-management framework',
        copy: 'Keep the portfolio low-maintenance until a defined role, threshold, or review condition is materially affected.'
      })
    }),

    periodic: Object.freeze({
      investorNeed: 'A predictable review rhythm',
      portfolioConsequence: Object.freeze({
        label: 'Scheduled-review rules',
        copy: 'Organize portfolio decisions around planned reviews rather than continuous reactions to market events.'
      }),
      systemCapability: Object.freeze({
        label: 'Scheduled-review framework',
        copy: 'Consolidate routine portfolio decisions into repeatable review periods while allowing earlier review only for meaningful exceptions.'
      })
    }),

    explore: Object.freeze({
      investorNeed: 'Bounded research freedom',
      portfolioConsequence: Object.freeze({
        label: 'Bounded-research rules',
        copy: 'Contain deeper research within selected portfolio roles so it does not increase the effort required across the entire portfolio.'
      }),
      systemCapability: Object.freeze({
        label: 'Research-boundary framework',
        copy: 'Identify where deeper research is permitted and keep the remaining portfolio roles on a stable, lower-effort operating rhythm.'
      })
    }),

    active: Object.freeze({
      investorNeed: 'Structured active involvement',
      portfolioConsequence: Object.freeze({
        label: 'Active-involvement rules',
        copy: 'Organize frequent monitoring and decisions within explicit portfolio-role, allocation, and action boundaries.'
      }),
      systemCapability: Object.freeze({
        label: 'Structured-engagement framework',
        copy: 'Support frequent involvement while tying attention and action to defined roles, limits, and decision conditions.'
      })
    })
  }),

  age: Object.freeze({
    under3: Object.freeze({
      investorNeed: 'Near-term access and stability',
      portfolioConsequence: Object.freeze({
        label: 'Near-term capital rules',
        copy: 'Keep money needed soon accessible and protected from portfolio risks that require more time to recover.'
      }),
      systemCapability: Object.freeze({
        label: 'Near-term capital protection framework',
        copy: 'Separate near-term money, prioritize access and stability, and limit exposure to losses that may not recover before the money is needed.'
      })
    }),

    '3to5': Object.freeze({
      investorNeed: 'Medium-term dependability and flexibility',
      portfolioConsequence: Object.freeze({
        label: 'Medium-term capital rules',
        copy: 'Separate money that must become dependable within three to five years from money that can remain invested longer.'
      }),
      systemCapability: Object.freeze({
        label: 'Time-horizon segmentation framework',
        copy: 'Divide medium-term capital from longer-term growth capital and assign each part an appropriate risk and review policy.'
      })
    }),

    '5to10': Object.freeze({
      investorNeed: 'Balanced progress and flexibility',
      portfolioConsequence: Object.freeze({
        label: 'Intermediate-horizon rules',
        copy: 'Balance continued growth with increasing flexibility as the expected use of the money approaches.'
      }),
      systemCapability: Object.freeze({
        label: 'Horizon-transition framework',
        copy: 'Adjust the balance between growth, stability, and access as the expected use date becomes closer.'
      })
    }),

    '10plus': Object.freeze({
      investorNeed: 'Long-term growth consistency',
      portfolioConsequence: Object.freeze({
        label: 'Long-term capital rules',
        copy: 'Protect the long-term return engine from unnecessary decisions driven by short-term market movement.'
      }),
      systemCapability: Object.freeze({
        label: 'Long-term discipline framework',
        copy: 'Keep long-term capital governed by its intended horizon and prevent ordinary short-term events from redefining the strategy.'
      })
    }),

    multiple: Object.freeze({
      investorNeed: 'Separation by goal and timeline',
      portfolioConsequence: Object.freeze({
        label: 'Multi-horizon rules',
        copy: 'Separate money with different goals and timelines so each part can follow an appropriate growth, stability, and review policy.'
      }),
      systemCapability: Object.freeze({
        label: 'Goal-and-horizon segmentation framework',
        copy: 'Assign capital to separate goal-based roles with distinct timelines, risk needs, and review expectations.'
      })
    }),

    unsure: Object.freeze({
      investorNeed: 'Purpose and timeline clarification',
      portfolioConsequence: Object.freeze({
        label: 'Timeline-uncertainty rules',
        copy: 'Preserve flexibility and avoid unnecessary commitment until the purpose and expected use of the money become clearer.'
      }),
      systemCapability: Object.freeze({
        label: 'Timeline-uncertainty framework',
        copy: 'Maintain adaptable roles and accessible capacity until the investor can define the money’s purpose and expected use.'
      })
    })
  }),

  goals: Object.freeze({
    start_confident: Object.freeze({
      investorNeed: 'Confident starting guidance',
      portfolioConsequence: Object.freeze({
        label: 'Confident-start rules',
        copy: 'Present a clear first structure and explain why each part is included before introducing additional choices.'
      }),
      systemCapability: Object.freeze({
        label: 'Guided-start framework',
        copy: 'Present an understandable initial portfolio structure, explain each role, and defer unnecessary choices until the foundation is clear.'
      })
    }),

    understand: Object.freeze({
      investorNeed: 'Whole-portfolio understanding',
      portfolioConsequence: Object.freeze({
        label: 'Whole-portfolio rules',
        copy: 'Show how individual investments work together and what each one contributes to the overall system.'
      }),
      systemCapability: Object.freeze({
        label: 'Whole-portfolio mapping framework',
        copy: 'Connect individual investments to portfolio roles and show how those roles combine to support the overall objective.'
      })
    }),

    monitor: Object.freeze({
      investorNeed: 'Attention prioritization',
      portfolioConsequence: Object.freeze({
        label: 'Attention-priority rules',
        copy: 'Identify what deserves investor attention, why it matters, and which portfolio decision it could change.'
      }),
      systemCapability: Object.freeze({
        label: 'Attention-prioritization framework',
        copy: 'Rank information by its relevance to portfolio roles and show which decision, if any, the information could affect.'
      })
    }),

    act: Object.freeze({
      investorNeed: 'Act/leave-alone clarity',
      portfolioConsequence: Object.freeze({
        label: 'Act/leave-alone rules',
        copy: 'Distinguish when something should be monitored, reviewed, changed, or deliberately left alone.'
      }),
      systemCapability: Object.freeze({
        label: 'Action-threshold framework',
        copy: 'Classify portfolio situations into leave alone, monitor, review, or change states using explicit decision thresholds.'
      })
    }),

    choose: Object.freeze({
      investorNeed: 'Repeatable investment selection',
      portfolioConsequence: Object.freeze({
        label: 'Repeatable-selection rules',
        copy: 'Evaluate investment choices using consistent criteria tied to the role they must perform in the portfolio.'
      }),
      systemCapability: Object.freeze({
        label: 'Repeatable-selection framework',
        copy: 'Apply the same role-based criteria and tradeoff tests whenever comparable investment choices are evaluated.'
      })
    }),

    explore: Object.freeze({
      investorNeed: 'Purposeful, bounded exploration',
      portfolioConsequence: Object.freeze({
        label: 'Exploration rules',
        copy: 'Require every experiment to have a defined purpose, allocation limit, and review point before it enters the portfolio.'
      }),
      systemCapability: Object.freeze({
        label: 'Exploration-governance framework',
        copy: 'Require experimental ideas to specify their purpose, allowed size, success criteria, and review or exit conditions.'
      })
    }),

    income: Object.freeze({
      investorNeed: 'Dependable income and capital protection',
      portfolioConsequence: Object.freeze({
        label: 'Income-and-protection rules',
        copy: 'Separate money needed for dependable income or access from money that can remain invested for longer-term growth.'
      }),
      systemCapability: Object.freeze({
        label: 'Income-and-capital protection framework',
        copy: 'Organize capital into dependable-income, access, protection, and longer-term growth roles with different operating rules.'
      })
    })
  })
});

export function getInvestorNeedTraceability(
  questionId,
  optionId
) {
  if (
    typeof questionId !== 'string' ||
    typeof optionId !== 'string'
  ) {
    return null;
  }

  return (
    INVESTOR_NEED_TRACEABILITY_COPY
      [questionId]
      ?.[optionId] ??
    null
  );
}

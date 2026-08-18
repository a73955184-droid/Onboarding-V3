export const INVESTOR_NEED_TRACEABILITY_COPY = Object.freeze({
  setup: Object.freeze({
    not_started: Object.freeze({
      investorNeed: 'A clear starting structure',
      portfolioConsequence: Object.freeze({
        label: 'Starting-structure rules',
        copy: 'Define the purpose of each portfolio part before additional investments are added.'
      })
    }),

    simple_start: Object.freeze({
      investorNeed: 'Clarity about the existing foundation',
      portfolioConsequence: Object.freeze({
        label: 'Foundation-clarity rules',
        copy: 'Show what job each part of the existing foundation performs and whether an important role is missing.'
      })
    }),

    etfs_stocks: Object.freeze({
      investorNeed: 'Organization across existing investments',
      portfolioConsequence: Object.freeze({
        label: 'Portfolio-organization rules',
        copy: 'Organize existing investments by portfolio job so gaps, overlap, and unclear roles become visible.'
      })
    }),

    collected: Object.freeze({
      investorNeed: 'Reconciliation of accumulated investments',
      portfolioConsequence: Object.freeze({
        label: 'Investment-reconciliation rules',
        copy: 'Identify which accumulated investments still belong, which overlap, and which no longer serve a clear portfolio purpose.'
      })
    }),

    established: Object.freeze({
      investorNeed: 'Selective improvement without unnecessary disruption',
      portfolioConsequence: Object.freeze({
        label: 'Selective-improvement rules',
        copy: 'Require a proposed change to provide a defined improvement before altering parts of the portfolio that already work.'
      })
    })
  }),

  transition: Object.freeze({
    what_to_do: Object.freeze({
      investorNeed: 'Next-step clarity',
      portfolioConsequence: Object.freeze({
        label: 'Next-step rules',
        copy: 'Translate uncertainty into a clear decision question and an understandable next step.'
      })
    }),

    doing_right: Object.freeze({
      investorNeed: 'Reasoning validation',
      portfolioConsequence: Object.freeze({
        label: 'Reasoning-validation rules',
        copy: 'Test whether the original reason for the current approach still holds before recommending a change.'
      })
    }),

    missing: Object.freeze({
      investorNeed: 'Portfolio-completeness clarity',
      portfolioConsequence: Object.freeze({
        label: 'Portfolio-completeness rules',
        copy: 'Distinguish a genuine missing portfolio role from an additional investment that would only duplicate existing exposure or add complexity.'
      })
    }),

    change: Object.freeze({
      investorNeed: 'Change/no-change clarity',
      portfolioConsequence: Object.freeze({
        label: 'Change/no-change rules',
        copy: 'Define what should trigger reconsideration and what should normally be left alone.'
      })
    }),

    compare: Object.freeze({
      investorNeed: 'Comparison clarity',
      portfolioConsequence: Object.freeze({
        label: 'Comparison rules',
        copy: 'Compare alternatives against the job they need to perform, rather than treating every attractive option as equally useful.'
      })
    })
  }),

  decisionStyle: Object.freeze({
    start: Object.freeze({
      investorNeed: 'Starting-decision confidence',
      portfolioConsequence: Object.freeze({
        label: 'Starting-decision rules',
        copy: 'Support an understandable and appropriately bounded first decision without requiring the investor to find a perfect option.'
      })
    }),

    pick: Object.freeze({
      investorNeed: 'Investment-selection clarity',
      portfolioConsequence: Object.freeze({
        label: 'Selection rules',
        copy: 'Compare funds, stocks, or other choices using criteria tied to the portfolio job they are expected to perform.'
      })
    }),

    fit: Object.freeze({
      investorNeed: 'New-idea fit clarity',
      portfolioConsequence: Object.freeze({
        label: 'Fit + redundancy rules',
        copy: 'Require a new idea to improve an existing purpose, fill a missing purpose, or contribute something meaningfully different before adding it.'
      })
    }),

    sell: Object.freeze({
      investorNeed: 'Sell/reduce/leave-alone clarity',
      portfolioConsequence: Object.freeze({
        label: 'Action rules',
        copy: 'Distinguish when an investment should be left alone, reviewed, reduced, replaced, or removed based on whether it still performs its intended job.'
      })
    }),

    enough: Object.freeze({
      investorNeed: 'Research-stopping clarity',
      portfolioConsequence: Object.freeze({
        label: 'Research-stopping rules',
        copy: 'Define what evidence could materially change the decision and stop additional research when it is unlikely to improve the choice.'
      })
    })
  }),

  marketPsychology: Object.freeze({
    balance: Object.freeze({
      investorNeed: 'Balance-change context',
      portfolioConsequence: Object.freeze({
        label: 'Balance-context rules',
        copy: 'Explain account-balance changes through the portfolio roles that were affected before treating movement as a reason to act.'
      })
    }),

    market: Object.freeze({
      investorNeed: 'Market-noise filtering',
      portfolioConsequence: Object.freeze({
        label: 'Market-signal rules',
        copy: 'Distinguish market events that materially affect a portfolio role from headlines and movements that do not change the decision.'
      })
    }),

    holding: Object.freeze({
      investorNeed: 'Holding-specific review clarity',
      portfolioConsequence: Object.freeze({
        label: 'Holding-review rules',
        copy: 'Evaluate news or price movement by whether it changes the reason an investment belongs in the portfolio.'
      })
    }),

    idea: Object.freeze({
      investorNeed: 'New-idea attention control',
      portfolioConsequence: Object.freeze({
        label: 'New-idea attention rules',
        copy: 'Prevent a new idea from becoming a portfolio decision until its purpose, fit, and overlap have been evaluated.'
      })
    }),

    rarely: Object.freeze({
      investorNeed: 'Meaningful exception alerts',
      portfolioConsequence: Object.freeze({
        label: 'Exception-alert rules',
        copy: 'Surface only the limited events that materially affect a portfolio role or require an investor decision.'
      })
    })
  }),

  evolution: Object.freeze({
    understand: Object.freeze({
      investorNeed: 'Portfolio-role clarity',
      portfolioConsequence: Object.freeze({
        label: 'Portfolio-role rules',
        copy: 'Assign every important part of the portfolio a clear job and expected contribution.'
      })
    }),

    monitor: Object.freeze({
      investorNeed: 'Monitoring clarity',
      portfolioConsequence: Object.freeze({
        label: 'Monitoring rules',
        copy: 'Define what information matters for each portfolio role and what information can normally be ignored.'
      })
    }),

    frequency: Object.freeze({
      investorNeed: 'Review-frequency clarity',
      portfolioConsequence: Object.freeze({
        label: 'Review-cadence rules',
        copy: 'Define when each portfolio part should be reviewed and what should trigger an earlier review.'
      })
    }),

    effort: Object.freeze({
      investorNeed: 'Improvement-effort clarity',
      portfolioConsequence: Object.freeze({
        label: 'Improvement-effort rules',
        copy: 'Direct research and effort toward changes that can meaningfully improve the portfolio rather than changes that only add complexity.'
      })
    }),

    experiment: Object.freeze({
      investorNeed: 'Safe experimentation and evolution',
      portfolioConsequence: Object.freeze({
        label: 'Bounded-experimentation rules',
        copy: 'Give new ideas a defined purpose, limit, and review point so experimentation cannot disrupt the portfolio foundation.'
      })
    })
  }),

  tradeoff: Object.freeze({
    tell_me: Object.freeze({
      investorNeed: 'Minimal guided involvement',
      portfolioConsequence: Object.freeze({
        label: 'Guided-interaction rules',
        copy: 'Keep routine decisions limited and direct attention only to situations that genuinely require investor review.'
      })
    }),

    occasional: Object.freeze({
      investorNeed: 'Light, exception-based involvement',
      portfolioConsequence: Object.freeze({
        label: 'Exception-based interaction rules',
        copy: 'Keep routine portfolio attention low and require action only when a defined review condition is reached.'
      })
    }),

    periodic: Object.freeze({
      investorNeed: 'A predictable review rhythm',
      portfolioConsequence: Object.freeze({
        label: 'Scheduled-review rules',
        copy: 'Organize portfolio decisions around planned reviews rather than continuous reactions to market events.'
      })
    }),

    explore: Object.freeze({
      investorNeed: 'Bounded research freedom',
      portfolioConsequence: Object.freeze({
        label: 'Bounded-research rules',
        copy: 'Contain deeper research within selected portfolio roles so it does not increase the effort required across the entire portfolio.'
      })
    }),

    active: Object.freeze({
      investorNeed: 'Structured active involvement',
      portfolioConsequence: Object.freeze({
        label: 'Active-involvement rules',
        copy: 'Organize frequent monitoring and decisions within explicit portfolio-role, allocation, and action boundaries.'
      })
    })
  }),

  age: Object.freeze({
    under3: Object.freeze({
      investorNeed: 'Near-term access and stability',
      portfolioConsequence: Object.freeze({
        label: 'Near-term capital rules',
        copy: 'Keep money needed soon accessible and protected from portfolio risks that require more time to recover.'
      })
    }),

    '3to5': Object.freeze({
      investorNeed: 'Medium-term dependability and flexibility',
      portfolioConsequence: Object.freeze({
        label: 'Medium-term capital rules',
        copy: 'Separate money that must become dependable within three to five years from money that can remain invested longer.'
      })
    }),

    '5to10': Object.freeze({
      investorNeed: 'Balanced progress and flexibility',
      portfolioConsequence: Object.freeze({
        label: 'Intermediate-horizon rules',
        copy: 'Balance continued growth with increasing flexibility as the expected use of the money approaches.'
      })
    }),

    '10plus': Object.freeze({
      investorNeed: 'Long-term growth consistency',
      portfolioConsequence: Object.freeze({
        label: 'Long-term capital rules',
        copy: 'Protect the long-term return engine from unnecessary decisions driven by short-term market movement.'
      })
    }),

    multiple: Object.freeze({
      investorNeed: 'Separation by goal and timeline',
      portfolioConsequence: Object.freeze({
        label: 'Multi-horizon rules',
        copy: 'Separate money with different goals and timelines so each part can follow an appropriate growth, stability, and review policy.'
      })
    }),

    unsure: Object.freeze({
      investorNeed: 'Purpose and timeline clarification',
      portfolioConsequence: Object.freeze({
        label: 'Timeline-uncertainty rules',
        copy: 'Preserve flexibility and avoid unnecessary commitment until the purpose and expected use of the money become clearer.'
      })
    })
  }),

  goals: Object.freeze({
    start_confident: Object.freeze({
      investorNeed: 'Confident starting guidance',
      portfolioConsequence: Object.freeze({
        label: 'Confident-start rules',
        copy: 'Present a clear first structure and explain why each part is included before introducing additional choices.'
      })
    }),

    understand: Object.freeze({
      investorNeed: 'Whole-portfolio understanding',
      portfolioConsequence: Object.freeze({
        label: 'Whole-portfolio rules',
        copy: 'Show how individual investments work together and what each one contributes to the overall system.'
      })
    }),

    monitor: Object.freeze({
      investorNeed: 'Attention prioritization',
      portfolioConsequence: Object.freeze({
        label: 'Attention-priority rules',
        copy: 'Identify what deserves investor attention, why it matters, and which portfolio decision it could change.'
      })
    }),

    act: Object.freeze({
      investorNeed: 'Act/leave-alone clarity',
      portfolioConsequence: Object.freeze({
        label: 'Act/leave-alone rules',
        copy: 'Distinguish when something should be monitored, reviewed, changed, or deliberately left alone.'
      })
    }),

    choose: Object.freeze({
      investorNeed: 'Repeatable investment selection',
      portfolioConsequence: Object.freeze({
        label: 'Repeatable-selection rules',
        copy: 'Evaluate investment choices using consistent criteria tied to the role they must perform in the portfolio.'
      })
    }),

    explore: Object.freeze({
      investorNeed: 'Purposeful, bounded exploration',
      portfolioConsequence: Object.freeze({
        label: 'Exploration rules',
        copy: 'Require every experiment to have a defined purpose, allocation limit, and review point before it enters the portfolio.'
      })
    }),

    income: Object.freeze({
      investorNeed: 'Dependable income and capital protection',
      portfolioConsequence: Object.freeze({
        label: 'Income-and-protection rules',
        copy: 'Separate money needed for dependable income or access from money that can remain invested for longer-term growth.'
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

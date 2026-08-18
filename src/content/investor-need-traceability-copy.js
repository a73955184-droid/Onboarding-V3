export const INVESTOR_NEED_TRACEABILITY_COPY = Object.freeze({
  setup: Object.freeze({
    not_started: Object.freeze({
      investorNeed: 'A clear starting structure'
    }),

    simple_start: Object.freeze({
      investorNeed: 'Clarity about the existing foundation'
    }),

    etfs_stocks: Object.freeze({
      investorNeed: 'Organization across existing investments'
    }),

    collected: Object.freeze({
      investorNeed: 'Reconciliation of accumulated investments'
    }),

    established: Object.freeze({
      investorNeed: 'Selective improvement without unnecessary disruption'
    })
  }),

  transition: Object.freeze({
    what_to_do: Object.freeze({
      investorNeed: 'Next-step clarity'
    }),

    doing_right: Object.freeze({
      investorNeed: 'Reasoning validation'
    }),

    missing: Object.freeze({
      investorNeed: 'Portfolio-completeness clarity'
    }),

    change: Object.freeze({
      investorNeed: 'Change/no-change clarity'
    }),

    compare: Object.freeze({
      investorNeed: 'Comparison clarity'
    })
  }),

  decisionStyle: Object.freeze({
    start: Object.freeze({
      investorNeed: 'Starting-decision confidence'
    }),

    pick: Object.freeze({
      investorNeed: 'Investment-selection clarity'
    }),

    fit: Object.freeze({
      investorNeed: 'New-idea fit clarity'
    }),

    sell: Object.freeze({
      investorNeed: 'Sell/reduce/leave-alone clarity'
    }),

    enough: Object.freeze({
      investorNeed: 'Research-stopping clarity'
    })
  }),

  marketPsychology: Object.freeze({
    balance: Object.freeze({
      investorNeed: 'Balance-change context'
    }),

    market: Object.freeze({
      investorNeed: 'Market-noise filtering'
    }),

    holding: Object.freeze({
      investorNeed: 'Holding-specific review clarity'
    }),

    idea: Object.freeze({
      investorNeed: 'New-idea attention control'
    }),

    rarely: Object.freeze({
      investorNeed: 'Meaningful exception alerts'
    })
  }),

  evolution: Object.freeze({
    understand: Object.freeze({
      investorNeed: 'Portfolio-role clarity'
    }),

    monitor: Object.freeze({
      investorNeed: 'Monitoring clarity'
    }),

    frequency: Object.freeze({
      investorNeed: 'Review-frequency clarity'
    }),

    effort: Object.freeze({
      investorNeed: 'Improvement-effort clarity'
    }),

    experiment: Object.freeze({
      investorNeed: 'Safe experimentation and evolution'
    })
  }),

  tradeoff: Object.freeze({
    tell_me: Object.freeze({
      investorNeed: 'Minimal guided involvement'
    }),

    occasional: Object.freeze({
      investorNeed: 'Light, exception-based involvement'
    }),

    periodic: Object.freeze({
      investorNeed: 'A predictable review rhythm'
    }),

    explore: Object.freeze({
      investorNeed: 'Bounded research freedom'
    }),

    active: Object.freeze({
      investorNeed: 'Structured active involvement'
    })
  }),

  age: Object.freeze({
    under3: Object.freeze({
      investorNeed: 'Near-term access and stability'
    }),

    '3to5': Object.freeze({
      investorNeed: 'Medium-term dependability and flexibility'
    }),

    '5to10': Object.freeze({
      investorNeed: 'Balanced progress and flexibility'
    }),

    '10plus': Object.freeze({
      investorNeed: 'Long-term growth consistency'
    }),

    multiple: Object.freeze({
      investorNeed: 'Separation by goal and timeline'
    }),

    unsure: Object.freeze({
      investorNeed: 'Purpose and timeline clarification'
    })
  }),

  goals: Object.freeze({
    start_confident: Object.freeze({
      investorNeed: 'Confident starting guidance'
    }),

    understand: Object.freeze({
      investorNeed: 'Whole-portfolio understanding'
    }),

    monitor: Object.freeze({
      investorNeed: 'Attention prioritization'
    }),

    act: Object.freeze({
      investorNeed: 'Act/leave-alone clarity'
    }),

    choose: Object.freeze({
      investorNeed: 'Repeatable investment selection'
    }),

    explore: Object.freeze({
      investorNeed: 'Purposeful, bounded exploration'
    }),

    income: Object.freeze({
      investorNeed: 'Dependable income and capital protection'
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

const ASSESSMENT_VERSION = '3.0.0';


const STAGES = {
  foundation_builder: {
    name: 'Foundation Builder',
    summary:
      'You are establishing a dependable investing foundation and deciding what structure to trust.'
  },

  portfolio_organizer: {
    name: 'Portfolio Organizer',
    summary:
      'You already have investments; your next step is turning them into one coherent system.'
  },

  system_builder: {
    name: 'System Builder',
    summary:
      'You are ready to use repeatable rules instead of treating each investment as a separate decision.'
  },

  intentional_optimizer: {
    name: 'Intentional Optimizer',
    summary:
      'You are evaluating how to improve an existing system without adding unnecessary complexity.'
  },

  adaptive_investor: {
    name: 'Adaptive Investor',
    summary:
      'You are comfortable adapting within defined portfolio boundaries as conditions and opportunities change.'
  }
};


const STYLES = {
  guided_autopilot: {
    name: 'Guided Autopilot',
    summary:
      'A mostly automated system that asks for your attention only when a meaningful decision is required.',
    cadence:
      'Annual review with exception-based prompts'
  },

  steady_steward: {
    name: 'Steady Steward',
    summary:
      'A durable portfolio reviewed occasionally, with disciplined and limited changes.',
    cadence:
      'Light quarterly check-in and annual review'
  },

  systematic_improver: {
    name: 'Systematic Improver',
    summary:
      'A repeatable process for comparing, reviewing, and improving the portfolio.',
    cadence:
      'Monthly monitoring and quarterly decision review'
  },

  bounded_explorer: {
    name: 'Bounded Explorer',
    summary:
      'A stable core with controlled room to research and test selected ideas.',
    cadence:
      'Monthly opportunity review and quarterly portfolio review'
  },

  active_navigator: {
    name: 'Active Navigator',
    summary:
      'A defined framework for more frequent, market-aware decisions without losing portfolio boundaries.',
    cadence:
      'Weekly and event-driven review'
  }
};


const MODIFIERS = {
  validation_seeker: {
    name: 'Evidence Seeker',
    userCopy:
      'You build confidence by seeing why a recommendation fits before acting.'
  },

  opportunity_chaser: {
    name: 'Opportunity Sensitive',
    userCopy:
      'New ideas attract your attention, so clear sleeve limits and entry rules will help.'
  },

  instruction_seeker: {
    name: 'Guidance Oriented',
    userCopy:
      'You are most comfortable when the next step and decision rule are explicit.'
  },

  confidence_builder: {
    name: 'Confidence Builder',
    userCopy:
      'Your system should help you stay anchored when uncertainty or volatility increases.'
  },

  optimization_mindset: {
    name: 'Improvement Oriented',
    userCopy:
      'You naturally look for ways to improve the system, so every added strategy should earn its place.'
  }
};


/*
 * The IDs below match the option IDs in:
 *
 * src/content/questions.js
 *
 * Archetype scores are already defined on each question option through:
 *
 * option.scores
 *
 * This configuration adds the other three result dimensions:
 *
 * - investor stage
 * - operating style
 * - confidence modifier
 *
 * It also records behavioral signals used by the active-style guardrail.
 */

const OPTION_LOGIC = {
  setup: {
    not_started: {
      stage: {
        foundation_builder: 4
      },

      style: {
        guided_autopilot: 3,
        steady_steward: 1
      },

      modifier: {
        instruction_seeker: 3,
        confidence_builder: 1
      },

      signals: [
        'starting uncertainty',
        'guidance preference'
      ]
    },

    simple_start: {
      stage: {
        foundation_builder: 2,
        portfolio_organizer: 2
      },

      style: {
        guided_autopilot: 2,
        steady_steward: 2
      },

      modifier: {
        validation_seeker: 2,
        instruction_seeker: 1
      },

      signals: [
        'simple foundation',
        'fit uncertainty'
      ]
    },

    etfs_stocks: {
      stage: {
        portfolio_organizer: 4,
        system_builder: 1
      },

      style: {
        steady_steward: 2,
        systematic_improver: 2
      },

      modifier: {
        validation_seeker: 3,
        optimization_mindset: 1
      },

      signals: [
        'portfolio coherence need',
        'comparison need'
      ]
    },

    collected: {
      stage: {
        portfolio_organizer: 3,
        system_builder: 2
      },

      style: {
        bounded_explorer: 2,
        systematic_improver: 2
      },

      modifier: {
        opportunity_chaser: 2,
        optimization_mindset: 2
      },

      signals: [
        'active exploration',
        'portfolio coherence need'
      ]
    },

    established: {
      stage: {
        intentional_optimizer: 4,
        system_builder: 2
      },

      style: {
        systematic_improver: 3,
        steady_steward: 1
      },

      modifier: {
        optimization_mindset: 3,
        validation_seeker: 1
      },

      signals: [
        'optimization intent',
        'existing system'
      ]
    }
  },


  transition: {
    what_to_do: {
      stage: {
        foundation_builder: 3
      },

      style: {
        guided_autopilot: 3
      },

      modifier: {
        instruction_seeker: 4
      },

      signals: [
        'guidance preference',
        'next-step uncertainty'
      ]
    },

    doing_right: {
      stage: {
        portfolio_organizer: 2,
        system_builder: 1
      },

      style: {
        steady_steward: 2
      },

      modifier: {
        validation_seeker: 4
      },

      signals: [
        'validation need',
        'reasoning uncertainty'
      ]
    },

    missing: {
      stage: {
        system_builder: 2,
        intentional_optimizer: 1
      },

      style: {
        systematic_improver: 2,
        bounded_explorer: 1
      },

      modifier: {
        opportunity_chaser: 2,
        confidence_builder: 2
      },

      signals: [
        'opportunity pressure',
        'attention uncertainty'
      ]
    },

    change: {
      stage: {
        system_builder: 3
      },

      style: {
        steady_steward: 2,
        systematic_improver: 1
      },

      modifier: {
        confidence_builder: 3,
        validation_seeker: 2
      },

      signals: [
        'action-threshold need',
        'change uncertainty'
      ]
    },

    compare: {
      stage: {
        intentional_optimizer: 3,
        system_builder: 1
      },

      style: {
        systematic_improver: 4
      },

      modifier: {
        optimization_mindset: 3,
        validation_seeker: 1
      },

      signals: [
        'comparison need',
        'optimization intent'
      ]
    }
  },


  decisionStyle: {
    start: {
      stage: {
        foundation_builder: 4
      },

      style: {
        guided_autopilot: 3
      },

      modifier: {
        instruction_seeker: 3,
        confidence_builder: 2
      },

      signals: [
        'starting uncertainty',
        'mistake avoidance'
      ]
    },

    pick: {
      stage: {
        system_builder: 2,
        intentional_optimizer: 1
      },

      style: {
        systematic_improver: 3
      },

      modifier: {
        validation_seeker: 2,
        optimization_mindset: 2
      },

      signals: [
        'comparison need',
        'tradeoff reasoning'
      ]
    },

    fit: {
      stage: {
        portfolio_organizer: 2,
        system_builder: 2
      },

      style: {
        bounded_explorer: 3,
        systematic_improver: 1
      },

      modifier: {
        opportunity_chaser: 2,
        validation_seeker: 2
      },

      signals: [
        'active exploration',
        'portfolio fit need'
      ]
    },

    sell: {
      stage: {
        system_builder: 3,
        adaptive_investor: 1
      },

      style: {
        steady_steward: 2,
        active_navigator: 1
      },

      modifier: {
        confidence_builder: 2,
        validation_seeker: 2
      },

      signals: [
        'exit-rule need',
        'change uncertainty'
      ]
    },

    enough: {
      stage: {
        intentional_optimizer: 3,
        system_builder: 1
      },

      style: {
        systematic_improver: 3
      },

      modifier: {
        optimization_mindset: 3,
        validation_seeker: 2
      },

      signals: [
        'research stopping need',
        'optimization intent'
      ]
    }
  },


  marketPsychology: {
    balance: {
      stage: {
        foundation_builder: 1,
        portfolio_organizer: 1
      },

      style: {
        guided_autopilot: 1,
        steady_steward: 2
      },

      modifier: {
        confidence_builder: 3,
        validation_seeker: 1
      },

      signals: [
        'balance sensitivity',
        'outcome sensitivity'
      ]
    },

    market: {
      stage: {
        system_builder: 1
      },

      style: {
        steady_steward: 3
      },

      modifier: {
        confidence_builder: 4
      },

      signals: [
        'market noise sensitivity',
        'stability preference'
      ]
    },

    holding: {
      stage: {
        system_builder: 2,
        intentional_optimizer: 1
      },

      style: {
        systematic_improver: 2,
        active_navigator: 1
      },

      modifier: {
        validation_seeker: 2,
        optimization_mindset: 1
      },

      signals: [
        'holding monitoring',
        'decision-specific attention'
      ]
    },

    idea: {
      stage: {
        adaptive_investor: 2,
        system_builder: 1
      },

      style: {
        bounded_explorer: 3,
        active_navigator: 2
      },

      modifier: {
        opportunity_chaser: 4
      },

      signals: [
        'opportunity seeking',
        'active exploration',
        'opportunity pressure'
      ]
    },

    rarely: {
      stage: {
        foundation_builder: 1,
        portfolio_organizer: 1
      },

      style: {
        guided_autopilot: 3,
        steady_steward: 2
      },

      modifier: {
        instruction_seeker: 1,
        confidence_builder: 1
      },

      signals: [
        'low monitoring preference',
        'exception-based attention'
      ]
    }
  },


  evolution: {
    understand: {
      stage: {
        foundation_builder: 3,
        portfolio_organizer: 2
      },

      style: {
        guided_autopilot: 2,
        steady_steward: 1
      },

      modifier: {
        instruction_seeker: 2,
        validation_seeker: 2
      },

      signals: [
        'portfolio understanding need',
        'role clarity need'
      ]
    },

    monitor: {
      stage: {
        system_builder: 3
      },

      style: {
        steady_steward: 2,
        systematic_improver: 1
      },

      modifier: {
        instruction_seeker: 2,
        confidence_builder: 2
      },

      signals: [
        'monitoring framework need',
        'attention uncertainty'
      ]
    },

    frequency: {
      stage: {
        system_builder: 3
      },

      style: {
        steady_steward: 3
      },

      modifier: {
        confidence_builder: 3,
        instruction_seeker: 1
      },

      signals: [
        'cadence uncertainty',
        'change uncertainty'
      ]
    },

    effort: {
      stage: {
        intentional_optimizer: 3
      },

      style: {
        systematic_improver: 4
      },

      modifier: {
        optimization_mindset: 3
      },

      signals: [
        'effort allocation need',
        'optimization intent'
      ]
    },

    experiment: {
      stage: {
        adaptive_investor: 3,
        system_builder: 1
      },

      style: {
        bounded_explorer: 4,
        active_navigator: 1
      },

      modifier: {
        opportunity_chaser: 3
      },

      signals: [
        'active exploration',
        'opportunity seeking'
      ]
    }
  },


  tradeoff: {
    tell_me: {
      stage: {
        foundation_builder: 2
      },

      style: {
        guided_autopilot: 5
      },

      modifier: {
        instruction_seeker: 4
      },

      signals: [
        'guidance preference',
        'low decision preference'
      ]
    },

    occasional: {
      stage: {
        portfolio_organizer: 1,
        system_builder: 1
      },

      style: {
        steady_steward: 5
      },

      modifier: {
        confidence_builder: 2,
        validation_seeker: 1
      },

      signals: [
        'stability preference',
        'low monitoring preference'
      ]
    },

    periodic: {
      stage: {
        system_builder: 2,
        intentional_optimizer: 1
      },

      style: {
        systematic_improver: 3,
        steady_steward: 2
      },

      modifier: {
        validation_seeker: 2,
        optimization_mindset: 1
      },

      signals: [
        'scheduled review preference',
        'process preference'
      ]
    },

    explore: {
      stage: {
        adaptive_investor: 2,
        intentional_optimizer: 1
      },

      style: {
        bounded_explorer: 5
      },

      modifier: {
        opportunity_chaser: 3,
        optimization_mindset: 1
      },

      signals: [
        'active exploration',
        'opportunity seeking'
      ]
    },

    active: {
      stage: {
        adaptive_investor: 3
      },

      style: {
        active_navigator: 5,
        bounded_explorer: 1
      },

      modifier: {
        opportunity_chaser: 3,
        optimization_mindset: 1
      },

      signals: [
        'active exploration',
        'opportunity seeking',
        'control preference'
      ]
    }
  },


  /*
   * This screen is still named "age" in the existing app, but the
   * actual question asks about the investor's time horizon.
   */

  age: {
    under3: {
      stage: {
        system_builder: 1
      },

      style: {
        steady_steward: 2
      },

      modifier: {
        confidence_builder: 2
      },

      signals: [
        'near-term need',
        'stability preference'
      ],

      metadata: {
        timeHorizon: 'under3'
      }
    },

    '3to5': {
      stage: {
        system_builder: 1
      },

      style: {
        steady_steward: 2
      },

      modifier: {
        confidence_builder: 1
      },

      signals: [
        'mixed horizon',
        'stability preference'
      ],

      metadata: {
        timeHorizon: '3to5'
      }
    },

    '5to10': {
      stage: {
        system_builder: 1
      },

      style: {
        steady_steward: 1,
        systematic_improver: 1
      },

      modifier: {
        validation_seeker: 1
      },

      signals: [
        'medium-term horizon'
      ],

      metadata: {
        timeHorizon: '5to10'
      }
    },

    '10plus': {
      stage: {
        intentional_optimizer: 1
      },

      style: {
        steady_steward: 1,
        systematic_improver: 1
      },

      modifier: {
        confidence_builder: 1
      },

      signals: [
        'long-term horizon'
      ],

      metadata: {
        timeHorizon: '10plus'
      }
    },

    multiple: {
      stage: {
        portfolio_organizer: 1,
        system_builder: 2
      },

      style: {
        systematic_improver: 1,
        steady_steward: 1
      },

      modifier: {
        validation_seeker: 1
      },

      signals: [
        'multiple goals',
        'portfolio role need'
      ],

      metadata: {
        timeHorizon: 'multiple'
      }
    },

    unsure: {
      stage: {
        foundation_builder: 3
      },

      style: {
        guided_autopilot: 2
      },

      modifier: {
        instruction_seeker: 3
      },

      signals: [
        'purpose uncertainty',
        'guidance preference'
      ],

      metadata: {
        timeHorizon: 'unsure'
      }
    }
  },


  goals: {
    start_confident: {
      stage: {
        foundation_builder: 4
      },

      style: {
        guided_autopilot: 3
      },

      modifier: {
        instruction_seeker: 3,
        confidence_builder: 1
      },

      signals: [
        'starting uncertainty',
        'guidance preference'
      ]
    },

    understand: {
      stage: {
        portfolio_organizer: 4
      },

      style: {
        steady_steward: 2,
        systematic_improver: 1
      },

      modifier: {
        validation_seeker: 3
      },

      signals: [
        'portfolio coherence need',
        'role clarity need'
      ]
    },

    monitor: {
      stage: {
        system_builder: 3
      },

      style: {
        steady_steward: 2,
        systematic_improver: 1
      },

      modifier: {
        instruction_seeker: 2,
        confidence_builder: 2
      },

      signals: [
        'monitoring framework need',
        'attention uncertainty'
      ]
    },

    act: {
      stage: {
        system_builder: 4
      },

      style: {
        steady_steward: 2,
        systematic_improver: 2
      },

      modifier: {
        confidence_builder: 3,
        validation_seeker: 2
      },

      signals: [
        'action-threshold need',
        'change uncertainty'
      ]
    },

    choose: {
      stage: {
        intentional_optimizer: 3,
        system_builder: 1
      },

      style: {
        systematic_improver: 4
      },

      modifier: {
        optimization_mindset: 3,
        validation_seeker: 1
      },

      signals: [
        'comparison need',
        'process preference'
      ]
    },

    explore: {
      stage: {
        adaptive_investor: 3
      },

      style: {
        bounded_explorer: 4,
        active_navigator: 1
      },

      modifier: {
        opportunity_chaser: 3
      },

      signals: [
        'active exploration',
        'opportunity seeking'
      ]
    },

    income: {
      stage: {
        system_builder: 2
      },

      style: {
        steady_steward: 3
      },

      modifier: {
        confidence_builder: 2,
        instruction_seeker: 1
      },

      signals: [
        'income need',
        'stability preference'
      ]
    }
  }
};


const QUESTION_MEANINGS = {
  setup:
    'How the portfolio accumulated—and whether its parts currently form one plan',

  transition:
    'The unresolved question that repeatedly sends you back for more information',

  decisionStyle:
    'What kind of evidence helps you move from research to a decision',

  marketPsychology:
    'Which event or signal captures your attention first',

  evolution:
    'What feels incomplete in the way the portfolio is organized today',

  tradeoff:
    'How involved you realistically want to be',

  age:
    'When the money may be needed and how much stability or access may matter',

  goals:
    'What the investing system must make easier'
};


Object.assign(globalThis, {
  ASSESSMENT_VERSION,
  STAGES,
  STYLES,
  MODIFIERS,
  OPTION_LOGIC,
  QUESTION_MEANINGS
});

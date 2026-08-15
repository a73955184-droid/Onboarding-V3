/*
 * Investor System Guidance
 * Behavior Decision Guidance
 *
 * PURPOSE
 * -------
 * Translate a resolved Behavior modifier into the kind of
 * decision support the user needs from the portfolio system.
 *
 * IMPORTANT
 * ---------
 * This file does NOT:
 *
 * - score quiz responses
 * - resolve Behavior
 * - alter archetype
 * - alter variant
 * - alter portfolio composition
 * - alter sleeve weights
 * - alter review cadence
 *
 * It only explains how the already-resolved portfolio system
 * should help the user work through decisions.
 */


export const BEHAVIOR_DECISION_GUIDANCE = Object.freeze({

  validation_seeker: Object.freeze({
    behaviorId: 'validation_seeker',

    investorQuestion:
      'Does the change I am considering actually improve my portfolio?',

    primaryNeed:
      'Validate a proposed action against the portfolio system before changing anything.',

    systemPromise:
      'Use the portfolio jobs and sleeve boundaries to test whether an idea adds something useful, duplicates an existing role, or introduces unnecessary risk, effort, or complexity.',

    decisionFraming:
      'Validate before changing.',

    decisionProtocol: Object.freeze([
      Object.freeze({
        step: 1,
        question:
          'What are you trying to improve or accomplish?',
        purpose:
          'Start from the portfolio outcome rather than from the asset or idea itself.'
      }),

      Object.freeze({
        step: 2,
        question:
          'Which portfolio sleeve owns that job?',
        purpose:
          'Identify where the proposed change would belong in the existing system.'
      }),

      Object.freeze({
        step: 3,
        question:
          'Does the asset or change fit that sleeve mandate?',
        purpose:
          'Check whether the idea is consistent with the role the sleeve is designed to perform.'
      }),

      Object.freeze({
        step: 4,
        question:
          'What does it add that the portfolio does not already have?',
        purpose:
          'Distinguish a meaningful contribution from redundant exposure.'
      }),

      Object.freeze({
        step: 5,
        question:
          'What additional risk, monitoring effort, or complexity would it introduce?',
        purpose:
          'Make the cost of the proposed improvement visible.'
      }),

      Object.freeze({
        step: 6,
        question:
          'Is the improvement meaningful enough to justify that additional cost?',
        purpose:
          'Help the user decide whether the change actually strengthens the system.'
      })
    ]),

    outcomes: Object.freeze([
      'keep-current-system',
      'continue-research',
      'review-existing-sleeve',
      'consider-change'
    ]),

    commonDecisionMoments: Object.freeze([
      'A new investment looks better than something already owned.',
      'A peer or expert recommends another investment.',
      'A fund or stock appears to be outperforming the current holding.',
      'The user wants reassurance before changing allocation.',
      'The user is unsure whether an additional asset improves diversification.'
    ]),

    systemGuardrail:
      'A proposed change should improve a defined portfolio job rather than merely look attractive in isolation.',

    userFacingSummary:
      'When you are considering a change, your system helps you check what job the idea would perform, whether that job is already covered, and whether the potential improvement is worth the added risk, effort, or complexity.'
  }),


  instruction_seeker: Object.freeze({
    behaviorId: 'instruction_seeker',

    investorQuestion:
      'Something happened. What should I do next?',

    primaryNeed:
      'Translate portfolio and market information into a clear next step.',

    systemPromise:
      'Use sleeve roles, monitoring signals, review cadence, and reconsideration conditions to separate information that can be ignored from information that deserves monitoring, review, or action.',

    decisionFraming:
      'Turn information into a next step.',

    decisionProtocol: Object.freeze([
      Object.freeze({
        step: 1,
        question:
          'Does this event or information affect your portfolio system?',
        purpose:
          'Filter out information that is unrelated to the user portfolio.'
      }),

      Object.freeze({
        step: 2,
        question:
          'Which sleeve or portfolio job is affected?',
        purpose:
          'Place the event inside the correct part of the portfolio system.'
      }),

      Object.freeze({
        step: 3,
        question:
          'Is this one of the signals that sleeve is designed to monitor?',
        purpose:
          'Separate relevant information from market noise.'
      }),

      Object.freeze({
        step: 4,
        question:
          'Has the sleeve reached a review condition?',
        purpose:
          'Avoid turning every relevant signal into an immediate portfolio action.'
      }),

      Object.freeze({
        step: 5,
        question:
          'Has the sleeve role, portfolio need, or underlying assumption materially changed?',
        purpose:
          'Identify whether reconsideration is actually warranted.'
      })
    ]),

    outcomes: Object.freeze([
      'leave-alone',
      'monitor',
      'review',
      'consider-action'
    ]),

    commonDecisionMoments: Object.freeze([
      'Markets rise or fall sharply.',
      'Interest rates or inflation change.',
      'A holding moves significantly.',
      'A market trend becomes widely discussed.',
      'The user does not know whether a signal requires action.'
    ]),

    systemGuardrail:
      'Relevant information is not automatically actionable information.',

    userFacingSummary:
      'When markets, investments, or your own needs change, your system helps you determine whether the right response is to leave it alone, monitor it, review it, or consider action.'
  }),


  confidence_builder: Object.freeze({
    behaviorId: 'confidence_builder',

    investorQuestion:
      'How do I avoid reacting to normal market movement as if something is wrong?',

    primaryNeed:
      'Anchor decisions to portfolio purpose rather than short-term emotion or ordinary market volatility.',

    systemPromise:
      'Use the reason each sleeve exists and its expected review cadence as a reference point before treating price movement as evidence that the portfolio should change.',

    decisionFraming:
      'Check the role before reacting to the result.',

    decisionProtocol: Object.freeze([
      Object.freeze({
        step: 1,
        question:
          'What job is this sleeve supposed to perform?',
        purpose:
          'Reconnect the user to the role of the investment.'
      }),

      Object.freeze({
        step: 2,
        question:
          'Is the current event unusual for that role or within expected behavior?',
        purpose:
          'Distinguish ordinary volatility from a meaningful change.'
      }),

      Object.freeze({
        step: 3,
        question:
          'Has the reason for owning the sleeve changed?',
        purpose:
          'Shift attention from price movement to the underlying portfolio rationale.'
      }),

      Object.freeze({
        step: 4,
        question:
          'Has a predefined review condition been reached?',
        purpose:
          'Use system rules instead of emotional urgency.'
      }),

      Object.freeze({
        step: 5,
        question:
          'Does the portfolio still perform the job it was designed to perform?',
        purpose:
          'Keep the decision tied to system function.'
      })
    ]),

    outcomes: Object.freeze([
      'leave-alone',
      'monitor',
      'review',
      'consider-action'
    ]),

    commonDecisionMoments: Object.freeze([
      'The portfolio falls in value.',
      'A sleeve temporarily underperforms.',
      'A headline creates anxiety.',
      'The user feels pressure to make a defensive change.',
      'A short-term market move feels inconsistent with expectations.'
    ]),

    systemGuardrail:
      'A price change alone does not mean the portfolio job has changed.',

    userFacingSummary:
      'Your system gives you a reference point for deciding whether a market move actually changes the role of an investment or is simply something the portfolio was built to experience.'
  }),


  opportunity_chaser: Object.freeze({
    behaviorId: 'opportunity_chaser',

    investorQuestion:
      'How do I explore attractive opportunities without letting them take over my portfolio?',

    primaryNeed:
      'Contain opportunity seeking inside explicit portfolio boundaries.',

    systemPromise:
      'Route new ideas through the portfolio system before they are allowed to change the core allocation.',

    decisionFraming:
      'Give opportunities a defined place and a defined limit.',

    decisionProtocol: Object.freeze([
      Object.freeze({
        step: 1,
        question:
          'What opportunity are you considering?',
        purpose:
          'Define the idea before evaluating it.'
      }),

      Object.freeze({
        step: 2,
        question:
          'Which sleeve would legitimately own this opportunity?',
        purpose:
          'Prevent new ideas from being inserted into whichever sleeve is convenient.'
      }),

      Object.freeze({
        step: 3,
        question:
          'Does the idea fit that sleeve mandate?',
        purpose:
          'Check asset and thesis fit.'
      }),

      Object.freeze({
        step: 4,
        question:
          'Does that sleeve have capacity for another opportunity?',
        purpose:
          'Keep exploration bounded relative to the rest of the portfolio.'
      }),

      Object.freeze({
        step: 5,
        question:
          'What would this add that existing holdings do not already provide?',
        purpose:
          'Filter redundant ideas.'
      }),

      Object.freeze({
        step: 6,
        question:
          'What additional research and monitoring would this idea require?',
        purpose:
          'Make the user effort cost visible before the investment is added.'
      })
    ]),

    outcomes: Object.freeze([
      'ignore-opportunity',
      'watch-opportunity',
      'research-within-sleeve',
      'consider-bounded-allocation'
    ]),

    commonDecisionMoments: Object.freeze([
      'A new market theme becomes popular.',
      'A hot stock or ETF is recommended.',
      'The user worries about missing an obvious trend.',
      'A new sector appears to offer unusually high upside.',
      'A windfall creates pressure to invest immediately.'
    ]),

    systemGuardrail:
      'An attractive opportunity should not be allowed to redefine the strategic portfolio unless it serves a legitimate portfolio job.',

    userFacingSummary:
      'When a new opportunity appears, your system helps you decide where it belongs, what it would add, how much room the portfolio has for it, and whether the extra monitoring effort is justified.'
  }),


  optimization_mindset: Object.freeze({
    behaviorId: 'optimization_mindset',

    investorQuestion:
      'Is this change meaningfully better, or am I just adding complexity?',

    primaryNeed:
      'Evaluate improvements against the portfolio property they are intended to improve.',

    systemPromise:
      'Require every proposed optimization to identify the portfolio job being improved and the additional risk, effort, or complexity introduced by the change.',

    decisionFraming:
      'Improve with a stopping rule.',

    decisionProtocol: Object.freeze([
      Object.freeze({
        step: 1,
        question:
          'What portfolio property are you trying to improve?',
        purpose:
          'Define the optimization target.'
      }),

      Object.freeze({
        step: 2,
        question:
          'Which existing sleeve owns that portfolio job?',
        purpose:
          'Keep optimization anchored to the existing system.'
      }),

      Object.freeze({
        step: 3,
        question:
          'How would the proposed change improve that job?',
        purpose:
          'Require a specific improvement thesis.'
      }),

      Object.freeze({
        step: 4,
        question:
          'Does the portfolio already have an exposure that performs substantially the same function?',
        purpose:
          'Detect redundant complexity.'
      }),

      Object.freeze({
        step: 5,
        question:
          'What additional risk, monitoring effort, and implementation complexity would the change introduce?',
        purpose:
          'Make optimization costs explicit.'
      }),

      Object.freeze({
        step: 6,
        question:
          'Is the expected improvement meaningful enough to justify those costs?',
        purpose:
          'Establish a stopping rule for optimization.'
      })
    ]),

    outcomes: Object.freeze([
      'keep-current-system',
      'continue-comparison',
      'review-improvement-sleeve',
      'consider-improvement'
    ]),

    commonDecisionMoments: Object.freeze([
      'The user finds a fund with better historical performance.',
      'The user discovers another factor or strategy.',
      'The user considers replacing an existing ETF.',
      'The user wants to add another diversifier.',
      'The user repeatedly compares similar investment choices.'
    ]),

    systemGuardrail:
      'Additional complexity should earn its place by improving a defined portfolio job enough to justify the extra effort and risk.',

    userFacingSummary:
      'Your system helps you separate meaningful improvements from unnecessary optimization by asking what gets better, what it costs in effort and complexity, and whether that improvement is actually worth making.'
  })
});


export function getBehaviorDecisionGuidance(
  behaviorId
) {
  if (!behaviorId) {
    return null;
  }

  return (
    BEHAVIOR_DECISION_GUIDANCE[
      behaviorId
    ] ?? null
  );
}

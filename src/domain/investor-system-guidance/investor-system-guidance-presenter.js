/*
 * Investor System Guidance Presenter
 *
 * PURPOSE
 * -------
 * Build the investor-facing translation contract between:
 *
 *   assessment / recommendation logic
 *
 * and:
 *
 *   the Portfolio System Fit screen.
 *
 * IMPORTANT
 * ---------
 * This file explains already-resolved results.
 *
 * It does NOT:
 *
 * - score assessment answers
 * - resolve Stage
 * - resolve Style
 * - resolve Behavior
 * - resolve archetype
 * - resolve variant
 * - modify allocations
 * - select securities
 * - recommend trades
 */


import {
  getBehaviorDecisionGuidance
} from './behavior-decision-guidance.js';

import {
  getVariantComplexityGuidance
} from './variant-complexity-guidance.js';

import {
  getEffortReturnGuidance
} from './effort-return-guidance.js';

import {
  getPortfolioEvolutionGuidance
} from './portfolio-evolution-guidance.js';

import {
  getPortfolioInteractionGuidance
} from './portfolio-interaction-guidance.js';

import {
  getPortfolioDecisionMakingGuidance
} from './portfolio-decision-making-guidance.js';

import {
  getPortfolioEvolutionDelivery,
  getPortfolioInteractionDelivery
} from './portfolio-philosophy-jtbd-support.js';

import {
  getSleeveBoundaries
} from './sleeve-boundary-guidance.js';

import {
  getQuestionLabel
} from '../investor-jobs.js';


/*
 * ============================================================
 * User-facing archetype names
 * ============================================================
 */

const ARCHETYPE_DISPLAY_NAMES = Object.freeze({
  ES: 'Emerging Strategist',
  GD: 'Global Diversified',
  FT: 'Factor Tilt',
  BFO: 'Balanced Family Office',
  GA: 'Growth + Alternatives',
  TO: 'Tactical / Opportunistic',
  IP: 'Income / Preservation'
});


/*
 * ============================================================
 * User JTBD
 * ============================================================
 *
 * These are the investor-side jobs.
 *
 * They deliberately remain separate from:
 *
 * job.portfolioRequirement
 *
 * which represents the SYSTEM-side job.
 */

const PROFILE_USER_JTBD = Object.freeze({

  /*
   * STAGE
   */

  foundation_builder:
    'Give me an understandable starting structure where I know what each part is for.',

  portfolio_organizer:
    'Help me connect separate investments into one system with clearer roles.',

  system_builder:
    'Give me repeatable rules so I can manage my portfolio without second-guessing every change.',

  intentional_optimizer:
    'Help me improve what already works without adding complexity for its own sake.',

  adaptive_investor:
    'Let me explore and grow within clear limits so new ideas do not make my portfolio unfocused.',


  /*
   * STYLE
   */

  guided_autopilot:
    'Keep routine investing simple and tell me when something actually deserves my attention.',

  steady_steward:
    'Help me stay consistent with a few meaningful reviews and limited changes.',

  systematic_improver:
    'Help me compare choices with clear rules and ignore noise that does not improve my portfolio.',

  bounded_explorer:
    'Keep a stable foundation while showing me where selected ideas deserve more attention.',

  active_navigator:
    'Keep me engaged only when an opportunity or change meets clear standards.',


  /*
   * BEHAVIOR
   */

  validation_seeker:
    'Show me why a recommendation fits my portfolio before I act.',

  instruction_seeker:
    'When I face an investment choice or something changes, help me understand what to do next.',

  confidence_builder:
    'Help me distinguish routine volatility from changes that actually deserve action.',

  opportunity_chaser:
    'Help me set limits for new ideas so I do not react to every opportunity.',

  optimization_mindset:
    'Help me know when an improvement is meaningful and when further comparison is no longer useful.'
});


/*
 * ============================================================
 * Which quiz answers belong to each profile dimension?
 * ============================================================
 *
 * This mirrors what the Investor Profile screen communicates:
 *
 * Stage
 *   - current setup
 *   - what feels incomplete / desired evolution
 *
 * Style
 *   - involvement preference
 *   - attention trigger
 *
 * Behavior
 *   - what sends user searching
 *   - how user makes a choice
 *
 * We use the actual selected answer text.
 */

const PROFILE_EVIDENCE_QUESTION_IDS = Object.freeze({
  stage: Object.freeze([
    'setup',
    'evolution'
  ]),

  style: Object.freeze([
    'tradeoff',
    'marketPsychology'
  ]),

  behavior: Object.freeze([
    'transition',
    'decisionStyle'
  ])
});


/*
 * ============================================================
 * Helpers
 * ============================================================
 */

function firstDefined(...values) {
  return (
    values.find(
      (value) =>
        value !== undefined &&
        value !== null
    ) ?? null
  );
}


function normalizeId(value) {
  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    return null;
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
}


function titleCase(value) {
  if (!value) {
    return null;
  }

  return String(value)
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}


function percentage(value) {
  if (
    typeof value !== 'number' ||
    Number.isNaN(value)
  ) {
    return null;
  }

  return Math.round(
    value * 100
  );
}


/*
 * ============================================================
 * Extractors
 * ============================================================
 */

function extractStageId(presentation) {
  return normalizeId(
    firstDefined(
      presentation
        ?.jobs
        ?.stage
        ?.profileId,

      presentation
        ?.profile
        ?.stage
        ?.id,

      presentation
        ?.stage
        ?.id,

      presentation
        ?.stageId
    )
  );
}


function extractStyleId(presentation) {
  return normalizeId(
    firstDefined(
      presentation
        ?.jobs
        ?.style
        ?.profileId,

      presentation
        ?.profile
        ?.style
        ?.id,

      presentation
        ?.style
        ?.id,

      presentation
        ?.styleId
    )
  );
}


function extractBehaviorId(presentation) {
  return normalizeId(
    firstDefined(
      presentation
        ?.jobs
        ?.behavior
        ?.profileId,

      presentation
        ?.profile
        ?.behavior
        ?.id,

      presentation
        ?.profile
        ?.modifier
        ?.id,

      presentation
        ?.behavior
        ?.id,

      presentation
        ?.modifier
        ?.id,

      presentation
        ?.behaviorId,

      presentation
        ?.modifierId
    )
  );
}


function extractArchetypeId(presentation) {
  return firstDefined(
    presentation
      ?.philosophy
      ?.archetype
      ?.id,

    presentation
      ?.diagnostics
      ?.recommendation
      ?.archetypeId,

    presentation
      ?.system
      ?.archetype
      ?.id,

    presentation
      ?.portfolioSystem
      ?.archetype
      ?.id,

    presentation
      ?.archetype
      ?.id,

    presentation
      ?.archetypeId
  );
}


function extractVariantId(presentation) {
  return normalizeId(
    firstDefined(
      presentation
        ?.philosophy
        ?.variant
        ?.id,

      presentation
        ?.diagnostics
        ?.recommendation
        ?.variantId,

      presentation
        ?.system
        ?.variant
        ?.id,

      presentation
        ?.portfolioSystem
        ?.variant
        ?.id,

      presentation
        ?.variant
        ?.id,

      presentation
        ?.variantId
    )
  );
}


function extractStage(presentation) {
  return firstDefined(
    presentation
      ?.jobs
      ?.stage,

    presentation
      ?.profile
      ?.stage,

    presentation
      ?.stage,

    null
  );
}


function extractStyle(presentation) {
  return firstDefined(
    presentation
      ?.jobs
      ?.style,

    presentation
      ?.profile
      ?.style,

    presentation
      ?.style,

    null
  );
}


function extractBehavior(presentation) {
  return firstDefined(
    presentation
      ?.jobs
      ?.behavior,

    presentation
      ?.profile
      ?.behavior,

    presentation
      ?.profile
      ?.modifier,

    presentation
      ?.behavior,

    presentation
      ?.modifier,

    null
  );
}


function extractArchetype(presentation) {
  return firstDefined(
    presentation
      ?.philosophy
      ?.archetype,

    presentation
      ?.system
      ?.archetype,

    presentation
      ?.portfolioSystem
      ?.archetype,

    presentation
      ?.archetype,

    null
  );
}


function extractVariant(presentation) {
  return firstDefined(
    presentation
      ?.philosophy
      ?.variant,

    presentation
      ?.system
      ?.variant,

    presentation
      ?.portfolioSystem
      ?.variant,

    presentation
      ?.variant,

    null
  );
}


function extractSleeves(presentation) {
  const candidates = [
    presentation
      ?.sleeves
      ?.items,

    presentation
      ?.system
      ?.sleeves,

    presentation
      ?.portfolioSystem
      ?.sleeves,

    presentation
      ?.portfolio
      ?.sleeves,

    presentation
      ?.philosophy
      ?.sleeves,

    presentation
      ?.sleeves
  ];

  for (const candidate of candidates) {
    if (
      Array.isArray(candidate)
    ) {
      return candidate;
    }
  }

  return [];
}


function extractStructure(presentation) {
  return firstDefined(
    presentation
      ?.structure,

    presentation
      ?.system
      ?.structure,

    presentation
      ?.portfolioSystem
      ?.structure,

    presentation
      ?.portfolio
      ?.structure,

    {}
  );
}


/*
 * ============================================================
 * Evidence extraction
 * ============================================================
 */

function extractSelectedAnswers(
  presentation
) {
  const candidates = [
    presentation
      ?.evidence
      ?.selectedAnswers,

    presentation
      ?.source
      ?.evidence
      ?.selectedAnswers,

    presentation
      ?.diagnostics
      ?.evidence
      ?.selectedAnswers,

    presentation
      ?.portfolioSystem
      ?.evidence
      ?.selectedAnswers
  ];

  for (const candidate of candidates) {
    if (
      Array.isArray(candidate)
    ) {
      return candidate;
    }
  }

  /*
   * Last-resort fallback:
   *
   * Some current sleeve presentations carry the same
   * selected-answer evidence in sleeve personalization.
   */
  const sleeves =
    extractSleeves(
      presentation
    );

  for (const sleeve of sleeves) {
    const evidence =
      sleeve
        ?.personalization
        ?.evidence;

    if (
      Array.isArray(evidence) &&
      evidence.length > 0
    ) {
      return evidence;
    }
  }

  return [];
}


function getEvidenceForDimension(
  selectedAnswers,
  dimension
) {
  const allowedQuestionIds =
    PROFILE_EVIDENCE_QUESTION_IDS[
      dimension
    ] ?? [];

  return selectedAnswers
    .filter(
      (answer) =>
        allowedQuestionIds.includes(
          answer?.questionId
        )
    )
    .map(
      (answer) => ({
        questionId:
          answer.questionId,

        optionId:
          answer.optionId,

        questionLabel:
          getQuestionLabel(
            answer.questionId
          ),

        answerText:
          answer.answerText
      })
    )
    .filter(
      (answer) =>
        Boolean(
          answer.answerText
        )
    );
}


/*
 * ============================================================
 * Investor JTBD translation
 * ============================================================
 */

function buildOrganizationJob({
  stage,
  portfolioEvolutionGuidance,
  recommendedSystemDelivery
}) {
  return {
    id:
      'organize',

    title:
      'Organize',

    investorQuestion:
      'How should I organize my investments from where I am today?',

    job:
      portfolioEvolutionGuidance
        ?.userJTBD ??
      PROFILE_USER_JTBD[
        stage?.profileId
      ] ??
      'Give every important part of the portfolio a clear job.',

    systemResponse:
      stage?.systemFit ??
      'Use distinct portfolio roles so every important part of the portfolio has a clear purpose.',

    systemJTBD:
      portfolioEvolutionGuidance
        ?.systemJTBD ??
      stage?.systemFit ??
      'Use distinct portfolio roles so every important part of the portfolio has a clear purpose.',

    resolvedProfile: {
      id:
        stage?.profileId ??
        stage?.id ??
        null,

      label:
        firstDefined(
          stage?.title,
          stage?.label,
          stage?.name
        ),

      summary:
        firstDefined(
          stage?.description,
          stage?.summary,
          stage?.explanation
        ),

      portfolioRequirement:
        stage
          ?.portfolioRequirement ??
        null,

      systemFit:
        stage
          ?.systemFit ??
        null
    },

    portfolioEvolution:
      portfolioEvolutionGuidance ??
      null,

    recommendedSystemDelivery:
      recommendedSystemDelivery ??
      null
  };
}


function buildEffortJob({
  style,
  effortGuidance,
  portfolioInteractionGuidance,
  recommendedSystemDelivery
}) {
  return {
    id:
      'focus-effort',

    title:
      'Focus',

    investorQuestion:
      'Where is my investing effort actually worth spending?',

    job:
      portfolioInteractionGuidance
        ?.userJTBD ??
      PROFILE_USER_JTBD[
        style?.profileId
      ] ??
      'Spend attention where research or monitoring can change a meaningful portfolio decision.',

    systemResponse:
      style?.systemFit ??
      effortGuidance
        ?.userFacingSummary ??
      'Match the amount of attention given to each portfolio role to the amount of attention that role actually requires.',

    resolvedProfile: {
      id:
        style?.profileId ??
        style?.id ??
        null,

      label:
        firstDefined(
          style?.title,
          style?.label,
          style?.name
        ),

      summary:
        firstDefined(
          style?.description,
          style?.summary,
          style?.explanation
        ),

      portfolioRequirement:
        style
          ?.portfolioRequirement ??
        null,

      systemFit:
        style
          ?.systemFit ??
        null
    },

    portfolioInteraction:
      portfolioInteractionGuidance ??
      null,

    recommendedSystemDelivery:
      recommendedSystemDelivery ??
      null
  };
}


function buildDecisionJob({
  behavior,
  behaviorGuidance,
  portfolioDecisionMakingGuidance
}) {
  return {
    id:
      'decide',

    title:
      'Decide',

    investorQuestion:
      behaviorGuidance
        ?.investorQuestion ??
      'When something makes me want to act, how should I decide what to do?',

    job:
      portfolioDecisionMakingGuidance
        ?.userJTBD ??
      PROFILE_USER_JTBD[
        behavior?.profileId
      ] ??
      behaviorGuidance
        ?.primaryNeed ??
      'Use the portfolio system as a decision framework before changing the portfolio.',

    systemResponse:
      behaviorGuidance
        ?.systemPromise ??
      behavior
        ?.systemFit ??
      'Connect new information and investment ideas back to the portfolio job they would affect before deciding whether action is useful.',

    resolvedProfile: {
      id:
        behavior?.profileId ??
        behavior?.id ??
        null,

      label:
        firstDefined(
          behavior?.title,
          behavior?.label,
          behavior?.name
        ),

      summary:
        firstDefined(
          behavior?.description,
          behavior?.summary,
          behavior?.explanation
        ),

      portfolioRequirement:
        behavior
          ?.portfolioRequirement ??
        null,

      systemFit:
        behavior
          ?.systemFit ??
        null
    },

    portfolioDecisionMaking:
      portfolioDecisionMakingGuidance ??
      null
  };
}


/*
 * ============================================================
 * Portfolio philosophy
 * ============================================================
 */

function buildPhilosophyExplanation({
  archetype,
  archetypeId,
  presentation
}) {
  const philosophy =
    firstDefined(
      presentation
        ?.philosophy
        ?.archetype,

      archetype
    );

  const summary =
    firstDefined(
      philosophy?.summary,
      philosophy?.description,
      philosophy?.explanation,
      philosophy?.philosophySummary
    );

  const philosophyName =
    firstDefined(
      philosophy?.title,
      philosophy?.philosophyName,
      philosophy?.label,
      philosophy?.name,
      archetypeId
    );

  const sources =
    firstDefined(
      philosophy?.sources,

      presentation
        ?.philosophy
        ?.archetype
        ?.sources,

      presentation
        ?.philosophy
        ?.archetypeSources,

      []
    );

  /*
   * The portfolio-philosophy domain owns the meaning.
   *
   * This presenter only carries the resolved archetype's
   * investor-problem framing forward into the recommendation
   * presentation model.
   */
  const investorProblem =
    firstDefined(
      philosophy
        ?.investorProblem,

      archetype
        ?.investorProblem,

      presentation
        ?.philosophy
        ?.archetype
        ?.investorProblem,

      null
    );

  return {
    archetypeId,

    title:
      'Why this portfolio philosophy?',

    investorQuestion:
      'What overall philosophy should organize my investments?',

    philosophyName,

    summary,

    investorProblem:
      investorProblem
        ? {
            question:
              investorProblem
                ?.question ??
              null,

            meaning:
              investorProblem
                ?.meaning ??
              null
          }
        : null,

    whyItMatters:
      'The portfolio philosophy defines how the different portfolio jobs are expected to work together. It is the organizing logic behind the sleeves, not simply a label for an allocation.',

    sources:
      Array.isArray(sources)
        ? sources
        : []
  };
}


/*
 * ============================================================
 * Variant / complexity
 * ============================================================
 */

function buildComplexityExplanation({
  variant,
  variantId,
  archetypeId,
  sleeves,
  complexityGuidance
}) {
  return {
    archetypeId,

    variantId,

    variantName:
      firstDefined(
        variant?.title,
        variant?.label,
        variant?.name,
        variant?.philosophyName,
        titleCase(variantId)
      ),

    sleeveCount:
      sleeves.length,

    title:
      'Why this level of portfolio structure?',

    investorQuestion:
      complexityGuidance
        ?.userQuestion ??
      'How much portfolio complexity is actually useful for me?',

    philosophyQuestion:
      complexityGuidance
        ?.philosophyQuestion ??
      null,

    generalMeaning:
      complexityGuidance
        ?.generalMeaning ??
      null,

    complexityGoal:
      complexityGuidance
        ?.complexityGoal ??
      null,

    whyThisVersion:
      complexityGuidance
        ?.whyThisVersion ??
      null,

    whatSeparationProvides:
      complexityGuidance
        ?.whatSeparationProvides ??
      null,

    whyNotSimpler:
      complexityGuidance
        ?.whyNotSimpler ??
      null,

    whyNotMoreComplex:
      complexityGuidance
        ?.whyNotMoreComplex ??
      null,

    complexityBoundary:
      complexityGuidance
        ?.complexityBoundary ??
      null,

    userFacingSummary:
      complexityGuidance
        ?.userFacingSummary ??
      null,

    variantRationale:
      complexityGuidance
        ?.variantRationale ??
      null
  };
}


/*
 * ============================================================
 * Profile accountability
 * ============================================================
 *
 * Required translation:
 *
 * GUIDANCE INDICATION
 *        ->
 * YOUR QUIZ RESPONSE
 *        ->
 * INVESTING SYSTEM JTBD
 *        ->
 * HOW YOUR RECOMMENDED SYSTEM HELPS
 */

function buildProfileAccountability({
  selectedAnswers,
  investorJobs,
  behaviorGuidance
}) {
  const stage =
    investorJobs
      ?.organize ??
    null;

  const style =
    investorJobs
      ?.focus ??
    null;

  const behavior =
    investorJobs
      ?.decide ??
    null;


  const stageEvidence =
    getEvidenceForDimension(
      selectedAnswers,
      'stage'
    );

  const styleEvidence =
    getEvidenceForDimension(
      selectedAnswers,
      'style'
    );

  const behaviorEvidence =
    getEvidenceForDimension(
      selectedAnswers,
      'behavior'
    );


  const behaviorSystemResponse =
    behaviorGuidance
      ?.systemPromise ??
    behavior
      ?.systemResponse ??
    null;


  return {
    eyebrow:
      'ACCOUNTABLE TO YOUR INVESTOR PROFILE',

    title:
      'How your answers translate into this system',

    summary:
      'Your profile creates three jobs for the portfolio system: organize your investments, focus your effort, and help you decide what to do next.',

    columns: [
      'Guidance indication',
      'Your quiz response',
      'Investing system JTBD',
      'How your recommended system helps',
      'HOW YOUR RECOMMENDED SYSTEM DELIVERS IT'
    ],

    items: [
      {
        id:
          'stage',

        guidanceIndication:
          'Portfolio evolution guidance',

        whatYouToldUs:
          stageEvidence,

        userJTBD:
          stage?.job ??
          null,

        systemJTBD:
          stage
            ?.systemJTBD ??
          stage
            ?.systemResponse ??
          null,

        systemResponse:
          stage
            ?.systemJTBD ??
          stage
            ?.systemResponse ??
          null,

        recommendedSystemDelivery:
          stage
            ?.recommendedSystemDelivery ??
          null,

        /*
         * Preserve existing fields for compatibility.
         */
        profileType:
          'Stage',

        dimension:
          'Organize',

        profileLabel:
          stage
            ?.resolvedProfile
            ?.label ??
          null
      },


      {
        id:
          'style',

        guidanceIndication:
          'Portfolio interaction guidance',

        whatYouToldUs:
          styleEvidence,

        userJTBD:
          style?.job ??
          null,

        systemResponse:
          style
            ?.systemResponse ??
          null,

        recommendedSystemDelivery:
          style
            ?.recommendedSystemDelivery ??
          null,

        profileType:
          'Style',

        dimension:
          'Focus effort',

        profileLabel:
          style
            ?.resolvedProfile
            ?.label ??
          null
      },


      {
        id:
          'behavior',

        guidanceIndication:
          'Portfolio decision-making guidance',

        whatYouToldUs:
          behaviorEvidence,

        userJTBD:
          behavior?.job ??
          null,

        systemResponse:
          behaviorSystemResponse,

        recommendedSystemDelivery:
          null,

        profileType:
          'Behavior',

        dimension:
          'Decide',

        profileLabel:
          behavior
            ?.resolvedProfile
            ?.label ??
          null
      }
    ]
  };
}


/*
 * ============================================================
 * Recommendation reveal
 * ============================================================
 */

function buildRecommendationReveal({
  presentation,
  archetypeId,
  variantId,
  philosophy,
  profileAccountability
}) {
  const recommendation =
    presentation
      ?.diagnostics
      ?.recommendation ??
    {};

  const archetypeDisplayName =
    ARCHETYPE_DISPLAY_NAMES[
      archetypeId
    ] ??
    archetypeId ??
    'Portfolio System';

  const variantDisplayName =
    titleCase(
      variantId
    );

  const systemName =
    recommendation
      ?.systemName ??
    archetypeDisplayName;

  /*
   * Pull the archetype-level investor problem from the
   * philosophy presentation model.
   *
   * No new interpretation happens here.
   */
  const investorProblem =
    philosophy
      ?.investorProblem ??
    null;

  return {
    eyebrow:
      'YOUR RECOMMENDED PORTFOLIO SYSTEM',

    title:
      variantDisplayName
        ? (
            archetypeDisplayName +
            ' · ' +
            variantDisplayName
          )
        : archetypeDisplayName,

    archetypeId,

    archetypeDisplayName,

    variantId,

    variantDisplayName,

    systemName,

    philosophy: {
      name:
        philosophy
          ?.philosophyName ??
        null,

      summary:
        philosophy
          ?.summary ??
        null,

      sources:
        philosophy
          ?.sources ??
        [],

      /*
       * Keep this here for semantic consistency:
       *
       * recommendationReveal.philosophy.investorProblem
       */
      investorProblem:
        investorProblem
          ? {
              question:
                investorProblem
                  ?.question ??
                null,

              meaning:
                investorProblem
                  ?.meaning ??
                null
            }
          : null
    },

    /*
     * Also expose at the recommendation level so the hero
     * can consume:
     *
     * recommendationReveal.investorProblem
     *
     * without having to understand philosophy internals.
     */
    investorProblem:
      investorProblem
        ? {
            question:
              investorProblem
                ?.question ??
              null,

            meaning:
              investorProblem
                ?.meaning ??
              null
          }
        : null,

    profileAccountability
  };
}


/*
 * ============================================================
 * Sleeve translation
 * ============================================================
 */

function mergeSleeveGuidance(
  sleeves,
  boundaries,
  effortGuidance
) {
  const boundaryById =
    new Map(
      boundaries.map(
        (boundary) => [
          boundary.sleeveId,
          boundary
        ]
      )
    );

  const effortById =
    new Map(
      (
        effortGuidance
          ?.sleeves ??
        []
      ).map(
        (entry) => [
          entry.sleeveId,
          entry
        ]
      )
    );

  return sleeves.map(
    (sleeve) => {
      const boundary =
        boundaryById.get(
          sleeve.id
        ) ?? null;

      const effort =
        effortById.get(
          sleeve.id
        ) ?? null;

      return {
        ...sleeve,

        guidance: {
          investorQuestion:
            boundary
              ?.investorQuestion ??
            'What job does this part of my portfolio perform?',

          job:
            boundary
              ?.job ??
            firstDefined(
              sleeve
                ?.role
                ?.label,

              sleeve
                ?.role
                ?.description,

              sleeve
                ?.purpose,

              sleeve
                ?.whyItExists
            ),

          returnContribution:
            boundary
              ?.returnContribution ??
            null,

          whatBelongs:
            boundary
              ?.whatBelongs ??
            null,

          whatUsuallyDoesNotBelong:
            boundary
              ?.whatUsuallyDoesNotBelong ??
            null,

          redundancyCheck:
            boundary
              ?.redundancyCheck ??
            null,

          relevantSignals:
            boundary
              ?.relevantSignals ??
            null,

          irrelevantNoise:
            boundary
              ?.irrelevantNoise ??
            null,

          effortBoundary:
            boundary
              ?.effortBoundary ??
            null,

          actionBoundary:
            boundary
              ?.actionBoundary ??
            null,

          userFacingSummary:
            boundary
              ?.userFacingSummary ??
            null,

          effort: {
            level:
              effort
                ?.effortId ??
              sleeve
                ?.operatingProfile
                ?.effort ??
              null,

            label:
              effort
                ?.effortLabel ??
              sleeve
                ?.operatingProfile
                ?.effortLabel ??
              null,

            whyThisEffort:
              effort
                ?.whyThisEffort ??
              null,

            usefulAttention:
              effort
                ?.usefulAttention ??
              null,

            redundantAttention:
              effort
                ?.redundantAttention ??
              null,

            reviewCadence:
              effort
                ?.reviewCadence ??
              sleeve
                ?.operatingProfile
                ?.reviewCadence ??
              null,

            reviewCadenceLabel:
              effort
                ?.reviewCadenceLabel ??
              sleeve
                ?.operatingProfile
                ?.reviewCadenceLabel ??
              null
          }
        }
      };
    }
  );
}


/*
 * ============================================================
 * Behavior operating model
 * ============================================================
 */

function buildBehaviorOperatingModel(
  behaviorGuidance
) {
  if (!behaviorGuidance) {
    return null;
  }

  return {
    behaviorId:
      behaviorGuidance
        .behaviorId,

    title:
      'How your system helps you make decisions',

    investorQuestion:
      behaviorGuidance
        .investorQuestion,

    primaryNeed:
      behaviorGuidance
        .primaryNeed,

    decisionFraming:
      behaviorGuidance
        .decisionFraming,

    systemPromise:
      behaviorGuidance
        .systemPromise,

    decisionProtocol:
      behaviorGuidance
        .decisionProtocol,

    outcomes:
      behaviorGuidance
        .outcomes,

    commonDecisionMoments:
      behaviorGuidance
        .commonDecisionMoments,

    systemGuardrail:
      behaviorGuidance
        .systemGuardrail,

    userFacingSummary:
      behaviorGuidance
        .userFacingSummary
  };
}


/*
 * ============================================================
 * Public API
 * ============================================================
 */

export function presentInvestorSystemGuidance(
  presentation = {}
) {
  const stage =
    extractStage(
      presentation
    );

  const style =
    extractStyle(
      presentation
    );

  const behavior =
    extractBehavior(
      presentation
    );


  const stageId =
    extractStageId(
      presentation
    );

  const styleId =
    extractStyleId(
      presentation
    );

  const behaviorId =
    extractBehaviorId(
      presentation
    );


  const archetypeId =
    extractArchetypeId(
      presentation
    );

  const variantId =
    extractVariantId(
      presentation
    );


  const archetype =
    extractArchetype(
      presentation
    );

  const variant =
    extractVariant(
      presentation
    );


  const sleeves =
    extractSleeves(
      presentation
    );

  const structure =
    extractStructure(
      presentation
    );


  const selectedAnswers =
    extractSelectedAnswers(
      presentation
    );


  /*
   * Guidance resolution.
   */

  const behaviorGuidance =
    getBehaviorDecisionGuidance(
      behaviorId
    );


  const complexityGuidance =
    getVariantComplexityGuidance(
      archetypeId,
      variantId
    );


  const effortGuidance =
    getEffortReturnGuidance({
      styleId,
      structure,
      sleeves
    });


  const portfolioEvolutionGuidance =
    getPortfolioEvolutionGuidance({
      setupOptionIds:
        selectedAnswers
          .filter(
            (answer) =>
              answer?.questionId ===
              'setup'
          )
          .map(
            (answer) =>
              answer.optionId
          ),

      evolutionOptionId:
        selectedAnswers.find(
          (answer) =>
            answer?.questionId ===
            'evolution'
        )?.optionId ?? null,

      resolvedStageId:
        stageId
    });


  const portfolioInteractionGuidance =
    getPortfolioInteractionGuidance({
      tradeoffOptionId:
        selectedAnswers.find(
          (answer) =>
            answer?.questionId ===
            'tradeoff'
        )?.optionId ?? null,

      marketPsychologyOptionId:
        selectedAnswers.find(
          (answer) =>
            answer?.questionId ===
            'marketPsychology'
        )?.optionId ?? null,

      resolvedStyleId:
        style?.profileId ?? null
    });


  const portfolioDecisionMakingGuidance =
    getPortfolioDecisionMakingGuidance({
      transitionOptionIds:
        selectedAnswers
          .filter(
            (answer) =>
              answer?.questionId ===
              'transition'
          )
          .map(
            (answer) =>
              answer.optionId
          ),

      decisionStyleOptionIds:
        selectedAnswers
          .filter(
            (answer) =>
              answer?.questionId ===
              'decisionStyle'
          )
          .map(
            (answer) =>
              answer.optionId
          ),

      resolvedBehaviorId:
        behavior?.profileId ?? null
    });


  const recommendedSystemDelivery =
    getPortfolioEvolutionDelivery({
      archetypeId,
      variantId,
      evolutionOptionId:
        portfolioEvolutionGuidance
          ?.evolutionOptionId ??
        null,
      portfolioSystem: {
        name:
          presentation
            ?.diagnostics
            ?.recommendation
            ?.systemName ??
          null,
        structure,
        sleeves
      }
    });


  const recommendedInteractionDelivery =
    getPortfolioInteractionDelivery({
      archetypeId,
      variantId,
      tradeoffOptionId:
        portfolioInteractionGuidance
          ?.tradeoffOptionId ??
        null,
      marketPsychologyOptionId:
        portfolioInteractionGuidance
          ?.marketPsychologyOptionId ??
        null,
      portfolioSystem: {
        name:
          presentation
            ?.diagnostics
            ?.recommendation
            ?.systemName ??
          null,
        structure,
        sleeves
      }
    });


  const boundaries =
    getSleeveBoundaries(
      sleeves
    );


  /*
   * Investor jobs.
   */

  const investorJobs = {
    organize:
      buildOrganizationJob({
        stage,
        portfolioEvolutionGuidance,
        recommendedSystemDelivery
      }),

    focus:
      buildEffortJob({
        style,
        effortGuidance,
        portfolioInteractionGuidance,
        recommendedSystemDelivery:
          recommendedInteractionDelivery
      }),

    decide:
      buildDecisionJob({
        behavior,
        behaviorGuidance,
        portfolioDecisionMakingGuidance
      })
  };


  /*
   * Portfolio philosophy.
   */

  const philosophy =
    buildPhilosophyExplanation({
      archetype,
      archetypeId,
      presentation
    });


  /*
   * Complexity.
   */

  const complexity =
    buildComplexityExplanation({
      variant,
      variantId,
      archetypeId,
      sleeves,
      complexityGuidance
    });


  /*
   * Sleeves.
   */

  const guidedSleeves =
    mergeSleeveGuidance(
      sleeves,
      boundaries,
      effortGuidance
    );


  /*
   * Behavior.
   */

  const behaviorOperatingModel =
    buildBehaviorOperatingModel(
      behaviorGuidance
    );


  /*
   * Direct quiz evidence ->
   * user JTBD ->
   * concrete system response.
   */

  const profileAccountability =
    buildProfileAccountability({
      selectedAnswers,
      investorJobs,
      behaviorGuidance
    });


  /*
   * Recommendation reveal.
   */

  const recommendationReveal =
    buildRecommendationReveal({
      presentation,
      archetypeId,
      variantId,
      philosophy,
      profileAccountability
    });


  return {
    source:
      presentation,


    resolved: {
      stageId,
      styleId,
      behaviorId,
      archetypeId,
      variantId,
      sleeveCount:
        sleeves.length
    },


    recommendationReveal,

    investorJobs,

    philosophy,

    complexity,

    effort:
      effortGuidance,

    behavior:
      behaviorOperatingModel,

    sleeves:
      guidedSleeves,


    systemFit: {
      title:
        'Why this system fits the way you invest',

      summary:
        'Your portfolio system connects the jobs your money needs to perform with the amount of effort you want to spend and the kind of decision support that helps you act with intention.',

      questions: [
        {
          id:
            'organize',

          question:
            'What needs to be organized?',

          answer:
            investorJobs
              .organize
              .systemResponse
        },

        {
          id:
            'philosophy',

          question:
            'Why this portfolio philosophy?',

          answer:
            philosophy
              .summary
        },

        {
          id:
            'complexity',

          question:
            'Why ' +
            sleeves.length +
            ' portfolio roles?',

          answer:
            complexity
              .userFacingSummary
        },

        {
          id:
            'effort',

          question:
            'Where is your attention worth spending?',

          answer:
            effortGuidance
              ?.userFacingSummary ??
            null
        },

        {
          id:
            'behavior',

          question:
            'How should the system help you make decisions?',

          answer:
            behaviorOperatingModel
              ?.userFacingSummary ??
            null
        }
      ]
    },


    userLedPrinciple: {
      title:
        'Your system supports the decision. You make it.',

      explanation:
        'AaronBux organizes portfolio roles, highlights relevant information, and provides decision boundaries so you can understand what deserves attention. The system does not require every market event or investment idea to become a portfolio action.'
    }
  };
}


export function presentSystemGuidance(
  presentation = {}
) {
  return presentInvestorSystemGuidance(
    presentation
  );
}

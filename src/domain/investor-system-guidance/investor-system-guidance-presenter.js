/*
 * Investor System Guidance Presenter
 *
 * PURPOSE
 * -------
 * Build the final investor-facing translation contract between:
 *
 *   existing assessment / recommendation logic
 *
 * and:
 *
 *   user-facing recommendation screens.
 *
 * This presenter answers:
 *
 * 1. What does my portfolio need help organizing?
 * 2. Where is my investing effort worth spending?
 * 3. What help do I need when deciding whether to act?
 * 4. What portfolio system was actually recommended?
 * 5. Why this portfolio philosophy?
 * 6. Why this variant / level of complexity?
 * 7. Why this many sleeves?
 * 8. What job does each sleeve perform?
 * 9. What belongs in each sleeve?
 * 10. What should I monitor?
 * 11. How much attention is each sleeve worth?
 *
 * IMPORTANT
 * ---------
 * This file does NOT:
 *
 * - score assessment answers
 * - resolve Stage
 * - resolve Style
 * - resolve Behavior
 * - resolve archetype
 * - resolve variant
 * - compose portfolios
 * - alter sleeve weights
 * - select securities
 * - recommend trades
 *
 * Existing domain outputs remain authoritative.
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
  getSleeveBoundaries
} from './sleeve-boundary-guidance.js';


/*
 * ============================================================
 * User-facing archetype names
 * ============================================================
 *
 * Internal IDs such as FT and BFO should not be used as the
 * primary recommendation name in the UI.
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
 * Generic helpers
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


/*
 * ============================================================
 * Extractors aligned to portfolio-job-fit-presenter.js
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
    if (Array.isArray(candidate)) {
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
 * Investor JTBD translation
 * ============================================================
 */


/*
 * Stage -> organization job
 */

function buildOrganizationJob({
  stage
}) {
  return {
    id:
      'organize',

    title:
      'Organize',

    investorQuestion:
      'How should I organize my investments from where I am today?',

    job:
      'Give every important part of the portfolio a clear job.',

    systemResponse:
      'Use distinct portfolio roles so investments are understood by what they contribute to the overall system rather than as a collection of unrelated holdings.',

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
    }
  };
}


/*
 * Style -> effort job
 */

function buildEffortJob({
  style,
  effortGuidance
}) {
  return {
    id:
      'focus-effort',

    title:
      'Focus',

    investorQuestion:
      'Where is my investing effort actually worth spending?',

    job:
      'Spend attention where research or monitoring can change a meaningful portfolio decision.',

    systemResponse:
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
    }
  };
}


/*
 * Behavior -> decision job
 */

function buildDecisionJob({
  behavior,
  behaviorGuidance
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
      behaviorGuidance
        ?.primaryNeed ??
      'Use the portfolio system as a decision framework before changing the portfolio.',

    systemResponse:
      behaviorGuidance
        ?.systemPromise ??
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
    }
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

  return {
    archetypeId,

    title:
      'Why this portfolio philosophy?',

    investorQuestion:
      'What overall philosophy should organize my investments?',

    philosophyName,

    summary,

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
      null
  };
}


/*
 * ============================================================
 * Recommendation reveal
 * ============================================================
 *
 * This is the first thing the user should see on the
 * Portfolio System Fit screen.
 *
 * It deliberately reveals:
 *
 * - full archetype name
 * - variant
 * - actual AaronBux system name
 * - portfolio philosophy
 * - philosophy sources
 * - explicit accountability to Stage / Style / Behavior
 */

function buildRecommendationReveal({
  presentation,
  archetypeId,
  variantId,
  philosophy,
  investorJobs
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

  /*
   * The portfolio-job-fit resolver already exposes
   * systemName when the existing constituent system has one.
   *
   * We do not manufacture a new system name here.
   */
  const systemName =
    recommendation
      ?.systemName ??
    archetypeDisplayName;

  const accountabilityItems = [
    {
      id:
        'stage',

      profileType:
        'Stage',

      dimension:
        'Organize',

      profileLabel:
        investorJobs
          ?.organize
          ?.resolvedProfile
          ?.label ??
        null,

      profileSummary:
        investorJobs
          ?.organize
          ?.resolvedProfile
          ?.summary ??
        null,

      investorQuestion:
        investorJobs
          ?.organize
          ?.investorQuestion ??
        null,

      requirement:
        investorJobs
          ?.organize
          ?.job ??
        null,

      portfolioRequirement:
        investorJobs
          ?.organize
          ?.resolvedProfile
          ?.portfolioRequirement ??
        null,

      systemResponse:
        investorJobs
          ?.organize
          ?.resolvedProfile
          ?.systemFit ??
        investorJobs
          ?.organize
          ?.systemResponse ??
        null
    },

    {
      id:
        'style',

      profileType:
        'Style',

      dimension:
        'Focus effort',

      profileLabel:
        investorJobs
          ?.focus
          ?.resolvedProfile
          ?.label ??
        null,

      profileSummary:
        investorJobs
          ?.focus
          ?.resolvedProfile
          ?.summary ??
        null,

      investorQuestion:
        investorJobs
          ?.focus
          ?.investorQuestion ??
        null,

      requirement:
        investorJobs
          ?.focus
          ?.job ??
        null,

      portfolioRequirement:
        investorJobs
          ?.focus
          ?.resolvedProfile
          ?.portfolioRequirement ??
        null,

      systemResponse:
        investorJobs
          ?.focus
          ?.resolvedProfile
          ?.systemFit ??
        investorJobs
          ?.focus
          ?.systemResponse ??
        null
    },

    {
      id:
        'behavior',

      profileType:
        'Behavior',

      dimension:
        'Decide',

      profileLabel:
        investorJobs
          ?.decide
          ?.resolvedProfile
          ?.label ??
        null,

      profileSummary:
        investorJobs
          ?.decide
          ?.resolvedProfile
          ?.summary ??
        null,

      investorQuestion:
        investorJobs
          ?.decide
          ?.investorQuestion ??
        null,

      requirement:
        investorJobs
          ?.decide
          ?.job ??
        null,

      portfolioRequirement:
        investorJobs
          ?.decide
          ?.resolvedProfile
          ?.portfolioRequirement ??
        null,

      systemResponse:
        investorJobs
          ?.decide
          ?.resolvedProfile
          ?.systemFit ??
        investorJobs
          ?.decide
          ?.systemResponse ??
        null
    }
  ];

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
        []
    },

    profileAccountability: {
      eyebrow:
        'ACCOUNTABLE TO YOUR INVESTOR PROFILE',

      title:
        'This system has to solve all three of your investing jobs.',

      summary:
        'Your recommendation is not based on portfolio philosophy alone. Its structure must support what you need to organize, where your effort is worth spending, and how the system should help you make decisions.',

      items:
        accountabilityItems
    }
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


  /*
   * Resolve explanation guidance only.
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


  const boundaries =
    getSleeveBoundaries(
      sleeves
    );


  /*
   * Build investor jobs.
   */

  const investorJobs = {
    organize:
      buildOrganizationJob({
        stage
      }),

    focus:
      buildEffortJob({
        style,
        effortGuidance
      }),

    decide:
      buildDecisionJob({
        behavior,
        behaviorGuidance
      })
  };


  /*
   * Translate portfolio architecture.
   */

  const philosophy =
    buildPhilosophyExplanation({
      archetype,
      archetypeId,
      presentation
    });


  const complexity =
    buildComplexityExplanation({
      variant,
      variantId,
      archetypeId,
      sleeves,
      complexityGuidance
    });


  const guidedSleeves =
    mergeSleeveGuidance(
      sleeves,
      boundaries,
      effortGuidance
    );


  const behaviorOperatingModel =
    buildBehaviorOperatingModel(
      behaviorGuidance
    );


  /*
   * Build the new first-screen recommendation reveal.
   */

  const recommendationReveal =
    buildRecommendationReveal({
      presentation,
      archetypeId,
      variantId,
      philosophy,
      investorJobs
    });


  return {
    /*
     * Preserve original stable presenter output.
     */
    source:
      presentation,


    /*
     * Resolved IDs.
     */
    resolved: {
      stageId,
      styleId,
      behaviorId,
      archetypeId,
      variantId,
      sleeveCount:
        sleeves.length
    },


    /*
     * New top-level reveal.
     */
    recommendationReveal,


    /*
     * User JTBD.
     */
    investorJobs,


    /*
     * Portfolio philosophy.
     */
    philosophy,


    /*
     * Variant / structural complexity.
     */
    complexity,


    /*
     * Effort model.
     */
    effort:
      effortGuidance,


    /*
     * Behavior decision-support model.
     */
    behavior:
      behaviorOperatingModel,


    /*
     * Bounded sleeve explanations.
     */
    sleeves:
      guidedSleeves,


    /*
     * Overall fit summary.
     */
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


    /*
     * User-led positioning.
     */
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

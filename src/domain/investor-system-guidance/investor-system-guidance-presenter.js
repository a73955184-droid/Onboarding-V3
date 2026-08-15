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
 * 4. Why this portfolio philosophy?
 * 5. Why this variant / level of complexity?
 * 6. Why this many sleeves?
 * 7. What job does each sleeve perform?
 * 8. What belongs in each sleeve?
 * 9. What should I monitor?
 * 10. How much attention is each sleeve worth?
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
 * Helpers
 */

function firstDefined(...values) {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null
  ) ?? null;
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


function extractStageId(presentation) {
  return normalizeId(
    firstDefined(
      presentation?.profile?.stage?.id,
      presentation?.stage?.id,
      presentation?.stageId
    )
  );
}


function extractStyleId(presentation) {
  return normalizeId(
    firstDefined(
      presentation?.profile?.style?.id,
      presentation?.style?.id,
      presentation?.styleId
    )
  );
}


function extractBehaviorId(presentation) {
  return normalizeId(
    firstDefined(
      presentation?.profile?.behavior?.id,
      presentation?.profile?.modifier?.id,
      presentation?.behavior?.id,
      presentation?.modifier?.id,
      presentation?.behaviorId,
      presentation?.modifierId
    )
  );
}


function extractArchetypeId(presentation) {
  return firstDefined(
    presentation?.system?.archetype?.id,
    presentation?.portfolioSystem?.archetype?.id,
    presentation?.philosophy?.archetype?.id,
    presentation?.archetype?.id,
    presentation?.archetypeId
  );
}


function extractVariantId(presentation) {
  return normalizeId(
    firstDefined(
      presentation?.system?.variant?.id,
      presentation?.portfolioSystem?.variant?.id,
      presentation?.philosophy?.variant?.id,
      presentation?.variant?.id,
      presentation?.variantId
    )
  );
}


function extractSleeves(presentation) {
  const candidates = [
    presentation?.system?.sleeves,
    presentation?.portfolioSystem?.sleeves,
    presentation?.portfolio?.sleeves,
    presentation?.philosophy?.sleeves,
    presentation?.sleeves
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
    presentation?.system?.structure,
    presentation?.portfolioSystem?.structure,
    presentation?.portfolio?.structure,
    presentation?.structure,
    {}
  );
}


function extractArchetype(presentation) {
  return firstDefined(
    presentation?.system?.archetype,
    presentation?.portfolioSystem?.archetype,
    presentation?.philosophy?.archetype,
    presentation?.archetype,
    null
  );
}


function extractVariant(presentation) {
  return firstDefined(
    presentation?.system?.variant,
    presentation?.portfolioSystem?.variant,
    presentation?.philosophy?.variant,
    presentation?.variant,
    null
  );
}


function extractStage(presentation) {
  return firstDefined(
    presentation?.profile?.stage,
    presentation?.stage,
    null
  );
}


function extractStyle(presentation) {
  return firstDefined(
    presentation?.profile?.style,
    presentation?.style,
    null
  );
}


function extractBehavior(presentation) {
  return firstDefined(
    presentation?.profile?.behavior,
    presentation?.profile?.modifier,
    presentation?.behavior,
    presentation?.modifier,
    null
  );
}


/*
 * JTBD translation
 *
 * These are deliberately generic contracts.
 *
 * Existing profile copy remains authoritative for the specific
 * resolved Stage / Style / Behavior labels and evidence.
 */

function buildOrganizationJob({
  stage
}) {
  return {
    id: 'organize',

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
        stage?.id ?? null,

      label:
        firstDefined(
          stage?.label,
          stage?.name
        ),

      summary:
        firstDefined(
          stage?.summary,
          stage?.description,
          stage?.explanation
        )
    }
  };
}


function buildEffortJob({
  style,
  effortGuidance
}) {
  return {
    id: 'focus-effort',

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
        style?.id ?? null,

      label:
        firstDefined(
          style?.label,
          style?.name
        ),

      summary:
        firstDefined(
          style?.summary,
          style?.description,
          style?.explanation
        )
    }
  };
}


function buildDecisionJob({
  behavior,
  behaviorGuidance
}) {
  return {
    id: 'decide',

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
        behavior?.id ?? null,

      label:
        firstDefined(
          behavior?.label,
          behavior?.name
        ),

      summary:
        firstDefined(
          behavior?.summary,
          behavior?.description,
          behavior?.explanation
        )
    }
  };
}


/*
 * Philosophy translation
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
 * Variant translation
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
        variant?.label,
        variant?.name,
        variant?.philosophyName,
        variantId
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
 * Sleeve translation
 *
 * Merge the existing resolved sleeve with its guidance.
 *
 * Existing sleeve values remain untouched.
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
        effortGuidance?.sleeves ??
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
        /*
         * Preserve original resolved sleeve.
         */
        ...sleeve,

        guidance: {
          investorQuestion:
            boundary
              ?.investorQuestion ??
            'What job does this part of my portfolio perform?',

          job:
            boundary?.job ??
            firstDefined(
              sleeve?.role?.label,
              sleeve?.role?.description,
              sleeve?.purpose
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
              effort?.effortId ??
              null,

            label:
              effort?.effortLabel ??
              null,

            whyThisEffort:
              effort?.whyThisEffort ??
              null,

            usefulAttention:
              effort?.usefulAttention ??
              null,

            redundantAttention:
              effort?.redundantAttention ??
              null,

            reviewCadence:
              effort?.reviewCadence ??
              null,

            reviewCadenceLabel:
              effort
                ?.reviewCadenceLabel ??
              null
          }
        }
      };
    }
  );
}


/*
 * Decision-support translation
 */

function buildBehaviorOperatingModel(
  behaviorGuidance
) {
  if (!behaviorGuidance) {
    return null;
  }

  return {
    behaviorId:
      behaviorGuidance.behaviorId,

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
 * Main presenter
 *
 * INPUT
 * -----
 * `presentation` should be the already-built output from the
 * existing portfolio-job-fit presenter.
 *
 * OUTPUT
 * ------
 * A richer UI-ready contract.
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
   * Resolve guidance only.
   *
   * None of these calls resolve the portfolio itself.
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
   * Build the user JTBD layer.
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
   * Translate system architecture.
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


  return {
    /*
     * Preserve the existing presenter result so downstream
     * consumers can still access the original contract.
     */
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

    /*
     * USER QUESTION:
     * "What does my system need to help me do?"
     */
    investorJobs,

    /*
     * USER QUESTION:
     * "Why this kind of portfolio?"
     */
    philosophy,

    /*
     * USER QUESTION:
     * "Why this many parts?"
     */
    complexity,

    /*
     * USER QUESTION:
     * "Where is my effort worth spending?"
     */
    effort:
      effortGuidance,

    /*
     * USER QUESTION:
     * "How does my Behavior change the way
     * I should operate this portfolio?"
     */
    behavior:
      behaviorOperatingModel,

    /*
     * USER QUESTION:
     * "What does every part of the system do?"
     */
    sleeves:
      guidedSleeves,

    /*
     * High-level explanation for the System Fit screen.
     */
    systemFit: {
      title:
        'Why this system fits the way you invest',

      summary:
        'Your portfolio system connects the jobs your money needs to perform with the amount of effort you want to spend and the kind of decision support that helps you act with intention.',

      questions: [
        {
          id: 'organize',

          question:
            'What needs to be organized?',

          answer:
            investorJobs
              .organize
              .systemResponse
        },

        {
          id: 'philosophy',

          question:
            'Why this portfolio philosophy?',

          answer:
            philosophy.summary
        },

        {
          id: 'complexity',

          question:
            `Why ${sleeves.length} portfolio roles?`,

          answer:
            complexity
              .userFacingSummary
        },

        {
          id: 'effort',

          question:
            'Where is your attention worth spending?',

          answer:
            effortGuidance
              ?.userFacingSummary ??
            null
        },

        {
          id: 'behavior',

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
     * Shared user-led product principle.
     *
     * Useful for UI footer / explanatory copy.
     */
    userLedPrinciple: {
      title:
        'Your system supports the decision. You make it.',

      explanation:
        'AaronBux organizes portfolio roles, highlights relevant information, and provides decision boundaries so you can understand what deserves attention. The system does not require every market event or investment idea to become a portfolio action.'
    }
  };
}


/*
 * Alias with a shorter name for UI consumers.
 */

export function presentSystemGuidance(
  presentation = {}
) {
  return presentInvestorSystemGuidance(
    presentation
  );
}

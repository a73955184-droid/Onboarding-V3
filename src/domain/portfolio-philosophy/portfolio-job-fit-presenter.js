/*
 * Portfolio Job Fit Presenter
 *
 * PURPOSE
 * -------
 * Convert the verbose output of:
 *
 *   resolvePortfolioJobFit()
 *
 * into a concise UI-ready presentation model.
 *
 * This file MUST NOT:
 *
 * - score the quiz
 * - resolve Stage / Style / Behavior
 * - resolve archetype
 * - resolve variant
 * - construct a portfolio
 * - change sleeve weights
 * - infer new investor needs
 * - manufacture personalization
 *
 * All investment/system reasoning must already exist in the
 * Portfolio Job Fit resolver and philosophy corpus.
 */


/*
 * ------------------------------------------------------------
 * Human-readable labels for semantic system roles
 * ------------------------------------------------------------
 */

const SYSTEM_ROLE_LABELS = Object.freeze({
  foundation: 'Foundation',

  'required-support':
    'Required support',

  'stability-resilience':
    'Stability & resilience',

  'liquidity-access':
    'Liquidity & access',

  diversifier:
    'Diversifier',

  'bounded-improvement':
    'Bounded improvement',

  'growth-enhancer':
    'Growth enhancer',

  'exploration-research':
    'Exploration & research',

  'tactical-conditional':
    'Tactical / conditional',

  income:
    'Income',

  'inflation-protection':
    'Inflation protection'
});


/*
 * ------------------------------------------------------------
 * Human-readable labels for effort
 * ------------------------------------------------------------
 */

const EFFORT_LABELS = Object.freeze({
  'very-low': 'Very low effort',
  low: 'Low effort',
  moderate: 'Moderate effort',
  high: 'High effort'
});


/*
 * ------------------------------------------------------------
 * Human-readable review cadence
 * ------------------------------------------------------------
 */

const REVIEW_CADENCE_LABELS = Object.freeze({
  annual: 'Annual review',

  'semi-annual':
    'Twice-yearly review',

  quarterly:
    'Quarterly review',

  monthly:
    'Monthly review',

  'as-needs-change':
    'Review as needs change',

  'condition-driven':
    'Review when conditions change',

  'thesis-driven':
    'Review when the investment thesis changes'
});


/*
 * ------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------
 */

function percentage(
  value
) {
  if (
    typeof value !== 'number'
  ) {
    return null;
  }

  return Math.round(
    value * 100
  );
}


function roleLabel(
  systemRole
) {
  return (
    SYSTEM_ROLE_LABELS[
      systemRole
    ] ??
    systemRole ??
    'Portfolio role'
  );
}


function effortLabel(
  effort
) {
  return (
    EFFORT_LABELS[
      effort
    ] ??
    effort ??
    null
  );
}


function cadenceLabel(
  cadence
) {
  return (
    REVIEW_CADENCE_LABELS[
      cadence
    ] ??
    cadence ??
    null
  );
}


function unique(
  values
) {
  return [
    ...new Set(
      values.filter(Boolean)
    )
  ];
}


/*
 * ------------------------------------------------------------
 * Convert evidence records into a concise set of user signals
 * ------------------------------------------------------------
 *
 * IMPORTANT:
 *
 * We preserve exact quiz language.
 * We do NOT reinterpret or rewrite the user's response.
 */

function summarizeEvidence(
  evidence = [],
  limit = 3
) {
  if (
    !Array.isArray(evidence)
  ) {
    return [];
  }

  const seen =
    new Set();

  const result = [];

  for (
    const item
    of evidence
  ) {
    const text =
      item?.answerText;

    if (
      !text ||
      seen.has(text)
    ) {
      continue;
    }

    seen.add(text);

    result.push({
      questionId:
        item.questionId ??
        null,

      optionId:
        item.optionId ??
        null,

      text
    });

    if (
      result.length >=
      limit
    ) {
      break;
    }
  }

  return result;
}


/*
 * ------------------------------------------------------------
 * Produce a concise evidence explanation for one sleeve
 * ------------------------------------------------------------
 */

function buildSleeveUserFit(
  sleeve
) {
  const personalization =
    sleeve
      ?.personalization ??
    {};

  if (
    personalization.status ===
    'direct-evidence'
  ) {
    const evidence =
      summarizeEvidence(
        personalization
          .evidence,
        3
      );

    return {
      type:
        'direct-evidence',

      heading:
        'Why this connects to what you told us',

      evidence,

      evidenceTags:
        personalization
          .evidenceTags ??
        []
    };
  }

  return {
    type:
      'system-design-only',

    heading:
      'Why this role is part of the system',

    explanation:
      personalization
        .noEvidenceCopy ??
      'This role comes from the portfolio system design rather than a personal requirement inferred directly from your answers.',

    evidence: [],

    evidenceTags: []
  };
}


/*
 * ------------------------------------------------------------
 * Present one constituent sleeve
 * ------------------------------------------------------------
 */

function presentSleeve(
  sleeve
) {
  return {
    id:
      sleeve.id,

    label:
      sleeve.label,

    weight:
      sleeve.weight,

    weightPercent:
      percentage(
        sleeve.weight
      ),

    role: {
      id:
        sleeve.systemRole,

      label:
        roleLabel(
          sleeve.systemRole
        )
    },

    whyItExists:
      sleeve.whyItExists ??
      null,

    contributionToSystem:
      sleeve
        .contributionToSystem ??
      null,

    operatingProfile: {
      effort:
        sleeve.effort ??
        null,

      effortLabel:
        effortLabel(
          sleeve.effort
        ),

      reviewCadence:
        sleeve.reviewCadence ??
        null,

      reviewCadenceLabel:
        cadenceLabel(
          sleeve.reviewCadence
        ),

      returnFunction:
        sleeve.returnFunction ??
        null
    },

    monitoring: {
      marketTrendTags:
        sleeve
          .marketTrendTags ??
        [],

      marketTrends:
        sleeve
          .marketTrends ??
        [],

      guidance:
        sleeve
          .monitoringGuidance ??
        null
    },

    assetCategories:
      sleeve
        .assetCategories ??
      [],

    startsUnallocated:
      sleeve
        .startsUnallocated ===
      true,

    userFit:
      buildSleeveUserFit(
        sleeve
      ),

    sources:
      (
        sleeve.sources ??
        []
      ).map(
        (source) => ({
          id:
            source.id,

          organization:
            source.organization,

          title:
            source.title,

          url:
            source.url
        })
      )
  };
}


/*
 * ------------------------------------------------------------
 * Present canonical Stage / Style / Behavior job
 * ------------------------------------------------------------
 */

function presentJob(
  job,
  dimension
) {
  if (!job) {
    return null;
  }

  const dimensionLabels = {
    stage: {
      eyebrow:
        'How your portfolio should be organized',

      userQuestion:
        'What should your portfolio help you build next?'
    },

    style: {
      eyebrow:
        'How you prefer to engage',

      userQuestion:
        'How much attention should your portfolio require?'
    },

    behavior: {
      eyebrow:
        'How portfolio decisions should be guided',

      userQuestion:
        'How should the system help you decide when to act?'
    }
  };

  const labels =
    dimensionLabels[
      dimension
    ] ?? {};

  return {
    dimension,

    eyebrow:
      labels.eyebrow ??
      null,

    userQuestion:
      labels.userQuestion ??
      null,

    profileId:
      job.profileId,

    jobId:
      job.jobId,

    title:
      job.title,

    description:
      job.description,

    portfolioRequirement:
      job.portfolioRequirement,

    systemFit:
      job.systemFit,

    supportingSleeveIds:
      job
        .supportingSleeveIds ??
      []
  };
}


/*
 * ------------------------------------------------------------
 * Present portfolio structure summary
 * ------------------------------------------------------------
 */

function presentStructure(
  structure,
  sleeves
) {
  const sleeveCount =
    structure
      ?.sleeveCount ??
    sleeves.length;

  const required =
    structure
      ?.requiredSleeveCount ??
    null;

  const optional =
    structure
      ?.optionalSleeveCount ??
    null;

  const lowEffortPercent =
    percentage(
      structure
        ?.lowEffortWeight
    );

  const roles =
    unique(
      sleeves.map(
        (sleeve) =>
          sleeve.role.label
      )
    );

  return {
    sleeveCount,

    requiredSleeveCount:
      required,

    optionalSleeveCount:
      optional,

    lowEffortPercent,

    roleMix:
      structure
        ?.roleMix ??
      {},

    roleWeightMix:
      structure
        ?.roleWeightMix ??
      {},

    effortMix:
      structure
        ?.effortMix ??
      {},

    roleLabels:
      roles,

    summary:
      sleeveCount === 1
        ? 'This system uses 1 portfolio sleeve.'
        : 'This system uses ' +
          sleeveCount +
          ' portfolio sleeves with distinct jobs.'
  };
}


/*
 * ------------------------------------------------------------
 * Present top-level archetype philosophy
 * ------------------------------------------------------------
 */

function presentPhilosophy(
  fitResult
) {
  const archetype =
    fitResult
      ?.philosophy
      ?.archetype;

  const variant =
    fitResult
      ?.philosophy
      ?.variant;

  const archetypeId =
    fitResult
      ?.recommendation
      ?.archetypeId ??
    archetype
      ?.archetypeId ??
    null;

  const variantId =
    fitResult
      ?.recommendation
      ?.variantId ??
    variant
      ?.variantId ??
    null;

  const variantJobImpact =
    archetype
      ?.variantJobImpact ??
    null;

  const variantExplanationCopy =
    archetypeId &&
    variantId
      ? archetype
          ?.variantExplanations
          ?.[variantId]
          ?.copy ??
        null
      : null;

  return {
    archetype: {
      id:
        archetypeId,

      title:
        archetype
          ?.philosophyName ??
        fitResult
          ?.recommendation
          ?.systemName ??
        null,

      /*
       * AaronBux investor-facing interpretation of the
       * core problem this archetype is designed to solve.
       *
       * This content is owned by archetype-philosophies.js.
       * The presenter only passes it downstream.
       */
      investorProblem:
        archetype
          ?.investorProblem ??
        null,

      summary:
        archetype
          ?.summary ??
        fitResult
          ?.philosophy
          ?.existingSystemPhilosophy ??
        null,

      governingPrinciples:
        archetype
          ?.governingPrinciples ??
        [],

      variantJobImpact:
        archetypeId &&
        variantJobImpact
          ? {
              archetypeId,
              evolution: {
                level:
                  variantJobImpact
                    ?.evolution
                    ?.level ??
                  null
              },
              interaction: {
                level:
                  variantJobImpact
                    ?.interaction
                    ?.level ??
                  null
              },
              decisionMaking: {
                level:
                  variantJobImpact
                    ?.decisionMaking
                    ?.level ??
                  null
              },
              mainReason:
                variantJobImpact
                  ?.mainReason ??
                null
            }
          : null,

      sources:
        (
          fitResult
            ?.philosophy
            ?.archetypeSources ??
          []
        ).map(
          (source) => ({
            id:
              source.id,

            organization:
              source.organization,

            title:
              source.title,

            url:
              source.url
          })
        )
    },

    variantExplanation:
      archetypeId &&
      variantId &&
      variantExplanationCopy
        ? {
            archetypeId,
            variantId,
            copy:
              variantExplanationCopy
          }
        : null,

    variant: {
      id:
        variantId,

      title:
        variant
          ?.philosophyName ??
        null,

      summary:
        variant
          ?.summary ??
        null,

      characteristics:
        variant
          ?.characteristics ??
        {}
    },

    existingSystemInvariant:
      fitResult
        ?.philosophy
        ?.existingSystemInvariant ??
      null
  };
}


/*
 * ------------------------------------------------------------
 * Present quiz evidence for top of screen
 * ------------------------------------------------------------
 *
 * We show a small number of actual selected answers.
 *
 * This is intentionally not "all evidence".
 */

function presentTopEvidence(
  evidenceResult,
  limit = 4
) {
  return summarizeEvidence(
    evidenceResult
      ?.selectedAnswers ??
    [],
    limit
  );
}


/*
 * ============================================================
 * PUBLIC API
 * ============================================================
 */

export function presentPortfolioJobFit(
  fitResult,
  options = {}
) {
  if (
    !fitResult ||
    typeof fitResult !==
      'object'
  ) {
    throw new Error(
      'presentPortfolioJobFit requires a portfolio job-fit result.'
    );
  }

  const sleeves =
    (
      fitResult.sleeves ??
      []
    ).map(
      presentSleeve
    );

  const evidenceLimit =
    Number.isInteger(
      options.evidenceLimit
    )
      ? options.evidenceLimit
      : 4;

  const jobs = {
    stage:
      presentJob(
        fitResult
          ?.jobs
          ?.stage,
        'stage'
      ),

    style:
      presentJob(
        fitResult
          ?.jobs
          ?.style,
        'style'
      ),

    behavior:
      presentJob(
        fitResult
          ?.jobs
          ?.behavior,
        'behavior'
      )
  };

  const philosophy =
    presentPhilosophy(
      fitResult
    );

  const structure =
    presentStructure(
      fitResult.structure,
      sleeves
    );

  return {
    /*
     * Screen identity.
     */
    screen: {
      id:
        'portfolio-system-fit',

      eyebrow:
        'WHY THIS SYSTEM FITS YOU',

      title:
        'See how your answers became a portfolio system',

      description:
        'Your answers help us understand how you want a portfolio to be organized, how much attention it should require, and how portfolio decisions should be guided.'
    },


    /*
     * Section 1
     *
     * Actual user evidence only.
     */
    evidence: {
      heading:
        'What your answers told us',

      description:
        'These are some of the responses that shaped how the system interprets your investing needs.',

      /*
       * Concise evidence retained for any UI that wants
       * only a small sample of user answers.
       */
      items:
        presentTopEvidence(
          fitResult.evidence,
          evidenceLimit
        ),

      /*
       * Preserve the complete quiz evidence for downstream
       * presenters such as investor-system-guidance-presenter.
       *
       * Do not summarize, rewrite, or limit these responses.
       */
      selectedAnswers:
        fitResult
          ?.evidence
          ?.selectedAnswers ??
        []
    },


    /*
     * Preserve the resolver's complete explainability projection.
     * No scoring or interpretation happens in this presenter.
     */
    explainability:
      fitResult
        ?.explainability ??
      null,


    /*
     * Section 2
     *
     * Existing canonical Stage / Style / Behavior JTBD.
     */
    jobs: {
      heading:
        'What your portfolio needs to help you do',

      description:
        'Your profile translates into three different jobs for the portfolio: how it should be structured, how you should engage with it, and how decisions should be supported.',

      stage:
        jobs.stage,

      style:
        jobs.style,

      behavior:
        jobs.behavior
    },


    /*
     * Section 3
     *
     * Established philosophy + AaronBux implementation.
     */
    philosophy: {
      heading:
        'Why this portfolio philosophy',

      description:
        'The portfolio philosophy determines the kind of system being built. Your variant determines how simply or explicitly that philosophy is expressed.',

      ...philosophy
    },


    /*
     * Section 4
     *
     * Structural metadata.
     */
    structure: {
      heading:
        'How this philosophy becomes a portfolio',

      description:
        'The system expresses its philosophy through portfolio parts with different responsibilities.',

      ...structure
    },


    /*
     * Section 5
     *
     * Sleeve philosophy, system contribution, and only
     * evidence-backed personalization.
     */
    sleeves: {
      heading:
        'Why these portfolio parts exist',

      description:
        'Each part exists because of the portfolio philosophy. Where your quiz provides direct evidence, we also show why that role is particularly relevant to you.',

      items:
        sleeves
    },


    /*
     * Section 6
     *
     * Bring the system back to the investor JTBD.
     */
    systemFit: {
      heading:
        'How the whole system supports you',

      description:
        'The portfolio parts work together to support the three jobs identified from your profile.',

      items: [
        jobs.stage,
        jobs.style,
        jobs.behavior
      ].filter(Boolean)
    },


    /*
     * Development diagnostics.
     *
     * UI does not need to display this.
     */
    diagnostics: {
      recommendation:
        fitResult
          .recommendation ??
        null,

      coverage:
        fitResult
          .coverage ??
        null
    }
  };
}

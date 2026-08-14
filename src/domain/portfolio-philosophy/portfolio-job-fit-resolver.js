import {
  INVESTOR_JOB_CATALOG,
  JOB_SOURCE_MAP
} from '../investor-jobs.js';

import {
  composePortfolioSystem
} from './portfolio-composer.js';

import {
  resolvePortfolioPhilosophy
} from '../portfolio-philosophy/philosophy-resolver.js';

import {
  resolveEvidenceTags
} from '../portfolio-philosophy/evidence-tag-resolver.js';

import {
  SYSTEM_ROLES
} from '../portfolio-philosophy/philosophy-constants.js';


/*
 * ============================================================
 * IMPORTANT ARCHITECTURE RULE
 * ============================================================
 *
 * This resolver EXPLAINS an already-resolved recommendation.
 *
 * It MUST NOT:
 *
 * - rescore the quiz
 * - resolve Stage
 * - resolve Style
 * - resolve Behavior
 * - resolve Archetype
 * - resolve Variant
 * - alter constituent sleeves
 * - alter portfolio weights
 *
 * Existing assessment + portfolio construction remain
 * authoritative.
 */


/*
 * ------------------------------------------------------------
 * Portfolio requirements implied by the existing JTBD
 * ------------------------------------------------------------
 *
 * These do NOT replace the canonical investor-job copy.
 *
 * The canonical job remains in:
 *
 *   INVESTOR_JOB_CATALOG
 *
 * These statements translate that existing job into the type
 * of portfolio-system property that helps support it.
 */

const STAGE_REQUIREMENTS = Object.freeze({
  foundation_builder: {
    requirement:
      'Organize the portfolio around a small number of clearly differentiated roles.',

    fitType:
      'structure'
  },

  portfolio_organizer: {
    requirement:
      'Make the purpose of each portfolio role explicit so the parts work as one coherent system.',

    fitType:
      'structure'
  },

  system_builder: {
    requirement:
      'Give the portfolio explicit roles, review rules, and repeatable operating boundaries.',

    fitType:
      'structure'
  },

  intentional_optimizer: {
    requirement:
      'Protect the portfolio foundation while making improvement roles explicit and bounded.',

    fitType:
      'structure'
  },

  adaptive_investor: {
    requirement:
      'Keep a stable foundation while separating the parts of the portfolio that are allowed to adapt or explore.',

    fitType:
      'structure'
  }
});


const STYLE_REQUIREMENTS = Object.freeze({
  guided_autopilot: {
    requirement:
      'Keep most of the portfolio in low-effort roles that do not require frequent decisions.',

    fitType:
      'engagement'
  },

  steady_steward: {
    requirement:
      'Support periodic review while keeping routine portfolio changes limited.',

    fitType:
      'engagement'
  },

  systematic_improver: {
    requirement:
      'Make review criteria and portfolio roles explicit enough to support structured comparison.',

    fitType:
      'engagement'
  },

  bounded_explorer: {
    requirement:
      'Clearly separate the stable portfolio foundation from the smaller areas that deserve additional research or attention.',

    fitType:
      'engagement'
  },

  active_navigator: {
    requirement:
      'Identify which portfolio roles legitimately deserve higher-frequency monitoring while protecting the strategic foundation.',

    fitType:
      'engagement'
  }
});


const BEHAVIOR_REQUIREMENTS = Object.freeze({
  validation_seeker: {
    requirement:
      'Make the purpose and rationale for each portfolio role visible before asking the investor to consider a change.',

    fitType:
      'decision'
  },

  instruction_seeker: {
    requirement:
      'Give each portfolio role enough purpose, cadence, and monitoring context to distinguish leave-alone, review, and action states.',

    fitType:
      'decision'
  },

  confidence_builder: {
    requirement:
      'Anchor decisions to portfolio roles and predefined review conditions rather than ordinary market movement.',

    fitType:
      'decision'
  },

  opportunity_chaser: {
    requirement:
      'Keep opportunity-oriented roles explicitly bounded and separate from the portfolio foundation.',

    fitType:
      'decision'
  },

  optimization_mindset: {
    requirement:
      'Make improvement roles explicit so additional complexity must justify a defined portfolio purpose.',

    fitType:
      'decision'
  }
});


/*
 * Roles that usually represent the durable strategic portion
 * of a system.
 */

const FOUNDATION_ROLES = new Set([
  SYSTEM_ROLES.FOUNDATION,
  SYSTEM_ROLES.REQUIRED_SUPPORT,
  SYSTEM_ROLES.STABILITY_RESILIENCE,
  SYSTEM_ROLES.LIQUIDITY_ACCESS,
  SYSTEM_ROLES.INCOME,
  SYSTEM_ROLES.INFLATION_PROTECTION
]);


/*
 * Roles that imply greater research, adaptation,
 * optimization, or conditional involvement.
 */

const HIGHER_ENGAGEMENT_ROLES = new Set([
  SYSTEM_ROLES.BOUNDED_IMPROVEMENT,
  SYSTEM_ROLES.GROWTH_ENHANCER,
  SYSTEM_ROLES.EXPLORATION_RESEARCH,
  SYSTEM_ROLES.TACTICAL_CONDITIONAL
]);


/*
 * ------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------
 */

function getCanonicalJob(
  dimension,
  profileId
) {
  const jobId =
    JOB_SOURCE_MAP?.[dimension]?.[profileId];

  if (!jobId) {
    return null;
  }

  return (
    INVESTOR_JOB_CATALOG?.[jobId] ??
    null
  );
}


function round(value) {
  return (
    Math.round(
      value * 10000
    ) / 10000
  );
}


function buildRoleMix(
  sleeves
) {
  return sleeves.reduce(
    (result, sleeve) => {
      const role =
        sleeve.systemRole;

      if (!role) {
        return result;
      }

      result[role] =
        (
          result[role] ??
          0
        ) + 1;

      return result;
    },
    {}
  );
}


function buildRoleWeightMix(
  sleeves
) {
  return sleeves.reduce(
    (result, sleeve) => {
      const role =
        sleeve.systemRole;

      if (!role) {
        return result;
      }

      result[role] =
        round(
          (
            result[role] ??
            0
          ) +
          (
            sleeve.weight ??
            0
          )
        );

      return result;
    },
    {}
  );
}


function calculateEffortMix(
  sleeves
) {
  const result = {
    veryLow: 0,
    low: 0,
    moderate: 0,
    high: 0
  };

  for (const sleeve of sleeves) {
    const weight =
      sleeve.weight ??
      0;

    const key =
      sleeve.effort ===
      'very-low'
        ? 'veryLow'
        : sleeve.effort;

    if (
      key &&
      Object.hasOwn(
        result,
        key
      )
    ) {
      result[key] =
        round(
          result[key] +
          weight
        );
    }
  }

  return result;
}


function calculateLowEffortWeight(
  sleeves
) {
  return round(
    sleeves.reduce(
      (total, sleeve) => {
        if (
          sleeve.effort ===
            'very-low' ||
          sleeve.effort ===
            'low'
        ) {
          return (
            total +
            (
              sleeve.weight ??
              0
            )
          );
        }

        return total;
      },
      0
    )
  );
}


function collectEvidenceForTags(
  evidenceResult,
  tags
) {
  const evidence = [];

  for (const tag of tags) {
    const entries =
      evidenceResult
        ?.evidenceByTag
        ?.[tag] ??
      [];

    for (const entry of entries) {
      const duplicate =
        evidence.some(
          (existing) =>
            existing.questionId ===
              entry.questionId &&
            existing.optionId ===
              entry.optionId
        );

      if (!duplicate) {
        evidence.push(
          entry
        );
      }
    }
  }

  return evidence;
}


function resolveSleevePersonalization(
  philosophy,
  evidenceResult
) {
  const personalization =
    philosophy
      ?.personalization;

  if (!personalization) {
    return {
      status:
        'system-design-only',

      evidenceTags: [],

      evidence: []
    };
  }

  const allowedTags =
    personalization
      .allowedEvidenceTags ??
    [];

  const matchedTags =
    allowedTags.filter(
      (tag) =>
        evidenceResult
          ?.tags
          ?.includes(tag)
    );

  const evidence =
    collectEvidenceForTags(
      evidenceResult,
      matchedTags
    );

  if (
    matchedTags.length >
      0 &&
    evidence.length >
      0
  ) {
    return {
      status:
        'direct-evidence',

      evidenceTags:
        matchedTags,

      evidence
    };
  }

  return {
    status:
      'system-design-only',

    evidenceTags: [],

    evidence: [],

    noEvidenceCopy:
      personalization
        .noEvidenceCopy ??
      null
  };
}


/*
 * ------------------------------------------------------------
 * Convert philosophy resolver output into sleeve records
 * ------------------------------------------------------------
 */

function resolveSleeves(
  philosophyResult,
  evidenceResult
) {
  return (
    philosophyResult
      ?.sleeves ??
    []
  ).map(
    (entry) => {
      const sleeve =
        entry.sleeve ??
        {};

      const philosophy =
        entry.philosophy ??
        null;

      return {
        id:
          sleeve.id ??
          null,

        label:
          sleeve.label ??
          sleeve.id ??
          null,

        weight:
          sleeve.weight ??
          0,

        systemRole:
          philosophy
            ?.systemRole ??
          null,

        whyItExists:
          philosophy
            ?.philosophy
            ?.whyItExists ??
          null,

        contributionToSystem:
          philosophy
            ?.philosophy
            ?.contributionToSystem ??
          null,

        governingPrinciples:
          philosophy
            ?.philosophy
            ?.governingPrinciples ??
          [],

        sources:
          entry.sources ??
          [],

        returnFunction:
          sleeve.returnFunction ??
          null,

        effort:
          sleeve.effort ??
          null,

        reviewCadence:
          sleeve.reviewCadence ??
          null,

        marketTrendTags:
          sleeve.marketTrendTags ??
          [],

        marketTrends:
          sleeve.marketTrends ??
          [],

        assetCategories:
          sleeve.assetCategories ??
          [],

        startsUnallocated:
          sleeve.startsUnallocated ===
          true,

        description:
          sleeve.description ??
          null,

        monitoringGuidance:
          sleeve.monitoringGuidance ??
          null,

        personalization:
          resolveSleevePersonalization(
            philosophy,
            evidenceResult
          )
      };
    }
  );
}


/*
 * ------------------------------------------------------------
 * Determine which sleeves best demonstrate each investor job
 * ------------------------------------------------------------
 *
 * This does NOT imply that these jobs caused those sleeves
 * to exist.
 *
 * It only identifies which existing parts of the recommended
 * architecture help demonstrate the fit.
 */

function selectStageSleeves(
  stageId,
  sleeves
) {
  switch (stageId) {
    case 'foundation_builder':
    case 'portfolio_organizer':
    case 'system_builder':
      return sleeves;

    case 'intentional_optimizer': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            sleeve.systemRole ===
              SYSTEM_ROLES.FOUNDATION ||
            sleeve.systemRole ===
              SYSTEM_ROLES.BOUNDED_IMPROVEMENT ||
            sleeve.systemRole ===
              SYSTEM_ROLES.GROWTH_ENHANCER ||
            sleeve.systemRole ===
              SYSTEM_ROLES.DIVERSIFIER
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    case 'adaptive_investor': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            sleeve.systemRole ===
              SYSTEM_ROLES.FOUNDATION ||
            HIGHER_ENGAGEMENT_ROLES.has(
              sleeve.systemRole
            )
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    default:
      return sleeves;
  }
}


function selectStyleSleeves(
  styleId,
  sleeves
) {
  switch (styleId) {
    case 'guided_autopilot': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            sleeve.effort ===
              'very-low' ||
            sleeve.effort ===
              'low'
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    case 'steady_steward': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            sleeve.effort !==
              'high'
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    case 'systematic_improver':
      return sleeves;

    case 'bounded_explorer': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            sleeve.systemRole ===
              SYSTEM_ROLES.FOUNDATION ||
            HIGHER_ENGAGEMENT_ROLES.has(
              sleeve.systemRole
            )
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    case 'active_navigator': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            HIGHER_ENGAGEMENT_ROLES.has(
              sleeve.systemRole
            ) ||
            sleeve.effort ===
              'high'
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    default:
      return sleeves;
  }
}


function selectBehaviorSleeves(
  modifierId,
  sleeves
) {
  switch (modifierId) {
    case 'validation_seeker':
    case 'instruction_seeker':
      return sleeves;

    case 'confidence_builder': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            FOUNDATION_ROLES.has(
              sleeve.systemRole
            )
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    case 'opportunity_chaser': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            sleeve.systemRole ===
              SYSTEM_ROLES.FOUNDATION ||
            sleeve.systemRole ===
              SYSTEM_ROLES.EXPLORATION_RESEARCH ||
            sleeve.systemRole ===
              SYSTEM_ROLES.TACTICAL_CONDITIONAL
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    case 'optimization_mindset': {
      const selected =
        sleeves.filter(
          (sleeve) =>
            sleeve.systemRole ===
              SYSTEM_ROLES.FOUNDATION ||
            sleeve.systemRole ===
              SYSTEM_ROLES.BOUNDED_IMPROVEMENT ||
            sleeve.systemRole ===
              SYSTEM_ROLES.GROWTH_ENHANCER ||
            sleeve.systemRole ===
              SYSTEM_ROLES.DIVERSIFIER
        );

      return (
        selected.length >
        0
          ? selected
          : sleeves
      );
    }

    default:
      return sleeves;
  }
}


/*
 * ------------------------------------------------------------
 * Build system-fit explanations from the actual architecture
 * ------------------------------------------------------------
 */

function buildStageSystemFit(
  stageId,
  sleeves
) {
  const sleeveCount =
    sleeves.length;

  const roleCount =
    new Set(
      sleeves
        .map(
          (sleeve) =>
            sleeve.systemRole
        )
        .filter(Boolean)
    ).size;

  switch (stageId) {
    case 'foundation_builder':
      return (
        'The recommended system organizes the portfolio into ' +
        sleeveCount +
        ' explicit sleeves across ' +
        roleCount +
        ' portfolio roles, giving each part a defined job instead of treating the portfolio as a collection of unrelated choices.'
      );

    case 'portfolio_organizer':
      return (
        'The portfolio separates its components into explicit system roles, making it easier to see how the ' +
        sleeveCount +
        ' sleeves work together rather than evaluating each holding independently.'
      );

    case 'system_builder':
      return (
        'Each sleeve has a defined role, effort level, review cadence, and monitoring scope, creating repeatable rules for how the portfolio should be operated.'
      );

    case 'intentional_optimizer':
      return (
        'The system keeps its strategic foundation visible while separating the sleeves responsible for diversification or improvement, so changes can be evaluated without redesigning the whole portfolio.'
      );

    case 'adaptive_investor':
      return (
        'The architecture separates the strategic foundation from the roles allowed to adapt, explore, or respond to changing conditions, creating boundaries around portfolio evolution.'
      );

    default:
      return null;
  }
}


function buildStyleSystemFit(
  styleId,
  sleeves
) {
  const lowEffortWeight =
    calculateLowEffortWeight(
      sleeves
    );

  const lowEffortPercent =
    Math.round(
      lowEffortWeight *
      100
    );

  switch (styleId) {
    case 'guided_autopilot':
      return (
        lowEffortPercent +
        '% of the portfolio is currently assigned to low or very-low-effort sleeves, helping keep routine portfolio management limited.'
      );

    case 'steady_steward':
      return (
        'The portfolio assigns explicit review cadences to its sleeves so attention can be concentrated into periodic checks rather than continuous reaction.'
      );

    case 'systematic_improver':
      return (
        'The system makes portfolio roles, effort levels, monitoring signals, and review cadences explicit so comparisons can follow a repeatable framework.'
      );

    case 'bounded_explorer':
      return (
        'The portfolio distinguishes its strategic foundation from higher-attention or exploratory roles, making it clear where additional research belongs and where it does not.'
      );

    case 'active_navigator':
      return (
        'Higher-effort and conditional sleeves are separately identifiable, allowing active attention to be directed toward the parts of the portfolio designed to receive it.'
      );

    default:
      return null;
  }
}


function buildBehaviorSystemFit(
  modifierId
) {
  switch (modifierId) {
    case 'validation_seeker':
      return (
        'Every sleeve can be explained through its portfolio role, reason for existing, and contribution to the system, providing a rationale before a change is considered.'
      );

    case 'instruction_seeker':
      return (
        'Each sleeve carries a defined purpose, review cadence, and monitoring scope that can be used to distinguish when the appropriate state is leave alone, review, or consider action.'
      );

    case 'confidence_builder':
      return (
        'Portfolio decisions can be anchored to whether a sleeve is still performing its intended role rather than treating ordinary market movement as an automatic reason to change the portfolio.'
      );

    case 'opportunity_chaser':
      return (
        'Opportunity-oriented roles remain structurally separate from the portfolio foundation, allowing new ideas to be evaluated inside explicit portfolio boundaries.'
      );

    case 'optimization_mindset':
      return (
        'Improvement and diversification roles are visible separately from the portfolio foundation, making it possible to ask whether additional complexity actually serves a defined system purpose.'
      );

    default:
      return null;
  }
}


function buildJobResult({
  dimension,
  profileId,
  requirementDefinition,
  selectedSleeves,
  systemFit
}) {
  const job =
    getCanonicalJob(
      dimension,
      profileId
    );

  return {
    profileId,

    jobId:
      job?.id ??
      null,

    title:
      job?.title ??
      null,

    description:
      job?.description ??
      null,

    existingPortfolioDesignImplication:
      job
        ?.portfolioDesignImplication ??
      null,

    portfolioRequirement:
      requirementDefinition
        ?.requirement ??
      null,

    fitType:
      requirementDefinition
        ?.fitType ??
      null,

    systemFit,

    supportingSleeveIds:
      selectedSleeves.map(
        (sleeve) =>
          sleeve.id
      )
  };
}


/*
 * ============================================================
 * PUBLIC API
 * ============================================================
 */

export function resolvePortfolioJobFit(
  assessmentResult,
  options = {}
) {
  if (
    !assessmentResult ||
    typeof assessmentResult !==
      'object'
  ) {
    throw new Error(
      'resolvePortfolioJobFit requires an assessment result.'
    );
  }

  if (
    !assessmentResult.archetypeId
  ) {
    throw new Error(
      'resolvePortfolioJobFit requires assessmentResult.archetypeId.'
    );
  }


  /*
   * Use the existing portfolio composer.
   *
   * Caller may optionally supply an already-composed portfolio
   * to avoid doing the same read-only composition twice.
   */

  const portfolioSystem =
    options.portfolioSystem ??
    composePortfolioSystem(
      assessmentResult
    );


  const archetypeId =
    assessmentResult
      .archetypeId;

  const variantId =
    portfolioSystem
      .profileVariantId;


  /*
   * Resolve approved portfolio philosophy.
   */

  const philosophyResult =
    resolvePortfolioPhilosophy({
      archetypeId,

      variantId,

      sleeves:
        portfolioSystem
          .sleeves
    });


  /*
   * Resolve only evidence explicitly supported by quiz answers.
   */

  const evidenceResult =
    resolveEvidenceTags(
      assessmentResult
    );


  /*
   * Merge existing constituent data with philosophy metadata.
   */

  const sleeves =
    resolveSleeves(
      philosophyResult,
      evidenceResult
    );


  /*
   * Portfolio structure metadata.
   */

  const roleMix =
    buildRoleMix(
      sleeves
    );

  const roleWeightMix =
    buildRoleWeightMix(
      sleeves
    );

  const effortMix =
    calculateEffortMix(
      sleeves
    );

  const optionalSleeves =
    sleeves.filter(
      (sleeve) =>
        sleeve.startsUnallocated ===
        true
    );

  const requiredSleeves =
    sleeves.filter(
      (sleeve) =>
        sleeve.startsUnallocated !==
        true
    );


  /*
   * Existing Stage / Style / Behavior diagnoses.
   */

  const stageId =
    assessmentResult.stageId;

  const styleId =
    assessmentResult.styleId;

  const modifierId =
    assessmentResult.modifierId;


  const stageSupportingSleeves =
    selectStageSleeves(
      stageId,
      sleeves
    );

  const styleSupportingSleeves =
    selectStyleSleeves(
      styleId,
      sleeves
    );

  const behaviorSupportingSleeves =
    selectBehaviorSleeves(
      modifierId,
      sleeves
    );


  const jobs = {
    stage:
      buildJobResult({
        dimension:
          'stage',

        profileId:
          stageId,

        requirementDefinition:
          STAGE_REQUIREMENTS[
            stageId
          ],

        selectedSleeves:
          stageSupportingSleeves,

        systemFit:
          buildStageSystemFit(
            stageId,
            sleeves
          )
      }),

    style:
      buildJobResult({
        dimension:
          'style',

        profileId:
          styleId,

        requirementDefinition:
          STYLE_REQUIREMENTS[
            styleId
          ],

        selectedSleeves:
          styleSupportingSleeves,

        systemFit:
          buildStyleSystemFit(
            styleId,
            sleeves
          )
      }),

    behavior:
      buildJobResult({
        dimension:
          'modifier',

        profileId:
          modifierId,

        requirementDefinition:
          BEHAVIOR_REQUIREMENTS[
            modifierId
          ],

        selectedSleeves:
          behaviorSupportingSleeves,

        systemFit:
          buildBehaviorSystemFit(
            modifierId
          )
      })
  };


  return {
    recommendation: {
      archetypeId,

      variantId,

      systemId:
        portfolioSystem
          ?.system
          ?.id ??
        archetypeId,

      systemName:
        portfolioSystem
          ?.system
          ?.systemName ??
        portfolioSystem
          ?.system
          ?.name ??
        null
    },


    /*
     * External portfolio philosophy + AaronBux interpretation.
     */

    philosophy: {
      archetype:
        philosophyResult
          ?.archetype ??
        null,

      archetypeSources:
        philosophyResult
          ?.archetypeSources ??
        [],

      variant:
        philosophyResult
          ?.variant ??
        null,

      existingSystemPhilosophy:
        portfolioSystem
          ?.system
          ?.philosophy ??
        null,

      existingSystemInvariant:
        portfolioSystem
          ?.system
          ?.invariant ??
        null
    },


    /*
     * Metadata describing how this portfolio is organized.
     */

    structure: {
      sleeveCount:
        sleeves.length,

      requiredSleeveCount:
        requiredSleeves.length,

      optionalSleeveCount:
        optionalSleeves.length,

      roleMix,

      roleWeightMix,

      effortMix,

      lowEffortWeight:
        calculateLowEffortWeight(
          sleeves
        )
    },


    /*
     * Existing canonical investor jobs + new portfolio-fit bridge.
     */

    jobs,


    /*
     * Why each sleeve exists independently of personalization,
     * plus direct user evidence where actually available.
     */

    sleeves,


    /*
     * Traceable user evidence.
     */

    evidence: evidenceResult,


    /*
     * Corpus-coverage diagnostics.
     *
     * Useful during development and testing.
     */

    coverage:
      philosophyResult
        ?.coverage ??
      null
  };
}

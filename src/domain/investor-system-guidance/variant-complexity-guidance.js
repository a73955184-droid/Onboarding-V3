/*
 * Investor System Guidance
 * Variant Complexity Guidance
 *
 * PURPOSE
 * -------
 * Explain why a resolved archetype + variant exposes a certain
 * number of portfolio sleeves / decision roles.
 *
 * IMPORTANT
 * ---------
 * This file does NOT:
 *
 * - resolve archetype
 * - resolve variant
 * - change sleeve count
 * - change sleeve weights
 * - change portfolio construction
 * - infer investor preferences
 *
 * It only translates the already-resolved structure into
 * user-facing reasoning.
 */


const DEFAULT_VARIANT_MEANINGS = Object.freeze({
  essential: Object.freeze({
    variantId: 'essential',

    userQuestion:
      'Why keep this portfolio relatively simple?',

    generalMeaning:
      'Use the smallest number of broad portfolio roles needed to express the philosophy clearly.',

    complexityGoal:
      'Minimize unnecessary decision points.',

    complexityBoundary:
      'Additional separation should be avoided unless it creates a genuinely different portfolio job that is worth monitoring independently.',

    userFacingSummary:
      'This version keeps related responsibilities together so the portfolio remains easy to understand and maintain.'
  }),

  intentional: Object.freeze({
    variantId: 'intentional',

    userQuestion:
      'Why separate more portfolio roles instead of keeping everything broad?',

    generalMeaning:
      'Separate portfolio responsibilities when doing so creates clearer control, monitoring, or decision quality.',

    complexityGoal:
      'Expose independently useful decisions without turning the portfolio into a collection of small moving parts.',

    complexityBoundary:
      'More separation is only useful when the additional sleeve has a distinct job, return contribution, monitoring need, or decision rule.',

    userFacingSummary:
      'This version separates the decisions that are useful to manage independently while keeping the overall system bounded.'
  }),

  engaged: Object.freeze({
    variantId: 'engaged',

    userQuestion:
      'Why does this portfolio expose more specialized roles?',

    generalMeaning:
      'Preserve a strategic foundation while giving higher-attention, research, or conditional decisions their own bounded places.',

    complexityGoal:
      'Concentrate higher-effort decisions where they can matter without making the entire portfolio active.',

    complexityBoundary:
      'Greater granularity is justified only when the specialized role has a distinct mandate and an appropriate effort and monitoring budget.',

    userFacingSummary:
      'This version keeps the core intact while creating defined places for more specialized decisions.'
  })
});


/*
 * Archetype-specific interpretation of what "more granularity"
 * actually means.
 *
 * This is important because 5 sleeves in ES should not be
 * explained the same way as 5 or 6 sleeves in FT, TO, or IP.
 */

export const VARIANT_COMPLEXITY_GUIDANCE = Object.freeze({

  ES: Object.freeze({
    archetypeId: 'ES',

    philosophyQuestion:
      'How much structure is useful without making a simple long-term system harder to maintain?',

    essential: Object.freeze({
      variantId: 'essential',

      whyThisVersion:
        'The ES philosophy works when broad long-term roles remain dominant and easy to maintain. The Essential version therefore combines related exposures into a small number of broad responsibilities.',

      whatSeparationProvides:
        'The portfolio distinguishes growth, stability, and liquidity without asking the user to manage regional or preference decisions separately.',

      whyNotSimpler:
        'Removing another role would force one sleeve to perform more than one fundamentally different portfolio job.',

      whyNotMoreComplex:
        'Additional separation would create more review points without materially improving the core ES objective of simplicity and low intervention.',

      userFacingSummary:
        'Three broad roles are enough to keep growth, stability, and access distinct without adding unnecessary decisions.'
    }),

    intentional: Object.freeze({
      variantId: 'intentional',

      whyThisVersion:
        'The Intentional version preserves the ES commitment to simplicity while making important parts of the growth foundation separately visible.',

      whatSeparationProvides:
        'Separating US and international exposure gives the user clearer visibility into geographic diversification while keeping stability and liquidity as broad support roles.',

      whyNotSimpler:
        'A more compressed structure would hide a geographic decision that is useful to understand and review independently.',

      whyNotMoreComplex:
        'Further separation would add monitoring burden without changing the essential role of the portfolio as a simple long-term system.',

      userFacingSummary:
        'This version adds only the separation that makes the portfolio easier to understand, not more active.'
    }),

    engaged: Object.freeze({
      variantId: 'engaged',

      whyThisVersion:
        'The Engaged version keeps the broad ES foundation intact but creates one bounded place for personal preference or additional involvement.',

      whatSeparationProvides:
        'The user can express a limited preference without forcing that idea into the strategic growth, stability, or liquidity roles.',

      whyNotSimpler:
        'A simpler version would leave no explicit place for the additional involvement the system is designed to accommodate.',

      whyNotMoreComplex:
        'More specialized sleeves would undermine the ES philosophy by turning a simple long-term system into a higher-maintenance portfolio.',

      userFacingSummary:
        'The core remains simple, while a small bounded area absorbs the extra decisions the user wants to make.'
    })
  }),


  GD: Object.freeze({
    archetypeId: 'GD',

    philosophyQuestion:
      'How much diversification needs to be visible as separate portfolio decisions?',

    essential: Object.freeze({
      variantId: 'essential',

      whyThisVersion:
        'The Essential GD system expresses global diversification through broad combined exposures rather than separate regional decisions.',

      whatSeparationProvides:
        'Global equity, global stability, and liquidity provide distinct diversification, resilience, and access roles without requiring the user to manage geography directly.',

      whyNotSimpler:
        'Combining these further would blur fundamentally different growth, resilience, and access functions.',

      whyNotMoreComplex:
        'Additional regional or economic separation is unnecessary when the user does not need to manage those diversification dimensions independently.',

      userFacingSummary:
        'The system keeps diversification broad so the user receives global exposure without carrying unnecessary regional decision burden.'
    }),

    intentional: Object.freeze({
      variantId: 'intentional',

      whyThisVersion:
        'The Intentional GD system makes several important diversification dimensions separately visible.',

      whatSeparationProvides:
        'US, developed international, emerging markets, stability, inflation resilience, and liquidity can be reviewed as different economic roles rather than one aggregated portfolio.',

      whyNotSimpler:
        'A more compressed system would hide regional and inflation-sensitive exposures that are useful to understand independently.',

      whyNotMoreComplex:
        'Further segmentation would add portfolio management work without introducing another major diversification dimension justified by this version.',

      userFacingSummary:
        'This version separates the diversification decisions that meaningfully change how the portfolio is exposed to different regions and economic risks.'
    }),

    engaged: Object.freeze({
      variantId: 'engaged',

      whyThisVersion:
        'The Engaged GD system expands diversification beyond geography into company size and real-economy exposures.',

      whatSeparationProvides:
        'The user can independently understand regional exposure, small-cap diversification, stability, real assets, and liquidity.',

      whyNotSimpler:
        'Combining these roles would make several different sources of diversification indistinguishable.',

      whyNotMoreComplex:
        'Additional sleeves should only be added if they introduce another genuinely different return or risk source rather than simply subdividing existing exposures.',

      userFacingSummary:
        'The extra sleeves exist because this version manages several distinct sources of diversification independently.'
    })
  }),


  FT: Object.freeze({
    archetypeId: 'FT',

    philosophyQuestion:
      'How many separate improvement decisions are useful before optimization becomes unnecessary complexity?',

    essential: Object.freeze({
      variantId: 'essential',

      whyThisVersion:
        'The Essential FT system keeps the durable core dominant and allows only one explicitly bounded improvement role.',

      whatSeparationProvides:
        'The user can distinguish the strategic foundation, resilience, and one targeted improvement without managing several optimization decisions at once.',

      whyNotSimpler:
        'Removing the improvement sleeve would eliminate the defining FT capability: controlled portfolio improvement.',

      whyNotMoreComplex:
        'Multiple improvement sleeves would introduce additional research and monitoring before the system has justified the need for that granularity.',

      userFacingSummary:
        'One improvement role is enough to make optimization possible without allowing optimization to take over the portfolio.'
    }),

    intentional: Object.freeze({
      variantId: 'intentional',

      whyThisVersion:
        'The Intentional FT system separates several improvement decisions because they target different portfolio properties.',

      whatSeparationProvides:
        'The durable core, global diversification, stability, quality improvement, small-value improvement, and liquidity roles can each be evaluated independently.',

      whyNotSimpler:
        'Combining the improvement roles would make it harder to tell which change is intended to improve which portfolio property.',

      whyNotMoreComplex:
        'Additional factor or strategy sleeves would add research burden unless they improve another clearly defined property of the system.',

      userFacingSummary:
        'The portfolio exposes the improvement decisions that are useful to compare separately, while keeping them subordinate to the durable core.'
    }),

    engaged: Object.freeze({
      variantId: 'engaged',

      whyThisVersion:
        'The Engaged FT system supports several systematic improvements plus a small research capacity while preserving a dominant durable core.',

      whatSeparationProvides:
        'Systematic improvements, strategic diversification, and research can be monitored as different kinds of portfolio work.',

      whyNotSimpler:
        'A simpler structure would force research, diversification, and systematic improvement into the same decision bucket.',

      whyNotMoreComplex:
        'Further optimization should only be introduced when it has a distinct objective and earns the additional monitoring and implementation effort.',

      userFacingSummary:
        'The added complexity is bounded to the places where research or systematic improvement has a distinct job.'
    })
  }),


  BFO: Object.freeze({
    archetypeId: 'BFO',

    philosophyQuestion:
      'How many different financial jobs should the portfolio manage separately?',

    essential: Object.freeze({
      variantId: 'essential',

      whyThisVersion:
        'The Essential BFO system separates the three broadest portfolio jobs: growth, stability, and liquidity.',

      whatSeparationProvides:
        'The user can see which capital is intended to grow, which supports resilience, and which remains accessible.',

      whyNotSimpler:
        'Combining these roles would mix fundamentally different financial purposes.',

      whyNotMoreComplex:
        'Income, alternatives, and opportunities do not need separate sleeves unless the user system benefits from managing those purposes independently.',

      userFacingSummary:
        'The portfolio separates the major jobs money can perform without introducing specialized roles before they are useful.'
    }),

    intentional: Object.freeze({
      variantId: 'intentional',

      whyThisVersion:
        'The Intentional BFO system separates more household and wealth-management jobs because they are useful to manage independently.',

      whatSeparationProvides:
        'Growth, income, stability, diversification, liquidity, and selected opportunities each have their own purpose and review logic.',

      whyNotSimpler:
        'Combining these roles would make it harder to understand whether a decision is serving income, growth, resilience, access, or opportunity.',

      whyNotMoreComplex:
        'Further subdivision would add more monitoring without creating another major portfolio job.',

      userFacingSummary:
        'This version uses more sleeves because the portfolio is solving more than one financial job at the same time.'
    }),

    engaged: Object.freeze({
      variantId: 'engaged',

      whyThisVersion:
        'The Engaged BFO system supports a broader set of wealth-management roles, including real assets, strategic alternatives, and bounded opportunities.',

      whatSeparationProvides:
        'The user can manage growth, income, stability, real assets, alternatives, liquidity, and selected opportunities as different portfolio responsibilities.',

      whyNotSimpler:
        'A more compressed system would combine exposures that have materially different portfolio purposes and monitoring needs.',

      whyNotMoreComplex:
        'Additional sleeves should only be introduced if they represent another genuine financial job rather than simply creating more categories.',

      userFacingSummary:
        'The larger sleeve count reflects a portfolio designed to perform several different jobs, not a desire for complexity by itself.'
    })
  }),


  GA: Object.freeze({
    archetypeId: 'GA',

    philosophyQuestion:
      'How many separate growth and diversification sources are useful before the portfolio becomes too difficult to operate?',

    essential: Object.freeze({
      variantId: 'essential',

      whyThisVersion:
        'The Essential GA system keeps broad growth dominant and introduces only one bounded alternatives role alongside stability and liquidity.',

      whatSeparationProvides:
        'The user can distinguish conventional growth from alternatives without managing several specialized growth themes.',

      whyNotSimpler:
        'Removing the alternatives role would eliminate the defining GA distinction from a conventional growth portfolio.',

      whyNotMoreComplex:
        'More specialized alternatives and growth sleeves would require additional research that this version does not need.',

      userFacingSummary:
        'The system introduces alternative return sources without turning the portfolio into a collection of specialized strategies.'
    }),

    intentional: Object.freeze({
      variantId: 'intentional',

      whyThisVersion:
        'The Intentional GA system separates different sources of growth enhancement and diversification so they can be evaluated independently.',

      whatSeparationProvides:
        'Broad growth, growth enhancers, real assets, alternative strategy, stability, and liquidity each have a distinct role.',

      whyNotSimpler:
        'Combining these roles would make it difficult to distinguish additional growth exposure from true diversification.',

      whyNotMoreComplex:
        'Further segmentation would add specialized monitoring unless another return source performs a genuinely different portfolio job.',

      userFacingSummary:
        'This version separates growth enhancement from diversification so the user can see what each additional source is supposed to contribute.'
    }),

    engaged: Object.freeze({
      variantId: 'engaged',

      whyThisVersion:
        'The Engaged GA system supports multiple specialized growth sources, alternatives, real assets, stability, and a bounded opportunity capacity.',

      whatSeparationProvides:
        'The user can direct research effort toward specialized sleeves without requiring the broad growth foundation to become actively managed.',

      whyNotSimpler:
        'A simpler structure would combine distinct growth theses and alternative return sources into sleeves that are too broad to monitor meaningfully.',

      whyNotMoreComplex:
        'Additional specialized exposures would be redundant unless they introduce another clearly different return or risk contribution.',

      userFacingSummary:
        'The added sleeves create distinct homes for specialized growth and alternative ideas while preserving a broad foundation.'
    })
  }),


  TO: Object.freeze({
    archetypeId: 'TO',

    philosophyQuestion:
      'How much active decision-making should be separated from the permanent portfolio?',

    essential: Object.freeze({
      variantId: 'essential',

      whyThisVersion:
        'The Essential TO system creates only one bounded opportunity role alongside a permanent core and stability reserve.',

      whatSeparationProvides:
        'The user can pursue opportunities without allowing short-term ideas to redefine the long-term portfolio.',

      whyNotSimpler:
        'Removing the opportunity sleeve would eliminate the defining distinction between permanent capital and opportunistic capital.',

      whyNotMoreComplex:
        'Separating tactical, thematic, and security-selection decisions is unnecessary when one bounded opportunity role is sufficient.',

      userFacingSummary:
        'The system keeps opportunity seeking contained without asking the user to manage several active decision types.'
    }),

    intentional: Object.freeze({
      variantId: 'intentional',

      whyThisVersion:
        'The Intentional TO system separates tactical allocation decisions from thesis-driven opportunity selection.',

      whatSeparationProvides:
        'The user can distinguish broad market-condition decisions from individual opportunity decisions while protecting the permanent core.',

      whyNotSimpler:
        'Combining tactical allocation and opportunity selection would make two different active decision types harder to evaluate.',

      whyNotMoreComplex:
        'Further separation is unnecessary unless thematic or security-specific research needs its own operating rules.',

      userFacingSummary:
        'This version separates the active decisions that require different kinds of research while keeping most capital outside them.'
    }),

    engaged: Object.freeze({
      variantId: 'engaged',

      whyThisVersion:
        'The Engaged TO system separates tactical allocation, thematic opportunities, and security selection into different bounded roles.',

      whatSeparationProvides:
        'Each active decision type can have its own research, monitoring, and reconsideration rules without disturbing the permanent portfolio.',

      whyNotSimpler:
        'Combining these roles would make it difficult to distinguish a market-regime decision from a thematic thesis or individual-security thesis.',

      whyNotMoreComplex:
        'Additional active sleeves should only be introduced if they represent another genuinely different decision process.',

      userFacingSummary:
        'The higher sleeve count exists because different active decisions deserve different boundaries, not because the entire portfolio should be actively managed.'
    })
  }),


  IP: Object.freeze({
    archetypeId: 'IP',

    philosophyQuestion:
      'How many income, access, preservation, and growth needs should be managed separately?',

    essential: Object.freeze({
      variantId: 'essential',

      whyThisVersion:
        'The Essential IP system separates the major needs of income, liquidity, measured growth, and inflation protection.',

      whatSeparationProvides:
        'The user can distinguish accessible capital, dependable income, long-term growth, and purchasing-power protection.',

      whyNotSimpler:
        'Combining these roles would mix needs with very different time horizons and risk characteristics.',

      whyNotMoreComplex:
        'More detailed income and fixed-income segmentation is unnecessary unless those exposures need to be managed separately.',

      userFacingSummary:
        'Four broad roles are enough to keep access, income, growth, and inflation protection distinct.'
    }),

    intentional: Object.freeze({
      variantId: 'intentional',

      whyThisVersion:
        'The Intentional IP system separates immediate liquidity, short-duration income, core fixed income, equity income, measured growth, and inflation protection.',

      whatSeparationProvides:
        'The user can manage access, duration, income source, growth, and purchasing-power protection as different portfolio jobs.',

      whyNotSimpler:
        'A more compressed system would hide important differences between immediate access, fixed-income structure, and equity-based income.',

      whyNotMoreComplex:
        'Further separation would add complexity unless credit, government bonds, or other income sources require independent management.',

      userFacingSummary:
        'The additional sleeves make time horizon and income source explicit so the user can see which part of the system is solving which need.'
    }),

    engaged: Object.freeze({
      variantId: 'engaged',

      whyThisVersion:
        'The Engaged IP system separates liquidity timing, government bonds, credit, inflation protection, dividend equity, global growth, and selected income opportunities.',

      whatSeparationProvides:
        'The user can monitor duration, credit risk, purchasing power, equity income, growth, and optional income ideas independently.',

      whyNotSimpler:
        'Combining these roles would hide materially different income and preservation risks.',

      whyNotMoreComplex:
        'Additional sleeves should only be introduced when they represent another distinct income, preservation, or growth function rather than a finer subdivision of an existing job.',

      userFacingSummary:
        'The larger structure exists because different income and preservation risks need different monitoring and decision rules.'
    })
  })
});


export function getVariantComplexityGuidance(
  archetypeId,
  variantId
) {
  if (
    !archetypeId ||
    !variantId
  ) {
    return null;
  }

  const archetypeGuidance =
    VARIANT_COMPLEXITY_GUIDANCE[
      archetypeId
    ];

  if (!archetypeGuidance) {
    return null;
  }

  const variantGuidance =
    archetypeGuidance[
      variantId
    ];

  if (!variantGuidance) {
    return null;
  }

  const defaultMeaning =
    DEFAULT_VARIANT_MEANINGS[
      variantId
    ] ?? null;

  return {
    archetypeId,

    variantId,

    philosophyQuestion:
      archetypeGuidance
        .philosophyQuestion,

    userQuestion:
      defaultMeaning
        ?.userQuestion ??
      null,

    generalMeaning:
      defaultMeaning
        ?.generalMeaning ??
      null,

    complexityGoal:
      defaultMeaning
        ?.complexityGoal ??
      null,

    complexityBoundary:
      defaultMeaning
        ?.complexityBoundary ??
      null,

    defaultSummary:
      defaultMeaning
        ?.userFacingSummary ??
      null,

    whyThisVersion:
      variantGuidance
        .whyThisVersion,

    whatSeparationProvides:
      variantGuidance
        .whatSeparationProvides,

    whyNotSimpler:
      variantGuidance
        .whyNotSimpler,

    whyNotMoreComplex:
      variantGuidance
        .whyNotMoreComplex,

    userFacingSummary:
      variantGuidance
        .userFacingSummary
  };
}

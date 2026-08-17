/*
 * Portfolio Philosophy JTBD Support
 *
 * Explains how an already-resolved portfolio philosophy, variant, and
 * sleeve structure deliver an already-resolved Portfolio Evolution job.
 * This module does not resolve or modify any portfolio output.
 */


export const ARCHETYPE_EVOLUTION_SUPPORT = Object.freeze({
  ES: Object.freeze({
    archetypeId: 'ES',
    portfolioFamily:
      'Effortless Portfolio',
    evolutionSupport:
      'Preserve a small number of broad portfolio roles so changes simplify, clarify, or fill a real gap instead of creating unnecessary moving parts.'
  }),

  GD: Object.freeze({
    archetypeId: 'GD',
    portfolioFamily:
      'Global Diversified Portfolio',
    evolutionSupport:
      'Evolve the portfolio by changing sources of diversification deliberately, so additions reduce meaningful concentration or introduce a genuinely different return or risk driver.'
  }),

  FT: Object.freeze({
    archetypeId: 'FT',
    portfolioFamily:
      'Systematic Improvement Portfolio',
    evolutionSupport:
      'Keep a durable core dominant and allow changes only when they solve a defined limitation or create an explicit, evidence-based improvement.'
  }),

  BFO: Object.freeze({
    archetypeId: 'BFO',
    portfolioFamily:
      'Balanced Multi-Purpose Portfolio',
    evolutionSupport:
      'Evolve the portfolio through clearly separated roles, so additions, removals, and improvements can be judged by the financial job they perform or change.'
  }),

  GA: Object.freeze({
    archetypeId: 'GA',
    portfolioFamily:
      'Growth & Alternatives Portfolio',
    evolutionSupport:
      'Preserve growth as the main engine while allowing bounded additions that introduce genuinely different sources of return without taking over the portfolio.'
  }),

  TO: Object.freeze({
    archetypeId: 'TO',
    portfolioFamily:
      'Opportunity Portfolio',
    evolutionSupport:
      'Separate permanent capital from conditional opportunity capital so tactical or thematic ideas can change without redefining the long-term portfolio.'
  }),

  IP: Object.freeze({
    archetypeId: 'IP',
    portfolioFamily:
      'Income Preservation Portfolio',
    evolutionSupport:
      'Evolve the portfolio around changing liquidity, income, resilience, and purchasing-power needs while protecting the roles that support dependable capital use.'
  })
});


export const VARIANT_EVOLUTION_SUPPORT = Object.freeze({
  essential: Object.freeze({
    variantId: 'essential',
    evolutionSupport:
      'Express the philosophy with the fewest useful portfolio roles, keeping changes broad, understandable, and low-maintenance.'
  }),

  intentional: Object.freeze({
    variantId: 'intentional',
    evolutionSupport:
      'Separate the important portfolio roles more clearly so improvements, overlaps, and changes can be evaluated deliberately.'
  }),

  engaged: Object.freeze({
    variantId: 'engaged',
    evolutionSupport:
      'Use more granular portfolio roles and bounded higher-attention capacity so selected changes can be researched without allowing them to take over the whole system.'
  })
});


const EVOLUTION_OPTION_IDS = Object.freeze([
  'understand',
  'monitor',
  'frequency',
  'effort',
  'experiment'
]);


const EXACT_EXPERIMENT_DELIVERY = Object.freeze({
  ES: Object.freeze({
    requiredSleeveIds: Object.freeze([
      'broadGrowthCore',
      'stability',
      'liquidity'
    ]),
    copy:
      'This system keeps most of the portfolio in a broad growth foundation and separates stability and liquidity into their own roles. That gives the portfolio a clear base to preserve before any additional idea is considered.'
  }),

  FT: Object.freeze({
    requiredSleeveIds: Object.freeze([
      'durableCore',
      'targetedImprovement'
    ]),
    copy:
      'This system keeps the durable core dominant and isolates improvement in one bounded sleeve. New ideas therefore have to serve a defined improvement purpose instead of changing the portfolio foundation directly.'
  }),

  BFO: Object.freeze({
    requiredSleeveIds: Object.freeze([
      'growth',
      'stability',
      'liquidity'
    ]),
    copy:
      'This system separates growth, stability, and liquidity into distinct jobs. A future change can therefore be evaluated against the specific portfolio role it would affect instead of being treated as a change to the whole portfolio.'
  }),

  TO: Object.freeze({
    requiredSleeveIds: Object.freeze([
      'permanentCore',
      'opportunityCapacity'
    ]),
    copy:
      'This system protects a large permanent core and gives selected opportunities their own bounded capacity. New ideas can be explored without allowing short-term views to redefine the long-term portfolio.'
  })
});


const BOUNDED_CHANGE_SLEEVE_IDS = Object.freeze([
  'targetedImprovement',
  'factorImprovements',
  'researchCapacity',
  'opportunityCapacity',
  'tacticalAllocation',
  'opportunitySelection',
  'personalPreference',
  'opportunity',
  'selectedOpportunities',
  'thematicOpportunities',
  'securitySelection',
  'selectedIncomeOpportunities'
]);


function humanList(values) {
  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return values.join(' and ');
  }

  return (
    values.slice(0, -1).join(', ') +
    ', and ' +
    values.at(-1)
  );
}


function capitalize(value) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}


function getSleeveEffort(sleeve) {
  return (
    sleeve?.effort ??
    sleeve
      ?.operatingProfile
      ?.effort ??
    null
  );
}


function describeRoles(sleeves) {
  const labels = sleeves
    .map(
      (sleeve) =>
        sleeve?.role?.label ??
        sleeve?.label ??
        null
    )
    .filter(Boolean);

  const visibleLabels =
    labels.length > 4
      ? [
          ...labels.slice(0, 3),
          `${labels.length - 3} additional roles`
        ]
      : labels;

  return humanList(visibleLabels);
}


function buildGenericDelivery({
  archetypeSupport,
  variantId,
  evolutionOptionId,
  sleeves
}) {
  const portfolioName =
    `${capitalize(variantId)} ${
      archetypeSupport.portfolioFamily
    }`;

  const roleDescription =
    describeRoles(sleeves);

  if (evolutionOptionId === 'understand') {
    return `This ${portfolioName} separates the portfolio into ${roleDescription}. That makes each part's purpose visible so overlap or missing roles can be identified before changing the portfolio.`;
  }

  if (evolutionOptionId === 'monitor') {
    return `This ${portfolioName} gives ${roleDescription} distinct purposes and review signals. Monitoring can therefore follow the role each part performs instead of treating every holding or market move equally.`;
  }

  if (evolutionOptionId === 'frequency') {
    return `This ${portfolioName} combines stable roles across ${roleDescription} with explicit review expectations. Changes can be considered when a role genuinely needs attention while ordinary movement can be left alone.`;
  }

  if (evolutionOptionId === 'effort') {
    const higherEffortSleeves =
      sleeves.filter((sleeve) =>
        [
          'moderate',
          'high'
        ].includes(
          getSleeveEffort(sleeve)
        )
      );

    if (higherEffortSleeves.length > 0) {
      return `This ${portfolioName} keeps its broader roles stable and isolates higher-effort work in ${humanList(
        higherEffortSleeves.map(
          (sleeve) => sleeve.label
        )
      )}. That makes the added research and complexity of a potential improvement visible before the portfolio changes.`;
    }

    return `This ${portfolioName} keeps ${roleDescription} broad and lower-maintenance. A proposed improvement therefore has to justify adding research or complexity to a structure designed to remain simple.`;
  }

  const boundedSleeves = sleeves.filter(
    (sleeve) =>
      BOUNDED_CHANGE_SLEEVE_IDS.includes(
        sleeve.id
      )
  );

  if (boundedSleeves.length > 0) {
    return `This ${portfolioName} protects its long-term roles while placing selected change in ${humanList(
      boundedSleeves.map(
        (sleeve) => sleeve.label
      )
    )}. New ideas can be evaluated inside those boundaries without redefining the whole portfolio.`;
  }

  return `This ${portfolioName} separates the portfolio into ${roleDescription}. New ideas have to be evaluated against those existing roles before they are allowed to change the broader system.`;
}


export function getPortfolioEvolutionDelivery({
  archetypeId,
  variantId,
  evolutionOptionId,
  portfolioSystem
} = {}) {
  const archetypeSupport =
    ARCHETYPE_EVOLUTION_SUPPORT[
      archetypeId
    ];

  const variantSupport =
    VARIANT_EVOLUTION_SUPPORT[
      variantId
    ];

  const sleeves =
    portfolioSystem?.sleeves;

  if (
    !archetypeSupport ||
    !variantSupport ||
    !EVOLUTION_OPTION_IDS.includes(
      evolutionOptionId
    ) ||
    !portfolioSystem ||
    !Array.isArray(sleeves) ||
    sleeves.length === 0 ||
    sleeves.some(
      (sleeve) =>
        !sleeve?.id ||
        !(
          sleeve?.role?.label ??
          sleeve?.label
        )
    )
  ) {
    return null;
  }

  let systemDelivery = null;

  const exactExperimentDelivery =
    variantId === 'essential' &&
    evolutionOptionId === 'experiment'
      ? EXACT_EXPERIMENT_DELIVERY[
          archetypeId
        ]
      : null;

  if (
    exactExperimentDelivery &&
    exactExperimentDelivery
      .requiredSleeveIds
      .every(
        (sleeveId) =>
          sleeves.some(
            (sleeve) =>
              sleeve.id === sleeveId
          )
      )
  ) {
    systemDelivery =
      exactExperimentDelivery.copy;
  } else {
    systemDelivery =
      buildGenericDelivery({
        archetypeSupport,
        variantId,
        evolutionOptionId,
        sleeves
      });
  }

  return {
    archetypeId,
    variantId,
    evolutionOptionId,
    portfolioFamily:
      archetypeSupport.portfolioFamily,
    philosophySupport:
      archetypeSupport.evolutionSupport,
    variantSupport:
      variantSupport.evolutionSupport,
    systemDelivery
  };
}


export const ARCHETYPE_INTERACTION_SUPPORT = Object.freeze({
  ES: Object.freeze({
    archetypeId: 'ES',
    portfolioFamily:
      'Effortless Portfolio',
    interactionSupport:
      'Keep most portfolio interaction low-effort by relying on broad, durable roles that require little ongoing research or intervention.'
  }),

  GD: Object.freeze({
    archetypeId: 'GD',
    portfolioFamily:
      'Global Diversified Portfolio',
    interactionSupport:
      'Organize attention around broad sources of diversification so review focuses on whether major exposures remain balanced rather than on individual securities or short-term market noise.'
  }),

  FT: Object.freeze({
    archetypeId: 'FT',
    portfolioFamily:
      'Systematic Improvement Portfolio',
    interactionSupport:
      'Keep the durable core low-maintenance while concentrating additional research and review effort on a limited set of explicitly defined improvement sleeves.'
  }),

  BFO: Object.freeze({
    archetypeId: 'BFO',
    portfolioFamily:
      'Balanced Multi-Purpose Portfolio',
    interactionSupport:
      'Match attention to portfolio purpose, allowing stable roles to remain low-maintenance while income, liquidity, diversification, or opportunity roles receive only the review their job requires.'
  }),

  GA: Object.freeze({
    archetypeId: 'GA',
    portfolioFamily:
      'Growth & Alternatives Portfolio',
    interactionSupport:
      'Keep the main growth foundation relatively stable while directing additional research and monitoring toward bounded alternative or differentiated return sources.'
  }),

  TO: Object.freeze({
    archetypeId: 'TO',
    portfolioFamily:
      'Opportunity Portfolio',
    interactionSupport:
      'Keep permanent capital separate from higher-attention tactical and opportunity roles so active research is concentrated where it is intended instead of spreading across the whole portfolio.'
  }),

  IP: Object.freeze({
    archetypeId: 'IP',
    portfolioFamily:
      'Income Preservation Portfolio',
    interactionSupport:
      'Focus portfolio attention on liquidity, income reliability, resilience, and changing spending needs while keeping measured-growth components comparatively low-maintenance.'
  })
});


export const VARIANT_INTERACTION_SUPPORT = Object.freeze({
  essential: Object.freeze({
    variantId: 'essential',
    interactionSupport:
      'Keep interaction simple with a small number of broad portfolio roles, mostly low-effort holdings, and limited reasons for routine review.'
  }),

  intentional: Object.freeze({
    variantId: 'intentional',
    interactionSupport:
      'Use clearer role separation and scheduled reviews so the investor can direct attention selectively instead of monitoring the whole portfolio continuously.'
  }),

  engaged: Object.freeze({
    variantId: 'engaged',
    interactionSupport:
      'Create more granular roles and bounded higher-effort areas so the investor can research selected parts actively while keeping the rest of the portfolio on a stable operating rhythm.'
  })
});


const INTERACTION_TRADEOFF_IDS = Object.freeze([
  'tell_me',
  'occasional',
  'periodic',
  'explore',
  'active'
]);


const INTERACTION_PSYCHOLOGY_IDS = Object.freeze([
  'balance',
  'market',
  'holding',
  'idea',
  'rarely'
]);


const EXACT_INTERACTION_DELIVERY = Object.freeze({
  'ES|essential|tell_me': Object.freeze({
    requiredSleeveIds: Object.freeze([
      'broadGrowthCore',
      'stability',
      'liquidity'
    ]),
    copy:
      'This system uses a small number of broad, low-effort portfolio roles, so most of the portfolio can remain in place without regular research or intervention.'
  }),

  'FT|intentional|explore': Object.freeze({
    requiredSleeveIds: Object.freeze([
      'durableCore',
      'stability',
      'qualityImprovement',
      'smallValueImprovement'
    ]),
    copy:
      'This system keeps the durable core and stability roles relatively low-maintenance while concentrating additional research on the portfolio’s defined improvement sleeves. That gives exploration a specific place without increasing effort across the whole portfolio.'
  }),

  'BFO|intentional|periodic': Object.freeze({
    requiredSleeveIds: Object.freeze([
      'growth',
      'income',
      'stability',
      'diversifiers',
      'liquidity'
    ]),
    copy:
      'This system separates growth, income, stability, diversification, and liquidity into distinct roles with different review needs, so attention can be directed through a planned review rhythm instead of treating the entire portfolio the same way.'
  }),

  'TO|engaged|active': Object.freeze({
    requiredSleeveIds: Object.freeze([
      'permanentCore',
      'tacticalAllocation',
      'thematicOpportunities',
      'securitySelection'
    ]),
    copy:
      'This system protects the permanent core while separating tactical, thematic, and opportunity roles that are meant to receive more active attention. That keeps higher-effort research concentrated in the parts designed for it.'
  }),

  'GA|engaged|explore': Object.freeze({
    requiredSleeveIds: Object.freeze([
      'globalGrowthCore',
      'alternativeStrategy',
      'opportunityCapacity'
    ]),
    copy:
      'This system keeps the main growth foundation relatively stable while giving alternatives, differentiated return sources, and bounded opportunity capacity their own higher-attention roles. That allows deeper research without turning the entire portfolio into a research project.'
  }),

  'IP|essential|occasional': Object.freeze({
    requiredSleeveIds: Object.freeze([
      'highQualityIncome',
      'liquidity',
      'measuredGrowth',
      'inflationProtection'
    ]),
    copy:
      'This system concentrates attention on liquidity, dependable income, and resilience while keeping the portfolio structure broad and relatively low-maintenance, allowing occasional review without constant monitoring.'
  })
});


const ATTENTION_REFINEMENTS = Object.freeze({
  balance:
    'Short-term account-balance changes therefore do not need to become the main reason to review every role.',
  market:
    'Broad market moves can therefore be interpreted against the specific roles they actually affect.',
  holding:
    'Attention to an individual holding can therefore stay tied to the portfolio role it is meant to perform.',
  idea:
    'New ideas therefore receive attention only inside the parts designed for additional research.',
  rarely:
    'The system can therefore remain quiet until a role-specific exception genuinely deserves attention.'
});


function getInteractionRefinement(
  tradeoffOptionId,
  marketPsychologyOptionId
) {
  const usefulPairings = {
    tell_me: ['balance', 'holding', 'rarely'],
    occasional: ['balance', 'holding', 'rarely'],
    periodic: ['balance', 'market'],
    explore: ['holding', 'idea'],
    active: ['market', 'holding', 'idea']
  };

  if (
    !usefulPairings[
      tradeoffOptionId
    ].includes(
      marketPsychologyOptionId
    )
  ) {
    return '';
  }

  return (
    ' ' +
    ATTENTION_REFINEMENTS[
      marketPsychologyOptionId
    ]
  );
}


function buildInteractionDelivery({
  archetypeSupport,
  variantId,
  tradeoffOptionId,
  marketPsychologyOptionId,
  sleeves
}) {
  const portfolioName =
    `${capitalize(variantId)} ${
      archetypeSupport.portfolioFamily
    }`;

  const roleDescription =
    describeRoles(sleeves);

  const lowerEffortSleeves =
    sleeves.filter((sleeve) =>
      [
        'very-low',
        'low'
      ].includes(
        getSleeveEffort(sleeve)
      )
    );

  const higherEffortSleeves =
    sleeves.filter((sleeve) =>
      [
        'moderate',
        'high'
      ].includes(
        getSleeveEffort(sleeve)
      )
    );

  const stableDescription =
    lowerEffortSleeves.length > 0
      ? describeRoles(
          lowerEffortSleeves
        )
      : roleDescription;

  const activeDescription =
    higherEffortSleeves.length > 0
      ? describeRoles(
          higherEffortSleeves
        )
      : null;

  const refinement =
    getInteractionRefinement(
      tradeoffOptionId,
      marketPsychologyOptionId
    );

  if (tradeoffOptionId === 'tell_me') {
    return `This ${portfolioName} keeps ${stableDescription} broad and low-maintenance, so routine attention stays limited and review is only needed when something meaningfully affects a defined role.${refinement}`;
  }

  if (tradeoffOptionId === 'occasional') {
    return `This ${portfolioName} keeps ${stableDescription} on a low-effort rhythm${
      activeDescription
        ? ` and separates ${activeDescription} for occasional attention`
        : ''
    }, so review can stay light unless something meaningfully changes.${refinement}`;
  }

  if (tradeoffOptionId === 'periodic') {
    return `This ${portfolioName} gives ${roleDescription} distinct review expectations, so attention can concentrate at planned intervals instead of requiring continuous monitoring.${refinement}`;
  }

  if (tradeoffOptionId === 'explore') {
    if (activeDescription) {
      return `This ${portfolioName} keeps ${stableDescription} on a stable operating rhythm and confines deeper research to ${activeDescription}, so exploration does not increase effort across the entire system.${refinement}`;
    }

    return `This ${portfolioName} keeps ${roleDescription} broad and low-maintenance. Exploration has to remain outside those stable portfolio roles rather than increasing the research required across the whole system.${refinement}`;
  }

  if (activeDescription) {
    return `This ${portfolioName} protects ${stableDescription} from unnecessary intervention while making ${activeDescription} the explicit higher-attention roles, allowing active engagement without turning every part into an active decision.${refinement}`;
  }

  return `This ${portfolioName} organizes attention around ${roleDescription}, keeping its stable roles protected from unnecessary intervention even when the investor chooses to stay actively engaged.${refinement}`;
}


export function getPortfolioInteractionDelivery({
  archetypeId,
  variantId,
  tradeoffOptionId,
  marketPsychologyOptionId,
  portfolioSystem
} = {}) {
  const archetypeSupport =
    ARCHETYPE_INTERACTION_SUPPORT[
      archetypeId
    ];

  const variantSupport =
    VARIANT_INTERACTION_SUPPORT[
      variantId
    ];

  const sleeves =
    portfolioSystem?.sleeves;

  if (
    !archetypeSupport ||
    !variantSupport ||
    !INTERACTION_TRADEOFF_IDS.includes(
      tradeoffOptionId
    ) ||
    !INTERACTION_PSYCHOLOGY_IDS.includes(
      marketPsychologyOptionId
    ) ||
    !portfolioSystem ||
    !Array.isArray(sleeves) ||
    sleeves.length === 0 ||
    sleeves.some(
      (sleeve) =>
        !sleeve?.id ||
        !(
          sleeve?.role?.label ??
          sleeve?.label
        )
    )
  ) {
    return null;
  }

  const exactDelivery =
    EXACT_INTERACTION_DELIVERY[
      `${archetypeId}|${variantId}|${tradeoffOptionId}`
    ];

  const systemDelivery =
    exactDelivery &&
    exactDelivery.requiredSleeveIds.every(
      (sleeveId) =>
        sleeves.some(
          (sleeve) =>
            sleeve.id === sleeveId
        )
    )
      ? exactDelivery.copy
      : buildInteractionDelivery({
          archetypeSupport,
          variantId,
          tradeoffOptionId,
          marketPsychologyOptionId,
          sleeves
        });

  return {
    archetypeId,
    variantId,
    tradeoffOptionId,
    marketPsychologyOptionId,
    portfolioFamily:
      archetypeSupport.portfolioFamily,
    philosophySupport:
      archetypeSupport.interactionSupport,
    variantSupport:
      variantSupport.interactionSupport,
    systemDelivery
  };
}

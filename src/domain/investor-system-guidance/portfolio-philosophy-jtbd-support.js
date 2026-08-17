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

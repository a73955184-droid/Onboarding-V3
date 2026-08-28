import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';

import {
  SECURITY_REFERENCE
} from './security-reference.js';

import {
  EXAMPLE_SECURITY_ASSOCIATIONS
} from './example-securities.js';

import {
  EXAMPLE_SECURITY_CONTEXTS
} from './example-security-context.js';

import {
  EXAMPLE_SECURITY_VARIANT_GUIDANCE
} from './example-security-variant-guidance.js';


const EMPTY_RESULTS = Object.freeze([]);


function contextKey({
  archetypeId,
  variantId,
  sleeveId,
  assetCategoryId,
  securityId
}) {
  return [
    archetypeId,
    variantId,
    sleeveId,
    assetCategoryId,
    securityId
  ].join('|');
}


const CONTEXT_BY_KEY = new Map(
  EXAMPLE_SECURITY_CONTEXTS.map(
    (context) => [contextKey(context), context]
  )
);


export function resolveExampleSecurities({
  archetypeId,
  variantId,
  sleeveId
} = {}) {
  if (
    typeof archetypeId !== 'string' ||
    typeof variantId !== 'string' ||
    typeof sleeveId !== 'string'
  ) {
    return EMPTY_RESULTS;
  }

  const associations =
    EXAMPLE_SECURITY_ASSOCIATIONS.filter(
      (association) =>
        association.archetypeId === archetypeId &&
        association.variantId === variantId &&
        association.sleeveId === sleeveId
    );

  if (associations.length === 0) {
    return EMPTY_RESULTS;
  }

  const variantGuidance =
    EXAMPLE_SECURITY_VARIANT_GUIDANCE[variantId];

  return Object.freeze(
    associations.flatMap(
      (association) =>
        association.securityIds.map(
          (securityId) => {
            const security =
              SECURITY_REFERENCE[securityId];

            const context = CONTEXT_BY_KEY.get(
              contextKey({
                ...association,
                securityId
              })
            );

            return Object.freeze({
              ...security,
              securityId,
              archetypeId,
              variantId,
              portfolioId: association.portfolioId,
              sleeveId,
              assetCategoryId:
                association.assetCategoryId,
              relationship:
                association.relationship,
              implementationNote:
                association.implementationNote,
              exampleType:
                association.exampleType,
              portfolioJob:
                context.portfolioJob,
              whyItFits:
                context.whyItFits,
              whyItMayNotFit:
                context.whyItMayNotFit,
              diversificationContribution:
                context.diversificationContribution,
              primaryRisks:
                context.primaryRisks,
              overlapCheck:
                context.overlapCheck,
              monitoring:
                context.monitoring,
              reconsiderWhen:
                context.reconsiderWhen,
              disclosure:
                context.disclosure,
              variantGuidance
            });
          }
        )
    )
  );
}


export function getExampleSecurityCoverage() {
  const portfolioIds = new Set();
  const sleeveKeys = new Set();
  const archetypeIds = new Set();
  const variantIds = new Set();

  for (const association of EXAMPLE_SECURITY_ASSOCIATIONS) {
    archetypeIds.add(association.archetypeId);
    variantIds.add(association.variantId);
    portfolioIds.add(association.portfolioId);
    sleeveKeys.add([
      association.archetypeId,
      association.variantId,
      association.sleeveId
    ].join('|'));
  }

  return Object.freeze({
    archetypes: archetypeIds.size,
    variants: variantIds.size,
    portfolioSystems: portfolioIds.size,
    sleeveInstances: sleeveKeys.size,
    securities: Object.keys(SECURITY_REFERENCE).length,
    contextualMappings: EXAMPLE_SECURITY_CONTEXTS.length,
    pendingVerificationRecords:
      Object.values(SECURITY_REFERENCE).filter(
        (security) =>
          security.verificationStatus === 'pending'
      ).length
  });
}


export function validateExampleSecurityCatalogue() {
  const errors = [];

  const portfolios = Object.values(
    CONSTITUENT_PORTFOLIOS
  ).flatMap(
    (variantMap) => Object.values(variantMap)
  );

  const portfolioById = new Map(
    portfolios.map(
      (portfolio) => [portfolio.id, portfolio]
    )
  );

  for (const portfolio of portfolios) {
    for (const sleeve of portfolio.sleeves) {
      const hasAssociation =
        EXAMPLE_SECURITY_ASSOCIATIONS.some(
          (association) =>
            association.archetypeId === portfolio.archetypeId &&
            association.variantId === portfolio.variantId &&
            association.sleeveId === sleeve.id
        );

      if (!hasAssociation) {
        errors.push(
          portfolio.id + '/' + sleeve.id + ': missing association'
        );
      }
    }
  }

  for (const association of EXAMPLE_SECURITY_ASSOCIATIONS) {
    const portfolio = portfolioById.get(
      association.portfolioId
    );

    const sleeve = portfolio?.sleeves.find(
      (candidate) =>
        candidate.id === association.sleeveId
    );

    const associationLabel = [
      association.portfolioId,
      association.sleeveId,
      association.assetCategoryId
    ].join('/');

    if (
      !portfolio ||
      portfolio.archetypeId !== association.archetypeId ||
      portfolio.variantId !== association.variantId ||
      !sleeve
    ) {
      errors.push(associationLabel + ': nonexistent sleeve');
      continue;
    }

    if (
      !sleeve.assetCategories.includes(
        association.assetCategoryId
      )
    ) {
      errors.push(associationLabel + ': category not assigned to sleeve');
    }

    if (
      association.securityIds.length === 0 &&
      !association.deferredReason
    ) {
      errors.push(associationLabel + ': empty mapping without deferred reason');
    }

    for (const securityId of association.securityIds) {
      if (!SECURITY_REFERENCE[securityId]) {
        errors.push(associationLabel + ': unknown security ' + securityId);
      }

      if (
        !CONTEXT_BY_KEY.has(
          contextKey({
            ...association,
            securityId
          })
        )
      ) {
        errors.push(associationLabel + ': missing context for ' + securityId);
      }
    }
  }

  for (const context of EXAMPLE_SECURITY_CONTEXTS) {
    const matchingAssociation =
      EXAMPLE_SECURITY_ASSOCIATIONS.find(
        (association) =>
          association.archetypeId === context.archetypeId &&
          association.variantId === context.variantId &&
          association.sleeveId === context.sleeveId &&
          association.assetCategoryId === context.assetCategoryId &&
          association.securityIds.includes(context.securityId)
      );

    if (!matchingAssociation) {
      errors.push(
        contextKey(context) + ': context has no exact association'
      );
    }
  }

  const symbols = Object.values(
    SECURITY_REFERENCE
  ).map(
    (security) => security.symbol
  );

  if (new Set(symbols).size !== symbols.length) {
    errors.push('Security symbols must be unique');
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors)
  });
}

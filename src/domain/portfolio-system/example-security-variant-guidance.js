export const EXAMPLE_SECURITY_VARIANT_GUIDANCE = Object.freeze({
  essential: Object.freeze({
    variantId: 'essential',
    comparisonDepth: 'minimal',
    monitoringBurden: 'low',
    implementationRule:
      'Prefer the smallest number of broad exposures necessary to fulfill the sleeve job.'
  }),

  intentional: Object.freeze({
    variantId: 'intentional',
    comparisonDepth: 'moderate',
    monitoringBurden: 'moderate',
    implementationRule:
      'Separate exposures when doing so materially improves understanding, control or portfolio-job clarity.'
  }),

  engaged: Object.freeze({
    variantId: 'engaged',
    comparisonDepth: 'detailed',
    monitoringBurden: 'high',
    implementationRule:
      'Permit differentiated exposures only when each has a distinct contribution and justified monitoring burden.'
  })
});

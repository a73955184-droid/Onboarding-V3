import {
  EXACT_SLEEVE_SECURITY_PERMISSIONS
} from './exact-sleeve-security-permissions.js';

function exactKey({
  portfolioSystemId,
  variantId,
  sleeveId,
  categoryId,
  securityId
}) {
  return [
    portfolioSystemId,
    variantId,
    sleeveId,
    categoryId,
    securityId
  ].join('|');
}


export const SLEEVE_SECURITY_ELIGIBILITY =
  Object.freeze(
    EXACT_SLEEVE_SECURITY_PERMISSIONS.map(
      (permission) => Object.freeze({
        ...permission,
        listingStatus: 'listed',
        automaticallyHeld: false
      })
    )
  );


const ELIGIBILITY_BY_KEY = new Map(
  SLEEVE_SECURITY_ELIGIBILITY.map(
    (record) => [exactKey(record), record]
  )
);


export function getExactSleeveSecurityEligibility(
  input
) {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const normalizedInput = {
    ...input,
    securityId:
      typeof input.securityId === 'string'
        ? input.securityId.toLowerCase()
        : ''
  };

  return ELIGIBILITY_BY_KEY.get(
    exactKey(normalizedInput)
  ) ?? null;
}

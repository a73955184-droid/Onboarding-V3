import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';


const DISPLAY_SCALE = 10000;


function validateInput(sleeveWeight, securityIds) {
  if (
    typeof sleeveWeight !== 'number' ||
    !Number.isFinite(sleeveWeight) ||
    sleeveWeight < 0 ||
    sleeveWeight > 1
  ) {
    throw new TypeError(
      'sleeveWeight must be a finite number from 0 to 1'
    );
  }

  if (!Array.isArray(securityIds)) {
    throw new TypeError('securityIds must be an array');
  }

  if (new Set(securityIds).size !== securityIds.length) {
    throw new TypeError('securityIds must be unique');
  }

  for (const securityId of securityIds) {
    if (
      typeof securityId !== 'string' ||
      !PHASE_1_SECURITY_REFERENCE[
        securityId.toLowerCase()
      ]
    ) {
      throw new TypeError(
        'securityIds must contain canonical security IDs'
      );
    }
  }
}


export function resolveEqualWeightAllocation({
  sleeveWeight,
  securityIds
} = {}) {
  validateInput(sleeveWeight, securityIds);

  if (securityIds.length === 0) {
    return Object.freeze({
      state:
        'unallocated-within-hypothetical-portfolio',
      sleeveWeight,
      holdings: Object.freeze([]),
      totalWeight: 0,
      displayTotal: 0
    });
  }

  const normalizedIds = securityIds.map(
    (securityId) => securityId.toLowerCase()
  );

  const fullPrecisionWeight =
    sleeveWeight / normalizedIds.length;

  const targetDisplayUnits = Math.round(
    sleeveWeight * DISPLAY_SCALE
  );

  const baseDisplayUnits = Math.floor(
    targetDisplayUnits / normalizedIds.length
  );

  const remainder =
    targetDisplayUnits -
    baseDisplayUnits * normalizedIds.length;

  const holdings = normalizedIds.map(
    (securityId, index) => {
      const displayUnits =
        baseDisplayUnits +
        (index < remainder ? 1 : 0);

      return Object.freeze({
        securityId,
        weight: fullPrecisionWeight,
        displayWeight:
          displayUnits / DISPLAY_SCALE
      });
    }
  );

  return Object.freeze({
    state: 'allocated',
    sleeveWeight,
    holdings: Object.freeze(holdings),
    totalWeight: sleeveWeight,
    displayTotal:
      targetDisplayUnits / DISPLAY_SCALE
  });
}


function createSleeveRecord(sleeves, createValue) {
  return Object.fromEntries(
    sleeves.map((sleeve) => [sleeve.id, createValue(sleeve)])
  );
}

function assertSleeve(state, sleeveId) {
  if (!Object.hasOwn(state.holdingsBySleeve, sleeveId)) {
    throw new TypeError('Unknown curation sleeve ID');
  }
}

function clearAssessments(state) {
  for (const sleeveId of Object.keys(state.assessmentBySleeve)) {
    state.assessmentBySleeve[sleeveId] = null;
  }
}

export function createPortfolioCurationSession(sleeves = []) {
  if (!Array.isArray(sleeves)) {
    throw new TypeError('sleeves must be an array');
  }

  return {
    holdingsBySleeve: createSleeveRecord(sleeves, () => []),
    savedAlternativesBySleeve: createSleeveRecord(sleeves, () => []),
    activeCategoryIdBySleeve: createSleeveRecord(
      sleeves,
      (sleeve) => sleeve.assetCategories?.[0]?.id ?? null
    ),
    activeCandidateIdBySleeve: createSleeveRecord(sleeves, () => null),
    assessmentBySleeve: createSleeveRecord(sleeves, () => null)
  };
}

export function selectCurationCategory(state, sleeveId, categoryId) {
  assertSleeve(state, sleeveId);
  state.activeCategoryIdBySleeve[sleeveId] = categoryId;
  state.activeCandidateIdBySleeve[sleeveId] = null;
  state.assessmentBySleeve[sleeveId] = null;
}

export function selectCurationCandidate(state, sleeveId, securityId) {
  assertSleeve(state, sleeveId);
  state.activeCandidateIdBySleeve[sleeveId] = securityId;
  state.assessmentBySleeve[sleeveId] = null;
}

export function setCurationAssessment(state, sleeveId, assessment) {
  assertSleeve(state, sleeveId);
  state.assessmentBySleeve[sleeveId] = assessment;
}

export function addCurationHolding(state, sleeveId, securityId) {
  assertSleeve(state, sleeveId);
  const holdings = state.holdingsBySleeve[sleeveId];

  if (!holdings.includes(securityId)) {
    holdings.push(securityId);
  }

  state.savedAlternativesBySleeve[sleeveId] =
    state.savedAlternativesBySleeve[sleeveId].filter(
      (candidateId) => candidateId !== securityId
    );
  clearAssessments(state);
}

export function replaceCurationHolding(
  state,
  sleeveId,
  existingSecurityId,
  candidateSecurityId
) {
  assertSleeve(state, sleeveId);
  const holdings = state.holdingsBySleeve[sleeveId];
  const existingIndex = holdings.indexOf(existingSecurityId);

  if (existingIndex === -1) {
    throw new TypeError('Replacement holding is not in the target sleeve');
  }

  holdings.splice(existingIndex, 1, candidateSecurityId);
  state.savedAlternativesBySleeve[sleeveId] =
    state.savedAlternativesBySleeve[sleeveId].filter(
      (securityId) => securityId !== candidateSecurityId
    );
  clearAssessments(state);
}

export function saveCurationAlternative(state, sleeveId, securityId) {
  assertSleeve(state, sleeveId);
  const alternatives = state.savedAlternativesBySleeve[sleeveId];

  if (!alternatives.includes(securityId)) {
    alternatives.push(securityId);
  }
}

export function clearCurationCandidate(state, sleeveId) {
  assertSleeve(state, sleeveId);
  state.activeCandidateIdBySleeve[sleeveId] = null;
  state.assessmentBySleeve[sleeveId] = null;
}

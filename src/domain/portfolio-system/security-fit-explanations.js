export const SECURITY_FIT_DISCLOSURE =
  'Based on the selected portfolio system and hypothetical holdings. This is an educational system-fit assessment, not a personalized investment recommendation.';


const EXPLANATIONS = Object.freeze({
  'candidate-unverified': Object.freeze({
    sleeveEffect:
      'The candidate cannot be assessed as strengthening this sleeve until its required facts are verified.',
    portfolioEffect:
      'No portfolio-level benefit is recognized for an unverified candidate.',
    allocationEffect:
      'The hypothetical allocation remains unchanged.',
    primaryReason:
      'The candidate is pending verification.'
  }),

  'candidate-not-exactly-eligible': Object.freeze({
    sleeveEffect:
      'The candidate does not have an approved exact mapping to this sleeve.',
    portfolioEffect:
      'Category membership alone does not establish a portfolio role.',
    allocationEffect:
      'The hypothetical allocation remains unchanged.',
    primaryReason:
      'Exact sleeve eligibility has not been approved.'
  }),

  'sleeve-role-conflict': Object.freeze({
    sleeveEffect:
      'The candidate does not perform a category role permitted by this sleeve.',
    portfolioEffect:
      'Adding it here would assign an unsupported responsibility to the sleeve.',
    allocationEffect:
      'The hypothetical allocation remains unchanged.',
    primaryReason:
      'The candidate conflicts with the selected sleeve role.'
  }),

  'sleeve-boundary-conflict': Object.freeze({
    sleeveEffect:
      'The candidate falls outside one or more structural boundaries for this sleeve.',
    portfolioEffect:
      'The candidate would weaken the system boundary assigned to this part of the portfolio.',
    allocationEffect:
      'The hypothetical allocation remains unchanged.',
    primaryReason:
      'The candidate does not satisfy the selected sleeve boundaries.'
  }),

  'duplicate-security': Object.freeze({
    sleeveEffect:
      'The candidate repeats a security already present in the hypothetical portfolio.',
    portfolioEffect:
      'Another instance would not provide a distinct portfolio role.',
    allocationEffect:
      'The hypothetical allocation remains unchanged.',
    primaryReason:
      'The same security is already included.'
  }),

  'existing-role-sufficient': Object.freeze({
    sleeveEffect:
      'An existing hypothetical holding already performs the same approved category role.',
    portfolioEffect:
      'Adding another holding would repeat that structural role.',
    allocationEffect:
      'The hypothetical allocation remains unchanged.',
    primaryReason:
      'The existing holding sufficiently performs the role.'
  }),

  'existing-structural-role-sufficient': Object.freeze({
    sleeveEffect:
      'An existing hypothetical holding already performs the same permitted structural role.',
    portfolioEffect:
      'Adding the candidate would repeat that role without an established structural advantage.',
    allocationEffect:
      'The hypothetical allocation remains unchanged.',
    primaryReason:
      'The existing holding sufficiently performs the structural role.'
  }),

  'lower-effort-role-replacement': Object.freeze({
    sleeveEffect:
      'The candidate can perform the same sleeve role with a more straightforward structural implementation.',
    portfolioEffect:
      'The replacement reinforces the approved role without adding another holding or a new concentration.',
    allocationEffect:
      'The affected sleeve is reweighted after replacing the identified holding.',
    primaryReason:
      'The identified holding performs the same role with greater implementation complexity.'
  }),

  'structural-replacement-advantage': Object.freeze({
    sleeveEffect:
      'The candidate preserves the existing sleeve role with an explicit structural advantage.',
    portfolioEffect:
      'The identified substitution improves the role without adding another holding.',
    allocationEffect:
      'The affected sleeve is reweighted after replacing the identified holding.',
    primaryReason:
      'The candidate has a documented structural advantage over the identified holding.'
  }),

  'cross-sleeve-role-conflict': Object.freeze({
    sleeveEffect:
      'The candidate would repeat a role already assigned to another sleeve.',
    portfolioEffect:
      'Adding the candidate here would weaken the separation of responsibilities across sleeves.',
    allocationEffect:
      'The hypothetical allocation remains unchanged.',
    primaryReason:
      'The candidate creates a cross-sleeve role conflict.'
  }),

  'fills-missing-role': Object.freeze({
    sleeveEffect:
      'The candidate completes an approved role that is not represented in the target sleeve.',
    portfolioEffect:
      'No matching role is present elsewhere in the hypothetical portfolio.',
    allocationEffect:
      'The affected sleeve is reweighted to include the candidate.',
    primaryReason:
      'The candidate fills a missing approved portfolio role.'
  }),

  'fills-missing-permitted-role': Object.freeze({
    sleeveEffect:
      'The candidate supplies a permitted structural role not represented in the target sleeve.',
    portfolioEffect:
      'No existing hypothetical holding already owns that approved responsibility.',
    allocationEffect:
      'The affected sleeve is reweighted to include the candidate.',
    primaryReason:
      'The candidate fills a missing permitted structural role.'
  })
});


export function resolveSecurityFitExplanation({
  outcome,
  reasonCode
}) {
  const explanation = EXPLANATIONS[reasonCode];

  if (!explanation) {
    throw new TypeError(
      'Unknown security-fit explanation reason'
    );
  }

  return Object.freeze({
    systemFitOutcome: outcome,
    effectOnSleeve: explanation.sleeveEffect,
    effectOnPortfolio:
      explanation.portfolioEffect,
    allocationEffect:
      explanation.allocationEffect,
    primaryReason: explanation.primaryReason,
    disclosure: SECURITY_FIT_DISCLOSURE
  });
}

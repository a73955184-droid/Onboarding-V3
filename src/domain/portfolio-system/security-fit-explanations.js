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

  'replace-unverified-role': Object.freeze({
    sleeveEffect:
      'The verified candidate can perform the same sleeve role as an unverified hypothetical holding.',
    portfolioEffect:
      'The replacement reinforces the approved role without adding another holding.',
    allocationEffect:
      'The affected sleeve is reweighted after replacing the identified holding.',
    primaryReason:
      'The identified existing holding is not verified.'
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

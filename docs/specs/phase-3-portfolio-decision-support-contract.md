# Phase 3 Portfolio Decision Support Contract

Status: frozen product-semantics contract; runtime migration pending  
Effective for: Portfolio Map user-facing security decision support  
Decision date: 2026-09-03  
Supersedes for that scope: `phase-2-structural-fit-decision-contract.md`

## 1. Decision

Portfolio Map is moving from a terminal structural-fit classification to a decision-support model.

The Phase 2 question was:

> Which fit outcome applies?

The Phase 3 question is:

> What changes if this candidate is included, what tradeoffs result, and what is the best default action?

This is a change in product semantics, not merely revised copy. Phase 3 must explain the candidate's incremental effect in the current hypothetical portfolio before identifying a preferred action. The preferred action is the best default under the selected portfolio system and sleeve; it is not necessarily the only valid choice.

This document freezes the new meaning before runtime behavior changes. It does not itself reroute Portfolio Map or modify assessment results.

## 2. Why the model is changing

### 2.1 Observed failure mode

The Phase 2 four-outcome model can collapse materially overlapping, same-category implementations into `Redundant` whenever the existing role is considered sufficient and no replacement advantage is established. That classification is useful as a structural signal, but it is too coarse to be the final Portfolio Map decision model.

Two securities can share a permitted category and substantial exposure while still changing the portfolio in an explainable way. For example, a broad total-market equity holding and a large-company equity holding may overlap heavily, yet including both can increase large-company emphasis and reduce the relative share of mid- and small-company exposure.

### 2.2 Product-learning conclusion

- A category defines a candidate universe. It does not necessarily define one atomic implementation.
- Same-category overlap does not automatically imply zero incremental contribution.
- Material overlap is evidence to interpret, not by itself a complete user-facing verdict.
- A valid choice can have costs, such as greater concentration, overlap, or maintenance complexity, without being universally invalid.
- Portfolio Map should distinguish the best default from other actions that remain valid with explicit tradeoffs.

## 3. Authority boundary

Phase 2 remains authoritative for lower-level structural facts and evidence:

- exact sleeve eligibility;
- assessment readiness and unresolved-data handling;
- sleeve-role alignment;
- sleeve boundaries;
- structural overlap evidence, including relevant dimensions and holdings;
- replacement-comparison evidence and any named affected holding.

Phase 3 becomes authoritative for Portfolio Map user-facing decision support:

- what exposure the current hypothetical portfolio already has;
- what the candidate contributes incrementally;
- what exposure or role it duplicates;
- what emphasis, concentration, or relative mix changes;
- what implementation or monitoring complexity changes;
- which user actions are available;
- which action is the preferred default and why;
- novice-facing presentation of those tradeoffs and choices.

Phase 3 must consume Phase 2 facts rather than recreate eligibility, metadata, readiness, alignment, boundary, overlap, or replacement rules.

| Concern | Authoritative capability |
| --- | --- |
| Candidate/category/sleeve permission | Phase 2 portfolio-system primitives |
| Metadata sufficiency and assessment availability | Phase 2 portfolio-system primitives |
| Structural alignment and boundary evidence | Phase 2 portfolio-system primitives |
| Overlap and replacement evidence | Phase 2 portfolio-system primitives |
| Incremental contribution and portfolio-change interpretation | Phase 3 portfolio decision support |
| Available choices and preferred default | Phase 3 portfolio decision support |
| Portfolio Map user-facing explanation and actions | Phase 3 portfolio decision support |

## 4. Decision-support semantics

### 4.1 Assessment availability

Phase 3 inherits the Phase 2 readiness and exact-eligibility gates. Unknown securities, unresolved exact permission, and decision-relevant unresolved metadata remain unavailable. Missing evidence must not be converted into a negative conclusion or a preferred action.

### 4.2 Incremental contribution

Incremental contribution asks what changes relative to the current hypothetical portfolio if the candidate is included. It may include:

- a previously missing approved exposure or role;
- a deliberate increase in an existing exposure;
- a new tilt within a broader existing allocation;
- an implementation difference within a shared role;
- no material additional contribution.

Contribution must be based on approved structural evidence. Same-category membership and array cardinality alone are insufficient.

### 4.3 Tradeoffs

The assessment should distinguish at least:

- shared exposure;
- distinct exposure;
- increased emphasis or concentration;
- reduced relative emphasis elsewhere in the sleeve;
- implementation and monitoring complexity;
- replacement implications, when supported by Phase 2 evidence.

Tradeoffs must remain contextual to the selected system, variant, sleeve, candidate, and hypothetical holdings. They are not universal claims about a security.

### 4.4 Available actions and preferred action

Phase 3 should use `availableActions` and `preferredAction`, not use `outcome` as its primary user-facing decision contract.

Potential actions include:

- `keep-current`;
- `add`;
- `replace`;
- `save-alternative`;
- `return` or reconsider in another permitted context.

An action is available only when supported by readiness, permission, structural evidence, and the applicable portfolio contract. Replace continues to require a specific existing holding and explicit replacement evidence.

`preferredAction` means the best default given the selected portfolio system and current hypothetical holdings. It does not mean a guaranteed result, a trade instruction, or the only permissible choice.

Genuine sleeve or boundary conflicts may constrain available actions. Phase 3 is not a rule that every candidate must always be addable.

## 5. User-facing interpretation

Portfolio Map should present structural evidence through user questions such as:

- What you already have
- What this candidate adds
- Where the candidate overlaps
- How the sleeve mix would change
- What becomes more concentrated or less prominent
- What becomes more complex to maintain
- Which choices are available
- What the best default is for this sleeve

Internal identifiers, raw arrays, and comparison implementation details remain available for audit and testing but should not be the primary explanation.

The presentation must avoid performance forecasts, guarantees, and buy/sell or trade-execution language.

## 6. Relationship to the Phase 2 four outcomes

The Phase 2 values remain a compatibility and regression contract:

```text
Add
Replace
Redundant
Do not add
```

They may be consumed as lower-level classification evidence during migration, but they no longer define the final Portfolio Map user-facing decision model.

In particular:

- Phase 2 `Redundant` may indicate substantial existing role coverage, but Phase 3 must still determine whether the candidate creates a meaningful tilt or other incremental change.
- Phase 2 `Replace` evidence remains relevant to a Phase 3 replace option and must retain its named holding and structural justification.
- A completed Phase 2 boundary conflict can constrain Phase 3 actions and support a default not to include the candidate in that sleeve.
- Phase 2 `Add` does not eliminate the need to explain the change and its tradeoffs.

Phase 2 is superseded, not deleted.

## 7. Architectural boundary

The target dependency direction is:

```text
Portfolio Map
  -> portfolio-decision-support
    -> portfolio-system eligibility and readiness
    -> portfolio-system alignment and boundaries
    -> portfolio-system overlap and replacement evidence
  -> decision-support presentation
```

The Phase 3 capability belongs in `src/domain/portfolio-decision-support/`, as a sibling of `portfolio-system/`.

It must not:

- duplicate security metadata or category assignments;
- weaken exact eligibility or readiness;
- infer structural facts from prose;
- store decisions on security, category, sleeve, or constituent records;
- create holdings automatically;
- change constituent portfolios or equal-weight allocation;
- use returns, volatility, drawdown, or correlation unless a later contract explicitly authorizes them;
- introduce brokerage, persistence, or trade-execution behavior.

Portfolio Map calls one Phase 3 top-level decision-support API. The Phase 2 top-level fit resolver remains available for compatibility, lower-level classification, and regression coverage, but is not the endpoint for new Portfolio Map decision-support work.

## 8. Migration invariants

During implementation:

1. Phase 2 evidence contracts remain testable and deterministic.
2. Assessment unavailable remains distinct from a completed negative interpretation.
3. Same-security duplication remains explicit evidence.
4. Same-category overlap is analyzed for both shared and incremental exposure.
5. Replace always names the affected holding.
6. Available actions are machine-readable and presenter-controlled.
7. The preferred action includes evidence explaining why it is the default.
8. Alternative valid actions include their material tradeoffs.
9. Portfolio Map does not reconstruct decision logic from raw evidence.
10. No allocation or holding mutation occurs before an authorized user action.

## 9. Non-goals of this documentation changeset

This changeset does not:

- implement the Phase 3 resolver;
- define final module names or a finalized response schema;
- reroute Portfolio Map;
- alter any Phase 2 outcome;
- change metadata, eligibility, readiness, structural comparisons, allocation, or UI behavior.

## 10. Final legacy-resolver decision

Following the catalogue-wide Phase 3 behavior audit, `security-portfolio-fit-resolver.js` is retained as the **legacy compatibility / structural classification API**. It is not reduced or removed.

The audit demonstrated that Phase 3 materially changes the interpretation of Phase 2 results while continuing to depend on the validated Phase 2 structural primitives. Retaining the old top-level resolver preserves the four-outcome reference contract and its regression value without allowing it to own Portfolio Map semantics.

The binding ownership boundary is:

- Phase 2 owns its legacy four-outcome classification API and structural regression history.
- Phase 2 primitives remain authoritative for eligibility, readiness, sleeve alignment, sleeve boundaries, overlap evidence, and replacement evidence.
- Phase 3 owns Portfolio Map tradeoffs, contribution interpretation, available actions, preferred defaults, and user-facing presentation.
- Portfolio Map must not import the Phase 2 top-level resolver.

Theme, alternative-strategy, and factor-methodology metadata enrichment is separate follow-on capability work. It must not be used as a reason to collapse, rewrite, or silently broaden either resolver during migration cleanup.

The complete decision and any prerequisites for reconsidering removal are recorded in `phase-3-legacy-fit-resolver-decision.md`.

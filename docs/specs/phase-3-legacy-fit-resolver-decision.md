# Phase 3 legacy fit-resolver decision

Status: **Accepted**  
Decision date: 2026-09-03  
Applies to: `src/domain/portfolio-system/security-portfolio-fit-resolver.js`

## Decision

Retain `security-portfolio-fit-resolver.js` as the **legacy compatibility / structural classification API**.

Do not reduce or remove it in the Phase 3 migration. Do not route Portfolio Map or new user-facing decision-support work through it.

## Evidence

The decision follows completion of the Phase 3 migration and the catalogue-wide behavior audit:

- Portfolio Map now calls the Phase 3 resolver and renders the Phase 3 presenter model.
- Phase 3 reuses the existing eligibility, readiness, alignment, boundary, overlap, and replacement primitives.
- The Phase 2 resolver and all four outcomes continue to pass their regression suite.
- Across 20,218 identical ordered-pair scenarios, Phase 2 returned `Redundant` 18,548 times while Phase 3 identified 9,336 overlapping-but-additive cases, exposed Add 8,760 times, and preferred Add 2,536 times.
- Phase 3 therefore provides materially different decision support rather than renaming the old classification.
- Remaining theme, alternative-strategy, and factor distinctions are constrained by authoritative metadata expressiveness, not by a need to rewrite the Phase 2 resolver.

The full empirical record is in `phase-3-catalogue-wide-behavior-audit.md`.

## Retained responsibilities

The Phase 2 top-level resolver remains available for:

- compatibility with code or tests that explicitly consume the four-outcome contract;
- deterministic structural classification into Add, Replace, Redundant, or Do not add;
- preservation of `affectedSecurityId` replacement semantics;
- historical comparison and regression testing;
- verifying the established Phase 2 decision precedence and evidence contract.

The underlying Phase 2 primitives remain the authoritative source for:

- exact sleeve eligibility;
- assessment readiness;
- sleeve-role and boundary alignment;
- structural overlap evidence;
- cross-sleeve responsibility;
- replacement evidence;
- equal-weight allocation used by the legacy result.

## Prohibited uses

The retained resolver must not:

- become the Portfolio Map screen contract again;
- be imported by new UI or presenter code;
- be used as the primary source of Phase 3 contribution, tradeoff, option, preference, or explanation semantics;
- be rewritten to duplicate Phase 3 behavior;
- acquire persistence, brokerage, execution, scoring, or market-performance behavior;
- become a shortcut around the Phase 3 contract.

New Portfolio Map work must use `resolveSecurityDecisionSupport()` and its presenter.

## Why it is not being reduced now

Reducing the old resolver to a thin alias of Phase 3 would destroy the independent four-outcome regression reference. Removing it would discard a validated compatibility API while known consumers and tests remain. Rewriting it to share Phase 3 interpretation would blur the dependency direction and make the old and new semantics impossible to compare independently.

The current separation is intentional:

```text
Phase 2 structural primitives
  |-> Phase 2 legacy four-outcome classifier
  `-> Phase 3 contribution and tradeoff composition
        -> Phase 3 options and preferred default
             -> Portfolio Map presenter and screen
```

Phase 3 depends on Phase 2 primitives, not on the Phase 2 top-level classifier.

## Reconsideration criteria

Removal or material reduction may be reconsidered only through a separate explicit decision after all of the following are true:

1. A repository-wide consumer inventory finds no runtime callers of the Phase 2 top-level resolver.
2. Any external or compatibility consumers have a documented migration path and deprecation window.
3. Primitive-level tests preserve the structural precedence and replacement invariants currently protected through the legacy resolver.
4. The product no longer requires four-outcome classification for regression, reference, exports, or another non-Portfolio-Map capability.
5. The catalogue expressiveness follow-on is complete enough that removal cannot conceal a Phase 3 evidence gap.
6. A replacement historical-comparison strategy preserves the ability to detect semantic drift.

Meeting these criteria permits a new decision; it does not authorize automatic removal.

## Follow-on work kept separate

Evidence-backed metadata enrichment for themes, alternative-strategy subtypes, and factor methodologies is a separate capability. That work may extend approved vocabularies and structural primitives, but it must preserve the two top-level contracts until this decision is explicitly superseded.

## Consequences

- The repository carries two intentional top-level APIs with different purposes.
- The Phase 2 API remains deprecated specifically for primary Portfolio Map use, not universally deprecated.
- Compatibility and regression tests continue exercising all four Phase 2 outcomes.
- Portfolio Map remains governed exclusively by Phase 3 decision support.
- No runtime behavior, catalogue data, allocation behavior, route, dependency, or UI interaction changes as a result of this decision.

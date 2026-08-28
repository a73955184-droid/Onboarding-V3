# Phase 1 Securities Data Implementation Plan

## 1. Purpose

Phase 1 will add the domain data and deterministic resolver contracts needed to evaluate a security in the context of a specific portfolio system, variant, and sleeve. It will establish the static security universe, exact eligibility mappings, exposure descriptions, fit rules, equal-weight allocation behavior, outcome resolution, explanations, and compliance tests.

Phase 1 must not change visible product behavior. The existing Portfolio System Map and its current example-security experience remain unchanged.

Phase 2 will integrate the Phase 1 domain layer into `PortfolioMapScreen.js` and deliver the interactive curation experience. Keeping that integration separate makes the Phase 1 data and decision contracts reviewable before any user-facing behavior depends on them.

## 2. Authoritative inputs

Implementation must use this source hierarchy:

- The attached `AaronBux_Phase1_Securities_Data_Spec.md`.
- The existing `CONSTITUENT_PORTFOLIOS` definitions in `constituent-portfolios.js`.
- The existing Increment 0B modules: `security-reference.js`, `example-securities.js`, `example-security-context.js`, `example-security-variant-guidance.js`, and `example-security-resolver.js`.

1. Existing portfolio definitions are authoritative for archetypes, variants, sleeves, sleeve weights, and sleeve category assignments.
2. Verified Increment 0B records are authoritative for the current 37 canonical securities and 197 contextual mappings.
3. `AaronBux_Phase1_Securities_Data_Spec.md` is authoritative for the proposed expanded candidate universe, schemas, deterministic rules, required safeguards, and approval gates.
4. Any conflict among these sources must be reported for approval. It must not be resolved through inference, silent normalization, external research, or invented data.

The attached specification is an input to this plan; it is not copied wholesale into the repository. Implementation should preserve its exact approved identifiers and values while keeping unresolved entries explicitly pending or deferred.

## 3. Phase boundary

### Phase 1: domain data and deterministic resolvers

Phase 1 includes:

- The approved security category universe.
- Canonical security exposure profiles and verified category associations.
- Exact portfolio-system, variant, sleeve, category, and security eligibility records.
- Sleeve-level and portfolio-wide fit rules.
- Deterministic equal-weight before/after allocation calculations.
- Deterministic `add`, `replace`, `redundant`, and `do-not-add` outcome resolution.
- Approved explanation records and required illustrative-use disclosures.
- Static integrity, resolver, allocation, outcome, and compliance tests.

Phase 1 does not include UI integration, state changes, routing changes, market data, brokerage connectivity, execution, or personalized recommendations.

### Phase 2: interactive Portfolio System Map integration

Phase 2 is explicitly out of scope for this implementation phase. It is expected to include:

- Renaming the existing tab to **Curate this sleeve**.
- A scrollable eligible-security list.
- Security inspection interactions.
- Temporary hypothetical holdings.
- Before/after allocation presentation.
- Sleeve and portfolio-wide assessments.
- Actions controlled by the resolved outcome.

No Phase 2 behavior should be partially introduced during Phase 1.

## 4. Proposed production files

All paths below are proposed additions under `src/domain/portfolio-system/`.

### `security-category-universe.js`

- **Responsibility:** Define the approved 28-category controlled universe and category-level metadata permitted by the specification.
- **Inputs:** Approved category identifiers and descriptions from the attached specification.
- **Outputs:** An immutable category collection and exact category lookup/validation helpers.
- **Must not own:** Securities, sleeve eligibility, outcome rules, allocation math, UI labels, or inferred category associations.
- **Relationship to Increment 0B:** Supplies controlled category identities for existing verified Increment 0B securities without replacing their canonical records or contextual mappings.

### `security-exposure-profiles.js`

- **Responsibility:** Describe the approved static exposure characteristics of canonical securities using controlled vocabularies.
- **Inputs:** Existing canonical security IDs, verified category associations, and approved exposure attributes.
- **Outputs:** Exposure profiles addressable by exact canonical `securityId`.
- **Must not own:** Live prices, yields, performance, rankings, sleeve eligibility, recommendations, or outcome decisions.
- **Relationship to Increment 0B:** Extends the verified 37-security reference layer with approved static exposure evidence while leaving current security reference records intact.

### `sleeve-security-eligibility.js`

- **Responsibility:** Record exact, verified eligibility at the full identity key of `portfolioSystemId + variantId + sleeveId + categoryId + securityId`.
- **Inputs:** Existing portfolio definitions, canonical securities, verified category associations, and approved eligibility decisions.
- **Outputs:** Exact eligibility records and deterministic exact-match lookup behavior.
- **Must not own:** Fallback matching, scoring, allocation math, replacement decisions, inferred eligibility, or copy generation.
- **Relationship to Increment 0B:** Reconciles and preserves the 197 verified contextual mappings as the initial authoritative coverage; expanded candidates remain pending until separately verified.

### `sleeve-security-fit-rules.js`

- **Responsibility:** Define approved deterministic rules for assessing a verified candidate against a target sleeve and the candidate's role within that sleeve.
- **Inputs:** Exact eligibility, security exposure profiles, target-sleeve definitions, and controlled policy vocabularies.
- **Outputs:** Structured sleeve assessment facts used by the portfolio-wide resolver.
- **Must not own:** UI state, generated prose, market-relative judgments, personalized suitability, or portfolio-wide outcome selection.
- **Relationship to Increment 0B:** Uses existing verified mappings as facts; it does not rewrite or delete Increment 0B context fields.

### `security-fit-explanations.js`

- **Responsibility:** Store approved explanation and disclosure copy keyed to deterministic assessment and outcome facts.
- **Inputs:** Approved explanation templates/records, controlled reason identifiers, and the required disclosure.
- **Outputs:** Exact explanation text and disclosure text selected from resolved facts.
- **Must not own:** Eligibility decisions, outcome computation, generated investment rationale, calls to action, or performance language.
- **Relationship to Increment 0B:** May reuse approved existing context copy exactly where applicable, while preserving all Increment 0B domain fields for future experiences.

### `hypothetical-allocation-resolver.js`

- **Responsibility:** Calculate deterministic equal weights for the securities hypothetically held within a sleeve while preserving the sleeve's total portfolio weight.
- **Inputs:** `sleeveWeight` and an ordered collection of canonical `securityIds`.
- **Outputs:** Per-security hypothetical weights, total allocated weight, and the specified empty state.
- **Must not own:** Prices, share counts, trade sizes, eligibility, fit judgments, rounding policy outside the approved contract, or user holdings.
- **Relationship to Increment 0B:** Operates on canonical IDs already established by Increment 0B but does not alter security or context records.

### `security-portfolio-fit-resolver.js`

- **Responsibility:** Orchestrate exact eligibility, target-sleeve assessment, cross-sleeve overlap assessment, equal-weight before/after calculations, deterministic outcome selection, and approved explanation lookup.
- **Inputs:** Exact portfolio-system/variant/sleeve identity, candidate security ID, and hypothetical holdings by sleeve.
- **Outputs:** A complete structured fit result containing assessments, allocations, outcome, any affected replacement ID, explanation, and disclosure.
- **Must not own:** UI actions, persistent user portfolio mutation, live data, brokerage behavior, fuzzy matching, recommendation scoring, or unapproved prose.
- **Relationship to Increment 0B:** Consumes the canonical records and verified contextual mappings through exact IDs; it must preserve their authority and must not modify their data.

## 5. Existing files expected to remain unchanged in Phase 1

The following files are outside the Phase 1 change surface and are expected to remain unchanged:

- `src/features/recommendation/PortfolioMapScreen.js`
- `assets/css/portfolio-map.css`
- `src/domain/portfolio-system/constituent-portfolios.js`
- `src/domain/portfolio-system/portfolio-composer.js`

Quiz, scoring, recommendation, routing, application state, and all user-interface files must also remain unchanged. Existing Increment 0B files should be consumed or referenced without deleting contextual/compliance fields that future interactive-lab screens may need.

## 6. Data-flow design

```text
canonical security reference + candidate universe
                    |
                    v
       verified category associations
                    |
                    v
exact system + variant + sleeve + category + security eligibility
                    |
                    v
 exposure profiles + hypothetical holdings across all sleeves
                    |
                    v
           target-sleeve assessment
                    |
                    v
          portfolio-wide assessment
                    |
                    v
       equal-weight before/after allocation
                    |
                    v
   add | replace | redundant | do-not-add
```

A candidate-universe record is not a resolution-ready security merely because it is listed in the specification. It becomes eligible for resolution only after its canonical identity, issuer evidence, category association, and exact contextual eligibility have the required verified status.

Category membership alone can never authorize an `add` outcome. The resolver must first establish an exact eligibility match for the active portfolio system, variant, target sleeve, category, and security.

Assessment begins with the target sleeve. Once target-sleeve fit is established, the resolver must inspect hypothetical holdings across all sleeves for duplicate identity, exposure overlap, role conflict, or a specifically approved replacement relationship before choosing an outcome.

All calculations and assessments use static approved data. No live or delayed market data is required or permitted in this layer.

## 7. Resolver contracts

The following are interface examples for planning purposes, not implementation code.

### Equal-weight allocation

```js
resolveEqualWeightAllocation({ sleeveWeight, securityIds })
```

Expected behavior:

- Use equal weighting across the supplied canonical security IDs.
- Retain full precision internally.
- Apply deterministic display rounding.
- Preserve the exact sleeve total after deterministic rounding.
- Leave every other sleeve weight unchanged.
- Produce stable results for the same ordered input.
- Reject invalid, duplicate, or non-canonical IDs according to the approved validation contract.
- Return `unallocated-within-hypothetical-portfolio` when the security list is empty.
- Avoid prices, share quantities, trading units, and market-dependent calculations.

### Portfolio fit

```js
resolveSecurityPortfolioFit({
  portfolioSystemId,
  variantId,
  targetSleeveId,
  candidateSecurityId,
  holdingsBySleeve
})
```

The resolver's evaluation sequence must be deterministic:

1. Validate the exact portfolio system, variant, target sleeve, and candidate identities.
2. Load the canonical security and its verified exposure/category data.
3. Require exact eligibility for the full contextual key.
4. Assess the candidate in the target sleeve.
5. Assess identity, exposure, and role across holdings in every sleeve.
6. Calculate equal-weight before/after states for the affected sleeve when an actionable outcome is permitted.
7. Resolve exactly one approved outcome.
8. Select approved explanation and disclosure copy from structured result facts.

The structured output must include:

- The candidate security.
- The exact target context.
- The sleeve assessment.
- The portfolio-wide assessment.
- Before and after allocations when applicable.
- Exactly one outcome.
- The affected replacement security ID when the outcome is `replace`, otherwise `null`.
- An approved explanation.
- The required illustrative-use disclosure.

## 8. Outcome resolution

The resolver must emit one, and only one, of these outcomes:

### Add

The candidate materially improves mandate fulfillment and provides a portfolio-level benefit that justifies another holding. It must also be verified and exactly eligible for the target context, fit the approved target-sleeve role, avoid a replacement rule, and not be materially redundant under approved portfolio-wide rules. The result may include a hypothetical after-allocation that adds the candidate.

### Replace

The candidate performs a required job more coherently than one identified existing holding. It must be verified and exactly eligible, and an approved rule must identify that existing holding in the target context. The result must identify the affected existing security ID and show the deterministic before/after allocation.

### Redundant

The candidate is valid but unnecessary alongside an existing holding performing the same role. The portfolio may contain the same security or sufficiently overlapping approved exposure/role such that adding it would duplicate the intended function. This is distinct from `do-not-add`: it communicates that overlap, rather than failed eligibility or a policy prohibition, is decisive.

### Do not add

The candidate is ineligible or makes the sleeve or full portfolio less coherent. This includes required verification being pending, the exact contextual mapping being absent, failure of an approved sleeve or portfolio rule, or an approved policy explicitly preventing the addition. Pending or unverified records must never resolve to `add` or `replace`.

Additional invariants:

- Category eligibility by itself must never produce `add`.
- Every `replace` result must identify the affected existing security.
- `Redundant` and `do-not-add` must remain semantically and structurally distinct.
- Outcomes must be rule-based; no numeric recommendation or suitability score may be introduced.

## 9. Static-data boundary

Phase 1 includes only approved static data and deterministic transformations:

- Canonical identifiers and issuer/source evidence status.
- Real security names and tickers.
- Issuer or regulatory verification.
- Controlled category associations.
- Stable structural exposure data and controlled exposure attributes.
- Static, version-controlled category and exact sleeve mappings.
- Static sleeve and cross-sleeve fit rules.
- Hypothetical equal-weight calculations based on portfolio definitions.
- Approved explanations and disclosures.

Phase 1 excludes:

- Current prices, NAVs, yields, distributions, returns, volatility, correlations, drawdowns, valuation, market trends, spreads, liquidity, or other market observations.
- Holdings feeds, index composition, analyst opinions, rankings, or external research.
- Brokerage accounts, orders, shares, tax lots, execution, rebalancing, or settlement.
- User-specific finances, suitability determinations, personalized advice, or recommended trades.

Any future market-data layer must be a separate dependency with its own freshness, provenance, failure, and compliance contracts. It must remain separate from system eligibility. Static Phase 1 resolution must remain deterministic and usable without it.

## 10. Proposed tests

All paths below are proposed additions under `tests/`.

### `tests/security-category-universe-test.mjs`

Verify the exact 28-category controlled universe, unique IDs, required fields, stable lookup, and rejection of unknown or duplicate categories.

### `tests/security-exposure-profile-test.mjs`

Verify canonical-ID references, approved controlled-vocabulary values, verified association requirements, source/evidence integrity, and explicit pending states for incomplete expanded candidates.

### `tests/sleeve-security-eligibility-test.mjs`

Verify exact-key eligibility across all 21 systems and 107 sleeves; validate references to systems, variants, sleeves, categories, and securities; preserve the verified Increment 0B mapping baseline; and prove that no cross-system, cross-variant, cross-sleeve, category-only, or fallback match can occur.

### `tests/sleeve-security-fit-rules-test.mjs`

Verify deterministic target-sleeve decisions, controlled rule vocabularies, pending-policy behavior, explicit special-category policies, and the absence of inferred fit decisions.

### `tests/hypothetical-allocation-resolver-test.mjs`

Verify equal weighting, deterministic rounding, preservation of each sleeve total, stable ordering, invalid/duplicate-ID handling, and the `unallocated-within-hypothetical-portfolio` empty state.

### `tests/security-portfolio-fit-resolver-test.mjs`

Verify the required evaluation order, exact contextual identity, target-sleeve-first assessment, all-sleeve overlap checks, before/after integrity, all four outcomes, required replacement IDs, the distinction between redundancy and prohibition, and mandatory `do-not-add` behavior for pending/unverified records.

### `tests/security-fit-compliance-test.mjs`

Verify approved explanations and disclosures, prohibit generated or unmapped copy, and detect buy/sell directives, suitability claims, expected-return or performance claims, downside guarantees, rankings, “best” labels, allocation recommendations, and other prohibited recommendation language.

Together, these tests must cover the complete structural footprint of 7 archetypes × 3 variants = 21 portfolio systems, all 107 current sleeves, the exact 28-category universe, all preserved canonical/mapping records, and every approved resolver outcome.

## 11. Implementation sequence

Future implementation should proceed in this order:

1. Audit existing Increment 0B records.
2. Reconcile the attached candidate list with existing securities.
3. Encode and validate the category universe.
4. Verify candidate security identities and issuer sources.
5. Encode exposure profiles.
6. Encode exact sleeve eligibility.
7. Encode sleeve-fit rules.
8. Implement the equal-weight allocation resolver.
9. Implement the full-portfolio fit resolver.
10. Add outcome explanations and compliance checks.
11. Run complete coverage and regression tests.
12. Stop before any UI integration.

Each step should leave the repository in a testable state and should not silently resolve an outstanding data or policy question.

## 12. Approval gates

The following decisions must be approved before their dependent data or behavior becomes active:

1. **Increment 0B reconciliation:** Confirm the exact preservation and mapping of all 37 canonical securities and 197 contextual records.
2. **Issuer verification:** Verify issuer identity, source URL, and required evidence for every expanded candidate before it can become actionable.
3. **Broad-preference-fund definition:** Approve its category boundaries and eligibility policy.
4. **Selected-equity policy:** Approve whether and how individual selected equities may participate in sleeve eligibility and fit resolution.
5. **Tactical-fund policy:** Approve the permitted roles and constraints for tactical funds.
6. **Income-opportunity boundaries:** Approve the exposure boundaries and sleeve contexts for income-opportunity securities.
7. **Controlled exposure vocabularies:** Approve the complete allowed values and their meanings before exposure profiles use them.
8. **Exact eligibility approval:** Approve every expanded full-key system/variant/sleeve/category/security eligibility mapping.
9. **Explanation-copy approval:** Approve outcome and assessment explanations, including compliance review and the required disclosure.

An unresolved gate must remain explicitly `pending` or `deferred`, as the applicable schema permits. It must never be filled through inference, external substitution, or generated product judgment.

## 13. Phase 1 acceptance criteria

Phase 1 is complete only when:

- The 28-category universe is exact, unique, and validated.
- All approved candidate records are encoded.
- The verified 37-security and 197-context Increment 0B baseline is preserved and reconciled.
- Expanded candidates are either verified through approved evidence and mappings or remain explicitly pending/deferred.
- Eligibility uses only the exact `portfolioSystemId + variantId + sleeveId + categoryId + securityId` key, with no fallback or cross-variant leakage.
- All 21 portfolio systems resolve.
- All 107 sleeve instances are covered or explicitly deferred.
- All references are valid.
- Equal-weight allocation is deterministic, preserves sleeve totals after rounding, and emits the required empty state.
- Portfolio fit evaluates the target sleeve first and then holdings across all sleeves.
- Every assessment produces exactly one supported outcome, and the resolver can deterministically produce all four outcomes with the required structured evidence.
- Pending or unverified records cannot produce `add` or `replace`.
- Every `replace` outcome identifies the affected existing security ID.
- Explanations and disclosures come only from approved static records and pass prohibited-language tests.
- No market data, brokerage, execution, scoring, personalization, or UI dependency has been introduced.
- No UI imports the new modules.
- The complete test suite introduces no new failures.
- The existing Portfolio System Map has no visible or behavioral change.

## 14. Blast-radius guardrails

- Add only the approved Phase 1 domain-data, resolver, and test files when implementation is authorized.
- Preserve existing portfolio definitions, sleeve labels, IDs, categories, weights, canonical security records, contextual metadata, copy, source URLs, and verification statuses unless a separately approved correction explicitly requires a change.
- Do not modify `PortfolioMapScreen.js`, `portfolio-map.css`, `constituent-portfolios.js`, or `portfolio-composer.js` during Phase 1.
- Do not modify quiz, scoring, recommendation, routing, application state, or other UI code.
- Do not modify archetype or variant resolution, routes, navigation, dependencies, build configuration, or application state.
- Do not hardcode individual systems, variants, sleeves, securities, or explanations in a screen.
- Do not introduce permissive fallback matching, inferred mappings, cross-variant resolution, or category-only authorization.
- Do not opportunistically refactor adjacent domain or application code.
- Do not add market-data dependencies, brokerage connectivity, trade execution, security-selection controls, or personalized recommendation behavior.
- Do not stage or commit changes unless separately requested.
- Stop and report any material repository/specification discrepancy or approval-gate conflict before implementation continues.

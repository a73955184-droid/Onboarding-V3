# Phase 2 structural-fit decision contract

Status: frozen product contract  
Scope: specification only; no engine, data, UI, or test behavior is changed by this document  
Repository audit date: 2026-09-01

## 1. Purpose

This document freezes the meaning, prerequisites, and precedence of the structural-fit assessment before the decision engine changes. It distinguishes an assessment that cannot be completed from the four completed outcomes and makes every terminal result mutually exclusive.

The five user-visible results are:

```text
Assessment unavailable
Add
Replace
Redundant
Do not add
```

The existing machine representation remains the compatibility baseline:

| User-visible result | `assessmentStatus` | `outcome` |
| --- | --- | --- |
| Assessment unavailable | `unavailable` | `null` |
| Add | `complete` | `add` |
| Replace | `complete` | `replace` |
| Redundant | `complete` | `redundant` |
| Do not add | `complete` | `do-not-add` |

This is an educational system-fit contract. It does not define personalized suitability, expected return, trading advice, or a buy/sell recommendation.

## 2. Authoritative repository inventory

### 2.1 System variants and constituent sleeves

`src/domain/portfolio-system/constituent-portfolios.js` contains 7 archetypes, each with `essential`, `intentional`, and `engaged` variants: 21 system variants and 107 sleeve instances. Each constituent sleeve defines an exact ID, label, weight, return function, effort, asset-category IDs, review cadence, market-trend tags, initial-allocation flag, description, and optional monitoring guidance.

The complete identity inventory is below. Sleeve IDs are exact, case-sensitive source identifiers; a repeated ID in another system is a different sleeve instance because its system and variant context differs.

| System variant | Name | Count | Exact sleeve IDs |
| --- | --- | ---: | --- |
| `ES-essential` | Essential Effortless Portfolio | 3 | `broadGrowthCore`, `stability`, `liquidity` |
| `ES-intentional` | Intentional Effortless Portfolio | 4 | `usCore`, `internationalCore`, `stability`, `liquidity` |
| `ES-engaged` | Engaged Effortless Portfolio | 5 | `usCore`, `internationalCore`, `stability`, `liquidity`, `personalPreference` |
| `GD-essential` | Essential Global Diversified Portfolio | 3 | `globalEquity`, `globalStability`, `liquidity` |
| `GD-intentional` | Intentional Global Diversified Portfolio | 6 | `usEquity`, `developedInternational`, `emergingMarkets`, `stability`, `inflationResilience`, `liquidity` |
| `GD-engaged` | Engaged Global Diversified Portfolio | 7 | `usEquity`, `developedInternational`, `emergingMarkets`, `smallCapDiversification`, `stability`, `realAssetDiversifier`, `liquidity` |
| `FT-essential` | Essential Systematic Improvement Portfolio | 3 | `durableCore`, `stability`, `targetedImprovement` |
| `FT-intentional` | Intentional Systematic Improvement Portfolio | 6 | `durableCore`, `globalDiversification`, `stability`, `qualityImprovement`, `smallValueImprovement`, `liquidity` |
| `FT-engaged` | Engaged Systematic Improvement Portfolio | 6 | `durableCore`, `globalDiversification`, `stability`, `factorImprovements`, `strategicDiversifier`, `researchCapacity` |
| `BFO-essential` | Essential Balanced Multi-Purpose Portfolio | 3 | `growth`, `stability`, `liquidity` |
| `BFO-intentional` | Intentional Balanced Multi-Purpose Portfolio | 6 | `growth`, `income`, `stability`, `diversifiers`, `liquidity`, `opportunity` |
| `BFO-engaged` | Engaged Balanced Multi-Purpose Portfolio | 7 | `globalGrowth`, `income`, `stability`, `realAssets`, `strategicAlternatives`, `liquidity`, `selectedOpportunities` |
| `GA-essential` | Essential Growth & Alternatives Portfolio | 4 | `growthCore`, `alternativeStrategy`, `stability`, `liquidity` |
| `GA-intentional` | Intentional Growth & Alternatives Portfolio | 6 | `growthCore`, `growthEnhancers`, `realAssets`, `alternativeStrategy`, `stability`, `liquidity` |
| `GA-engaged` | Engaged Growth & Alternatives Portfolio | 7 | `globalGrowthCore`, `structuralGrowth`, `smallEmergingGrowth`, `realAssets`, `alternativeStrategy`, `stability`, `opportunityCapacity` |
| `TO-essential` | Essential Opportunity Portfolio | 3 | `permanentCore`, `stabilityReserve`, `opportunityCapacity` |
| `TO-intentional` | Intentional Opportunity Portfolio | 5 | `permanentCore`, `stabilityReserve`, `tacticalAllocation`, `opportunitySelection`, `liquidity` |
| `TO-engaged` | Engaged Opportunity Portfolio | 6 | `permanentCore`, `stabilityReserve`, `tacticalAllocation`, `thematicOpportunities`, `securitySelection`, `liquidity` |
| `IP-essential` | Essential Income Preservation Portfolio | 4 | `highQualityIncome`, `liquidity`, `measuredGrowth`, `inflationProtection` |
| `IP-intentional` | Intentional Income Preservation Portfolio | 6 | `immediateLiquidity`, `shortDurationIncome`, `coreFixedIncome`, `incomeEquity`, `measuredGrowth`, `inflationProtection` |
| `IP-engaged` | Engaged Income Preservation Portfolio | 7 | `liquidityLadder`, `governmentBonds`, `investmentGradeCredit`, `inflationProtection`, `dividendEquity`, `globalGrowth`, `selectedIncomeOpportunities` |
| **Total** |  | **107** |  |

`src/domain/portfolio-system/portfolio-archetypes.js` separately defines each archetype's invariant and permitted required/optional sleeve ranges. These archetype definitions do not contain all variant-specific IDs above and must not be used as a fallback identity map.

### 2.2 Sleeve philosophy and boundary guidance

`src/domain/portfolio-philosophy/sleeve-philosophies.js` contains exactly 107 philosophy records keyed by archetype, variant, and sleeve ID. Every constituent sleeve has a matching philosophy entry. Each entry supplies a structural `systemRole`, why the sleeve exists, its contribution to the system, governing principles, provenance, and evidence-personalization constraints.

Current role use across the 107 sleeves is:

| System role | Sleeve instances |
| --- | ---: |
| `foundation` | 18 |
| `stability-resilience` | 20 |
| `liquidity-access` | 17 |
| `diversifier` | 19 |
| `bounded-improvement` | 4 |
| `growth-enhancer` | 6 |
| `exploration-research` | 9 |
| `tactical-conditional` | 3 |
| `income` | 7 |
| `inflation-protection` | 4 |
| `required-support` | 0 |
| **Total** | **107** |

`src/domain/investor-system-guidance/sleeve-boundary-guidance.js` defines guidance for all 11 controlled roles, including the currently unused `required-support` role. For each role it defines the investor question, job, return contribution, what belongs, what usually does not belong, redundancy check, relevant signals, irrelevant noise, effort boundary, action boundary, and user-facing summary.

The raw constituent records do not themselves contain `systemRole`. Role and philosophy are joined later by the philosophy resolver/presenter, and `investor-system-guidance-presenter.js` merges role-boundary and effort guidance into the UI-facing sleeve guidance. Phase 2 must therefore use the exact archetype + variant + sleeve join; it must not infer a boundary from an ID, label, category, return function, or another variant.

For this contract:

- **Sleeve alignment** means the candidate has a completed, exact permission for the target system + variant + sleeve and a permitted role in that sleeve.
- **Boundary alignment** means the candidate's proposed use complies with that exact sleeve's philosophy, system role, `whatBelongs`, `whatUsuallyDoesNotBelong`, and action boundary.
- Eligibility and boundary guidance are separate gates. Passing either one does not imply passing the other.

### 2.3 Security data and controlled vocabularies

The Phase 1 security foundation currently consists of:

- 267 canonical entries in `security-reference.js`: 261 have verified metadata/exposure profiles and 6 (`vfmf`, `bndw`, `esgv`, `soxx`, `msft`, `jpm`) receive pending placeholder exposure profiles.
- 261 approved securities in 28 categories in `security-category-universe.js`, with 307 category associations. Browse-universe membership is not a holding, exact sleeve permission, or fit outcome.
- 261 records in `security-metadata.js` and the matching `docs/specs/phase-1-security-metadata-manifest.json`.
- 1,597 exact contextual records in `sleeve-security-eligibility.js`: 173 `eligible` and 1,424 `pending-approval`. Every record is `listed`; none is automatically held.
- The exact eligibility key is `portfolioSystemId + variantId + sleeveId + categoryId + securityId`. No cross-system, cross-variant, label, role, or category fallback is allowed.

Canonical readiness fields are `ticker`, `name`, `issuer`, `securityType`, `sourceUrl`, `verifiedAt`, `activeStatus`, and `verificationStatus`. Exposure fields are `assetClasses`, `geographies`, `marketCaps`, `styles`, `factors`, `sectors`, `durationBand`, `creditQualities`, `incomeRole`, `inflationSensitivity`, `strategyType`, `complexity`, and `evidenceSourceUrls`.

Current metadata vocabulary values are:

| Field | Values present |
| --- | --- |
| `securityType` | `ETF`, `Unit investment trust`, `Commodity trust`, `Exchange-traded commodity pool` |
| `activeStatus` | `active` |
| `evidenceSourceType` | `issuer`, `regulatory` |
| `assetClasses` | `equity`, `real-asset`, `fixed-income`, `commodity`, `multi-asset`, `hybrid-security` |
| `geographies` | `global`, `ex-united-states`, `united-states`, `developed-ex-united-states`, `emerging-markets` |
| `marketCaps` | `large-cap`, `mid-cap`, `small-cap`, or not applicable (`null`) |
| `styles` | `growth`, `value`, or empty |
| `factors` | `dividend`, `quality`, `multi-factor`, `value`, `size`, or empty |
| `sectors` | `technology`, `health-care`, `financials`, `consumer-discretionary`, `consumer-staples`, `energy`, `industrials`, `materials`, `utilities`, `real-estate`, `communication-services`, or not applicable |
| `durationBand` | `broad`, `intermediate`, `short`, `long`, `ultra-short`, or not applicable |
| `creditQualities` | `investment-grade`, `government`, `mixed`, `below-investment-grade`, or not applicable |
| `incomeRole` | `none`, `supporting`, `primary` |
| `inflationSensitivity` | `none`, `indirect`, `explicit` |
| `strategyType` | `broad-equity`, `style-equity`, `income-equity`, `systematic-factor`, `sector-equity`, `thematic-equity`, `fixed-income`, `real-asset`, `alternative-strategy`, `income-strategy` |
| `complexity` | `low`, `moderate`, `high` |

The 28 category IDs are:

```text
global-equity, broad-us-equity, broad-international-equity,
developed-international-equity, emerging-market-equity, small-cap-equity,
growth-oriented-equity, income-equity, diversified-factor-equity,
quality-factor-equity, value-factor-equity, small-value-equity, style-equity,
sector-equity, thematic-equity, high-quality-bonds, government-bonds,
short-government-securities, short-duration-bonds, investment-grade-credit,
inflation-protected-bonds, cash-equivalent, real-assets, alternative-strategy,
tactical-fund, broad-preference-fund, selected-equity, income-opportunity
```

`tactical-fund`, `broad-preference-fund`, and `selected-equity` currently have empty approved universes. Empty, pending, unknown, and not-applicable are distinct states and must not be silently converted into one another.

### 2.4 Current readiness and eligibility contracts

`security-assessment-readiness.js` dynamically requires the canonical fields and base exposure fields for the candidate and every hypothetical holding. It also requires any comparison field that is populated for at least one security in that comparison. It returns either `ready: true` or a candidate/holdings subject with exact missing fields.

`security-portfolio-fit-resolver.js` currently returns Assessment unavailable for:

- an unresolved system/variant or target sleeve (`unresolved-sleeve`);
- a non-string or unknown candidate (`unknown-security`);
- incomplete candidate metadata/profile (`incomplete-security-profile`);
- incomplete holding metadata/profile (`missing-holdings-profile`); or
- no exact `eligible` record (`unresolved-sleeve` plus `exactEligibility` as a missing field).

The resolver throws, rather than returning a result, for malformed `holdingsBySleeve`, unknown holding sleeve IDs, non-array holding lists, non-string holding IDs, or duplicate IDs within one sleeve. That input-validation behavior is outside the five-result product vocabulary and remains an API precondition.

`sleeve-security-eligibility-resolver.js` is a browse resolver. It returns listed contextual records, including their eligibility status, but does not assess fit and does not make them holdings.

### 2.5 Current four-outcome resolver

After readiness and exact eligibility, `sleeve-security-fit-rules.js` currently applies this sequence:

1. same security anywhere in holdings -> `redundant` / `duplicate-security`;
2. same-category holding in the target sleeve with greater complexity -> `replace` / `lower-effort-role-replacement`;
3. otherwise, same-category holding in the target sleeve -> `redundant` / `existing-role-sufficient`;
4. same-category holding only in another sleeve -> `do-not-add` / `cross-sleeve-role-conflict`;
5. otherwise -> `add` / `fills-missing-role`.

“Role” is currently approximated by category intersection. The current fit resolver does not consume sleeve philosophy, role-boundary guidance, `whatBelongs`, `whatUsuallyDoesNotBelong`, or an independently represented missing-role requirement. Replacement advantage is currently only lower `complexity`. These are current-state facts, not the frozen Phase 2 semantics below.

### 2.6 Current UI presentation

`src/features/recommendation/PortfolioMapScreen.js` presents **Curate this sleeve** and:

- browses exact contextual security records by sleeve and category;
- lets the user search by name/ticker, inspect identity/category/source, and mark temporary hypothetical holdings;
- does not run fit merely on selection; **Assess fit** calls the portfolio-fit resolver with the complete hypothetical holdings map;
- displays Assessment unavailable without exposing internal missing fields or reason codes;
- displays completed results as **Add**, **Replace [ticker]**, **Redundant with [ticker]**, or **Do not add**;
- offers add, replacement preview/confirmation, save-as-alternative, or return-to-browser actions respectively;
- displays sleeve effect, full-portfolio effect, effort, before/after equal-weight allocation, primary reason, and the educational disclosure.

The UI is a consumer, not a decision owner. Phase 2 must not recreate precedence or outcome logic in presentation code.

### 2.7 Existing tests

There are 35 `*test.mjs` files. All 35 passed during this audit. The security-decision surface is directly covered by:

- `security-category-universe-test.mjs`
- `security-exposure-profile-test.mjs`
- `sleeve-security-eligibility-test.mjs`
- `sleeve-security-eligibility-resolver-test.mjs`
- `sleeve-security-fit-rules-test.mjs`
- `security-portfolio-fit-resolver-test.mjs`
- `security-fit-compliance-test.mjs`
- `hypothetical-allocation-resolver-test.mjs`
- `portfolio-curation-session-test.mjs`
- `portfolio-curation-screen-test.mjs`
- the example-security reference, context, coverage, resolver, and compliance tests
- the portfolio philosophy, job-fit, guidance, map, and smoke tests that protect the 21/107 identities and presentation joins.

The `npm test` script runs only six files (`verify-copy.mjs`, `smoke-test.mjs`, `investor-jobs-test.mjs`, `portfolio-map-test.mjs`, `investor-need-traceability-copy-test.mjs`, and `recommendation-explainability-test.mjs`). It does not currently run the direct security-fit tests. This is an audit observation only; this task does not change the script.

## 3. Frozen decision semantics

### 3.1 Assessment unavailable

**Meaning:** no structural-fit conclusion was reached because one or more facts required by a higher-precedence gate are absent, unknown, pending, unresolved, stale, or internally inconsistent.

Required behavior:

- `assessmentStatus` is `unavailable` and `outcome` is `null`.
- No positive or negative fit conclusion may be implied.
- No before/after allocation, replacement target, outcome explanation, or action may be fabricated.
- The result identifies a stable unavailability reason and machine-readable missing subjects/fields for diagnostics, even if the UI intentionally shows only bounded copy.
- Incomplete candidate metadata remains unavailable.
- Incomplete decision-relevant metadata for any compared holding remains unavailable.
- A candidate absent from the canonical security reference remains unavailable.
- A pending or absent exact sleeve mapping remains unavailable. Absence of permission is not proof of a completed conflict.
- An unresolved target sleeve, sleeve role, or boundary rule remains unavailable.

Unavailable is not a fifth completed outcome and must never be used as a softer synonym for Do not add.

### 3.2 Add

**Meaning:** the completed assessment establishes that the candidate fills a specific, currently missing, permitted role in the target sleeve without violating a higher-precedence rule.

Add requires all of the following:

- readiness is complete for candidate, relevant holdings, and decision inputs;
- exact sleeve alignment is affirmative;
- the proposed use aligns with the exact sleeve boundary;
- the candidate is not already held anywhere;
- no same-sleeve overlap makes it redundant or supports a replacement;
- no cross-sleeve role conflict exists; and
- a named permitted role is demonstrably missing and the candidate contributes that role.

The output must identify the missing role, the evidence that it is permitted in the target sleeve, and the candidate's contribution. Category membership, browse listing, or an exact eligibility record alone cannot produce Add. An empty target sleeve does not by itself prove that a permitted role is missing.

### 3.3 Replace

**Meaning:** the completed assessment identifies one specific existing holding whose target-sleeve role would be preserved or improved by substituting the candidate, and it establishes an explainable structural advantage.

Replace requires all of the following:

- every Add prerequisite through boundary alignment is satisfied;
- `affectedSecurityId` identifies exactly one holding actually present in the target sleeve;
- candidate and affected holding serve the same required/permitted sleeve role, so removal does not create an unfilled required role;
- the candidate has at least one explicit, evidence-backed structural advantage under an approved comparison rule;
- no material structural disadvantage or higher-precedence conflict defeats that advantage; and
- the hypothetical after-state removes that holding and adds the candidate without increasing holding count.

An explainable structural advantage must be expressed as structured facts and a stable reason code, such as better exact mandate coverage, better boundary coherence, removal of a documented role conflict, reduced unnecessary complexity/effort, or improved structural diversification. Category equality, issuer preference, recent performance, expected outperformance, unsupported “better” language, or lower complexity by itself without relevance to the sleeve mandate is insufficient.

If no specific present holding can be named, Replace is impossible. If same-sleeve overlap exists but no approved structural advantage is established, the result is Redundant, not Replace.

### 3.4 Redundant

**Meaning:** the completed assessment finds the candidate valid and non-conflicting, but unnecessary because its structural contribution is already present or it supplies no missing permitted role.

Redundant applies when:

- the exact same security is already held in any sleeve; or
- a target-sleeve holding already supplies the same role/exposure and no valid replacement advantage is established; or
- all higher gates pass, no conflict exists, but the candidate does not fill a missing permitted role.

The same security already held is always Redundant once readiness, sleeve alignment, and boundary alignment have completed. The result must identify the overlapping holding(s) or the already-satisfied role where applicable. Redundant leaves holdings and allocation unchanged. It means “valid but unnecessary,” not “prohibited” or “unknown.”

### 3.5 Do not add

**Meaning:** the assessment completed with sufficient facts and established a rule-based structural conflict or prohibition.

Do not add applies when a completed rule establishes one of the following:

- the candidate is explicitly not permitted for the exact target sleeve;
- the candidate's proposed use conflicts with the sleeve mandate or role boundary;
- the candidate belongs to another sleeve role and adding it here would blur a completed cross-sleeve boundary;
- the candidate would create a documented prohibited concentration, role collision, or other approved structural harm; or
- another explicit completed policy rule prohibits the addition.

A completed sleeve-rule conflict can and must produce Do not add. The result must identify the violated rule/boundary and evidence. Pending approval, absent metadata, an unknown security, or an unresolved rule cannot produce Do not add; those cases remain Assessment unavailable. Do not add leaves holdings and allocation unchanged.

## 4. Frozen precedence

The resolver must evaluate gates in this exact order and stop at the first terminal result. Later evidence cannot override an earlier terminal result.

```text
Readiness
-> Sleeve alignment
-> Boundary alignment
-> Exact duplicate
-> Same-sleeve overlap
-> Cross-sleeve conflict
-> Missing-role contribution
```

| Precedence | Gate | Terminal result | Continue when |
| ---: | --- | --- | --- |
| 1 | Readiness | Any required fact/context missing, unknown, pending, or inconsistent -> **Assessment unavailable** | All decision-relevant facts are complete |
| 2 | Sleeve alignment | Mapping/rule unresolved -> **Assessment unavailable**; completed explicit non-permission/conflict -> **Do not add** | Exact permission and candidate role are affirmative |
| 3 | Boundary alignment | Boundary unresolved -> **Assessment unavailable**; completed boundary violation -> **Do not add** | Proposed use complies with the exact sleeve boundary |
| 4 | Exact duplicate | Same `securityId` already held anywhere -> **Redundant** | Candidate is not already held |
| 5 | Same-sleeve overlap | Approved structural advantage over one named target-sleeve holding -> **Replace**; otherwise role/exposure already sufficient -> **Redundant** | No decisive target-sleeve overlap |
| 6 | Cross-sleeve conflict | Completed role/boundary collision in another sleeve -> **Do not add** | No cross-sleeve conflict |
| 7 | Missing-role contribution | Named permitted role is missing and candidate supplies it -> **Add**; otherwise -> **Redundant** | Terminal gate |

Consequences of the ordering:

- Readiness is evaluated before duplicate detection. An incomplete or unknown record cannot be called redundant merely because an input string resembles a held ID.
- Sleeve and boundary alignment precede duplicate detection. The engine does not bless an otherwise unresolved or prohibited candidate by labeling it redundant.
- Exact duplicate precedes overlap and conflict. Once the same valid security is already held, its decisive meaning is Redundant.
- Same-sleeve overlap precedes cross-sleeve conflict so a target-sleeve replacement/redundancy decision is not displaced by less-direct overlap elsewhere.
- Add is possible only at the last gate. It is never a default result for “no overlap found.”

## 5. Required decision facts and output contract

### 5.1 Required input facts

A completed assessment requires:

- exact `portfolioSystemId`, `variantId`, and `targetSleeveId` resolving to one of the 107 source sleeve instances;
- canonical `candidateSecurityId`;
- the full hypothetical `holdingsBySleeve` state for that resolved system;
- complete decision-relevant candidate and holding metadata/exposure profiles;
- an exact sleeve-alignment record with a completed status and named permitted role;
- the exact sleeve philosophy/system role and boundary guidance;
- approved overlap, conflict, missing-role, and replacement-advantage rules with sufficient facts to evaluate them.

No label similarity, category-only inference, another variant's rule, another sleeve's boundary, or implicit default may fill a missing fact.

### 5.2 Common output invariants

Every result must include the normalized input identity and one stable primary reason. Completed results must additionally include:

- `assessmentStatus: "complete"`;
- exactly one four-outcome value;
- structured gate facts showing why every earlier gate passed;
- `reasonCodes` using approved controlled values;
- sleeve and portfolio effects derived from those facts;
- unchanged before/after allocations for Redundant and Do not add;
- a deterministic affected-sleeve after-state for Add and Replace; and
- the existing educational disclosure.

Replace must have one non-null `affectedSecurityId`; the other three completed outcomes must not claim a replacement target. Add must have at least one `missingRolesFilled` entry. Redundant and Do not add must have none.

User-facing explanations must describe the decisive gate, not a lower-precedence observation. Internal diagnostics may retain non-decisive observations but must label them as such.

## 6. Product decisions frozen by this contract

The following are normative and may not be weakened by implementation:

1. Incomplete metadata remains Assessment unavailable.
2. An unknown security remains Assessment unavailable.
3. The same security already held is Redundant, subject to the higher readiness/alignment gates.
4. A completed sleeve-rule conflict can produce Do not add.
5. Replace requires a specific existing holding in the target sleeve.
6. Replace requires an explainable, evidence-backed structural advantage.
7. Add requires a missing permitted role.
8. Category membership alone cannot produce Add.

## 7. Current-to-frozen gap register

This register prevents the audit from being mistaken for an implementation claim.

| Area | Current behavior | Frozen requirement |
| --- | --- | --- |
| Readiness | Candidate and holdings metadata/profile readiness; unknown candidate unavailable | Preserve; extend to any new boundary/rule facts needed for a completed decision |
| Exact eligibility | Only exact `eligible` continues; missing/pending becomes unavailable | Preserve exact matching; distinguish unresolved/pending from a completed explicit conflict |
| Sleeve role | Category intersection stands in for role | Use a named permitted role from exact sleeve alignment |
| Boundary alignment | Not evaluated by fit resolver | Required before duplicate/overlap decisions |
| Duplicate | Same ID anywhere -> Redundant | Preserve after the higher readiness/alignment gates |
| Same-sleeve overlap | Same category; lower complexity triggers Replace | Require structural overlap plus one named holding and an approved, relevant structural advantage |
| Cross-sleeve conflict | Same category in another sleeve -> Do not add | Require a completed role/boundary conflict; category intersection alone is insufficient |
| Add | Default after no category overlap | Only when a named permitted role is demonstrably missing and supplied |
| Redundant | Duplicate or same-category target-sleeve role | Also the terminal completed result when aligned/non-conflicting but no permitted role is missing |
| UI | Presents unavailable and four completed outcomes | Continue as a pure consumer of resolver facts and decisive explanation |
| Test command | Direct fit tests exist but are outside `npm test` | Future implementation should protect the frozen precedence and all five results in the default verification path |

## 8. Required acceptance matrix for the later implementation

The later engine change is not conformant unless tests establish at least these cases:

| Scenario | Required result |
| --- | --- |
| Unknown candidate | Assessment unavailable |
| Incomplete candidate profile | Assessment unavailable |
| Incomplete compared holding profile | Assessment unavailable |
| Pending/absent exact sleeve mapping | Assessment unavailable |
| Unresolved sleeve boundary | Assessment unavailable |
| Completed explicit sleeve non-permission | Do not add |
| Completed sleeve-boundary conflict | Do not add |
| Same valid security already held in target sleeve | Redundant |
| Same valid security already held in another sleeve | Redundant |
| Same-sleeve overlap with no approved advantage | Redundant |
| Same-sleeve overlap with a named holding and approved structural advantage | Replace that holding |
| Claimed replacement without a present target | Never Replace |
| Cross-sleeve category similarity without proven role conflict | Not Do not add on that fact alone |
| Completed cross-sleeve role conflict | Do not add |
| Category membership with no proven missing role | Not Add; Redundant if otherwise complete and non-conflicting |
| Exact eligibility with no proven missing role | Not Add; Redundant if otherwise complete and non-conflicting |
| Proven missing permitted role, with all higher gates passing | Add |
| Redundant or Do not add | Allocation unchanged |
| Add | Candidate added only to target sleeve and target sleeve deterministically reweighted |
| Replace | One present target holding removed, candidate inserted, holding count unchanged |

Tests must also prove the exact precedence with compound cases, including incomplete + duplicate, boundary conflict + duplicate, exact duplicate + cross-sleeve overlap, same-sleeve overlap + cross-sleeve conflict, and cross-sleeve conflict + missing-role contribution.

## 9. Source map

The audit and contract are grounded in these repository sources:

- System and sleeve definitions: `src/domain/portfolio-system/constituent-portfolios.js`, `portfolio-archetypes.js`, `asset-catalog.js`
- Sleeve philosophy and guidance: `src/domain/portfolio-philosophy/sleeve-philosophies.js`, `philosophy-constants.js`, `portfolio-job-fit-resolver.js`, `portfolio-job-fit-presenter.js`; `src/domain/investor-system-guidance/sleeve-boundary-guidance.js`, `effort-return-guidance.js`, `investor-system-guidance-presenter.js`
- Security identity, categories, metadata, and profiles: `src/domain/portfolio-system/security-reference.js`, `security-category-universe.js`, `security-metadata.js`, `security-exposure-profiles.js`, `security-fit-constants.js`; `docs/specs/phase-1-security-metadata-manifest.json`
- Eligibility and readiness: `src/domain/portfolio-system/sleeve-security-eligibility.js`, `sleeve-security-eligibility-resolver.js`, `security-assessment-readiness.js`
- Fit decisions and explanations: `src/domain/portfolio-system/sleeve-security-fit-rules.js`, `security-portfolio-fit-resolver.js`, `security-fit-explanations.js`, `hypothetical-allocation-resolver.js`
- Current UI and temporary holdings state: `src/features/recommendation/PortfolioMapScreen.js`, `src/features/recommendation/portfolio-curation-session.js`
- Existing verification: `tests/`, especially the files listed in section 2.7
- Prior Phase 1 intent, used only as historical context where code agrees: `docs/specs/AaronBux_Phase1_Securities_Data_Spec.md`, `docs/specs/phase-1-securities-implementation-plan.md`

Where a prior specification and executable code differ, section 2 records executable current behavior and sections 3–8 define the newly frozen normative contract.

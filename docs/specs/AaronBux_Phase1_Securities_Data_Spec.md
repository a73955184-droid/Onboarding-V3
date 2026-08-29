# AaronBux Phase 1 Securities Data Specification

Version: 0.1 candidate specification  
Date: 2026-08-28  
Scope: Domain data and deterministic decision engine only; no Portfolio Map UI changes

## 1. Purpose

Phase 1 creates the source-data foundation required for a later `Curate this sleeve` interaction. It must let the application:

1. Resolve a real, curated security universe by AaronBux asset category.
2. Filter that universe for an exact portfolio archetype, variant, and sleeve.
3. Describe each security through stable structural exposures rather than current performance.
4. Compare a candidate first with its target sleeve and then with the full hypothetical portfolio.
5. Resolve exactly one system-fit outcome: `add`, `replace`, `redundant`, or `do-not-add`.

This phase does not use prices, returns, volatility, correlations, yields, market trends, brokerage holdings, or trade execution.

## 2. Authority and data status

The current Increment 0B catalogue remains authoritative for its existing 37 securities and 197 contextual mappings. It must be imported and preserved before this specification is encoded.

The expanded ticker universe in Section 7 is a **candidate seed list**, not a verified production list. Every candidate starts as `pending`. A record becomes `verified` only after its current name, ticker, product status, exposure, and issuer source are confirmed.

Codex must not:

- invent additional securities;
- silently replace or delete an Increment 0B record;
- infer exposure attributes from a ticker or fund name;
- promote a pending record to verified;
- manufacture a source URL;
- infer sleeve eligibility from category membership alone;
- use recent performance to classify a security;
- rewrite approved fit explanations during implementation.

## 3. Supported security types

| Security type | Phase 1 status | Notes |
|---|---|---|
| Exchange-traded funds | Included | Primary Phase 1 universe |
| Exchange-traded commodity products/trusts | Conditionally included | Only for an explicitly permitted real-asset or commodity role |
| Mutual funds | Deferred | Share-class and minimum-investment normalization required |
| Individual equities | Conditionally included | Only for `selected-equity`; requires a separate approved universe |
| Individual Treasury securities | Deferred | Requires maturity, ladder, and purchase-unit logic |
| Individual corporate/municipal bonds | Deferred | Requires credit, maturity, call, and liquidity handling |
| Leveraged/inverse/single-stock ETFs | Excluded by default | Can be admitted only through a separately approved tactical policy |

## 4. Canonical security record

```js
{
  securityId: "avuv",
  ticker: "AVUV",
  name: "Avantis U.S. Small Cap Value ETF",
  issuer: "Avantis Investors",
  securityType: "ETF",
  sourceUrl: null,
  verificationStatus: "pending",
  verifiedAt: null,
  activeStatus: "unknown"
}
```

Required invariants:

- `securityId` is unique, stable, lowercase, and independent of display name.
- `ticker` is unique among active records unless an explicit exception is documented.
- `verificationStatus` is one of `verified`, `pending`, or `rejected`.
- A verified record requires non-null `sourceUrl` and `verifiedAt`.
- A rejected record cannot appear in any eligible-security result.
- Product identity is stored once; system-specific reasoning belongs in contextual mappings.

## 5. Security exposure profile

```js
{
  securityId: "avuv",
  assetClasses: ["equity"],
  geographies: ["united-states"],
  marketCaps: ["small-cap"],
  styles: ["value"],
  factors: ["size", "value"],
  sectors: [],
  durationBand: null,
  creditQualities: [],
  incomeRole: "secondary",
  inflationSensitivity: "low",
  strategyType: "systematic-factor",
  complexity: "moderate",
  evidenceSourceUrls: [],
  verificationStatus: "pending"
}
```

Allowed dimensions must be controlled vocabularies. Empty and unknown are different: `[]` means verified absence; `null` means not applicable; `"unknown"` means not yet verified.

## 6. Existing AaronBux asset categories

The implementation must reuse these 28 category IDs from `CONSTITUENT_PORTFOLIOS`:

1. `global-equity`
2. `high-quality-bonds`
3. `cash-equivalent`
4. `broad-us-equity`
5. `broad-international-equity`
6. `developed-international-equity`
7. `emerging-market-equity`
8. `broad-preference-fund`
9. `inflation-protected-bonds`
10. `real-assets`
11. `small-cap-equity`
12. `diversified-factor-equity`
13. `quality-factor-equity`
14. `small-value-equity`
15. `value-factor-equity`
16. `selected-equity`
17. `thematic-equity`
18. `income-equity`
19. `government-bonds`
20. `investment-grade-credit`
21. `alternative-strategy`
22. `growth-oriented-equity`
23. `sector-equity`
24. `style-equity`
25. `tactical-fund`
26. `short-duration-bonds`
27. `short-government-securities`
28. `income-opportunity`

`broad-preference-fund`, `selected-equity`, `tactical-fund`, and `income-opportunity` require explicit product-policy definitions before their expanded universes can be considered complete.

## 7. Candidate category universe

These are candidate tickers for verification and classification. They are not recommendations, approved holdings, or automatically eligible for every sleeve using that category.

| Category | Target verified breadth | Candidate seed tickers |
|---|---:|---|
| `global-equity` | 15–25 | VT, ACWI, SPGM, IOO, URTH, VEU, CWI |
| `broad-us-equity` | 20–30 | VTI, ITOT, SCHB, SPTM, IWV, VONE, VV, SCHX, IWB, SPY, IVV, VOO, SPYM |
| `broad-international-equity` | 15–25 | VXUS, IXUS, VEU, ACWX, CWI, SCHF, SPDW, VEA, IEFA |
| `developed-international-equity` | 12–20 | VEA, IEFA, SCHF, SPDW, EFA, IDEV, FNDF, EFV, EFG |
| `emerging-market-equity` | 15–25 | VWO, IEMG, EEM, SCHE, SPEM, EMXC, FNDE, DGS, DEM, AVEM |
| `small-cap-equity` | 15–25 | VB, IJR, IWM, SCHA, SPSM, VTWO, VIOO, ISCB, FNDA |
| `growth-oriented-equity` | 20–30 | VUG, SCHG, IWF, SPYG, IVW, VOOG, MGK, QQQM, QQQ, IUSG, VONG |
| `income-equity` | 20–30 | SCHD, VYM, HDV, DGRO, DVY, SDY, NOBL, DGRW, SPYD, FDVV, VIG |
| `diversified-factor-equity` | 20–30 | DYNF, LRGF, GSLC, FNDX, FNDB, JPME, OMFL, ROUS, DEUS, AVUS |
| `quality-factor-equity` | 12–20 | QUAL, SPHQ, JQUA, DGRW, QGRO, OUSA, QDF, FQAL |
| `value-factor-equity` | 15–25 | VTV, IWD, IUSV, SCHV, SPYV, RPV, VLUE, AVLV, FVAL, DFLV |
| `small-value-equity` | 10–18 | AVUV, VBR, IJS, SLYV, VIOV, DFSV, ISCV, RWJ |
| `style-equity` | 30–50 | VUG, VTV, VO, VB, IWF, IWD, IWP, IWS, IWO, IWN, SCHG, SCHV, SCHM, SCHA, SPYG, SPYV |
| `sector-equity` | 40–70 | XLK, XLV, XLF, XLY, XLP, XLE, XLI, XLB, XLU, XLRE, XLC, VGT, VHT, VFH, VCR, VDC, VDE, VIS, VAW, VPU, VNQ, IYW, IYH, IYF, IYC, IYK, IYE, IYJ, IYM, IDU |
| `thematic-equity` | 30–50 | ARKK, BOTZ, ROBO, ARTY, AIQ, CIBR, HACK, ICLN, TAN, FAN, PBW, DRIV, IDRV, LIT, CLOU, FINX, GNOM, PAVE, IFRA, SKYY |
| `high-quality-bonds` | 20–30 | BND, AGG, SCHZ, IUSB, GOVT, BIV, IEF, VGIT, VCSH, VCIT, LQD, MBB, BNDX |
| `government-bonds` | 20–30 | GOVT, SHY, IEI, IEF, TLH, TLT, VGSH, VGIT, VGLT, SCHO, SCHR, EDV, ZROZ |
| `short-government-securities` | 12–20 | SGOV, BIL, SHV, VGSH, SCHO, SHY, GBIL, TBIL, CLIP, USFR, TFLO |
| `short-duration-bonds` | 20–30 | BSV, SPSB, VCSH, IGSB, SHY, VGSH, SCHO, JPST, MINT, NEAR, FLOT, FLRN, ICSH |
| `investment-grade-credit` | 20–30 | LQD, VCIT, VCSH, IGSB, IGIB, IGLB, SPIB, SPLB, USIG, CORP, QLTA |
| `inflation-protected-bonds` | 8–15 | TIP, SCHP, VTIP, STIP, SPIP, LTPZ, RINF, IVOL |
| `cash-equivalent` | 12–20 | SGOV, BIL, SHV, USFR, TFLO, TBIL, GBIL, CLIP, JPST, MINT, ICSH |
| `real-assets` | 25–40 | VNQ, SCHH, USRT, IYR, XLRE, REET, GLDM, IAU, GLD, SGOL, PDBC, DBC, COMT, GSG, PAVE, IFRA, IGF, RWO |
| `alternative-strategy` | 20–35 | DBMF, KMLM, CTA, FMF, QAI, BTAL, MNA, RPAR, AOA, AOR, AOM, AOK, NTSX, SWAN |
| `tactical-fund` | Deferred pending policy | No universal candidate is approved; tactical eligibility requires an explicit thesis and holding-period policy |
| `broad-preference-fund` | Deferred pending definition | Category meaning must be clarified before candidates are admitted |
| `selected-equity` | Deferred to a separate equity universe | Do not import all listed stocks automatically |
| `income-opportunity` | 20–35 after policy | PFF, PGX, VRP, PFFD, HYLB, HYG, JNK, ANGL, FALN, BKLN, SRLN, JEPI, JEPQ, DIVO |

Candidate-count tests must count unique `securityId` values after deduplication, not category associations.

## 8. Category mapping record

```js
{
  securityId: "avuv",
  categoryId: "small-value-equity",
  mappingType: "primary",
  classificationReason:
    "Issuer-stated strategy targets U.S. small-cap companies with value characteristics.",
  sourceUrl: null,
  verificationStatus: "pending"
}
```

A security may map to multiple categories, but every association requires its own evidence and status. Multi-category mapping does not automatically make the security eligible for every sleeve using either category.

## 9. Exact sleeve-eligibility record

```js
{
  portfolioSystemId: "FT",
  variantId: "intentional",
  sleeveId: "smallValueImprovement",
  categoryId: "small-value-equity",
  securityId: "avuv",
  eligibilityStatus: "eligible",
  sleeveRole: "small-value-return-driver",
  whyItCanBelong:
    "Provides an explicit small-cap value implementation permitted by this sleeve.",
  sourceRecordIds: ["avuv", "avuv-small-value-equity"]
}
```

Required matching key:

```text
portfolioSystemId + variantId + sleeveId + categoryId + securityId
```

No fallback by label similarity, category alone, archetype alone, or another variant is permitted.

## 10. System and sleeve category manifest

This manifest is derived from `CONSTITUENT_PORTFOLIOS` and remains read-only input to Phase 1.

| System | Sleeve | Weight | Categories |
|---|---|---:|---|
| ES essential | Broad Growth Core | 70% | global-equity |
| ES essential | Stability | 20% | high-quality-bonds |
| ES essential | Liquidity | 10% | cash-equivalent |
| ES intentional | US Core | 45% | broad-us-equity |
| ES intentional | International Core | 25% | broad-international-equity |
| ES intentional | Stability | 20% | high-quality-bonds |
| ES intentional | Liquidity | 10% | cash-equivalent |
| ES engaged | US Core | 40% | broad-us-equity |
| ES engaged | International Core | 25% | developed-international-equity; emerging-market-equity |
| ES engaged | Stability | 20% | high-quality-bonds |
| ES engaged | Liquidity | 10% | cash-equivalent |
| ES engaged | Personal Preference | 5% | broad-preference-fund |
| GD essential | Global Equity | 70% | global-equity |
| GD essential | Global Stability | 20% | high-quality-bonds |
| GD essential | Liquidity | 10% | cash-equivalent |
| GD intentional | US Equity | 35% | broad-us-equity |
| GD intentional | Developed International | 25% | developed-international-equity |
| GD intentional | Emerging Markets | 10% | emerging-market-equity |
| GD intentional | Stability | 20% | high-quality-bonds |
| GD intentional | Inflation Resilience | 5% | inflation-protected-bonds; real-assets |
| GD intentional | Liquidity | 5% | cash-equivalent |
| GD engaged | US Equity | 30% | broad-us-equity |
| GD engaged | Developed International | 20% | developed-international-equity |
| GD engaged | Emerging Markets | 10% | emerging-market-equity |
| GD engaged | Small-Cap Diversification | 10% | small-cap-equity |
| GD engaged | Stability | 15% | high-quality-bonds |
| GD engaged | Real-Asset Diversifier | 10% | real-assets |
| GD engaged | Liquidity | 5% | cash-equivalent |
| FT essential | Durable Core | 70% | global-equity |
| FT essential | Stability | 20% | high-quality-bonds |
| FT essential | Targeted Improvement | 10% | diversified-factor-equity |
| FT intentional | Durable Core | 40% | broad-us-equity |
| FT intentional | Global Diversification | 20% | broad-international-equity |
| FT intentional | Stability | 15% | high-quality-bonds |
| FT intentional | Quality Improvement | 10% | quality-factor-equity |
| FT intentional | Small-Value Improvement | 10% | small-value-equity |
| FT intentional | Liquidity | 5% | cash-equivalent |
| FT engaged | Durable Core | 45% | broad-us-equity; global-equity |
| FT engaged | Global Diversification | 15% | broad-international-equity |
| FT engaged | Stability | 10% | high-quality-bonds |
| FT engaged | Factor Improvements | 15% | quality-factor-equity; value-factor-equity; small-value-equity |
| FT engaged | Strategic Diversifier | 10% | real-assets |
| FT engaged | Research Capacity | 5% | selected-equity; thematic-equity |
| BFO essential | Growth | 55% | global-equity |
| BFO essential | Stability | 30% | high-quality-bonds |
| BFO essential | Liquidity | 15% | cash-equivalent |
| BFO intentional | Growth | 40% | broad-us-equity; broad-international-equity |
| BFO intentional | Income | 20% | high-quality-bonds; income-equity |
| BFO intentional | Stability | 15% | government-bonds |
| BFO intentional | Diversifiers | 10% | real-assets; inflation-protected-bonds |
| BFO intentional | Liquidity | 10% | cash-equivalent |
| BFO intentional | Selected Opportunities | 5% | selected-equity; thematic-equity |
| BFO engaged | Global Growth | 35% | broad-us-equity; developed-international-equity; emerging-market-equity |
| BFO engaged | Income | 15% | investment-grade-credit; income-equity |
| BFO engaged | Stability | 15% | government-bonds |
| BFO engaged | Real Assets | 10% | real-assets |
| BFO engaged | Strategic Alternatives | 10% | alternative-strategy |
| BFO engaged | Liquidity | 10% | cash-equivalent |
| BFO engaged | Selected Opportunities | 5% | selected-equity; thematic-equity |
| GA essential | Broad Growth Core | 70% | global-equity |
| GA essential | Diversified Alternatives | 15% | real-assets; alternative-strategy |
| GA essential | Stability | 10% | high-quality-bonds |
| GA essential | Liquidity | 5% | cash-equivalent |
| GA intentional | Broad Growth Core | 50% | broad-us-equity; broad-international-equity |
| GA intentional | Growth Enhancers | 15% | small-cap-equity; growth-oriented-equity |
| GA intentional | Real Assets | 10% | real-assets |
| GA intentional | Alternative Strategy | 10% | alternative-strategy |
| GA intentional | Stability | 10% | government-bonds |
| GA intentional | Liquidity | 5% | cash-equivalent |
| GA engaged | Global Growth Core | 40% | broad-us-equity; broad-international-equity |
| GA engaged | Structural Growth | 15% | thematic-equity; growth-oriented-equity |
| GA engaged | Small & Emerging Growth | 10% | small-cap-equity; emerging-market-equity |
| GA engaged | Real Assets | 10% | real-assets |
| GA engaged | Alternative Strategy | 10% | alternative-strategy |
| GA engaged | Stability | 10% | government-bonds |
| GA engaged | Opportunity Capacity | 5% | selected-equity; thematic-equity |
| TO essential | Permanent Core | 75% | global-equity |
| TO essential | Stability Reserve | 15% | high-quality-bonds; cash-equivalent |
| TO essential | Opportunity Capacity | 10% | selected-equity; thematic-equity |
| TO intentional | Permanent Core | 60% | broad-us-equity; broad-international-equity |
| TO intentional | Stability Reserve | 15% | government-bonds; cash-equivalent |
| TO intentional | Tactical Allocation | 10% | sector-equity; style-equity |
| TO intentional | Opportunity Selection | 10% | selected-equity; thematic-equity |
| TO intentional | Liquidity | 5% | cash-equivalent |
| TO engaged | Permanent Core | 50% | global-equity |
| TO engaged | Stability Reserve | 10% | government-bonds |
| TO engaged | Tactical Allocation | 15% | sector-equity; style-equity; tactical-fund |
| TO engaged | Thematic Opportunities | 10% | thematic-equity |
| TO engaged | Security Selection | 10% | selected-equity |
| TO engaged | Liquidity | 5% | cash-equivalent |
| IP essential | High-Quality Income | 45% | high-quality-bonds |
| IP essential | Liquidity | 25% | cash-equivalent |
| IP essential | Measured Growth | 25% | global-equity |
| IP essential | Inflation Protection | 5% | inflation-protected-bonds |
| IP intentional | Immediate Liquidity | 15% | cash-equivalent |
| IP intentional | Short-Duration Income | 20% | short-duration-bonds |
| IP intentional | Core Fixed Income | 25% | high-quality-bonds |
| IP intentional | Income Equity | 15% | income-equity |
| IP intentional | Measured Growth | 15% | global-equity |
| IP intentional | Inflation Protection | 10% | inflation-protected-bonds; real-assets |
| IP engaged | Liquidity Ladder | 15% | cash-equivalent; short-government-securities |
| IP engaged | Government Bonds | 20% | government-bonds |
| IP engaged | Investment-Grade Credit | 15% | investment-grade-credit |
| IP engaged | Inflation Protection | 10% | inflation-protected-bonds |
| IP engaged | Dividend Equity | 15% | income-equity |
| IP engaged | Global Growth | 15% | global-equity |
| IP engaged | Selected Income Opportunities | 10% | income-opportunity; real-assets |

The implementation must read exact sleeve IDs from source; display labels in this table are not substitutes for IDs.

## 11. Hypothetical holdings input

```js
{
  portfolioSystemId: "FT",
  variantId: "intentional",
  holdingsBySleeve: {
    durableCore: ["vti"],
    globalDiversification: ["vxus"],
    stability: ["bnd"],
    qualityImprovement: ["qual"],
    smallValueImprovement: [],
    liquidity: ["sgov"]
  }
}
```

Phase 1 treats this as hypothetical session input. It is not persisted, imported from a brokerage, or treated as an actual account.

## 12. Equal-weight allocation rule

For sleeve weight `W` and `N` included holdings:

```text
holding weight = W / N
```

Rules:

- Only included hypothetical holdings receive weight.
- Saved alternatives receive zero weight.
- Adding or removing a holding reweights only the affected sleeve.
- System-level sleeve weights never change.
- Full precision is used internally.
- Display rounding is deterministic and the displayed total must equal the sleeve weight.
- An empty sleeve is `unallocated-within-hypothetical-portfolio`.

## 13. Portfolio-fit resolver contract

```js
resolveSecurityPortfolioFit({
  portfolioSystemId,
  variantId,
  targetSleeveId,
  candidateSecurityId,
  holdingsBySleeve
})
```

Evaluation order:

1. Verify candidate identity and status.
2. Verify category association.
3. Verify exact sleeve eligibility.
4. Determine the primary sleeve placement.
5. Evaluate sleeve-job and mandate contribution.
6. Detect within-sleeve role and exposure overlap.
7. Calculate before/after equal-weight allocation and mandate dilution.
8. Detect cross-sleeve exposure overlap.
9. Identify a missing portfolio role filled by the candidate.
10. Identify new concentration or complexity.
11. Calculate qualitative effort change.
12. Resolve one outcome.

Output:

```js
{
  candidateSecurityId: "avuv",
  targetSleeveId: "smallValueImprovement",
  sleeveAssessment: {
    eligibility: "eligible",
    mandateEffect: "strengthens",
    returnRoleEffect: "adds-distinct-driver",
    structuralRiskEffect: "adds-factor-concentration",
    effortEffect: "increases",
    overlappingSecurityIds: []
  },
  portfolioAssessment: {
    overlappingSecurityIds: ["iwm"],
    overlappingSleeveIds: ["opportunity"],
    missingRolesFilled: [],
    concentrationsIntroduced: ["us-small-cap"],
    systemCoherenceEffect: "weakens"
  },
  allocationBefore: [],
  allocationAfter: [],
  outcome: "redundant",
  affectedSecurityId: "iwm",
  primaryReason: "..."
}
```

## 14. Outcome rules

### `add`

All must be true:

- Candidate is verified and exactly eligible.
- Candidate strengthens or completes the target sleeve mandate.
- Candidate adds a missing role, distinct structural exposure, useful concentration reduction, or meaningful effort reduction.
- Portfolio-level benefit justifies another holding.
- The candidate does not create a more serious cross-sleeve conflict.

Category eligibility alone can never produce `add`.

### `replace`

All must be true:

- A specific existing holding is identified.
- Candidate performs the same required job.
- Candidate implements that job more coherently for this exact system.
- Replacement improves mandate coverage, structural coherence, or effort.
- Replacement does not introduce a worse concentration.

`replace` must always return `affectedSecurityId`.

### `redundant`

Use when:

- Candidate is valid and eligible.
- Existing holdings already perform the role sufficiently.
- Holding both adds little meaningful sleeve or portfolio benefit.
- Candidate can remain a valid alternative but should not receive allocation alongside the comparable holding.

### `do-not-add`

Use when any decisive condition is true:

- Candidate is unverified, rejected, or ineligible.
- Candidate conflicts with or dilutes the sleeve mandate.
- Candidate produces unjustified concentration.
- Candidate creates a cross-sleeve role conflict.
- Effort rises without a meaningful mandate, return-role, or structural-risk benefit.
- Equal weighting weakens the sleeve’s required exposure.

## 15. Approved explanation structure

Every result contains five bounded sections:

```text
System-fit outcome
Effect on this sleeve
Effect on the full portfolio
Allocation effect
Primary reason
```

Allowed language:

- strengthens, completes, reinforces, duplicates, dilutes, or conflicts with a sleeve mandate;
- adds or repeats a structural exposure;
- introduces or reduces structural concentration;
- increases, decreases, or leaves qualitative effort unchanged;
- provides a distinct or repeated portfolio role.

Prohibited language without market data:

- expected return percentages;
- predicted outperformance;
- measured diversification benefit;
- current volatility, correlation, yield, drawdown, or valuation;
- guaranteed downside reduction;
- personalized suitability;
- buy or sell instructions.

Required disclosure:

> Based on the selected portfolio system and hypothetical holdings. This is an educational system-fit assessment, not a personalized investment recommendation.

## 16. Required Phase 1 source files

```text
src/domain/portfolio-system/security-category-universe.js
src/domain/portfolio-system/security-exposure-profiles.js
src/domain/portfolio-system/sleeve-security-eligibility.js
src/domain/portfolio-system/sleeve-security-fit-rules.js
src/domain/portfolio-system/security-fit-explanations.js
src/domain/portfolio-system/hypothetical-allocation-resolver.js
src/domain/portfolio-system/security-portfolio-fit-resolver.js
```

Existing Increment 0B files remain authoritative and should be imported or referenced rather than duplicated.

## 17. Required tests

```text
tests/security-category-universe-test.mjs
tests/security-exposure-profile-test.mjs
tests/sleeve-security-eligibility-test.mjs
tests/sleeve-security-fit-rules-test.mjs
tests/hypothetical-allocation-resolver-test.mjs
tests/security-portfolio-fit-resolver-test.mjs
tests/security-fit-compliance-test.mjs
```

Minimum assertions:

- Every canonical ID is unique.
- Every category ID exists in `CONSTITUENT_PORTFOLIOS` or is rejected.
- Every mapping points to an existing security and category.
- Every verified record has evidence and a verification date.
- Pending records cannot produce `add` or `replace`.
- Every exact sleeve key resolves without cross-variant fallback.
- All 21 systems and all 107 sleeve instances are covered or explicitly deferred.
- Equal weights sum exactly to the sleeve weight.
- Category eligibility alone never produces `add`.
- `replace` always identifies the affected holding.
- A valid duplicate produces `redundant`.
- A mandate conflict produces `do-not-add`.
- No output contains performance, guarantee, buy, or sell language.

## 18. Phase boundary and blast radius

Phase 1 must not modify:

```text
src/features/recommendation/PortfolioMapScreen.js
assets/css/portfolio-map.css
```

It must not change quiz logic, recommendation scoring, archetype resolution, variant resolution, constituent portfolios, sleeve IDs, weights, categories, routes, navigation, or existing UI behavior.

## 19. Codex implementation instruction

When this specification is supplied to Codex, include:

> Treat this specification and the existing Increment 0B records as authoritative inputs. Encode only supplied records. Do not research, add, remove, substitute, classify, or rewrite securities during implementation. If an ID, category, exposure, source, sleeve mapping, or rule is incomplete or inconsistent, stop and report the exact record. Do not repair data by inference. Preserve all existing portfolio-system behavior and make no user-interface changes in Phase 1.

## 20. Approval gates before production encoding

The following gates remain open:

1. Import and reconcile the latest 37-security Increment 0B catalogue.
2. Verify every new candidate against issuer-owned or regulatory sources.
3. Clarify `broad-preference-fund`.
4. Define the permitted `selected-equity` universe.
5. Define tactical-fund admission and holding-period rules.
6. Define income-opportunity boundaries.
7. Approve exposure controlled vocabularies.
8. Approve all exact sleeve-security eligibility mappings.
9. Approve user-facing explanation templates.

Until these gates are closed, this is an implementation specification and candidate-data seed—not an approved production security catalogue.

# Phase 3 catalogue-wide behavior audit

Audit date: 2026-09-03  
Scope: current working tree; no runtime behavior changes

## Verdict

**Conditional pass.** Phase 3 does not merely rename the Phase 2 catalogue-wide `Redundant` result. On the identical 20,218 assessment scenarios, Phase 2 returned `redundant` 18,548 times (91.7%). Phase 3 identified 9,336 scenarios (46.2%) as `overlapping-but-additive`, made `add` available 8,760 times (43.3%), and preferred `add` 2,536 times (12.5%).

The audit nevertheless found important remaining catalogue-resolution gaps. All alternative-strategy pairs, 90.5% of thematic-equity pairs, and 96.5% of combined factor pairs still resolve as near-interchangeable. The named ARKK/BOTZ, QUAL/SPHQ, and AVUV/VBR comparisons expose the same limitation. Phase 3 is materially better in aggregate, but the catalogue is not yet expressive enough to distinguish several implementation families reliably.

## Method

The audit enumerated all 21 system variants and all 107 sleeve instances. For every category returned by exact sleeve eligibility, it assessed every ordered pair of two distinct eligible securities in that same category:

1. the first security was placed as the only holding in the target sleeve;
2. the second security was assessed as the candidate;
3. the same input was sent to both the Phase 2 and Phase 3 top-level resolvers;
4. results were aggregated by context, category, behavior, preferred action, and available-action set.

This produced:

- 20,218 context-specific assessment scenarios;
- 4,030 unique `category / holding / candidate` triples;
- 20,218 complete Phase 3 assessments;
- zero unavailable Phase 3 assessments.

Because these are same-category pairs with an existing target-sleeve holding, `distinct` means the overlap interpreter found no meaningful existing target coverage. No scenario met that condition. `conflicting` is the user-facing classification for a completed result whose contribution level is `conflicting`; its underlying preferred action is the Phase 3 action `return`, presented contextually as “Do not add to this sleeve.”

## Overall distributions

### Phase 3 behavior

| Behavior | Count | Share |
| --- | ---: | ---: |
| Near-interchangeable | 10,382 | 51.4% |
| Overlapping-but-additive | 9,336 | 46.2% |
| Distinct | 0 | 0.0% |
| Conflicting | 500 | 2.5% |
| **Total** | **20,218** | **100.0%** |

The raw overlap interpreter returned 10,406 near-interchangeable and 9,812 overlapping-but-additive results. The behavior distribution above promotes 500 completed boundary conflicts into the explicit contextual `conflicting` bucket.

### Preferred default

| Preferred default | Count | Share |
| --- | ---: | ---: |
| Keep current | 16,232 | 80.3% |
| Add | 2,536 | 12.5% |
| Replace | 950 | 4.7% |
| Do not add to this sleeve | 500 | 2.5% |
| **Total** | **20,218** | **100.0%** |

### Available actions

| Available-action set | Count | Share |
| --- | ---: | ---: |
| Keep current + save alternative | 10,822 | 53.5% |
| Keep current + add + save alternative | 7,758 | 38.4% |
| Keep current + add + replace + save alternative | 1,002 | 5.0% |
| Keep current + replace + save alternative | 136 | 0.7% |
| Return + save alternative | 500 | 2.5% |

Individual action availability was:

| Action | Count | Share |
| --- | ---: | ---: |
| Keep current | 19,718 | 97.5% |
| Add | 8,760 | 43.3% |
| Replace | 1,138 | 5.6% |
| Save alternative | 20,218 | 100.0% |
| Return | 500 | 2.5% |

## Direct Phase 2 comparison

| Phase 2 outcome | Count | Share |
| --- | ---: | ---: |
| Redundant | 18,548 | 91.7% |
| Replace | 1,138 | 5.6% |
| Do not add | 500 | 2.5% |
| Add | 32 | 0.2% |

Of the 18,548 Phase 2 `redundant` scenarios, Phase 3 produced:

- 10,346 near-interchangeable (55.8%);
- 8,202 overlapping-but-additive (44.2%);
- 16,124 preferred keep-current (86.9%);
- 2,424 preferred add (13.1%).

This is the clearest evidence that Phase 3 is not simply presenting `Redundant` under a new label: 44.2% of the old redundant population now has explicit additive contribution, and 13.1% now prefers Add.

## Requested category results

Counts below are context-specific scenarios.

| Category | Total | Near-interchangeable | Overlapping/additive | Distinct | Conflicting | Preferred defaults |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Broad U.S. equity | 1,716 | 1,452 (84.6%) | 264 (15.4%) | 0 | 0 | Keep 1,716 |
| Broad international equity | 504 | 224 (44.4%) | 280 (55.6%) | 0 | 0 | Keep 504 |
| High-quality bonds | 2,340 | 390 (16.7%) | 1,950 (83.3%) | 0 | 0 | Keep 1,710; Replace 630 |
| Factors combined | 404 | 390 (96.5%) | 14 (3.5%) | 0 | 0 | Keep 390; Add 14 |
| Real assets | 3,060 | 882 (28.8%) | 1,872 (61.2%) | 0 | 306 (10.0%) | Keep 2,262; Add 172; Replace 320; Do not add 306 |
| Sectors | 1,740 | 108 (6.2%) | 1,516 (87.1%) | 0 | 116 (6.7%) | Keep 108; Add 1,516; Do not add 116 |
| Themes | 3,040 | 2,750 (90.5%) | 252 (8.3%) | 0 | 38 (1.3%) | Keep 2,750; Add 252; Do not add 38 |
| Alternatives | 728 | 728 (100.0%) | 0 | 0 | 0 | Keep 728 |

Factor detail:

| Factor category | Total | Near-interchangeable | Overlapping/additive | Preferred defaults |
| --- | ---: | ---: | ---: | --- |
| Diversified factor | 90 | 90 | 0 | Keep 90 |
| Quality factor | 112 | 98 | 14 | Keep 98; Add 14 |
| Value factor | 90 | 90 | 0 | Keep 90 |
| Small value | 112 | 112 | 0 | Keep 112 |

## Named comparison fixtures

The holding is listed first and the candidate second.

| Pair | Valid contexts | Phase 3 behavior | Preferred default | Available actions |
| --- | ---: | --- | --- | --- |
| VTI → ITOT | 11 | Near-interchangeable in 11 | Keep current in 11 | Keep current, save alternative |
| VTI → VOO | 11 | Overlapping/additive in 11 | Keep current in 11 | Keep current, add, save alternative |
| VOO → VTI | 11 | Overlapping/additive in 11 | Keep current in 11 | Keep current, add, save alternative |
| VTI → SCHB | 11 | Near-interchangeable in 11 | Keep current in 11 | Keep current, save alternative |
| QUAL → SPHQ | 2 | Near-interchangeable in 2 | Keep current in 2 | Keep current, save alternative |
| AVUV → VBR | 2 | Near-interchangeable in 2 | Keep current in 2 | Keep current, save alternative |
| GOVT → LQD | 15 | Overlapping/additive in 15 | Keep current in 15 | Keep current, add, save alternative |
| VNQ → PDBC | 10 | Overlapping/additive in 10 | Keep current in 9; Add in 1 | Keep current, add, save alternative |
| XLK → XLV | 2 | Overlapping/additive in 2 | Add in 2 | Keep current, add, save alternative |
| ARKK → BOTZ | 8 | Near-interchangeable in 8 | Keep current in 8 | Keep current, save alternative |

The VTI/ITOT versus VTI/VOO distinction works across every valid context. Different sectors and government-versus-credit bond exposure are also recognized as additive. The reverse VOO/VTI assessment recognizes incremental breadth but still prefers keeping the current holding; Add remains available.

## Remaining root causes

### Theme identity is absent from structural exposure

ARKK and BOTZ have identical decision-relevant profiles: equity, global geography, large/mid/small capitalization, empty style/factor/sector arrays, `thematic-equity` strategy type, and high complexity. The authoritative exposure-profile field list does not contain a theme-identity dimension. The engine therefore cannot distinguish broad innovation from robotics/artificial intelligence without inventing facts.

### Alternative strategy subtype is absent

DBMF and KMLM, representative of the alternative-strategy category, both resolve as multi-asset, global, high-complexity `alternative-strategy` implementations with the remaining relevant arrays empty or not applicable. Other alternative implementations likewise lack a controlled structural subtype that separates managed futures, market neutral, merger arbitrage, risk parity, or buffered strategies. This produces the observed 100% near-interchangeable result.

### Several factor implementations are structurally identical

QUAL and SPHQ both resolve as U.S. large/mid-cap quality, systematic-factor, moderate-complexity implementations. AVUV and VBR both resolve as U.S. small-cap value with size/value factors and moderate complexity. The current vocabulary does not encode methodology distinctions that could establish incremental exposure or a replacement advantage.

These are primarily **authoritative data/vocabulary granularity limitations**, not evidence that the incremental-contribution interpreter is reverting to category-only logic. The sector and real-asset results demonstrate that the interpreter distinguishes candidates when the source profiles contain distinct decision-relevant dimensions.

## Recommended next correction

Do not loosen overlap thresholds and do not infer difference from fund names or from array cardinality. Add approved, evidence-backed structural dimensions only where they affect portfolio decisions, then carry them through the existing Phase 2 primitives into Phase 3. Likely work includes:

- an approved theme/exposure-focus dimension for thematic funds;
- an approved alternative-strategy subtype or role dimension;
- carefully bounded factor-methodology distinctions where they create explainable contribution or replacement evidence;
- manifest and security-metadata updates with issuer/regulatory provenance;
- vocabulary validation, readiness, overlap, incremental-contribution, and catalogue scenario tests for the new dimensions.

Constituent portfolios, exact sleeve permissions, category associations, allocation logic, and UI decision logic should not change as part of that metadata-resolution work.

## Repository impact

This task adds this audit report only. The exhaustive diagnostic script was temporary and removed after execution. No production module, catalogue record, permission record, constituent portfolio, or UI behavior was changed.

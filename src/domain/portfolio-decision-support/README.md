# Portfolio Decision Support

This capability is the authoritative home for Phase 3 Portfolio Map user-facing security decision support.

It supersedes the Phase 2 four-terminal-outcome model as the final Portfolio Map assessment contract. It does not replace the structural-fit primitives in `../portfolio-system/`.

Phase 2 answers lower-level questions about:

- exact eligibility;
- readiness;
- sleeve alignment and boundaries;
- structural overlap;
- replacement evidence.

Phase 3 interprets that evidence as:

- existing and shared exposure;
- incremental contribution;
- portfolio emphasis and concentration changes;
- implementation and monitoring tradeoffs;
- available user choices;
- a preferred default action.

The preferred action is the best default for the selected portfolio system, sleeve, candidate, and temporary holdings. It is not necessarily the only valid choice and is not a trade instruction.

Do not recreate metadata, category, eligibility, readiness, or structural-comparison logic here. Consume the existing `portfolio-system` APIs and keep the dependency direction one-way.

The Phase 3 runtime API has not been implemented yet. See `docs/specs/phase-3-portfolio-decision-support-contract.md` for the frozen semantics and migration boundaries.


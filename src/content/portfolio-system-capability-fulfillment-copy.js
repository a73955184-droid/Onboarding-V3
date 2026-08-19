import {
  INVESTOR_NEED_TRACEABILITY_COPY
} from './investor-need-traceability-copy.js';

import {
  PORTFOLIO_ARCHETYPES
} from '../domain/portfolio-system/portfolio-archetypes.js';


export const PORTFOLIO_SYSTEM_IDS =
  Object.freeze(
    Object.keys(
      PORTFOLIO_ARCHETYPES
    )
  );


export function toCanonicalCapabilityId(
  label
) {
  return String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}


export const CANONICAL_SYSTEM_CAPABILITIES =
  Object.freeze(
    Object.entries(
      INVESTOR_NEED_TRACEABILITY_COPY
    ).flatMap(
      ([questionId, responses]) =>
        Object.entries(responses).map(
          ([responseId, traceability]) =>
            Object.freeze({
              id:
                toCanonicalCapabilityId(
                  traceability
                    .systemCapability
                    .label
                ),
              label:
                traceability
                  .systemCapability
                  .label,
              questionId,
              responseId
            })
        )
    )
  );


const PORTFOLIO_SYSTEM_CONTEXT = Object.freeze({
  ES:
    'Effortless keeps broad growth, stability, and optional liquidity roles dominant while limiting extra holdings and routine decisions.',
  GD:
    'Global Diversified distributes responsibility across domestic, international, diversifying, stability, and liquidity roles instead of relying on one return source.',
  FT:
    'Systematic Improvement protects a durable diversified core and admits non-core exposures only when they solve a defined limitation.',
  BFO:
    'Balanced Multi-Purpose assigns growth, stability, liquidity, income, diversifier, real-asset, and opportunity capital distinct jobs.',
  GA:
    'Growth & Alternatives protects a dominant growth foundation while bounding enhancer, alternative, real-asset, stability, liquidity, and opportunity roles.',
  TO:
    'Opportunity Portfolio separates a permanent core and stability reserve from explicitly bounded tactical, thematic, selection, and opportunity capacity.',
  IP:
    'Income Preservation separates liquidity, short-duration income, core fixed income, measured growth, inflation protection, and selected income opportunities.'
});


/*
 * Each statement describes how the named capability operates after it is
 * placed inside a portfolio system. The system context above supplies the
 * archetype-specific architecture; these statements supply the capability's
 * operating rule. This keeps all 301 pairings explicit and consistently
 * grounded without changing any active resolver or presentation flow.
 */
const CAPABILITY_OPERATING_RULES = Object.freeze({
  'portfolio-architecture-framework':
    'A new holding must enter one of those defined roles, so the portfolio structure is established before optional investments are considered.',
  'foundation-diagnostic-framework':
    'The existing foundation is mapped to those roles first, exposing any missing responsibility, unsupported exposure, or unnecessary concentration.',
  'portfolio-role-mapping-framework':
    'Every existing investment is assigned to one of those roles so overlap, gaps, and holdings without a clear purpose become visible.',
  'portfolio-reconciliation-framework':
    'Accumulated holdings are retained only when they contribute to one of those roles without creating unjustified overlap or complexity.',
  'controlled-improvement-framework':
    'A proposed change must identify the limitation it solves and show that the expected benefit justifies disturbing an otherwise workable structure.',
  'decision-framing-framework':
    'Uncertainty is reduced to the affected role, the decision that role requires, and the smallest coherent next step.',
  'decision-validation-framework':
    'A current choice is validated by whether it still performs its assigned role within the system’s boundaries, not by recent performance alone.',
  'gap-and-redundancy-framework':
    'A proposed addition must fill an unserved role or improve an existing one; otherwise it is treated as redundant complexity.',
  'change-detection-framework':
    'Review begins only when a role, assumption, allocation boundary, or real-world need changes materially rather than whenever markets move.',
  'comparison-framework':
    'Alternatives are compared on how well they perform the required role and on the risk, cost, effort, and overlap they introduce.',
  'starting-decision-framework':
    'The first decision establishes the most necessary unfilled role and defers optional choices until the foundation can operate coherently.',
  'role-based-selection-framework':
    'Candidate investments are evaluated using criteria derived from the role they must perform rather than their appeal in isolation.',
  'fit-evaluation-framework':
    'A candidate must identify where it belongs, what distinct contribution it makes, what it overlaps, and whether that contribution earns inclusion.',
  'action-decision-framework':
    'Leave alone, monitor, review, reduce, replace, or exit decisions follow from whether the investment still performs its assigned role.',
  'research-stopping-framework':
    'Research stops when the remaining evidence is unlikely to change whether a candidate fulfills its role within the system’s limits.',
  'balance-attribution-framework':
    'Account-level movement is traced to the roles that caused it before deciding whether any affected part actually needs attention.',
  'market-signal-filtering-framework':
    'Market information matters only when it changes an assumption, boundary, or expected contribution attached to one of the system’s roles.',
  'holding-thesis-review-framework':
    'Holding-specific news is tested against the holding’s assigned job and original inclusion case before it can trigger action.',
  'idea-intake-framework':
    'A new idea remains outside the portfolio until its proposed role, contribution, overlap, permitted size, and decision relevance are clear.',
  'decision-relevant-alerting-framework':
    'Alerts are limited to events that cross a role-specific boundary or create a decision that cannot reasonably wait for the next review.',
  'portfolio-role-definition-framework':
    'Each portfolio part has a stated purpose, expected contribution, and boundary that explains why it belongs in the overall system.',
  'role-based-monitoring-framework':
    'Monitoring follows the information that could change each role’s ability to do its job while filtering unrelated market noise.',
  'review-cadence-framework':
    'Routine reviews occur on a planned rhythm, with earlier attention reserved for material changes to roles, limits, or investor needs.',
  'effort-allocation-framework':
    'Research effort is concentrated where it can improve a meaningful outcome and withheld where it would only add choices or complexity.',
  'bounded-experimentation-framework':
    'Experimental ideas, when permitted, receive a defined role, allocation limit, success test, and review or exit condition before capital is committed.',
  'guided-interaction-framework':
    'Routine choices stay limited, and investor attention is requested only for exceptions or decisions that the system cannot resolve mechanically.',
  'exception-management-framework':
    'The portfolio remains low-maintenance until a defined role, threshold, assumption, or review condition is materially affected.',
  'scheduled-review-framework':
    'Routine decisions are consolidated into repeatable review periods, while only meaningful exceptions can trigger an earlier review.',
  'research-boundary-framework':
    'Deeper research is confined to roles that permit it so the rest of the portfolio can remain stable and lower effort.',
  'structured-engagement-framework':
    'Frequent involvement is confined to roles that permit active judgment, with explicit limits preventing that activity from governing the entire portfolio.',
  'near-term-capital-protection-framework':
    'Money needed soon is assigned to accessible and stability-oriented roles before capital is exposed to risks that may need longer to recover.',
  'time-horizon-segmentation-framework':
    'Medium-term capital is separated from longer-term return-seeking capital so each can follow an appropriate risk and review policy.',
  'horizon-transition-framework':
    'As a use date approaches, capital can move deliberately from growth-oriented roles toward stability and access without rebuilding the whole system.',
  'long-term-discipline-framework':
    'Long-horizon roles remain governed by their intended purpose and are insulated from ordinary short-term headlines and price movement.',
  'goal-and-horizon-segmentation-framework':
    'Capital is assigned to separate goal-based roles so different timelines can carry distinct growth, stability, access, and review expectations.',
  'timeline-uncertainty-framework':
    'When timing is unclear, the system preserves accessible capacity and avoids unnecessary specialization until the money’s purpose becomes clearer.',
  'guided-start-framework':
    'The initial structure explains the function of each required role and postpones nonessential decisions until that foundation is understood.',
  'whole-portfolio-mapping-framework':
    'Individual holdings are connected to their roles and those roles are shown as coordinated parts of one portfolio objective.',
  'attention-prioritization-framework':
    'Information is ranked by the role it affects, the materiality of that effect, and the specific decision it could change.',
  'action-threshold-framework':
    'Explicit role and boundary tests classify a situation as leave alone, monitor, review, or change before action is taken.',
  'repeatable-selection-framework':
    'Comparable investments face the same role, contribution, risk, cost, complexity, and effort tests whenever a selection is made.',
  'exploration-governance-framework':
    'Exploratory ideas must state their purpose, allowed size, success criteria, and review or exit conditions before entering the portfolio.',
  'income-and-capital-protection-framework':
    'Capital needed for access, dependable income, or protection is governed separately from capital that can remain invested for longer-term growth.'
});


function buildFulfillmentRow(
  operatingRule
) {
  return Object.freeze(
    Object.fromEntries(
      PORTFOLIO_SYSTEM_IDS.map(
        archetypeId => [
          archetypeId,
          `${PORTFOLIO_SYSTEM_CONTEXT[archetypeId]} ${operatingRule}`
        ]
      )
    )
  );
}


export const PORTFOLIO_SYSTEM_CAPABILITY_FULFILLMENT =
  Object.freeze(
    Object.fromEntries(
      Object.entries(
        CAPABILITY_OPERATING_RULES
      ).map(
        ([capabilityId, operatingRule]) => [
          capabilityId,
          buildFulfillmentRow(
            operatingRule
          )
        ]
      )
    )
  );

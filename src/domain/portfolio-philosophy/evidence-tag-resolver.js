import { EVIDENCE_TAGS } from './philosophy-constants.js';


/*
 * Semantic evidence mappings.
 *
 * IMPORTANT:
 * These mappings answer only:
 *
 *   "What did the user explicitly tell us?"
 *
 * They do NOT participate in:
 * - Stage scoring
 * - Style scoring
 * - Behavior scoring
 * - Archetype scoring
 * - Variant resolution
 * - Portfolio construction
 *
 * An omitted mapping is intentional.
 * Not every quiz response needs to produce a philosophy evidence tag.
 */
const ANSWER_EVIDENCE_MAP = Object.freeze({

  /*
   * Q1 — Current setup
   */
  setup: Object.freeze({
    not_started: [
      EVIDENCE_TAGS.SIMPLICITY
    ],

    simple_start: [
      EVIDENCE_TAGS.SIMPLICITY,
      EVIDENCE_TAGS.BROAD_DIVERSIFICATION
    ],

    etfs_stocks: [
      EVIDENCE_TAGS.BROAD_DIVERSIFICATION
    ],

    collected: [],

    established: []
  }),


  /*
   * Q2 — What sends the user looking for information?
   */
  transition: Object.freeze({
    what_to_do: [
      EVIDENCE_TAGS.SIMPLICITY
    ],

    doing_right: [],

    missing: [],

    change: [],

    compare: [
      EVIDENCE_TAGS.COMPARE_ALTERNATIVES,
      EVIDENCE_TAGS.OPTIMIZATION
    ]
  }),


  /*
   * Q3 — Portfolio decision problem
   */
  decisionStyle: Object.freeze({
    start: [
      EVIDENCE_TAGS.SIMPLICITY
    ],

    pick: [
      EVIDENCE_TAGS.COMPARE_ALTERNATIVES
    ],

    fit: [
      EVIDENCE_TAGS.EXPLORATION
    ],

    sell: [],

    enough: [
      EVIDENCE_TAGS.RESEARCH_EFFORT,
      EVIDENCE_TAGS.OPTIMIZATION
    ]
  }),


  /*
   * Q4 — What captures attention?
   */
  marketPsychology: Object.freeze({
    balance: [
      EVIDENCE_TAGS.VOLATILITY_CONCERN
    ],

    market: [
      EVIDENCE_TAGS.VOLATILITY_CONCERN
    ],

    holding: [],

    idea: [
      EVIDENCE_TAGS.EXPLORATION,
      EVIDENCE_TAGS.OPPORTUNITY_SEEKING
    ],

    rarely: [
      EVIDENCE_TAGS.LOW_INVOLVEMENT
    ]
  }),


  /*
   * Q5 — What feels incomplete?
   */
  evolution: Object.freeze({
    understand: [
      EVIDENCE_TAGS.SIMPLICITY
    ],

    monitor: [],

    frequency: [],

    effort: [
      EVIDENCE_TAGS.RESEARCH_EFFORT,
      EVIDENCE_TAGS.OPTIMIZATION
    ],

    experiment: [
      EVIDENCE_TAGS.EXPLORATION,
      EVIDENCE_TAGS.OPPORTUNITY_SEEKING
    ]
  }),


  /*
   * Q6 — Desired level of involvement
   *
   * This is one of the strongest direct sources
   * for engagement-related evidence.
   */
  tradeoff: Object.freeze({
    tell_me: [
      EVIDENCE_TAGS.LOW_INVOLVEMENT,
      EVIDENCE_TAGS.SIMPLICITY
    ],

    occasional: [
      EVIDENCE_TAGS.LOW_INVOLVEMENT
    ],

    periodic: [
      EVIDENCE_TAGS.REPEATABLE_FRAMEWORK
    ],

    explore: [
      EVIDENCE_TAGS.EXPLORATION,
      EVIDENCE_TAGS.RESEARCH_EFFORT
    ],

    active: [
      EVIDENCE_TAGS.ACTIVE_INVOLVEMENT,
      EVIDENCE_TAGS.RESEARCH_EFFORT,
      EVIDENCE_TAGS.OPPORTUNITY_SEEKING
    ]
  }),


  /*
   * Q7 — Time horizon
   *
   * The implementation retains the historical key "age",
   * but these options describe time horizon.
   */
  age: Object.freeze({
    under3: [
      EVIDENCE_TAGS.SHORT_TIME_HORIZON
    ],

    '3to5': [],

    '5to10': [],

    '10plus': [],

    multiple: [
      EVIDENCE_TAGS.MULTIPLE_TIME_HORIZONS
    ],

    unsure: []
  }),


  /*
   * Q8 — What should investing accomplish?
   *
   * This question may contain up to two selections.
   */
  goals: Object.freeze({
    start_confident: [
      EVIDENCE_TAGS.SIMPLICITY
    ],

    understand: [
      EVIDENCE_TAGS.SIMPLICITY
    ],

    monitor: [],

    act: [
      EVIDENCE_TAGS.REPEATABLE_FRAMEWORK
    ],

    choose: [
      EVIDENCE_TAGS.COMPARE_ALTERNATIVES,
      EVIDENCE_TAGS.OPTIMIZATION,
      EVIDENCE_TAGS.REPEATABLE_FRAMEWORK
    ],

    explore: [
      EVIDENCE_TAGS.EXPLORATION,
      EVIDENCE_TAGS.OPPORTUNITY_SEEKING
    ],

    income: [
      EVIDENCE_TAGS.INCOME_GOAL,
      EVIDENCE_TAGS.CAPITAL_PRESERVATION,
      EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL
    ]
  })
});


/*
 * Human-readable answer copy used only for traceability.
 *
 * If the assessment payload already contains the answer text,
 * that text takes precedence.
 */
const ANSWER_LABELS = Object.freeze({
  setup: Object.freeze({
    not_started:
      'I have not invested yet',

    simple_start:
      'I mainly use a retirement account, automated service, or broad funds',

    etfs_stocks:
      'I own broad funds plus a few individual investments',

    collected:
      'I have added different ideas over time',

    established:
      'I already follow a deliberate investing approach'
  }),

  transition: Object.freeze({
    what_to_do:
      'I am not sure what to do next',

    doing_right:
      'I wonder whether I am doing this right',

    missing:
      'I worry that I may be missing something important',

    change:
      'I cannot tell whether something actually needs to change',

    compare:
      'I am comparing several reasonable choices'
  }),

  decisionStyle: Object.freeze({
    start:
      'Getting started without making a mistake',

    pick:
      'Choosing between funds, stocks, or other options',

    fit:
      'Deciding whether a new idea fits what I already have',

    sell:
      'Knowing whether to sell, reduce, or leave something alone',

    enough:
      'Knowing when I have researched enough'
  }),

  marketPsychology: Object.freeze({
    balance:
      'A noticeable change in my account balance',

    market:
      'A large market move or alarming headline',

    holding:
      'News or price movement around something I own',

    idea:
      'A new investment idea I see online or hear about',

    rarely:
      'I do not check very often'
  }),

  evolution: Object.freeze({
    understand:
      'Understanding what I own and why',

    monitor:
      'Knowing what I should monitor',

    frequency:
      'Knowing how often I should check or make decisions',

    effort:
      'Knowing which choices deserve more research and effort',

    experiment:
      'Trying new ideas without disrupting everything else'
  }),

  tradeoff: Object.freeze({
    tell_me:
      'I want clear guidance and very few decisions',

    occasional:
      'I want to check occasionally and act only when needed',

    periodic:
      'I am comfortable reviewing choices on a schedule',

    explore:
      'I want room to research selected ideas',

    active:
      'I enjoy following investments and making more frequent decisions'
  }),

  age: Object.freeze({
    under3:
      'Within the next 3 years',

    '3to5':
      'About 3–5 years from now',

    '5to10':
      'About 5–10 years from now',

    '10plus':
      'More than 10 years from now',

    multiple:
      'I have several goals with different timelines',

    unsure:
      'I am not sure yet'
  }),

  goals: Object.freeze({
    start_confident:
      'Knowing how to start without feeling lost',

    understand:
      'Understanding how my investments work together',

    monitor:
      'Knowing what deserves my attention',

    act:
      'Knowing when to act and when to leave things alone',

    choose:
      'Choosing investments with a repeatable framework',

    explore:
      'Exploring new ideas without losing the long-term direction',

    income:
      'Creating dependable income or protecting money I will need'
  })
});


/*
 * Normalize the different answer shapes the existing assessment
 * state may expose.
 *
 * Supported examples:
 *
 * setup: 'not_started'
 *
 * goals: ['monitor', 'understand']
 *
 * setup: {
 *   optionId: 'not_started',
 *   answerText: 'I have not invested yet'
 * }
 *
 * goals: [
 *   { optionId: 'monitor', answerText: '...' },
 *   { optionId: 'understand', answerText: '...' }
 * ]
 */
function normalizeSelectedAnswers(questionId, rawValue) {
  if (
    rawValue === undefined ||
    rawValue === null
  ) {
    return [];
  }

  const values =
    Array.isArray(rawValue)
      ? rawValue
      : [rawValue];

  return values
    .map((value) => {
      if (typeof value === 'string') {
        return {
          questionId,
          optionId: value,
          answerText:
            ANSWER_LABELS?.[questionId]?.[value] ??
            value
        };
      }

      if (
        typeof value === 'object' &&
        value !== null
      ) {
        const optionId =
          value.optionId ??
          value.id ??
          value.value ??
          value.answerId ??
          null;

        if (!optionId) {
          return null;
        }

        const answerText =
          value.answerText ??
          value.label ??
          value.text ??
          ANSWER_LABELS?.[questionId]?.[optionId] ??
          optionId;

        return {
          questionId,
          optionId,
          answerText
        };
      }

      return null;
    })
    .filter(Boolean);
}


/*
 * Resolve the answer container from the existing assessment result.
 *
 * normalizedAnswers is preferred because it should contain the
 * assessment engine's normalized representation.
 *
 * answers remains supported as a fallback.
 */
function getAnswerContainer(assessmentResult) {
  if (
    assessmentResult?.normalizedAnswers &&
    typeof assessmentResult.normalizedAnswers === 'object'
  ) {
    return assessmentResult.normalizedAnswers;
  }

  if (
    assessmentResult?.answers &&
    typeof assessmentResult.answers === 'object'
  ) {
    return assessmentResult.answers;
  }

  return {};
}


/*
 * Public API
 *
 * Converts actual quiz responses into semantic evidence tags.
 *
 * Output is intentionally traceable:
 *
 * {
 *   tags: [...],
 *   evidenceByTag: {
 *     'low-involvement': [
 *       {
 *         questionId,
 *         optionId,
 *         answerText
 *       }
 *     ]
 *   },
 *   selectedAnswers: [...]
 * }
 */
export function resolveEvidenceTags(
  assessmentResult = {}
) {
  const answers =
    getAnswerContainer(
      assessmentResult
    );

  const tags =
    new Set();

  const evidenceByTag = {};

  const selectedAnswers = [];


  function addEvidence(
    tag,
    evidence
  ) {
    tags.add(tag);

    if (!evidenceByTag[tag]) {
      evidenceByTag[tag] = [];
    }

    const alreadyPresent =
      evidenceByTag[tag].some(
        (existing) =>
          existing.questionId ===
            evidence.questionId &&
          existing.optionId ===
            evidence.optionId
      );

    if (!alreadyPresent) {
      evidenceByTag[tag].push(
        evidence
      );
    }
  }


  for (
    const [
      questionId,
      optionMap
    ]
    of Object.entries(
      ANSWER_EVIDENCE_MAP
    )
  ) {
    const selected =
      normalizeSelectedAnswers(
        questionId,
        answers[questionId]
      );

    for (
      const evidence
      of selected
    ) {
      selectedAnswers.push(
        evidence
      );

      const mappedTags =
        optionMap[
          evidence.optionId
        ] ?? [];

      for (
        const tag
        of mappedTags
      ) {
        addEvidence(
          tag,
          evidence
        );
      }
    }
  }


  return {
    tags: [
      ...tags
    ],

    evidenceByTag,

    selectedAnswers
  };
}


/*
 * Optional helper for downstream resolvers.
 */
export function hasEvidenceTag(
  evidenceResult,
  tag
) {
  return Boolean(
    evidenceResult?.tags?.includes(
      tag
    )
  );
}


/*
 * Optional helper to retrieve the exact quiz evidence
 * supporting one semantic tag.
 */
export function getEvidenceForTag(
  evidenceResult,
  tag
) {
  return (
    evidenceResult
      ?.evidenceByTag
      ?.[tag] ??
    []
  );
}

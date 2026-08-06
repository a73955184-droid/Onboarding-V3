import { QUESTIONS } from '../content/questions.js';

const QUESTION_BY_KEY = Object.fromEntries(
  QUESTIONS.map((question) => [question.screenKey, question])
);

export const ARCHETYPE_DISPLAY_NAMES = Object.freeze({
  BFO: 'Balanced multi-purpose',
  GD: 'Broad low-maintenance',
  ES: 'Simple guided starting',
  FT: 'Systematic improvement',
  GA: 'Foundation plus exploration',
  TO: 'Long-term base with active area',
  IP: 'Dependable needs and growth'
});

export const ARCHETYPE_FIT_PHRASES = Object.freeze({
  BFO: 'keep a balanced system that separates growth, stability, and selected ideas into clear roles.',
  GD: 'rely on a broad foundation that makes most progress without extra complexity.',
  ES: 'follow a small set of clear decisions and minimize active intervention.',
  FT: 'build on a durable core while only adding improvements that earn their place.',
  GA: 'support a stable base while limiting the size and role of ideas that require extra effort.',
  TO: 'protect long-term progress while applying tight boundaries to any active choices.',
  IP: 'separate dependable near-term needs from longer-term growth in one coherent system.'
});

export const INVESTOR_JOB_CATALOG = Object.freeze({
  clear_start: {
    id: 'clear_start',
    title: 'Start with a clear structure',
    description:
      'Your first priority is making investing easier by keeping the initial approach simple and understandable.',
    portfolioDesignImplication:
      'The portfolio should favor a straightforward foundation and avoid introducing too many competing roles too soon.'
  },

  connect_pieces: {
    id: 'connect_pieces',
    title: 'Connect the pieces into one system',
    description:
      'Your answers show a need to turn separate investments into one coherent approach with a clear reason for each part.',
    portfolioDesignImplication:
      'The portfolio should make it obvious which sleeve serves which goal and avoid overlaps that blur the system.'
  },

  build_repeatable_rules: {
    id: 'build_repeatable_rules',
    title: 'Build repeatable decision rules',
    description:
      'You benefit from rules that help you decide when to act and when to leave the portfolio alone.',
    portfolioDesignImplication:
      'The portfolio should be organized around repeatable criteria rather than ad hoc reactions.'
  },

  improve_what_works: {
    id: 'improve_what_works',
    title: 'Improve what already works',
    description:
      'Your focus is on enhancing an existing approach without creating unnecessary complexity.',
    portfolioDesignImplication:
      'The portfolio should preserve a clear base while allowing limited improvements only when their job is clear.'
  },

  explore_within_limits: {
    id: 'explore_within_limits',
    title: 'Explore within clear limits',
    description:
      'You want room to try new ideas, but only when they are contained and do not overwhelm the overall plan.',
    portfolioDesignImplication:
      'The portfolio should include a defined exploratory area with size and review boundaries.'
  },

  keep_decisions_simple: {
    id: 'keep_decisions_simple',
    title: 'Keep routine decisions simple',
    description:
      'You are most confident when common choices are straightforward and do not require constant evaluation.',
    portfolioDesignImplication:
      'The portfolio should minimize frequent decision points and keep most of the structure consistent.'
  },

  stay_consistent: {
    id: 'stay_consistent',
    title: 'Stay consistent with limited changes',
    description:
      'You want a dependable process that favors regular progress over chasing every new idea.',
    portfolioDesignImplication:
      'The portfolio should support steady checks and avoid adding complexity for its own sake.'
  },

  compare_with_rules: {
    id: 'compare_with_rules',
    title: 'Compare choices with a clear rule',
    description:
      'You make better decisions when you have a standard for comparing options instead of reacting to every signal.',
    portfolioDesignImplication:
      'The portfolio should use selection criteria that turn research into a choice rather than more uncertainty.'
  },

  balance_stability_and_interest: {
    id: 'balance_stability_and_interest',
    title: 'Balance stability with selected ideas',
    description:
      'Your profile calls for a stable core plus a smaller area reserved for ideas that matter most.',
    portfolioDesignImplication:
      'The portfolio should clearly separate dependable holdings from the portion allowed for higher-interest ideas.'
  },

  manage_active_opportunities: {
    id: 'manage_active_opportunities',
    title: 'Manage active opportunities carefully',
    description:
      'You want involvement, but only when it is guided by explicit triggers and boundaries.',
    portfolioDesignImplication:
      'The portfolio should limit active exposure and require a written reason for each selected opportunity.'
  },

  see_why_it_fits: {
    id: 'see_why_it_fits',
    title: 'See why each recommendation fits',
    description:
      'You build confidence when you understand the reason behind every suggested change.',
    portfolioDesignImplication:
      'The portfolio should offer clear rationale for each sleeve so you can trust the system without guessing.'
  },

  know_the_next_step: {
    id: 'know_the_next_step',
    title: 'Know the next step',
    description:
      'You are most comfortable when the guidance includes a clear next action.',
    portfolioDesignImplication:
      'The portfolio should be presented with easy-to-follow next steps and review checkpoints.'
  },

  stay_anchored: {
    id: 'stay_anchored',
    title: 'Stay anchored through volatility',
    description:
      'Your confidence improves when the system is designed to keep you grounded during uncertain markets.',
    portfolioDesignImplication:
      'The portfolio should include stable anchors and predefined review points so you are not tempted to react to noise.'
  },

  set_limits_for_new_ideas: {
    id: 'set_limits_for_new_ideas',
    title: 'Set limits for new ideas',
    description:
      'New opportunities are easier to manage when their size, purpose, and review plan are decided first.',
    portfolioDesignImplication:
      'The portfolio should reserve only a limited space for ideas that require extra research or monitoring.'
  },

  improve_with_a_stopping_rule: {
    id: 'improve_with_a_stopping_rule',
    title: 'Improve with a stopping rule',
    description:
      'You benefit from a defined improvement process instead of endless comparison.',
    portfolioDesignImplication:
      'The portfolio should only add or adjust positions when a clear improvement threshold is met.'
  }
});

export const JOB_SOURCE_MAP = Object.freeze({
  stage: {
    foundation_builder: 'clear_start',
    portfolio_organizer: 'connect_pieces',
    system_builder: 'build_repeatable_rules',
    intentional_optimizer: 'improve_what_works',
    adaptive_investor: 'explore_within_limits'
  },

  style: {
    guided_autopilot: 'keep_decisions_simple',
    steady_steward: 'stay_consistent',
    systematic_improver: 'compare_with_rules',
    bounded_explorer: 'balance_stability_and_interest',
    active_navigator: 'manage_active_opportunities'
  },

  modifier: {
    validation_seeker: 'see_why_it_fits',
    instruction_seeker: 'know_the_next_step',
    confidence_builder: 'stay_anchored',
    opportunity_chaser: 'set_limits_for_new_ideas',
    optimization_mindset: 'improve_with_a_stopping_rule'
  }
});

export const JOB_EVIDENCE_KEYS = Object.freeze({
  clear_start: ['setup', 'goals'],
  connect_pieces: ['setup', 'evolution'],
  build_repeatable_rules: ['transition', 'decisionStyle'],
  improve_what_works: ['transition', 'evolution'],
  explore_within_limits: ['marketPsychology', 'tradeoff'],
  keep_decisions_simple: ['tradeoff', 'setup'],
  stay_consistent: ['marketPsychology', 'tradeoff'],
  compare_with_rules: ['decisionStyle', 'goals'],
  balance_stability_and_interest: ['setup', 'marketPsychology'],
  manage_active_opportunities: ['marketPsychology', 'decisionStyle'],
  see_why_it_fits: ['transition', 'marketPsychology'],
  know_the_next_step: ['transition', 'setup'],
  stay_anchored: ['decisionStyle', 'marketPsychology'],
  set_limits_for_new_ideas: ['tradeoff', 'marketPsychology'],
  improve_with_a_stopping_rule: ['decisionStyle', 'tradeoff']
});

export const QUESTION_LABELS = Object.freeze({
  setup: 'How you invest today',
  transition: 'What sends you searching',
  decisionStyle: 'How you make a choice',
  marketPsychology: 'What gets your attention',
  evolution: 'What feels incomplete',
  tradeoff: 'How involved you want to be',
  age: 'When the money may be needed',
  goals: 'What would make investing easier'
});

export function getQuestionLabel(key) {
  return QUESTION_LABELS[key] || key;
}

export function getQuestionOptionLabel(questionKey, optionId) {
  const question = QUESTION_BY_KEY[questionKey];

  if (!question || !Array.isArray(question.options)) {
    return null;
  }

  const option = question.options.find((item) => item.id === optionId);

  return option ? option.label : null;
}

const ASSESSMENT_VERSION = '2.1.0';

const STAGES = {
  foundation_builder: { name: 'Foundation Builder', summary: 'You are establishing a dependable investing foundation and deciding what structure to trust.' },
  portfolio_organizer: { name: 'Portfolio Organizer', summary: 'You already have investments; your next step is turning them into one coherent system.' },
  system_builder: { name: 'System Builder', summary: 'You are ready to use repeatable rules instead of treating each investment as a separate decision.' },
  intentional_optimizer: { name: 'Intentional Optimizer', summary: 'You are evaluating how to improve an existing system without adding unnecessary complexity.' },
  adaptive_investor: { name: 'Adaptive Investor', summary: 'You are comfortable adapting within defined portfolio boundaries as conditions and opportunities change.' }
};

const STYLES = {
  guided_autopilot: { name: 'Guided Autopilot', summary: 'A mostly automated system that asks for your attention only when a meaningful decision is required.', cadence: 'Annual review with exception-based prompts' },
  steady_steward: { name: 'Steady Steward', summary: 'A durable portfolio reviewed occasionally, with disciplined and limited changes.', cadence: 'Light quarterly check-in and annual review' },
  systematic_improver: { name: 'Systematic Improver', summary: 'A repeatable process for comparing, reviewing, and improving the portfolio.', cadence: 'Monthly monitoring and quarterly decision review' },
  bounded_explorer: { name: 'Bounded Explorer', summary: 'A stable core with controlled room to research and test selected ideas.', cadence: 'Monthly opportunity review and quarterly portfolio review' },
  active_navigator: { name: 'Active Navigator', summary: 'A defined framework for more frequent, market-aware decisions without losing portfolio boundaries.', cadence: 'Weekly and event-driven review' }
};

const MODIFIERS = {
  validation_seeker: { name: 'Evidence Seeker', userCopy: 'You build confidence by seeing why a recommendation fits before acting.' },
  opportunity_chaser: { name: 'Opportunity Sensitive', userCopy: 'New ideas attract your attention, so clear sleeve limits and entry rules will help.' },
  instruction_seeker: { name: 'Guidance Oriented', userCopy: 'You are most comfortable when the next step and decision rule are explicit.' },
  confidence_builder: { name: 'Confidence Builder', userCopy: 'Your system should help you stay anchored when uncertainty or volatility increases.' },
  optimization_mindset: { name: 'Improvement Oriented', userCopy: 'You naturally look for ways to improve the system, so every added strategy should earn its place.' }
};

const BLUEPRINTS = {
  BFO: { name: 'Balanced Family Office', short: 'An intentional, diversified long-term system with room for selected opportunities.', structure: ['Diversified core', 'Stability reserve', 'Measured opportunity sleeve'], rules: ['Review the full portfolio before adding anything new', 'Keep exploratory ideas inside a fixed sleeve', 'Make changes when goals or allocation ranges change—not because markets feel noisy'] },
  GD: { name: 'Global Diversified', short: 'A simple global compounding system designed to remain durable over time.', structure: ['Global equity core', 'Stability allocation', 'Periodic rebalancing'], rules: ['Use broad diversification as the default', 'Rebalance on a schedule or allocation threshold', 'Avoid changes based only on recent performance'] },
  FT: { name: 'Factor Tilt', short: 'A diversified core enhanced through repeatable, evidence-based strategies.', structure: ['Diversified core', 'Factor enhancement', 'Rules-based review'], rules: ['Define the reason for each tilt', 'Set allocation ranges before investing', 'Review evidence and cost before replacing a strategy'] },
  GA: { name: 'Growth + Alternatives', short: 'A stable core with bounded exposure to growth and alternative return sources.', structure: ['Long-term core', 'Growth sleeve', 'Alternative opportunity sleeve'], rules: ['Protect the core from idea accumulation', 'Set a total exploration budget', 'Require a thesis and review date for each sleeve'] },
  TO: { name: 'Tactical Opportunistic', short: 'A base allocation with a controlled budget for active, market-aware decisions.', structure: ['Base allocation', 'Tactical sleeve', 'Opportunity and risk budget'], rules: ['Write the thesis, trigger, size, and exit before acting', 'Keep tactical exposure inside a fixed limit', 'Separate market evidence from urgency or fear of missing out'] },
  IP: { name: 'Income Preservation', short: 'A durability-oriented system for preserving capital and producing dependable income.', structure: ['Preservation core', 'Income layer', 'Measured growth sleeve'], rules: ['Match near-term needs with dependable assets', 'Do not reach for yield without reviewing risk', 'Review purchasing-power and income needs annually'] },
  ES: { name: 'Effortless & Simple', short: 'A low-maintenance system designed to reduce decision overload and support consistency.', structure: ['Simple diversified core', 'Automated contributions', 'Minimal review cadence'], rules: ['Automate routine contributions', 'Use one scheduled review', 'Change only when goals, timeline, or allocation meaningfully change'] }
};

const OPTION_LOGIC = {
  setup: {
    etfs: { archetype:{GD:3,ES:2}, stage:{foundation_builder:1,portfolio_organizer:1}, style:{guided_autopilot:2,steady_steward:2}, modifier:{confidence_builder:1}, signals:['passive foundation','long-term consistency'] },
    robo: { archetype:{ES:3,GD:2}, stage:{foundation_builder:3}, style:{guided_autopilot:3}, modifier:{instruction_seeker:1}, signals:['delegated allocation','automation preference'] },
    stocks: { archetype:{FT:2,TO:1}, stage:{portfolio_organizer:2,system_builder:1}, style:{systematic_improver:1,bounded_explorer:1}, modifier:{optimization_mindset:1}, signals:['active choice experience'] },
    communities: { archetype:{FT:1,TO:2,GA:1}, stage:{portfolio_organizer:1,system_builder:1}, style:{bounded_explorer:2,active_navigator:1}, modifier:{validation_seeker:2,opportunity_chaser:1}, signals:['external information seeking'] },
    experimenting: { archetype:{GA:3,TO:2}, stage:{system_builder:2,intentional_optimizer:1}, style:{bounded_explorer:3}, modifier:{opportunity_chaser:2}, signals:['exploration beyond core'] }
  },
  transition: {
    rightway: { stage:{portfolio_organizer:2}, modifier:{validation_seeker:4,confidence_builder:1}, style:{steady_steward:1}, signals:['validation need'] },
    basicnotenough: { stage:{system_builder:3}, modifier:{optimization_mindset:2}, style:{systematic_improver:2,bounded_explorer:1}, signals:['strategy evolution'] },
    returns: { stage:{intentional_optimizer:3}, modifier:{optimization_mindset:3}, style:{systematic_improver:3,active_navigator:1}, signals:['return improvement intent'] },
    toomany: { stage:{portfolio_organizer:3}, modifier:{instruction_seeker:3,validation_seeker:1}, style:{guided_autopilot:1,steady_steward:1}, signals:['choice overload'] },
    confidence: { stage:{portfolio_organizer:2}, modifier:{validation_seeker:3,confidence_builder:2}, signals:['decision confidence need'] }
  },
  decisionStyle: {
    simple: { archetype:{ES:3,GD:2}, style:{guided_autopilot:3,steady_steward:2}, modifier:{confidence_builder:1}, signals:['simplicity preference'] },
    tradeoffs: { archetype:{BFO:2,FT:1}, stage:{system_builder:2}, style:{steady_steward:2,systematic_improver:1}, modifier:{validation_seeker:2}, signals:['tradeoff-first reasoning'] },
    research: { archetype:{FT:3}, stage:{intentional_optimizer:2}, style:{systematic_improver:3}, modifier:{optimization_mindset:2}, signals:['deep research preference'] },
    opportunities: { archetype:{TO:3,GA:1}, stage:{adaptive_investor:2}, style:{bounded_explorer:2,active_navigator:2}, modifier:{opportunity_chaser:3}, signals:['opportunity seeking'] },
    experienced: { archetype:{FT:1,BFO:1}, stage:{system_builder:1}, style:{systematic_improver:1}, modifier:{validation_seeker:3,instruction_seeker:1}, signals:['framework seeking'] }
  },
  marketPsychology: {
    staycourse: { modifier:{validation_seeker:2,confidence_builder:2}, style:{steady_steward:2}, signals:['stay-the-course uncertainty'] },
    missingopp: { modifier:{opportunity_chaser:4}, style:{bounded_explorer:2,active_navigator:1}, archetype:{TO:2,GA:1}, signals:['opportunity pressure'] },
    emotional: { modifier:{confidence_builder:4}, style:{guided_autopilot:2,steady_steward:1}, signals:['emotional intervention risk'] },
    fit: { modifier:{instruction_seeker:2,optimization_mindset:2}, stage:{system_builder:2}, style:{systematic_improver:2}, signals:['strategy fit uncertainty'] },
    noise: { modifier:{validation_seeker:2,instruction_seeker:2}, style:{systematic_improver:1,steady_steward:1}, signals:['information filtering need'] }
  },
  evolution: {
    structured: { archetype:{BFO:4}, stage:{system_builder:4}, style:{steady_steward:2,systematic_improver:1}, modifier:{instruction_seeker:1}, signals:['system building'] },
    analytical: { archetype:{FT:4}, stage:{intentional_optimizer:4}, style:{systematic_improver:4}, modifier:{optimization_mindset:3}, signals:['analytical evolution'] },
    growth: { archetype:{GA:3,TO:1}, stage:{system_builder:2}, style:{bounded_explorer:3}, modifier:{opportunity_chaser:2}, signals:['growth orientation'] },
    preservation: { archetype:{IP:4}, stage:{system_builder:1}, style:{steady_steward:3,guided_autopilot:1}, modifier:{confidence_builder:2}, signals:['preservation orientation'] },
    experimental: { archetype:{TO:3,GA:2}, stage:{adaptive_investor:3}, style:{bounded_explorer:2,active_navigator:3}, modifier:{opportunity_chaser:3}, signals:['active exploration'] }
  },
  tradeoff: {
    peace: { archetype:{IP:3,GD:1}, style:{guided_autopilot:2,steady_steward:2}, modifier:{confidence_builder:2}, signals:['peace of mind priority'] },
    complexity: { archetype:{FT:3}, style:{systematic_improver:3,bounded_explorer:1}, modifier:{optimization_mindset:2}, signals:['complexity tolerance'] },
    stability: { archetype:{IP:2,BFO:1}, style:{steady_steward:3}, modifier:{confidence_builder:1}, signals:['stability preference'] },
    control: { archetype:{FT:2,TO:2}, style:{systematic_improver:2,active_navigator:2}, modifier:{optimization_mindset:2}, signals:['control preference'] },
    avoidmistakes: { archetype:{BFO:3,GD:1}, style:{guided_autopilot:1,steady_steward:3}, modifier:{confidence_builder:2}, signals:['downside avoidance'] }
  },
  age: {
    under25: { metadata:{age:'under25'} }, '25-34': { metadata:{age:'25-34'} }, '35-44': { metadata:{age:'35-44'} }, '45-54': { metadata:{age:'45-54'} }, '55plus': { metadata:{age:'55plus'} }
  },
  goals: {
    wealth: { archetype:{GD:2,BFO:1}, style:{steady_steward:1}, signals:['long-term wealth'] },
    fi: { archetype:{FT:2,TO:1}, stage:{intentional_optimizer:1}, style:{systematic_improver:2}, modifier:{optimization_mindset:1}, signals:['financial independence'] },
    confidence: { modifier:{validation_seeker:3,confidence_builder:2}, signals:['confidence outcome'] },
    income: { archetype:{IP:3}, style:{steady_steward:1}, signals:['income goal'] },
    preservation: { archetype:{IP:3,GD:1}, style:{steady_steward:2}, signals:['capital preservation'] },
    highergrowth: { archetype:{GA:3,TO:1}, style:{bounded_explorer:2}, modifier:{opportunity_chaser:1}, signals:['higher growth goal'] }
  }
};


// User-facing result composition. Internal classifications stay hidden.
const SYSTEM_NARRATIVES = {
  BFO: {
    diagnosis: 'Your answers suggest that the main problem is not a lack of investments. It is making several reasonable choices work together as one plan.',
    systemNeed: 'A portfolio that balances long-term growth, stability, and selected opportunities without forcing every goal into the same investment.',
    structureIntro: 'The portfolio should have a dependable base, a stabilizing layer, and a clearly limited place for ideas that sit outside the core.'
  },
  GD: {
    diagnosis: 'Your answers suggest that repeated comparison and market noise may be creating more doubt than your portfolio actually requires.',
    systemNeed: 'A broadly diversified portfolio whose default action is consistency, with clear evidence required before anything changes.',
    structureIntro: 'The portfolio should make broad diversification the foundation and use scheduled or threshold-based reviews instead of constant monitoring.'
  },
  FT: {
    diagnosis: 'Your answers suggest that you do not want to accept or reject an investment on instinct alone. The blind spot is the lack of one repeatable comparison method.',
    systemNeed: 'A diversified portfolio that allows measured improvements only when the evidence, cost, and role of the strategy are explicit.',
    structureIntro: 'The portfolio should preserve a broad core while giving each added strategy a defined purpose, allocation range, and review test.'
  },
  GA: {
    diagnosis: 'Your answers suggest that you want more growth and more sources of return, but the growing number of ideas can make the full portfolio difficult to evaluate.',
    systemNeed: 'A stable long-term core with a fixed budget for higher-growth and alternative ideas, so exploration does not quietly become the whole strategy.',
    structureIntro: 'The portfolio should separate foundational holdings from growth and exploratory sleeves, each with its own limit and purpose.'
  },
  TO: {
    diagnosis: 'Your answers suggest that market changes and new opportunities often feel actionable. The blind spot is distinguishing a real signal from urgency.',
    systemNeed: 'A durable base portfolio plus a strictly limited decision budget for active ideas, with entry and exit conditions written before acting.',
    structureIntro: 'The portfolio should separate long-term capital from tactical capital so a short-term view cannot unintentionally rewrite the full plan.'
  },
  IP: {
    diagnosis: 'Your answers suggest that growth is no longer the only job of the portfolio. The difficult question is how much stability or income is enough without giving up the future.',
    systemNeed: 'A portfolio that first protects known needs and dependable income, then uses the remaining capital for measured long-term growth.',
    structureIntro: 'The portfolio should distinguish money that must remain dependable from money that can tolerate more uncertainty.'
  },
  ES: {
    diagnosis: 'Your answers suggest that decision overload—not a lack of investment options—is the main source of friction.',
    systemNeed: 'A small number of diversified holdings, automated contributions, and very few reasons to intervene.',
    structureIntro: 'The portfolio should reduce the number of independent decisions and make inaction the default unless a goal, timeline, or allocation meaningfully changes.'
  }
};

const OPERATING_NEEDS = {
  guided_autopilot: 'Routine investing should happen automatically. Attention should be requested only when a goal, timeline, or allocation moves outside a meaningful boundary.',
  steady_steward: 'The portfolio should be easy to leave alone between light check-ins, while still making important changes understandable before you approve them.',
  systematic_improver: 'Every review should use the same comparison criteria, so improvement does not turn into constant strategy switching.',
  bounded_explorer: 'New ideas should be evaluated inside a fixed exploration budget rather than competing directly with the long-term core.',
  active_navigator: 'Active decisions need a written thesis, size, trigger, and exit condition so market attention does not replace portfolio discipline.'
};

const CONFIDENCE_NEEDS = {
  validation_seeker: 'Before a major change, show the evidence from your goals, current holdings, and prior answers so the decision does not depend on outside reassurance alone.',
  opportunity_chaser: 'Make the cost of adding a new idea visible: what it replaces, how much risk it adds, and whether it remains inside the opportunity limit.',
  instruction_seeker: 'Translate each concern into an explicit next step: review, rebalance, research further, or leave the portfolio unchanged.',
  confidence_builder: 'Use predetermined review points and decision thresholds so normal volatility does not force the portfolio back into question.',
  optimization_mindset: 'Require every proposed improvement to identify the problem it solves and the evidence that would justify keeping it.'
};

const QUESTION_MEANINGS = {
  setup: 'How the portfolio accumulated—and whether its parts currently form one plan',
  transition: 'The unresolved question that repeatedly sends you back for more information',
  decisionStyle: 'What kind of evidence helps you move from research to a decision',
  marketPsychology: 'Which decision becomes hardest to trust when uncertainty rises',
  evolution: 'What feels incomplete in the way the portfolio is organized today',
  tradeoff: 'Which unavoidable compromise you are most likely to stay committed to',
  age: 'How close financial needs may be and how costly an unnecessary change could become',
  goals: 'What the portfolio must accomplish before any return opportunity is considered'
};

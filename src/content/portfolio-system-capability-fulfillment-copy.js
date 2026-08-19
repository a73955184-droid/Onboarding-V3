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


export const PORTFOLIO_SYSTEM_CAPABILITY_FULFILLMENT = Object.freeze({
  "portfolio-architecture-framework": Object.freeze({
    ES: "Effortless builds around a small set of broad growth, stability, and liquidity roles so the portfolio stays understandable and low-maintenance.",
    GD: "Global Diversified builds the foundation across multiple geographic and economic return sources so no single market carries the portfolio.",
    FT: "Factor Tilt keeps a durable diversified core dominant and reserves separate capacity only for improvements that solve a defined portfolio limitation.",
    BFO: "Balanced Multi-Purpose organizes capital by purpose, assigning growth, stability, liquidity, income, and diversification distinct portfolio jobs.",
    GA: "Growth & Alternatives keeps growth as the main engine while reserving bounded roles for alternatives, real assets, and differentiated return sources.",
    TO: "Opportunity Portfolio separates permanent long-term capital from explicit opportunity capacity so tactical decisions cannot redefine the core.",
    IP: "Income Preservation separates liquidity, dependable income, resilience, inflation protection, and measured growth according to real-world capital needs."
  }),

  "foundation-diagnostic-framework": Object.freeze({
    ES: "Effortless checks whether the basic growth, stability, and access jobs are already covered before adding anything else.",
    GD: "Global Diversified checks whether the portfolio is overly dependent on one country, region, asset class, or return driver.",
    FT: "Factor Tilt checks whether the core is sound first, then identifies a specific weakness worth improving.",
    BFO: "Balanced Multi-Purpose checks whether each important financial job has enough dedicated capital and whether any job is missing or overrepresented.",
    GA: "Growth & Alternatives checks whether the growth foundation is sufficiently strong before asking whether alternatives add distinct economic exposure.",
    TO: "Opportunity Portfolio checks whether permanent capital is properly protected before allocating anything to active opportunities.",
    IP: "Income Preservation checks whether liquidity, income reliability, resilience, and purchasing-power needs are sufficiently covered before pursuing additional return."
  }),

  "portfolio-role-mapping-framework": Object.freeze({
    ES: "Effortless maps each holding to one of a few essential portfolio purposes.",
    GD: "Global Diversified maps holdings to geographic and economic exposure roles so diversification can be seen explicitly.",
    FT: "Factor Tilt distinguishes strategic-core holdings from exposures added for a stated improvement purpose.",
    BFO: "Balanced Multi-Purpose maps each holding to the financial job it serves, such as growth, income, liquidity, stability, or diversification.",
    GA: "Growth & Alternatives maps holdings to growth-core, enhancer, alternative, real-asset, stability, or opportunity roles.",
    TO: "Opportunity Portfolio maps holdings to permanent-core versus tactical, thematic, security-specific, or reserve roles.",
    IP: "Income Preservation maps holdings to access, income, fixed-income resilience, inflation protection, or measured-growth responsibilities."
  }),

  "portfolio-reconciliation-framework": Object.freeze({
    ES: "Effortless identifies holdings that duplicate a basic role or no longer have an obvious place in the simple structure.",
    GD: "Global Diversified identifies concentration or redundant exposures that undermine the intended global balance.",
    FT: "Factor Tilt reconciles holdings against the core and each improvement thesis, exposing non-core positions with no remaining purpose.",
    BFO: "Balanced Multi-Purpose reconciles holdings against the set of financial jobs and flags overlap or holdings with no distinct responsibility.",
    GA: "Growth & Alternatives checks whether alternative or growth-enhancing positions add genuinely different return drivers instead of duplicating the core.",
    TO: "Opportunity Portfolio separates strategic holdings from accumulated tactical ideas and removes opportunities that no longer justify their bounded capital.",
    IP: "Income Preservation reconciles holdings against income, liquidity, resilience, inflation, and growth needs so higher-risk positions do not blur preservation roles."
  }),

  "controlled-improvement-framework": Object.freeze({
    ES: "Effortless permits change only when the benefit is clear enough to justify extra complexity.",
    GD: "Global Diversified permits changes when they meaningfully improve diversification or reduce concentration.",
    FT: "Factor Tilt makes improvement explicit: identify the limitation, select a bounded intervention, and justify its cost, complexity, and effort.",
    BFO: "Balanced Multi-Purpose improves one portfolio job without allowing the change to undermine the other jobs the system must perform.",
    GA: "Growth & Alternatives allows enhancements and alternatives only when they add differentiated return potential while keeping the growth core dominant.",
    TO: "Opportunity Portfolio allows active changes inside bounded opportunity capital while the long-term base remains governed by strategic rules.",
    IP: "Income Preservation allows adjustments only when they improve income reliability, resilience, access, or measured growth without compromising capital needs."
  }),

  "decision-framing-framework": Object.freeze({
    ES: "Effortless reduces the question to whether a basic role is missing, broken, or best left alone.",
    GD: "Global Diversified frames the decision around what concentration or diversification problem is actually being solved.",
    FT: "Factor Tilt frames decisions around a specific weakness in the existing portfolio and whether a proposed improvement addresses it.",
    BFO: "Balanced Multi-Purpose frames the decision around which financial job is affected and what that job now needs.",
    GA: "Growth & Alternatives frames new ideas around whether they belong in the growth core, an enhancer, an alternative, or another bounded role.",
    TO: "Opportunity Portfolio frames decisions around whether the issue belongs to permanent capital or the opportunity area.",
    IP: "Income Preservation frames decisions around whether the issue affects access, dependable income, preservation, purchasing power, or long-term growth."
  }),

  "decision-validation-framework": Object.freeze({
    ES: "Effortless validates a decision by checking whether the holding still performs its simple intended role.",
    GD: "Global Diversified validates whether the exposure still contributes to the desired geographic or economic diversification.",
    FT: "Factor Tilt validates a non-core position against the original evidence and improvement thesis that justified it.",
    BFO: "Balanced Multi-Purpose validates each investment against the financial job it is supposed to perform.",
    GA: "Growth & Alternatives validates alternative and enhancer positions against the distinct return or diversification role they were meant to add.",
    TO: "Opportunity Portfolio validates tactical positions against their specific thesis while protecting permanent capital from short-term reconsideration.",
    IP: "Income Preservation validates holdings against income, liquidity, resilience, inflation, or measured-growth requirements rather than headline performance alone."
  }),

  "gap-and-redundancy-framework": Object.freeze({
    ES: "Effortless treats a gap as a missing essential role and redundancy as another holding doing the same simple job.",
    GD: "Global Diversified treats a gap as an underrepresented geographic or economic source and redundancy as more exposure to a source the portfolio already depends on.",
    FT: "Factor Tilt treats a gap as a defined limitation in the core and redundancy as a non-core exposure that does not create a distinct improvement.",
    BFO: "Balanced Multi-Purpose treats a gap as an important financial job lacking support and redundancy as multiple holdings performing the same job without improving it.",
    GA: "Growth & Alternatives treats a gap as a missing differentiated return source and redundancy as an alternative or enhancer that behaves too much like the existing growth core.",
    TO: "Opportunity Portfolio treats a gap as a reason to allocate bounded opportunity capital and redundancy as tactical ideas that recreate exposures already held in the permanent core.",
    IP: "Income Preservation treats a gap as a real-world need such as liquidity, income, or inflation protection lacking coverage and redundancy as capital serving the same preservation job twice."
  }),

  "change-detection-framework": Object.freeze({
    ES: "Effortless treats ordinary volatility as noise unless a basic role or investor need has materially changed.",
    GD: "Global Diversified looks for changes that alter the portfolio’s concentration or diversification structure rather than reacting to one market’s movement.",
    FT: "Factor Tilt looks for changes in the evidence supporting a targeted improvement, not merely price volatility.",
    BFO: "Balanced Multi-Purpose detects whether a specific financial job is no longer being performed adequately.",
    GA: "Growth & Alternatives detects when an alternative exposure stops adding distinct behavior or when the growth/alternative balance becomes distorted.",
    TO: "Opportunity Portfolio detects when a tactical thesis changes while keeping the permanent core insulated from ordinary market views.",
    IP: "Income Preservation detects changes in spending needs, income reliability, liquidity, duration, or inflation exposure that could impair capital support."
  }),

  "comparison-framework": Object.freeze({
    ES: "Effortless compares options on how simply and reliably they perform the required basic role.",
    GD: "Global Diversified compares options on whether they improve geographic or economic diversification.",
    FT: "Factor Tilt compares candidates on the quality of the improvement, evidence, overlap, cost, and added complexity.",
    BFO: "Balanced Multi-Purpose compares candidates using criteria specific to the financial job they are expected to perform.",
    GA: "Growth & Alternatives compares alternatives by their distinct economic drivers, contribution to growth/diversification, and impact on complexity.",
    TO: "Opportunity Portfolio compares tactical candidates by thesis strength, expected contribution, downside, and fit within bounded opportunity capital.",
    IP: "Income Preservation compares choices based on income reliability, access, resilience, inflation sensitivity, and suitability for the relevant time horizon."
  }),

  "starting-decision-framework": Object.freeze({
    ES: "Effortless establishes the essential growth, stability, and access structure first.",
    GD: "Global Diversified starts by establishing meaningful exposure to more than one market and return source.",
    FT: "Factor Tilt starts with a durable diversified core, then addresses the clearest improvement opportunity.",
    BFO: "Balanced Multi-Purpose starts by identifying the investor’s major financial jobs and assigning capital to each.",
    GA: "Growth & Alternatives starts with a dominant growth foundation before introducing differentiated alternatives.",
    TO: "Opportunity Portfolio starts by protecting the permanent long-term base before opening opportunity capacity.",
    IP: "Income Preservation starts by separating near-term access and dependable needs from money that can remain invested for measured growth."
  }),

  "role-based-selection-framework": Object.freeze({
    ES: "Effortless selects holdings that perform a basic role broadly, simply, and with low maintenance.",
    GD: "Global Diversified selects exposures according to the geographic/economic diversification role they add.",
    FT: "Factor Tilt selects non-core exposures only when they efficiently deliver a targeted systematic improvement.",
    BFO: "Balanced Multi-Purpose selects investments according to the requirements of their assigned financial job.",
    GA: "Growth & Alternatives selects investments according to whether they belong to the growth core or add a distinct alternative/economic return source.",
    TO: "Opportunity Portfolio selects permanent holdings for durability and opportunity holdings for a bounded, explicit active thesis.",
    IP: "Income Preservation selects holdings according to their access, income, resilience, inflation-protection, or measured-growth responsibility."
  }),

  "fit-evaluation-framework": Object.freeze({
    ES: "Effortless accepts an idea only if it fills a real basic role or meaningfully improves an existing one without unnecessary complexity.",
    GD: "Global Diversified accepts an idea when it reduces concentration or adds a genuinely different geographic or economic return source.",
    FT: "Factor Tilt accepts an idea when it solves a defined limitation in the strategic core and its improvement justifies added complexity and effort.",
    BFO: "Balanced Multi-Purpose accepts an idea when it has a clear financial job, that job needs additional support, and the addition does not undermine other portfolio purposes.",
    GA: "Growth & Alternatives accepts an idea when it strengthens growth or contributes a genuinely differentiated alternative or real-asset return driver while remaining bounded.",
    TO: "Opportunity Portfolio accepts an idea when it clearly belongs either in the permanent core or within defined opportunity capacity and respects that boundary.",
    IP: "Income Preservation accepts an idea when it directly supports liquidity, dependable income, resilience, inflation protection, or measured growth without putting required capital at inappropriate risk."
  }),

  "action-decision-framework": Object.freeze({
    ES: "Effortless defaults to leave alone unless a basic role or investor need has materially changed.",
    GD: "Global Diversified acts when concentration, regional balance, or diversification materially departs from the intended structure.",
    FT: "Factor Tilt acts when the evidence or expected benefit behind a targeted improvement materially changes.",
    BFO: "Balanced Multi-Purpose acts according to whether the affected portfolio job is still being fulfilled.",
    GA: "Growth & Alternatives acts when the growth-core/alternative balance changes or a differentiated return source no longer serves its purpose.",
    TO: "Opportunity Portfolio acts on tactical positions according to their thesis while keeping permanent capital outside ordinary active decisions.",
    IP: "Income Preservation acts when access, income reliability, resilience, inflation exposure, or capital needs change materially."
  }),

  "research-stopping-framework": Object.freeze({
    ES: "Effortless stops once there is enough information to determine whether an option performs the basic role simply and adequately.",
    GD: "Global Diversified stops once the diversification contribution and overlap are clear enough to make the decision.",
    FT: "Factor Tilt stops when the evidence is sufficient to judge whether the proposed improvement genuinely solves the identified limitation.",
    BFO: "Balanced Multi-Purpose stops once there is enough information to determine whether the investment performs its assigned financial job.",
    GA: "Growth & Alternatives stops once the differentiated return driver, role, risk, and boundary are understood well enough to judge the alternative.",
    TO: "Opportunity Portfolio stops when the tactical thesis, expected contribution, risk, and exit conditions are sufficiently defined.",
    IP: "Income Preservation stops when the investor can judge whether the holding meets the relevant income, liquidity, preservation, or growth requirement."
  }),

  "balance-attribution-framework": Object.freeze({
    ES: "Effortless attributes account movement to the few broad growth, stability, and liquidity roles.",
    GD: "Global Diversified attributes outcomes across regional and economic return sources to reveal concentration effects.",
    FT: "Factor Tilt separates the contribution of the durable core from targeted improvements.",
    BFO: "Balanced Multi-Purpose attributes performance and risk to the different financial jobs the portfolio is supporting.",
    GA: "Growth & Alternatives separates contribution from the growth core, enhancers, alternatives, real assets, and stability roles.",
    TO: "Opportunity Portfolio separates permanent-core results from tactical and security-specific opportunity outcomes.",
    IP: "Income Preservation separates income, fixed-income resilience, liquidity, inflation protection, and measured-growth contribution."
  }),

  "market-signal-filtering-framework": Object.freeze({
    ES: "Effortless filters out information that does not affect a basic role or require a real decision.",
    GD: "Global Diversified prioritizes signals that change the diversification benefit or risk of a geographic or economic exposure.",
    FT: "Factor Tilt prioritizes information that changes the evidence behind a systematic improvement.",
    BFO: "Balanced Multi-Purpose routes signals to the particular financial job they can affect.",
    GA: "Growth & Alternatives prioritizes signals that change an alternative exposure’s economic driver or the portfolio’s growth/alternative balance.",
    TO: "Opportunity Portfolio filters information based on whether it affects the permanent core or a specific tactical thesis.",
    IP: "Income Preservation prioritizes signals affecting income reliability, rates, inflation, liquidity, or capital resilience."
  }),

  "holding-thesis-review-framework": Object.freeze({
    ES: "Effortless reviews whether the holding still performs its basic assigned job.",
    GD: "Global Diversified reviews whether the holding still provides the intended diversification source.",
    FT: "Factor Tilt reviews whether the position still delivers the targeted improvement relative to the core.",
    BFO: "Balanced Multi-Purpose reviews whether the holding still performs the financial job for which it was assigned.",
    GA: "Growth & Alternatives reviews whether the alternative or enhancer still provides a distinct return or diversification contribution.",
    TO: "Opportunity Portfolio reviews tactical holdings against their explicit thesis and permanent holdings against their long-term role.",
    IP: "Income Preservation reviews whether the holding still supports dependable income, liquidity, resilience, inflation protection, or measured growth."
  }),

  "idea-intake-framework": Object.freeze({
    ES: "Effortless requires every new idea to demonstrate a basic portfolio purpose before consideration.",
    GD: "Global Diversified requires the idea to identify the concentration or diversification problem it addresses.",
    FT: "Factor Tilt requires the idea to identify the portfolio limitation it is intended to improve.",
    BFO: "Balanced Multi-Purpose requires the idea to identify which financial job it belongs to before it can be evaluated.",
    GA: "Growth & Alternatives requires the idea to identify whether it is a growth enhancer, alternative driver, real asset, or other bounded role.",
    TO: "Opportunity Portfolio requires the idea to enter through the opportunity area unless it meets the standards of permanent strategic capital.",
    IP: "Income Preservation requires the idea to show which real-world capital need it supports before entering the system."
  }),

  "decision-relevant-alerting-framework": Object.freeze({
    ES: "Effortless alerts only when a basic role, investor need, or meaningful review condition changes.",
    GD: "Global Diversified alerts when concentration or a diversification source changes enough to affect the system.",
    FT: "Factor Tilt alerts when evidence relevant to an improvement thesis changes materially.",
    BFO: "Balanced Multi-Purpose alerts the investor when a specific financial job may require review.",
    GA: "Growth & Alternatives alerts when an alternative exposure or growth/alternative balance may no longer serve its intended purpose.",
    TO: "Opportunity Portfolio alerts tactical positions when their thesis or risk changes while limiting alerts on stable permanent capital.",
    IP: "Income Preservation alerts when liquidity, income, duration, inflation, or resilience conditions threaten real-world capital needs."
  }),

  "portfolio-role-definition-framework": Object.freeze({
    ES: "Effortless uses a few broad roles so every portfolio part has an easy-to-understand purpose.",
    GD: "Global Diversified defines roles by geography and economic return source to make diversification explicit.",
    FT: "Factor Tilt defines a strategic-core role and explicit targeted-improvement roles.",
    BFO: "Balanced Multi-Purpose defines separate roles for growth, stability, liquidity, income, diversification, real assets, and selective opportunities.",
    GA: "Growth & Alternatives defines a dominant growth role plus bounded enhancer, alternative, real-asset, stability, and opportunity roles.",
    TO: "Opportunity Portfolio defines permanent strategic roles separately from tactical, thematic, security-specific, and opportunity-capacity roles.",
    IP: "Income Preservation defines roles around access, dependable income, fixed-income resilience, inflation protection, and measured growth."
  }),

  "role-based-monitoring-framework": Object.freeze({
    ES: "Effortless monitors each basic role only for information capable of changing its job.",
    GD: "Global Diversified monitors regional and economic sources for changes that alter their diversification contribution.",
    FT: "Factor Tilt monitors the core broadly and targeted improvements for thesis-specific evidence.",
    BFO: "Balanced Multi-Purpose gives each financial job its own monitoring criteria.",
    GA: "Growth & Alternatives monitors the growth core differently from alternatives, real assets, and opportunity exposures.",
    TO: "Opportunity Portfolio monitors permanent capital strategically and opportunity sleeves against more specific tactical signals.",
    IP: "Income Preservation monitors liquidity, rates, income quality, inflation, and growth according to the job each sleeve performs."
  }),

  "review-cadence-framework": Object.freeze({
    ES: "Effortless uses infrequent planned reviews with exception-based attention between them.",
    GD: "Global Diversified reviews broad diversification periodically and when meaningful concentration changes occur.",
    FT: "Factor Tilt reviews the core steadily while giving targeted improvements more thesis-specific review.",
    BFO: "Balanced Multi-Purpose allows each financial job to operate on the cadence appropriate to its purpose.",
    GA: "Growth & Alternatives keeps the growth core on a stable cadence while differentiated exposures can require more targeted review.",
    TO: "Opportunity Portfolio uses slower review for permanent capital and more active review for tactical opportunity sleeves.",
    IP: "Income Preservation uses cadence based on spending needs, income requirements, duration, liquidity, and inflation exposure."
  }),

  "effort-allocation-framework": Object.freeze({
    ES: "Effortless concentrates effort only on decisions that can materially improve the simple system.",
    GD: "Global Diversified concentrates effort on understanding and correcting meaningful concentration rather than continuously researching markets.",
    FT: "Factor Tilt concentrates research effort where a deliberate portfolio improvement is being attempted.",
    BFO: "Balanced Multi-Purpose allocates effort according to the complexity and importance of each financial job.",
    GA: "Growth & Alternatives concentrates more research on alternatives and differentiated return sources while keeping the growth core comparatively low effort.",
    TO: "Opportunity Portfolio concentrates active effort inside bounded opportunity capacity while the permanent core stays lower effort.",
    IP: "Income Preservation concentrates effort on protecting real-world cash-flow, liquidity, and preservation needs before pursuing optional growth research."
  }),

  "bounded-experimentation-framework": Object.freeze({
    ES: "Effortless allows experimentation only in small, clearly separated amounts that cannot compromise simplicity.",
    GD: "Global Diversified allows new exposures only when they improve diversification without creating a concentrated bet.",
    FT: "Factor Tilt allows experimental improvement only with a stated purpose, bounded size, and evidence-based review conditions.",
    BFO: "Balanced Multi-Purpose keeps experiments inside a defined financial job and prevents them from consuming capital assigned to other purposes.",
    GA: "Growth & Alternatives explicitly allows bounded alternative and differentiated-return experimentation while protecting the growth foundation.",
    TO: "Opportunity Portfolio makes bounded experimentation a native function of the opportunity area while shielding permanent capital.",
    IP: "Income Preservation keeps experimentation separate from capital required for liquidity, income, and preservation."
  }),

  "guided-interaction-framework": Object.freeze({
    ES: "Effortless guides the investor through a small number of setup, review, and exception decisions.",
    GD: "Global Diversified guides attention toward the diversification decisions that materially affect concentration.",
    FT: "Factor Tilt guides the investor from identifying a limitation to evaluating and monitoring a targeted improvement.",
    BFO: "Balanced Multi-Purpose guides interaction by first identifying which financial job needs attention.",
    GA: "Growth & Alternatives guides the investor through evaluating differentiated return sources while preserving the growth-core boundary.",
    TO: "Opportunity Portfolio guides active decisions inside opportunity capacity while keeping permanent holdings out of routine tactical interaction.",
    IP: "Income Preservation guides decisions according to real-world spending, income, liquidity, and resilience needs."
  }),

  "exception-management-framework": Object.freeze({
    ES: "Effortless treats the simple portfolio as stable unless a meaningful role or investor need changes.",
    GD: "Global Diversified treats concentration or diversification breakdown as the primary exceptions worth escalating.",
    FT: "Factor Tilt treats changes in the improvement thesis as local exceptions rather than reasons to rebuild the entire portfolio.",
    BFO: "Balanced Multi-Purpose resolves exceptions inside the affected financial job unless they materially alter the whole system.",
    GA: "Growth & Alternatives handles exceptions within the relevant growth, alternative, real-asset, or stability sleeve.",
    TO: "Opportunity Portfolio contains tactical exceptions inside opportunity capital instead of allowing them to spill into permanent capital.",
    IP: "Income Preservation handles exceptions according to whether they threaten access, income reliability, resilience, inflation protection, or measured growth."
  }),

  "scheduled-review-framework": Object.freeze({
    ES: "Effortless bundles ordinary portfolio decisions into predictable low-frequency reviews.",
    GD: "Global Diversified periodically checks whether global exposures still provide the intended balance across markets and return sources.",
    FT: "Factor Tilt reviews the strategic core periodically and targeted improvements against their own evidence and purpose.",
    BFO: "Balanced Multi-Purpose reviews individual financial jobs on appropriate schedules and periodically checks how they work together.",
    GA: "Growth & Alternatives reviews the growth core steadily and alternatives according to their distinct behavior and thesis.",
    TO: "Opportunity Portfolio reviews permanent capital strategically while tactical positions receive more frequent thesis-based review.",
    IP: "Income Preservation reviews liquidity and spending needs as circumstances change, with income, duration, inflation, and growth reviewed according to their roles."
  }),

  "research-boundary-framework": Object.freeze({
    ES: "Effortless limits research to what is necessary to maintain the simple structure or make a meaningful exception decision.",
    GD: "Global Diversified limits research to whether an exposure materially changes diversification or concentration.",
    FT: "Factor Tilt bounds research around whether the improvement has adequate evidence and enough incremental value to justify implementation.",
    BFO: "Balanced Multi-Purpose limits research to what is required to make a sound decision for the affected financial job.",
    GA: "Growth & Alternatives gives deeper research to alternative exposures only when their distinct economic role can justify the complexity.",
    TO: "Opportunity Portfolio bounds research around the opportunity thesis, size, risk, time horizon, and exit conditions.",
    IP: "Income Preservation bounds research around whether the investment adequately serves income, liquidity, resilience, inflation, or growth requirements."
  }),

  "structured-engagement-framework": Object.freeze({
    ES: "Effortless structures engagement by deliberately minimizing routine portfolio activity.",
    GD: "Global Diversified structures engagement around maintaining diversification rather than frequent tactical repositioning.",
    FT: "Factor Tilt structures engagement around targeted improvement decisions while the core remains stable.",
    BFO: "Balanced Multi-Purpose lets engagement vary by financial job rather than forcing one activity level across the whole portfolio.",
    GA: "Growth & Alternatives supports deeper engagement with alternatives while preserving a relatively stable growth foundation.",
    TO: "Opportunity Portfolio explicitly supports active judgment in a bounded area while protecting the permanent portfolio.",
    IP: "Income Preservation structures engagement around managing real-world capital needs, with activity justified by changes in those needs rather than by market novelty."
  }),

  "near-term-capital-protection-framework": Object.freeze({
    ES: "Effortless keeps near-term money in stability and liquidity roles rather than relying on the growth core.",
    GD: "Global Diversified protects near-term money by separating it from volatile regional growth exposures while retaining broader diversification elsewhere.",
    FT: "Factor Tilt keeps capital needed soon outside targeted improvements whose payoff requires longer horizons or higher tolerance for volatility.",
    BFO: "Balanced Multi-Purpose assigns near-term capital to a dedicated liquidity or stability job separate from long-term growth and other objectives.",
    GA: "Growth & Alternatives keeps near-term money outside alternative and higher-growth exposures so the growth/alternative engine cannot compromise required access.",
    TO: "Opportunity Portfolio keeps near-term needs outside tactical and opportunity capital and protects them inside reserves or the permanent structure.",
    IP: "Income Preservation makes this capability central: liquidity and short-duration income are explicitly separated from measured long-term growth."
  }),

  "time-horizon-segmentation-framework": Object.freeze({
    ES: "Effortless uses simple role differences between near-term access, stability, and long-term growth.",
    GD: "Global Diversified applies different risk roles to capital while preserving broad diversification across long-term exposures.",
    FT: "Factor Tilt reserves targeted improvements primarily for capital whose horizon can support their intended effect.",
    BFO: "Balanced Multi-Purpose assigns different time horizons to different financial jobs so several objectives can coexist in one system.",
    GA: "Growth & Alternatives keeps long-horizon capital in growth/alternative roles while shorter-horizon money remains in stability or liquidity.",
    TO: "Opportunity Portfolio separates permanent long-horizon capital, tactical opportunity capital, and nearer-term reserves.",
    IP: "Income Preservation explicitly separates capital by access need, income horizon, preservation requirement, and measured-growth horizon."
  }),

  "horizon-transition-framework": Object.freeze({
    ES: "Effortless gradually shifts capital from growth toward stability and access as a need approaches.",
    GD: "Global Diversified reduces exposure to volatile growth sources while preserving diversification as the horizon shortens.",
    FT: "Factor Tilt scales back targeted improvements as capital moves closer to a spending or preservation horizon.",
    BFO: "Balanced Multi-Purpose moves capital between growth, stability, income, and liquidity jobs as the objective’s horizon changes.",
    GA: "Growth & Alternatives reduces higher-growth and alternative exposure as capital needs become more immediate.",
    TO: "Opportunity Portfolio moves capital out of tactical opportunity roles and toward permanent or reserve roles as the relevant horizon shortens.",
    IP: "Income Preservation makes transition explicit by moving capital from measured growth toward fixed income, short-duration income, and liquidity as needs approach."
  }),

  "long-term-discipline-framework": Object.freeze({
    ES: "Effortless protects the simple long-term structure from ordinary market noise and unnecessary intervention.",
    GD: "Global Diversified keeps diversified exposure across multiple markets instead of chasing whichever region recently performed best.",
    FT: "Factor Tilt keeps the strategic core dominant so targeted improvements cannot repeatedly redefine the long-term portfolio.",
    BFO: "Balanced Multi-Purpose protects each long-term objective by giving it its own persistent portfolio responsibility.",
    GA: "Growth & Alternatives keeps the growth foundation dominant even when alternative opportunities become attractive.",
    TO: "Opportunity Portfolio protects permanent capital from ordinary tactical views and short-term market narratives.",
    IP: "Income Preservation maintains measured growth only to the extent consistent with long-term income and preservation responsibilities."
  }),

  "goal-and-horizon-segmentation-framework": Object.freeze({
    ES: "Effortless uses a small number of broad roles to separate goals without creating excessive complexity.",
    GD: "Global Diversified maintains diversified long-term exposures while assigning more conservative roles to nearer-term goals.",
    FT: "Factor Tilt applies different improvement intensity according to each goal’s horizon and ability to tolerate non-core risk.",
    BFO: "Balanced Multi-Purpose makes this a native capability: each goal or capital purpose receives a distinct role and appropriate risk, return, access, and review policy.",
    GA: "Growth & Alternatives assigns alternative and growth capacity primarily to goals with sufficient time horizon while protecting nearer-term capital.",
    TO: "Opportunity Portfolio separates permanent goals, reserves, and bounded opportunity capital so tactical activity is not mistaken for goal funding.",
    IP: "Income Preservation makes this a native capability: liquidity, income, preservation, inflation protection, and measured growth correspond directly to different needs and horizons."
  }),

  "timeline-uncertainty-framework": Object.freeze({
    ES: "Effortless keeps the structure simple and flexible until the investor knows when the money will be needed.",
    GD: "Global Diversified maintains broad diversification while avoiding unnecessary concentration decisions until the horizon becomes clearer.",
    FT: "Factor Tilt keeps uncertain-horizon capital close to the strategic core rather than committing it to targeted enhancements prematurely.",
    BFO: "Balanced Multi-Purpose gives uncertain capital a flexible role until it can be assigned confidently to a specific financial job.",
    GA: "Growth & Alternatives keeps uncertain-horizon money out of higher-risk alternative roles until its purpose becomes clearer.",
    TO: "Opportunity Portfolio keeps uncertain capital outside aggressive opportunity sleeves until its strategic or tactical purpose is known.",
    IP: "Income Preservation holds uncertain-horizon capital in more flexible liquidity/resilience roles until dependable needs and growth capacity can be distinguished."
  }),

  "guided-start-framework": Object.freeze({
    ES: "Effortless starts with the smallest understandable set of diversified roles and defers optional decisions.",
    GD: "Global Diversified starts with meaningful global diversification rather than asking the investor to choose individual geographic bets.",
    FT: "Factor Tilt starts with a durable core and introduces one clearly justified improvement at a time.",
    BFO: "Balanced Multi-Purpose starts by identifying the investor’s fundamental financial jobs and assigning a clear role to each.",
    GA: "Growth & Alternatives starts with the growth foundation and adds only a limited differentiated return source when its purpose is clear.",
    TO: "Opportunity Portfolio starts with the permanent core and reserve, then creates explicit opportunity capacity if the investor needs active flexibility.",
    IP: "Income Preservation starts with liquidity, dependable income/stability, and measured growth according to the investor’s real-world capital needs."
  }),

  "whole-portfolio-mapping-framework": Object.freeze({
    ES: "Effortless shows how the few basic roles combine into one coherent low-complexity portfolio.",
    GD: "Global Diversified shows how domestic, international, diversifying, stability, and liquidity exposures combine to reduce reliance on one return source.",
    FT: "Factor Tilt shows how the core and each targeted improvement interact at the total-portfolio level.",
    BFO: "Balanced Multi-Purpose shows how growth, stability, liquidity, income, diversification, and opportunity jobs work together as one coordinated wealth system.",
    GA: "Growth & Alternatives shows how the growth core and alternative return sources interact without losing the growth orientation.",
    TO: "Opportunity Portfolio shows the boundary between permanent capital and active opportunity capital and how each contributes to the total system.",
    IP: "Income Preservation shows how liquidity, income, resilience, inflation protection, and measured growth collectively support real-world needs."
  }),

  "attention-prioritization-framework": Object.freeze({
    ES: "Effortless prioritizes only information capable of changing a basic role or decision.",
    GD: "Global Diversified prioritizes concentration and diversification changes over isolated market headlines.",
    FT: "Factor Tilt prioritizes the core rarely and directs more attention to evidence-sensitive targeted improvements.",
    BFO: "Balanced Multi-Purpose prioritizes whichever financial job currently has a meaningful decision at stake.",
    GA: "Growth & Alternatives prioritizes information relevant to differentiated return sources while leaving the broad growth core comparatively quiet.",
    TO: "Opportunity Portfolio directs most active attention to opportunity capital while keeping permanent capital on a slower strategic cadence.",
    IP: "Income Preservation prioritizes liquidity, income reliability, inflation, and resilience signals before optional return-seeking information."
  }),

  "action-threshold-framework": Object.freeze({
    ES: "Effortless requires meaningful evidence that a basic role is no longer working before changing the portfolio.",
    GD: "Global Diversified requires evidence that concentration or diversification has materially changed before rebalancing exposures.",
    FT: "Factor Tilt requires evidence that the improvement no longer solves its intended limitation or its cost/complexity is no longer justified.",
    BFO: "Balanced Multi-Purpose sets different action thresholds for different financial jobs according to their purpose.",
    GA: "Growth & Alternatives requires evidence that an alternative no longer adds distinct value, violates its boundary, or distorts the growth core.",
    TO: "Opportunity Portfolio uses explicit thesis and boundary conditions to determine when tactical positions warrant action while leaving the core alone.",
    IP: "Income Preservation sets action thresholds around access, income reliability, capital resilience, inflation risk, and real-world spending needs."
  }),

  "repeatable-selection-framework": Object.freeze({
    ES: "Effortless repeats the same simple sequence: identify the role, test the candidate, reject unnecessary complexity.",
    GD: "Global Diversified repeats a diversification test: identify concentration, find a distinct exposure, evaluate overlap and contribution.",
    FT: "Factor Tilt repeats an improvement process: define the limitation, specify the desired exposure, compare candidates, test overlap, and justify complexity.",
    BFO: "Balanced Multi-Purpose repeats a role-first process: define the financial job, set criteria, compare candidates, and test effects on the rest of the portfolio.",
    GA: "Growth & Alternatives repeats a growth/alternative fit process: identify the economic role, evaluate distinctiveness, bound the exposure, and test its contribution.",
    TO: "Opportunity Portfolio repeats an opportunity process: identify the thesis, determine whether it belongs in the active area, define size and exit conditions, then monitor.",
    IP: "Income Preservation repeats a needs-first process: define the access, income, preservation, or growth requirement and select the asset best suited to that responsibility."
  }),

  "exploration-governance-framework": Object.freeze({
    ES: "Effortless allows exploration only when it stays small and cannot compromise the simple foundation.",
    GD: "Global Diversified allows exploration when it improves diversification without becoming a concentrated regional or asset-class bet.",
    FT: "Factor Tilt allows exploration only as a bounded candidate improvement with explicit evidence and purpose.",
    BFO: "Balanced Multi-Purpose allows exploration inside a defined financial job while protecting capital assigned to other jobs.",
    GA: "Growth & Alternatives makes exploration an explicit bounded feature through alternatives, enhancers, real assets, and opportunity capacity.",
    TO: "Opportunity Portfolio makes exploration a core feature of the bounded opportunity area while keeping permanent capital protected.",
    IP: "Income Preservation allows exploration only with capital not required for liquidity, dependable income, resilience, or preservation."
  }),

  "income-and-capital-protection-framework": Object.freeze({
    ES: "Effortless separates stability and liquidity roles from long-term growth so required capital is not forced to take growth risk.",
    GD: "Global Diversified keeps stable and liquid roles alongside diversified growth exposure so diversification does not override capital needs.",
    FT: "Factor Tilt keeps income, stability, and liquidity responsibilities separate from targeted improvements.",
    BFO: "Balanced Multi-Purpose gives income, liquidity, stability, and growth distinct jobs so capital protection can coexist with wealth building.",
    GA: "Growth & Alternatives keeps stability and liquidity separate from the growth and alternative return engine so exploratory exposures do not compromise required capital.",
    TO: "Opportunity Portfolio keeps reserves and permanent capital separate from tactical opportunities so active decisions cannot consume money needed for stability or access.",
    IP: "Income Preservation makes this a defining capability: dependable income, liquidity, resilience, inflation protection, and measured growth are deliberately separated and prioritized."
  })
});

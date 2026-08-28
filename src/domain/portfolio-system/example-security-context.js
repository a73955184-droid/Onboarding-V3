import {
  CONSTITUENT_PORTFOLIOS
} from './constituent-portfolios.js';

import {
  EXAMPLE_SECURITY_ASSOCIATIONS
} from './example-securities.js';


function profile({
  fit,
  limitation,
  diversification,
  risks,
  overlap,
  monitoring,
  reconsider
}) {
  return Object.freeze({
    fit,
    limitation,
    diversification,
    risks: Object.freeze(risks),
    overlap,
    monitoring,
    reconsider
  });
}


const CATEGORY_CONTEXT = Object.freeze({
  'global-equity': profile({
    fit: 'It can provide geographically broad equity participation through one exposure.',
    limitation: 'It remains exposed to global equity declines and cannot perform fixed-income or near-term access jobs.',
    diversification: 'It spreads exposure across countries, sectors and companies while retaining global equity-market dependency.',
    risks: ['equity-market-volatility', 'currency-risk', 'correlation-change'],
    overlap: 'Check whether existing United States and international funds already perform substantially the same job.',
    monitoring: 'Review geographic and company concentration together with allocation drift, rather than short-term price movement.',
    reconsider: 'Reconsider when separate regional control becomes necessary or the sleeve no longer has a long horizon.'
  }),

  'broad-us-equity': profile({
    fit: 'It can implement broad participation in the United States equity market.',
    limitation: 'It remains exposed to equity declines and to concentration in the United States market.',
    diversification: 'It spreads exposure across many United States companies and sectors but does not diversify country-level equity risk.',
    risks: ['equity-market-volatility', 'country-concentration', 'market-concentration'],
    overlap: 'Check whether another total-market or large-company fund already supplies similar United States exposure.',
    monitoring: 'Review market and company concentration and the sleeve allocation, rather than recent returns.',
    reconsider: 'Reconsider when the system requires a different geographic balance or a materially different growth role.'
  }),

  'broad-international-equity': profile({
    fit: 'It can provide developed and emerging equity exposure outside the United States in one position.',
    limitation: 'It remains exposed to equity declines, currency movements and different political and market structures.',
    diversification: 'It reduces dependence on the United States while retaining international equity and cross-market risk.',
    risks: ['equity-market-volatility', 'currency-risk', 'cross-market-risk'],
    overlap: 'Check whether regional or global funds already contain materially similar non-United States exposure.',
    monitoring: 'Review regional composition, currency exposure and allocation drift.',
    reconsider: 'Reconsider when developed and emerging markets need separate controls or the geographic mandate changes.'
  }),

  'developed-international-equity': profile({
    fit: 'It can isolate developed-market equity exposure outside the United States.',
    limitation: 'It remains exposed to currency movements, cross-market shocks and developed-market equity declines.',
    diversification: 'It broadens country and sector exposure while retaining developed-market and equity risk.',
    risks: ['equity-market-volatility', 'currency-risk', 'cross-market-risk'],
    overlap: 'Check whether broad international or global funds already contain the same developed markets.',
    monitoring: 'Review country weights, currency exposure and overlap with global holdings.',
    reconsider: 'Reconsider when the system no longer needs developed markets managed separately.'
  }),

  'emerging-market-equity': profile({
    fit: 'It can add equity exposure to economies and companies that are less represented in developed markets.',
    limitation: 'It can experience pronounced market, currency, governance and liquidity stress.',
    diversification: 'It adds different countries and growth drivers while retaining equity and cross-market dependency.',
    risks: ['equity-market-volatility', 'currency-risk', 'governance-risk', 'liquidity-risk'],
    overlap: 'Check how much emerging-market exposure is already embedded in global or broad international funds.',
    monitoring: 'Review country concentration, market accessibility, currency exposure and allocation drift.',
    reconsider: 'Reconsider when the added volatility or governance burden no longer fits the sleeve boundary.'
  }),

  'high-quality-bonds': profile({
    fit: 'It can supply broad investment-grade fixed-income exposure for the sleeve.',
    limitation: 'Bond prices can decline when interest rates rise, and some holdings carry credit or mortgage-related risk.',
    diversification: 'It can reduce reliance on equities while retaining interest-rate, duration and credit-market dependency.',
    risks: ['interest-rate-risk', 'duration-risk', 'credit-risk', 'inflation-risk'],
    overlap: 'Check whether other aggregate or government bond funds already cover the same maturities and issuers.',
    monitoring: 'Review duration, credit quality, sector composition and the role of fixed income in the system.',
    reconsider: 'Reconsider when the required duration, credit boundary or access horizon changes materially.'
  }),

  'government-bonds': profile({
    fit: 'It can provide diversified United States Treasury exposure across maturities.',
    limitation: 'Treasury funds remain exposed to interest-rate, duration and inflation risk.',
    diversification: 'It removes corporate credit exposure but continues to depend on the Treasury yield curve and traded bond markets.',
    risks: ['interest-rate-risk', 'duration-risk', 'inflation-risk'],
    overlap: 'Check whether aggregate bond funds already provide enough Treasury exposure for this job.',
    monitoring: 'Review duration, maturity distribution and sensitivity to changes in interest rates.',
    reconsider: 'Reconsider when the sleeve requires shorter duration, inflation linkage or a different access horizon.'
  }),

  'short-duration-bonds': profile({
    fit: 'It can provide investment-grade bond exposure with less duration than a broad bond-market fund.',
    limitation: 'Shorter duration limits but does not remove interest-rate, credit or market-price risk.',
    diversification: 'It can diversify equity exposure while retaining fixed-income and issuer dependencies.',
    risks: ['interest-rate-risk', 'credit-risk', 'inflation-risk', 'liquidity-risk'],
    overlap: 'Check whether a broad bond fund or short-government position already covers this maturity range.',
    monitoring: 'Review duration, credit composition and whether the holding still matches the planned access horizon.',
    reconsider: 'Reconsider when spending timing, credit tolerance or duration needs change.'
  }),

  'short-government-securities': profile({
    fit: 'It can provide short-maturity Treasury exposure for a planned-access role.',
    limitation: 'It is a traded security whose market value and income can change as rates and liquidity conditions change.',
    diversification: 'It limits credit exposure but remains dependent on short-term rates and Treasury-market functioning.',
    risks: ['interest-rate-risk', 'reinvestment-risk', 'market-price-risk', 'liquidity-risk'],
    overlap: 'Check whether another Treasury or reserve vehicle already covers the same time horizon.',
    monitoring: 'Review maturity exposure, trading liquidity and alignment with the expected use date.',
    reconsider: 'Reconsider when the access date changes or a deposit or money-market structure better matches the need.'
  }),

  'investment-grade-credit': profile({
    fit: 'It can add diversified investment-grade corporate bond exposure to an income role.',
    limitation: 'Income generation does not provide principal stability; credit spreads and interest rates can move prices lower.',
    diversification: 'It adds corporate income sources while retaining credit-cycle, duration and market-liquidity dependency.',
    risks: ['credit-risk', 'spread-risk', 'interest-rate-risk', 'duration-risk'],
    overlap: 'Check how much corporate credit is already held through aggregate bond funds.',
    monitoring: 'Review duration, issuer concentration, credit quality and spread conditions.',
    reconsider: 'Reconsider when credit quality, duration or income reliability no longer meets the sleeve boundary.'
  }),

  'inflation-protected-bonds': profile({
    fit: 'It can provide Treasury principal adjustments linked to measured inflation.',
    limitation: 'It can decline because of real-rate changes, duration and differences between measured inflation and personal costs.',
    diversification: 'It adds an inflation-sensitive bond exposure while retaining real-rate and Treasury-market dependency.',
    risks: ['real-interest-rate-risk', 'duration-risk', 'inflation-basis-risk'],
    overlap: 'Check whether another bond or real-asset position already supplies the intended inflation sensitivity.',
    monitoring: 'Review real-rate duration, maturity exposure and the size of the inflation-protection role.',
    reconsider: 'Reconsider when the inflation objective, time horizon or duration boundary changes.'
  }),

  'cash-equivalent': profile({
    fit: 'It can provide very short Treasury exposure for an access-oriented sleeve.',
    limitation: 'The ETF is not cash or a bank deposit; it remains a traded security with market, rate and liquidity considerations.',
    diversification: 'It limits duration and credit exposure while retaining short-rate, market-price and trading-liquidity dependency.',
    risks: ['market-price-risk', 'interest-rate-risk', 'reinvestment-risk', 'liquidity-risk'],
    overlap: 'Check whether bank deposits, money-market funds or another short Treasury vehicle already serve the same access need.',
    monitoring: 'Review trading liquidity, maturity profile and alignment with the timing of expected withdrawals.',
    reconsider: 'Reconsider when immediate access, account protections or a known spending date require a different vehicle.'
  }),

  'small-cap-equity': profile({
    fit: 'It can add diversified exposure to smaller United States companies.',
    limitation: 'Smaller companies can be more volatile and less liquid than the broad equity market.',
    diversification: 'It changes company-size exposure while retaining United States equity and economic-cycle dependency.',
    risks: ['equity-market-volatility', 'size-factor-risk', 'liquidity-risk'],
    overlap: 'Check how much small-company exposure is already present in total-market funds.',
    monitoring: 'Review size exposure, liquidity and drift relative to the broad equity allocation.',
    reconsider: 'Reconsider when the size exposure no longer has a distinct diversification job.'
  }),

  'small-value-equity': profile({
    fit: 'It can target smaller United States companies with value characteristics.',
    limitation: 'The factor exposure can lag the broad market for prolonged periods and add volatility and tracking error.',
    diversification: 'It changes size and valuation exposure while retaining United States equity and factor-cycle dependency.',
    risks: ['equity-market-volatility', 'tracking-error', 'factor-underperformance', 'liquidity-risk'],
    overlap: 'Check whether total-market, small-cap or value funds already create similar factor exposure.',
    monitoring: 'Review factor definition, size exposure, tracking error and adherence to the improvement thesis.',
    reconsider: 'Reconsider when the factor thesis or willingness to tolerate prolonged underperformance changes.'
  }),

  'growth-oriented-equity': profile({
    fit: 'It can create a distinct allocation to companies with growth characteristics.',
    limitation: 'Growth exposure can become concentrated and sensitive to valuation and interest-rate changes.',
    diversification: 'It changes equity style exposure but retains broad equity-market and growth-factor dependency.',
    risks: ['equity-market-volatility', 'valuation-risk', 'style-concentration', 'tracking-error'],
    overlap: 'Check how much growth exposure already exists in broad market, technology or thematic funds.',
    monitoring: 'Review sector concentration, valuations, tracking error and the continuing purpose of the style tilt.',
    reconsider: 'Reconsider when the growth allocation duplicates another sleeve or no longer has a distinct mandate.'
  }),

  'diversified-factor-equity': profile({
    fit: 'It can combine several systematic equity factors in one bounded improvement exposure.',
    limitation: 'Factor definitions can behave differently from the broad market and underperform for prolonged periods.',
    diversification: 'It broadens factor sources while retaining equity-market, model and tracking-error dependency.',
    risks: ['equity-market-volatility', 'model-risk', 'tracking-error', 'factor-underperformance'],
    overlap: 'Check whether existing style or factor funds already express the same characteristics.',
    monitoring: 'Review factor exposures, turnover, tracking error and whether the identified improvement remains present.',
    reconsider: 'Reconsider when the factor process changes or the improvement thesis no longer justifies the complexity.'
  }),

  'quality-factor-equity': profile({
    fit: 'It can target United States companies selected for defined quality characteristics.',
    limitation: 'Quality screens can become concentrated and may underperform the broad market for prolonged periods.',
    diversification: 'It changes company-characteristic exposure while retaining equity-market and factor-model dependency.',
    risks: ['equity-market-volatility', 'tracking-error', 'factor-underperformance', 'model-risk'],
    overlap: 'Check whether broad or multifactor holdings already have a strong quality tilt.',
    monitoring: 'Review factor methodology, sector concentration, tracking error and the stated improvement goal.',
    reconsider: 'Reconsider when the quality thesis no longer solves a distinct portfolio limitation.'
  }),

  'value-factor-equity': profile({
    fit: 'It can target United States companies selected for value characteristics.',
    limitation: 'Value exposure can underperform for prolonged periods and can concentrate in particular industries.',
    diversification: 'It changes valuation exposure while retaining equity-market, factor-cycle and tracking-error dependency.',
    risks: ['equity-market-volatility', 'tracking-error', 'factor-underperformance', 'sector-concentration'],
    overlap: 'Check whether broad, dividend or small-value holdings already create similar value exposure.',
    monitoring: 'Review factor methodology, sector weights, tracking error and consistency with the improvement thesis.',
    reconsider: 'Reconsider when the value tilt becomes redundant or its distinct portfolio job disappears.'
  }),

  'income-equity': profile({
    fit: 'It can provide dividend-oriented equity exposure within an income role.',
    limitation: 'Dividend income does not provide principal stability, and distributions and share prices can decline.',
    diversification: 'It adds an equity income source while retaining company, sector and equity-market dependency.',
    risks: ['equity-market-volatility', 'dividend-change-risk', 'sector-concentration'],
    overlap: 'Check whether broad equity or value funds already hold many of the same dividend-paying companies.',
    monitoring: 'Review sector concentration, dividend sustainability and the balance between income and equity risk.',
    reconsider: 'Reconsider when income reliability or principal-risk tolerance changes.'
  }),

  'income-opportunity': profile({
    fit: 'It can illustrate a specialized income exposure inside a bounded research sleeve.',
    limitation: 'Distributions do not provide principal stability, and preferred securities carry rate, credit and structural risks.',
    diversification: 'It adds a different income structure while retaining issuer, credit, duration and liquidity dependencies.',
    risks: ['credit-risk', 'interest-rate-risk', 'structural-risk', 'liquidity-risk'],
    overlap: 'Check whether corporate bonds, financial equities or other income funds already create similar issuer exposure.',
    monitoring: 'Review credit quality, sector concentration, call features, distribution coverage and market liquidity.',
    reconsider: 'Reconsider when the income thesis, credit boundary or research capacity changes.'
  }),

  'real-assets': profile({
    fit: 'It can illustrate one of several distinct real-asset implementations for the sleeve.',
    limitation: 'Real estate, infrastructure and gold respond to different drivers and must not be treated as interchangeable or automatically additive.',
    diversification: 'It can add real-economy or commodity sensitivity while retaining valuation, liquidity and changing-correlation dependencies.',
    risks: ['valuation-risk', 'liquidity-risk', 'interest-rate-risk', 'correlation-change'],
    overlap: 'Check for embedded real estate, infrastructure or commodity exposure and compare the exact job of each candidate.',
    monitoring: 'Review the selected implementation\'s valuation, liquidity, concentration and correlation with the rest of the system.',
    reconsider: 'Reconsider when the chosen real-asset exposure no longer performs the specific diversification or inflation-sensitive job.'
  }),

  'alternative-strategy': profile({
    fit: 'It can illustrate a rules-based or managed-futures approach to a bounded alternative-strategy role.',
    limitation: 'The strategy can be complex, use derivatives or leverage, and behave differently from its description over short periods.',
    diversification: 'It may introduce different return drivers while retaining model, leverage, counterparty, liquidity and correlation-change dependencies.',
    risks: ['complexity-risk', 'leverage-risk', 'derivatives-risk', 'liquidity-risk', 'correlation-change'],
    overlap: 'Check whether another alternative fund uses similar signals, markets, derivatives or risk exposures.',
    monitoring: 'Review strategy consistency, leverage, derivative exposures, liquidity and realized portfolio interactions.',
    reconsider: 'Reconsider when the strategy cannot be understood, monitored or tied to a distinct portfolio job.'
  }),

  'sector-equity': profile({
    fit: 'It can express a specific sector thesis inside a bounded tactical sleeve.',
    limitation: 'Sector exposure is concentrated and can be dominated by a small number of companies or one economic driver.',
    diversification: 'It changes sector weights but retains equity-market and sector-cycle dependency.',
    risks: ['equity-market-volatility', 'sector-concentration', 'valuation-risk', 'thesis-risk'],
    overlap: 'Check how much of the same sector and its largest companies already appear in broad or thematic funds.',
    monitoring: 'Review concentration, valuation, thesis milestones and the sleeve boundary.',
    reconsider: 'Reconsider when the explicit sector thesis expires, fails or becomes redundant.'
  }),

  'style-equity': profile({
    fit: 'It can express a defined growth or value style thesis within the tactical allocation.',
    limitation: 'A style tilt can underperform for prolonged periods and may duplicate exposures elsewhere.',
    diversification: 'It changes equity-style weights while retaining broad market, factor-cycle and tracking-error dependency.',
    risks: ['equity-market-volatility', 'tracking-error', 'factor-underperformance', 'style-concentration'],
    overlap: 'Check whether broad, factor or sector funds already produce the same style tilt.',
    monitoring: 'Review style purity, sector composition, tracking error and the continuing thesis.',
    reconsider: 'Reconsider when the style thesis expires or no longer has a distinct bounded purpose.'
  }),

  'thematic-equity': profile({
    fit: 'It can illustrate a focused theme inside a bounded research or opportunity sleeve.',
    limitation: 'A compelling theme can still produce concentrated exposure, high valuations and substantial losses.',
    diversification: 'It adds a theme-specific driver while retaining equity-market, concentration and thesis dependency.',
    risks: ['equity-market-volatility', 'theme-concentration', 'valuation-risk', 'thesis-risk'],
    overlap: 'Check whether broad, sector or other thematic holdings already own the same companies.',
    monitoring: 'Review holdings concentration, valuation, theme definition and explicit thesis milestones.',
    reconsider: 'Reconsider when the theme changes, the thesis fails or the exposure exceeds its boundary.'
  }),

  'selected-equity': profile({
    fit: 'It can serve as an example for evaluating a company-specific thesis within a bounded research sleeve.',
    limitation: 'A single company creates concentrated business, management, valuation and event risk and is not a default holding.',
    diversification: 'It adds company-specific exposure rather than broad diversification and remains dependent on one issuer.',
    risks: ['company-concentration', 'business-risk', 'valuation-risk', 'event-risk'],
    overlap: 'Check whether broad, sector or thematic funds already create meaningful exposure to the same company.',
    monitoring: 'Review the explicit company thesis, financial condition, valuation, position boundary and disconfirming evidence.',
    reconsider: 'Reconsider when the thesis fails, facts change or the position cannot be monitored at the required depth.'
  }),

  'broad-preference-fund': profile({
    fit: 'It can illustrate a broad equity screen used within a limited personal-preference sleeve.',
    limitation: 'A fund label or screening method does not establish alignment with any particular investor\'s values.',
    diversification: 'It can remain broadly diversified across United States equities while retaining market and screening-method dependency.',
    risks: ['equity-market-volatility', 'screening-method-risk', 'tracking-error'],
    overlap: 'Check whether the fund substantially duplicates the broad equity core after its exclusions are applied.',
    monitoring: 'Review the screening policy, holdings, exclusions, tracking error and continuing personal alignment.',
    reconsider: 'Reconsider when the screening method, holdings or investor-defined preference no longer align.'
  })
});


const PORTFOLIOS_BY_ID = new Map(
  Object.values(CONSTITUENT_PORTFOLIOS)
    .flatMap((variantMap) => Object.values(variantMap))
    .map((portfolio) => [portfolio.id, portfolio])
);


function createContext(association, securityId) {
  const portfolio = PORTFOLIOS_BY_ID.get(
    association.portfolioId
  );

  const sleeve = portfolio.sleeves.find(
    (candidate) =>
      candidate.id === association.sleeveId
  );

  const category =
    CATEGORY_CONTEXT[association.assetCategoryId];

  return Object.freeze({
    archetypeId: association.archetypeId,
    variantId: association.variantId,
    portfolioId: association.portfolioId,
    sleeveId: association.sleeveId,
    assetCategoryId: association.assetCategoryId,
    securityId,

    portfolioJob:
      portfolio.name + ': ' + sleeve.description,

    whyItFits:
      'For the ' + sleeve.label + ' sleeve, ' + category.fit,

    whyItMayNotFit:
      category.limitation,

    diversificationContribution:
      category.diversification,

    primaryRisks: category.risks,

    overlapCheck:
      category.overlap,

    monitoring:
      category.monitoring,

    reconsiderWhen:
      category.reconsider,

    exampleType: association.exampleType,

    disclosure:
      'This is an educational example of how the sleeve mandate could be implemented, not a direction for a transaction or position.'
  });
}


export const EXAMPLE_SECURITY_CONTEXTS = Object.freeze(
  EXAMPLE_SECURITY_ASSOCIATIONS.flatMap(
    (association) =>
      association.securityIds.map(
        (securityId) =>
          createContext(association, securityId)
      )
  )
);

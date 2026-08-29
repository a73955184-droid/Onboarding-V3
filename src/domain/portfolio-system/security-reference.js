import {
  PHASE_1_APPROVED_SECURITY_IDS
} from './security-category-universe.js';


const VERIFIED_AS_OF = '2026-08-28';


function createSecurity({
  id,
  name,
  securityType = 'ETF',
  issuer,
  exposureSummary,
  sourceUrl,
  verificationStatus = 'verified'
}) {
  return Object.freeze({
    id,
    symbol: id,
    name,
    securityType,
    issuer,
    exposureSummary,
    sourceUrl,
    verifiedAsOf: VERIFIED_AS_OF,
    verificationStatus
  });
}


const VANGUARD_URL =
  'https://investor.vanguard.com/investment-products/etfs/profile/';

const ISHARES_URL =
  'https://www.ishares.com/us/products/etf-investments';


export const SECURITY_REFERENCE = Object.freeze({
  VT: createSecurity({
    id: 'VT',
    name: 'Vanguard Total World Stock ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Broad exposure to developed and emerging equity markets.',
    sourceUrl: VANGUARD_URL + 'vt'
  }),

  VTI: createSecurity({
    id: 'VTI',
    name: 'Vanguard Morningstar Total Stock Market ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Broad exposure to the investable United States equity market.',
    sourceUrl: VANGUARD_URL + 'vti'
  }),

  VXUS: createSecurity({
    id: 'VXUS',
    name: 'Vanguard Total International Stock ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Broad exposure to developed and emerging equity markets outside the United States.',
    sourceUrl: VANGUARD_URL + 'vxus'
  }),

  VEA: createSecurity({
    id: 'VEA',
    name: 'Vanguard FTSE Developed Markets ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Equity exposure to developed markets outside the United States.',
    sourceUrl: VANGUARD_URL + 'vea'
  }),

  VWO: createSecurity({
    id: 'VWO',
    name: 'Vanguard FTSE Emerging Markets ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Equity exposure to companies in emerging markets.',
    sourceUrl: VANGUARD_URL + 'vwo'
  }),

  VB: createSecurity({
    id: 'VB',
    name: 'Vanguard Morningstar Small-Cap ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Diversified exposure to smaller United States companies.',
    sourceUrl: VANGUARD_URL + 'vb'
  }),

  VBR: createSecurity({
    id: 'VBR',
    name: 'Vanguard Morningstar Small-Cap Value ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Exposure to smaller United States companies with value characteristics.',
    sourceUrl: VANGUARD_URL + 'vbr'
  }),

  VUG: createSecurity({
    id: 'VUG',
    name: 'Vanguard Morningstar Growth ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Exposure to large United States companies with growth characteristics.',
    sourceUrl: VANGUARD_URL + 'vug'
  }),

  VFMF: createSecurity({
    id: 'VFMF',
    name: 'Vanguard U.S. Multifactor ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'United States equity exposure selected across multiple investment factors.',
    sourceUrl: VANGUARD_URL + 'vfmf'
  }),

  VNQ: createSecurity({
    id: 'VNQ',
    name: 'Vanguard Real Estate ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Equity exposure to United States real estate investment trusts and related companies.',
    sourceUrl: VANGUARD_URL + 'vnq'
  }),

  BND: createSecurity({
    id: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Broad exposure to the taxable investment-grade United States bond market.',
    sourceUrl: VANGUARD_URL + 'bnd'
  }),

  BNDW: createSecurity({
    id: 'BNDW',
    name: 'Vanguard Total World Bond ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Broad exposure to investment-grade bonds across global markets.',
    sourceUrl: VANGUARD_URL + 'bndw'
  }),

  BNDX: createSecurity({
    id: 'BNDX',
    name: 'Vanguard Total International Bond ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Broad exposure to investment-grade bonds issued outside the United States.',
    sourceUrl: VANGUARD_URL + 'bndx'
  }),

  BSV: createSecurity({
    id: 'BSV',
    name: 'Vanguard Short-Term Bond ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Exposure to shorter-maturity investment-grade United States bonds.',
    sourceUrl: VANGUARD_URL + 'bsv'
  }),

  VGSH: createSecurity({
    id: 'VGSH',
    name: 'Vanguard Short-Term Treasury ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Exposure to shorter-maturity United States Treasury securities.',
    sourceUrl: VANGUARD_URL + 'vgsh'
  }),

  ESGV: createSecurity({
    id: 'ESGV',
    name: 'Vanguard ESG U.S. Stock ETF',
    issuer: 'Vanguard',
    exposureSummary:
      'Broad United States equity exposure subject to the fund\'s environmental, social and governance screens.',
    sourceUrl: VANGUARD_URL + 'esgv'
  }),

  AGG: createSecurity({
    id: 'AGG',
    name: 'iShares Core U.S. Aggregate Bond ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Broad exposure to the United States investment-grade bond market.',
    sourceUrl: ISHARES_URL
  }),

  SGOV: createSecurity({
    id: 'SGOV',
    name: 'iShares 0-3 Month Treasury Bond ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Exposure to United States Treasury bonds with very short remaining maturities.',
    sourceUrl: ISHARES_URL
  }),

  TIP: createSecurity({
    id: 'TIP',
    name: 'iShares TIPS Bond ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Exposure to United States Treasury inflation-protected securities.',
    sourceUrl: ISHARES_URL
  }),

  GOVT: createSecurity({
    id: 'GOVT',
    name: 'iShares U.S. Treasury Bond ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Broad exposure to United States Treasury bonds across maturities.',
    sourceUrl: ISHARES_URL
  }),

  LQD: createSecurity({
    id: 'LQD',
    name: 'iShares iBoxx $ Investment Grade Corporate Bond ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Exposure to United States dollar-denominated investment-grade corporate bonds.',
    sourceUrl: ISHARES_URL
  }),

  QUAL: createSecurity({
    id: 'QUAL',
    name: 'iShares MSCI USA Quality Factor ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'United States equity exposure selected for quality characteristics.',
    sourceUrl: ISHARES_URL
  }),

  VLUE: createSecurity({
    id: 'VLUE',
    name: 'iShares MSCI USA Value Factor ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'United States equity exposure selected for value characteristics.',
    sourceUrl: ISHARES_URL
  }),

  IGF: createSecurity({
    id: 'IGF',
    name: 'iShares Global Infrastructure ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Global equity exposure to infrastructure companies.',
    sourceUrl: ISHARES_URL
  }),

  QAI: createSecurity({
    id: 'QAI',
    name: 'NYLI Hedge Multi-Strategy Tracker ETF',
    issuer: 'New York Life Investments',
    exposureSummary:
      'Rules-based exposure intended to represent multiple hedge-fund-style strategies.',
    sourceUrl: null,
    verificationStatus: 'pending'
  }),

  ICLN: createSecurity({
    id: 'ICLN',
    name: 'iShares Global Clean Energy ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Global equity exposure to companies associated with clean energy.',
    sourceUrl: ISHARES_URL
  }),

  SOXX: createSecurity({
    id: 'SOXX',
    name: 'iShares Semiconductor ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Concentrated equity exposure to the semiconductor industry.',
    sourceUrl: ISHARES_URL
  }),

  IWF: createSecurity({
    id: 'IWF',
    name: 'iShares Russell 1000 Growth ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Exposure to large and mid-sized United States companies with growth characteristics.',
    sourceUrl: ISHARES_URL
  }),

  IWD: createSecurity({
    id: 'IWD',
    name: 'iShares Russell 1000 Value ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Exposure to large and mid-sized United States companies with value characteristics.',
    sourceUrl: ISHARES_URL
  }),

  PFF: createSecurity({
    id: 'PFF',
    name: 'iShares Preferred and Income Securities ETF',
    issuer: 'BlackRock',
    exposureSummary:
      'Exposure to preferred and other income-oriented securities.',
    sourceUrl: ISHARES_URL
  }),

  SCHD: createSecurity({
    id: 'SCHD',
    name: 'Schwab U.S. Dividend Equity ETF',
    issuer: 'Schwab Asset Management',
    exposureSummary:
      'United States equity exposure selected using dividend and fundamental criteria.',
    sourceUrl: 'https://www.schwabassetmanagement.com/products/schd'
  }),

  GLDM: createSecurity({
    id: 'GLDM',
    name: 'SPDR Gold MiniShares Trust',
    securityType: 'Commodity trust',
    issuer: 'World Gold Trust',
    exposureSummary:
      'Shares designed to reflect the price of gold bullion less trust expenses.',
    sourceUrl:
      'https://www.ssga.com/us/en/individual/etfs/spdr-gold-minishares-gldm'
  }),

  XLK: createSecurity({
    id: 'XLK',
    name: 'State Street Technology Select Sector SPDR ETF',
    issuer: 'State Street Investment Management',
    exposureSummary:
      'Concentrated equity exposure to the technology sector of the United States large-cap market.',
    sourceUrl:
      'https://www.ssga.com/us/en/individual/etfs/state-street-technology-select-sector-spdr-etf-xlk'
  }),

  XLV: createSecurity({
    id: 'XLV',
    name: 'State Street Health Care Select Sector SPDR ETF',
    issuer: 'State Street Investment Management',
    exposureSummary:
      'Concentrated equity exposure to the health care sector of the United States large-cap market.',
    sourceUrl:
      'https://www.ssga.com/us/en/individual/etfs/state-street-health-care-select-sector-spdr-etf-xlv'
  }),

  DBMF: createSecurity({
    id: 'DBMF',
    name: 'iMGP DBi Managed Futures Strategy ETF',
    issuer: 'iM Global Partner Fund Management',
    exposureSummary:
      'Managed-futures exposure implemented through long and short positions across multiple markets.',
    sourceUrl:
      'https://imgpfunds.com/wp-content/uploads/2025/10/DBMF-September-2025-Deck-Final-V2.pdf'
  }),

  MSFT: createSecurity({
    id: 'MSFT',
    name: 'Microsoft Corporation',
    securityType: 'Individual equity',
    issuer: 'Microsoft Corporation',
    exposureSummary:
      'Ownership interest in a single technology company.',
    sourceUrl: 'https://www.microsoft.com/en-us/investor'
  }),

  JPM: createSecurity({
    id: 'JPM',
    name: 'JPMorgan Chase & Co.',
    securityType: 'Individual equity',
    issuer: 'JPMorgan Chase & Co.',
    exposureSummary:
      'Ownership interest in a single financial-services company.',
    sourceUrl: 'https://www.jpmorganchase.com/ir'
  })
});


function toPhaseOneSecurity(security) {
  const isVerified =
    security.verificationStatus === 'verified';

  return Object.freeze({
    securityId: security.id.toLowerCase(),
    ticker: security.symbol,
    name: security.name,
    issuer: security.issuer,
    securityType: security.securityType,
    sourceUrl: security.sourceUrl,
    verificationStatus: security.verificationStatus,
    verifiedAt:
      isVerified ? security.verifiedAsOf : null,
    activeStatus:
      isVerified ? 'active' : 'unknown',
    legacyId: security.id
  });
}


function createPendingPhaseOneSecurity(securityId) {
  return Object.freeze({
    securityId,
    ticker: securityId.toUpperCase(),
    name: null,
    issuer: null,
    securityType: null,
    sourceUrl: null,
    verificationStatus: 'pending',
    verifiedAt: null,
    activeStatus: 'unknown',
    legacyId: null
  });
}


const PHASE_ONE_EXISTING_SECURITIES = Object.values(
  SECURITY_REFERENCE
).map(toPhaseOneSecurity);


const PHASE_ONE_EXISTING_IDS = new Set(
  PHASE_ONE_EXISTING_SECURITIES.map(
    ({ securityId }) => securityId
  )
);


const PHASE_ONE_PENDING_SECURITIES =
  PHASE_1_APPROVED_SECURITY_IDS
    .filter(
      (securityId) =>
        !PHASE_ONE_EXISTING_IDS.has(securityId)
    )
    .map(createPendingPhaseOneSecurity);


export const PHASE_1_SECURITY_REFERENCE = Object.freeze(
  Object.fromEntries(
    [
      ...PHASE_ONE_EXISTING_SECURITIES,
      ...PHASE_ONE_PENDING_SECURITIES
    ].map(
      (security) => [security.securityId, security]
    )
  )
);

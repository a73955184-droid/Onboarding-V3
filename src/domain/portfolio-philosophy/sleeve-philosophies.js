import {
  CLAIM_TYPES,
  SYSTEM_ROLES,
  EVIDENCE_TAGS
} from './philosophy-constants.js';

export const SLEEVE_PHILOSOPHIES = Object.freeze({
  ES: {
    essential: {
      broad_growth_core: {
        systemRole: SYSTEM_ROLES.FOUNDATION,

        philosophy: {
          whyItExists:
            'Provides one dominant long-term progress engine through broad diversified exposure.',

          contributionToSystem:
            'Allows most of the portfolio long-term growth responsibility to remain concentrated in one understandable structural role.',

          governingPrinciples: [
            'broad-diversification',
            'strategic-long-term-core'
          ]
        },

        provenance: {
          claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX,

          sourceIds: [
            'FIDELITY_SIMPLE_DIVERSIFIED',
            'FIDELITY_DIVERSIFICATION'
          ]
        },

        personalization: {
          requiresEvidence: false,

          allowedEvidenceTags: [
            EVIDENCE_TAGS.SIMPLICITY,
            EVIDENCE_TAGS.BROAD_DIVERSIFICATION
          ]
        }
      },

      stability: {
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,

        philosophy: {
          whyItExists:
            'Creates a portfolio role whose purpose is different from long-term growth.',

          contributionToSystem:
            'Prevents the growth foundation from being responsible for both long-term progress and portfolio stability.',

          governingPrinciples: [
            'asset-role-separation',
            'stocks-bonds-different-functions'
          ]
        },

        provenance: {
          claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX,

          sourceIds: [
            'FIDELITY_DIVERSIFICATION'
          ]
        },

        personalization: {
          requiresEvidence: true,

          allowedEvidenceTags: [
            EVIDENCE_TAGS.STABILITY_CONCERN,
            EVIDENCE_TAGS.VOLATILITY_CONCERN,
            EVIDENCE_TAGS.CAPITAL_PRESERVATION
          ],

          noEvidenceCopy:
            'This stability role is part of the portfolio system design rather than a need inferred directly from your quiz.'
        }
      },

      liquidity: {
        systemRole: SYSTEM_ROLES.LIQUIDITY_ACCESS,

        philosophy: {
          whyItExists:
            'Keeps accessible capital structurally separate from assets intended for long-term progress.',

          contributionToSystem:
            'Reduces the need to disturb long-term portfolio roles when capital must remain accessible.',

          governingPrinciples: [
            'liquidity-constraint',
            'capital-by-purpose'
          ]
        },

        provenance: {
          claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX,

          sourceIds: [
            'CFA_PORTFOLIO_PLANNING',
            'JPM_GOALS_BASED'
          ]
        },

        personalization: {
          requiresEvidence: true,

          allowedEvidenceTags: [
            EVIDENCE_TAGS.SHORT_TIME_HORIZON,
            EVIDENCE_TAGS.MULTIPLE_TIME_HORIZONS,
            EVIDENCE_TAGS.CAPITAL_ACCESS_GOAL,
            EVIDENCE_TAGS.INCOME_GOAL
          ],

          prohibitedClaimsWithoutEvidence: [
            'You need 10% liquidity.',
            'You told us you need cash.',
            'Your investor stage requires liquidity.'
          ],

          noEvidenceCopy:
            'This liquidity role comes from the portfolio system design and was not inferred as a personal requirement from your quiz.'
        }
      }
    }
  },

  FT: {
    essential: {
      durable_core: {
        systemRole: SYSTEM_ROLES.FOUNDATION,

        philosophy: {
          whyItExists:
            'Keeps the majority of the portfolio in a durable strategic foundation while improvements remain subordinate.',

          contributionToSystem:
            'Creates a stable reference portfolio against which proposed improvements can be evaluated.',

          governingPrinciples: [
            'strategic-core',
            'bounded-satellites'
          ]
        },

        provenance: {
          claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX,

          sourceIds: [
            'BLACKROCK_CORE_SATELLITE'
          ]
        },

        personalization: {
          requiresEvidence: false,
          allowedEvidenceTags: []
        }
      },

      stability: {
        systemRole: SYSTEM_ROLES.STABILITY_RESILIENCE,

        philosophy: {
          whyItExists:
            'Maintains a separate resilience role so improvement decisions do not redefine the portfolio overall risk structure.',

          contributionToSystem:
            'Keeps the portfolio structural support separate from its improvement sleeves.',

          governingPrinciples: [
            'asset-role-separation'
          ]
        },

        provenance: {
          claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX,

          sourceIds: [
            'FIDELITY_DIVERSIFICATION'
          ]
        },

        personalization: {
          requiresEvidence: true,

          allowedEvidenceTags: [
            EVIDENCE_TAGS.STABILITY_CONCERN,
            EVIDENCE_TAGS.VOLATILITY_CONCERN
          ]
        }
      },

      targeted_improvement: {
        systemRole: SYSTEM_ROLES.BOUNDED_IMPROVEMENT,

        philosophy: {
          whyItExists:
            'Creates limited capacity for a systematic improvement without allowing that improvement to redefine the durable core.',

          contributionToSystem:
            'Makes portfolio improvement explicit, measurable and structurally bounded.',

          governingPrinciples: [
            'bounded-satellites',
            'factor-investing'
          ]
        },

        provenance: {
          claimType: CLAIM_TYPES.EXTERNAL_PLUS_AARONBUX,

          sourceIds: [
            'BLACKROCK_CORE_SATELLITE',
            'MSCI_FACTOR_INVESTING'
          ]
        },

        personalization: {
          requiresEvidence: true,

          allowedEvidenceTags: [
            EVIDENCE_TAGS.COMPARE_ALTERNATIVES,
            EVIDENCE_TAGS.RESEARCH_EFFORT,
            EVIDENCE_TAGS.OPTIMIZATION,
            EVIDENCE_TAGS.REPEATABLE_FRAMEWORK
          ],

          prohibitedClaimsWithoutEvidence: [
            'You need factor exposure.',
            'This will improve your returns.'
          ],

          noEvidenceCopy:
            'This improvement role is part of the FT portfolio philosophy rather than a requirement inferred directly from your quiz.'
        }
      }
    }
  }
});

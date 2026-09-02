import {
  PHASE_1_SECURITY_REFERENCE
} from './security-reference.js';


const FACTOR_PRESENTATION = Object.freeze({
  aligned: Object.freeze({ tone: 'positive', marker: '✓' }),
  contributing: Object.freeze({ tone: 'positive', marker: '✓' }),
  'replacement-advantage': Object.freeze({
    tone: 'positive',
    marker: '✓'
  }),
  overlapping: Object.freeze({ tone: 'caution', marker: '!' }),
  conflict: Object.freeze({ tone: 'negative', marker: '!' }),
  none: Object.freeze({ tone: 'neutral', marker: '—' }),
  'not-evaluated': Object.freeze({ tone: 'neutral', marker: '—' })
});


function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) deepFreeze(nested);
  return Object.freeze(value);
}


function securityLabel(securityId) {
  return PHASE_1_SECURITY_REFERENCE[securityId]?.ticker ??
    'the existing holding';
}


function securityLabels(securityIds = []) {
  const labels = [...new Set(securityIds.map(securityLabel))];

  if (labels.length < 2) return labels[0] ?? 'the existing holding';
  if (labels.length === 2) return labels.join(' and ');
  return `${labels.slice(0, -1).join(', ')}, and ${labels.at(-1)}`;
}


function factor(label, section, overrides = {}) {
  const status = overrides.status ?? section.status;
  const presentation = FACTOR_PRESENTATION[status] ??
    FACTOR_PRESENTATION.none;

  return {
    label,
    status,
    tone: presentation.tone,
    marker: presentation.marker,
    explanation: overrides.explanation ?? section.explanation
  };
}


function holdingFactor(assessment) {
  const holdings = securityLabels(
    assessment.sleeveAssessment.overlappingSecurityIds
  );

  return factor(
    'Existing holding identified',
    assessment.explanation.overlap,
    {
      status: 'overlapping',
      explanation:
        `${holdings} is the existing holding identified by the structural comparison.`
    }
  );
}


function addFactors(assessment) {
  const explanation = assessment.explanation;
  return [
    factor('Role alignment', explanation.roleAlignment),
    factor('Sleeve-rule alignment', explanation.boundaryAlignment),
    factor('Missing role filled', explanation.distinctContribution),
    factor('No conflicting overlap', explanation.overlap)
  ];
}


function replaceFactors(assessment) {
  const explanation = assessment.explanation;
  return [
    factor('Shared role', explanation.roleAlignment),
    holdingFactor(assessment),
    factor(
      "Candidate's structural advantage",
      explanation.distinctContribution
    ),
    factor('Replacement effect', explanation.distinctContribution, {
      status: 'contributing',
      explanation: explanation.allocationEffect
    })
  ];
}


function redundantFactors(assessment) {
  const explanation = assessment.explanation;
  return [
    factor('Shared role', explanation.roleAlignment),
    factor('Overlap dimensions', explanation.overlap),
    holdingFactor(assessment),
    factor('No distinct contribution', explanation.distinctContribution)
  ];
}


function candidateConflictSection(explanation) {
  if (explanation.boundaryAlignment.status === 'conflict') {
    return explanation.boundaryAlignment;
  }
  if (explanation.roleAlignment.status === 'conflict') {
    return explanation.roleAlignment;
  }

  return {
    status: 'none',
    explanation:
      'No candidate-level sleeve-rule conflict was identified; the conflict comes from where this role is already assigned in the portfolio.'
  };
}


function doNotAddFactors(assessment) {
  const explanation = assessment.explanation;
  const conflict = candidateConflictSection(explanation);
  const sleeveRule =
    explanation.boundaryAlignment.status === 'conflict'
      ? explanation.boundaryAlignment
      : explanation.roleAlignment.status === 'conflict'
        ? explanation.roleAlignment
        : explanation.boundaryAlignment;
  const factors = [
    factor(
      conflict.status === 'conflict'
        ? 'Sleeve-rule conflict'
        : 'Sleeve-rule assessment',
      sleeveRule
    ),
    factor('Conflicting candidate characteristic', conflict)
  ];

  if (explanation.overlap.status === 'overlapping') {
    factors.push(factor('Cross-sleeve conflict', explanation.overlap));
  }

  factors.push(factor('Context for this result', {
    status: 'none',
    explanation: explanation.primaryReason
  }));
  return factors;
}


function outcomeFactors(assessment) {
  if (assessment.outcome === 'add') return addFactors(assessment);
  if (assessment.outcome === 'replace') return replaceFactors(assessment);
  if (assessment.outcome === 'redundant') return redundantFactors(assessment);
  return doNotAddFactors(assessment);
}


function resultLabel(assessment) {
  if (assessment.outcome === 'add') return 'ADD';
  if (assessment.outcome === 'replace') {
    return `REPLACE ${securityLabel(assessment.affectedSecurityId)}`;
  }
  if (assessment.outcome === 'redundant') {
    return `REDUNDANT WITH ${securityLabels(
      assessment.sleeveAssessment.overlappingSecurityIds
    )}`;
  }
  return 'DO NOT ADD TO THIS SLEEVE';
}


function outcomeActions(outcome, replacementPreviewActive) {
  if (outcome === 'add') {
    return [{
      action: 'add-result',
      label: 'Add to hypothetical sleeve',
      style: 'primary'
    }];
  }
  if (outcome === 'replace') {
    return replacementPreviewActive
      ? [
          {
            action: 'confirm-replacement',
            label: 'Confirm replacement',
            style: 'primary'
          },
          {
            action: 'cancel-replacement',
            label: 'Cancel',
            style: 'secondary'
          }
        ]
      : [{
          action: 'preview-replacement',
          label: 'Preview replacement',
          style: 'primary'
        }];
  }
  if (outcome === 'redundant') {
    return [
      {
        action: 'save-alternative',
        label: 'Keep as an alternative',
        style: 'secondary'
      },
      {
        action: 'return-browser',
        label: 'Return to securities',
        style: 'secondary'
      }
    ];
  }
  return [{
    action: 'return-browser',
    label: 'Return to eligible securities',
    style: 'secondary'
  }];
}


function effortLabel(effect) {
  return {
    decreases: 'Lower',
    unchanged: 'Unchanged',
    increases: 'Higher'
  }[effect] ?? 'Not applicable';
}


export function presentSecurityAssessment({
  assessment,
  sleeveLabel,
  replacementPreviewActive = false
} = {}) {
  if (!assessment || assessment.assessmentStatus === 'unavailable') {
    return deepFreeze({
      status: 'unavailable',
      heading: 'Assessment unavailable',
      message:
        'AaronBux does not have enough verified information to complete this comparison. No portfolio-fit conclusion has been generated.',
      allocationMessage: 'No allocation change has been calculated.',
      actions: [{
        action: 'return-browser',
        label: 'Return to securities',
        style: 'secondary'
      }]
    });
  }

  return deepFreeze({
    status: 'complete',
    heading: 'System-fit assessment',
    context: `${assessment.candidate.ticker} to ${sleeveLabel} sleeve`,
    factors: outcomeFactors(assessment),
    effort: {
      label: 'Effort effect',
      value: effortLabel(assessment.sleeveAssessment.effortEffect)
    },
    allocationBefore: assessment.allocationBefore,
    allocationAfter: assessment.allocationAfter,
    result: {
      label: resultLabel(assessment),
      primaryReason: assessment.explanation.primaryReason
    },
    replacementPreview:
      replacementPreviewActive && assessment.outcome === 'replace'
        ? {
            heading: 'Replacement preview',
            remove: securityLabel(assessment.affectedSecurityId),
            include: assessment.candidate.ticker,
            sleeveLabel
          }
        : null,
    actions: outcomeActions(
      assessment.outcome,
      replacementPreviewActive
    ),
    disclosure: assessment.disclosure
  });
}

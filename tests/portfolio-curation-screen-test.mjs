import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(
  new URL(
    '../src/features/recommendation/PortfolioMapScreen.js',
    import.meta.url
  ),
  'utf8'
);

assert.match(source, />Curate this sleeve</);
assert.doesNotMatch(source, />Assets in this sleeve</);
assert.match(source, /resolveEligibleSecurities\(\{/);
assert.match(source, /resolveSecurityPortfolioFit\(\{/);
assert.match(source, /resolveEqualWeightAllocation\(\{/);
assert.match(source, /presentSecurityInspection\(\{/);
assert.match(source, /presentSecurityAssessment\(\{/);
assert.match(source, /portfolioSystemId: phaseOnePortfolioSystemId/);
assert.match(source, /variantId: portfolioSystem\.profileVariantId/);
assert.match(source, /targetSleeveId: sleeve\.id/);
assert.match(source, /candidateSecurityId: candidateId/);
assert.match(source, /holdingsBySleeve: curationState\.holdingsBySleeve/);
assert.match(source, /Search by name or ticker/);
assert.match(source, /View issuer source/);
assert.match(source, /renderInspectionSection\(sections\.role\)/);
assert.match(source, /renderInspectionSection\(sections\.structuralExposure\)/);
assert.match(source, /renderInspectionSection\(sections\.implementationCharacter\)/);
assert.match(source, /renderInspectionSection\(sections\.sleeveAlignment\)/);
assert.match(source, /renderInspectionSection\(sections\.assessmentChecks\)/);
assert.match(source, /target="_blank" rel="noopener noreferrer"/);
assert.match(source, /renderAssessmentFactors\(presentation\.factors\)/);
assert.match(source, /presentation\.result\.label/);
assert.match(source, /presentation\.result\.primaryReason/);
assert.match(source, /renderAssessmentActions\(presentation\.actions\)/);
assert.doesNotMatch(source, /security-category-universe/);
assert.doesNotMatch(source, /missingFields\[/);
assert.doesNotMatch(source, /reasonCodes\[/);
assert.doesNotMatch(source, /const outcomePresentation/);
assert.doesNotMatch(source, /assessment\.decisionFactors/);
assert.doesNotMatch(source, /assessment\.explanation/);

console.log(
  'Portfolio curation screen test passed: the asset tab delegates browsing, allocation and fit decisions to Phase 1 APIs.'
);

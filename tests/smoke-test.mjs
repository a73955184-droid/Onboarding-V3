import fs from 'node:fs';
const required=['index.html','src/application/bootstrap.js','src/features/assessment/AssessmentScreen.js','src/features/recommendation/RecommendationScreen.js','src/domain/assessment-engine.js','assets/css/styles.css'];for(const f of required){if(!fs.existsSync(new URL('../'+f,import.meta.url)))throw new Error('Missing '+f);}console.log('Smoke test passed.');

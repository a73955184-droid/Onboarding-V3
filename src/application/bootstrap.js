import { route } from './router.js';
import { renderWelcome } from '../features/welcome/WelcomeScreen.js';
import { renderAssessment } from '../features/assessment/AssessmentScreen.js';
import { renderRecommendation } from '../features/recommendation/RecommendationScreen.js';
const root=document.getElementById('app');function render(){const r=route();if(r.name==='assessment')renderAssessment(root,r.step);else if(r.name==='recommendation')renderRecommendation(root);else renderWelcome(root);}window.addEventListener('hashchange',render);render();

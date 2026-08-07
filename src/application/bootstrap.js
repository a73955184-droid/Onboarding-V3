import { route } from './router.js';

import { renderWelcome } from '../features/welcome/WelcomeScreen.js';
import { renderAssessment } from '../features/assessment/AssessmentScreen.js';

import {
  renderInvestorProfile
} from '../features/recommendation/InvestorProfileScreen.js';

import {
  renderInvestingSystem
} from '../features/recommendation/InvestingSystemScreen.js';
import {
  renderPortfolioMap
} from '../features/recommendation/PortfolioMapScreen.js';

const root = document.getElementById('app');

function render() {
  const current = route();

  switch (current.name) {
    case 'assessment':
      renderAssessment(root, current.step);
      break;

    case 'investor-profile':
      renderInvestorProfile(root);
      break;

    case 'investor-profile-jobs':
      import('../features/recommendation/InvestorProfileJobsScreen.js').then((module) => {
        module.renderInvestorProfileJobs(root);
      }).catch((error) => {
        console.error('Failed to load InvestorProfileJobsScreen:', error);
        renderWelcome(root);
      });
      break;

    case 'investing-system':
      renderInvestingSystem(root);
      break;

    case 'portfolio-map':
      renderPortfolioMap(root);
      break;

    default:
      renderWelcome(root);
      break;
  }
}

window.addEventListener('hashchange', render);

render();

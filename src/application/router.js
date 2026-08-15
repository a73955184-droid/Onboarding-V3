export function route() {
  const hash = location.hash.replace(/^#\/?/, '');

  if (!hash) {
    return { name: 'welcome' };
  }

  if (hash.startsWith('assessment/')) {
    const step = Number(hash.split('/')[1]);

    return {
      name: 'assessment',
      step: Number.isFinite(step) ? step : 1
    };
  }

  if (
    hash === 'recommendation' ||
    hash === 'recommendation/profile'
  ) {
    return { name: 'investor-profile' };
  }

  if (hash === 'recommendation/jobs') {
    return { name: 'investor-profile-jobs' };
  }

  if (hash === 'recommendation/profile-jobs') {
    return { name: 'investor-profile-jobs' };
  }

  /*
   * Explanation bridge:
   *
   * Investor Jobs
   *      ↓
   * Portfolio System Fit
   *      ↓
   * Investing System
   */
  if (hash === 'recommendation/system-fit') {
    return { name: 'portfolio-system-fit' };
  }

  if (hash === 'recommendation/system') {
    return { name: 'investing-system' };
  }

  if (hash === 'recommendation/portfolio') {
    return { name: 'portfolio-map' };
  }

  return { name: 'welcome' };
}

export function navigate(path) {
  location.hash = `#/${path}`;
}

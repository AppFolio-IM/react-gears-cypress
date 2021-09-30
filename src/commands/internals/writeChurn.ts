import { getMetrics } from './churn';

/// The project's root directory (where the `cypress` folder lives).
const ROOT_DIR = Cypress.config('fileServerFolder');

/// Subdir, relative to ROOT_DIR, where fixtures live.
const FIXTURE_SUBDIR = (Cypress.config('fixturesFolder') as string).replace(
  ROOT_DIR + '/',
  ''
);

/// Subdir, relative to ROOT_DIR, where logs and statistics live.
/// HACK: we're guessing this relative to FIXTURE_SUBDIR; hopefully we're right!
const LOG_SUBDIR = FIXTURE_SUBDIR.replace(/\/.+$/, '/logs');

/**
 * Write statistics.
 */
export function writeChurnMetrics() {
  const { name } = Cypress.spec;
  const specName = name.replace(/\..*$/, '.json');
  const path = `${LOG_SUBDIR}/cypress-requery/${specName}`;
  const metrics = getMetrics();

  if (metrics.numberOfHits > 0 || metrics.numberOfMisses > 0) {
    cy.writeFile(path, JSON.stringify(metrics, null, 2));
  }
}

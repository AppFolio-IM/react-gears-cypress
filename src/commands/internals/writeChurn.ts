import { getMetrics } from './churn';

/// The project's root directory (where the `cypress` folder lives).
const ROOT_DIR = Cypress.config('fileServerFolder');
/**
 * Write statistics.
 */
export function writeChurnMetrics() {
  const { name } = Cypress.spec;
  const specName = name.replace(/\..*$/, '.json');
  const path = `${ROOT_DIR}/cypress-requery/${specName}`;
  const contents = JSON.stringify(getMetrics());
  cy.writeFile(path, contents);
}

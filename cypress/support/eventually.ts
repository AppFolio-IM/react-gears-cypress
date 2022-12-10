/**
 * Iteratively call cy.wait() with exponential backoff until something becomes true.
 * Break once the backoff reaches 1024ms (regardless of initial backoff).
 */
export default function eventually(cb: Function, backoff = 32) {
  if (backoff > 1024) throw new Error(`Condition did not become true`);

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(backoff).then(() => {
    if (cb()) return null;
    eventually(cb, backoff * 2);
  });
}

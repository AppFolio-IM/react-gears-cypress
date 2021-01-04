// TODO: this might be broken under Cypress 6 (1st throw causes abort)
export default function eventually(cb, timeout = 32) {
  if (timeout > 1024) throw new Error(`Condition did not become true`);

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(timeout).then(() => {
    if (cb()) return null;
    eventually(cb, timeout * 2);
  });
}

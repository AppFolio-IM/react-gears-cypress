import { clear } from './actions/clear';
import { component as componentCommand } from './actions/component';
import { fill } from './actions/fill';
import { select } from './actions/select';
import { component as componentQuery } from './queries/component';

export const supportsQueries = !!(Cypress.Commands as any).addQuery;
const component = supportsQueries ? componentQuery : componentCommand;

// Convenience export of our command functions, in case someone needs to wrap/augment them.
// These are mostly internals and probably shouldn't be exported...
export { clear, component, fill, select };

type CommandName = 'clear' | 'fill' | 'component' | 'select';

/**
 * Register Cypress commands provided by this package. Some commands are new and
 * some are overridden.
 *
 * @example install everything
 *  commands.add();
 *
 * @example install just a couple commands
 *  commands.add('fill', 'gears);
 */
export function add(...names: CommandName[]) {
  const all = !names.length;
  if (all || names.includes('clear'))
    Cypress.Commands.overwrite('clear', clear);
  if (all || names.includes('fill'))
    Cypress.Commands.add('fill', { prevSubject: ['element'] }, fill);
  if (all || names.includes('component')) {
    if (supportsQueries) {
      // TODO: author and install the query version of cy.component
      Cypress.Commands.addQuery('component', componentQuery);
    } else {
      Cypress.Commands.add('component', { prevSubject: ['optional'] }, componentCommand);
    }
  }
  if (all || names.includes('select'))
    Cypress.Commands.overwrite('select', select);
}

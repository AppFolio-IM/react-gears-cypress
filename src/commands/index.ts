import { clear } from './clear';
import { component } from './component';
import { fill } from './fill';
import { select } from './select';
import { click } from './click';

export { clear, component, fill, select, click };

type CommandName = 'clear' | 'fill' | 'component' | 'select' | 'click';

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
    Cypress.Commands.add('fill', { prevSubject: true }, fill);
  if (all || names.includes('component'))
    Cypress.Commands.add('component', { prevSubject: 'optional' }, component);
  if (all || names.includes('select'))
    Cypress.Commands.overwrite('select', select);
  if (all || names.includes('click'))
    Cypress.Commands.overwrite('click', click);
}

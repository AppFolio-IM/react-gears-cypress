import { clear } from './clear';
import { fill } from './fill';
import { gears } from './gears';
import { select } from './select';

export { clear, fill, gears, select };

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
export function add(...names: string[]) {
  const all = !names.length;
  if (all || names.includes('clear'))
    Cypress.Commands.overwrite('clear', clear);
  if (all || names.includes('fill'))
    Cypress.Commands.add('fill', { prevSubject: true }, fill);
  if (all || names.includes('gears'))
    Cypress.Commands.add('gears', { prevSubject: 'optional' }, gears);
  if (all || names.includes('select'))
    Cypress.Commands.overwrite('select', select);
}

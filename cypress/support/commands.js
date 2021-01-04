import * as commands from '../../src/commands';

Cypress.Commands.overwrite('clear', commands.clear);
Cypress.Commands.add('fill', { prevSubject: true }, commands.fill);
Cypress.Commands.add('gears', { prevSubject: 'optional' }, commands.gears);
Cypress.Commands.overwrite('select', commands.select);

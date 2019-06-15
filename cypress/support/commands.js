import * as gears from '../../src/commands';

Cypress.Commands.overwrite('clear', gears.clear);
Cypress.Commands.add('fill', { prevSubject: true }, gears.fill);
Cypress.Commands.overwrite('select', gears.select);

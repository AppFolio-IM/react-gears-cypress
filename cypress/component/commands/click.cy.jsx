import React from 'react';
import { BlockPanel, Button, Icon } from '@appfolio/react-gears';

// NB: this package will stop overriding cy.click; the test is still useful to
// prove that Cypress behavior does not regress (thereby requiring an override again).
describe('cy.click', () => {
  it('deals with FontAwesome buttons', () => {
    cy.mount(
      <div>
        <Button>
          <Icon name="times" />
        </Button>
      </div>
    );

    cy.get('button').click();
  });
});

import React from 'react';
import { Card, DateInput, FormLabelGroup, Input } from 'react-gears';
import * as gears from '../../../src/find';

describe('cy.fill', () => {
  it('fills Input', () => {
    cy.mount(
      <Card>
        <FormLabelGroup label="some label">
          <Input />
        </FormLabelGroup>
      </Card>
    );

    cy.get('input')
      .clear()
      .type('before');
    cy.get('input').should('have.value', 'before');

    gears.input('some label').fill('after');

    gears.input('some label').should('have.value', 'after');
  });

  it('dismisses DateInput popup', () => {
    cy.mount(
      <Card>
        <FormLabelGroup label="some label">
          <DateInput />
        </FormLabelGroup>
      </Card>
    );

    cy.get('input').focus();
    cy.get('div[aria-haspopup="true"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    );

    gears.input('some label').fill('04/02/2018');

    // TODO: get popup/styles working so we can verify more thoroughly
    cy.get('div[aria-haspopup="true"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
  });
});

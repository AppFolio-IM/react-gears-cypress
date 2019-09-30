import React from 'react';
import { Card, DateInput, FormLabelGroup, Input, Select } from 'react-gears';
import * as gears from '../../../src/find';

function eventually(cb, timeout = 32) {
  if (timeout > 1024) throw new Error(`Condition did not become true`);
  cy.wait(timeout).then(() => {
    if (cb()) return null;
    eventually(cb, timeout * 2);
  });
}

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
  it('fills textarea', () => {
    cy.mount(
      <Card>
        <FormLabelGroup label="some label">
          <Input type="textarea" />
        </FormLabelGroup>
      </Card>
    );

    cy.get('textarea')
      .clear()
      .type('before');

    cy.get('textarea').should('have.value', 'before');

    gears.input('some label').fill('avengers assemble!');

    gears.input('some label').should('have.value', 'avengers assemble!');
  });

  it('fills a fancy select', () => {
    const options = ['steve rogers', 'tony stark', 'natasha romanov'].map(
      o => ({
        label: o,
        value: o,
      })
    );

    let selected;
    const onChange = o => (selected = o && o.value);

    cy.mount(
      <Card>
        <FormLabelGroup label="best avenger">
          <Select options={options} onChange={onChange} />
        </FormLabelGroup>
      </Card>
    );

    gears.select('best avenger').fill('steve rogers');
    eventually(() => expect(selected).to.eq('steve rogers'));
    gears.select('best avenger').fill('natasha romanov');
    eventually(() => expect(selected).to.eq('natasha romanov'));
  });

  it('fills a regular select', () => {
    cy.mount(
      <Card>
        <FormLabelGroup label="best avenger">
          <select id="avengers" name="avengers" type="select">
            <option value="">Select</option>
            <option>steve rogers</option>
            <option>tony stark</option>
            <option>natasha romanov</option>
          </select>
        </FormLabelGroup>
      </Card>
    );
    gears.select('best avenger').fill('steve rogers');
    cy.get('select').should('have.value', 'steve rogers');
    gears.select('best avenger').fill('natasha romanov');
    cy.get('select').should('have.value', 'natasha romanov');
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

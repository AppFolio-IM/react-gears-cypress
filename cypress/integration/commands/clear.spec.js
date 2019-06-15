import React from 'react';
import { Card, DateInput, FormLabelGroup, Input, Select } from 'react-gears';
import * as gears from '../../../src/find';

function eventually(cb, timeout = 32) {
  cy.wait(timeout).then(() => {
    try {
    } catch (err) {
      cy.wait(timeout).then(() => eventually(cb, timeout * 2));
    }
  });
}

describe('cy.clear', () => {
  it('clears Input', () => {
    cy.mount(
      <Card>
        <FormLabelGroup label="some label">
          <Input />
        </FormLabelGroup>
      </Card>
    );

    cy.get('input').type('before');

    gears.input('some label').clear();

    cy.get('input').should('have.value', '');
  });

  it('clears DateInput', () => {
    cy.mount(
      <Card>
        <FormLabelGroup label="some label">
          <DateInput />
        </FormLabelGroup>
      </Card>
    );

    cy.get('input')
      .focus()
      .type('04/02/2018\t');
    cy.get('div[aria-haspopup="true"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    gears.input('some label').clear();
    gears.input('some label').should('have.value', '');
    cy.get('div[aria-haspopup="true"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
  });

  it.skip('clears <select>', () => {
    cy.mount(
      <Card>
        <FormLabelGroup label="some label">
          <select>
            <option value="alpha">alpha</option>
            <option value="bravo">bravo</option>
            <option value="charlie">charlie</option>
          </select>
        </FormLabelGroup>
      </Card>
    );

    cy.get('select').select('alpha');
    cy.get('select').should('have.value', 'alpha');

    gears.select('some label').clear();
    cy.get('select').should('have.value', '');
  });

  it('clears Select', () => {
    const options = ['alpha', 'bravo', 'charlie'].map(o => ({
      label: o,
      value: o,
    }));

    let selected;
    const onChange = o => (selected = o && o.value);

    cy.mount(
      <Card>
        <FormLabelGroup label="some label">
          <Select options={options} onChange={onChange} />
        </FormLabelGroup>
      </Card>
    );

    gears.select('some label').select('alpha');
    eventually(() => expect(selected).to.eq('alpha'));

    gears.select('some label').clear();
    eventually(() => expect(selected).to.be.null);
  });
});

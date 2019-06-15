import React from 'react';
import { Card, FormLabelGroup, Select } from 'react-gears';
import * as gears from '../../../src/find';

function eventually(cb, timeout = 32) {
  cy.wait(timeout).then(() => {
    try {
    } catch (err) {
      cy.wait(timeout).then(() => eventually(cb, timeout * 2));
    }
  });
}

describe('cy.select', () => {
  it('handles <select>', () => {
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
    cy.get('select').select('bravo');
    cy.get('select').should('have.value', 'bravo');
  });

  it('handles Select', () => {
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
    gears.select('some label').select('bravo');
    eventually(() => expect(selected).to.eq('bravo'));
  });
});

import React from 'react';
import { FormLabelGroup, Select } from '@appfolio/react-gears';

import * as comp from '../../../src/components';
import eventually from '../../support/eventually';
import mount from '../../support/mount';

describe('cy.select', () => {
  it('handles <select>', () => {
    mount(
      <FormLabelGroup label="some label">
        <select>
          <option value="alpha">alpha</option>
          <option value="bravo">bravo</option>
          <option value="charlie">charlie</option>
        </select>
      </FormLabelGroup>
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

    mount(
      <FormLabelGroup label="some label">
        <Select options={options} onChange={onChange} />
      </FormLabelGroup>
    );

    cy.component(comp.Select, 'some label').select('alpha');
    eventually(() => expect(selected).to.eq('alpha'));
    cy.component(comp.Select, 'some label').select('bravo');
    eventually(() => expect(selected).to.eq('bravo'));
  });
});

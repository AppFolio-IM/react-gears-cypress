import React from 'react';
import { FormLabelGroup, Select } from '@appfolio/react-gears';

import * as comp from '../../../src/components';
import eventually from '../../support/eventually';

describe('cy.select', () => {
  it('handles <select>', () => {
    cy.mount(
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

  context('Select component', () => {
    const options = ['alpha', 'bravo', 'charlie'].map((o) => ({
      label: o,
      value: o,
    }));

    it('clearable', () => {
      let selected;
      const onChange = (o) => (selected = o && o.value);

      cy.mount(
        <FormLabelGroup label="some label">
          <Select options={options} onChange={onChange} />
        </FormLabelGroup>
      );

      cy.component(comp.Select, 'some label').select('alpha');
      eventually(() => expect(selected).to.eq('alpha'));
      cy.component(comp.Select, 'some label').select('bravo');
      eventually(() => expect(selected).to.eq('bravo'));
    });

    it('non-clearable', () => {
      let selected;
      const onChange = (o) => {
        expect(o && o.value).to.be.ok;
        selected = o && o.value;
      };

      cy.mount(
        <FormLabelGroup label="some label">
          <Select options={options} onChange={onChange} clearable={false} />
        </FormLabelGroup>
      );

      cy.component(comp.Select, 'some label').select('alpha');
      eventually(() => expect(selected).to.eq('alpha'));
      cy.component(comp.Select, 'some label').select('bravo');
      eventually(() => expect(selected).to.eq('bravo'));
    });
  });
});

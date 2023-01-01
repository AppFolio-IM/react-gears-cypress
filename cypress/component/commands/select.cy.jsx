import React from 'react';
import { Combobox, FormLabelGroup, Select } from '@appfolio/react-gears';

import * as comp from '../../../src/components';
import eventually from '../../support/eventually';

describe('cy.select', () => {
  context('with HTML select', () => {
    beforeEach(() => {
      cy.mount(
        <FormLabelGroup label="some label">
          <select>
            <option value="alpha">alpha</option>
            <option value="bravo">bravo</option>
            <option value="charlie">charlie</option>
          </select>
        </FormLabelGroup>
      );
    })

    it('works', () => {
      cy.get('select').select('alpha');
      cy.get('select').should('have.value', 'alpha');
      cy.get('select').select('bravo');
      cy.get('select').should('have.value', 'bravo');
    });
  });

  context('with Combobox', () => {
    function Testbed({ onChange = () => undefined }) {
      const options = ['alpha', 'bravo', 'charlie'].map((o) => ({
        label: o,
        value: o,
      }));

      const [value, setValue] = React.useState();

      return (
        <FormLabelGroup label="some label">
          <Combobox options={options} onChange={v => { setValue(v); onChange(v); }} value={value} />
        </FormLabelGroup>
      );
    }

    it('works', () => {
      let selected;

      cy.mount(<Testbed onChange={v => { selected = v; }} />)
      cy.component(comp.Combobox, 'some label').select('alpha');
      eventually(() => selected === 'alpha');
    });
  });

  context('with Select', () => {
    const options = ['alpha', 'bravo', 'charlie'].map((o) => ({
      label: o,
      value: o,
    }));

    it('handles clearable', () => {
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

    it('handles non-clearable', () => {
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

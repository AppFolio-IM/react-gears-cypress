import React from 'react';
import {
  DateInput,
  FormLabelGroup,
  Input,
  Select,
} from '@appfolio/react-gears';

import * as comp from '../../../src/components';
import eventually from '../../support/eventually';
import mount from '../../support/mount';

describe('cy.clear', () => {
  it('clears Input', () => {
    mount(
      <FormLabelGroup label="some label">
        <Input />
      </FormLabelGroup>
    );

    cy.get('input').type('before');

    cy.component(comp.Input, 'some label').clear();

    cy.get('input').should('have.value', '');
  });

  it('clears DateInput', () => {
    mount(
      <FormLabelGroup label="some label">
        <DateInput />
      </FormLabelGroup>
    );

    cy.get('input')
      .focus()
      .type('04/02/2018{enter}');
    cy.get('div[aria-haspopup="true"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.component(comp.Input, 'some label').clear();
    cy.component(comp.Input, 'some label').should('have.value', '');
    cy.get('div[aria-haspopup="true"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
  });

  context('Select component', () => {
    it('clears values', () => {
      const options = ['alpha', 'bravo', 'charlie'].map(o => ({
        label: o,
        value: o,
      }));

      let selected;
      const onChange = o => {
        selected = o && o.value;
      };

      mount(
        <FormLabelGroup label="some label">
          <Select options={options} onChange={onChange} />
        </FormLabelGroup>
      );

      cy.component(comp.Select, 'some label').select('alpha');
      eventually(() => selected === 'alpha');

      cy.component(comp.Select, 'some label').clear();
      eventually(() => selected === null);

      // clearing is idempotent; should not raise
      cy.component(comp.Select, 'some label').clear();
    });

    it('dismisses popups', () => {
      const options = ['steve rogers', 'tony stark', 'natasha romanov'].map(
        o => ({
          label: o,
          value: o,
        })
      );

      mount(
        <>
          <FormLabelGroup label="first">
            <Select clearable={false} options={options} />
          </FormLabelGroup>
          <FormLabelGroup label="second">
            <Select options={options} />
          </FormLabelGroup>
          <FormLabelGroup label="third">
            <Select clearable={false} options={options} />
          </FormLabelGroup>
        </>
      );

      cy.component(comp.Select, 'first').clear();
      cy.component(comp.Select, 'first').find('.fa-caret-down');
      cy.component(comp.Select, 'second').clear();
      cy.component(comp.Select, 'second').find('.fa-caret-down');
      cy.component(comp.Select, 'third').clear();
      cy.component(comp.Select, 'third').find('.fa-caret-down');
    });
  });
});

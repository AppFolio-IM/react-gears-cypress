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

describe('cy.fill', () => {
  context('Input component', () => {
    beforeEach(() => {
      mount(
        <FormLabelGroup label="some label">
          <Input />
        </FormLabelGroup>
      );
    });

    it('types values', () => {
      cy.gears(comp.Input, 'some label')
        .clear()
        .type('before');
      cy.gears(comp.Input, 'some label').should('have.value', 'before');

      cy.gears(comp.Input, 'some label').fill('after');
      cy.gears(comp.Input, 'some label').should('have.value', 'after');
    });

    // TODO: figure out how to intercept Cypress command errors
    it.skip('requires a value', () => {
      cy.gears(comp.Input, 'some label').fill('');
    });
  });

  context('DateInput component', () => {
    beforeEach(() => {
      mount(
        <FormLabelGroup label="some label">
          <DateInput />
        </FormLabelGroup>
      );
    });

    it('dismisses popup', () => {
      cy.get('input').focus();
      cy.get('div[aria-haspopup="true"]').should(
        'have.attr',
        'aria-expanded',
        'true'
      );

      cy.gears(comp.Input, 'some label').fill('04/02/2018');

      cy.get('div[aria-haspopup="true"]').should(
        'have.attr',
        'aria-expanded',
        'false'
      );
    });
  });

  context('textarea tag', () => {
    beforeEach(() => {
      mount(
        <FormLabelGroup label="some label">
          <Input type="textarea" />
        </FormLabelGroup>
      );
    });

    it('types values', () => {
      // precondition
      cy.get('textarea')
        .clear()
        .type('before');
      cy.get('textarea').should('have.value', 'before');

      // fill with something
      cy.gears(comp.Input, 'some label').fill('avengers assemble!');
      cy.gears(comp.Input, 'some label').should(
        'have.value',
        'avengers assemble!'
      );
    });

    // TODO: figure out how to intercept Cypress command errors
    it.skip('requires a value', () => {
      cy.gears(comp.Input, 'some label').fill('');
    });
  });

  context('Select component', () => {
    const options = ['steve rogers', 'tony stark', 'natasha romanov'].map(
      o => ({
        label: o,
        value: o,
      })
    );

    it('searches and clicks values', () => {
      let selected;
      const onChange = o => (selected = o && o.value);

      mount(
        <FormLabelGroup label="best avenger">
          <Select options={options} onChange={onChange} />
        </FormLabelGroup>
      );

      // fill with something
      cy.gears(comp.Select, 'best avenger').fill('steve rogers');
      eventually(() => expect(selected).to.eq('steve rogers'));
      cy.gears(comp.Select, 'best avenger').fill('natasha romanov');
      eventually(() => expect(selected).to.eq('natasha romanov'));
    });

    // TODO: figure out how to intercept Cypress command errors
    it.skip('requires a value', () => {
      cy.gears(comp.Select, 'best avenger').fill('');
    });

    it('dismisses popups', () => {
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

      cy.gears(comp.Select, 'first').fill('natasha romanov');
      cy.gears(comp.Select, 'first').find('.fa-caret-down');
      cy.gears(comp.Select, 'second').fill('steve rogers');
      cy.gears(comp.Select, 'second').find('.fa-caret-down');
      cy.gears(comp.Select, 'third').fill('tony stark');
      cy.gears(comp.Select, 'third').find('.fa-caret-down');
    });
  });

  context('select tag', () => {
    beforeEach(() => {
      mount(
        <FormLabelGroup label="best avenger">
          <select id="avengers" name="avengers" type="select">
            <option value="">Select</option>
            <option>steve rogers</option>
            <option>tony stark</option>
            <option>natasha romanov</option>
          </select>
        </FormLabelGroup>
      );
    });

    it('tolerates superfluous type=select', () => {
      // fill with something
      cy.gears(comp.Select, 'best avenger').fill('steve rogers');
      cy.get('select').should('have.value', 'steve rogers');
      cy.gears(comp.Select, 'best avenger').fill('natasha romanov');
      cy.get('select').should('have.value', 'natasha romanov');
    });

    it('does not rely on superfluous type=select', () => {
      cy.gears(comp.Select, 'best avenger').fill('steve rogers');
      cy.get('select').should('have.value', 'steve rogers');
      cy.gears(comp.Select, 'best avenger').fill('natasha romanov');
      cy.get('select').should('have.value', 'natasha romanov');
    });

    // TODO: figure out how to intercept Cypress command errors
    it.skip('requires a value', () => {
      cy.gears(comp.Select, 'best avenger').fill('');
    });
  });
});

import { mount } from 'cypress-react-unit-test';
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

describe('cy.clear', () => {
  it('clears Input', () => {
    mount(
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

  it.only('clears DateInput', () => {
    mount(
      <Card>
        <FormLabelGroup label="some label">
          <DateInput />
        </FormLabelGroup>
      </Card>
    );

    cy.get('input')
      .focus()
      .type('04/02/2018{enter}');
    cy.get('div[aria-haspopup="true"]').should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    gears.input('some label').clear();
    gears.input('some label').should('have.value', '');

    // TODO: figure out source of flake (sometimes popup is still expanded; sometimes not)
    // cy.get('div[aria-haspopup="true"]').should(
    //   'have.attr',
    //   'aria-expanded',
    //   'false'
    // );
  });

  it('clears Select', () => {
    const options = ['alpha', 'bravo', 'charlie'].map(o => ({
      label: o,
      value: o,
    }));

    let selected;
    const onChange = o => {
      selected = o && o.value;
    };

    mount(
      <Card>
        <FormLabelGroup label="some label">
          <Select options={options} onChange={onChange} />
        </FormLabelGroup>
      </Card>
    );

    gears.select('some label').select('alpha');
    eventually(() => selected === 'alpha');

    gears.select('some label').clear();
    eventually(() => selected === null);

    // clearing is idempotent; should not raise
    gears.select('some label').clear();
  });
});
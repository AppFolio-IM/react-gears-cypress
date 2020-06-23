import { mount } from 'cypress-react-unit-test';
import React from 'react';
import {
  Alert,
  BlockPanel,
  Button,
  Card,
  Datapair,
  FormLabelGroup,
  Input,
  Modal,
  ModalHeader,
} from 'react-gears';

import * as gears from '../../../src/find';

describe('assert-no', () => {
  it('alert', () => {
    // NB: not using cy.mountGears due to hooks issue
    mount(<Alert>apples</Alert>);
    gears.assertNo.alert('oranges');
  });

  it('blockPanel', () => {
    // NB: not using cy.mountGears due to hooks issue
    mount(<BlockPanel title="apples">some content</BlockPanel>);
    gears.assertNo.alert('oranges');
  });

  it('button', () => {
    cy.mountGears(<Button>apples</Button>);
    gears.assertNo.button('oranges');
  });

  it('datapair', () => {
    cy.mountGears(<Datapair label="apples" value="fuji" />);
    gears.assertNo.datapair('oranges');
  });

  context('input', () => {
    it('single-line', () => {
      cy.mountGears(
        <FormLabelGroup label="apples">
          <Input />
        </FormLabelGroup>
      );
      gears.assertNo.input('oranges');
    });

    it('multiline', () => {
      cy.mountGears(
        <FormLabelGroup label="apples">
          <Input type="textarea" />
        </FormLabelGroup>
      );
      gears.assertNo.input('oranges');
    });

    it('checkbox', () => {
      cy.mountGears(
        <FormLabelGroup label="apples">
          <Input type="checkbox" />
        </FormLabelGroup>
      );
      gears.assertNo.checkboxInput('oranges');
    });

    it('radio button', () => {
      cy.mountGears(
        <FormLabelGroup label="apples">
          <Input type="radio" />
        </FormLabelGroup>
      );
      gears.assertNo.radioInput('oranges');
    });
  });

  it('link', () => {
    cy.mountGears(
      <Card>
        <a href="about:blank">apples</a>
      </Card>
    );
    gears.assertNo.link('oranges');
  });

  it('modal', () => {
    cy.mountGears(
      <Modal backdrop isOpen size="lg">
        <ModalHeader>apples</ModalHeader>
      </Modal>
    );
    gears.assertNo.modal('oranges');
  });
});

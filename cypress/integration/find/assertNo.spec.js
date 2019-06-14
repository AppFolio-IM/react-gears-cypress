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
    cy.mount(<Alert>apples</Alert>);
    gears.assertNo.alert('oranges');
  });

  it('blockPanel', () => {
    cy.mount(<BlockPanel title="apples">some content</BlockPanel>);
    gears.assertNo.alert('oranges');
  });

  it('button', () => {
    cy.mount(<Button>apples</Button>);
    gears.assertNo.button('oranges');
  });

  it('datapair', () => {
    cy.mount(<Datapair label="apples" value="fuji" />);
    gears.assertNo.datapair('oranges');
  });

  it('input', () => {
    cy.mount(
      <FormLabelGroup label="apples">
        <Input />
      </FormLabelGroup>
    );
    gears.assertNo.input('oranges');
  });

  it('link', () => {
    cy.mount(
      <Card>
        <a href="about:blank">apples</a>
      </Card>
    );
    gears.assertNo.link('oranges');
  });

  it.skip('modal', () => {
    cy.mount(
      <Modal backdrop isOpen size="lg">
        <ModalHeader>apples</ModalHeader>
      </Modal>
    );
    gears.assertNo.modal('oranges');
  });
});

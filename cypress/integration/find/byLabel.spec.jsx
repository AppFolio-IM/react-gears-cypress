import React from 'react';
import {
  Alert,
  BlockPanel,
  Button,
  Card,
  CardTitle,
  Datapair,
  FormLabelGroup,
  Input,
  Modal,
  ModalHeader,
  Select,
  SummaryBox,
  SummaryBoxItem,
} from 'react-gears';

import * as gears from '../../../src/find';

describe('find by label', () => {
  it('alert', () => {
    cy.mount(<Alert>some label</Alert>);
    gears.alert('some label');
  });

  it('blockPanel', () => {
    cy.mount(<BlockPanel title="some label">some content</BlockPanel>);
    gears.blockPanel('some label');
  });

  it('button', () => {
    cy.mount(<Button>some label</Button>);
    gears.button('some label');
  });

  it('card', () => {
    cy.mount(
      <Card>
        <CardTitle>some label</CardTitle>
      </Card>
    );
    gears.card('some label');
    gears.cardTitle('some label');
  });

  it('datapair', () => {
    cy.mount(<Datapair label="some label" value="some content" />);
    gears.datapair('some label');
  });

  context('input', () => {
    it('single-line', () => {
      cy.mount(
        <FormLabelGroup label="some label">
          <Input />
        </FormLabelGroup>
      );
      gears.input('some label');
    });

    it('multiline', () => {
      cy.mount(
        <FormLabelGroup label="some label">
          <Input type="textarea" />
        </FormLabelGroup>
      );
      gears.input('some label');
    });
  });

  describe('link', () => {
    it('vanilla HTML', () => {
      cy.mount(
        <Card>
          <a href="about:blank">some label</a>
        </Card>
      );
      gears.link('some label');
    });
    it('link-colored button', () => {
      cy.mount(<Button color="link">some label</Button>);
      gears.link('some label');
    });
  });

  // TODO: figure out the magic CSS needed to make modals render
  it.skip('modal', () => {
    cy.mount(
      <Modal backdrop isOpen size="lg">
        <ModalHeader>some label</ModalHeader>
      </Modal>
    );
    gears.modal('some label');
    gears.modalTitle('some label');
  });

  it('select', () => {
    cy.mount(
      <FormLabelGroup label="some label">
        <Select />
      </FormLabelGroup>
    );
    gears.select('some label');
  });

  it('summaryBoxItem', () => {
    cy.mount(
      <SummaryBox>
        <SummaryBoxItem label="some label" value="some content" />
      </SummaryBox>
    );
    gears.summaryBoxItem('some label');
  });
});

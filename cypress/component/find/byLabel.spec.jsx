import { mount } from 'cypress-react-unit-test';
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
    // NB: not using cy.mountGears due to hooks issue
    mount(<Alert>some label</Alert>);
    gears.alert('some label');
  });

  it('blockPanel', () => {
    // NB: not using cy.mountGears due to hooks issue
    mount(<BlockPanel title="some label">some content</BlockPanel>);
    gears.blockPanel('some label');
  });

  it('button', () => {
    cy.mountGears(<Button>some label</Button>);
    gears.button('some label');
  });

  it('card', () => {
    cy.mountGears(
      <Card>
        <CardTitle>some label</CardTitle>
      </Card>
    );
    gears.card('some label');
    gears.cardTitle('some label');
  });

  it('datapair', () => {
    cy.mountGears(<Datapair label="some label" value="some content" />);
    gears.datapair('some label');
  });

  context('input', () => {
    it('single-line', () => {
      cy.mountGears(
        <FormLabelGroup label="some label">
          <Input />
        </FormLabelGroup>
      );
      gears.input('some label');
    });

    it('multiline', () => {
      cy.mountGears(
        <FormLabelGroup label="some label">
          <Input type="textarea" />
        </FormLabelGroup>
      );
      gears.input('some label');
    });

    it('checkbox', () => {
      cy.mountGears(
        <FormLabelGroup label="some label">
          <Input type="checkbox" />
        </FormLabelGroup>
      );
      gears.checkboxInput('some label');
    });

    it('radioInput button', () => {
      cy.mountGears(
        <FormLabelGroup label="some label">
          <Input type="radio" />
        </FormLabelGroup>
      );
      gears.radioInput('some label');
    });
  });

  describe('link', () => {
    it('vanilla HTML', () => {
      cy.mountGears(
        <Card>
          <a href="about:blank">some label</a>
        </Card>
      );
      gears.link('some label');
    });
    it('link-colored button', () => {
      cy.mountGears(<Button color="link">some label</Button>);
      gears.link('some label');
    });
  });

  it('modal', () => {
    cy.mountGears(
      <Modal backdrop isOpen size="lg">
        <ModalHeader>some label</ModalHeader>
      </Modal>
    );
    gears.modal('some label');
    gears.modalTitle('some label');
  });

  it('select', () => {
    cy.mountGears(
      <FormLabelGroup label="some label">
        <Select />
      </FormLabelGroup>
    );
    gears.select('some label');
  });

  it('summaryBoxItem', () => {
    cy.mountGears(
      <SummaryBox>
        <SummaryBoxItem label="some label" value="some content" />
      </SummaryBox>
    );
    gears.summaryBoxItem('some label');
  });
});

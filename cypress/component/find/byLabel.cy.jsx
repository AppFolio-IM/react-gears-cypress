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
  ModalBody,
  Select,
  SummaryBox,
  SummaryBoxItem,
} from '@appfolio/react-gears';

import mount from '../../support/mount';
import * as gears from '../../../src/find';

describe('find by label', () => {
  it('alert', () => {
    // NB: not using mount due to hooks issue
    mount(<Alert>some label</Alert>);
    gears.alert('some label');
    gears.alert('some label').should('have.text', 'some label');
    gears.alert('other label').should('not.exist');
  });

  it('blockPanel', () => {
    // NB: not using mount due to hooks issue
    mount(<BlockPanel title="some label">some content</BlockPanel>);
    gears.blockPanel('some label');
    gears
      .blockPanel('some label')
      .should('have.text', 'some labelsome content');
    gears.blockPanel('other label').should('not.exist');
  });

  it('button', () => {
    mount(<Button>some label</Button>);
    gears.button('some label');
    gears.button('some label').should('have.text', 'some label');
    gears.button('other label').should('not.exist');
  });

  it('card', () => {
    mount(
      <Card>
        <CardTitle>some label</CardTitle>
      </Card>
    );
    gears.card('some label');
    gears.card('some label').should('have.text', 'some label');
    gears.card('other label').should('not.exist');
    gears.cardTitle('some label');
    gears.cardTitle('some label').should('have.text', 'some label');
    // negative assertion is unsupported for card title
    // gears.cardTitle('other label').should('not.exist');
  });

  it('datapair', () => {
    mount(<Datapair label="some label" value="some content" />);
    gears.datapair('some label');
    gears.datapair('some label').should('have.text', 'some labelsome content');
    gears.datapair('other label').should('not.exist');
  });

  context('input', () => {
    it('single-line', () => {
      mount(
        <FormLabelGroup label="some label">
          <Input value="some value" />
        </FormLabelGroup>
      );
      gears.input('some label');
      gears.input('some label').should('have.value', 'some value');
      gears.input('other label').should('not.exist');
    });

    it('multiline', () => {
      mount(
        <FormLabelGroup label="some label">
          <Input type="textarea" value="some value" />
        </FormLabelGroup>
      );
      gears.input('some label');
      gears.input('some label').should('have.value', 'some value');
      gears.input('other label').should('not.exist');
    });

    it('checkbox', () => {
      mount(
        <FormLabelGroup label="some label">
          <Input type="checkbox" checked />
        </FormLabelGroup>
      );
      gears.checkboxInput('some label');
      gears.checkboxInput('some label').should('be.checked');
      gears.checkboxInput('other label').should('not.exist');
    });

    it('radioInput button', () => {
      mount(
        <FormLabelGroup label="some label">
          <Input type="radio" checked />
        </FormLabelGroup>
      );
      gears.radioInput('some label');
      gears.radioInput('some label').should('be.checked');
      gears.radioInput('other label').should('not.exist');
    });
  });

  describe('link', () => {
    it('vanilla HTML', () => {
      mount(
        <Card>
          <a href="about:blank">some label</a>
        </Card>
      );
      gears.link('some label');
      gears.link('some label').should('have.attr', 'href', 'about:blank');
      gears.link('other label').should('not.exist');
    });
    it('link-colored button', () => {
      mount(<Button color="link">some label</Button>);
      gears.link('some label');
      gears.link('some label').should('have.text', 'some label');
      gears.link('other label').should('not.exist');
    });
  });

  it('modal', () => {
    mount(
      <Modal backdrop isOpen size="lg">
        <ModalHeader>some label</ModalHeader>
        <ModalBody>some content</ModalBody>
      </Modal>
    );
    gears.modal('some label');
    gears.modal('some label').should('have.text', 'some labelsome content');
    gears.modal('other label').should('not.exist');
    gears.modalTitle('some label');
    gears.modalTitle('some label').should('have.text', 'some label');
    // negative assertion is unsupported for modal title
    // gears.modaltitle('other label').should('not.exist');
  });

  it('select', () => {
    // TODO: much better support for this crap!
    mount(
      <FormLabelGroup label="some label">
        <Select options={[{ label: 'Alpha', value: 'Alpha' }]} value="Alpha" />
      </FormLabelGroup>
    );
    gears.select('some label');
    gears.select('some label').should('have.text', 'Alpha×');
    gears.select('other label').should('not.exist');
  });

  it('summaryBoxItem', () => {
    mount(
      <SummaryBox>
        <SummaryBoxItem label="some label" value="some content" />
      </SummaryBox>
    );
    gears.summaryBoxItem('some label');
    gears
      .summaryBoxItem('some label')
      .should('have.text', 'some labelsome content');
    gears.summaryBoxItem('other label').should('not.exist');
  });
});

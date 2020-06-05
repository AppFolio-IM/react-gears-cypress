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
    mount(<Alert>some label</Alert>);
    gears.alert('some label');
  });

  it('blockPanel', () => {
    mount(<BlockPanel title="some label">some content</BlockPanel>);
    gears.blockPanel('some label');
  });

  it('button', () => {
    mount(<Button>some label</Button>);
    gears.button('some label');
  });

  it('card', () => {
    mount(
      <Card>
        <CardTitle>some label</CardTitle>
      </Card>
    );
    gears.card('some label');
    gears.cardTitle('some label');
  });

  it('datapair', () => {
    mount(<Datapair label="some label" value="some content" />);
    gears.datapair('some label');
  });

  context('input', () => {
    it('single-line', () => {
      mount(
        <FormLabelGroup label="some label">
          <Input />
        </FormLabelGroup>
      );
      gears.input('some label');
    });

    it('multiline', () => {
      mount(
        <FormLabelGroup label="some label">
          <Input type="textarea" />
        </FormLabelGroup>
      );
      gears.input('some label');
    });

    it('checkbox', () => {
      mount(
        <FormLabelGroup label="some label">
          <Input type="checkbox" />
        </FormLabelGroup>
      );
      gears.checkboxInput('some label');
    });

    it('radioInput button', () => {
      mount(
        <FormLabelGroup label="some label">
          <Input type="radio" />
        </FormLabelGroup>
      );
      gears.radioInput('some label');
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
    });
    it('link-colored button', () => {
      mount(<Button color="link">some label</Button>);
      gears.link('some label');
    });
  });

  it('modal', () => {
    mount(
      <Modal backdrop isOpen size="lg">
        <ModalHeader>some label</ModalHeader>
      </Modal>
    );
    gears.modal('some label');
    gears.modalTitle('some label');
  });

  it('select', () => {
    mount(
      <FormLabelGroup label="some label">
        <Select />
      </FormLabelGroup>
    );
    gears.select('some label');
  });

  it('summaryBoxItem', () => {
    mount(
      <SummaryBox>
        <SummaryBoxItem label="some label" value="some content" />
      </SummaryBox>
    );
    gears.summaryBoxItem('some label');
  });
});

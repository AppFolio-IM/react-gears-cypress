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
} from '@appfolio/react-gears';

import mount from '../../support/mount';
import * as gears from '../../../src/find';

describe('assert-no', () => {
  it('alert', () => {
    // NB: not using mount due to hooks issue
    mount(<Alert>apples</Alert>);
    gears.assertNo.alert('oranges');
  });

  it('blockPanel', () => {
    // NB: not using mount due to hooks issue
    mount(<BlockPanel title="apples">some content</BlockPanel>);
    gears.assertNo.alert('oranges');
  });

  it('button', () => {
    mount(<Button>apples</Button>);
    gears.assertNo.button('oranges');
  });

  it('datapair', () => {
    mount(<Datapair label="apples" value="fuji" />);
    gears.assertNo.datapair('oranges');
  });

  context('input', () => {
    it('single-line', () => {
      mount(
        <FormLabelGroup label="apples">
          <Input />
        </FormLabelGroup>
      );
      gears.assertNo.input('oranges');
    });

    it('multiline', () => {
      mount(
        <FormLabelGroup label="apples">
          <Input type="textarea" />
        </FormLabelGroup>
      );
      gears.assertNo.input('oranges');
    });

    it('checkbox', () => {
      mount(
        <FormLabelGroup label="apples">
          <Input type="checkbox" />
        </FormLabelGroup>
      );
      gears.assertNo.checkboxInput('oranges');
    });

    it('radio button', () => {
      mount(
        <FormLabelGroup label="apples">
          <Input type="radio" />
        </FormLabelGroup>
      );
      gears.assertNo.radioInput('oranges');
    });
  });

  it('link', () => {
    mount(
      <Card>
        <a href="about:blank">apples</a>
      </Card>
    );
    gears.assertNo.link('oranges');
  });

  it('modal', () => {
    mount(
      <Modal backdrop isOpen size="lg">
        <ModalHeader>apples</ModalHeader>
      </Modal>
    );
    gears.assertNo.modal('oranges');
  });
});

import React from 'react';
import {
  Alert,
  BlockPanel,
  Button,
  Card,
  CardTitle,
  CheckboxGroup,
  CheckboxInput,
  Combobox,
  Datapair,
  FormGroup,
  FormLabelGroup,
  FormRow,
  Input,
  Modal,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Select,
  SummaryBox,
  SummaryBoxItem,
} from '@appfolio/react-gears';

import * as comp from '../../src/components';

describe('components', () => {
  it('Alert', () => {
    cy.mount(<Alert>some label</Alert>);
    cy.component(comp.Alert).should('be.visible');
    cy.component(comp.Alert, 'some label');
    cy.component(comp.Alert, /some label/);
    cy.component(comp.Alert, 'other label').should('not.exist');
  });

  it('BlockPanel', () => {
    cy.mount(<BlockPanel title="some label">some content</BlockPanel>);
    cy.component(comp.BlockPanel).should('be.visible');
    cy.component(comp.BlockPanel, 'some label');
    cy.component(comp.BlockPanel, 'other label').should('not.exist');
  });

  it('Button', () => {
    cy.mount(<Button>some label</Button>);
    cy.component(comp.Button).should('be.visible');
    cy.component(comp.Button, 'some label');
    cy.component(comp.Button, 'other label').should('not.exist');
  });

  it('Card', () => {
    cy.mount(
      <Card>
        <CardTitle>some label</CardTitle>
      </Card>
    );
    cy.component(comp.Card).should('be.visible');
    cy.component(comp.Card, 'some label');
    cy.component(comp.Card, 'other label').should('not.exist');
  });

  it('Combobox', () => {
    const options = ['alpha', 'bravo', 'charlie'].map((o) => ({
      label: o,
      value: o,
    }));
    cy.mount(
      <FormLabelGroup label="some label">
        <Combobox options={options} />
      </FormLabelGroup>
    );
    cy.component(comp.Combobox).should('be.visible');
    cy.component(comp.Combobox, 'some label');
    cy.component(comp.Combobox, 'other label').should('not.exist');
  });

  it('Datapair', () => {
    cy.mount(<Datapair label="some label" value="some content" />);
    cy.component(comp.Datapair).should('be.visible');
    cy.component(comp.Datapair, 'some label');
    cy.component(comp.Datapair, 'other label').should('not.exist');
  });

  context('Input', () => {
    it('single-line', () => {
      cy.mount(
        <FormLabelGroup label="some label">
          <Input value="some value" />
        </FormLabelGroup>
      );
      cy.component(comp.Input).should('be.visible');
      cy.component(comp.Input, 'some label').should('have.value', 'some value');
      cy.component(comp.Input, 'other label').should('not.exist');
    });

    it('multiline', () => {
      cy.mount(
        <FormLabelGroup label="some label">
          <Input type="textarea" value="some value" />
        </FormLabelGroup>
      );
      cy.component(comp.Input).should('be.visible');
      cy.component(comp.Input, 'some label').should('have.value', 'some value');
      cy.component(comp.Input, 'other label').should('not.exist');
    });

    context('checkboxes', () => {
      it('as Input', () => {
        cy.mount(
          <FormLabelGroup label="some label">
            <Input type="checkbox" />
          </FormLabelGroup>
        );
        cy.component(comp.Input).should('be.visible');
        cy.component(comp.Input, 'some label');
        cy.component(comp.Input, 'other label').should('not.exist');
      });

      it('as CheckboxInput', () => {
        cy.mount(<CheckboxInput id="cb1" checkboxLabel="some label" />);
        cy.component(comp.Input).should('be.visible');
        cy.component(comp.Input, 'some label')
          .invoke('attr', 'id')
          .should('eq', 'cb1');
        cy.component(comp.Input, 'other label').should('not.exist');
      });
    });

    it('radio button', () => {
      cy.mount(
        <FormLabelGroup label="some label">
          <Input type="radio" />
        </FormLabelGroup>
      );
      cy.component(comp.Input).should('be.visible');
      cy.component(comp.Input, 'some label');
      cy.component(comp.Input, 'other label').should('not.exist');
    });

    context('corner cases', () => {
      it('conflicting Select', () => {
        cy.mount(
          <>
            <FormLabelGroup label="some label">
              <Select />
            </FormLabelGroup>
            <FormLabelGroup label="some label">
              <Input value="some value" />
            </FormLabelGroup>
          </>
        );
        cy.component(comp.Input, 'some label').should(
          'have.value',
          'some value'
        );
      });

      it('multi-input FormGroup', () => {
        cy.mount(
          <>
            <FormGroup>
              <FormRow stacked id="i1" label="irrelevant" />
              <CheckboxInput id="cb2" checkboxLabel="ambiguous" />
            </FormGroup>
          </>
        );
        cy.component(comp.Input, 'irrelevant')
          .invoke('attr', 'id')
          .should('eq', 'i1');
        cy.component(comp.Input, 'other label').should('not.exist');
        cy.component(comp.Input, 'ambiguous')
          .invoke('attr', 'id')
          .should('eq', 'cb2');
      });

      it('malformed ID', () => {
        cy.mount(
          <>
            <BlockPanel title="A">
              <CheckboxGroup
                options={['(un parseable)', '#crap#'].map((s) => ({
                  label: s,
                  value: s,
                }))}
                onChange={() => true}
                selected={[]}
              />
            </BlockPanel>
          </>
        );

        cy.component(comp.Input, '(un parseable)').check();
        cy.component(comp.Input, '#crap#').check();
      });
    });
  });

  context('Link', () => {
    it('vanilla HTML', () => {
      cy.mount(
        <Card>
          <a href="about:blank">some label</a>
        </Card>
      );
      cy.component(comp.Link).should('be.visible');
      cy.component(comp.Link, 'some label');
      cy.component(comp.Link, 'other label').should('not.exist');
    });
    it('link-colored button', () => {
      cy.mount(<Button color="link">some label</Button>);
      cy.component(comp.Link).should('be.visible');
      cy.component(comp.Link, 'some label');
      cy.component(comp.Link, 'other label').should('not.exist');
    });
  });

  it('Modal', () => {
    cy.mount(
      <Modal backdrop isOpen size="lg">
        <ModalHeader>some label</ModalHeader>
      </Modal>
    );
    cy.component(comp.Modal).should('be.visible');
    cy.component(comp.Modal, 'some label');
    cy.component(comp.Modal, 'other label').should('not.exist');
  });

  it('Nav', () => {
    cy.mount(
      <Nav>
        <NavItem>
          <NavLink href="#">Nav 1</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Nav 2</NavLink>
        </NavItem>
      </Nav>
    );
    cy.component(comp.Nav).contains('Nav 2').click();
  });

  it('Select', () => {
    cy.mount(
      <FormLabelGroup label="some label">
        <Select />
      </FormLabelGroup>
    );
    cy.component(comp.Select).should('be.visible');
    cy.component(comp.Select, 'some label');
    cy.component(comp.Select, 'other label').should('not.exist');
  });

  it('SummaryBoxItem', () => {
    cy.mount(
      <SummaryBox>
        <SummaryBoxItem label="some label" value="some content" />
      </SummaryBox>
    );
    cy.component(comp.SummaryBoxItem).should('be.visible');
    cy.component(comp.SummaryBoxItem, 'some label');
    cy.component(comp.SummaryBoxItem, 'other label').should('not.exist');
  });
});

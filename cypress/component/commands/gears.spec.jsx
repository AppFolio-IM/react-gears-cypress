import React from 'react';
import {
  Alert,
  BlockPanel,
  Button,
  Card,
  CardTitle,
  CheckboxInput,
  Datapair,
  FormGroup,
  FormLabelGroup,
  FormRow,
  Input,
  Modal,
  ModalHeader,
  Select,
  SummaryBox,
  SummaryBoxItem,
} from '@appfolio/react-gears';

import mount from '../../support/mount';
import * as comp from '../../../src/components';

// Hide/show something after dt has elapsed.
function Timed({ children, init = false, dt = 2000 }) {
  const [isVisible, setIsVisible] = React.useState(init);
  if (dt) setTimeout(() => setIsVisible(!isVisible), dt);
  return isVisible ? children : null;
}

describe('cy.gears', () => {
  context('by label', () => {
    it('Alert', () => {
      mount(<Alert>some label</Alert>);
      cy.gears(comp.Alert, 'some label');
      cy.gears(comp.Alert, /some label/);
      cy.gears(comp.Alert, 'other label').should('not.exist');
    });

    it('BlockPanel', () => {
      mount(<BlockPanel title="some label">some content</BlockPanel>);
      cy.gears(comp.BlockPanel, 'some label');
      cy.gears(comp.BlockPanel, 'other label').should('not.exist');
    });

    it('Button', () => {
      mount(<Button>some label</Button>);
      cy.gears(comp.Button, 'some label');
      cy.gears(comp.Button, 'other label').should('not.exist');
    });

    it('Card', () => {
      mount(
        <Card>
          <CardTitle>some label</CardTitle>
        </Card>
      );
      cy.gears(comp.Card, 'some label');
      cy.gears(comp.Card, 'other label').should('not.exist');
    });

    it('Datapair', () => {
      mount(<Datapair label="some label" value="some content" />);
      cy.gears(comp.Datapair, 'some label');
      cy.gears(comp.Datapair, 'other label').should('not.exist');
    });

    context('Input', () => {
      it('single-line', () => {
        mount(
          <FormLabelGroup label="some label">
            <Input value="some value" />
          </FormLabelGroup>
        );
        cy.gears(comp.Input, 'some label').should('have.value', 'some value');
        cy.gears(comp.Input, 'other label').should('not.exist');
      });

      it('excepting Select', () => {
        mount(
          <>
            <FormLabelGroup label="some label">
              <Select />
            </FormLabelGroup>
            <FormLabelGroup label="some label">
              <Input value="some value" />
            </FormLabelGroup>
          </>
        );
        cy.gears(comp.Input, 'some label').should('have.value', 'some value');
      });

      it('multiline', () => {
        mount(
          <FormLabelGroup label="some label">
            <Input type="textarea" value="some value" />
          </FormLabelGroup>
        );
        cy.gears(comp.Input, 'some label').should('have.value', 'some value');
        cy.gears(comp.Input, 'other label').should('not.exist');
      });

      it('checkbox', () => {
        mount(
          <>
            <FormLabelGroup label="some label">
              <Input id="cb1" type="checkbox" />
            </FormLabelGroup>
            <FormGroup>
              <FormRow stacked label="irrelevant" />
              <CheckboxInput id="cb2" checkboxLabel="ambiguous" />
            </FormGroup>
          </>
        );
        cy.gears(comp.Input, 'some label')
          .invoke('attr', 'id')
          .should('eq', 'cb1');
        cy.gears(comp.Input, 'other label').should('not.exist');
        cy.gears(comp.Input, 'ambiguous')
          .invoke('attr', 'id')
          .should('eq', 'cb2');
      });

      it('radio button', () => {
        mount(
          <FormLabelGroup label="some label">
            <Input type="radio" />
          </FormLabelGroup>
        );
        cy.gears(comp.Input, 'some label');
        cy.gears(comp.Input, 'other label').should('not.exist');
      });
    });

    context('Link', () => {
      it('vanilla HTML', () => {
        mount(
          <Card>
            <a href="about:blank">some label</a>
          </Card>
        );
        cy.gears(comp.Link, 'some label');
        cy.gears(comp.Link, 'other label').should('not.exist');
      });
      it('link-colored button', () => {
        mount(<Button color="link">some label</Button>);
        cy.gears(comp.Link, 'some label');
        cy.gears(comp.Link, 'other label').should('not.exist');
      });
    });

    it('Modal', () => {
      mount(
        <Modal backdrop isOpen size="lg">
          <ModalHeader>some label</ModalHeader>
        </Modal>
      );
      cy.gears(comp.Modal, 'some label');
      cy.gears(comp.Modal, 'other label').should('not.exist');
    });

    it('Select', () => {
      mount(
        <FormLabelGroup label="some label">
          <Select />
        </FormLabelGroup>
      );
      cy.gears(comp.Select, 'some label');
      cy.gears(comp.Select, 'other label').should('not.exist');
    });

    it('SummaryBoxItem', () => {
      mount(
        <SummaryBox>
          <SummaryBoxItem label="some label" value="some content" />
        </SummaryBox>
      );
      cy.gears(comp.SummaryBoxItem, 'some label');
      cy.gears(comp.SummaryBoxItem, 'other label').should('not.exist');
    });
  });

  context('within outer subject', () => {
    it('BlockPanel', () => {
      mount(
        <>
          <BlockPanel title="A">
            <Alert>A</Alert>
            <FormLabelGroup label="A">
              <Input value="A" />
            </FormLabelGroup>
            <Button color="primary">A</Button>
          </BlockPanel>
          <BlockPanel title="B">
            <Alert>B</Alert>
            <FormLabelGroup label="B">
              <Input value="B" />
            </FormLabelGroup>
            <Button color="secondary">B</Button>
          </BlockPanel>
        </>
      );
      cy.gears(comp.BlockPanel, 'A').within(() => {
        cy.gears(comp.Alert, 'A');
        cy.gears(comp.Input, 'A').should('have.value', 'A');
        cy.gears(comp.Button, 'A').should('have.text', 'A');
      });
      cy.gears(comp.BlockPanel, 'B').within(() => {
        cy.gears(comp.Alert, 'B');
        cy.gears(comp.Input, 'B').should('have.value', 'B');
        cy.gears(comp.Button, 'B').should('have.text', 'B');
      });
    });
  });

  context('best match', () => {
    beforeEach(() => {
      mount(
        <>
          <BlockPanel title="A">
            <a href="#a_foobar">foobar</a>
            &nbsp;
            <a href="#a_foo">foo</a>
          </BlockPanel>
          <BlockPanel title="B">
            <a href="#b_foobar">foobar</a>
            &nbsp;
            <a href="#b_foo">foo</a>
          </BlockPanel>
        </>
      );
    });

    it('chooses shortest text', () => {
      cy.gears(comp.Link, 'foo').should('have.attr', 'href', '#a_foo');

      cy.gears(comp.BlockPanel, 'B')
        .gears(comp.Link, 'foo')
        .should('have.attr', 'href', '#b_foo');

      cy.gears(comp.BlockPanel, 'A').within(() => {
        cy.gears(comp.Link, 'foo').should('have.attr', 'href', '#a_foo');
        cy.gears(comp.Link, 'foobar').should('have.attr', 'href', '#a_foobar');
      });
    });

    it('supports RegExp', () => {
      cy.gears(comp.Link, /FOO/i).should('have.attr', 'href', '#a_foo');

      cy.gears(comp.BlockPanel, 'B')
        .gears(comp.Link, /FOO/i)
        .should('have.attr', 'href', '#b_foo');

      cy.gears(comp.BlockPanel, 'A').within(() => {
        cy.gears(comp.Link, /FOO/i).should('have.attr', 'href', '#a_foo');
        cy.gears(comp.Link, /FOOBAR/i).should('have.attr', 'href', '#a_foobar');
      });
    });
  });

  context('retry', () => {
    context('top level', () => {
      it('with default assertion', () => {
        mount(
          <Timed>
            <BlockPanel title="now you see me"></BlockPanel>
          </Timed>
        );
        cy.gears(comp.BlockPanel, 'now you see me');
      });
      it('with negative assertion', () => {
        mount(
          <Timed init={true}>
            <BlockPanel title="now you see me"></BlockPanel>
          </Timed>
        );
        cy.gears(comp.BlockPanel, 'now you see me').should('not.exist');
      });
    });

    context('within subject', () => {
      it('with default assertion', () => {
        mount(
          <BlockPanel title="outer subject">
            <Timed>
              <FormLabelGroup label="now you see me">
                <Input value="some value" />
              </FormLabelGroup>
            </Timed>
          </BlockPanel>
        );
        cy.gears(comp.BlockPanel, 'outer subject').within(() => {
          cy.gears(comp.Input, 'now you see me').should(
            'have.value',
            'some value'
          );
        });
      });
      it('with negative assertion', () => {
        mount(
          <BlockPanel title="outer subject">
            <Timed init={true}>
              <FormLabelGroup label="now you see me">
                <Input value="some value" />
              </FormLabelGroup>
            </Timed>
          </BlockPanel>
        );
        cy.gears(comp.BlockPanel, 'outer subject').within(() => {
          cy.gears(comp.Input, 'now you see me').should('not.exist');
        });
      });
    });
  });
});

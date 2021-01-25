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

describe('cy.component', () => {
  context('by label', () => {
    it('Alert', () => {
      mount(<Alert>some label</Alert>);
      cy.component(comp.Alert, 'some label');
      cy.component(comp.Alert, /some label/);
      cy.component(comp.Alert, 'other label').should('not.exist');
    });

    it('BlockPanel', () => {
      mount(<BlockPanel title="some label">some content</BlockPanel>);
      cy.component(comp.BlockPanel, 'some label');
      cy.component(comp.BlockPanel, 'other label').should('not.exist');
    });

    it('Button', () => {
      mount(<Button>some label</Button>);
      cy.component(comp.Button, 'some label');
      cy.component(comp.Button, 'other label').should('not.exist');
    });

    it('Card', () => {
      mount(
        <Card>
          <CardTitle>some label</CardTitle>
        </Card>
      );
      cy.component(comp.Card, 'some label');
      cy.component(comp.Card, 'other label').should('not.exist');
    });

    it('Datapair', () => {
      mount(<Datapair label="some label" value="some content" />);
      cy.component(comp.Datapair, 'some label');
      cy.component(comp.Datapair, 'other label').should('not.exist');
    });

    context('Input', () => {
      it('single-line', () => {
        mount(
          <FormLabelGroup label="some label">
            <Input value="some value" />
          </FormLabelGroup>
        );
        cy.component(comp.Input, 'some label').should(
          'have.value',
          'some value'
        );
        cy.component(comp.Input, 'other label').should('not.exist');
      });

      it('multiline', () => {
        mount(
          <FormLabelGroup label="some label">
            <Input type="textarea" value="some value" />
          </FormLabelGroup>
        );
        cy.component(comp.Input, 'some label').should(
          'have.value',
          'some value'
        );
        cy.component(comp.Input, 'other label').should('not.exist');
      });

      context('checkboxes', () => {
        it('as Input', () => {
          mount(
            <FormLabelGroup label="some label">
              <Input type="checkbox" />
            </FormLabelGroup>
          );
          cy.component(comp.Input, 'some label');
          cy.component(comp.Input, 'other label').should('not.exist');
        });

        it('as CheckboxInput', () => {
          mount(<CheckboxInput id="cb1" checkboxLabel="some label" />);
          cy.component(comp.Input, 'some label')
            .invoke('attr', 'id')
            .should('eq', 'cb1');
          cy.component(comp.Input, 'other label').should('not.exist');
        });
      });

      it('radio button', () => {
        mount(
          <FormLabelGroup label="some label">
            <Input type="radio" />
          </FormLabelGroup>
        );
        cy.component(comp.Input, 'some label');
        cy.component(comp.Input, 'other label').should('not.exist');
      });

      context('corner cases', () => {
        it('conflicting Select', () => {
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
          cy.component(comp.Input, 'some label').should(
            'have.value',
            'some value'
          );
        });

        it('multi-input FormGroup', () => {
          mount(
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
      });
    });

    context('Link', () => {
      it('vanilla HTML', () => {
        mount(
          <Card>
            <a href="about:blank">some label</a>
          </Card>
        );
        cy.component(comp.Link, 'some label');
        cy.component(comp.Link, 'other label').should('not.exist');
      });
      it('link-colored button', () => {
        mount(<Button color="link">some label</Button>);
        cy.component(comp.Link, 'some label');
        cy.component(comp.Link, 'other label').should('not.exist');
      });
    });

    it('Modal', () => {
      mount(
        <Modal backdrop isOpen size="lg">
          <ModalHeader>some label</ModalHeader>
        </Modal>
      );
      cy.component(comp.Modal, 'some label');
      cy.component(comp.Modal, 'other label').should('not.exist');
    });

    it('Select', () => {
      mount(
        <FormLabelGroup label="some label">
          <Select />
        </FormLabelGroup>
      );
      cy.component(comp.Select, 'some label');
      cy.component(comp.Select, 'other label').should('not.exist');
    });

    it('SummaryBoxItem', () => {
      mount(
        <SummaryBox>
          <SummaryBoxItem label="some label" value="some content" />
        </SummaryBox>
      );
      cy.component(comp.SummaryBoxItem, 'some label');
      cy.component(comp.SummaryBoxItem, 'other label').should('not.exist');
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
      cy.component(comp.BlockPanel, 'A').within(() => {
        cy.component(comp.Alert, 'A');
        cy.component(comp.Input, 'A').should('have.value', 'A');
        cy.component(comp.Button, 'A').should('have.text', 'A');
      });
      cy.component(comp.BlockPanel, 'B').within(() => {
        cy.component(comp.Alert, 'B');
        cy.component(comp.Input, 'B').should('have.value', 'B');
        cy.component(comp.Button, 'B').should('have.text', 'B');
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
      cy.component(comp.Link, 'foo').should('have.attr', 'href', '#a_foo');

      cy.component(comp.BlockPanel, 'B')
        .component(comp.Link, 'foo')
        .should('have.attr', 'href', '#b_foo');

      cy.component(comp.BlockPanel, 'A').within(() => {
        cy.component(comp.Link, 'foo').should('have.attr', 'href', '#a_foo');
        cy.component(comp.Link, 'foobar').should(
          'have.attr',
          'href',
          '#a_foobar'
        );
      });
    });

    it('supports RegExp', () => {
      cy.component(comp.Link, /FOO/i).should('have.attr', 'href', '#a_foo');

      cy.component(comp.BlockPanel, 'B')
        .component(comp.Link, /FOO/i)
        .should('have.attr', 'href', '#b_foo');

      cy.component(comp.BlockPanel, 'A').within(() => {
        cy.component(comp.Link, /FOO/i).should('have.attr', 'href', '#a_foo');
        cy.component(comp.Link, /FOOBAR/i).should(
          'have.attr',
          'href',
          '#a_foobar'
        );
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
        cy.component(comp.BlockPanel, 'now you see me');
      });
      it('with negative assertion', () => {
        mount(
          <Timed init={true}>
            <BlockPanel title="now you see me"></BlockPanel>
          </Timed>
        );
        cy.component(comp.BlockPanel, 'now you see me').should('not.exist');
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
        cy.component(comp.BlockPanel, 'outer subject').within(() => {
          cy.component(comp.Input, 'now you see me').should(
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
        cy.component(comp.BlockPanel, 'outer subject').within(() => {
          cy.component(comp.Input, 'now you see me').should('not.exist');
        });
      });
    });
  });
});

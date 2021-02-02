import React from 'react';
import {
  Alert,
  BlockPanel,
  Button,
  FormLabelGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
} from '@appfolio/react-gears';

import mount from '../../support/mount';
import * as comp from '../../../src/components';
import { component as rawComponent } from '../../../src/commands/component';

// Hide/show something after dt has elapsed.
function Timed({ children, init = false, dt = 2000 }) {
  const [isVisible, setIsVisible] = React.useState(init);
  if (dt) setTimeout(() => setIsVisible(!isVisible), dt);
  return isVisible ? children : null;
}

describe('cy.component', () => {
  context('best match', () => {
    beforeEach(() => {
      mount(
        <>
          <Nav>
            <NavItem>
              <NavLink href="#">Nav 1</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Nav 2</NavLink>
            </NavItem>
          </Nav>
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

    it('finds unlabeled components', () => {
      cy.component(comp.Nav)
        .contains('Nav 2')
        .click();
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

  context('with invalid param', () => {
    // TODO: how to test  this?
    it('throws', () => {
      try {
        rawComponent(undefined, undefined, 'Label');
      } catch (e) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/invalid component spec/);
      }
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
});

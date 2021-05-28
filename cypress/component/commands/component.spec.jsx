import React from 'react';
import {
  Alert,
  BlockPanel,
  Button,
  Datapair,
  FormLabelGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
} from '@appfolio/react-gears';
import Timed from '../../support/Timed';
import mount from '../../support/mount';
import * as comp from '../../../src/components';
import { component as rawComponent } from '../../../src/commands/component';

describe('cy.component', () => {
  context('basics', () => {
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
        </>
      );
    });

    it('finds labeled components', () => {
      cy.component(comp.Link, 'foo').should('be.visible');
      cy.component(comp.Link, 'foo', { log: false }).should('be.visible');
    });

    it('finds unlabeled components', () => {
      cy.component(comp.Nav)
        .contains('Nav 2')
        .click();
      cy.component(comp.Nav, { log: false })
        .contains('Nav 1')
        .click();
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
          <BlockPanel title="C">
            <div className="form-group js-datapair psych">
              <Datapair label="ambiguous label" value={'some value'} />
            </div>
            <Datapair label="ambiguous label" value={'other value'} />
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

    it('chooses the first element', () => {
      cy.component(comp.Datapair, 'ambiguous label').contains('some value');
    });

    it('chooses the deepest element', () => {
      cy.component(comp.Datapair, 'ambiguous label')
        .parent()
        .should('have.class', 'psych');
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

  context('invalid parameters', () => {
    it('no Component', () => {
      expect(() => rawComponent(undefined, undefined, 'Label')).to.throw(
        'invalid component spec'
      );
    });
    it('React component', () => {
      expect(() => rawComponent(undefined, Button, 'Label')).to.throw(
        'React component'
      );
    });
    it('extraneous text', () => {
      expect(() => rawComponent(undefined, comp.Nav, 'Hi')).to.throw(
        'does not implement ComponentWithText'
      );
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

  context('given all:true', () => {
    beforeEach(() => {
      mount(
        <>
          <BlockPanel title="A">
            <Button>1</Button>
            <Button>2</Button>
          </BlockPanel>
          <BlockPanel title="B">
            <Button>3</Button>
            <Button>4</Button>
            <Button>5</Button>
          </BlockPanel>
        </>
      );
    });

    it('finds everything', () => {
      cy.component(comp.BlockPanel, { all: true }).should('have.length', 2);
      cy.component(comp.Button, { all: true }).should('have.length', 5);
      cy.component(comp.BlockPanel, 'A')
        .component(comp.Button, { all: true })
        .should('have.length', 2);
      cy.component(comp.BlockPanel, 'B')
        .component(comp.Button, { all: true })
        .should('have.length', 3);
    });
  });
});

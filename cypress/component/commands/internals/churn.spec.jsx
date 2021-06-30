/* eslint-disable cypress/no-unnecessary-waiting */
import React from 'react';
import { mount } from '@cypress/react';
import { requeryDetached } from '../../../../src/commands/internals/churn';
import { Churner } from '../../../support/components';

const beDetached = $subject => {
  expect(Cypress.dom.isDetached($subject)).to.be.true;
  return $subject;
};
const beAttached = $subject => {
  expect(Cypress.dom.isAttached($subject)).to.be.true;
  return $subject;
};

describe('churn command', () => {
  context('by element ID', () => {
    beforeEach(() => {
      mount(
        <Churner>
          {i => (
            <>
              <span>epoch {i}</span>
              <input key={`foo${i}`} id="foo" value="foo" />
              <input key={`bar${i}`} id="bar" value="bar" />
            </>
          )}
        </Churner>
      );
    });

    it('requeries one', () => {
      cy.get('#foo')
        .should(beAttached)
        .wait(1000)
        .should(beDetached)
        .then(requeryDetached)
        .should(beAttached);
    });

    it('requeries many', () => {
      cy.get('input')
        .should(beAttached)
        .wait(1000)
        .should(beDetached)
        .then(requeryDetached)
        .should(beAttached);
    });
  });

  context('by element path', () => {
    context('with same structure', () => {
      beforeEach(() => {
        mount(
          <Churner>
            {i => (
              <div>
                wow this is cool
                <span>epoch {i}</span>
                some gunk
                <div key={i}>
                  this is really neat
                  <ul>
                    <li>
                      <input key={i} value={`foo${i}`} />
                    </li>
                    boring stuff
                    <li>
                      <input key={i} value={`bar${i}`} />
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </Churner>
        );
      });

      it('requeries one', () => {
        cy.get('li:nth-child(2) > input')
          .should(beAttached)
          .and('have.value', 'bar0')
          .wait(1000)
          .should(beDetached)
          .then(requeryDetached)
          .should(beAttached)
          .and('have.value', 'bar1');
      });

      it('requeries many', () => {
        cy.get('input')
          .should(beAttached)
          .wait(1000)
          .should(beDetached)
          .then(requeryDetached)
          .should(beAttached);
      });
    });
  });
});

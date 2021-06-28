// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
import React, { useEffect, useState } from 'react';
import { mount } from '@cypress/react';
import { requeryDetached } from '../../../../src/commands/internals/churn'

function Churner() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!i) setTimeout(() => setI(i + 1), 500);
  }, [i]);

  return (
    <div>
      <span>epoch {i}</span>
      <input key={`foo${i}`} id="foo" value="foo" />
      <input key={`bar${i}`} id="bar" value="bar" />
    </div>
  );
}

const mustBeDetached = $subject => {
  expect(Cypress.dom.isDetached($subject)).to.be.true;
  return $subject;
};
const mustBeAttached = $subject => {
  expect(Cypress.dom.isAttached($subject)).to.be.true;
  return $subject;
};

describe('churn command', () => {
  context('by element ID', () => {
    beforeEach(() => {
      mount(<Churner />);
    });

    it('requeries one', () => {
      cy.get('#foo')
        .then(mustBeAttached)
        .wait(1000)
        .then(mustBeDetached)
        .then($s => requeryDetached($s))
        .then(mustBeAttached);
    });

    it('requeries many', () => {
      cy.get('input')
        .then(mustBeAttached)
        .wait(1000)
        .then(mustBeDetached)
        .then($s => requeryDetached($s))
        .then(mustBeAttached);
    });
  });
});

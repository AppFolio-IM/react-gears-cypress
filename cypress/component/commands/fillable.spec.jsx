import React from 'react';
import {
  BlockPanel,
  FormLabelGroup,
  Input,
  Select,
} from '@appfolio/react-gears';

import mount from '../../support/mount';
import Timed from '../../support/Timed';
import * as comp from '../../../src/components';

describe('cy.fillable', () => {
  context('basics', () => {
    context('Input component', () => {
      beforeEach(() => {
        mount(
          <FormLabelGroup inputId="bingo" label="some label">
            <Input id="bingo" name="someName" placeholder="some placeholder" />
          </FormLabelGroup>
        );
      });

      it('finds by proper label', () => {
        cy.fillable('some label')
          .should('have.length', '1')
          .and('have.attr', 'id', 'bingo');
      });

      it('finds by name', () => {
        cy.fillable('someName')
          .should('have.length', '1')
          .and('have.attr', 'id', 'bingo');
      });

      it('finds by placeholder', () => {
        cy.fillable('some placeholder')
          .should('have.length', '1')
          .and('have.attr', 'id', 'bingo');
      });
    });

    context('textarea tag', () => {
      beforeEach(() => {
        <FormLabelGroup inputId="bingo" label="some label">
          <Input
            id="bingo"
            name="someName"
            placeholder="some placeholder"
            type="textarea"
          />
        </FormLabelGroup>;
      });
      it('finds by proper label', () => {
        cy.fillable('some label').should('have.attr', 'id', 'bingo');
      });

      it('finds by name', () => {
        cy.fillable('someName').should('have.attr', 'id', 'bingo');
      });

      it('finds by placeholder', () => {
        cy.fillable('some placeholder').should('have.attr', 'id', 'bingo');
      });
    });

    context('Select component', () => {
      const options = ['steve rogers', 'tony stark', 'natasha romanov'].map(
        o => ({
          label: o,
          value: o,
        })
      );

      beforeEach(() => {
        mount(
          <FormLabelGroup inputId="bingo" label="some label">
            <Select
              id="bingo"
              options={options}
              name="someName"
              placeholder="some placeholder"
            />
          </FormLabelGroup>
        );
      });

      it('finds by proper label', () => {
        cy.fillable('some label')
          .should('have.length', '1')
          .and('have.attr', 'id', 'bingo');
      });

      it('finds by name', () => {
        cy.fillable('someName').should('have.attr', 'id', 'bingo');
      });

      // TODO - ugly special case; react-select uses a div.Select-placeholder instead of putting the placeholder in the input. :(
      it.skip('finds by placeholder', () => {
        cy.fillable('some placeholder')
          .should('have.length', '1')
          .and('have.attr', 'id', 'bingo');
      });
    });

    context('select tag', () => {
      beforeEach(() => {
        mount(
          <FormLabelGroup inputId="bingo" label="some label">
            <select id="bingo" name="someName" type="select">
              <option value="">Select</option>
              <option>steve rogers</option>
              <option>tony stark</option>
              <option>natasha romanov</option>
            </select>
          </FormLabelGroup>
        );
      });

      it('finds by proper label', () => {
        cy.fillable('some label')
          .should('have.length', '1')
          .and('have.attr', 'id', 'bingo');
      });

      it('finds by name', () => {
        cy.fillable('someName')
          .should('have.length', '1')
          .and('have.attr', 'id', 'bingo');
      });
    });
  });

  context('retry', () => {
    context('top level', () => {
      beforeEach(() => {
        mount(
          <Timed>
            <FormLabelGroup inputId="bingo" label="some label">
              <Input id="bingo" />
            </FormLabelGroup>
          </Timed>
        );
      });

      it('with default assertion', () => {
        cy.fillable('some label')
          .should('have.length', '1')
          .and('have.attr', 'id', 'bingo');
      });

      it('with negative assertion', () => {
        cy.fillable('other label').should('not.exist');
      });
    });

    context('within subject', () => {
      beforeEach(() => {
        mount(
          <Timed>
            <BlockPanel title="now you see me">
              <FormLabelGroup inputId="bingo" label="some label">
                <Input id="bingo" />
              </FormLabelGroup>
            </BlockPanel>
          </Timed>
        );
      });

      it('with default assertion', () => {
        cy.component(comp.BlockPanel, 'now you see me').within(() => {
          cy.fillable('some label')
            .should('have.length', '1')
            .and('have.attr', 'id', 'bingo');
        });
      });

      it('with negative assertion', () => {
        cy.fillable('other label').should('not.exist');
      });
    });
  });
});

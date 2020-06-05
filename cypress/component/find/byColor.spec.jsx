import { mount } from 'cypress-react-unit-test';
import React from 'react';
import { Alert, Card } from 'react-gears';

import * as gears from '../../../src/find';

describe('find by color', () => {
  // TODO: pending resolution of https://github.com/bahmutov/cypress-react-unit-test/issues/15
  it.skip('alert', () => {
    mount(
      <Card>
        <Alert color="warning">Will Robinson</Alert>
        <Alert color="danger">Will Robinson</Alert>
      </Card>
    );
    gears
      .alert('Will Robinson', 'warning')
      .should('have.attr', 'class', 'alert alert-warning fade show');
    gears
      .alert('Will Robinson', 'danger')
      .should('have.attr', 'class', 'alert alert-danger fade show');
  });
});

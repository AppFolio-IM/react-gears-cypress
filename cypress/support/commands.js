import { mount } from 'cypress-react-unit-test';
import React from 'react';
import { Container, Row, Col } from 'react-gears';

import * as commands from '../../src/commands';

Cypress.Commands.overwrite('clear', commands.clear);
Cypress.Commands.add('fill', { prevSubject: true }, commands.fill);
Cypress.Commands.overwrite('select', commands.select);

Cypress.Commands.add('mountGears', component => {
  const canvas = (
    <Container fluid className="mt-5">
      <Row>
        <Col>{component}</Col>
      </Row>
    </Container>
  );
  mount(canvas, {
    stylesheet:
      'https://appfolio.github.io/bootstrap-coastline/bootstrap-coastline.css',
  });
});

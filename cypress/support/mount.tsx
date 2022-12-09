import { mount as realMount } from '@cypress/react';
import React from 'react';
import { Container, Row, Col } from '@appfolio/react-gears';

/**
 * Mount a React component, but inject a reasonable Gears stylesheet &
 * wrap it in a responsive container for a pleasing, visually accurate
 * appearance.
 */
export default function mount(component) {
  const canvas = (
    <Container fluid className="mt-5">
      <Row>
        <Col>{component}</Col>
      </Row>
    </Container>
  );
  realMount(canvas, {});
}

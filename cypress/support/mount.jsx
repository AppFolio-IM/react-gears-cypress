import { mount as realMount } from '@cypress/react';
import React from 'react';
import { Container, Row, Col } from 'react-gears';

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
  realMount(canvas, {
    stylesheets: [
      'https://appfolio.github.io/bootstrap-coastline/bootstrap-coastline.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css',
    ],
  });
}

import React from 'react';
import { find, match } from '../../src/index';

describe('react-gears-cypress', () => {
  context('deprecated exports', () => {
    it('regexp helpers', () => {
      expect(find).not.to.be.null;
    });
  });

  context('exports', () => {
    it('regexp helpers', () => {
      expect(match).not.to.be.null;
    });
  });
});

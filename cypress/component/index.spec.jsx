import { find, match } from '../../src/index';

describe('react-gears-cypress', () => {
  context('versioning', () => {
    // @TODO switch to  @appfolio/react-gears-cypress
    it.skip('is in lockstep with react-gears', () => {
      cy.readFile('package.json').then(spec => {
        const verRGC = spec.version.replace(/-.*$/, '');
        const verRG = spec.devDependencies['react-gears'];
        expect(verRGC).to.equal(verRG);
      });
    });

    it('tests a reasonable Cypress version', () => {
      cy.readFile('package.json').then(spec => {
        const peerCypress = spec.peerDependencies['cypress'];
        const devCypress = spec.devDependencies['cypress'];
        expect(peerCypress).to.equal(devCypress);
      });
    });
  });

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

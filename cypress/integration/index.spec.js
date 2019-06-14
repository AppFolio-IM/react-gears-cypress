import indexDefault, { find, match, sel } from '../../src/index';

describe('react-gears-cypress', () => {
  it('exports finders as default', () => {
    expect(indexDefault).to.eq(find);
  });

  it('exports finders', () => {
    expect(find).not.to.be.null;
    expect(find.assertNo).not.to.be.null;
  });

  it('exports regexp helpers', () => {
    expect(match).not.to.be.null;
  });

  it('exports CSS selectors', () => {
    expect(sel).not.to.be.null;
    Object.values(sel).forEach(value => {
      expect(value).to.match(/[a-z]*\.?[a-z0-9-]+/);
    });
  });
});

import {Finders, NegativeFinders} from '../index';

// TODO: turn this into a beforeEach
function setup() {
  const fn = jest.fn();
  const then = jest.fn(cb => cb())
  const within = jest.fn(cb => cb())
  const wrap = jest.fn(cb => cb())
  const cy = {
    _: fn,
    clear: fn,
    click: fn,
    contains: fn,
    closest: fn,
    find: fn,
    get: fn,
    parent: fn,
    should: fn,
    then,
    within,
    wrap,
    type: fn,
  };
  ([fn, then, within, wrap]).forEach(fn => fn.mockReturnValue(cy))
  const gears = new Finders(cy)
  return {cy, gears}
}

describe('finders', () => {    
  Object.keys(new Finders()).forEach(name => {
    const {cy, gears} = setup();
    const fn = gears[name]
    if(typeof fn !== 'function') return;
    test(`'${name}' finds by label`, () => {
      gears[name]('Some Label');
      expect(cy._).toHaveBeenCalledWith(expect.anything(), 'Some Label')
    })
  })

  describe('negative assertions', () => {
    Object.keys(new NegativeFinders()).forEach(name => {
      const {cy, gears} = setup();
      const fn = gears.assertNo[name]
      if(typeof fn !== 'function') return;
      test(`${fn.name} finds by label`, () => {
        fn('Some Label')
        expect(cy._).toHaveBeenCalledWith(expect.anything(), 'Some Label')
        expect(cy.should).toHaveBeenCalledWith('not.exist')
      })
    })
  })
})

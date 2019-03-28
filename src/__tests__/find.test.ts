import {Finders, NegativeFinders} from '../index';

// TODO: turn this into a beforeEach
function setup():any {
  const fn = jest.fn();
  const should = jest.fn();
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
    should,
    then,
    within,
    wrap,
    type: fn,
  };
  ([fn, then, within, wrap]).forEach(fn2 => fn2.mockReturnValue(cy))
  const gears = new Finders(cy)
  return {cy, gears}
}

const someLabel = 'Some Label'

describe('all finders', () => {
  Object.keys(new Finders()).forEach(name => {
    const {cy, gears} = setup();
    const fn = gears[name]
    if(typeof fn !== 'function') return;
    test(`'${name}' finds by label`, () => {
      gears[name](someLabel);
      expect(cy._).toHaveBeenCalledWith(expect.anything(), someLabel)
      expect(cy.should).not.toHaveBeenCalled()
    })
  })

  describe('negative assertions', () => {
    Object.keys(new NegativeFinders()).forEach(name => {
      const {cy, gears} = setup();
      const fn = gears.assertNo[name]
      if(typeof fn !== 'function') return;
      test(`${fn.name} finds by label`, () => {
        fn(someLabel)
        expect(cy._).toHaveBeenCalledWith(expect.anything(), someLabel)
        expect(cy.should).toHaveBeenCalledWith('not.exist')
      })
    })
  })
})

describe('specific finders', () => {
  describe('alert', () => {
    it('takes an optional color', () => {
      const {cy, gears} = setup();
      gears.alert(someLabel, 'danger')
      expect(cy._).toHaveBeenCalledWith('.alert.alert-danger', someLabel)    
    })  
  })
  
  describe('select', () => {    
    function setupSelectChain(cy, vanilla:boolean):any {
      const find = jest.fn(selector => {
        switch(selector) {
          case '.Select-control':
            return vanilla ? {} : {length: 1, mockReactComponent: true}
          case 'select':
          return vanilla ? {length: 1, mockHtmlTag: true} : {}
          default:
            throw new Error('bad test mocks; please look at Finders.select and update me')
        }
      })
      const then = jest.fn(callback => callback({find}))
      const closest = jest.fn(() => ({then}))
      cy.contains = jest.fn(() => ({closest})); // eslint-disable-line no-param-reassign
    }
    
    it('works with vanilla HTML select', () => {
      const {cy, gears} = setup();
      setupSelectChain(cy, true);

      const rabbit = gears.select(someLabel)

      expect(rabbit.mockHtmlTag).toBe(true)
    })

    it('works with react-select-plus', () => {
      const {cy, gears} = setup();
      setupSelectChain(cy, false);

      const rabbit = gears.select(someLabel)
      expect(cy.contains).toHaveBeenCalledWith('label',someLabel)
      expect(rabbit.mockReactComponent).toBe(true)
    })
  })

  describe('negative assertions', () => {
    describe('alert', () => {
      it('takes an optional color', () => {
        const {cy, gears} = setup();
        gears.assertNo.alert(someLabel, 'danger')
        expect(cy._).toHaveBeenCalledWith('.alert.alert-danger', someLabel)
        expect(cy.should).toHaveBeenCalledWith('not.exist')
      })  
      })
  })
})

import {Chainable} from '../index';
import * as gears from '../find';

interface MockCy {
    _(): () => any;
}

declare var global: any;
declare var cy: Chainable & MockCy;

// TODO: turn this into a beforeEach
beforeEach(() => {
    // shared mock for ordinary commands
    const fn = jest.fn();

    // commands that have special verification
    const contains = jest.fn();
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

    // make everything chainable
    ([contains, fn, should, then, within, wrap]).forEach(fn2 => fn2.mockReturnValue(cy))

    global.cy = cy;
})

const someLabel = 'Some Label'

describe('all finders', () => {
    const methods = Object.keys(gears).filter(key => typeof gears[key] === 'function')
    methods.forEach(name => {
        describe(name, () => {
            it('finds by label', () => {
                gears[name](someLabel);
                expect(cy.contains).toHaveBeenCalledWith(expect.anything(), someLabel)
                expect(cy.should).not.toHaveBeenCalled()
            })
        })
    })

    describe('negative assertions', () => {
        const methods = Object.keys(gears.assertNo).filter(key => typeof gears.assertNo[key] === 'function')
        methods.forEach(name => {
            describe(name, () => {
                it('finds by label', () => {
                    gears.assertNo[name](someLabel);
                    expect(cy.contains).toHaveBeenCalledWith(expect.anything(), someLabel)
                    expect(cy.should).toHaveBeenCalledWith('not.exist')
                })  
            })
        })
    })
})

describe('specific finders', () => {
    describe('alert', () => {
        it('takes an optional color', () => {
            gears.alert(someLabel, 'danger')
            expect(cy._).toHaveBeenCalledWith('.alert.alert-danger', someLabel)    
        })  
    })
  
    describe('input', () => {
        function setupInputChain(cy, flavor: 'reactSelect' | 'vanilla' | 'unknown'): any {
      
            const then = jest.fn((callback) => {
                const attr = (name) => {
                    switch(name) {
                        case 'role':
                            return (flavor === 'reactSelect' ? 'combobox' : null);
                        default:
                            throw new Error(`bad test mocks; please look at Finders.select and update me to handle its query for 'attr('${name}')`)
                    }
                }
                switch(flavor) {
                    case 'reactSelect':
                        return callback({length: 1, mockReactComponent: true, attr})
                    case 'vanilla':
                        return callback({length: 1, mockHtmlTag: true, attr})
                    case 'unknown':
                        return callback({})
                    default:
                        throw new Error(`bad test helper; please edit setupInputChain and handle ${flavor}`)
                }
            })

            const find = jest.fn(() => ({then}))
            const closest = jest.fn(() => ({find}))
            cy.contains = jest.fn(() => ({closest}))
        }

        it('finds input fields', () => {
            setupInputChain(cy, 'vanilla')

            const rabbit = gears.input(someLabel)
            expect(cy.contains).toHaveBeenCalledWith('label', someLabel)
            expect((rabbit as any).mockHtmlTag).toBe(true)
        })

        it('throws when finding a react-select-plus', () => {
            setupInputChain(cy, 'reactSelect')

            expect(() => {
                gears.input(someLabel)
            }).toThrow();
        })
    })

    describe('select', () => {    
        function setupSelectChain(cy, flavor: 'react' | 'vanilla' | 'unknown'): any {
            const find = jest.fn(selector => {
                switch(selector) {
                    case '.Select-control':
                        return (flavor === 'react') ? {length: 1, mockReactComponent: true} : {}
                    case 'select':
                        return (flavor === 'vanilla') ? {length: 1, mockHtmlTag: true} : {}
                    default:
                        if(flavor === 'unknown')
                            return {}
                        throw new Error(`bad test mocks; please look at Finders.select and update me to handle its query for '${selector}'`)
                }
            })
            const then = jest.fn(callback => callback({find}))
            const closest = jest.fn(() => ({then}))
            cy.contains = jest.fn(() => ({closest})); // eslint-disable-line no-param-reassign
        }
    
        it('works with vanilla HTML select', () => {
            setupSelectChain(cy, 'vanilla');

            const rabbit = gears.select(someLabel)

            expect((rabbit as any).mockHtmlTag).toBe(true)
        })

        it('works with react-select-plus', () => {
            setupSelectChain(cy, 'react');

            const rabbit = gears.select(someLabel)
            expect(cy.contains).toHaveBeenCalledWith('label', someLabel)
            expect((rabbit as any).mockReactComponent).toBe(true)
        })

        it('throws with unknown components', () => {
            setupSelectChain(cy, 'unknown');

            expect(() => {
                gears.select(someLabel)
            }).toThrow("react-gears-cypress: cannot determine select type for 'Some Label'")
        })
    })

    describe('negative assertions', () => {
        describe('alert', () => {
            it('takes an optional color', () => {
                gears.assertNo.alert(someLabel, 'danger')
                expect(cy._).toHaveBeenCalledWith('.alert.alert-danger', someLabel)
                expect(cy.should).toHaveBeenCalledWith('not.exist')
            })  
        })
    })
})

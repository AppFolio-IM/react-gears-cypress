import {Commands, Finders, NegativeFinders, match, sel} from '../index';

it('exports commands', () => {  
  expect(Commands).not.toBeNull()
})

it('exports finders', () => {  
  expect(Finders).not.toBeNull()
})

it('exports negative finders', () => {  
  expect(NegativeFinders).not.toBeNull()
})

it('exports regexp helpers', () => {  
  expect(match).not.toBeNull()
})

it('exports CSS selectors', () => {
  expect(sel).not.toBe(null)
  Object.values(sel).forEach(value => {
    expect(value).toMatch(/[a-z]*\.?[a-z0-9-]+/)
  })
});

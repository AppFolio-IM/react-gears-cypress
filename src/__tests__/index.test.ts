import indexDefault, {find, match, sel} from '../index';

it('exports finders as default', () => {  
    expect(indexDefault).toEqual(find)
})

it('exports finders', () => {  
    expect(find).not.toBeNull()
    expect(find.assertNo).not.toBeNull();
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

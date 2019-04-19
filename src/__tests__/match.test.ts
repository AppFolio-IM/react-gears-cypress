import * as match from '../match';

describe('exact', () => {
  const target = match.exact('First Name')

  it('anchors to start of string', () => {
    expect('First Name').toMatch(target)

    expect('First Nameification').not.toMatch(target)
    expect('First Name of the Dude').not.toMatch(target)
    expect('First  Name').not.toMatch(target)
    expect('Last Name').not.toMatch(target)
    expect('Last Name').not.toMatch(target)
  })

  it('allows trailing punctuation', () => {
    expect('First Name *').toMatch(target)
    expect('First Name    *').toMatch(target)
    expect('First Name:').toMatch(target)
    expect('First Name: ').toMatch(target)

    expect('First  Name  *').not.toMatch(target)
    expect('Last Name *').not.toMatch(target)
  })
})

describe('glob', () => {
  it('allows leading wildcard', () => {
    const target = match.glob('* First')
    expect('First Things First').toMatch(target)
    expect('People First').toMatch(target)
    expect('irst').not.toMatch(target)
  })

  it('allows inline wildcard', () => {
    const target = match.glob('In * Time')
    expect('In Good Time').toMatch(target)
    expect('In Good Spirits').not.toMatch(target)
  })

  it('allows trailing wildcard', () => {
    const target = match.glob('First *')
    expect('First Class Compartment').toMatch(target)
    expect('First Grade').toMatch(target)
    expect('First Name').toMatch(target)
    expect('First').not.toMatch(target)
  })
})

describe('fuzzyFirstLast', () => {
  const target = match.fuzzyFirstLast('Alex', 'Kono')
  
  it('allows whole string', () => {
    expect('Alex Kono').toMatch(target)
  })  

  it('forbids leading/trailing content', () => {
    expect(' Alex Kono').not.toMatch(target)
    expect('Alex Kono ').not.toMatch(target)
    expect('Alex Kono*').not.toMatch(target)
  })

  it('allows intermediate content', () => {
    expect('Alex     Kono').toMatch(target)
    expect('Alex "the Champ" Kono').toMatch(target)
    expect("Alex\tKono").toMatch(target)
    expect('Alex   Jehosephat Zebediah  M. Pennybags  IV Kono').toMatch(target)
  })
})

describe('multiline', () => {
  const target = match.fuzzyMultiline('Samarth Goyal')

  it('allows intermediate whitespace', () => {
    expect('Samarth Goyal').toMatch(target)
    expect('Samarth    Goyal').toMatch(target)
    expect("Samarth\tGoyal").toMatch(target)
    expect("Samarth\nGoyal\n").toMatch(target)
    expect("Samarth\n\n\nGoyal\n").toMatch(target)
    expect("\nSamarth\nGoyal").toMatch(target)
  })
  it('forbids leading/trailing whitespace', () => {
    expect('Samarth P. Funkadelic Goyal').not.toMatch(target)
    expect('G. Samarth Goyal').not.toMatch(target)
    expect('Samarth Goyal III').not.toMatch(target)
    expect("G.\nSamarth\nGoyal\n").toMatch(target)
  })
})

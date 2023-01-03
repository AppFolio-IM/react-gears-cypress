import React from 'react';
import * as match from '../../src/match';

describe('exact', () => {
  const target = match.exact('First Name');

  it('anchors to start of string', () => {
    expect('First Name').to.match(target);

    expect('First Nameification').not.to.match(target);
    expect('First Name of the Dude').not.to.match(target);
    expect('First  Name').not.to.match(target);
    expect('Last Name').not.to.match(target);
    expect('Last Name').not.to.match(target);
  });

  it('allows trailing punctuation', () => {
    expect('First Name *').to.match(target);
    expect('First Name    *').to.match(target);
    expect('First Name:').to.match(target);
    expect('First Name: ').to.match(target);

    expect('First  Name  *').not.to.match(target);
    expect('Last Name *').not.to.match(target);
  });
});

describe('glob', () => {
  it('allows leading wildcard', () => {
    const target = match.glob('* First');
    expect('First Things First').to.match(target);
    expect('People First').to.match(target);
    expect('irst').not.to.match(target);
  });

  it('allows inline wildcard', () => {
    const target = match.glob('In * Time');
    expect('In Good Time').to.match(target);
    expect('In Good Spirits').not.to.match(target);
  });

  it('allows trailing wildcard', () => {
    const target = match.glob('First *');
    expect('First Class Compartment').to.match(target);
    expect('First Grade').to.match(target);
    expect('First Name').to.match(target);
    expect('First').not.to.match(target);
  });
});

describe('fuzzyFirstLast', () => {
  const target = match.fuzzyFirstLast('Alex', 'Kono');

  it('allows whole string', () => {
    expect('Alex Kono').to.match(target);
  });

  it('forbids leading/trailing content', () => {
    expect(' Alex Kono').not.to.match(target);
    expect('Alex Kono ').not.to.match(target);
    expect('Alex Kono*').not.to.match(target);
  });

  it('allows intermediate content', () => {
    expect('Alex     Kono').to.match(target);
    expect('Alex "the Champ" Kono').to.match(target);
    expect('Alex\tKono').to.match(target);
    expect('Alex   Jehosephat Zebediah  M. Pennybags  IV Kono').to.match(
      target
    );
  });
});

describe('multiline', () => {
  const target = match.fuzzyMultiline('Samarth Goyal');

  it('allows intermediate whitespace', () => {
    expect('Samarth Goyal').to.match(target);
    expect('Samarth    Goyal').to.match(target);
    expect('Samarth\tGoyal').to.match(target);
    expect('Samarth\nGoyal\n').to.match(target);
    expect('Samarth\n\n\nGoyal\n').to.match(target);
    expect('\nSamarth\nGoyal').to.match(target);
  });
  it('forbids leading/trailing whitespace', () => {
    expect('Samarth P. Funkadelic Goyal').not.to.match(target);
    expect('G. Samarth Goyal').not.to.match(target);
    expect('Samarth Goyal III').not.to.match(target);
    expect('G.\nSamarth\nGoyal\n').to.match(target);
  });
});

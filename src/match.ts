// Simulate the `match: :prefer_exact` option of Capybara, which is
// the key to avoiding false positives on a page with lots of clickable
// things (buttons, labels, etc) that have similar text.
//
// Cypress does pretty well with its "narrowest match" heuristic, but we still
// hit corner cases such as "Soft Commitment" vs. "Commitment." To deal with these,
// we convert your label to a regexp anchored at start of element e.g. we match
// against the WHOLE text of the label/button/etc. We also allow punctuation at
// the end in order to cope with the "*" feedback chars that gears inserts for
// required fields.
export const exact = (value: string, flags = 'i') =>
  new RegExp(`^${Cypress._.escapeRegExp(value)}[\\s\\W]*$`, flags);

// Match strings that contain value, but allow a simple `*` character to act as a
// wildcard to ignore parts of the value. Multiple wildcards can be used and they
// match the empty string; try not to go too wild.
export const glob = (value: string, flags = 'i') =>
  new RegExp(
    `^${Cypress._.escapeRegExp(value).replace(/\\\*/, '.*')}[\\s\\W]*$`,
    flags
  );

// Match text contents that begin with first and end with last, but may have lots of
// stuff in between e.g. "very incredibly mega long" matches ("very", "long")
export const fuzzyFirstLast = (first: string, last: string) =>
  new RegExp(
    `^${Cypress._.escapeRegExp(first)}.+${Cypress._.escapeRegExp(last)}$`
  );

// Given a string of words separated by simple spaces, match those words, butt with
// any amount of whitespace, including newlines, between the words.
//
// Good for dealing with HTML elements that have a multi-line value, but need to be matched with a
// value from single-line Gherkin table cell. (cucumber-js doesn't grok \n unfortunately!)
export const fuzzyMultiline = (value: string) =>
  new RegExp(
    `^${Cypress._.escapeRegExp(value)}\\s*$`.replace(/\s+/g, '\\s+'),
    'm'
  );

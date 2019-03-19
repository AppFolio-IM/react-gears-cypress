import escape from 'lodash/escapeRegExp'

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
export const exact = (label:string, flags='i') => new RegExp(`^${escape(label)}[\s\W]*$`, flags);

// Match text contents that begin with first and end with last, but may have lots of
// stuff in between e.g. "very incredibly mega long" matches ("very", "long")
export const fuzzyFirstLast = (first:string, last:string) => new RegExp(`^${escape(first)}.+${escape(last)}$`)

// Given a string of words separated by simple spaces, build a RegExp that will match any amount of
// whitespace, including newlines, between the words.
//
// Good for dealing with HTML elements that have a multi-line value, but need to be matched with a
// value from single-line Gherkin table cell. (cucumber-js doesn't grok \n unfortunately!)
export const fuzzyMultiline = (value:string) => new RegExp(escape(value).replace(/\s+/g, '\\s+'));

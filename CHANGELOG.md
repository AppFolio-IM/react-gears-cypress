5.14
===

**NOTE:** this point release contains likely interface-breaking changes
as compared to 5.5.x; this is made possible because the package is now
distributed under a new name and channel.
  - Old: `react-gears-cypress` (published privately)
  - New: `@appfolio/react-gears-cypress` (published via npmjs.org)
Future releases will be aligned with react-gears' versioning scheme, and will provide guaranteed interface compatibility within a major version.

New features:
- Helper function `commands.add()` to register Cypress commands without copypasta.
- Custom command, `gears`, to replace `find` and `findNegative`
   - compatibility shims are provided to ease migration
- More consistent, reliable behavior for `clear` and `fill` commands.
   - Better at dismissing unwanted popups & overlays
   - May blur the subject after typing, if it was focused, to trigger
     form validations
   - May focus the subject before typing
- All commands produce log output similar to built-in Cypress commands.
- Commands and helpers hide the log output of any Cypress commands they invoke.

Significant interface-breaking changes:
- cannot use a RegExp for labels due to Cypress limitations; `Text` is now synonymous with `string`!
- `cy.fill` always requires a value (analogous to `cy.type`); formerly it sometimes accidentally accepted `''`.
- Large changes to the way we deal with popups (i.e. DateInput).

Deprecations:
- The `find` module has been deprecated (see `components` for a superior alternative)
- The `sel` module has been deprecated (see `components` for a superior alternative)

5.5
===

Aligned CSS selectors with `react-gears` v5. No significant interface-breaking changes.

1.x
===

Committed to interface stability. Works with `react-gears` v4.

0.2
===

Added finders for Alert, Card, and others.

Added negative finder for Alert.

Added protocol documentation for Finders (overall).

Fixed corner cases w/inconsistent use of match by Finders.

Added test coverage for match & Finders.

0.1
===

Initial release of the package. Very rough!

import * as commands from './commands';
import * as find from './find';
import * as match from './match';
import * as sel from './sel';
import * as hasManyFields from './hasManyFields'

// Bootstrap-color parameter used as an optional argument to some finders.
export type Color =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

// Label/title parameter accepted by all finders.
export type Text = RegExp | string;

// Parameter signature for Cypress commands that require a callback.
type Callback = (cb: any) => any;

// Allow utility functions to be imported, plus bonus finders for those
// who find default exports distasteful.
export { commands, find, match, sel, hasManyFields };

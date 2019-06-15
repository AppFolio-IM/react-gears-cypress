import * as commands from './commands';
import * as find from './find';
import * as match from './match';
import * as sel from './sel';

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

// Subset of the Cypress chainable interface used by this package.
export interface Chainable {
  clear(options?: any): Chainable;
  click(options?: any): Chainable;
  closest(s0: string): Chainable;
  contains(s0: Text, s1?: Text): Chainable;
  find(s0: string): Chainable;
  get(s0: string): Chainable;
  parent(): Chainable;
  should(s0: string): Chainable;
  then(f0: Callback): Chainable;
  type(s0: string, options?: any): Chainable;
  wrap(f0: Callback): Chainable;
  within(f0: Callback): Chainable;
}

// Allow utility functions to be imported, plus bonus finders for those
// who find default exports distasteful.
export { commands, find, match, sel };

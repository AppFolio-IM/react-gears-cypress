
import {Commands} from './commands'
import {Finders, NegativeFinders} from './find'
import * as match from './match'
import * as sel from './sel'

type Callback = (cb:any)=>any
type Text = RegExp | string
export interface Chainable {
  clear(options?:any): Chainable,
  click(options?:any): Chainable,
  closest(s0: string): Chainable,
  contains(s0:string, s1: Text): Chainable,
  find(s0:string): Chainable,
  get(s0:string): Chainable,
  parent(): Chainable,
  should(s0: string): Chainable,
  then(f0: Callback): Chainable,
  type(s0: string, options?:any): Chainable,
  wrap(f0: Callback): Chainable,
  within(f0: Callback): Chainable,
}
export {Commands, Finders, NegativeFinders, match, sel}

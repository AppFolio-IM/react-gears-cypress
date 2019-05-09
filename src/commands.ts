import {Chainable} from '.'
import * as match from './match'

type Cmd  =(subject: any, options:any)=>any
type ValCmd  =(subject: any, value:string, options:any)=>any

export class Commands {
  cy:Chainable

  constructor(cy:Chainable) {
    this.cy = cy
  }

  clear = (originalClear: Cmd, subject: any, options:any) => {
    if(subject.hasClass('Select-control')) {
      subject = subject.find('input')
      options = Object.assign(options || {}, {force: true})
    }
    return originalClear(subject, options);
  }

  select = (originalSelect: ValCmd, subject:any, value:string, options:any) => {
    if(subject.hasClass('Select-control')) {
      if(Array.isArray(value))
        throw new Error('gears Select multi not yet supported; have fun implementing!')
      this.cy.wrap(subject).within(() => {
        this.cy.get('input').clear({force: true}).type(value, {force: true})
      })
      return this.cy.wrap(subject).parent().get('.Select-menu').contains('button', match.exact(value)).click()
    }
  
    return originalSelect(subject, value, options)
  }
}

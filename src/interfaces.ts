/// <reference types="cypress" />

/**
 * Bootstrap-color parameter used to find some components.
 */
export type Color =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

/**
 * Methods for interacting with a specific react-gears component.
 */
export interface Component {
  /**
   * CSS selector used to find the component's outermost DOM element irrespective of
   * text it may (or may not contain).
   *
   * If a Component must be found by its characteristic text, this is undefined.
   */
  query: string;
  /**
   * Display name of the React component.
   */
  name: string;
  /**
   * Starting at the text element, navigate to top-level component element.
   * If missing, the top level and text element are the same (e.g. Link, Button).
   */
  traverse?: ($el: JQuery) => JQuery;
}

export interface ComponentWithText extends Component {
  /**
   * CSS selector used to find the component's label, title or other characteristic
   * text, usually nested inside the outermost DOM element.
   *
   * If a Component cannot be found by its characteristic text, this is undefined.
   */
  textQuery: string;
  /**
   * Starting at the text element, navigate to top-level component element.
   * If missing, the top level and text element are the same (e.g. Link, Button).
   */
  traverseViaText?: ($el: JQuery) => JQuery;
}

/**
 * Label/title parameter used to find components.
 */
export type Text = string | RegExp;

/**
 * Type guard for Component.
 */
export function isComponent(v: any): v is Component {
  return v && typeof v === 'object' && typeof v.query === 'string' && v.name;
}

/**
 * Type guard for ComponentWithText.
 */
export function isComponentWithText(v: any): v is ComponentWithText {
  return isComponent(v) && typeof (v as any).textQuery === 'string';
}

/**
 * Determine whether v looks like a React component definition. Useful to throw
 * helpful error messages if someone accidentally passes a genuine React
 * component to `cy.component`!
 */
export function isReact(v: any): boolean {
  return v && typeof v === 'function';
}

/**
 * Type guard for Text.
 */
export function isText(v: any): v is Text {
  return v && (typeof v === 'string' || v instanceof RegExp);
}

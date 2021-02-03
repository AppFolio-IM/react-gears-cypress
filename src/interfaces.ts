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
   * CSS selector used to find the component by its label text.
   */
  selector: string;
  /**
   * Display name of the React component.
   */
  name: string;
  /**
   * Starting at the label element, navigate to actual component element,
   */
  traverseViaLabel?: ($el: JQuery) => JQuery;
}

/**
 * Label/title parameter used to find components.
 */
export type Text = string | RegExp;

/**
 * Type guard for Component.
 */
export function isComponent(v: any): v is Component {
  return v && typeof v === 'object' && v.selector && v.name;
}

/**
 * Type guard for Text.
 */
export function isText(v: any): v is Text {
  return v && (typeof v === 'string' || v instanceof RegExp);
}

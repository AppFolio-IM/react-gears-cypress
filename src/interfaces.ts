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
   * CSS query used to find the component by its text.
   */
  textSelector?: string;
  /**
   * CSS query used to find the component's root without text.
   */
  topSelector?: string;
  /**
   * Display name of the React component.
   */
  name: string;
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
  return (
    v && typeof v === 'object' && (v.textSelector || v.topSelector) && v.name
  );
}

/**
 * Determine whether v looks like a React component definition.
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

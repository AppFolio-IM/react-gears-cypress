/// <reference types="cypress" />

export const FORCE_QUICK_QUIET = { force: true, delay: 1, log: false };
export const FORCE_QUIET = { force: true, log: false };
export const QUIET = { log: false };

export const isQuery = (u: unknown): u is JQuery => typeof u === 'object' && u && (u as any).jquery;

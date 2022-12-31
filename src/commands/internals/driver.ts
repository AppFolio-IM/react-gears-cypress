/// <reference types="cypress" />

////////////////////////////////////////////////////////////////
// Excerpted from Cypress source code; see:
//   https://github.com/cypress-io/cypress/blob/develop/packages/driver/src/dom/elements.ts
//
// Patched for use outside of the Cypress source tree.
////////////////////////////////////////////////////////////////

const isShadowRoot = (maybeRoot: any) => {
  return maybeRoot?.toString() === '[object ShadowRoot]';
};

const isWithinShadowRoot = (node: HTMLElement) => {
  return isShadowRoot(node.getRootNode());
};

const getParentNode = (el: HTMLElement) => {
  // if the element has a direct parent element,
  // simply return it.
  if (el.parentElement) {
    return el.parentElement;
  }

  const root = el.getRootNode();

  // if the element is inside a shadow root,
  // return the host of the root.
  if (root && isWithinShadowRoot(el)) {
    // @ts-expect-error dom(2339)
    return root.host;
  }

  return null;
};

const getAllParents = (
  el: HTMLElement,
  untilSelectorOrEl?: string | HTMLElement | JQuery
) => {
  const collectParents = (
    parents: HTMLElement[],
    node: HTMLElement
  ): HTMLElement[] => {
    const parent = getParentNode(node);

    if (
      !parent ||
      (untilSelectorOrEl && Cypress.$(parent).is(untilSelectorOrEl))
    ) {
      return parents;
    }

    return collectParents(parents.concat(parent), parent);
  };

  return collectParents([], el);
};

const priorityElement = "input[type='submit'], button, a, label";

export function getFirstDeepestElement($el: JQuery, index = 0): JQuery {
  // iterate through all of the elements in pairs
  // and check if the next item in the array is a
  // descedent of the current. if it is continue
  // to recurse. if not, or there is no next item
  // then return the current
  const $current = $el.slice(index, index + 1);
  const $next = $el.slice(index + 1, index + 2);

  if (!$next) {
    return $current;
  }

  // does current contain next?
  if (Cypress.$.contains($current.get(0), $next.get(0))) {
    return getFirstDeepestElement($el, index + 1);
  }

  // return the current if it already is a priority element
  if ($current.is(priorityElement)) {
    return $current;
  }

  // else once we find the first deepest element then return its priority
  // parent if it has one and it exists in the elements chain
  const $parents = Cypress.$(getAllParents($current[0])).filter(
    priorityElement
  );
  const $priorities = $el.filter($parents);

  if ($priorities.length) {
    return $priorities.last();
  }

  return $current;
}

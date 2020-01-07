export const alert = '.alert';
export const button = 'button';
export const card = '.card';
export const cardTitle = '.card .card-title';
export const checkboxInput = 'input[type="checkbox"]';
// TODO: some day, eliminate magic :has() using react-gears v5 label classes
export const checkboxInputLabel =
  '.form-group:has(input[type="checkbox"]) label';
export const datapair = '.form-control-plaintext';
export const datapairLabel = '.form-group:has(.form-control-plaintext) label';
export const formGroup = '.form-group';
// TODO: some day, ask react-gears maintainers to add a distinct CSS class to the outermost div of a HasManyFields
//export const hasManyFields = undefined;
// TODO: some day, be more precise here (once we have a hasManyFields selector)
// export const hasManyFieldsLabel = undefined;
export const input = 'input,textarea';
// TODO: some day, eliminate magic :has() using react-gears v5 label classes
export const inputLabel = '.form-group:has(.form-control) label';
export const label = 'label';
export const link = 'a,button.btn-link';
export const modalTitle = '.modal-title';
export const modal = '.modal-dialog';
export const radioInput = 'input[type="radio"]';
// TODO: some day, eliminate magic :has() using react-gears v5 label classes
export const radioInputLabel = '.form-group:has(input[type="radio"]) label';
export const select = 'select';
export const selectControl = '.Select-control';
export const summaryBoxItem = '.card.border-secondary';
export const summaryBoxItemLabel = `.card.border-secondary > .card-body > small`;

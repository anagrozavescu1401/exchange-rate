/** Add the elements of an array to a string.
 * Used in http.service.js to concatenate the currency options to the url.
 */
export function addArrToString(str, arr) {
  arr.forEach((element, index) => {
    str += element;
    if (index !== arr.length - 1) {
      str += ',';
    }
  });
  return str;
}

/** Add an array of options 
 * or the keys of an object to a dropdown as options.*/
export function addDropdownOptions(elementId, dropdownOptions) {
  const dropdown = document.getElementById(elementId);
  if (!dropdownOptions) {
    dropdown.options.length = 0;
  } else if (Array.isArray(dropdownOptions)) {
    dropdownOptions.forEach(element => {
      dropdown.options[dropdown.options.length] = new Option(element, element);
    });
  }
  else {
    Object.keys(dropdownOptions).forEach(element => {
      dropdown.options[dropdown.options.length] = new Option(element, element);
    });
  }
}

/** Add text to an element specified by id. */
export function addTextToElement(elementId, text) {
  document.getElementById(elementId).innerHTML = text;
}

/** Return a string that contains the current date in the specified format. */
export function getUTCDate() {
  const now = new Date();
  return `Last updated: ${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()} UTC`;
}

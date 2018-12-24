
export function addArrToString(str, arr) {
  arr.forEach((element, index) => {
    str += element;
    if (index !== arr.length - 1) {
      str += ',';
    }
  });
  return str;
}

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

export function addTextToElement(elementId, text) {
  document.getElementById(elementId).innerHTML = text;
}

export function getUTCDate() {
  const now = new Date();
  return `Last updated: ${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()} UTC`;
}

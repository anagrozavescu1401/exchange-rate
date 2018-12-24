import * as httpService from './services/http.service.js';
import * as utilsService from './services/utils.service.js';

/** Used to validate the amount input. */
const regEx = /^[0-9]+$/;
const availableCurrencies = ['EUR', 'USD', 'GBP'];
const defaultAmount = 100;
let amount = defaultAmount;
/** Selected base is the currency FROM which the amount is converted.*/
let selectedBase = availableCurrencies[0];
/** Selected currency is the currency TO which the amount is converted.*/
let selectedCurrency = availableCurrencies[1];
/** An object that will contain the rates for conversion according to the selected base currency. */
let rates = null;

init();

/** Initiate the default values and get the rates for the default base currency */
function init() {
  utilsService.addDropdownOptions('from-currency', availableCurrencies);
  document.getElementById('amount').value = defaultAmount;
  getRates(selectedBase);
}

function getRates(selectedBase) {
  httpService.getRates(selectedBase, availableCurrencies, (resp) => {
    /** Add the time the response has been received. */
    utilsService.addTextToElement('time', utilsService.getUTCDate());
    if (resp) {
      rates = resp.rates;
      /** Clear the dropdown options. */
      utilsService.addDropdownOptions('to-currency', null);
      /** Add new options to the dropdown. */
      utilsService.addDropdownOptions('to-currency', rates);

      /** If the previously selected currency is an option in the new rates,
       * then keep the previously selected currency,
       * else change the selection to be the first option in the dropdown.
       */
      if (Object.keys(rates).includes(selectedCurrency)) {
        document.getElementById('to-currency').value = selectedCurrency;
      }
      else {
        document.getElementById('to-currency').value = Object.keys(rates)[0];
        selectedCurrency = Object.keys(rates)[0];
      }

      /** Update the rate from selected CURRENCY to BASE. */
      getReverseConversionRate(selectedCurrency);
      /** Update the title. */
      utilsService.addTextToElement('selected-conversion', `${selectedBase} to ${selectedCurrency}`);
      /** Update the rate from BASE to selected CURRENCY. */
      utilsService.addTextToElement('base-converion-rate', `1${selectedBase}=${rates[selectedCurrency]}${selectedCurrency}`);
      computeAmount(selectedCurrency, amount);
    }
    else {
      /** Display an error if the server is not working. */
      utilsService.addTextToElement('error', 'The server is not working. Please, try later.');
    }
  });
}

/** Get the rates for the selected currency in order to show how much is one unit 
 * of the selected currency for the base currency.
 */
function getReverseConversionRate(selectedCurrency) {
  httpService.getRates(selectedCurrency, availableCurrencies, (resp) => {
    if (resp) {
      utilsService.addTextToElement('reverse-converion-rate',
        `1${selectedCurrency}=${resp.rates[selectedBase]}${selectedBase}`);
    }
    else {
      utilsService.addTextToElement('error', 'The server is not working. Please, try later.');
    }
  });
}

function computeAmount(selectedCurrency, amountToConvert) {
  const result = amountToConvert * rates[selectedCurrency];
  utilsService.addTextToElement('from-amount', `${amount} ${selectedBase} =`);
  utilsService.addTextToElement('conversion', `${Number(result).toLocaleString('en-US', { minimumFractionDigits: 4 })} ${selectedCurrency}`);
}

/** Conver amount when the user is typing. Only numbers are taken into consideration. */
window.onAmountChange = function (event) {
  regEx.test(event.target.value) ? amount = event.target.value : event.target.value = amount;
  computeAmount(selectedCurrency, amount);
}

/** Convert amount when base currency changes.
 * Also get the rates according to the selected base currency. */
window.onBaseCurrencyChange = function (event) {
  selectedBase = event.target.value;
  getRates(selectedBase, availableCurrencies);
}

/** Convert amount when currency chages.*/
window.onCurrencyChange = function (event) {
  const selectedCurrency = event.target.value;
  getReverseConversionRate(selectedCurrency);
  utilsService.addTextToElement('selected-conversion', `${selectedBase} to ${selectedCurrency}`);
  utilsService.addTextToElement('base-converion-rate', `1${selectedBase}=${rates[selectedCurrency]}${selectedCurrency}`);
  computeAmount(selectedCurrency, amount);
}

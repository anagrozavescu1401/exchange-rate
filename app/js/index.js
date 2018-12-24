import * as httpService from './services/http.service.js';
import * as utilsService from './services/utils.service.js';

const regEx = /^[0-9]+$/;
const availableCurrencies = ['EUR', 'USD', 'GBP'];
const defaultAmount = 100;
let amount = defaultAmount;
let selectedBase = availableCurrencies[0];
let selectedCurrency = availableCurrencies[1];
let rates = null;

init();

function init() {
  utilsService.addDropdownOptions('from-currency', availableCurrencies);
  document.getElementById('amount').value = defaultAmount;
  getRates(selectedBase);
}

function getRates(selectedBase) {
  httpService.getRates(selectedBase, availableCurrencies, (resp) => {
    utilsService.addTextToElement('time', utilsService.getUTCDate());
    if (resp) {
      rates = resp.rates;
      utilsService.addDropdownOptions('to-currency', null);
      utilsService.addDropdownOptions('to-currency', rates);
      if (Object.keys(rates).includes(selectedCurrency)) {
        document.getElementById('to-currency').value = selectedCurrency;
      }
      else {
        document.getElementById('to-currency').value = Object.keys(rates)[0];
        selectedCurrency = Object.keys(rates)[0];
      }
      getReverseConversionRate(selectedCurrency);
      utilsService.addTextToElement('selected-conversion',
        `${selectedBase} to ${selectedCurrency}`);
      utilsService.addTextToElement('base-converion-rate',
        `1${selectedBase}=${rates[selectedCurrency]}${selectedCurrency}`);
      computeAmount(selectedCurrency, amount);
    }
  });
}

function getReverseConversionRate(selectedCurrency) {
  httpService.getRates(selectedCurrency, availableCurrencies, (resp) => {
    if (resp) {
      utilsService.addTextToElement('reverse-converion-rate',
        `1${selectedCurrency}=${resp.rates[selectedBase]}${selectedBase}`);
    }
  });
}

function computeAmount(selectedCurrency, amountToConvert) {
  const result = amountToConvert * rates[selectedCurrency];
  utilsService.addTextToElement('from-amount', `${amount} ${selectedBase} =`);
  utilsService.addTextToElement('conversion', `${Number(result).toLocaleString('en-US', { minimumFractionDigits: 4 })} ${selectedCurrency}`);
}

window.onAmountChange = function (event) {
  regEx.test(event.target.value) ?
    amount = event.target.value : event.target.value = amount;
  computeAmount(selectedCurrency, amount);
}

window.onBaseCurrencyChange = function (event) {
  selectedBase = event.target.value;
  getRates(selectedBase, availableCurrencies);
}

window.onCurrencyChange = function (event) {
  const selectedCurrency = event.target.value;
  getReverseConversionRate(selectedCurrency);
  utilsService.addTextToElement('selected-conversion',
    `${selectedBase} to ${selectedCurrency}`);
  utilsService.addTextToElement('base-converion-rate',
    `1${selectedBase}=${rates[selectedCurrency]}${selectedCurrency}`);
  computeAmount(selectedCurrency, amount);
}

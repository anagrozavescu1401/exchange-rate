import * as utilsService from './utils.service.js';

const apiBase = 'https://ratesapi.io/api'
const latestRatesEndpoint = '/latest';

const baseCurrencyParam = '?base=';
const availableCurrenciesParam = '&symbols=';

export function getRates(baseCurrency, availableCurrencies, callback) {
  const Http = new XMLHttpRequest();
  const url = apiBase + latestRatesEndpoint + baseCurrencyParam + baseCurrency + availableCurrenciesParam;
  const fullUrl = utilsService.addArrToString(url, availableCurrencies)

  Http.onreadystatechange = function () {
    this.readyState === 4 ? callback(JSON.parse(Http.responseText)) : callback(null);
  }
  Http.open("GET", fullUrl);
  Http.send();
}

// JSON files
const JSONairports = require('../json/airports.json');
const JSONcities = require('../json/cities.json');
const JSONutils = require('../json/utils.json');
const JSONcountries = require('../json/countries.json');

exports.validateCountry = function (country) {
    const isCountry = JSONairports.countries.find(e => e.value === country);
    return (isCountry !== undefined);
};

exports.validateAirport = function (airport, country) {
    const isAirport = JSONairports.countries.find(e => e.value === country).airports.find(i => i.value === airport);
    return (isAirport !== undefined);
};

exports.validateCities = function (cities, country) {
    const length = cities.length;
    if (!(length > 0) || !(length < 7)) {
        return false;
    }
    for (i = 0; i < length; i++) {
        const city = cities[i];
        const countryCities = JSONcities.countries.find(e => e.value === country).cities;
        const isCity = countryCities.find(i => ((i.value === city.value) && (i.state === city.state)));
        if (isCity === undefined) {
            return false;
        };
    }
    return true;
};

exports.validateCategory = function (category) {
    const isCategory = JSONutils.categories.find(e => e.value === category);
    return (isCategory !== undefined);
};

exports.validateInteger = function (number) {
    return Number.isInteger(number);
};

exports.validateCurrency = function (currency) {
    const isCurrency = JSONutils.currencies.find(e => (e.value === currency));
    return (isCurrency !== undefined);
};

exports.validateItems = function (items) {
    const length = items.length;
    if (!(length > 0) || !(length < 7)) {
        return false;
    };
    return true;
};

exports.validateQuantityById = function (quantityById, items) {
    for (const item in quantityById) {
        const quantity = quantityById[item];
        if (!Number.isInteger(quantity) || (quantity < 0)) {
            return false;
        };
        // Check that each key exists in the items array
        const isKey = items.find(e => e.toString() === item);
        if (isKey === undefined) {
            return false;
        };
    }
    return true;
};

exports.validateWorldCountry = function (country) {
    const isCountry = JSONcountries.countries.find(e => e.alpha2Code === country);
    return (isCountry !== undefined);
};

exports.validateCurrency = function (currency) {
    const isCurrency = JSONutils.currencies.find(e => e.value === currency);
    return (isCurrency !== undefined);
};

exports.validateServiceFee = function (fee) {
    const isFee = JSONutils.serviceFees.find(e => e.fee === fee);
    return (isFee !== undefined);
};

exports.validateStoreCategories = function (categories) {
    const length = categories.length;
    for (i = 0; i < length; i++) {
        const category = categories[i];
        const isCategory = JSONutils.categories.find(e => e.value === category);
        if (isCategory === undefined) {
            return false;
        };
    }
    return true;
};
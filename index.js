'use strict';

var tv4 = require('tv4');

var CODES = Object.keys(tv4.errorCodes).reduce(function (res, item) {
  var key = tv4.errorCodes[item] * 1;
  res[key] = item;
  return res;
}, {});

module.exports = function (opt) {
  var option = opt || {};
  var defaultErrorMessage = option.defaultErrorMessage || 'Technical error';
  var showErrorCode = option.showErrorCode === false ? false : true;

  return function (value, schema, messages) {
    var validation = tv4.validateMultiple(value, schema);
    var valid = validation.valid;
    var errors = validation.errors.map(function (item) {
      var message = defaultErrorMessage + (showErrorCode ? ' (code: ' + CODES[item.code] + ')' : '');
      var dataPath = item.dataPath ? item.dataPath.slice(1).split('/').filter(function (i) {
        return i;
      }) : [];
      var schemaPath = item.schemaPath ? item.schemaPath.slice(1).split('/').filter(function (i) {
        return i;
      }) : [];
      return {
        params: item.params,
        code: CODES[item.code],
        dataPath: dataPath,
        schemaPath: schemaPath,
        message: schemaPath.reduce(function (res, item) {
          if (res === message) return message;
          return res[item] || message;
        }, messages || {})
      };
    });

    return { valid: valid, errors: errors };
  };
};

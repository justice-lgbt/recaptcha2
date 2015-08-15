// Generated by CoffeeScript 1.9.3
(function() {
  var Promise, Recaptcha2, request;

  Promise = require('bluebird');

  request = require('request');

  Recaptcha2 = (function() {
    var errorList;

    function Recaptcha2() {}

    errorList = {
      'request-error': 'request to api failed .',
      'missing-input-secret': 'The secret parameter is missing.',
      'invalid-input-secret': 'The secret parameter is invalid or malformed.',
      'missing-input-response': 'The response parameter is missing.',
      'invalid-input-response': 'The response parameter is invalid or malformed.'
    };

    Recaptcha2.prototype.construct = function(config) {
      this.config = config;
      if (this.config.ssl === void 0) {
        this.config.ssl = true;
      }
      if (this.config.ssl) {
        return this.api = "https://www.google.com/recaptcha/api/siteverify";
      } else {
        return this.api = "http://www.google.com/recaptcha/api/siteverify";
      }
    };

    Recaptcha2.prototype.validate = function(response, remoteip) {
      if (response == null) {
        response = '';
      }
      return new Promise(function(resolve, reject) {
        if (response === '') {
          return reject(['missing-input-response']);
        }
        return request.post(this.api, {
          secret: this.config.secretKey,
          response: response,
          remoteip: remoteip
        }, function(error, response, body) {
          var result, tryErr;
          if (error) {
            return reject(['request-error']);
          } else {
            try {
              result = JSON.parse(body);
              if (result.success) {
                return accept(true);
              } else {
                return reject(result['error-codes']);
              }
            } catch (_error) {
              tryErr = _error;
              return reject(['request-error', 'json-parse']);
            }
          }
        });
      });
    };

    Recaptcha2.prototype.translateErrors = function(errorCodes) {
      var i, key, len, ret;
      if (Array.isArray(errorCodes)) {
        ret = [];
        for (i = 0, len = errorCodes.length; i < len; i++) {
          key = errorCodes[i];
          ret.push(errorList[key] || '');
        }
        return ret;
      } else {
        return errorList[key] || '';
      }
    };

    Recaptcha2.prototype.formElement = function(htmlClass) {
      return "<div class=\"" + (htmlClass || 'g-recaptcha') + "\" data-sitekey=\"" + this.config.siteKey + "\"></div>";
    };

    return Recaptcha2;

  })();

  module.exports = Recaptcha2;

}).call(this);
// Backbone.Fetch.js 0.2.4
// ---------------

//     (c) 2016 Adam Krebs
//     Backbone.Fetch may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/akre54/Backbone.Fetch

(function() {
  'use strict';

  var defaults = function(obj, source) {
    for (var prop in source) {
      if (obj[prop] === undefined) obj[prop] = source[prop];
    }
    return obj;
  };

  var stringifyGETParams = function(url, data) {
    var query = '';
    for (var key in data) {
      if (data[key] == null) continue;
      query += '&'
        + encodeURIComponent(key) + '='
        + encodeURIComponent(data[key]);
    }
    if (query) url += (~url.indexOf('?') ? '&' : '?') + query.substring(1);
    return url;
  };

  var getData = function(response, dataType) {
    return dataType === 'json' && response.status !== 204 ? response.json() : response.text();
  };

  var ajax = function(options) {
    if (options.type === 'GET' && typeof options.data === 'object') {
      options.url = stringifyGETParams(options.url, options.data);
      delete options.data;
    }

    defaults(options, {
      method: options.type,
      headers: defaults(options.headers || {}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: options.data
    });

    return fetch(options.url, options)
      .then(function(response) {
        var promise = options.type === 'HEAD'
          ? Promise.resolve(null)
          : getData(response, options.dataType);

        if (response.ok) return promise;

        var error = new Error(response.statusText);
        return promise.then(function(responseData) {
          error.response = response;
          error.responseData = responseData;
          if (options.error) options.error(error);
          throw error;
        });
      })
      .then(function(responseData) {
        if (options.success) options.success(responseData);
        return responseData;
      });
  };

  if (typeof exports === 'object') {
    module.exports = ajax;
  } else {
    Backbone.ajax = ajax;
  }
})();

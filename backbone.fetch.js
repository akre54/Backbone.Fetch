// Backbone.Fetch.js 0.1.0
// ---------------

//     (c) 2014 Adam Krebs
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
  }

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
  }

  var ajax = function(options) {
    if (options.type === 'GET' && typeof options.data === 'object') {
      options.url = stringifyGETParams(options.url, options.data);
      delete options.data;
    }

    return fetch(options.url, defaults(options, {
      method: options.type,
      headers: defaults(options.headers || {}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: options.data
    })).then(options.success, options.error);
  };

  if (typeof exports === 'object') {
    module.exports = ajax;
  } else {
    Backbone.ajax = ajax;
  }
})();
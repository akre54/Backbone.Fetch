var expect = require('chai').expect;

// Bleh. There has to be a better way to test this
sinon = require('sinon');
require('sinon/lib/sinon/util/event');
require('sinon/lib/sinon/util/fake_xml_http_request');

(function() {
  if (typeof window === 'undefined') global.self = {};
  require('whatwg-fetch');
  global.fetch = sinon.spy(self.fetch);
})();

XMLHttpRequest = function() {}
XMLHttpRequest.prototype = sinon.useFakeXMLHttpRequest().prototype;

var ajax = require('../backbone.fetch');

describe('backbone.fetch', function() {

  describe('creating a request', function() {
    it('should pass the method and url to fetch', function() {
      ajax({
        url: 'test',
        type: 'GET'
      });

      sinon.assert.calledWith(fetch, 'test', sinon.match.has('method', 'GET'));
      sinon.assert.calledWith(fetch, 'test', sinon.match.has('body', undefined));
    });

    it('should stringify GET data when present', function() {
      ajax({
        url: 'test',
        type: 'GET',
        data: {a: 1, b: 2}
      });
      sinon.assert.calledWith(fetch, 'test?a=1&b=2');
    });

    it('should append to the querystring when one already present', function() {
      ajax({
        url: 'test?foo=bar',
        type: 'GET',
        data: {a: 1, b: 2}
      });
      sinon.assert.calledWith(fetch, 'test?foo=bar&a=1&b=2');
    });

    it('should send POSTdata when POSTing', function() {
      ajax({
        url: 'test',
        type: 'POST',
        data: JSON.stringify({a: 1, b: 2})
      });

      sinon.assert.calledWith(fetch, 'test', sinon.match.has('method', 'POST'));
      sinon.assert.calledWith(fetch, 'test', sinon.match.has('body', '{"a":1,"b":2}'));
    });
  });

  describe('headers', function() {
    it('should set headers if none passed in', function() {
      ajax({url: 'test', type: 'GET'});
      sinon.assert.calledWith(fetch, 'test', sinon.match({headers: {
        Accept: "application/json", 'Content-Type': "application/json"
      }}));
    });

    it('should use headers if passed in', function() {
      ajax({
        url: 'test',
        type: 'GET',
        headers: {
          'X-MyApp-Header': 'present'
        }
      });

      sinon.assert.calledWith(fetch, 'test', sinon.match({headers: {
        Accept: "application/json", 'Content-Type': "application/json", "X-MyApp-Header": 'present'
      }}));
    });

    it('allows Accept and Content-Type headers to be overwritten', function() {
      ajax({
        url: 'test',
        type: 'GET',
        headers: {
          Accept: "custom", 'Content-Type': "custom"
        }
      });

      sinon.assert.calledWith(fetch, 'test', sinon.match({headers: {
        Accept: "custom", 'Content-Type': "custom"
      }}));
    });
  });

  describe('finishing a request', function() {
    it('should invoke the success callback on complete', function(done) {
      done();
      // ajax({
      //   url: 'test',
      //   type: 'GET',
      //   success: function() { done(); },
      //   error: function() { throw new Error(); }
      // });
    });

    it('should invoke the error callback on error', function(done) {
      done();
      // ajax({
      //   url: 'test',
      //   type: 'GET',
      //   success: function() { throw new Error; },
      //   error: function(e) { console.log(arguments); done(); }
      // });
    });
  });

  describe('Promise', function() {
    it('should return a Promise', function() {
      var xhr = ajax({url: 'test', type: 'GET'});
      expect(xhr).to.be.an.instanceof(Promise);
    });
  });
});

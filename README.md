Backbone.Fetch
===================

A drop-in replacement for Backbone.Ajax that uses `window.fetch`
methods for sync. It has no dependency on jQuery or Underscore.

You call `model.save()`, `model.fetch()`, `collection.fetch()`, etc. just as
you would normally. These methods always return a Promise.

To Use:
-------
Load Backbone.Fetch with your favorite module loader or add as a script
tag after you have loaded Backbone in the page.

If loading with AMD or CommonJS you should set `Backbone.ajax` yourself:

```js
// AMD
define(['backbone', 'backbone.fetch'], function(Backbone, fetch) {
  Backbone.ajax = fetch;
});

// CommonJS
var Backbone = require('backbone');
Backbone.ajax = require('backbone.fetch');
```

Requirements:
-------------
Fetch relies on either a native window.fetch or a fallback pollyfill. You must
also set a global Promise implementation for window.fetch to use (either Native,
RSVP, Bluebird, etc).

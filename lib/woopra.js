
var each = require('each');
var extend = require('extend');
var integration = require('integration');
var isEmail = require('is-email');
var load = require('load-script');
var type = require('type');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Woopra);
};


/**
 * Expose `Woopra` integration.
 */

var Woopra = exports.Integration = integration('Woopra')
  .assumesPageview()
  .readyOnLoad()
  .global('woopra')
  .option('domain', '');


/**
 * Initialize.
 *
 * http://www.woopra.com/docs/setup/javascript-tracking/
 *
 * @param {Object} page
 */

Woopra.prototype.initialize = function (page) {
  (function () {var i, s, z, w = window, d = document, a = arguments, q = 'script', f = ['config', 'track', 'identify', 'visit', 'push', 'call'], c = function () {var i, self = this; self._e = []; for (i = 0; i < f.length; i++) {(function (f) {self[f] = function () {self._e.push([f].concat(Array.prototype.slice.call(arguments, 0))); return self; }; })(f[i]); } }; w._w = w._w || {}; for (i = 0; i < a.length; i++) { w._w[a[i]] = w[a[i]] = w[a[i]] || new c(); } })('woopra');
  window.woopra.config({ domain: this.options.domain });
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Woopra.prototype.loaded = function () {
  return !! (window.woopra && window.woopra.loaded);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Woopra.prototype.load = function (callback) {
  load('//static.woopra.com/js/w.js', callback);
};


/**
 * Page.
 *
 * @param {String} section (optional)
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Woopra.prototype.page = function (section, name, properties, options) {
  properties = properties || {};
  if (name && section) name = section + ' ' + name;
  if (name) properties.title = name;
  window.woopra.track('pv', properties);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Woopra.prototype.identify = function (id, traits, options) {
  traits = traits || {};
  if (id) traits.id = id;
  window.woopra.identify(traits).push(); // `push` sends it off async
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Woopra.prototype.track = function (event, properties, options) {
  window.woopra.track(event, properties);
};
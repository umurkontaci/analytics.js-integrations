
var alias = require('alias');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_dcq');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Drip);
};


/**
 * Expose `Drip` integration.
 */

var Drip = exports.Integration = integration('Drip')
  .assumesPageview()
  .readyOnLoad()
  .global('dc')
  .global('_dcq')
  .global('_dcs')
  .option('account', '');


/**
 * Initialize.
 *
 * @param {Object} page
 */

Drip.prototype.initialize = function (page) {
  window._dcq = window._dcq || [];
  window._dcs = window._dcs || {};
  window._dcs.account = this.options.account;
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Drip.prototype.loaded = function () {
  return window.dc;
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Drip.prototype.load = function (callback) {
  load('//tag.getdrip.com/' + this.options.account + '.js', callback);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Drip.prototype.track = function (event, properties, options) {
  properties = properties || {};
  properties.action = event;
  properties = alias(properties, { revenue: 'value' });
  if (properties.value) properties.value = cents(properties.value);
  push('track', properties);
};


/**
 * Helper to convert revenue into a cents integer.
 *
 * @param {Object} props
 */

function cents (val) {
  return Math.round(val * 100);
}
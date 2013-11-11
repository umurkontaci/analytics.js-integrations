
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_kiq');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Qualaroo);
};


/**
 * Expose `Qualaroo` integration.
 */

var Qualaroo = exports.Integration = integration('Qualaroo')
  .assumesPageview()
  .readyOnInitialize()
  .global('_kiq')
  .option('customerId', '')
  .option('siteToken', '')
  .option('track', false);


/**
 * Initialize.
 *
 * @param {Object} page
 */

Qualaroo.prototype.initialize = function (page) {
  window._kiq = window._kiq || [];
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Qualaroo.prototype.loaded = function () {
  return !! (window._kiq && window._kiq.push !== Array.prototype.push);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Qualaroo.prototype.load = function (callback) {
  var token = this.options.siteToken;
  var id = this.options.customerId;
  load('//s3.amazonaws.com/ki.js/' + id + '/' + token + '.js', callback);
};


/**
 * Identify.
 *
 * http://help.qualaroo.com/customer/portal/articles/731085-identify-survey-nudge-takers
 * http://help.qualaroo.com/customer/portal/articles/731091-set-additional-user-properties
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Qualaroo.prototype.identify = function (id, traits, options) {
  traits || (traits = {});
  if (traits.email) id = traits.email;
  if (id) push('identify', id);
  if (traits) push('set', traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Qualaroo.prototype.track = function (event, properties, options) {
  if (!this.options.track) return;
  var traits = {};
  traits['Triggered: ' + event] = true;
  this.identify(null, traits);
};
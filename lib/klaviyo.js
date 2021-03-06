
var alias = require('alias');
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_learnq');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Klaviyo);
};


/**
 * Expose `Klaviyo` integration.
 */

var Klaviyo = exports.Integration = integration('Klaviyo')
  .assumesPageview()
  .readyOnInitialize()
  .global('_learnq')
  .option('apiKey', '');


/**
 * Initialize.
 *
 * https://www.klaviyo.com/docs/getting-started
 *
 * @param {Object} page
 */

Klaviyo.prototype.initialize = function (page) {
  push('account', this.options.apiKey);
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Klaviyo.prototype.loaded = function () {
  return !! (window._learnq && window._learnq.push !== Array.prototype.push);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Klaviyo.prototype.load = function (callback) {
  load('//a.klaviyo.com/media/js/learnmarklet.js', callback);
};


/**
 * Trait aliases.
 */

var aliases = {
  id: '$id',
  email: '$email',
  firstName: '$first_name',
  lastName: '$last_name',
  phone: '$phone_number',
  title: '$title'
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Klaviyo.prototype.identify = function (id, traits, options) {
  traits = traits || {};
  if (!id && !traits.email) return;
  if (id) traits.id = id;
  traits = alias(traits, aliases);
  push('identify', traits);
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 */

Klaviyo.prototype.group = function (id, properties) {
  properties = properties || {};
  if (!properties.name) return;
  push('identify', { $organization: properties.name });
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Klaviyo.prototype.track = function (event, properties, options) {
  properties = properties || {};
  push('track', event, properties);
};
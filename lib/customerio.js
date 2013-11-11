
var alias = require('alias');
var callback = require('callback');
var convertDates = require('convert-dates');
var integration = require('integration');
var load = require('load-script');


/**
 * User reference.
 */

var user;


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Customerio);
  user = analytics.user(); // store for later
};


/**
 * Expose `Customerio` integration.
 */

var Customerio = exports.Integration = integration('Customer.io')
  .assumesPageview()
  .readyOnInitialize()
  .global('_cio')
  .option('siteId', '');


/**
 * Initialize.
 *
 * http://customer.io/docs/api/javascript.html
 *
 * @param {Object} page
 */

Customerio.prototype.initialize = function (page) {
  window._cio = window._cio || [];
  (function() {var a,b,c; a = function (f) {return function () {window._cio.push([f].concat(Array.prototype.slice.call(arguments,0))); }; }; b = ['identify', 'track']; for (c = 0; c < b.length; c++) {window._cio[b[c]] = a(b[c]); } })();
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Customerio.prototype.loaded = function () {
  return !! (window._cio && window._cio.pageHasLoaded);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Customerio.prototype.load = function (callback) {
  var script = load('https://assets.customer.io/assets/track.js', callback);
  script.id = 'cio-tracker';
  script.setAttribute('data-site-id', this.options.siteId);
};


/**
 * Trait aliases.
 */

var traitAliases = {
  created: 'created_at'
};


/**
 * Identify.
 *
 * http://customer.io/docs/api/javascript.html#section-Identify_customers
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.identify = function (id, traits, options) {
  if (!id) return this.debug('user id required');
  traits.id = id;
  traits = convertDates(traits, convertDate);
  traits = alias(traits, traitAliases);
  window._cio.identify(traits);
};


/**
 * Group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.group = function (id, properties, options) {
  if (id) properties.id = id;
  properties = alias(properties, function (prop) {
    return 'Group ' + prop;
  });

  this.identify(user.id(), properties);
};


/**
 * Track.
 *
 * http://customer.io/docs/api/javascript.html#section-Track_a_custom_event
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.track = function (event, properties, options) {
  properties = convertDates(properties, convertDate);
  window._cio.track(event, properties);
};


/**
 * Convert a date to the format Customer.io supports.
 *
 * @param {Date} date
 * @return {Number}
 */

function convertDate (date) {
  return Math.floor(date.getTime() / 1000);
}
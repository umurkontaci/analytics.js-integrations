
var extend = require('extend');
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
  analytics.addIntegration(Clicky);
  user = analytics.user(); // store for later
};


/**
 * Expose `Clicky` integration.
 */

var Clicky = exports.Integration = integration('Clicky')
  .assumesPageview()
  .readyOnLoad()
  .global('clicky')
  .global('clicky_site_ids')
  .global('clicky_custom')
  .option('siteId', null);


/**
 * Initialize.
 *
 * http://clicky.com/help/customization
 *
 * @param {Object} page
 */

Clicky.prototype.initialize = function (page) {
  window.clicky_site_ids = window.clicky_site_ids || [this.options.siteId];
  this.identify(user.id(), user.traits());
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Clicky.prototype.loaded = function () {
  return !! window.clicky;
};


/**
 * Load the Clicky library.
 *
 * @param {Function} callback
 */

Clicky.prototype.load = function (callback) {
  load('//static.getclicky.com/js', callback);
};


/**
 * Page.
 *
 * http://clicky.com/help/customization#/help/custom/manual
 *
 * @param {String} category (optional)
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Clicky.prototype.page = function (category, name, properties, options) {
  properties = properties || {};
  if (category && name) name = category + ' ' + name;
  window.clicky.log(properties.path, name || properties.title);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Clicky.prototype.identify = function (id, traits, options) {
  window.clicky_custom = window.clicky_custom || {};
  window.clicky_custom.session = window.clicky_custom.session || {};
  if (id) traits.id = id;
  extend(window.clicky_custom.session, traits);
};


/**
 * Track.
 *
 * http://clicky.com/help/customization#/help/custom/manual
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Clicky.prototype.track = function (event, properties, options) {
  window.clicky.goal(event, properties.revenue);
};
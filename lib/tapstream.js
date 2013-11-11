
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var slug = require('slug');
var push = require('global-queue')('_tsq');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Tapstream);
};


/**
 * Expose `Tapstream` integration.
 */

var Tapstream = exports.Integration = integration('Tapstream')
  .assumesPageview()
  .readyOnInitialize()
  .global('_tsq')
  .option('accountName', '')
  .option('trackAllPages', true)
  .option('trackNamedPages', true)
  .option('trackSectionedPages', true);


/**
 * Initialize.
 *
 * @param {Object} page
 */

Tapstream.prototype.initialize = function (page) {
  window._tsq = window._tsq || [];
  push('setAccountName', this.options.accountName);
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Tapstream.prototype.loaded = function () {
  return !! (window._tsq && window._tsq.push !== Array.prototype.push);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Tapstream.prototype.load = function (callback) {
  load('//cdn.tapstream.com/static/js/tapstream.js', callback);
};


/**
 * Page.
 *
 * @param {String} section (optional)
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Tapstream.prototype.page = function (section, name, properties, options) {
  var opts = this.options;

  // all pages
  if (opts.trackAllPages) {
    this.track('Loaded a Page', properties);
  }

  // named pages
  if (name && opts.trackNamedPages) {
    this.track('Viewed ' + name + ' Page', properties);
  }

  // sectioned pages
  if (name && section && opts.trackSectionedPages) {
    this.track('Viewed ' + section + ' ' + name + ' Page', properties);
  }
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Tapstream.prototype.track = function (event, properties, options) {
  properties = properties || {};
  push('fireHit', slug(event), [properties.url]); // needs events as slugs
};
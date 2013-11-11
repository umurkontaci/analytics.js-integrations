
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_qevents', { wrap: false });


/**
 * User reference.
 */

var user;


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Quantcast);
  user = analytics.user(); // store for later
};


/**
 * Expose `Quantcast` integration.
 */

var Quantcast = exports.Integration = integration('Quantcast')
  .assumesPageview()
  .readyOnInitialize()
  .global('_qevents')
  .global('__qc')
  .option('pCode', null)
  .option('labelPages', false);


/**
 * Initialize.
 *
 * https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/
 * https://www.quantcast.com/help/cross-platform-audience-measurement-guide/
 *
 * @param {Object} page
 */

Quantcast.prototype.initialize = function (page) {
  page = page || {};

  var opts = this.options;
  var settings = { qacct: opts.pCode };
  if (user.id()) settings.uid = user.id();
  if (page.name && opts.labelPages) settings.labels = page.name;
  push(settings);

  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Quantcast.prototype.load = function (callback) {
  load({
    http: 'http://edge.quantserve.com/quant.js',
    https: 'https://secure.quantserve.com/quant.js'
  }, callback);
};


/**
 * Page.
 *
 * https://cloudup.com/cBRRFAfq6mf
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Quantcast.prototype.page = function (name, properties, options) {
  var opts = this.options;
  var settings = {
    event: 'refresh',
    qacct: opts.pCode,
  };
  if (user.id()) settings.uid = user.id();
  if (name && opts.labelPages) settings.labels = name;
  push(settings);
};


/**
 * Identify.
 *
 * https://www.quantcast.com/help/cross-platform-audience-measurement-guide/
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Quantcast.prototype.identify = function (id, traits, options) {
  // edit the initial quantcast settings
  if (id) window._qevents[0].uid = id;
};


/**
 * Track.
 *
 * https://cloudup.com/cBRRFAfq6mf
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Quantcast.prototype.track = function (event, properties, options) {
  var settings = {
    event: 'click',
    qacct: this.options.pCode
  };
  if (user.id()) settings.uid = user.id();
  push(settings);
};
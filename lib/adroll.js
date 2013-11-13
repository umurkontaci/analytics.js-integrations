
var integration = require('integration');
var is = require('is');
var load = require('load-script');


/**
 * User reference.
 */

var user;


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(AdRoll);
  user = analytics.user(); // store for later
};


/**
 * Expose `AdRoll` integration.
 */

var AdRoll = exports.Integration = integration('AdRoll')
  .assumesPageview()
  .readyOnLoad()
  .global('__adroll_loaded')
  .global('adroll_adv_id')
  .global('adroll_pix_id')
  .global('adroll_custom_data')
  .option('advId', '')
  .option('pixId', '');


/**
 * Initialize.
 *
 * http://support.adroll.com/getting-started-in-4-easy-steps/#step-one
 * http://support.adroll.com/enhanced-conversion-tracking/
 *
 * @param {Object} page
 */

AdRoll.prototype.initialize = function (page) {
  window.adroll_adv_id = this.options.advId;
  window.adroll_pix_id = this.options.pixId;
  if (user.id()) window.adroll_custom_data = { USER_ID: user.id() };
  window.__adroll_loaded = true;
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

AdRoll.prototype.loaded = function () {
  return window.__adroll;
};


/**
 * Load the AdRoll library.
 *
 * @param {Function} callback
 */

AdRoll.prototype.load = function (callback) {
  load({
    http: 'http://a.adroll.com/j/roundtrip.js',
    https: 'https://s.adroll.com/j/roundtrip.js'
  }, callback);
};
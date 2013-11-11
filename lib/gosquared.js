
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var onBody = require('on-body');


/**
 * User reference.
 */

var user;


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(GoSquared);
  user = analytics.user(); // store reference for later
};


/**
 * Expose `GoSquared` integration.
 */

var GoSquared = exports.Integration = integration('GoSquared')
  .assumesPageview()
  .readyOnLoad()
  .global('GoSquared')
  .global('_gs')
  .global('_gstc_lt')
  .option('siteToken', '');


/**
 * Initialize.
 *
 * http://www.gosquared.com/support
 *
 * @param {Object} page
 */

GoSquared.prototype.initialize = function (page) {
  var self = this;
  var options = this.options;

  // gosquared assumes a body in their script, so we need this wrapper
  onBody(function () {
    window.GoSquared = {};
    window.GoSquared.acct = options.siteToken;
    window.GoSquared.q = [];
    window._gstc_lt = new Date().getTime(); // time from `load`

    self.identify(user.id(), user.traits());
    self.load();
  });
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

GoSquared.prototype.loaded = function () {
  return !! window._gs;
};


/**
 * Load the GoSquared library.
 *
 * @param {Function} callback
 */

GoSquared.prototype.load = function (callback) {
  load('//d1l6p2sc9645hc.cloudfront.net/tracker.js', callback);
};


/**
 * Page.
 *
 * https://www.gosquared.com/customer/portal/articles/612063-tracker-functions
 *
 * @param {String} section (optional)
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.page = function (section, name, properties, options) {
  properties = properties || {};
  if (name && section) name = section + ' ' + name;
  push('TrackView', properties.path, name || properties.title);
};


/**
 * Identify.
 *
 * https://www.gosquared.com/customer/portal/articles/612063-tracker-functions
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.identify = function (id, traits, options) {
  traits = traits || {};

  if (id) traits.userID = id; // gosquared recognizes this in `Visitor`
  if (id) window.GoSquared.UserName = id;
  if (id || traits.email || traits.username) {
    window.GoSquared.VisitorName = traits.email || traits.username || id;
  }

  window.GoSquared.Visitor = traits;
};


/**
 * Track.
 *
 * https://www.gosquared.com/customer/portal/articles/609683-event-tracking
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.track = function (event, properties, options) {
  push('TrackEvent', event, properties);
};


/**
 * Helper to push onto the GoSquared queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window.GoSquared.q.push(args);
}
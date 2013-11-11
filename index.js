
var each = require('each');


/**
 * A list all of our integration slugs.
 */

var integrations = [
  'adroll',
  'amplitude',
  'awesm',
  'awesomatic',
  'bugherd',
  'chartbeat',
  'clicktale',
  'clicky',
  'comscore',
  'crazy-egg',
  'customerio',
  'drip',
  'evergage',
  'errorception',
  'foxmetrics',
  'gauges',
  'get-satisfaction',
  'google-analytics',
  'gosquared',
  'heap',
  'hittail',
  'hubspot',
  'improvely',
  'inspectlet',
  'intercom',
  'keen-io',
  'kissmetrics',
  'klaviyo',
  'leadlander',
  'livechat',
  'lucky-orange',
  'lytics',
  'mixpanel',
  'mousestats',
  'olark',
  'optimizely',
  'perfect-audience',
  'pingdom',
  'preact',
  'qualaroo',
  'quantcast',
  'rollbar',
  'sentry',
  'snapengage',
  'spinnakr',
  'tapstream',
  'trakio',
  'usercycle',
  'userfox',
  'uservoice',
  'vero',
  'visual-website-optimizer',
  'woopra',
  'yandex-metrica'
];


/**
 * Expose the integrations, using their own `name` from their `prototype`.
 */

each(integrations, function (slug) {
  var plugin = require('./lib/' + slug);
  var name = plugin.Integration.prototype.name;
  exports[name] = plugin;
});

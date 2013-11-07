
describe('HubSpot', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var HubSpot = require('integrations/lib/hubspot');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var hubspot;
  var settings = {
    portalId: 62515
  };

  beforeEach(function () {
    analytics.use(HubSpot);
    hubspot = new HubSpot.Integration(settings);
    hubspot.initialize(); // noop
  });

  afterEach(function () {
    hubspot.reset();
  });

  it('should have the right settings', function () {
    test(hubspot)
      .name('HubSpot')
      .assumesPageview()
      .readyOnInitialize()
      .global('_hsq')
      .option('portalId', null);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      hubspot.load = sinon.spy();
    });

    it('should create window._hsq', function () {
      assert(!window._hsq);
      hubspot.initialize();
      assert(window._hsq instanceof Array);
    });

    it('should call #load', function () {
      hubspot.initialize();
      assert(hubspot.load.called);
    });
  });

  describe('#load', function () {
    it('should replace window._hsq.push', function (done) {
      hubspot.load(function (err) {
        if (err) return done(err);
        assert(window._hsq.push !== Array.prototype.push);
        done();
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      hubspot.initialize();
      window._hsq.push = sinon.spy();
    });

    it('should not send traits without an email', function () {
      hubspot.identify('id');
      assert(!window._hsq.push.called);
    });

    it('should send traits with an email', function () {
      hubspot.identify(null, { email: 'name@example.com' });
      assert(window._hsq.push.calledWith(['identify', { email: 'name@example.com' }]));
    });

    it('should send an id and traits with an email', function () {
      hubspot.identify('id', { email: 'name@example.com' });
      assert(window._hsq.push.calledWith(['identify', {
        id: 'id',
        email: 'name@example.com'
      }]));
    });

    it('should convert dates to milliseconds', function () {
      var date = new Date();
      hubspot.identify(null, {
        email: 'name@example.com',
        date: date
      });
      assert(window._hsq.push.calledWith(['identify', {
        email: 'name@example.com',
        date: date.getTime()
      }]));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      hubspot.initialize();
      window._hsq.push = sinon.spy();
    });

    it('should send an event', function () {
      hubspot.track('event');
      assert(window._hsq.push.calledWith(['trackEvent', 'event', {}]));
    });

    it('should send an event and properties', function () {
      hubspot.track('event', { property: true });
      assert(window._hsq.push.calledWith(['trackEvent', 'event', {
        property: true
      }]));
    });

    it('should convert dates to milliseconds', function () {
      var date = new Date();
      hubspot.track('event', { date: date });
      assert(window._hsq.push.calledWith(['trackEvent', 'event', {
        date: date.getTime()
      }]));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      hubspot.initialize();
      window._hsq.push = sinon.spy();
    });

    it('should send a page view', function () {
      hubspot.page();
      assert(window._hsq.push.calledWith(['_trackPageview']));
    });
  });

});
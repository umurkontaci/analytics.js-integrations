
describe('Perfect Audience', function () {

  var PerfectAudience = require('integrations/lib/perfect-audience');
  var analytics = require('analytics');
  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var pa;
  var settings = {
    siteId: '4ff6ade4361ed500020000a5'
  };

  beforeEach(function () {
    analytics.use(PerfectAudience);
    pa = new PerfectAudience.Integration(settings);
    pa.initialize(); // noop
  });

  afterEach(function () {
    pa.reset();
  });

  it('should have the right settings', function () {
    test(pa)
      .name('Perfect Audience')
      .assumesPageview()
      .readyOnLoad()
      .global('_pa')
      .option('siteId', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      pa.load = sinon.spy();
    });

    it('should create the window._pa object', function () {
      assert(!window._pa);
      pa.initialize();
      assert(window._pa);
    });

    it('should call #load', function () {
      pa.initialize();
      assert(pa.load.called);
    });
  });

  describe('#load', function () {
    it('should create window._pa.track', function (done) {
      pa.load(function (err) {
        if (err) return done(err);
        assert(window._pa.track);
        done();
      });
    });
  });

  describe('#track', function () {
    beforeEach(function (done) {
      pa.initialize();
      pa.on('load', function () {
        window._pa.track = sinon.spy();
        done();
      });
    });

    it('should send an event', function () {
      pa.track('event');
      assert(window._pa.track.calledWith('event', undefined));
    });

    it('should send an event and properties', function () {
      pa.track('event', { property: true });
      assert(window._pa.track.calledWith('event', { property: true }));
    });
  });
});
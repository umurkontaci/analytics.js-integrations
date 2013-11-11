
describe('Tapstream', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var Tapstream = require('integrations/lib/tapstream');
  var test = require('integration-tester');

  var tapstream;
  var settings = {
    accountName: 'tapstreamTestAccount'
  };

  beforeEach(function () {
    analytics.use(Tapstream);
    tapstream = new Tapstream.Integration(settings);
    tapstream.initialize(); // noop
  });

  afterEach(function () {
    tapstream.reset();
  });

  it('should store the right settings', function () {
    test(tapstream)
      .name('Tapstream')
      .assumesPageview()
      .readyOnInitialize()
      .global('_tsq')
      .option('accountName', '')
      .option('trackAllPages', true)
      .option('trackNamedPages', true);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      tapstream.load = sinon.spy();
    });

    it('should push setAccount name onto window._tsq', function () {
      tapstream.initialize();
      assert(equal(window._tsq[0] , ['setAccountName', settings.accountName]));
    });

    it('should call #load', function () {
      tapstream.initialize();
      assert(tapstream.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test window._tsq.push', function () {
      window._tsq = [];
      assert(!tapstream.loaded());
      window._tsq.push = function(){};
      assert(tapstream.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(tapstream, 'load');
      tapstream.initialize();
      tapstream.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!tapstream.loaded());
      tapstream.load(function (err) {
        if (err) return done(err);
        assert(tapstream.loaded());
        done();
      });
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      tapstream.initialize();
      window._tsq.push = sinon.spy();
    });

    it('should send an event as a slug', function () {
      tapstream.track('Event');
      assert(window._tsq.push.calledWith(['fireHit', 'event', [undefined]]));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      tapstream.initialize();
      window._tsq.push = sinon.spy();
    });

    it('should send a "Loaded a Page" event', function () {
      tapstream.page();
      assert(window._tsq.push.calledWith([
        'fireHit',
        'loaded-a-page',
        [undefined]
      ]));
    });

    it('should send a named page', function () {
      tapstream.page('Signup');
      assert(window._tsq.push.calledWith([
        'fireHit',
        'loaded-a-page',
        [undefined]
      ]));
      assert(window._tsq.push.calledWith([
        'fireHit',
        'viewed-signup-page',
        [undefined]
      ]));
    });

    it('should send unnamed pages', function () {
      tapstream.page(undefined, { url: 'test' });
      assert(window._tsq.push.calledWith([
        'fireHit',
        'loaded-a-page',
        ['test']
      ]));
    });
  });
});
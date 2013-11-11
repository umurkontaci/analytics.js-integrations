
describe('Woopra', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var Woopra = require('integrations/lib/woopra');

  var woopra;
  var settings = {
    domain: 'x'
  };

  beforeEach(function () {
    analytics.use(Woopra);
    woopra = new Woopra.Integration(settings);
    woopra.initialize(); // noop
  });

  afterEach(function () {
    woopra.reset();
  });

  it('should have the right settings', function () {
    test(woopra)
      .name('Woopra')
      .assumesPageview()
      .readyOnLoad()
      .global('woopra')
      .option('domain', '');
  });

  describe('#loaded', function () {
    it('should test window.woopra.loaded', function () {
      window.woopra = {};
      assert(!woopra.loaded());
      window.woopra.loaded = true;
      assert(woopra.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(woopra, 'load');
      woopra.initialize();
      woopra.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!woopra.loaded());
      woopra.load(function (err) {
        if (err) return done(err);
        assert(woopra.loaded());
        done();
      });
    });
  });

  describe('#initialize', function () {
    beforeEach(function () {
      woopra.load = sinon.spy();
    });

    it('should create a woopra object', function () {
      assert(!window.woopra);
      woopra.initialize();
      assert(window.woopra);
    });

    it('should call #load', function () {
      woopra.initialize();
      assert(woopra.load.called);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      woopra.initialize();
      // woopra identify has other methods on it
      window.woopra.identify = sinon.spy(window.woopra, 'identify');
    });

    it('should send an id', function () {
      woopra.identify('id');
      assert(window.woopra.identify.calledWith({ id: 'id' }));
    });

    it('should send traits', function () {
      woopra.identify(null, { trait: true });
      assert(window.woopra.identify.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      woopra.identify('id', { trait: true });
      assert(window.woopra.identify.calledWith({ id: 'id', trait: true }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      woopra.initialize();
      window.woopra.track = sinon.spy();
    });

    it('should send an event', function () {
      woopra.track('event');
      assert(window.woopra.track.calledWith('event'));
    });

    it('should send properties', function () {
      woopra.track('event', { property: 'Property' });
      assert(window.woopra.track.calledWith('event', { property: 'Property' }));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      woopra.initialize();
      window.woopra.track = sinon.spy();
    });

    it('should send a page view', function () {
      woopra.page();
      assert(window.woopra.track.calledWith('pv', {}));
    });

    it('should send a title', function () {
      woopra.page(null, null, { title: 'title' });
      assert(window.woopra.track.calledWith('pv', { title: 'title' }));
    });

    it('should prefer a name', function () {
      woopra.page(null, 'name', { title: 'title' });
      assert(window.woopra.track.calledWith('pv', { title: 'name' }));
    });

    it('should prefer a section and name', function () {
      woopra.page('section', 'name', { title: 'title' });
      assert(window.woopra.track.calledWith('pv', { title: 'section name' }));
    });
  });
});



describe('Clicky', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var Clicky = require('integrations/lib/clicky');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var clicky;
  var settings = {
    siteId: 100649848
  };

  beforeEach(function () {
    analytics.use(Clicky);
    clicky = new Clicky.Integration(settings);
    clicky.initialize(); // noop
  });

  afterEach(function () {
    clicky.reset();
    analytics.user().reset();
  });

  after(function () {
    // set up global vars so clicky doesn't error other tests
    window.clicky_custom = {};
  });

  it('should have the right settings', function () {
    test(clicky)
      .name('Clicky')
      .assumesPageview()
      .readyOnLoad()
      .global('clicky_site_ids')
      .option('siteId', null);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      clicky.load = sinon.spy();
    });

    it('should initialize the clicky global', function () {
      clicky.initialize();
      assert(equal(window.clicky_site_ids, [settings.siteId]));
    });

    it('should set custom data', function () {
      analytics.user().identify('id', { trait: true });
      clicky.identify = sinon.spy();
      clicky.initialize();
      assert(clicky.identify.calledWith('id', { trait: true }));
    });

    it('should call #load', function () {
      clicky.initialize();
      assert(clicky.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test window.clicky', function () {
      assert(!clicky.loaded());
      window.clicky = {};
      assert(clicky.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(clicky, 'load');
      clicky.initialize();
      clicky.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!clicky.loaded());
      clicky.load(function (err) {
        if (err) return done(err);
        assert(clicky.loaded());
        done();
      });
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      clicky.initialize();
      window.clicky = { log: sinon.spy() };
    });

    it('should send a path and title', function () {
      clicky.page(null, null, { path: '/path', title: 'title' });
      assert(window.clicky.log.calledWith('/path', 'title'));
    });

    it('should prefer a name', function () {
      clicky.page(null, 'name', { path: '/path', title: 'title' });
      assert(window.clicky.log.calledWith('/path', 'name'));
    });

    it('should prefer a name and section', function () {
      clicky.page('section', 'name', { path: '/path', title: 'title' });
      assert(window.clicky.log.calledWith('/path', 'section name'));
    });
  });

  describe('#identify', function () {
    beforeEach(function (done) {
      clicky.initialize();
      clicky.once('ready', done);
    });

    it('should set an id', function () {
      clicky.identify('id', {});
      assert(equal(window.clicky_custom.session, { id: 'id' }));
    });

    it('should set traits', function () {
      clicky.identify(null, { trait: true });
      assert(equal(window.clicky_custom.session, { trait: true }));
    });

    it('should set an id and traits', function () {
      clicky.identify('id', { trait: true });
      assert(equal(window.clicky_custom.session, { id: 'id', trait: true }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      window.clicky = { goal: sinon.spy() };
    });

    it('should send an event', function () {
      clicky.track('event', {});
      assert(window.clicky.goal.calledWith('event'));
    });

    it('should send revenue', function () {
      clicky.track('event', { revenue: 42.99 });
      assert(window.clicky.goal.calledWith('event', 42.99));
    });
  });

});
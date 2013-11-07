
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

  describe('#load', function () {
    it('should create window.clicky', function (done) {
      assert(!window.clicky);
      clicky.load(function (err) {
        if (err) return done(err);
        assert(window.clicky);
        done();
      });
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

  describe('#page', function () {
    beforeEach(function () {
      clicky.initialize();
      window.clicky = { log: sinon.spy() };
    });

    it('should send a path and name', function () {
      clicky.page('Page', { path: '/path' });
      assert(window.clicky.log.calledWith('/path', 'Page'));
    });

    it('should fallback to title', function () {
      clicky.page(null, { title: 'Title', path: '/path' });
      assert(window.clicky.log.calledWith('/path', 'Title'));
    });
  });

});
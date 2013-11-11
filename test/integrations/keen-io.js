
describe('Keen IO', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var Keen = require('integrations/lib/keen-io');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var keen;
  var settings = {
    projectId: '510c82172975160344000002',
    writeKey: '1ab6cabb3be05b956d1044c67e02ae6eb2952e6801cedd8303608327c45a1308ecf5ae294e4c45c566678e6f3eefea3e685b8a789e032050b6fb228c72e22b210115f2dbd50caed0454285f37ecec4cda52832e8792d766817e0d11e7f935b92aee73c0c62770f528b8b65d5b7de24a4'
  };

  beforeEach(function () {
    analytics.use(Keen);
    keen = new Keen.Integration(settings);
  });

  afterEach(function () {
    keen.reset();
  });

  it('should have the right settings', function () {
    test(keen)
      .name('Keen IO')
      .readyOnInitialize()
      .global('Keen')
      .option('projectId', '')
      .option('readKey', '')
      .option('writeKey', '')
      .option('trackNamedPages', true)
      .option('trackAllPages', false);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      keen.load = sinon.spy();
    });

    it('should create window.Keen', function () {
      assert(!window.Keen);
      keen.initialize();
      assert(window.Keen);
    });

    it('should configure Keen', function () {
      keen.initialize();
      assert(equal(window.Keen._cf, {
        projectId: settings.projectId,
        writeKey: settings.writeKey,
        readKey: ''
      }));
    });

    it('should call #load', function () {
      keen.initialize();
      assert(keen.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test window.Keen.Base64', function () {
      window.Keen = {};
      assert(!keen.loaded());
      window.Keen.Base64 = true;
      assert(keen.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(keen, 'load');
      keen.initialize();
      keen.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!keen.loaded());
      keen.load(function (err) {
        if (err) return done(err);
        assert(keen.loaded());
        done();
      });
    });
  });

  describe('#page', function () {
    beforeEach(function (done) {
      keen.initialize();
      keen.once('load', function () {
        window.Keen.addEvent = sinon.spy();
        done();
      });
    });

    it('should not track anonymous pages by default', function () {
      keen.page();
      assert(!window.Keen.addEvent.called);
    });

    it('should track anonymous pages when the option is on', function () {
      keen.options.trackAllPages = true;
      keen.page();
      assert(window.Keen.addEvent.calledWith('Loaded a Page'));
    });

    it('should track named pages by default', function () {
      keen.page(null, 'Name');
      assert(window.Keen.addEvent.calledWith('Viewed Name Page'));
    });

    it('should not track named pages when the option is off', function () {
      keen.options.trackNamedPages = false;
      keen.page(null, 'Name');
      assert(!window.Keen.addEvent.called);
    });

    it('should track sectioned pages by default', function () {
      keen.page('Section', 'Name');
      assert(window.Keen.addEvent.calledWith('Viewed Section Name Page'));
    });

    it('should not track sectioned pages when the option is off', function () {
      keen.options.trackNamedPages = false;
      keen.options.trackSectionedPages = false;
      keen.page('Section', 'Name');
      assert(!window.Keen.addEvent.called);
    });
  });

  describe('#identify', function () {
    beforeEach(function (done) {
      keen.initialize();
      keen.once('load', done);
    });

    it('should pass an id', function () {
      keen.identify('id');
      var user = window.Keen.client.globalProperties().user;
      assert(equal(user, { userId: 'id', traits: {} }));
    });

    it('should pass a traits', function () {
      keen.identify(null, { trait: true });
      var user = window.Keen.client.globalProperties().user;
      assert(equal(user, { traits: { trait: true }}));
    });

    it('should pass an id and traits', function () {
      keen.identify('id', { trait: true });
      var user = window.Keen.client.globalProperties().user;
      assert(equal(user, { userId: 'id', traits: { trait: true }}));
    });
  });

  describe('#track', function () {
    beforeEach(function (done) {
      keen.initialize();
      keen.once('load', function () {
        window.Keen.addEvent = sinon.spy();
        done();
      });
    });

    it('should pass an event', function () {
      keen.track('event');
      assert(window.Keen.addEvent.calledWith('event'));
    });

    it('should pass an event and properties', function () {
      keen.track('event', { property: true });
      assert(window.Keen.addEvent.calledWith('event', { property: true }));
    });
  });

});
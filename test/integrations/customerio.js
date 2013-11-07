
describe('Customer.io', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var Customerio = require('integrations/lib/customerio');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var customerio;
  var settings = {
    siteId: 'x'
  };

  beforeEach(function () {
    analytics.use(Customerio);
    customerio = new Customerio.Integration(settings);
    customerio.initialize(); // noop
  });

  afterEach(function () {
    customerio.reset();
    analytics.user().reset();
  });

  it('should have the right settings', function () {
    test(customerio)
      .name('Customer.io')
      .assumesPageview()
      .readyOnInitialize()
      .global('_cio')
      .option('siteId', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      customerio.load = sinon.spy();
    });

    it('should create the window._cio object', function () {
      assert(!window._cio);
      customerio.initialize();
      assert(window._cio);
    });

    it('should call #load', function () {
      customerio.initialize();
      assert(customerio.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(customerio, 'load');
      customerio.initialize();
      customerio.load.restore();
    });

    it('should set window._cio.pageHasLoaded', function (done) {
      assert(!window._cio.pageHasLoaded);
      customerio.load(function (err) {
        if (err) return done(err);
        assert(window._cio.pageHasLoaded);
        done();
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function (done) {
      customerio.initialize();
      customerio.once('load', function () {
        window._cio.identify = sinon.spy();
        setTimeout(done, 50);
      });
    });

    it('should send an id', function () {
      customerio.identify('id', {});
      assert(window._cio.identify.calledWith({ id: 'id' }));
    });

    it('should not send only traits', function () {
      customerio.identify(null, { trait: true });
      assert(!window._cio.identify.called);
    });

    it('should send an id and traits', function () {
      customerio.identify('id', { trait: true });
      assert(window._cio.identify.calledWith({ id: 'id', trait: true }));
    });

    it('should convert dates', function () {
      var date = new Date();
      customerio.identify('id', { date: date });
      assert(window._cio.identify.calledWith({
        id: 'id',
        date: Math.floor(date / 1000)
      }));
    });

    it('should alias created to created_at', function () {
      var date = new Date();
      customerio.identify('id', { created: date });
      assert(window._cio.identify.calledWith({
        id: 'id',
        created_at: Math.floor(date / 1000)
      }));
    });
  });

  describe('#group', function () {
    beforeEach(function (done) {
      analytics.user().identify('id');
      customerio.initialize();
      customerio.once('load', function () {
        window._cio.identify = sinon.spy();
        setTimeout(done, 50);
      });
    });

    it('should send an id', function () {
      customerio.group('id', {});
      assert(window._cio.identify.calledWith({ id: 'id', 'Group id': 'id' }));
    });

    it('should send traits', function () {
      customerio.group(null, { trait: true });
      assert(window._cio.identify.calledWith({ id: 'id', 'Group trait': true }));
    });

    it('should send an id and traits', function () {
      customerio.group('id', { trait: true });
      assert(window._cio.identify.calledWith({
        id: 'id',
        'Group id': 'id',
        'Group trait': true
      }));
    });

    it('should convert dates', function () {
      var date = new Date();
      customerio.group(null, { date: date });
      assert(window._cio.identify.calledWith({
        id: 'id',
        'Group date': Math.floor(date / 1000)
      }));
    });
  });

  describe('#track', function () {
    beforeEach(function (done) {
      customerio.initialize();
      customerio.once('load', function () {
        window._cio.track = sinon.spy();
        setTimeout(done, 50);
      });
    });

    it('should send an event', function () {
      customerio.track('event', {});
      assert(window._cio.track.calledWith('event'));
    });

    it('should send an event and properties', function () {
      customerio.track('event', { property: true });
      assert(window._cio.track.calledWith('event', { property: true }));
    });

    it('should convert dates', function () {
      var date = new Date();
      customerio.track('event', { date: date });
      assert(window._cio.track.calledWith('event', {
        date: Math.floor(date / 1000)
      }));
    });
  });

});
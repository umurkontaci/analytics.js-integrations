
describe('Heap', function () {

  var analytics = window.analytics || require('analytics');
  var analytics = require('analytics');
  var assert = require('assert');
  var each = require('each');
  var equal = require('equals');
  var Heap = require('integrations/lib/heap');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var heap;
  var settings = {
    apiKey: 'x'
  };

  beforeEach(function () {
    analytics.use(Heap);
    heap = new Heap.Integration(settings);
    heap.initialize(); // noop
  });

  afterEach(function () {
    heap.reset();
  });

  it('should have the right settings', function () {
    test(heap)
      .name('Heap')
      .assumesPageview()
      .readyOnInitialize()
      .global('heap')
      .global('_heapid')
      .option('apiKey', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      heap.load = sinon.spy();
    });

    it('should create window.heap', function () {
      assert(!window.heap);
      heap.initialize();
      assert(window.heap);
    });

    it('should stub window.heap with the right methods', function () {
      var methods = ['identify', 'track'];
      assert(!window.heap);
      heap.initialize();
      each(methods, function (method) { assert(window.heap[method]); });
    });

    it('should set window._heapid', function () {
      assert(!window._heapid);
      heap.initialize();
      assert(window._heapid === settings.apiKey);
    });

    it('should call #load', function () {
      heap.initialize();
      assert(heap.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test window.heap.appid', function () {
      window.heap = {};
      assert(!heap.loaded());
      window.heap.appid = settings.apiKey;
      assert(heap.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(heap, 'load');
      heap.initialize();
      heap.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!heap.loaded());
      heap.load(function (err) {
        if (err) return done(err);
        assert(heap.loaded());
        done();
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      heap.initialize();
      window.heap.identify = sinon.spy();
    });

    it('should send traits', function () {
      heap.identify(null, { trait: true });
      assert(window.heap.identify.calledWith({ trait: true }));
    });

    it('should alias a username', function () {
      heap.identify(null, { username: 'username' });
      assert(window.heap.identify.calledWith({ handle: 'username' }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      heap.initialize();
      window.heap.track = sinon.spy();
    });

    it('should send an event', function () {
      heap.track('event');
      assert(window.heap.track.calledWith('event'));
    });

    it('should send an event and properties', function () {
      heap.track('event', { property: true });
      assert(window.heap.track.calledWith('event', { property: true }));
    });
  });

});
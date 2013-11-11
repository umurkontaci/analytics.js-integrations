
describe('Amplitude', function () {

  var Amplitude = require('integrations/lib/amplitude');
  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var amplitude;
  var settings = {
    apiKey: '07808866adb2510adf19ee69e8fc2201'
  };

  beforeEach(function () {
    analytics.use(Amplitude);
    amplitude = new Amplitude.Integration(settings);
    amplitude.initialize(); // noop
  });

  afterEach(function () {
    amplitude.reset();
  });

  it('should have the right settings', function () {
    test(amplitude)
      .name('Amplitude')
      .assumesPageview()
      .readyOnInitialize()
      .global('amplitude')
      .option('apiKey', '')
      .option('trackAllPages', false)
      .option('trackNamedPages', true);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      amplitude.load = sinon.spy();
    });

    it('should create window.amplitude', function () {
      assert(!window.amplitude);
      amplitude.initialize();
      assert(window.amplitude);
    });

    it('should call #load', function () {
      amplitude.initialize();
      assert(amplitude.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test window.amplitude.options', function () {
      window.amplitude = {};
      assert(!amplitude.loaded());
      window.amplitude.options = {};
      assert(amplitude.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(amplitude, 'load');
      amplitude.initialize();
      amplitude.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!amplitude.loaded());
      amplitude.load(function (err) {
        if (err) return done(err);
        assert(amplitude.loaded());
        done();
      });
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      amplitude.initialize();
      window.amplitude.logEvent = sinon.spy();
    });

    it('should not track unnamed pages by default', function () {
      amplitude.page();
      assert(!window.amplitude.logEvent.called);
    });

    it('should track unnamed pages if enabled', function () {
      amplitude.options.trackAllPages = true;
      amplitude.page(null, null, {});
      assert(window.amplitude.logEvent.calledWith('Loaded a Page', {}));
    });

    it('should track named pages by default', function () {
      amplitude.page(null, 'Name', {});
      assert(window.amplitude.logEvent.calledWith('Viewed Name Page', {}));
    });

    it('should track named pages with a category added', function () {
      amplitude.page('Category', 'Name', {});
      assert(window.amplitude.logEvent.calledWith('Viewed Category Name Page', {}));
    });

    it('should track categorized pages by default', function () {
      amplitude.page('Category', 'Name', {});
      assert(window.amplitude.logEvent.calledWith('Viewed Category Page', {}));
    });

    it('should not track name or categorized pages if disabled', function () {
      amplitude.options.trackNamedPages = false;
      amplitude.options.trackCategorizedPages = false;
      amplitude.page(null, 'Name', {});
      amplitude.page('Category', 'Name', {});
      assert(!window.amplitude.logEvent.called);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      amplitude.initialize();
      window.amplitude.setUserId = sinon.spy();
      window.amplitude.setGlobalUserProperties = sinon.spy();
    });

    it('should send an id', function () {
      amplitude.identify('id');
      assert(window.amplitude.setUserId.calledWith('id'));
    });

    it('should send traits', function () {
      amplitude.identify(null, { trait: true });
      assert(window.amplitude.setGlobalUserProperties.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      amplitude.identify('id', { trait: true });
      assert(window.amplitude.setUserId.calledWith('id'));
      assert(window.amplitude.setGlobalUserProperties.calledWith({ trait: true }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      amplitude.initialize();
      window.amplitude.logEvent = sinon.spy();
    });

    it('should send an event', function () {
      amplitude.track('event');
      assert(window.amplitude.logEvent.calledWith('event'));
    });

    it('should send an event and properties', function () {
      amplitude.track('event', { property: true });
      assert(window.amplitude.logEvent.calledWith('event', { property: true }));
    });
  });
});
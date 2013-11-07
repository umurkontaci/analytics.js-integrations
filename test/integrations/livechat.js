
describe('LiveChat', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var LiveChat = require('integrations/lib/livechat');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var livechat;
  var settings = {
    license: '1520'
  };

  beforeEach(function () {
    analytics.use(LiveChat);
    livechat = new LiveChat.Integration(settings);
    livechat.initialize(); // noop
  });

  afterEach(function () {
    livechat.reset();
  });

  it('should have the right settings', function () {
    test(livechat)
      .name('LiveChat')
      .assumesPageview()
      .readyOnLoad()
      .global('__lc')
      .option('license', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      livechat.load = sinon.spy();
    });

    it('should create window.__lc', function () {
      assert(!window.__lc);
      livechat.initialize();
      assert(equal(window.__lc, { license: settings.license }));
    });

    it('should call #load', function () {
      livechat.initialize();
      assert(livechat.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.LC_API', function (done) {
      assert(!window.LC_API);
      livechat.load(function (err) {
        if (err) return done(err);
        assert(window.LC_API);
        done();
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function (done) {
      livechat.initialize();
      livechat.once('load', function () {
        window.LC_API.set_custom_variables = sinon.spy();
        done();
      });
    });

    it('should send an id', function () {
      livechat.identify('id');
      assert(window.LC_API.set_custom_variables.calledWith([
        { name: 'User ID', value: 'id' }
      ]));
    });

    it('should send traits', function () {
      livechat.identify(null, { trait: true });
      assert(window.LC_API.set_custom_variables.calledWith([
        { name: 'trait', value: true }
      ]));
    });

    it('should send an id and traits', function () {
      livechat.identify('id', { trait: true });
      assert(window.LC_API.set_custom_variables.calledWith([
        { name: 'trait', value: true },
        { name: 'User ID', value: 'id' }
      ]));
    });
  });

});

describe('BugHerd', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var BugHerd = require('integrations/lib/bugherd');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var bugherd;
  var settings = {
    apiKey: '7917d741-16cc-4c2b-bb1a-bdd903d53d72'
  };

  beforeEach(function () {
    analytics.use(BugHerd);
    bugherd = new BugHerd.Integration(settings);
    bugherd.initialize(); // noop
  });

  afterEach(function () {
    bugherd.reset();
  });

  it('should have the right settings', function () {
    test(bugherd)
      .name('BugHerd')
      .assumesPageview()
      .readyOnLoad()
      .global('BugHerdConfig')
      .global('_bugHerd')
      .option('apiKey', '')
      .option('showFeedbackTab', true);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      bugherd.load = sinon.spy();
    });

    it('should create window.BugHerdConfig', function () {
      bugherd.initialize();
      assert(equal(window.BugHerdConfig, { feedback: { hide: false }}));
    });

    it('should be able to hide the tab', function () {
      bugherd.options.showFeedbackTab = false;
      bugherd.initialize();
      assert(equal(window.BugHerdConfig, { feedback: { hide: true }}));
    });

    it('should call #load', function () {
      bugherd.initialize();
      assert(bugherd.load.called);
    });
  });

  describe('#load', function () {
    it('should create window._bugHerd', function (done) {
      assert(!window._bugHerd);
      bugherd.load(function (err) {
        if (err) return done(err);
        assert(window._bugHerd);
        done();
      });
    });
  });

});
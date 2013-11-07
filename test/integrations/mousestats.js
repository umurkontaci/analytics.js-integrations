
describe('MouseStats', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var MouseStats = require('integrations/lib/mousestats');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var mousestats;
  var settings = {
    accountNumber: '5532375730335616295'
  };

  beforeEach(function () {
    analytics.use(MouseStats);
    mousestats = new MouseStats.Integration(settings);
    mousestats.initialize(); // noop
  });

  afterEach(function () {
    mousestats.reset();
  });

  it('should have the right settings', function () {
    test(mousestats)
      .name('MouseStats')
      .assumesPageview()
      .readyOnLoad()
      .global('msaa')
      .option('accountNumber', '');
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      mousestats.load = sinon.spy();
      mousestats.initialize();
      assert(mousestats.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.msaa', function (done) {
      assert(!window.msaa);
      mousestats.load(function (err) {
        if (err) return done(err);
        assert(window.msaa);
        done();
      });
    });
  });

});
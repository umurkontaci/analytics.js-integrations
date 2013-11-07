
describe('Crazy Egg', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var CrazyEgg = require('integrations/lib/crazy-egg');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var crazyegg;
  var settings = {
    accountNumber: '00138301'
  };

  beforeEach(function () {
    analytics.use(CrazyEgg);
    crazyegg = new CrazyEgg.Integration(settings);
    crazyegg.initialize(); // noop
  });

  afterEach(function () {
    crazyegg.reset();
  });

  it('should have the right settings', function () {
    test(crazyegg)
      .name('Crazy Egg')
      .assumesPageview()
      .readyOnLoad()
      .global('CE2')
      .option('accountNumber', '');
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      crazyegg.load = sinon.spy();
      crazyegg.initialize();
      assert(crazyegg.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.__adroll', function (done) {
      assert(!window.CE2);
      crazyegg.load(function (err) {
        if (err) return done(err);
        assert(window.CE2);
        done();
      });
    });
  });

});
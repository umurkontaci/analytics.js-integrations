
describe('HitTail', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var HitTail = require('integrations/lib/hittail');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var hittail;
  var settings = {
    siteId: 'x'
  };

  beforeEach(function () {
    analytics.use(HitTail);
    hittal = new HitTail.Integration(settings);
    hittal.initialize(); // noop
  });

  afterEach(function () {
    hittal.reset();
  });

  it('should have the right settings', function () {
    test(hittal)
      .name('HitTail')
      .assumesPageview()
      .readyOnLoad()
      .global('htk')
      .option('siteId', '');
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      hittal.load = sinon.spy();
      hittal.initialize();
      assert(hittal.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.htk', function (done) {
      assert(!window.htk);
      hittal.load(function (err) {
        if (err) return done(err);
        assert(window.htk);
        done();
      });
    });
  });

});
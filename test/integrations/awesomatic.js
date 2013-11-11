
describe('Awesomatic', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var Awesomatic = require('integrations/lib/awesomatic');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var awesomatic;
  var settings = {
    appId: 'af392af01603ca383672689241b648b2'
  };

  beforeEach(function () {
    analytics.use(Awesomatic);
    awesomatic = new Awesomatic.Integration(settings);
    awesomatic.initialize(); // noop
  });

  afterEach(function () {
    awesomatic.reset();
  });

  it('should have the right settings', function () {
    test(awesomatic)
      .name('Awesomatic')
      .assumesPageview()
      .global('Awesomatic')
      .option('appId', '');
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      awesomatic.load = sinon.spy();
      awesomatic.initialize();
      assert(awesomatic.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test window.Awesomatic', function () {
      assert(!awesomatic.loaded());
      window.Awesomatic = {};
      assert(awesomatic.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(awesomatic, 'load');
      awesomatic.initialize();
      awesomatic.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!awesomatic.loaded());
      awesomatic.load(function (err) {
        if (err) return done(err);
        assert(awesomatic.loaded());
        done();
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      window.Awesomatic = { load: sinon.spy() };
    });

    it('should send an id', function () {
      awesomatic.identify('id', {});
      assert(window.Awesomatic.load.calledWith({ userId: 'id' }));
    });

    it('should send an id and properties', function () {
      awesomatic.identify('id', { property: true });
      assert(window.Awesomatic.load.calledWith({ userId: 'id', property: true }));
    });

    it('should require an id or email', function () {
      awesomatic.identify(null, { property: true });
      assert(!window.Awesomatic.load.called);
    });
  });
});
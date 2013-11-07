
describe('Get Satisfaction', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var GetSatisfaction = require('integrations/lib/get-satisfaction');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var getsatisfaction;
  var settings = {
    widgetId: 5005
  };

  beforeEach(function () {
    analytics.use(GetSatisfaction);
    getsatisfaction = new GetSatisfaction.Integration(settings);
    getsatisfaction.initialize(); // noop
  });

  afterEach(function () {
    getsatisfaction.reset();
  });

  it('should have the right settings', function () {
    test(getsatisfaction)
      .name('Get Satisfaction')
      .assumesPageview()
      .readyOnLoad()
      .global('GSFN')
      .option('widgetId', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      getsatisfaction.load = sinon.spy();
    });

    it('should add the get satisfaction widget to the dom', function () {
      getsatisfaction.initialize();
      assert(document.getElementById('getsat-widget-' + settings.widgetId));
    });

    it('should call #load', function () {
      getsatisfaction.initialize();
      assert(getsatisfaction.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.GSFN', function (done) {
      assert(!window.GSFN);
      getsatisfaction.load(function (err) {
        if (err) return done(err);
        assert(window.GSFN);
        done();
      });
    });
  });

});
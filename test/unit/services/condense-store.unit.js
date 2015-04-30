/**
 * Created by vasa on 30.09.14.
 */

//jshint ignore:start
/* eslint-disable */

describe('CondenseStore Store', function () {
  beforeEach(module('asuno.services'));

  it('should be instanceof EventEmitter', inject(function (CondenseStore) {
    expect(CondenseStore instanceof EventEmitter).toBe(true);
  }));

  it('should be conensed by default', inject(function (CondenseStore) {
    expect(CondenseStore.isCondensed()).toBe(true);
  }));

  it('should be condensed after CONDENSE_ENABLE dispatch', inject(function (AsunoDispatcher, CondenseConstants, CondenseStore) {
    AsunoDispatcher.handleViewAction({
      actionType : CondenseConstants.CONDENSE_ENABLE
    });

    expect(CondenseStore.isCondensed()).toBe(true);
  }));

  it('should be not condensed after CONDENSE_DISABLE dispatch', inject(function (AsunoDispatcher, CondenseConstants, CondenseStore) {
    AsunoDispatcher.handleViewAction({
      actionType : CondenseConstants.CONDENSE_DISABLE
    });

    expect(CondenseStore.isCondensed()).toBe(false);
  }));

  it('should trigger update after action dispatch', inject(function (AsunoDispatcher, CondenseConstants, CondenseStore) {
    var condensed;

    CondenseStore.addChangeListener(function () {
      condensed = CondenseStore.isCondensed();
    });

    AsunoDispatcher.handleViewAction({
      actionType : CondenseConstants.CONDENSE_ENABLE
    });

    expect(condensed).toBe(true);

    AsunoDispatcher.handleViewAction({
      actionType : CondenseConstants.CONDENSE_DISABLE
    });

    expect(condensed).toBe(false);
  }));

  it('should not call callback if it was removed', inject(function (AsunoDispatcher, CondenseConstants, CondenseStore) {

    var listener = jasmine.createSpy('listener');

    CondenseStore.addChangeListener(listener);
    CondenseStore.removeChangeListener(listener);

    AsunoDispatcher.handleViewAction({
      actionType : CondenseConstants.CONDENSE_ENABLE
    });

    expect(listener).not.toHaveBeenCalled();
  }))
});

/**
 * Created by vasa on 06.09.14.
 */

(function () {
  'use strict';

  function CondenseConstants(ConstantsCreator) {
    return ConstantsCreator.create('CondenseConstants', {
      CONDENSE_ENABLE  : null,
      CONDENSE_DISABLE : null
    });
  }

  function CondenseStore(AsunoDispatcher, CondenseConstants) {

    var CHANGE_EVENT = 'condense-store-change';
    var _condensed = true;

    var condenseStoreInstance = angular.extend(new EventEmitter(), {

      isCondensed() {
        return _condensed;
      },

      addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
      },

      removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
      },

      emitChange() {
        this.emit(CHANGE_EVENT);
      }
    });

    AsunoDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {

        case CondenseConstants.CONDENSE_ENABLE:
          _condensed = true;
          break;

        case CondenseConstants.CONDENSE_DISABLE:
          _condensed = false;
          break;

        default:
          return true;
      }

      condenseStoreInstance.emitChange();
      return true;
    });

    return condenseStoreInstance;
  }

  function CondenseActions(AsunoDispatcher, CondenseConstants) {
    this.toggle = function (isZoomed) {
      AsunoDispatcher.handleViewAction({
        actionType : isZoomed ? CondenseConstants.CONDENSE_ENABLE : CondenseConstants.CONDENSE_DISABLE
      });
    };

    this.enable = function () {
      AsunoDispatcher.handleViewAction({
        actionType : CondenseConstants.CONDENSE_ENABLE
      });
    };

    this.disable = function () {
      AsunoDispatcher.handleViewAction({
        actionType : CondenseConstants.CONDENSE_DISABLE
      });
    };
  }

  angular.module('asuno.services').factory('CondenseConstants', CondenseConstants);
  angular.module('asuno.services').factory('CondenseStore', CondenseStore);
  angular.module('asuno.services').service('CondenseActions', CondenseActions);
})();

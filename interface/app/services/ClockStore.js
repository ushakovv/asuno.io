(function () {
  'use strict';

  var _delta = 0;

  function resetSync(utc) {
    _delta = new Date().getTime() - new Date(utc).getTime();
  }

  function ClockStoreConstants(ConstantsCreator) {
    return ConstantsCreator.create('ClockStoreConstants', {
      RESET_SYNC : null
    });
  }

  function ClockActions($http, AsunoDispatcher, ClockStoreConstants) {
    this.sync = function () {
      $http.get('/time').then(function (response) {
        AsunoDispatcher.handleViewAction({
          actionType : ClockStoreConstants.RESET_SYNC,
          utc        : response.data.time
        });
      });
    };
  }

  function ClockStore($rootScope, AsunoDispatcher, ClockActions, ClockStoreConstants, tickEvent) {

    var clockStore = {
      getTime: function() {
        return this.adjustTime(new Date());
      },
      adjustTime: function(time) {
        return new Date(new Date(time).getTime() - _delta);
      }
    };

    AsunoDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case ClockStoreConstants.RESET_SYNC:
          resetSync(action.utc);
          break;

        default:
          return true;
      }

      return true;
    });

    ClockActions.sync();

    $rootScope.$on(tickEvent, function (event, counter) {
      if (counter % 6 === 0) {
        ClockActions.sync();
      }
    });

    return clockStore;
  }

  angular.module('asuno.services').factory('ClockStoreConstants', ClockStoreConstants);
  angular.module('asuno.services').service('ClockActions', ClockActions);
  angular.module('asuno.services').factory('ClockStore', ClockStore);
})();

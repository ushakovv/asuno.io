(function () {
  'use strict';

  var _sensors = [];

  function setSensors(sensors) {
    _sensors = sensors;
  }

  function SensorsStoreConstants(ConstantsCreator) {
    return ConstantsCreator.create('SensorsStoreConstants', {
      SET_SENSORS : null
    });
  }

  var CHANGE_EVENT = 'SensorsStore.change';

  function SensorsActions(Mutex, AsunoDispatcher, Sensors, SensorsStoreConstants) {

    var mutex = Mutex.create();

    this.reloadSensors = function () {
      if (!mutex.isLocked()) {
        mutex.lock();

        Sensors
          .query(function (sensors) {
            AsunoDispatcher.handleServerAction({
              actionType : SensorsStoreConstants.SET_SENSORS,
              sensors    : sensors
            });
          })
          .$promise
          .finally(function () {
            mutex.release();
          });
      }
    };
  }

  function SensorsStore($rootScope, AsunoDispatcher, SensorsActions, SensorsStoreConstants, tickEvent) {

    var sensorsStoreInstance = angular.extend(new EventEmitter(), {
      getSensors : function () {
        return _sensors;
      },

      addChangeListener : function (callback) {
        this.addListener(CHANGE_EVENT, callback);
      },

      removeChangeListener : function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
      },

      emitChange : function () {
        this.emit(CHANGE_EVENT);
      }
    });

    AsunoDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case SensorsStoreConstants.SET_SENSORS:
          setSensors(action.sensors);
          sensorsStoreInstance.emitChange();
          break;

        default:
          return true;
      }

      return true;
    });

    SensorsActions.reloadSensors();
    $rootScope.$on(tickEvent, SensorsActions.reloadSensors);
    return sensorsStoreInstance;
  }

  angular.module('asuno.services').factory('SensorsStoreConstants', SensorsStoreConstants);
  angular.module('asuno.services').service('SensorsActions', SensorsActions);
  angular.module('asuno.services').factory('SensorsStore', SensorsStore);
})();

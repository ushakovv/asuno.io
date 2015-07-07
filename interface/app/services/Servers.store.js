(function () {
  'use strict';

  var _servers = [];

  var setServers = function (servers) {
    _servers = servers;
  };

  function ServersStoreConstants(ConstantsCreator) {
    return ConstantsCreator.create('ServersStoreConstants', {
      SET_SERVERS : null
    });
  }

  var CHANGE_EVENT = 'ServersStore.change';

  function ServersActions(Mutex, Servers, AsunoDispatcher, ServersStoreConstants, ConnectionError) {
    var mutex = Mutex.create();

    this.reloadServers = function () {
      if (!mutex.isLocked()) {
        mutex.lock();

        Servers
          .status(function (servers) {
            AsunoDispatcher.handleServerAction({
              actionType : ServersStoreConstants.SET_SERVERS,
              servers    : servers
            });
          })
          .$promise
          .catch((data) => {
            ConnectionError.setError(data);
            })
          .finally(function () {
            mutex.release();
          });
      }
    };
  }

  function ServersStore($rootScope, AsunoDispatcher, ServersActions, ServersStoreConstants, tickEvent) {

    var serversStoreInstance = angular.extend(new EventEmitter(), {

      getServers : function () {
        return _servers;
      },

      getServer : function (idx) {
        return _servers[idx];
      },

      addChangeListener : function (callback) {
        this.on(CHANGE_EVENT, callback);
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
        case ServersStoreConstants.SET_SERVERS:
          setServers(action.servers);
          serversStoreInstance.emitChange();
          break;

        default:
          return true;
      }

      return true;
    });

    ServersActions.reloadServers();

    $rootScope.$on(tickEvent, function () {
      ServersActions.reloadServers();
    });

    return serversStoreInstance;
  }

  angular.module('asuno.services').factory('ServersStoreConstants', ServersStoreConstants);
  angular.module('asuno.services').service('ServersActions', ServersActions);
  angular.module('asuno.services').factory('ServersStore', ServersStore);
})();

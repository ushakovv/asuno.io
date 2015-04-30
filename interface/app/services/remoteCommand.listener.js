(function () {
  'use strict';

  angular.module('asuno')
    .service('RemoteCommandListener', function RemoteCommandWatcher($http, $modal, RemoteCommandStore, RemoteCommandActions, Auth) {
      var _closed = true;
      var _listenerInstalled = false;

      function changeListener() {
        if (Auth.isDispatcher() && RemoteCommandStore.getPendingCount() > 0 && _closed) {
          _closed = false;

          var instance = $modal.open({
            templateUrl: '/assets/templates/modals/remote-command-modal.html',
            backdrop: 'static',
            keyboard: false
          });

          instance.result.finally(() => _closed = true);
        }
      }

      this.installListener = function () {
        if (!_listenerInstalled) {
          _listenerInstalled = true;

          var query;

          if (Auth.isDispatcher()) {
            query = $http.get('/api/sci/rdp/' + Auth.session().user.dispatcher.rdp.id);
          } else if (Auth.isSupervisor()) {
            query = $http.get('/api/sci/');
          }

          if (query) {
            RemoteCommandActions.clearCommands();

            query.then(function (response) {
              response.data.actions.forEach(function (command) {
                RemoteCommandActions.addCommand(command);
              });
            });
          }

          RemoteCommandStore.addChangeListener(changeListener);
        }
      };

      this.removeListener = function () {
        if (_listenerInstalled) {
          _listenerInstalled = false;
          RemoteCommandStore.removeChangeListener(changeListener);
        }
      };
    });
})();

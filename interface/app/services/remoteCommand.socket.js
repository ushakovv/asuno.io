(function () {
  'use strict';

  function RemoteCommandSocket($log, $sci, RemoteCommandActions, Auth) {

    var _listenerInstalled = false;

    function incomingAction(data) {
      var command = angular.fromJson(data);
      RemoteCommandActions.addCommand(command);
    }

    function cancelledAction(commandId) {
      RemoteCommandActions.cancelCommandFinished(parseInt(commandId, 10), 'Отмена диспетчером цдп');
    }

    function rejectedAction(commandId, comment) {
      RemoteCommandActions.rejectCommandFinished(parseInt(commandId, 10), comment);
    }

    function executedAction(commandId) {
      RemoteCommandActions.executeCommandFinished(parseInt(commandId, 10));
    }

    function error() {
      $log.error('socket_error', arguments);
    }

    function _initSocket() {

      if (Auth.isDispatcher()) {
        _listenerInstalled = true;
        $sci.socket.emit('join', 'rdps:' + Auth.session().user.dispatcher.rdp.id);
      } else if (Auth.isSupervisor()) {
        _listenerInstalled = true;
        $sci.socket.emit('join', 'rdps');
      }

      $sci.socket.on('incoming_action', incomingAction);
      $sci.socket.on('action_cancelled', cancelledAction);
      $sci.socket.on('action_rejected', rejectedAction);
      $sci.socket.on('action_executed', executedAction);
      $sci.socket.on('error', error);
    }

    this.installListener = function () {
      $log.debug(_listenerInstalled);
      if (!_listenerInstalled) {
        if ($sci.socket.socket.connected) {
          _initSocket();
        } else {
          $sci.socket.on('connect', _initSocket);
        }
      }
    };

    this.removeListener = function () {
      if (_listenerInstalled) {
        _listenerInstalled = false;
        if (Auth.isDispatcher()) {
          $sci.socket.emit('leave', 'sci:rdp:' + Auth.session().user.dispatcher.rdp.id);
        }
        $sci.socket.emit('leave', 'sci:rdps');
        $sci.socket.removeListener('incoming_action', incomingAction);
        $sci.socket.removeListener('action_cancelled', cancelledAction);
        $sci.socket.removeListener('action_rejected', rejectedAction);
        $sci.socket.removeListener('action_executed', executedAction);
        $sci.socket.removeListener('error', error);
      }
    };
  }

  angular.module('asuno.services').service('RemoteCommandSocket', RemoteCommandSocket);
})();

(function () {
  'use strict';

  var _commands = [];
  var _finishedCommands = [];

  var _log;

  function _filterRdp(commands, rdp) {
    if (!rdp) {
      return commands;
    }

    return _.filter(commands, function (command) {
      return command.getIn(['rdp', 'id']) === rdp;
    });
  }

  function RemoteCommand(command) {

    if (typeof command.parameters === 'string') {
      command.parameters = JSON.parse(command.parameters);
    }

    angular.extend(this, Immutable.fromJS(command));

    this.isFinished = function () {
      return this.get('state') !== 'waiting';
    };

    this.isExecuted = function () {
      return this.get('state') === 'executed';
    };

    this.isRejected = function () {
      return this.get('state') === 'rejected' || this.get('state') === 'error';
    };
  }

  RemoteCommand.prototype = Object.create(Immutable.Map.prototype);
  RemoteCommand.constructor = Immutable.Map;

  function addCommand(command) {
    if (command.isFinished()) {
      _finishedCommands.unshift(command);
    } else {
      _commands.unshift(command);
    }
  }

  function startPending(commandId, message) {
    var idx = _.findIndex(_commands, function (command) {
      return command.get('id') === commandId;
    });

    if (idx >= 0) {
      _commands[idx] = _commands[idx].merge({
        pending: true,
        message: message
      });
    }
  }

  function executeCommand(commandId) {
    var idx = _.findIndex(_commands, function (command) {
      return command.get('id') === commandId;
    });

    if (idx >= 0) {
      var finished = _commands[idx].merge({
        state: 'executed',
        pending: false
      });

      _commands.splice(idx, 1);
      _finishedCommands.unshift(finished);
    } else {
      _log.debug('executeCommand', commandId, 'not found');
    }
  }

  function rejectCommand(commandId, message) {
    var idx = _.findIndex(_commands, function (command) {
      return command.get('id') === commandId;
    });

    if (idx >= 0) {
      var finished = _commands[idx] = _commands[idx].merge({
        state: 'rejected',
        pending: false
      });
      if (!finished.get('message')) {
        finished = _commands[idx] = finished.set('message', message);
      }

      _commands.splice(idx, 1);
      _finishedCommands.unshift(finished);
    } else {
      _log.debug('rejectCommand', commandId, 'not found');
    }
  }

  function cancelCommand(commandId) {
    var idx = _.findIndex(_commands, function (command) {
      return command.get('id') === commandId;
    });

    if (idx >= 0) {
      var finished = _commands[idx] = _commands[idx].merge({
        state: 'rejected',
        pending: false
      });
      if (!finished.get('message')) {
        finished = _commands[idx] = finished.set('message', 'Отмена диспетчером цдп');
      }

      _commands.splice(idx, 1);
      _finishedCommands.unshift(finished);
    } else {
      _log.debug('rejectCommand', commandId, 'not found');
    }
  }

  function clearCommands() {
    _commands.length = 0;
    _finishedCommands.length = 0;
  }

  function RemoteCommandStoreConstants(ConstantsCreator) {
    return ConstantsCreator.create('RemoteCommandStoreConstants', {
      REMOTE_COMMAND_ADD: null,
      REMOTE_COMMAND_CLEAR: null,
      REMOTE_COMMAND_EXECUTE: null,
      REMOTE_COMMAND_EXECUTE_FINISHED: null,
      REMOTE_COMMAND_REJECT: null,
      REMOTE_COMMAND_REJECT_FINISHED: null,
      REMOTE_COMMAND_CANCEL: null,
      REMOTE_COMMAND_CANCEL_FINISHED: null,
      REMOTE_COMMAND_TIMEOUT: null
    });
  }

  var CHANGE_EVENT = 'RemoteCommandStore.change';

  function RemoteCommandStore(AsunoDispatcher, RemoteCommandStoreConstants) {
    var remoteCommandStore = angular.extend(new EventEmitter(), {

      /**
       * @param {boolean} showFinished
       * @param {integer|string} rdp
       * @returns {Array.<T>}
       */
      getCommands: function (showFinished, rdp) {
        var response = showFinished ? _commands.concat(_finishedCommands) : _commands;
        if (rdp) {
          return _filterRdp(response, rdp);
        } else {
          return response;
        }
      },

      getPendingCount: function (rdp) {
        return _filterRdp(_commands, rdp).length;
      },

      addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
      },

      removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
      },

      emitChange: function () {
        this.emit(CHANGE_EVENT);
      }
    });

    AsunoDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case RemoteCommandStoreConstants.REMOTE_COMMAND_ADD:
          addCommand(action.command);
          remoteCommandStore.emitChange();
          break;

        case RemoteCommandStoreConstants.REMOTE_COMMAND_CLEAR:
          clearCommands();
          remoteCommandStore.emitChange();
          break;

        case RemoteCommandStoreConstants.REMOTE_COMMAND_REJECT:
          startPending(action.commandId, action.message);
          remoteCommandStore.emitChange();
          break;

        case RemoteCommandStoreConstants.REMOTE_COMMAND_EXECUTE:
          startPending(action.commandId);
          remoteCommandStore.emitChange();
          break;

        case RemoteCommandStoreConstants.REMOTE_COMMAND_CANCEL:
          startPending(action.commandId);
          remoteCommandStore.emitChange();
          break;

        case RemoteCommandStoreConstants.REMOTE_COMMAND_EXECUTE_FINISHED:
          executeCommand(action.commandId);
          remoteCommandStore.emitChange();
          break;

        case RemoteCommandStoreConstants.REMOTE_COMMAND_REJECT_FINISHED:
          rejectCommand(action.commandId, action.message);
          remoteCommandStore.emitChange();
          break;

        case RemoteCommandStoreConstants.REMOTE_COMMAND_CANCEL_FINISHED:
          cancelCommand(action.commandId);
          remoteCommandStore.emitChange();
          break;

        default:
          return true;
      }
    });

    return remoteCommandStore;
  }

  function RemoteCommandCreator() {
    this.create = function (command) {
      return new RemoteCommand(command);
    };
  }

  function RemoteCommandActions($log, $sci, AsunoDispatcher, RemoteCommandCreator, RemoteCommandStoreConstants) {
    _log = $log;

    window.$sci = $sci;

    this.createCommand = function (command) {
      $sci.socket.emit('request_action', command);
    };

    this.addCommand = function (command) {
      command.id = parseInt(command.id, 10);
      $log.debug('new-command', command.id);

      AsunoDispatcher.handleViewAction({
        actionType: RemoteCommandStoreConstants.REMOTE_COMMAND_ADD,
        command: RemoteCommandCreator.create(command)
      });
    };

    this.clearCommands = function () {
      AsunoDispatcher.handleViewAction({
        actionType: RemoteCommandStoreConstants.REMOTE_COMMAND_CLEAR
      });
    };

    this.executeCommand = function (commandId) {
      $log.debug('executeCommand', commandId);
      AsunoDispatcher.handleViewAction({
        actionType: RemoteCommandStoreConstants.REMOTE_COMMAND_EXECUTE,
        commandId: commandId
      });

      $sci.socket.emit('execute_action', commandId);
    };

    this.executeCommandFinished = function (commandId) {
      AsunoDispatcher.handleViewAction({
        actionType: RemoteCommandStoreConstants.REMOTE_COMMAND_EXECUTE_FINISHED,
        commandId: commandId
      });
    };

    this.rejectCommand = function (commandId, message) {
      AsunoDispatcher.handleViewAction({
        actionType: RemoteCommandStoreConstants.REMOTE_COMMAND_REJECT,
        commandId: commandId,
        message: message
      });

      $sci.socket.emit('reject_action', commandId, message);
    };

    this.rejectCommandFinished = function (commandId, message) {
      AsunoDispatcher.handleViewAction({
        actionType: RemoteCommandStoreConstants.REMOTE_COMMAND_REJECT_FINISHED,
        commandId: commandId,
        message: message
      });
    };

    this.cancelCommand = function (commandId) {
      AsunoDispatcher.handleViewAction({
        actionType: RemoteCommandStoreConstants.REMOTE_COMMAND_CANCEL,
        commandId: commandId
      });

      $sci.socket.emit('cancel_action', commandId);
    };

    this.cancelCommandFinished = function (commandId) {
      AsunoDispatcher.handleViewAction({
        actionType: RemoteCommandStoreConstants.REMOTE_COMMAND_CANCEL_FINISHED,
        commandId: commandId
      });
    };
  }

  angular.module('asuno').factory('RemoteCommandStore', RemoteCommandStore);
  angular.module('asuno').factory('RemoteCommandStoreConstants', RemoteCommandStoreConstants);
  angular.module('asuno').service('RemoteCommandCreator', RemoteCommandCreator);
  angular.module('asuno').service('RemoteCommandActions', RemoteCommandActions);
})();

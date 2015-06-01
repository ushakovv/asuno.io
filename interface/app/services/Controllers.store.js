/**
 * Created by vasa on 17.08.14.
 */

(function () {
  'use strict';

  function ControllersStoreConstants(ConstantsCreator) {
    return ConstantsCreator.create('ControllersStoreConstants', {
      SET_CONTROLLERS: null,
      SET_FILTER_CONTROLLER: null,
      SET_SEARCH_CONTROLLER: null,
      SELECT_CONTROLLER: null,
      SELECT_CONTROLLERS: null,
      DESELECT_CONTROLLERS: null,
      DESELECT_CONTROLLER: null,
      SET_SHOW_AUTONOMOUS: null,
      CLEAR_CONTROLLERS: null
    });
  }

  function ControllersStore(Monitors, AsunoDispatcher, EmitEvents, ControllersStoreConstants, FILTER_CONFIGS) {

    var _search;
    var _key = 'all';
    var _controllers = [];
    var _selectedControllers = {};
    var _showAutonomous = false;

    function setControllers(controllers) {
      _controllers = controllers.slice();
    }

    function setFilter(key) {
      _key = key || 'all';
    }

    function setSearch(search) {
      _search = (search || '').toUpperCase();
    }

    function select(controllerId) {
      _selectedControllers[controllerId] = controllerId;
    }

    function deselect(controllerId) {
      delete _selectedControllers[controllerId];
    }

    function setShowAutonomous(showAutonomous) {
      _showAutonomous = !!showAutonomous;
    }

    function clear() {
      _controllers = [];
      _selectedControllers = {};
      _key = 'all';
      _search = void 0;
      _showAutonomous = false;
    }

    var controllersStoreInstance = angular.extend(new EventEmitter(), {
      getControllers: function () {
        var filterKey = FILTER_CONFIGS[_key];

        var controllers = _controllers;

        if (_search) {
          controllers = controllers
            .filter((ctrl) => ctrl.name.toUpperCase().includes(_search) || ctrl.address.toUpperCase().includes(_search));
        }

        if (_key !== 'all') {
          controllers = controllers
            .filter((ctrl) => ctrl[filterKey] || Monitors.isActive(ctrl.alarms[filterKey]));
        }

        if (!_showAutonomous) {
          controllers = controllers
            .filter((ctrl) => !ctrl.is_autonomous);
        }

        return controllers;
      },

      getControllersByType() {
        const controllers = this.getControllers();

        return _(controllers).groupBy('type').value();
      },

      getAllControllers: function () {
        return _controllers;
      },

      getSelectedControllers: function () {
        return _controllers
          .filter((ctrl) => _selectedControllers.hasOwnProperty(ctrl.id));
      },

      getSelectedControllerIds: function () {
        return Object.keys(_selectedControllers)
          .map((key) => parseInt(key, 10));
      },

      getFilterKey: function () {
        return _key;

      },

      getSearch: function () {
        return _search;
      },

      getShowAutonomous: function () {
        return _showAutonomous;
      },

      isControllerSelected: function (id) {
        return _selectedControllers.hasOwnProperty(id);
      }
    });

    AsunoDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case ControllersStoreConstants.SET_CONTROLLERS:
          setControllers(action.controllers);
          controllersStoreInstance.emit(EmitEvents.CONTROLLERS_CHANGE);
          break;

        case ControllersStoreConstants.SET_FILTER_CONTROLLER:
          setFilter(action.filter);
          controllersStoreInstance.emit(EmitEvents.CONTROLLERS_CHANGE);
          break;

        case ControllersStoreConstants.SET_SEARCH_CONTROLLER:
          setSearch(action.search);
          controllersStoreInstance.emit(EmitEvents.CONTROLLERS_CHANGE);
          break;

        case ControllersStoreConstants.SELECT_CONTROLLER:
          select(action.controllerId);
          controllersStoreInstance.emit(EmitEvents.CONTROLLER_SELECTION);
          break;

        case ControllersStoreConstants.SELECT_CONTROLLERS:
          _selectedControllers = {};
          action.controllerIds.forEach(select);
          controllersStoreInstance.emit(EmitEvents.CONTROLLER_SELECTION);
          break;

        case ControllersStoreConstants.DESELECT_CONTROLLER:
          deselect(action.controllerId);
          controllersStoreInstance.emit(EmitEvents.CONTROLLER_SELECTION);
          break;

        case ControllersStoreConstants.DESELECT_CONTROLLERS:
          action.controllerIds.forEach(deselect);
          controllersStoreInstance.emit(EmitEvents.CONTROLLER_SELECTION);
          break;

        case ControllersStoreConstants.CLEAR_CONTROLLERS:
          clear();
          controllersStoreInstance.emit(EmitEvents.CONTROLLERS_CLEAR);
          break;

        case ControllersStoreConstants.SET_SHOW_AUTONOMOUS:
          setShowAutonomous(action.showAutonomous);
          controllersStoreInstance.emit(EmitEvents.CONTROLLERS_CHANGE);
          break;

        default:
          return true;
      }

      return true;
    });

    return controllersStoreInstance;
  }

  function ControllersActions(AsunoDispatcher, ControllersStoreConstants) {
    this.setControllers = function (controllers) {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.SET_CONTROLLERS,
        controllers: controllers
      });
    };

    this.setControllersFilter = function (filter) {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.SET_FILTER_CONTROLLER,
        filter: filter
      });
    };

    this.setControllersSearch = function (search) {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.SET_SEARCH_CONTROLLER,
        search: search
      });
    };

    this.selectController = function (controllerId) {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.SELECT_CONTROLLER,
        controllerId: controllerId
      });
    };

    this.selectControllers = function (controllerIds) {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.SELECT_CONTROLLERS,
        controllerIds: controllerIds
      });
    };

    this.toggleControllerSelection = function (selected, controllerId) {
      AsunoDispatcher.handleViewAction({
        actionType: selected ? ControllersStoreConstants.SELECT_CONTROLLER : ControllersStoreConstants.DESELECT_CONTROLLER,
        controllerId: controllerId
      });
    };

    this.toggleControllersSelection = function (selected, controllerIds) {
      AsunoDispatcher.handleViewAction({
        actionType: selected ? ControllersStoreConstants.SELECT_CONTROLLERS : ControllersStoreConstants.DESELECT_CONTROLLERS,
        controllerIds: controllerIds
      });
    };

    this.deselectController = function (controllerId) {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.DESELECT_CONTROLLER,
        controllerId: controllerId
      });
    };

    this.deselectControllers = function (controllerIds) {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.DESELECT_CONTROLLERS,
        controllerIds: controllerIds
      });
    };

    this.clear = function () {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.CLEAR_CONTROLLERS
      });
    };

    this.toggleAutonomous = function (showAutonomous) {
      AsunoDispatcher.handleViewAction({
        actionType: ControllersStoreConstants.SET_SHOW_AUTONOMOUS,
        showAutonomous: showAutonomous
      });
    };
  }

  angular.module('asuno.services').factory('ControllersStoreConstants', ControllersStoreConstants);
  angular.module('asuno.services').factory('ControllersStore', ControllersStore);
  angular.module('asuno.services').service('ControllersActions', ControllersActions);
})();

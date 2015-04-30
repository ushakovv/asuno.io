/**
 * Created by vasa on 30.09.14.
 */

//jshint ignore:start
/* eslint-disable */

describe('ControllersStore Store', function () {
  var controllers = [
    {
      "address"         : "улица 1",
      "enabled"         : false,
      "disabled"        : true,
      "gis_id"          : null,
      "id"              : 123,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 12",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : true,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "проезд 1",
      "enabled"         : false,
      "disabled"        : true,
      "gis_id"          : null,
      "id"              : 124,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 13",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : true,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "площадь 1",
      "enabled"         : false,
      "disabled"        : true,
      "gis_id"          : null,
      "id"              : 125,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 14",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : true,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "переулок 1",
      "enabled"         : false,
      "disabled"        : true,
      "gis_id"          : null,
      "id"              : 126,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 15",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : true,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "проезд 2",
      "enabled"         : false,
      "disabled"        : true,
      "gis_id"          : null,
      "id"              : 127,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 16",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : true
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "спуск 1",
      "enabled"         : true,
      "night"           : true,
      "gis_id"          : null,
      "id"              : 128,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 17",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "шоссе 1",
      "enabled"         : true,
      "night"           : true,
      "gis_id"          : null,
      "id"              : 129,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : "1970-01-01T00:00:00+00:00",
      "name"            : "Контроллер 18",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    }
  ];

  beforeEach(module('asuno.services'));

  afterEach(inject(function (AsunoDispatcher, ControllersStoreConstants) {
    AsunoDispatcher.handleViewAction({
      actionType : ControllersStoreConstants.CLEAR_CONTROLLERS
    })
  }));

  it('should be instanceof EventEmitter', inject(function (ControllersStore) {
    expect(ControllersStore instanceof EventEmitter).toBe(true);
  }));

  it('should have no controllers by default', inject(function (ControllersStore) {
    expect(ControllersStore.getControllers()).toEqual([]);
    expect(ControllersStore.getAllControllers()).toEqual([]);
    expect(ControllersStore.getSelectedControllers()).toEqual([]);
  }));

  it('should have a new set of controllers if added', inject(function (AsunoDispatcher, ControllersStoreConstants, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    expect(ControllersStore.getAllControllers()).toEqual(controllers)
  }));

  it('should search controllers by name', inject(function (AsunoDispatcher, ControllersStoreConstants, EmitEvents, ControllersStore) {
    var callback = jasmine.createSpy('callback');

    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    ControllersStore.addListener(EmitEvents.CONTROLLERS_CHANGE, callback);

    for (var i = 0; i < controllers.length; i++) {
      var controller = controllers[i];
      AsunoDispatcher.handleViewAction({
        actionType : ControllersStoreConstants.SET_SEARCH_CONTROLLER,
        search     : controller.name.toUpperCase()
      });

      expect(ControllersStore.getControllers()).toEqual([controller]);
    }

    expect(callback.calls.length).toBe(controllers.length);
  }));

  it('should search controllers by address', inject(function (AsunoDispatcher, ControllersStoreConstants, EmitEvents, ControllersStore) {
    var callback = jasmine.createSpy('callback');

    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    ControllersStore.addListener(EmitEvents.CONTROLLERS_CHANGE, callback);

    for (var i = 0; i < controllers.length; i++) {
      var controller = controllers[i];
      AsunoDispatcher.handleViewAction({
        actionType : ControllersStoreConstants.SET_SEARCH_CONTROLLER,
        search     : controller.address.toUpperCase()
      });

      expect(ControllersStore.getControllers()).toEqual([controller]);
    }

    expect(callback.calls.length).toBe(controllers.length);
  }));

  it('should return current search', inject(function (AsunoDispatcher, ControllersStoreConstants, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    for (var i = 0; i < controllers.length; i++) {
      var controller = controllers[i];
      AsunoDispatcher.handleViewAction({
        actionType : ControllersStoreConstants.SET_SEARCH_CONTROLLER,
        search     : controller.name.toUpperCase()
      });

      expect(ControllersStore.getSearch()).toEqual(controller.name.toUpperCase());
    }
  }));

  it('should filter controllers by filter tag', inject(function (AsunoDispatcher, ControllersStoreConstants, EmitEvents, FILTER_CONFIGS, ControllersStore) {
    var callback = jasmine.createSpy('callback');

    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    ControllersStore.addListener(EmitEvents.CONTROLLERS_CHANGE, callback);

    for (var key in FILTER_CONFIGS) {
      if (FILTER_CONFIGS.hasOwnProperty(key)) {
        AsunoDispatcher.handleViewAction({
          actionType : ControllersStoreConstants.SET_FILTER_CONTROLLER,
          filter     : key
        });

        expect(ControllersStore.getControllers()).toEqual(controllers.filter(function (controller) {
          return controller[FILTER_CONFIGS[key]] || controller.status[FILTER_CONFIGS[key]]
        }))
      }
    }

    expect(callback.calls.length).toBe(Object.keys(FILTER_CONFIGS).length);
  }));

  it('should return current filter tag', inject(function (AsunoDispatcher, ControllersStoreConstants, EmitEvents, FILTER_CONFIGS, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    for (var key in FILTER_CONFIGS) {
      if (FILTER_CONFIGS.hasOwnProperty(key)) {
        AsunoDispatcher.handleViewAction({
          actionType : ControllersStoreConstants.SET_FILTER_CONTROLLER,
          filter     : key
        });

        expect(ControllersStore.getFilterKey()).toEqual(key);
      }
    }
  }));

  it('should filter controllers by search and filter tag', inject(function (AsunoDispatcher, ControllersStoreConstants, EmitEvents, FILTER_CONFIGS, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    for (var key in FILTER_CONFIGS) {
      if (FILTER_CONFIGS.hasOwnProperty(key)) {
        AsunoDispatcher.handleViewAction({
          actionType : ControllersStoreConstants.SET_FILTER_CONTROLLER,
          filter     : key
        });
        for (var i = 0; i < controllers.length; i++) {
          var controller = controllers[i];

          AsunoDispatcher.handleViewAction({
            actionType : ControllersStoreConstants.SET_SEARCH_CONTROLLER,
            search     : controller.name.toUpperCase()
          });


          expect(ControllersStore.getControllers()).toEqual(
              controller[FILTER_CONFIGS[key]] || controller.status[FILTER_CONFIGS[key]] ? [controller] : []
          );
        }
      }
    }
  }));

  it('should return one selected controller after selection', inject(function (AsunoDispatcher, ControllersStoreConstants, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    for (var i = 0; i < controllers.length; i++) {
      var controller = controllers[i];

      expect(ControllersStore.getSelectedControllers()).toEqual([]);

      AsunoDispatcher.handleViewAction({
        actionType   : ControllersStoreConstants.SELECT_CONTROLLER,
        controllerId : controller.id
      });

      expect(ControllersStore.getSelectedControllers()).toEqual([controller]);

      AsunoDispatcher.handleViewAction({
        actionType   : ControllersStoreConstants.DESELECT_CONTROLLER,
        controllerId : controller.id
      });

      expect(ControllersStore.getSelectedControllers()).toEqual([]);
    }
  }));

  it('should return several selected controllers after mass selection', inject(function (AsunoDispatcher, ControllersStoreConstants, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    for (var i = 2; i < controllers.length; i++) {
      var selectedControllers = _.chain(controllers)
        .shuffle()
        .sample(i)
        .value();

      var selectedIds = selectedControllers.map(function (c) {return c.id});

      var sameOrderControllers = controllers.filter(function (ctrl) {
        return selectedIds.indexOf(ctrl.id) >= 0;
      });

      expect(ControllersStore.getSelectedControllers()).toEqual([]);

      AsunoDispatcher.handleViewAction({
        actionType    : ControllersStoreConstants.SELECT_CONTROLLERS,
        controllerIds : selectedIds
      });

      expect(ControllersStore.getSelectedControllers()).toEqual(sameOrderControllers);

      AsunoDispatcher.handleViewAction({
        actionType    : ControllersStoreConstants.DESELECT_CONTROLLERS,
        controllerIds : selectedIds
      });

      expect(ControllersStore.getSelectedControllers()).toEqual([]);
    }
  }));

  it('should rightly check if controller is selected', inject(function (AsunoDispatcher, ControllersStoreConstants, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    for (var i = 0; i < controllers.length; i++) {
      var controller = controllers[i];

      expect(ControllersStore.getSelectedControllers()).toEqual([]);

      AsunoDispatcher.handleViewAction({
        actionType   : ControllersStoreConstants.SELECT_CONTROLLER,
        controllerId : controller.id
      });

      expect(ControllersStore.isControllerSelected(controller.id)).toBe(true);

      AsunoDispatcher.handleViewAction({
        actionType   : ControllersStoreConstants.DESELECT_CONTROLLER,
        controllerId : controller.id
      });
    }
  }));

  it('should set empty search (return all controllers) if falsy value is passed', inject(function (AsunoDispatcher, ControllersStoreConstants, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    AsunoDispatcher.handleViewAction({
      actionType : ControllersStoreConstants.SET_SEARCH_CONTROLLER
    });

    expect(ControllersStore.getControllers()).toEqual(controllers);

    AsunoDispatcher.handleViewAction({
      actionType : ControllersStoreConstants.SET_SEARCH_CONTROLLER,
      search     : null
    });

    expect(ControllersStore.getControllers()).toEqual(controllers);

    AsunoDispatcher.handleViewAction({
      actionType : ControllersStoreConstants.SET_SEARCH_CONTROLLER,
      search     : ''
    });

    expect(ControllersStore.getControllers()).toEqual(controllers);
  }));

  it('should set "all" filter (return all controllers) if falsy value is passed', inject(function (AsunoDispatcher, ControllersStoreConstants, ControllersStore) {
    AsunoDispatcher.handleViewAction({
      actionType  : ControllersStoreConstants.SET_CONTROLLERS,
      controllers : controllers
    });

    AsunoDispatcher.handleViewAction({
      actionType : ControllersStoreConstants.SET_FILTER_CONTROLLER
    });

    expect(ControllersStore.getControllers()).toEqual(controllers);

    AsunoDispatcher.handleViewAction({
      actionType : ControllersStoreConstants.SET_FILTER_CONTROLLER,
      filter     : null
    });

    expect(ControllersStore.getControllers()).toEqual(controllers);

    AsunoDispatcher.handleViewAction({
      actionType : ControllersStoreConstants.SET_FILTER_CONTROLLER,
      filter     : ''
    });

    expect(ControllersStore.getControllers()).toEqual(controllers);
  }));
});

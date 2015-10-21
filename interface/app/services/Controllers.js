/**
 * Created by vasa on 25.03.14.
 */

(function () {
  'use strict';

  function Controllers(resource, ControllerFactory) {
    return resource('/api/controllers/:controller', {}, {
        query          : {
          method            : 'GET', url : '/api/controllers', isArray : true,
          transformResponse : function (data) {
            return (angular.fromJson(data).controllers || [])
              .map((controller) => ControllerFactory.createController(controller));
          }
        },
        all_cables : {
            method : 'GET',
            url : '/api/controllers/all_cables'
        },
        available_cables : {
            method : 'GET',
            url : '/api/controllers/:id/directions/available_cables'
        },
        get            : {
          method : 'GET', transformResponse : function (data) {
            var controller = angular.fromJson(data).controller;
            return ControllerFactory.createController(controller);
          }
        },
        poll           : {method : 'POST', url : '/api/controllers/:controller/poll'},
        sensors_poll   : {method : 'POST', url : '/api/controllers/:controller/sensors/poll'},
        save           : {method : 'POST', url : '/api/rdp/:rdp/controllers'},
        change         : {method : 'POST', url : '/api/controllers/:controller/command'},
        toggle   : {method : 'POST', url : '/api/controllers/:id/toggle_check'},
        patch          : {method : 'PATCH', url : '/api/controllers/:id'},
        maintenance    : {method : 'POST', url : '/api/controllers/:controller/maintenance'},
        maintenance_delete    : {method : 'DELETE', url : '/api/controllers/:controller/maintenance'},

        remove_parent         : {method : 'POST', url : '/api/controllers/:id/remove_parent'},
        add_child             : {method : 'POST', url : '/api/controllers/:parent_id/add_child/:child_id'},
        controllers_search    : {method : 'GET', url : '/api/controllers_search'},// ?query=:query

        direction_edit : {method : 'PATCH', url : '/api/direction/:id'},

        add_camera     : {method : 'POST', url : '/api/controllers/:id/camras'},
        add_sensore    : {method : 'POST', url : '/api/controllers/:id/sensors/add'},
        delete_sensore : {method : 'DELETE', url : '/api/controllers/:id/sensors/delete'},
        max_allowed_power : {method : 'GET', url : '/api/controllers/:id/max_allowed_power'},
        avg_power : {method : 'GET', url : '/api/controllers/:id/avg_power'}

    });
  }

  function Scheme(resource) {
    return resource('', {}, {
      add_contactor           : {method : 'POST', url : '/api/controllers/:id/contactors'},
      delete_contactor        : {method : 'DELETE', url : '/api/controllers/:id/contactors/:contactor_id'},
      delete_direction        : {method : 'DELETE', url : '/api/controllers/:id/directions/:number'},
      direction_unlink_cable : {method : 'POST', url : '/api/controllers/:id/direction/:direction_id/unlink_cable'},
      direction_link_cable : {method : 'POST', url : '/api/controllers/:id/direction/:direction_id/link_with_cable'},
      add_direction           : {method : 'POST', url : '/api/controllers/:id/directions'},
      set_direction_contactor : {method : 'POST', url : '/api/controllers/:id/direction/:direction_id/link'}
    });
  }

  angular.module('asuno.services').service('Controllers', Controllers);
  angular.module('asuno.services').service('Scheme', Scheme);
})();

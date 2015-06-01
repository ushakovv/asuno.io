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
        patch          : {method : 'PATCH', url : '/api/controllers/:id'},
        maintenance    : {method : 'POST', url : '/api/controllers/:controller/maintenance'},
        direction_edit : {method : 'PATCH', url : '/api/direction/:id'},
        add_camera     : {method : 'POST', url : '/api/controllers/:id/cameras'}
      }
    );
  }

  function Scheme(resource) {
    return resource('', {}, {
      add_contactor           : {method : 'POST', url : '/api/controllers/:id/contactors'},
      delete_contactor        : {method : 'DELETE', url : '/api/controllers/:id/contactors/:contactor_id'},
      delete_direction        : {method : 'DELETE', url : '/api/controllers/:id/directions/:number'},
      add_direction           : {method : 'POST', url : '/api/controllers/:id/directions'},
      set_direction_contactor : {method : 'POST', url : '/api/controllers/:id/direction/:direction_id/link'}
    });
  }

  angular.module('asuno.services').service('Controllers', Controllers);
  angular.module('asuno.services').service('Scheme', Scheme);
})();

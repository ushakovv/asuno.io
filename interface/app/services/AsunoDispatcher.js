/**
 * Created by vasa on 06.09.14.
 */

(function () {
  'use strict';

  var Dispatcher = Flux.Dispatcher;

  function AsunoDispatcher() {
    return angular.extend(new Dispatcher(), {

      handleViewAction : function (action) {
        this.dispatch({
          source : 'VIEW_ACTION',
          action : action
        });
      },

      handleServerAction : function (action) {
        this.dispatch({
          source : 'SERVER_ACTION',
          action : action
        });
      }
    });
  }

  angular.module('asuno.services').factory('AsunoDispatcher', AsunoDispatcher);
})();

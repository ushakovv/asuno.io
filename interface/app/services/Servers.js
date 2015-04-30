/**
 * Created by vasa on 01.09.14.
 */

(function () {
  'use strict';

  function Servers(resource, ClockStore) {
    return resource('/api/servers', {}, {
      status : {
        method : 'GET', isArray : true, transformResponse : function (data) {
          return _((angular.fromJson(data) || {}).servers)
            .map(function (server) {
              server.monitors = server.monitors.filter(function (point) {
                return !point.name.includes('OPC-клиент сервера освещения (CO)') &&
                       !point.name.includes('Связь ') &&
                       !point.name.includes('OPC-клиент датчика освещения №2') &&
                       !point.name.includes('DBProxy');
              });
              return server;
            })
            .map(function(server) {
              if (server.address) {
                return server;
              }

              server.monitors = server.monitors.map(function(point) {
                point.online = point.online || Math.abs(ClockStore.adjustTime(point.last_response) - ClockStore.getTime()) < 600000;
                return point;
              });
              return server;
            })
            .value();
        }
      }
    });
  }

  angular.module('asuno').service('Servers', Servers);
})();

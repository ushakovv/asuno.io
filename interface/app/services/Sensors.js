/**
 * Created by vasa on 07.10.14.
 */

(function () {
  'use strict';

  function Sensors(resource, $http) {
    var service = resource('/api/sensors', {}, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: (data) => angular.fromJson(data).sensors || []
      }
    });

    function recursiveHistory(sid, after, items, checkCallback, start_id) {
      var url = '/api/sensors/data',
        config = {
          params: {
            sid, start_id, after: new Date(after)
          }
        };

      return $http.get(url, config)
        .then(function (response) {
          response.data.data.forEach(function (item) {
            item.timestamp = new Date(item.timestamp);
            items.push(item);
          });
          if (typeof checkCallback === 'function' && checkCallback(response)) {
            return items;
          } else if (response.data.data.length === 0 || response.data.data.length < 100) {
            return items;
          } else {
            return recursiveHistory(sid, response.data.last_date, items, checkCallback, response.data.last_id);
          }
        });
    }

    service.history = function (id, after, checkCallback) {
      var items = [];

      return recursiveHistory(id, after, items, checkCallback);
    };

    return service;
  }

  angular.module('asuno.services').service('Sensors', Sensors);
})();

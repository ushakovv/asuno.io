(function () {
  'use strict';

  function Monitors($http) {
    function recursiveMonitors(sid, after, items, checkCallback, start_id) {
      var url = '/api/monitors/data',
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
            return recursiveMonitors(sid, response.data.last_date, items, checkCallback, response.data.last_id);
          }
        });
    }

    this.history = function (sid, after, checkCallback) {
      var items = [];

      return recursiveMonitors(sid, after, items, checkCallback);
    };

    this.isActive = function (monitors) {
      return _.any(monitors, (monitor) => monitor.payload === 'emergency');
    };

    this.isAfterKvit = function (monitors) {
      return _.any(monitors, (monitor) => monitor.payload === 'emergency' && !monitor.silent);
    };

    this.lastAction = function (monitors) {
      var last = _(monitors)
        .filter((m) => m.payload === 'emergency')
        .map((m) => new Date(m.last_reading_timestamp).getTime())
        .max();

      return last === -Infinity ? void 0 : last;
    };
  }

  angular.module('asuno.services').service('Monitors', Monitors);
})();

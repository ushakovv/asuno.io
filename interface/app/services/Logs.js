(function () {
  'use strict';

  function Logs(resource) {
    return resource('', {}, {
      user_actions    : {url : '/api/logs/internal/users/actions'},
      control_actions : {url : '/api/logs/internal/commands'},
      external_api    : {url : '/api/logs/external/api'}
    });
  }

  angular.module('asuno.services').service('Logs', Logs);
})();

(function() {
  'use strict';

  function ResourceProvider() {

    var self = this;

    this.makeResponseTransformer = function(_transformer) {
      return function(data, headers, status, fns) {
        if (status >= 400) {
          return data;
        } else {
          return _transformer(data, headers, status, fns);
        }
      };
    };

    this.$get = function ($resource) {
      return function(url, paramDefaults, _actions, options) {
        var actions = {};

        _(_actions).forEach(function(action, key) {
          if (typeof action.transformResponse === 'function') {
            action.transformResponse = self.makeResponseTransformer(action.transformResponse);
          }
          actions[key] = action;
        })
        .value();

        return $resource(url, paramDefaults, actions, options);
      };
    };

  }

  angular.module('asuno.services').provider('resource', ResourceProvider);
})();

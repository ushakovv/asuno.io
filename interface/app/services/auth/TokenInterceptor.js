/**
 * Created by vasa on 08.10.14.
 */

(function () {
  'use strict';

  function _isTokenError(response) {
    return !response.config.url.includes('/token/refresh') &&
      (response.status === 401 || response.status === 400 && angular.fromJson(response.data).status === 'Invalid JWT');
  }

  function TokenInterceptorProvider() {

    var self = this;

    this.TOKEN_HEADER = 'Authorization';
    this.HEADER_PREFIX = 'Bearer';

    this.$get = function ($q, $injector, store, asunoSessionCookie) {
      return {
        request: function (config) {
          var session = store.get(asunoSessionCookie);
          if (session) {
            config.headers[self.TOKEN_HEADER] = `${self.HEADER_PREFIX} ${session.access_token}`;
          }
          return config || $q.when(config);
        },
        responseError: function (response) {
          var $http = $injector.get('$http'),
            Auth = $injector.get('Auth');

          if (_isTokenError(response)) {
            return Auth.refresh().then(() => $http(response.config));
          } else {
            return $q.reject(response);
          }
        }
      };
    };
  }

  angular.module('asuno.services').provider('TokenInterceptor', TokenInterceptorProvider);
})();

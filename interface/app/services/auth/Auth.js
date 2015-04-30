/**
 * Created by vasa on 04.04.14.
 */

(function () {
  'use strict';

  function Auth($rootScope, $q, $http, $log, store, asunoSessionCookie) {

    var self = this;

    var _session;

    var _saveSession = function (session) {
      store.set(asunoSessionCookie, session);
      _session = session;
    };

    this.session = function () {
      _session = _session || store.get(asunoSessionCookie);
      return _session;
    };

    this.isLoggedIn = function () {
      return !!(store.get(asunoSessionCookie) && store.get(asunoSessionCookie).user);
    };

    this.login = function (username, password) {
      store.remove(asunoSessionCookie);

      return $http.post('/api/auth', {username : username, password : password})
        .then(function (response) {
          _saveSession(response.data);
          return response.data;
        })
        .then(function () {
          return $http.get('/api/users/me');
        })
        .then(function (response) {
          response.data.user.roles = response.data.user.roles.map(function (role) {
            return role.slug;
          });

          return response.data.user;
        })
        .then(function (user) {
          var data = store.get(asunoSessionCookie);
          data.user = user;
          _saveSession(data);

          $rootScope.$broadcast('logged-in');

          return data;
        });
    };

    this.isAdmin = function () {
      return this.isLoggedIn() && this.session().user.roles.indexOf('admin') >= 0;
    };

    this.isDispatcher = function () {
      return this.isLoggedIn() && this.session().user.roles.indexOf('dispatcher') >= 0;
    };

    this.isSupervisor = function () {
      return this.isLoggedIn() && this.session().user.roles.indexOf('supervisor') >= 0;
    };

    this.hasControl = function () {
      return this.isLoggedIn() && this.session().user.roles.indexOf('manager') === -1;
    };

    this.refresh = function () {
      var data = self.session();

      if (!data) {
        self.logout();
        return $q.reject('no userData');
      }

      return $http.post(`/api/users/${encodeURIComponent(data.user_id)}/token/refresh`, {refresh_token : data.refresh_token})
        .then(function (response) {
          data = self.session();
          data.access_token = response.data.access_token;
          if (response.data.refresh_token) {
            data.refresh_token = response.data.refresh_token;
          }
          _saveSession(data);
        })
        .catch(function (reason) {
          self.logout();
          throw reason;
        });
    };

    this.logout = function () {
      $rootScope.$broadcast('logged-out');

      store.remove(asunoSessionCookie);
      _session = void 0;
    };
  }

  angular.module('asuno.services').service('Auth', Auth);
})();

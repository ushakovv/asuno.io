(function () {
  'use strict';

  function $sci($rootScope, $q, Auth) {
    this.socket = void 0;

    this.connect = function () {
      this.socket = io.connect('http://81.88.217.69/sci', {
        query: `authorization=${Auth.session().access_token}`,
        'force new connection': true
      });
      return this.socket;
    };
  }

  angular.module('asuno.services').service('$sci', $sci);
})();

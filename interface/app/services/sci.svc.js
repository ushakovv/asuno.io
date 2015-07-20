(function () {
  'use strict';
//function $sci($rootScope, $q, Auth) {
  function $sci() {
    this.socket = void 0;

    this.connect = function () {
      //this.socket = io.connect('http://81.88.217.69/sci', {
      //  query: `authorization=${Auth.session().access_token}`,
      //  'force new connection': true
      //});
      this.createFake();
      return this.socket;
    };

    this.createFake = function () {
      this.socket = {
        on: () => false,
        emit: () => false,
        removeListener: () => false,
        connected: false
      };
    };
  }

  angular.module('asuno.services').service('$sci', $sci);
})();

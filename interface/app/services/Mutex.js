(function () {
  'use strict';

  function MutexInstance() {
    var _locked = false;

    this.lock = function () {
      _locked = true;
    };

    this.release = function () {
      _locked = false;
    };

    this.isLocked = function () {
      return _locked;
    };
  }

  function Mutex() {
    this.create = function () {
      return new MutexInstance();
    };
  }

  angular.module('asuno.services').service('Mutex', Mutex);
})();

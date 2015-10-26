(function () {
  'use strict';
  const _MESSAGE_ERROR = 'Потеряно соединение с сервером. Пожалуйста, проверьте соединение и перезагрузите страницу.';
  let _error;
  let _errorData;
  function ConnectionError() {
    this.MESSAGE_ERROR = _MESSAGE_ERROR;

    this.isError = function() {
      return _error;
    };

    this.getErrorData = function() {
      return _errorData;
    };
    this.setError = function (request) {
      _errorData = request;
      _error = _error || request && request.hasOwnProperty('status') && (request.status >= 500 || request.status === 0);
    };
    this.errorOff = function () {
      _error = false;
    };
  }

  angular.module('asuno.services').service('ConnectionError', ConnectionError);
})();

(function () {
  'use strict';
  const _MESSAGE_ERROR = 'Потеряно соединение с сервером. Пожалуйста, проверьте соединение и перезагрузите страницу.';
  let _error;
  let _errorData;
  let _errorCode = 0;

  function ConnectionError() {
    this.MESSAGE_ERROR = _MESSAGE_ERROR;

    this.isError = function() {
      return _error;
    };

    this.getErrorNumber = function() {
      return _errorCode;
    };

    this.getErrorData = function() {
      return _errorData;
    };
    this.setError = function (request) {
      this.MESSAGE_ERROR = 'Потеряно соединение с сервером. Пожалуйста, проверьте соединение и перезагрузите страницу.';
      _errorData = request;
      _errorCode = request.status;
      _error = _error || request && request.hasOwnProperty('status') && (request.status >= 500 || request.status === 0);
    };
    this.setErrorRDP = function (request) {
      this.MESSAGE_ERROR = 'Потеряно соединение с РДП ' + request.rdp + '. Данные на экране могут быть неактуальны.';
      _errorData = request;
      _errorCode = request.status + request.rdp;
      _error = _error || request && request.hasOwnProperty('status') && (request.status >= 500 || request.status === 0);
    };
    this.errorOff = function () {
      _error = false;
      _errorCode = 0;
    };
  }

  angular.module('asuno.services').service('ConnectionError', ConnectionError);
})();

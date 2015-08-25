(function () {
  'use strict';

  function socketIo($rootScope, $location) {
    var socket = io.connect($location.host());
    socket.on('connect', () => {
      socket.emit('connect');
    });

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }

  angular.module('asuno.services').factory('socketIo', socketIo);
})();

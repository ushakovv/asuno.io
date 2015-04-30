/**
 * Created by vasa on 07.10.14.
 */

(function () {
  'use strict';

  function Modernizr() {

    this.canPlayVideo = function () {
      return !!document.createElement('video').canPlayType;
    };

    this.supportsVideoFormat = function (format) {
      if (this.canPlayVideo()) {
        return false;
      }
      var v = document.createElement('video');
      return v.canPlayType(format);
    };

  }

  angular.module('asuno.services').service('Modernizr', Modernizr);

})();

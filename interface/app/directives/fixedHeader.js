/**
 * Created by vasa on 01.09.14.
 */

(function () {
  'use strict';

  function fixedHeader($interval) {
    return {
      link : function (scope, element) {
        var $el = $(element);

        var whenVisible = function () {
          $el.height($(window).height() - $el.offset().top - 15)
            .find('table').fixedHeaderTable();
        };

        var interval = $interval(function () {
          if ($el.is(':visible')) {
            $interval.cancel(interval);
            whenVisible();
          }
        }, 500);
      }
    };
  }

  angular.module('asuno').directive('fixedHeader', fixedHeader);
})();

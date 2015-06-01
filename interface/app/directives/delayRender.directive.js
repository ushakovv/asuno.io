(function() {
  'use strict';

  function delayRender($timeout) {
    return {
      transclude: true,
      link: function ($scope, $element, $attr, ctrl, $transclude) {
        function render() {
          $transclude((clone) => {
            $element.replaceWith(clone);
          });
        }

        if ($attr.delay) {
          $timeout(render, $attr.delay);
        } else {
          render();
        }
      }
    };
  }

  angular.module('asuno').directive('delayRender', delayRender);
})();

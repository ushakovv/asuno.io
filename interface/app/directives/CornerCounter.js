/**
 * Created by vasa on 26.06.14.
 */

(function () {
  'use strict';

  function CornerCounter() {
    return {
      replace  : true,
      template : `<div class="corner-counter" ng-class="{'corner-counter--active': value > 0, 'corner-counter--nokvit': value > compareValue}">
                    <img ng-src="{{src}}"/><span class="inlay" ng-if="value > 0">{{value}}</span>
                  </div>`,
      scope    : {
        src          : '@cornerCounter',
        value        : '@ccValue',
        compareValue : '@ccCompare'
      }
    };
  }

  angular.module('asuno').directive('cornerCounter', CornerCounter);
})();

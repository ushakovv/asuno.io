/**
 * Created by vasa on 06.09.14.
 */

(function () {
  'use strict';

  function controllerZoom(CondenseStore, CondenseActions) {
    return {
      replace  : true,
      template : `<div>
                    <div class="btn-group">
                      <label class="btn btn-default" ng-model="condenseModel" btn-radio="false" uncheckable ng-disabled="!condenseModel">
                        <span class="fa fa-search-plus"></span>
                      </label>
                      <label class="btn btn-default" ng-model="condenseModel" btn-radio="true" uncheckable ng-disabled="condenseModel">
                        <span class="fa fa-search-minus"></span>
                      </label>
                    </div>
                  </div>`,
      link     : function (scope) {
        scope.condenseModel = CondenseStore.isCondensed();

        scope.$watch('condenseModel', function (next, prev) {
          if (next !== prev) {
            CondenseActions.toggle(next);
          }
        });
      }
    };
  }

  angular.module('asuno').directive('controllerZoom', controllerZoom);
})();

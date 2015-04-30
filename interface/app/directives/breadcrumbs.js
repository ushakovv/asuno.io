/**
 * Created by vasa on 10.08.14.
 */

(function () {
  'use strict';

  function breadcrumbs() {
    return {
      replace     : true,
      templateUrl : '/assets/templates/breadcrumbs.html',
      scope       : {
        crumbs : '=breadcrumbs'
      }
    };
  }

  angular.module('asuno').directive('breadcrumbs', breadcrumbs);
})();

/**
 * Created by vasa on 07.07.14.
 */

(function () {
  'use strict';

  function rdpBlock() {
    return {
      templateUrl : '/assets/templates/rdp-block.html',
      replace     : true,
      scope       : {
        rdp       : '=rdpBlock',
        selectRdp : '=onSelect'
      }
    };
  }

  angular.module('asuno').directive('rdpBlock', rdpBlock);
})();

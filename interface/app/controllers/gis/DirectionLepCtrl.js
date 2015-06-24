/**
 * Created by rus on 23.06.15.
 */
/**
 * Created by vasa on 18.08.14.
 */

(function () {
    'use strict';

    function DirectionLepCtrl($scope, $modal, $log, $rootScope) {
        var dirLep = this;
        dirLep.directionId = null;
        dirLep.showLep = function (directionId) {
            const $child = $scope.$new();
            $rootScope.setDirectionId(directionId);
            $modal.open({
                templateUrl : '/assets/templates/modals/direction-lep-modal.html',
                scope : $child
            });
        };
        dirLep.linkDirection = function(cabelId, closeModal) {
            $rootScope.linkDirection( cabelId, closeModal );
        };
        dirLep.toggleDirectionLink = function(cabelId, directionId) {

            if ( cabelId ) {
                $rootScope.unlinkDirection( directionId );
            } else {
                dirLep.showLep(directionId );
            }
        };
    }

    angular.module('asuno').controller('DirectionLepCtrl', DirectionLepCtrl);
})();

/**
 * Created by rus on 23.06.15.
 */
/**
 * Created by vasa on 18.08.14.
 */

(function () {
    'use strict';

    function DirectionLepCtrl($scope, $modal, $rootScope) {
        var dirLep = this;
        dirLep.directionId = null;
        dirLep.showLep = function (directionId) {
            const $child = $scope.$new();
            $rootScope.setDirectionId(directionId);
            $modal.open({
                templateUrl : '/assets/templates/modals/direction-lep-modal.html',
                scope : $child,
                controller: function ($rootScope, $scope, $timeout, Controllers) {
                    let cable_ids = [];
                    function loadFilterCabels() {
                        Controllers.available_cables({id : $scope.controller.id}, (data) => cable_ids = data.cable_ids);
                    }

                    loadFilterCabels();

                    $scope.modalLepFilter = function (attributes) {
                        return cable_ids.indexOf(attributes.CABEL_ID) > -1;
                    };
                }
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
